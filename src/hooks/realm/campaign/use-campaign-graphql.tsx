import { BSON } from "realm-web";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";

import {
  getClientIndex,
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  replaceValueAtIndex,
} from "src/utils/realm";

import atlasConfig from "src/atlasConfig.json";

import { ICampaignUser } from "src/types/user_realm";
import { ICheckin, ICampaign } from "src/types/realm/realm-types";
import { ICampaignHook, ICampaignChange, IGraphqlResponse, IGraphqlCheckinResponse, IGraphqlCampaignUserResponse } from "src/types/campaign";

import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { useCustomApolloClient } from "../use-apollo-client";

const { dataSourceName } = atlasConfig;


export function useCampaigns(lazy = false): ICampaignHook {
  const graphql = useCustomApolloClient();
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lazy) {
      const query = gql`
      query FetchUserCampaigns {
        UserCampaigns {
          _id
          access_code
          description
          client_id
          users
          products
          project_id
          routes {
           _id
           routeNumber
           routeAddress {
            _id
            fullAddress
            location {
              type
              coordinates
            }
            phoneNumber
            road
           }
          }
          salesKpi {
            totalDailyUnits
            totalDailyRevenue
          }
          title
          createdAt
          startDate
          endDate
          workingSchedule
          checkInTime
          checkOutTime
          hourlyRate
          inactivityTimeout
          today_checkin
          total_checkin
          type
        }
      }
    `;
      graphql.query<IGraphqlResponse>({ query }).then(({ data }) => {
        console.log(data, 'DATA')
        setCampaigns(data.UserCampaigns);
        setLoading(false);
      });
    }
  }, [graphql, lazy]);

  const campaignHidukaCollection = useCollection({
    cluster: dataSourceName,
    db: "hiduka",
    collection: "campaigns",
  });

  useWatch(campaignHidukaCollection, {
    onInsert: (change: ICampaignChange) => {
      setCampaigns((oldCampaign) => {
        if (loading) {
          return oldCampaign;
        }
        const idx = getClientIndex(oldCampaign, change.fullDocument) ?? oldCampaign.length;
        return idx === oldCampaign.length
          ? addValueAtIndex(oldCampaign, idx, change.fullDocument)
          : oldCampaign;
      });
    },
    onUpdate: (change: ICampaignChange) => {
      setCampaigns((oldCampaign) => {
        if (loading) {
          return oldCampaign;
        }
        const idx = getClientIndex(oldCampaign, change.fullDocument);
        if (!idx) {
          return oldCampaign;
        }
        return updateValueAtIndex(oldCampaign, idx, () => change.fullDocument);
      });
    },
    onReplace: (change: ICampaignChange) => {
      setCampaigns((oldCampaign) => {
        if (loading) {
          return oldCampaign;
        }
        const idx = getClientIndex(oldCampaign, change.fullDocument);
        if (!idx) {
          return oldCampaign;
        }
        return replaceValueAtIndex(oldCampaign, idx, change.fullDocument);
      });
    },
    onDelete: (change: { documentKey?: { _id: BSON.ObjectId } }) => {
      setCampaigns((oldCampaign) => {
        if (loading) {
          return oldCampaign;
        }
        if (!change.documentKey) {
          return oldCampaign;
        }
        const idx = getClientIndex(oldCampaign, { _id: change.documentKey._id });
        if (!idx) {
          return oldCampaign;
        }
        return idx >= 0 ? removeValueAtIndex(oldCampaign, idx) : oldCampaign;
      });
    },
  });

  const saveCampaign = async (draftCampaign: ICampaign) => {
    // draftCampaign.creator_id = realmApp.currentUser?.id as string;
    const dt = new Date();
    const cpCampaign: Omit<ICampaign, "_id"> = {
      ...draftCampaign,
      createdAt: dt,
      updatedAt: dt
    }
    try {
      await graphql.mutate({
        mutation: gql`
            mutation SaveCampaign($campaign: CampaignInsertInput!) {
              insertOneCampaign(data: $campaign) {
                _id
                title
              }
            }
          `,
        variables: { campaign: cpCampaign },
      });
    } catch (err) {
      if (err.message.match(/^Duplicate key error/)) {
        console.warn(
          `The following error means that this app tried to insert a campaign multiple times (i.e. an existing campaign has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
        );
      }
      console.error(err);
      throw err;
    }
  };
  const updateCampaign = async (campaign: ICampaign) => {
    console.log(campaign, "CAMPAIGN")
    await graphql.mutate({
      mutation: gql`
        mutation UpdateCampaign($id: ObjectId!, $campaignUpdateInput: CampaignUpdateInput!) {
          updateOneCampaign(query: { _id: $id }, set: $campaignUpdateInput) {
              _id
              access_code
              client_id
              products
              project_id
              routes {
                _id
                routeNumber
                routeAddress {
                _id
                fullAddress
                location {
                  type
                  coordinates
                }
                phoneNumber
                road
                }
              }
              workingSchedule
              title
              createdAt
              today_checkin
              total_checkin
              type
            }
        }
      `,
      variables: {
        id: campaign._id,
        campaignUpdateInput: { ...campaign }
      },
    });
  };
  const getCampaignUsers = async (id: string): Promise<ICampaignUser[]> => {
    try {
      if (!id) {
        throw new Error("Client errors");
      }
      const resp = await graphql.query<IGraphqlCampaignUserResponse>({
        query: gql`
          query FetchCampaignUsers($id: String!) {
            CampaignUsers(input: $id) {
              _id
              email
              isPublic
              displayName
              firstname
              lastname
              city
              state
              about
              country
              address
              zipCode
              role
              phoneNumber
              photoURL
              isVerified
              isRegistered
              company
              status
              createdAt
              updatedAt
              isCheckedIn
              checkInCount
              totalSessionCount
              totalEarnings
              totalHoursWorked
            }
          }
        `,
        variables: {
          id
        },
      });
      return resp.data.CampaignUsers;
    } catch (error) {
      console.error(error, "REPORT FETCH ERROR");
      throw new Error("Failed to get client products");
    }
  };

  const getCampaignUserCheckins = async (campaignId: string, startDate: string, endDate: string, userId?: string): Promise<ICheckin[]> => {
    try {
      let query;
      if (userId) {
        query = gql`
        query FetchUserCampaigndCheckins($campaignId: String!, $startDate: String!, $endDate: String!, $userId: String) {
          UserCampaignCheckins(input: {campaign_id: $campaignId, startDate: $startDate, endDate: $endDate, user_id: $userId }) {
            _id
            user_id
            campaign_id
            checkin
            lastActivity
            sessions {
              _id
              start_time
              end_time
              location {
                coordinates
              }
            }
            checkout
          }
        }
      `;

        const response = await graphql.query<IGraphqlCheckinResponse>({
          query,
          variables: {
            campaignId,
            startDate,
            endDate,
            userId,
          },
        });

        if (response && response.data && response.data.UserCampaignCheckins) {
          return response.data.UserCampaignCheckins;
        } 
          throw new Error("Failed to fetch campaign user checkins");
        
      } else {
        query = gql`
        query FetchUserCampaigndCheckins($campaignId: String!, $startDate: String!, $endDate: String!) {
          UserCampaignCheckins(input: {campaign_id: $campaignId, startDate: $startDate, endDate: $endDate }) {
            _id
            user_id
            campaign_id
            checkin
            sessions {
              _id
              start_time
              end_time
              location {
                coordinates
              }
            }
            checkout
          }
        }
      `;

        const response = await graphql.query<IGraphqlCheckinResponse>({
          query,
          variables: {
            campaignId,
            startDate,
            endDate,
          },
        });

        if (response && response.data && response.data.UserCampaignCheckins) {
          return response.data.UserCampaignCheckins;
        } 
          throw new Error("Failed to fetch campaign user checkins");
        

      }

    } catch (error) {
      console.error(error, "CHECKIN FETCH ERROR");
      throw new Error("Failed to get campaign user checkins");
    }
  };
  return {
    loading,
    campaigns,
    saveCampaign,
    updateCampaign,
    getCampaignUsers,
    getCampaignUserCheckins
    // togglecampaignStatus,
    // deletecampaign,
  };
}

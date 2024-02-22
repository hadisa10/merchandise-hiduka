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

import { ICampaign } from "src/types/realm/realm-types";
import { ICampaignHook, ICampaignChange, IGraphqlResponse } from "src/types/campaign";

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
          title
          createdAt
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
        mutation UpdateProduct($id: ObjectId!, $campaignUpdateInput: CampaignUpdateInput!) {
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

  // const togglecampaignStatus = async (campaign: ICampaign) => {
  //   await graphql.mutate({
  //     mutation: gql`
  //       mutation TogglecampaignStatus($campaignId: ObjectId!) {
  //         updateManycampaigns(query: { _id: $campaignId }, set: { active: ${!campaign.active}, updatedAt: "${new Date().toISOString()}" }) {
  //           matchedCount
  //           modifiedCount
  //         }
  //       }
  //     `,
  //     variables: { campaignId: campaign._id },
  //   });
  // };

  // const deleteCampaign = async (campaign: ICampaign) => {
  //   await graphql.mutate({
  //     mutation: gql`
  //       mutation DeleteCampaign($campaignId: ObjectId!) {
  //         deleteOneCampaign(query: { _id: $campaignId }) {
  //           _id
  //         }
  //       }
  //     `,
  //     variables: { campaignId: campaign._id },
  //   });
  // };

  return {
    loading,
    campaigns,
    saveCampaign,
    updateCampaign
    // togglecampaignStatus,
    // deletecampaign,
  };
}

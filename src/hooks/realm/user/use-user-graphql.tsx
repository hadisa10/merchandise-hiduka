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

// import { useRealmApp } from "src/components/realm";

import { IUser, IUserHook, IDraftUser, IUserChange, IUserResponse } from "src/types/user_realm";

import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { useCustomApolloClient } from "../use-apollo-client";

const { dataSourceName } = atlasConfig;


export function useUsers(): IUserHook {
  // const realmApp = useRealmApp();

  const graphql = useCustomApolloClient();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = gql`
      query FetchAllUsers {
        users {
          _id
          displayName
          createdAt
          updatedAt
        }
      }
    `;
    graphql.query<IUserResponse>({ query }).then(({ data }) => {
      console.log(data, 'DATA')
      setUsers(data.users);
      setLoading(false);
    });
  }, [graphql]);

  const clientHidukaCollection = useCollection({
    cluster: dataSourceName,
    db: "hiduka",
    collection: "users",
  });

  useWatch(clientHidukaCollection, {
    onInsert: (change: IUserChange) => {
      setUsers((oldUsers) => {
        if (loading) {
          return oldUsers;
        }
        const idx = getClientIndex(oldUsers, change.fullDocument) ?? oldUsers.length;
        return idx === oldUsers.length
          ? addValueAtIndex(oldUsers, idx, change.fullDocument)
          : oldUsers;
      });
    },
    onUpdate: (change: IUserChange) => {
      setUsers((oldUsers) => {
        if (loading) {
          return oldUsers;
        }
        const idx = getClientIndex(oldUsers, change.fullDocument);
        if (!idx) {
          return oldUsers;
        }
        return updateValueAtIndex(oldUsers, idx, () => change.fullDocument);
      });
    },
    onReplace: (change: IUserChange) => {
      setUsers((oldUsers) => {
        if (loading) {
          return oldUsers;
        }
        const idx = getClientIndex(oldUsers, change.fullDocument);
        if (!idx) {
          return oldUsers;
        }
        return replaceValueAtIndex(oldUsers, idx, change.fullDocument);
      });
    },
    onDelete: (change: { documentKey?: { _id: BSON.ObjectId } }) => {
      setUsers((oldUsers) => {
        if (loading) {
          return oldUsers;
        }
        if (!change.documentKey) {
          return oldUsers;
        }
        const idx = getClientIndex(oldUsers, { _id: change.documentKey._id });
        if (!idx) {
          return oldUsers;
        }
        return idx >= 0 ? removeValueAtIndex(oldUsers, idx) : oldUsers;
      });
    },
  });

  const saveUser = async (draftUser: IDraftUser) => {
    if (draftUser.displayName) {
      console.log(draftUser, 'DRAFT CLIENT')
      // draftUser.creator_id = realmApp.currentUser?.id as string;
      const dt = new Date();
      // @ts-expect-error expectd
      const cpUser: IUser = {
        ...draftUser,
        createdAt: dt,
        updatedAt: dt
      }
      try {
        await graphql.mutate({
          mutation: gql`
            mutation SaveUser($user: UserInsertInput!) {
              insertOneUser(data: $user) {
                _id
                displayName
              }
            }
          `,
          variables: { client: cpUser },
        });
      } catch (err) {
        if (err.message.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a user multiple times (i.e. an existing client has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  const toggleUserStatus = async (user: IUser) => {
    await graphql.mutate({
      mutation: gql`
        mutation ToggleUserStatus($userId: ObjectId!) {
          updateManyUsers(query: { _id: $userId }, set: { active: ${!user.active}, updatedAt: "${new Date().toISOString()}" }) {
            matchedCount
            modifiedCount
          }
        }
      `,
      variables: { userId: user._id },
    });
  };

  const registerUser = async (user: Omit<IUser, "_id" | "createdAt" | "active" | "updatedAt">) => {
    await graphql.mutate({
      mutation: gql`
        mutation RegisterUser(
         $email: String!,
         $displayName: String!,
         $isPublic: Boolean!,
         $city: String!,
         $state: String!,
         $about: String!,
         $country: String!,
         $address: String!,
         $zipCode: String!,
         $role: String!,
         $phoneNumber: String!,
         $photoURL: String!,
         $isVerified: Boolean!,
         $company: String!,
         $status: String!,
         ) {
          updateManyUsers(query: { email: $email }, set: { 
            displayName: $displayName,
            isPublic:$isPublic,
            city: $city,
            state: $state,
            about: $about,
            country: $country,
            address: $address,
            zipCode: $zipCode,
            role: $role,
            phoneNumber: $phoneNumber,
            photoURL: $photoURL,
            isVerified: $isVerified,
            isRegistered: true,
            company: $company,
            status: $status,
            updatedAt: "${new Date().toISOString()}",
             }) {
            matchedCount
            modifiedCount
          }
        }
      `,
      variables: {
        displayName: user.displayName,
        email: user.email,
        isPublic: user.isPublic,
        city: user.city,
        state: user.state,
        about: user.about,
        country: user.country,
        address: user.address,
        zipCode: user.zipCode,
        role: user.role,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        active: true,
        isVerified: user.isVerified,
        company: user.company,
        status: "active",
      },
    });
  };

  const deleteUser = async (user: IUser) => {
    await graphql.mutate({
      mutation: gql`
        mutation DeleteUser($userId: ObjectId!) {
          deleteOneUser(query: { _id: $userId }) {
            _id
          }
        }
      `,
      variables: { userId: user._id },
    });
  };

  return {
    loading,
    users,
    saveUser,
    toggleUserStatus,
    deleteUser,
    registerUser,
  };
}

import React from "react";

import { useRealmApp } from "../../components/realm";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CollectionConfig<DocType> {
  cluster?: string;
  db: string;
  collection: string;
}

/**
 * Returns a MongoDB Collection client object
 * @template DocType extends Realm.Services.MongoDB.Document
 * @param {CollectionConfig<DocType>} config - A description of the collection.
 * @returns {Realm.Services.MongoDB.MongoDBCollection<DocType>}
 */
export function useCollection<DocType extends Realm.Services.MongoDB.Document>({
  cluster = "mongodb-atlas",
  db,
  collection,
}: CollectionConfig<DocType>): Realm.Services.MongoDB.MongoDBCollection<DocType> | null {
  const realmApp = useRealmApp();

  const mdb = realmApp.currentUser?.mongoClient(cluster);

  return React.useMemo(() => mdb ? mdb.db(db).collection(collection) : null, [mdb, db, collection]);
}
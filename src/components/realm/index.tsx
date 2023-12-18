"use client"

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as Realm from "realm-web";
import atlasConfig from "../../atlasConfig.json";

interface AppContextProps {
    logIn: (credentials: Realm.Credentials) => Promise<void>;
    logOut: () => Promise<void>;
    currentUser: Realm.User | null;
    loading: boolean;
    // Add other properties/methods you may use from the Realm.App object
}

const RealmAppContext = createContext<AppContextProps | null>(null);

function createApp(id: string) {
    return new Realm.App({ id, baseUrl: atlasConfig.baseUrl });
}

export function RealmProvider({ appId, children }: { appId: string; children: React.ReactNode }) {
    const [app, setApp] = useState<Realm.App>(createApp(appId));
    const [currentUser, setCurrentUser] = useState<Realm.User | null>(app.currentUser);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setApp(createApp(appId));
    }, [appId]);

    const logIn = useCallback(
        async (credentials: Realm.Credentials) => {
            setLoading(true);
            console.log("START")
            const loginResponse = await app.logIn(credentials);
            console.log(loginResponse, "END")
            setLoading(false)
            setCurrentUser(app.currentUser);
        },
        [app]
    );

    const logOut = useCallback(async () => {
        try {
            const user = app.currentUser;
            await user?.logOut();
            if (user) {
                await app.removeUser(user);
            }
        } catch (err) {
            console.error(err);
        }
        setCurrentUser(app.currentUser);
    }, [app]);

    const appContext = useMemo(() => {
        return { logIn, logOut, currentUser, loading };
    }, [logIn, logOut, currentUser, loading]);

    return <RealmAppContext.Provider value={appContext}>{children}</RealmAppContext.Provider>;
}

export function useRealmApp() {
    const app = React.useContext(RealmAppContext);
    if (!app) {
        throw new Error(
            `No App Services App found. Make sure to call useRealmApp() inside of a <RealmProvider />.`
        );
    }
    return app;
}
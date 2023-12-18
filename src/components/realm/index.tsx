"use client"

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as Realm from "realm-web";
import atlasConfig from "../../atlasConfig.json";

interface AppContextProps extends globalThis.Realm.App {
    registerUser: (registerUserDetails: globalThis.Realm.Auth.RegisterUserDetails & { name: string }) => Promise<void>
    loading: boolean;
    // Add other properties/methods you may use from the Realm.App object
}

const RealmAppContext = createContext<AppContextProps | null>(null);

function createApp(id: string) {
    return new Realm.App({ id, baseUrl: atlasConfig.baseUrl });
}

export function RealmProvider({ appId, children }: { appId: string; children: React.ReactNode }) {
    const [app, setApp] = useState<globalThis.Realm.App>(createApp(appId));
    const [currentUser, setCurrentUser] = useState<globalThis.Realm.User | null>(app.currentUser);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setApp(createApp(appId));
    }, [appId]);

    const logIn = useCallback(
        async (credentials: globalThis.Realm.Credentials) => {
            setLoading(true);
            await app.logIn(credentials);
            setLoading(false)
            setCurrentUser(app.currentUser);
        },
        [app]
    );
    const registerUser = useCallback(
        async ({ email, password, name }: globalThis.Realm.Auth.RegisterUserDetails & { name: string }) => {
            setLoading(true);
            const registeredUser = await app.emailPasswordAuth.registerUser({ email, password });
            const updatedUser = await app.currentUser?.functions.onUserCreation({ registeredUser, data: { name } });

            console.log(app.currentUser?.functions, 'FUCNTIONS')
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

    // @ts-expect-error
    const appContext: AppContextProps = useMemo(() => {
        return { ...app, currentUser, logIn, logOut, registerUser, loading };
    }, [app, logIn, logOut, registerUser, currentUser, loading]);

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
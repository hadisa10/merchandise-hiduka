"use client"

import * as Realm from "realm-web";
import React, { useMemo, useState, useEffect, useCallback, createContext } from "react";

import { useClientContext } from "../clients";
import atlasConfig from "../../atlasConfig.json";

interface AppContextProps extends globalThis.Realm.App {
    registerUser: (registerUserDetails: globalThis.Realm.Auth.RegisterUserDetails) => Promise<void>
    resendConfirmationEmail: ({ email }: { email: string }) => Promise<void>
    logOut: () => Promise<void>
    resetPasswordEmail: ({ email }: { email: string }) => Promise<void>
    resetPassword: (resetPasswordDetails: globalThis.Realm.Auth.ResetPasswordDetails) => Promise<void>
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

    const { reset } = useClientContext();

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
        async ({ email, password }: globalThis.Realm.Auth.RegisterUserDetails) => {
            setLoading(true);
            await app.emailPasswordAuth.registerUser({ email, password });
            setLoading(false)
            setCurrentUser(app.currentUser);
        },
        [app]
    );
    const resendConfirmationEmail = useCallback(
        async ({ email }: globalThis.Realm.Auth.RegisterUserDetails) => {
            setLoading(true);
            await app.emailPasswordAuth.resendConfirmationEmail({ email })
            setLoading(false)
            setCurrentUser(app.currentUser);
        },
        [app]
    );
    const resetPasswordEmail = useCallback(
        async ({ email }: globalThis.Realm.Auth.SendResetPasswordDetails) => {
            setLoading(true);
            await app.emailPasswordAuth.sendResetPasswordEmail({ email })
            setLoading(false)
            setCurrentUser(app.currentUser);
        },
        [app]
    );
    const resetPassword = useCallback(
        async ({ token, tokenId, password }: globalThis.Realm.Auth.ResetPasswordDetails) => {
            setLoading(true);
            await app.emailPasswordAuth.resetPassword({ token, tokenId, password })
            setLoading(false)
            setCurrentUser(app.currentUser);
        },
        [app]
    );
    const logOut = useCallback(async () => {
        try {
            const user = app.currentUser;
            reset();
            await user?.logOut();
            if (user) {
                await app.removeUser(user);
            }
        } catch (err) {
            console.error(err);
        }
        setCurrentUser(app.currentUser);
    }, [app, reset]);

    // @ts-expect-error
    const appContext: AppContextProps = useMemo(() => ({ ...app, currentUser, logIn, logOut, registerUser, resendConfirmationEmail, resetPasswordEmail, resetPassword, loading }), [app, logIn, logOut, registerUser, resendConfirmationEmail, currentUser, loading, resetPassword, resetPasswordEmail]);

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
import React, {useMemo} from "react";
import {useAuthStore} from "./auth.store";
import {LoginPage} from "./login.page";

interface Props {
    children: React.ReactNode;
}

export function AuthWall(props: Props) {
    const authToken = useAuthStore((state) => state.token);

    const isAuthenticated = useMemo(() => !!authToken, [authToken]);

    if (!isAuthenticated) {
        return <LoginPage />
    }

    return <>
        {props.children}
    </>;
}
import React, {useMemo} from "react";
import {LoginPage} from "./login.page";
import {getAuth} from "firebase/auth";
import {firebaseApp} from "../firebase";
import {useAuthState} from "react-firebase-hooks/auth";

interface Props {
    children: React.ReactNode;
}

export function AuthWall(props: Props) {
    const auth = useMemo(() => getAuth(firebaseApp), []);
    const [user] = useAuthState(auth);

    const isAuthenticated = useMemo(() => !!user, [user]);

    if (!isAuthenticated) {
        return <LoginPage/>
    }

    return <>
        {props.children}
    </>;
}
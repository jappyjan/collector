import {useCallback, useEffect, useMemo} from "react";
import {Auth, getAuth} from "firebase/auth";
import {firebaseApp} from "../firebase";
import {useToast} from "@chakra-ui/react";
import {SignInWithPopupHook} from "react-firebase-hooks/auth/dist/auth/types";

interface Props {
    hook: (auth: Auth) => SignInWithPopupHook;
}

export function useSocialLogin(props: Props) {
    const {hook} = props;
    const auth = useMemo(() => getAuth(firebaseApp), []);

    const [
        signIn,
        userCredentials,
        loginIsInProgress,
        loginError
    ] = hook(auth);

    const toast = useToast();

    useEffect(() => {
        if (!loginError) {
            return;
        }

        toast({
            title: 'Anmeldung fehlgeschlagen',
            description: loginError.message,
            status: 'error',
            duration: 5000,
            isClosable: true
        });
    }, [loginError, toast]);

    const startSignIn = useCallback(async () => {
        await signIn([]);
    }, [signIn]);

    return {
        login: startSignIn,
        user: userCredentials,
        inProgress: loginIsInProgress,
        error: loginError
    };
}
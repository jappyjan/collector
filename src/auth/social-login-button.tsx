import {useCallback, useEffect, useMemo} from "react";
import {Auth, getAuth} from "firebase/auth";
import {firebaseApp} from "../firebase";
import {Button, useToast} from "@chakra-ui/react";
import {SignInWithPopupHook} from "react-firebase-hooks/auth/dist/auth/types";

interface Props {
    hook: (auth: Auth) => SignInWithPopupHook;
    name: string;
    colorScheme: string;
}

export function SocialLoginButton(props: Props) {
    const {hook, name, colorScheme} = props;
    const auth = useMemo(() => getAuth(firebaseApp), []);

    const [
        signIn,
        ,
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

    return (
        <Button colorScheme={colorScheme}
                variant='solid'
                isLoading={loginIsInProgress}
                onClick={startSignIn}
        >
            Mit {name} anmelden
        </Button>
    )
}
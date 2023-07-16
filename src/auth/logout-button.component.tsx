import {Button, ButtonProps, useToast} from "@chakra-ui/react";
import {useEffect, useMemo} from "react";
import {getAuth} from "firebase/auth";
import {firebaseApp} from "../firebase";
import {useSignOut} from "react-firebase-hooks/auth";

export function LogoutButton(props: Omit<ButtonProps, 'onClick'>) {
    const auth = useMemo(() => getAuth(firebaseApp), []);
    const [
        signOut,
        signOutIsInProgress,
        signOutError
    ] = useSignOut(auth);

    const toast = useToast();

    useEffect(() => {
        if (!signOutError) {
            return;
        }

        toast({
            title: 'Logout fehlgeschlagen',
            description: signOutError.message,
            status: 'error',
            position: 'top',
        });
    }, [signOutError, toast]);

    return (
        <Button colorScheme="teal"
                variant="outline"
                onClick={signOut}
                isLoading={signOutIsInProgress}
                {...props}
        >
            Logout
        </Button>
    )
}
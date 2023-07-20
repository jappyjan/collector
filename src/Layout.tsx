import React, {useMemo} from "react";
import {getAuth} from "firebase/auth";
import {firebaseApp} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {Box, chakra, VStack} from "@chakra-ui/react";
import {LogoutButtonComponent} from "./auth/logout-button.component";
import {LoginButtonComponent} from "./auth/login-button.component";

interface Props {
    children: React.ReactNode;
}

export function Layout(props: Props) {
    const auth = useMemo(() => getAuth(firebaseApp), []);
    const [user] = useAuthState(auth);

    const isSignedIn = useMemo(() => !!user, [user]);

    return (
        <Box>
            <chakra.nav backgroundColor={'teal'} p={2}>
                <VStack>
                    <Box alignSelf={'flex-end'}>
                        {isSignedIn ? (
                            <LogoutButtonComponent colorScheme={'black'}
                                                   variant={'ghost'}
                            />
                        ) : (
                            <LoginButtonComponent />
                        )}
                    </Box>
                </VStack>
            </chakra.nav>
            {props.children}
        </Box>
    )

}
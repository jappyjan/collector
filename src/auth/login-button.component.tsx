import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem, Button
} from "@chakra-ui/react";
import {ChevronDownIcon} from '@chakra-ui/icons'
import React, {useMemo} from "react";
import {useSocialLogin} from "./use-social-login";
import {
    useSignInWithGithub,
    useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import {MenuProps} from "@chakra-ui/menu/dist/menu";

export function LoginButtonComponent(props?: Omit<MenuProps, 'children'>) {
    const {
        login: loginWithGoogle,
        inProgress: loginWithGoogleInProgress,
    } = useSocialLogin({
        hook: useSignInWithGoogle,
    });

    const {
        login: loginWithGithub,
        inProgress: loginWithGithubInProgress,
    } = useSocialLogin({
        hook: useSignInWithGithub,
    });

    const anyLoginInProgress = useMemo(() => {
        return loginWithGoogleInProgress || loginWithGithubInProgress;
    }, [loginWithGoogleInProgress, loginWithGithubInProgress]);

    return (
        <Menu {...props}>
            <MenuButton as={Button}
                        rightIcon={<ChevronDownIcon/>}
                        isDisabled={anyLoginInProgress}
                        isLoading={anyLoginInProgress}
            >
                Anmelden
            </MenuButton>
            <MenuList>
                <MenuItem onClick={loginWithGoogle}
                          isDisabled={anyLoginInProgress}
                >
                    mit Google
                </MenuItem>
                <MenuItem onClick={loginWithGithub}
                          isDisabled={anyLoginInProgress}
                >
                    mit Github
                </MenuItem>
            </MenuList>
        </Menu>
    );
}
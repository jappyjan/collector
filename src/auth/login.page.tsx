import {
    Center,
    VStack
} from "@chakra-ui/react";
import React from "react";
import {SocialLoginButton} from "./social-login-button";
import {
    useSignInWithGithub,
    useSignInWithGoogle,
} from "react-firebase-hooks/auth";

export function LoginPage() {
    return (
        <Center height={'100vh'}>
            <VStack>
                <SocialLoginButton hook={useSignInWithGoogle} name='Google' colorScheme='red' />
                <SocialLoginButton hook={useSignInWithGithub} name='Github' colorScheme='blackAlpha' />
            </VStack>
        </Center>
    );
}
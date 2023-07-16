import {
    Box,
    Button, Center,
    Input,
    InputGroup,
    InputRightElement,
    VStack
} from "@chakra-ui/react";
import React from "react";
import {useAuthStore} from "./auth.store";
import {hash} from "../utils/crypto.utils";

import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {firebaseApp} from "../firebase";

const auth = getAuth(firebaseApp);

const login = () => {
    signInWithEmailAndPassword(auth, 'test@test.com', 'password');
};
const logout = () => {
    signOut(auth);
};

export function LoginPage() {
    const setToken = useAuthStore((state) => state.setToken);

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickRevealPassword = () => setShowPassword(!showPassword);

    const onSubmit = React.useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        const concatenated = `${username}:${password}`;
        const hashed = await hash(concatenated);
        setToken(hashed);
    }, [setToken]);

    return (
        <Center height={'100vh'}>
            <form onSubmit={onSubmit}>
                <VStack>
                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type='text'
                            placeholder='Enter username'
                            required
                            name='username'
                        />
                    </InputGroup>
                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter password'
                            required
                            name='password'
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClickRevealPassword}>
                                {showPassword ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <Button type='submit' width={'100%'}>Login</Button>
                </VStack>
            </form>
        </Center>
    );
}
import {Button, ButtonProps} from "@chakra-ui/react";
import {useAuthStore} from "./auth.store";

export function LogoutButton(props: Omit<ButtonProps, 'onClick'>) {
    const setToken = useAuthStore((state) => state.setToken);

    return (
        <Button colorScheme="teal" variant="outline" onClick={() => setToken('')} {...props}>
            Logout
        </Button>
    )
}
import {
    ChakraProvider,
    extendTheme,
    ThemeConfig
} from "@chakra-ui/react"
import {AuthWall} from "./auth/auth-wall.component";
import {HomePage} from "./home/home.page";

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const theme = extendTheme(config);

export const App = () => (
    <ChakraProvider theme={theme}>
        <AuthWall>
            <HomePage />
        </AuthWall>
    </ChakraProvider>
)

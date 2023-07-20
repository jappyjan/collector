import {
    ChakraProvider,
    extendTheme,
    ThemeConfig
} from "@chakra-ui/react"
import {CollectionsPage} from "./collections/collections.page";
import {Layout} from "./Layout";

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const theme = extendTheme(config);

export const App = () => (
    <ChakraProvider theme={theme}>
        <Layout>
            <CollectionsPage/>
        </Layout>
    </ChakraProvider>
)

import {LogoutButton} from "../auth/logout-button.component";
import {Box, VStack, chakra, HStack, InputGroup, Input, InputRightElement, Button} from "@chakra-ui/react";
import React from "react";

export function HomePage() {
    const {
        collections,
        collectibles,
        setActiveCollection,
        saveCollectible,
        activeCollection,
        addCollection,
        removeCollection,
        removeCollectible
    } = {
        collections: [],
        collectibles: [],
        setActiveCollection: (_collection: any) => {},
        saveCollectible: (_collectible: any) => {},
        activeCollection: '',
        addCollection: (_collection: any) => {},
        removeCollection: (_collection: any) => {},
        removeCollectible: (_collectible: any) => {}
    };

    const [collectionToAdd, setCollectionToAdd] = React.useState('');

    const onAddCollectionClick = React.useCallback(() => {
        addCollection(collectionToAdd);
        setCollectionToAdd('');
    }, [addCollection, collectionToAdd]);

    return (
        <Box>
            <chakra.nav backgroundColor={'teal'} p={2}>
                <VStack>
                    <LogoutButton alignSelf={'flex-end'}
                                  colorScheme={'black'}
                                  variant={'ghost'}
                    />
                </VStack>
            </chakra.nav>
            <Box p={4}>
                <p>Welcome</p>

                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        placeholder='Add Collection'
                        required
                        value={collectionToAdd}
                        onChange={(e) => setCollectionToAdd(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={onAddCollectionClick}>
                            Add
                        </Button>
                    </InputRightElement>
                </InputGroup>

                <ul>
                    {collections.map((collection) => (
                        <li key={collection}>
                            <HStack>
                                {collection}
                                <button onClick={() => setActiveCollection(collection)}>
                                    Select
                                </button>
                                <button onClick={() => removeCollection(collection)}>
                                    Remove
                                </button>
                            </HStack>
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    )
}
import {Box, InputGroup, Input, InputRightElement, Button, SimpleGrid, Progress} from "@chakra-ui/react";
import React, {useCallback, useMemo, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {collection, getFirestore} from 'firebase/firestore';
import {firebaseApp} from "../firebase";
import {Collection} from "../types/collections.types";
import {CollectionItemCardComponent} from "./collection-item-card.component";
import firebase from "firebase/compat";

export function CollectionsPage() {
    const [
        collectionsSnapshot,
        isLoadingCollections,
        collectionsLoadingError
    ] = useCollection(collection(getFirestore(firebaseApp), 'collections'));

    const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

    const [
        activeCollectioItemssSnapshot,
        isLoadingActiveCollectionItems,
        activeCollectionItemsLoadingError
    ] = useCollection(collection(getFirestore(firebaseApp), `collections/${activeCollectionId}/collectibles`));

    const [collectionToAdd, setCollectionToAdd] = React.useState('');

    const onAddCollectionClick = useCallback(() => {
        alert('not implemented');
    }, []);

    const removeCollection = useCallback(async (collectionId: string) => {
        await firebase.firestore()
            .collection('collections')
            .doc(collectionId)
            .delete();
    }, []);

    const collections = useMemo(() => {
        return collectionsSnapshot?.docs?.map((doc) => ({
            _id: doc.id,
            ...doc.data(),
        })) as (Collection & { _id: string })[] | undefined;
    }, [collectionsSnapshot]);

    return (
        <>
            {isLoadingCollections && (
                <Progress size='sm'
                          isIndeterminate
                          position={'fixed'}
                          bottom={0}
                          left={0}
                          right={0}
                />
            )}
            <Box p={4}>
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

                <SimpleGrid spacing={'20px'} minChildWidth='120px' mt={'1rem'}>
                    {collections?.map((collection) => (
                        <CollectionItemCardComponent key={collection._id}
                                                     title={collection.name}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </>
    )
}
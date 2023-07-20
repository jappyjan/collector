import {Box, SimpleGrid, Progress} from "@chakra-ui/react";
import React, {useMemo} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {collection, getFirestore} from 'firebase/firestore';
import {firebaseApp} from "../../firebase";
import {CollectionItemCardComponent} from "../collection-item-card.component";
import {CollectionItem} from "../../types/collections.types";

export function CollectiblesPage() {
    const collectionId = '';

    const [
        collectionItemsSnapshot,
        isLoadingCollectionItems,
        activeItemsLoadingError
    ] = useCollection(collection(getFirestore(firebaseApp), `collections/${collectionId}/collectibles`));

    const collectionItems = useMemo(() => {
        return collectionItemsSnapshot?.docs?.map((doc) => ({
            _id: doc.id,
            ...doc.data(),
        })) as (CollectionItem & { _id: string })[] | undefined;
    }, [collectionItemsSnapshot]);

    return (
        <>
            {isLoadingCollectionItems && (
                <Progress size='sm'
                          isIndeterminate
                          position={'fixed'}
                          bottom={0}
                          left={0}
                          right={0}
                />
            )}
            <Box p={4}>
                <SimpleGrid spacing={'20px'} minChildWidth='120px' mt={'1rem'}>
                    {collectionItems?.map((item) => (
                        <CollectionItemCardComponent key={item._id}
                                                     title={item.name}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </>
    )
}
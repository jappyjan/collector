import {
    Box,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    SimpleGrid,
    Progress,
    useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {useAuthState} from 'react-firebase-hooks/auth'
import {collection, getFirestore, deleteDoc, doc, addDoc} from 'firebase/firestore';
import {firebaseApp} from "../firebase";
import {Collection} from "../types/collections.types";
import {CollectionItemCardComponent} from "./collection-item-card.component";
import {getAuth} from "firebase/auth";
import {CollectionEditForm} from "./collection-edit-form";

export function CollectionsPage() {
    const collectionsCollection = useMemo(() => {
        return collection(getFirestore(firebaseApp), 'collections');
    }, []);

    const auth = useMemo(() => getAuth(firebaseApp), []);
    const [user] = useAuthState(auth);

    const {
        isOpen: upsertFormIsOpen,
        onOpen: onOpenUpsertForm,
        onClose: onCloseUpsertForm
    } = useDisclosure()

    const [
        collectionsSnapshot,
        isLoadingCollections,
        collectionsLoadingError
    ] = useCollection(collectionsCollection);

    const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

    const activeCollectionCollectiblesCollection = useMemo(() => {
        return collection(getFirestore(firebaseApp), `collections/${activeCollectionId}/collectibles`);
    }, [activeCollectionId]);

    const [
        activeCollectioItemssSnapshot,
        isLoadingActiveCollectionItems,
        activeCollectionItemsLoadingError
    ] = useCollection(activeCollectionCollectiblesCollection);

    const [collectionToAdd, setCollectionToAdd] = React.useState('');

    const onAddCollectionClick = useCallback(async () => {
        await addDoc(collectionsCollection, {
            name: collectionToAdd,
            authorId: user?.uid,
            isPublic: false,
            thumbnailUri: null,
        } as Collection);
    }, [user, collectionToAdd, collectionsCollection]);

    const removeCollection = useCallback(async (collectionId: string) => {
        await deleteDoc(doc(activeCollectionCollectiblesCollection, collectionId));
    }, [activeCollectionCollectiblesCollection]);

    const collections = useMemo(() => {
        return collectionsSnapshot?.docs?.map((doc) => ({
            _id: doc.id,
            ...doc.data(),
        })) as (Collection & { _id: string })[] | undefined;
    }, [collectionsSnapshot]);

    const [idToken, setIdToken] = useState<string | null>(null);

    const fetchIdToken = useCallback(async () => {
        const idToken = await auth.currentUser?.getIdToken();
        setIdToken(idToken ?? null);
    }, [auth.currentUser]);

    useEffect(() => {
        fetchIdToken();
    }, [fetchIdToken]);

    const urlFromUri = useCallback( (uri: string | null) => {
        if (!uri) {
            return '';
        }

        const host = 'https://firebasestorage.googleapis.com/v0/b/thing-collector.appspot.com/o';
        if (!uri.startsWith('/')) {
            uri = `/${uri}`;
        }
        return `${host}${uri}?alt=media&token=${idToken}`;
    }, [idToken]);

    const [upsertCollectionId, setUpsertCollectionId] = useState<string | null>(null);

    const editCollection = useCallback((collectionId: string) => {
        setUpsertCollectionId(collectionId);
        onOpenUpsertForm();
    }, [onOpenUpsertForm]);

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

            <Modal isOpen={upsertFormIsOpen} onClose={onCloseUpsertForm}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upsert Collection</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <CollectionEditForm collectionId={upsertCollectionId} />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onCloseUpsertForm}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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
                        <>
                            <CollectionItemCardComponent key={collection._id}
                                                         title={collection.name}
                                                         thumbnailUrl={urlFromUri(collection.thumbnailUri)}
                                                         onSecondaryBtnClick={() => editCollection(collection._id)}
                                                         secondaryBtnLabel='Edit'
                            />
                        </>
                    ))}
                </SimpleGrid>
            </Box>
        </>
    )
}
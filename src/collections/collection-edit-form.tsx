import React, {useCallback, useEffect, useMemo, useState} from "react";
import {addDoc, collection, doc, getFirestore, updateDoc} from "firebase/firestore";
import {firebaseApp} from "../firebase";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {Collection} from "../types/collections.types";
import {getAuth} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {Button, Divider, FormControl, FormHelperText, FormLabel, Input, Spacer} from "@chakra-ui/react";
import {getStorage, ref, uploadBytes} from 'firebase/storage';

interface Props {
    collectionId?: string | null,
    onCreate?: (docId: string) => void,
    onUpdate?: (docId: string) => void,
    onUpsert?: (docId: string) => void,
}

export function CollectionEditForm(props: Props) {
    const [
        existingCollection,
        collectionIsLoading,
        _collectionLoadingError
    ] = useDocumentData(doc(getFirestore(firebaseApp), `collections/${props.collectionId}`));

    const auth = useMemo(() => getAuth(firebaseApp), []);
    const [user] = useAuthState(auth);

    const [isSaving, setIsSaving] = useState(false);

    const [collectionData, setCollectionData] = useState<Collection | null>(null);

    useEffect(() => {
        if (collectionIsLoading || !!collectionData) {
            return;
        }

        setCollectionData({
            name: existingCollection?.name ?? '',
            isPublic: existingCollection?.isPublic ?? false,
            thumbnailUri: existingCollection?.thumbnailUri ?? null,
            authorId: existingCollection?.authorId ?? user?.uid ?? '',
        });
    }, [collectionIsLoading, collectionData, existingCollection, user]);

    useEffect(() => {
        setCollectionData((prev) => ({
            ...(prev ?? {}) as Collection,
            authorId: existingCollection?.authorId ?? user?.uid ?? '',
        }));
    }, [existingCollection, user]);

    const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const name = formData.get('name') as string;
        const thumbnailFile = formData.get('thumbnailFile') as File;

        if (!name) {
            return;
        }

        try {
            setIsSaving(true);

            let docId: string = props.collectionId ?? '';
            if (existingCollection) {
                await updateDoc(doc(getFirestore(firebaseApp), `collections/${props.collectionId}`), {
                    ...collectionData,
                });
            } else {
                const docRef = await addDoc(collection(getFirestore(firebaseApp), `collections`), {
                    ...collectionData,
                });
                docId = docRef.id;
            }

            const storage = getStorage();
            const storageRef = ref(storage, `collections/${docId}/thumbnail`);
            await uploadBytes(storageRef, thumbnailFile);

            if (!existingCollection && props.onCreate) {
                props.onCreate(docId);
            }

            if (existingCollection && props.onUpdate) {
                props.onUpdate(docId);
            }

            if (props.onUpsert) {
                props.onUpsert(docId);
            }
        } finally {
            setIsSaving(false);
        }
    }, [props, existingCollection, collectionData, setIsSaving]);

    return (
        <form onSubmit={onSubmit}>
            <FormControl isRequired isDisabled={isSaving}>
                <FormLabel>Name / Label</FormLabel>
                <Input type='text' name='name' value={collectionData?.name} />
            </FormControl>

            <FormControl isDisabled={isSaving}>
                <FormLabel>Thumbnail</FormLabel>
                <Input type='file' name='thumbnailFile' />
                {collectionData?.thumbnailUri && (<FormHelperText>Current: {collectionData?.thumbnailUri}</FormHelperText>)}
            </FormControl>

            <Button mt='1rem' type='submit' isDisabled={isSaving} isLoading={isSaving}>Save</Button>
        </form>
    )
}
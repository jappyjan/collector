export interface Collection {
    name: string;
    authorId: string;
    isPublic: boolean;
    thumbnailUri: string | null;
}

export interface CollectionItemImage {
    uri: string;
    label: string;
}

export interface CollectionItemUrl {
    url: string;
    label: string;
}

export interface CollectionItemFile {
    uri: string;
    label: string;
    thumbnailUri: string;
}

export interface CollectionItem {
    collectionId: string;
    name: string;
    images: CollectionItemImage[];
    urls: CollectionItemUrl[];
    files: CollectionItemFile[];
}
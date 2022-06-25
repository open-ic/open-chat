export interface BlobReference {
    blobId: bigint;
    canisterId: string;
}

export interface DataContent {
    blobReference?: BlobReference;
    blobData?: Uint8Array;
    blobUrl?: string;
}

export type StorageStatus = {
    byteLimit: number;
    bytesUsed: number;
};

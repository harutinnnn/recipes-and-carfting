export  type SeedType = {
    id: number;
    title: string;
    price: number;
    icon: string;
    productImage: string;
    availableLevel: number;
    xpOnCollect: number;
    collectionTime: number;
}

export type SeedFileType = {
    title: string,
    price: number;
    icon: File | null,
    productImage: File | null,
    availableLevel: number;
    xpOnCollect: number;
    collectionTime: number;
}

export  type SeedType = {
    id: number;
    title: string;
    price: number;
    icon: string;
    availableLevel: number;
    xpOnCollect: number;
}

export type SeedFileType = {
    title: string,
    price: number;
    icon: File | null,
    availableLevel: number;
    xpOnCollect: number;
}

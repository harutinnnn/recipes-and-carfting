export  type SeedType = {
    id: number;
    title: string;
    price: number;
    icon: string;
    productImage: string;
    readyProductImage: string;
    availableLevel: number;
    xpOnCollect: number;
    collectionTime: number;
    takeEnergyCollect: number;
}

export type SeedFileType = {
    title: string,
    price: number;
    icon: File | null,
    productImage: File | null,
    readyProductImage: File | null,
    availableLevel: number;
    xpOnCollect: number;
    collectionTime: number;
    takeEnergyCollect: number;
}


export type UserSeedsType = {
    id: number,
    userId: number,
    seedId: number,
    count: number
}

export  type UserSeedTypeJoin = {
    userSeeds: UserSeedsType
    seeds: SeedType
}


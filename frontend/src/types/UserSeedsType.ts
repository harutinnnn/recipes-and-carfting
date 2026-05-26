import {ProductType} from "@/types/ProductType";

export  type SeedType = {
    id: number;
    productId: number;
    title: string;
    price: number;
    minSellPrice: number;
    icon: string;
    availableLevel: number;
    xpOnCollect: number;
    collectionTime: number;
    takeEnergyCollect: number;
}

export  type SeedTypeProduct = {
    seeds: SeedType;
    products: ProductType;
}
export  type SeedProgressImageType = {
    id: number;
    seedId: string;
    icon: string;
    pos: number;
}

export type SeedFileType = {
    productId: number;
    title: string,
    price: number;
    minSellPrice: number;
    icon: File | null,
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
    seeds: SeedType,
    products: ProductType
}


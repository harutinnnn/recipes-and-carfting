import api from "@/api/axios";
import {MarketItemsType} from "@/types/market.types";
import {SeedType} from "@/types/UserSeedsType";


export type MarketItemsResponse = {
    items: MarketItemsType
};


export async function getMarketItems(): Promise<MarketItemsResponse> {
    const response = await api.get<MarketItemsResponse>("/market");
    return response.data;
}

export async function buySeed(id: number): Promise<SeedType> {
    const response = await api.get<SeedType>(`/market/buy-seed/${id}`);
    return response.data;
}


export async function sellUserProduct(id: number): Promise<MarketItemsResponse> {
    const response = await api.get<MarketItemsResponse>(`/market/sell-product/${id}`);
    return response.data;
}



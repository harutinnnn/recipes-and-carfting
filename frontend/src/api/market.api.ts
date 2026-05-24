import api from "@/api/axios";
import {MarketItemsType} from "@/types/market.types";
import {SeedType} from "@/types/UserSeedsType";
import {FoodType} from "@/types/FoodType";
import {FactoryType} from "@/types/FactoryType";


export type MarketItemsResponse = {
    items: MarketItemsType
};

export type BuyFactoryItemResponse = {
    item: FactoryType
}


export async function getMarketItems(): Promise<MarketItemsResponse> {
    const response = await api.get<MarketItemsResponse>("/market");
    return response.data;
}

export async function buySeed(id: number): Promise<SeedType> {
    const response = await api.get<SeedType>(`/market/buy-seed/${id}`);
    return response.data;
}

export async function buyFoodRequest(id: number): Promise<FoodType> {
    const response = await api.get<FoodType>(`/market/buy-food/${id}`);
    return response.data;
}


export async function sellUserProduct(id: number): Promise<MarketItemsResponse> {
    const response = await api.get<MarketItemsResponse>(`/market/sell-product/${id}`);
    return response.data;
}


export async function sellUserProductAll(id: number): Promise<MarketItemsResponse> {
    const response = await api.get<MarketItemsResponse>(`/market/sell-product-all/${id}`);
    return response.data;
}


export async function buyFactoryRequest(id: number): Promise<FoodType> {
    const response = await api.get<FoodType>(`/market/buy-factory/${id}`);
    return response.data;
}


export async function useFood(id: number): Promise<BuyFactoryItemResponse> {
    const response = await api.get<BuyFactoryItemResponse>(`/market/use-food/${id}`);
    return response.data;
}



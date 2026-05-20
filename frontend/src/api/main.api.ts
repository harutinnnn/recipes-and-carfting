import api from "@/api/axios";
import {SeedsResponse} from "@/api/admin/admin.seeds.api";
import {FieldItemType, FieldItemTypeJoin} from "@/types/FieldItemType";
import {UserSeedTypeJoin} from "@/types/UserSeedsType";
import {UserProductTypeJoin} from "@/types/UserProductType";


export type UserFieldsResponse = {
    items: FieldItemType[]
};

export type UserFieldsResponseJoin = {
    items: FieldItemTypeJoin[]
};
export type UserSeedsResponseJoin = {
    items: UserSeedTypeJoin[]
};


export type UserProductResponseJoin = {
    items: UserProductTypeJoin[]
};

export async function getSeedsFront(): Promise<SeedsResponse> {
    const response = await api.get<SeedsResponse>("/seeds");
    return response.data;
}


export async function getUserFields(): Promise<UserFieldsResponse> {
    const response = await api.get<UserFieldsResponse>("/fields");
    return response.data;
}


export async function getUserFieldsJoin(): Promise<UserFieldsResponseJoin> {
    const response = await api.get<UserFieldsResponseJoin>("/fields");
    return response.data;
}


export async function getUserSeeds(): Promise<UserSeedsResponseJoin> {
    const response = await api.get<UserSeedsResponseJoin>("/user-seeds");
    return response.data;
}


export async function getUserProducts(): Promise<UserProductResponseJoin> {
    const response = await api.get<UserProductResponseJoin>("/user-products");
    return response.data;
}


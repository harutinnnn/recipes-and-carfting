import api from "@/api/axios";
import {SeedsResponse} from "@/api/admin/admin.seeds.api";
import {FieldItemType, FieldItemTypeJoin} from "@/types/FieldItemType";


export type UserFieldsResponse = {
    items: FieldItemType[]
};

export type UserFieldsResponseJoin = {
    items: FieldItemTypeJoin[]
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


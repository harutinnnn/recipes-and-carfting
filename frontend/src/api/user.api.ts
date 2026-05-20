import api from "@/api/axios";
import {UserSeedsType} from "@/types/UserSeedsType";
import {FieldItemType} from "@/types/FieldItemType";

export type SetUserSeedType = {
    seed: UserSeedsType
};

export type CollectUserFieldType = {
    field: FieldItemType
};

export async function setUserSeed(data: any): Promise<SetUserSeedType> {
    const response = await api.post<SetUserSeedType>("/set-user-seed", data);
    return response.data;
}


export async function collectUserField(fieldId: number): Promise<CollectUserFieldType> {
    const response = await api.get<CollectUserFieldType>(`/collect-user-field/${fieldId}`, );
    return response.data;
}



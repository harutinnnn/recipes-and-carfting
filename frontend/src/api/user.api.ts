import api from "@/api/axios";
import {UserSeedsType} from "@/types/UserSeedsType";

export type SetUserSeedType = {
    seed: UserSeedsType
};

export async function setUserSeed(data: any): Promise<SetUserSeedType> {
    const response = await api.post<SetUserSeedType>("/set-user-seed", data);
    return response.data;
}


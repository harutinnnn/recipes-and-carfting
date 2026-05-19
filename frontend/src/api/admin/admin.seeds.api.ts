import {User} from "@/types/User";
import api from "@/api/axios";
import {SeedType} from "@/types/UserSeedsType";

export type SeedsResponse = {
    items: SeedType[]
};
export type SeedItemResponse = {
    item: SeedType
};

export async function getSeeds(): Promise<SeedsResponse> {
    const response = await api.get<SeedsResponse>("/admin/seeds");
    return response.data;
}



export async function getSeed(id:number): Promise<SeedItemResponse> {
    const response = await api.get<SeedItemResponse>(`/admin/seeds/${id}`);
    return response.data;
}

export async function saveSeedRequest(
    data: FormData
): Promise<SeedType> {
    const response = await api.post<SeedType>("/admin/seeds/edit", data,
        {
            headers: {"Content-Type": "multipart/form-data"}
        }
    );
    return response.data;
}



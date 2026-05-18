import {User} from "@/types/User";
import api from "@/api/axios";
import {SeedType} from "@/types/UserSeedsType";

export type SeedsResponse = {
    items: SeedType[]
};

export async function getSeeds(): Promise<SeedsResponse> {
    const response = await api.get<SeedsResponse>("/admin/seeds");
    return response.data;
}

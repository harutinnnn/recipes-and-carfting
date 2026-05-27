import api from "@/api/axios";
import {SeedProgressImageType, SeedType, SeedTypeProduct} from "@/types/UserSeedsType";

export type SeedsResponse = {

    items: SeedTypeProduct[]
};

export type SeedItemResponse = {
    item: SeedType
};

export type SeedProgressImagesResponse = {
    items: SeedProgressImageType[]
};

export type SaveSeedResponse = {
    seed: SeedType
};

export async function getSeeds(): Promise<SeedsResponse> {
    const response = await api.get<SeedsResponse>("/admin/seeds");
    return response.data;
}


export async function getSeedProgressImages(seedId: number): Promise<SeedProgressImagesResponse> {
    const response = await api.get<SeedProgressImagesResponse>(`/admin/seeds/get-seed-progress-images/${seedId}`);
    return response.data;
}


export async function getSeed(id: number): Promise<SeedItemResponse> {
    const response = await api.get<SeedItemResponse>(`/admin/seeds/${id}`);
    return response.data;
}

export async function saveSeedRequest(
    data: FormData
): Promise<SeedType> {
    const response = await api.post<SeedType | SaveSeedResponse>("/admin/seeds/edit", data,
        {
            headers: {"Content-Type": "multipart/form-data"}
        }
    );
    return "seed" in response.data ? response.data.seed : response.data;
}

export async function uploadSeedProgressFile(
    data: FormData
): Promise<SeedType> {
    const response = await api.post<SeedType>("/admin/seeds/upload-progress-file", data,
        {
            headers: {"Content-Type": "multipart/form-data"}
        }
    );
    return response.data;
}



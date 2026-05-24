import api from "@/api/axios";
import {FactoryType} from "@/types/FactoryType";

export type FactoryResponse = {
    items: FactoryType[]
};

export type FactoryItemResponse = {
    item: FactoryType
};


export type SaveFactoryResponse = {
    factory: FactoryType
};

export async function getFactories(): Promise<FactoryResponse> {
    const response = await api.get<FactoryResponse>("/admin/factories");
    return response.data;
}

export async function getfactory(id: number): Promise<FactoryItemResponse> {
    const response = await api.get<FactoryItemResponse>(`/admin/factories/${id}`);
    return response.data;
}

export async function saveFactoriesRequest(
    data: FormData
): Promise<FactoryType> {
    const response = await api.post<FactoryType | SaveFactoryResponse>("/admin/factories/edit", data,
        {
            headers: {"Content-Type": "multipart/form-data"}
        }
    );
    return "factory" in response.data ? response.data.factory : response.data;
}


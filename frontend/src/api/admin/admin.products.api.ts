import api from "@/api/axios";
import {ProductType} from "@/types/ProductType";

export type ProductsResponse = {
    items: ProductType[]
};

export type ProductItemResponse = {
    item: ProductType
};


export type SaveProductResponse = {
    food: ProductType
};

export async function getProducts(): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>("/admin/products");
    return response.data;
}

export async function getProductsByType(type: string): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>("/admin/products/by-type/" + type);
    return response.data;
}


export async function getProduct(id: number): Promise<ProductItemResponse> {
    const response = await api.get<ProductItemResponse>(`/admin/products/${id}`);
    return response.data;
}

export async function saveProductRequest(
    data: FormData
): Promise<ProductType> {
    const response = await api.post<ProductType | SaveProductResponse>("/admin/products/edit", data,
        {
            headers: {"Content-Type": "multipart/form-data"}
        }
    );
    return "food" in response.data ? response.data.food : response.data;
}

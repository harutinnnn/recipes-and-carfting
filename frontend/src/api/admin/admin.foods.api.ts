import api from "@/api/axios";
import {FoodType} from "@/types/FoodType";

export type FoodsResponse = {
    items: FoodType[]
};

export type FoodItemResponse = {
    item: FoodType
};


export type SaveFoodResponse = {
    food: FoodType
};

export async function getFoods(): Promise<FoodsResponse> {
    const response = await api.get<FoodsResponse>("/admin/foods");
    return response.data;
}


export async function getFood(id: number): Promise<FoodItemResponse> {
    const response = await api.get<FoodItemResponse>(`/admin/foods/${id}`);
    return response.data;
}

export async function saveFoodRequest(
    data: FormData
): Promise<FoodType> {
    const response = await api.post<FoodType | SaveFoodResponse>("/admin/foods/edit", data,
        {
            headers: {"Content-Type": "multipart/form-data"}
        }
    );
    return "food" in response.data ? response.data.food : response.data;
}

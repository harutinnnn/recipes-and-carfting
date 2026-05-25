import {RecipeItemResponseJoin} from "@/api/admin/admin.recipes.api";
import api from "@/api/axios";
import {SetUserSeedType} from "@/api/user.api";


export async function getRecipesJoin(): Promise<RecipeItemResponseJoin[]> {
    const response = await api.get<RecipeItemResponseJoin[]>("/recipes");
    return response.data;
}


export async function setMakeRecipe(data: any): Promise<SetUserSeedType> {
    const response = await api.post<SetUserSeedType>("/recipes/make", data);
    return response.data;
}
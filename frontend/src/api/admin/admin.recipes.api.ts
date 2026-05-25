import api from "@/api/axios";
import {IngredientTypes, RecipesType} from "@/types/RecipesType";
import {SeedType} from "@/types/UserSeedsType";

export type RecipeResponse = {
    items: RecipesType[]
};

export type RecipeItemResponse = {
    item: RecipesType
};

export type RecipesIngredients = {
    recipesIngredients: IngredientTypes
    seeds: SeedType
}

export type RecipeItemResponseJoin = {
    recipe: RecipesType,
    recipesIngredients: RecipesIngredients[]
};


export type SaveRecipeResponse = {
    recipe: RecipesType
};

export async function getRecipes(): Promise<RecipeResponse> {
    const response = await api.get<RecipeResponse>("/admin/recipes");
    return response.data;
}

export async function getRecipe(id: number): Promise<RecipeItemResponse> {

    const response = await api.get<RecipeItemResponse>(`/admin/recipes/${id}`);
    return response.data;
}

export async function getRecipeJoin(id: number): Promise<RecipeItemResponseJoin> {

    const response = await api.get<RecipeItemResponseJoin>(`/admin/recipes/${id}`);
    return response.data;
}

export async function saveRecipesRequest(
    data: FormData
): Promise<RecipesType> {
    const response = await api.post<RecipesType | SaveRecipeResponse>("/admin/recipes/edit", data,
        {
            headers: {"Content-Type": "multipart/form-data"}
        }
    );
    return "recipe" in response.data ? response.data.recipe : response.data;
}


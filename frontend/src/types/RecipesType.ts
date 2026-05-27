import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";
import {ProductType} from "@/types/ProductType";

export  type RecipesType = {
    id: number;
    productId: number;
    title: string;
    price: number;
    factoryId: number;
    icon: string;
    availableFromLevel: number;
    xpOnCollect: number;
    takeEnergyCollect: number;
}

export type RecipesFileType = {
    productId: number;
    title: string;
    price: number;
    factoryId: number;
    icon: File | null;
    availableFromLevel: number;
    xpOnCollect: number;
    takeEnergyCollect: number;
    ingredientsCount?: number;
}

export type IngredientTypes = {
    id?: number
    recipeId?: number;
    ingredientType: IngredientTypesEnum;
    productId: number;
    ingredientNeedsCount: number;
}


export type IngredientTypesJoin = {
    recipesIngredients:IngredientTypes,
    products:ProductType
}
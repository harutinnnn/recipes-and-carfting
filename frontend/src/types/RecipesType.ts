import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";

export  type RecipesType = {
    id: number;
    title: string;
    price: number;
    factoryId: number;
    icon: string;
    availableFromLevel: number;
    xpOnCollect: number;
    takeEnergyCollect: number;
}

export type RecipesFileType = {
    title: string;
    price: number;
    factoryId: number;
    icon: File | null;
    availableFromLevel: number;
    xpOnCollect: number;
    takeEnergyCollect: number;
}

export type IngredientTypes = {
    id?: number
    recipeId?: number;
    ingredientType: IngredientTypesEnum;
    ingredientId: number;
    ingredientNeedsCount: number;
}
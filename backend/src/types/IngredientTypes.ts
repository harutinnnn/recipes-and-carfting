import {IngredientTypesEnum} from "../enums/IngredientTypesEnum";

export type IngredientTypes = {
    id?: number
    recipeId?: number;
    ingredientType: IngredientTypesEnum;
    ingredientId: number;
    ingredientNeedsCount: number;
}
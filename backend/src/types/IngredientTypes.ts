import {IngredientTypesEnum} from "../enums/IngredientTypesEnum";

export type IngredientTypes = {
    id?: number
    recipeId?: number;
    ingredientType: IngredientTypesEnum;
    productId: number;
    ingredientNeedsCount: number;
}
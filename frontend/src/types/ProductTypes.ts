import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";

export type ProductType = {
    id: number,
    userId: number,
    seedId: number,
    count: number,
    userProductTypes: IngredientTypesEnum
}


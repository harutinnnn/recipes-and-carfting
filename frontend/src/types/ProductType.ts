import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";

export  type ProductType = {
    id: number;
    title: string;
    icon: string;
    finalProduct: string;
    userProductTypes: IngredientTypesEnum
}

export type ProductFileType = {
    title: string,
    icon: File | null,
    finalProduct: File | null,
    userProductTypes: IngredientTypesEnum
}

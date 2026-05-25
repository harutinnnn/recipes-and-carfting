import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";

export  type ProductType = {
    id: number;
    title: string;
    icon: string;
    userProductTypes: IngredientTypesEnum
}

export type ProductFileType = {
    title: string,
    icon: File | null,
    userProductTypes: IngredientTypesEnum
}

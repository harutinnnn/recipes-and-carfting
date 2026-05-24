import {SeedType} from "@/types/UserSeedsType";
import {FieldItemType, SeedsProgressImageType} from "@/types/FieldItemType";
import {FieldStatusEnum} from "@/enums/FieldStatusEnum";
import {RecipesType} from "@/types/RecipesType";

export  type FactoryType = {
    id: number;
    title: string;
    price: number;
    icon: string;
    availableFromLevel: number;
}

export type FactoryFileType = {
    title: string,
    price: number;
    icon: File | null;
    availableFromLevel: number;
}

export type UserFactoryType = {
    id: number,
    userId: number,
    factoryId: number,
    recipeId: number,
    status: FieldStatusEnum,
    startedAt: Date | string,
    finishedAt: Date | string,
}


export type FactoryItemTypeJoin = {
    userFactories: UserFactoryType,
    factories: FactoryType
    recipes: RecipesType
}


import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";
import {SeedType} from "@/types/UserSeedsType";

export  type UserProductType = {
    id: number;
    userId: number;
    seedId: number;
    count: number;
    userProductTypes: IngredientTypesEnum
}

export  type UserProductTypeJoin = {
    userProducts: UserProductType
    seeds: SeedType
}


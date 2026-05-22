import {FieldStatusEnum} from "@/enums/FieldStatusEnum";
import {SeedType} from "@/types/UserSeedsType";

export type FieldItemType = {
    id: number;
    userId: number,
    seedId: number,
    status: FieldStatusEnum,
    startedAt: Date | string,
    finishedAt: Date | string,
}

export type SeedsProgressImageType = {
    id: number;
    seedId: number,
    icon: string,
    pos: number
}

export type FieldItemTypeJoin = {
    userFields: FieldItemType,
    seeds: SeedType,
    seedsProgressImage: SeedsProgressImageType[] | []
}


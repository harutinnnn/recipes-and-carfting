import {FieldStatusEnum} from "@/enums/FieldStatusEnum";

export type FieldItemType = {
    id: number;
    img: string,
    status: FieldStatusEnum,
    title: string,
    startDate: Date | string,
    endDate: Date | string,
}
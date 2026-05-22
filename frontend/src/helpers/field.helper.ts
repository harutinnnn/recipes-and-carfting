import {FieldItemTypeJoin} from "@/types/FieldItemType";

export const getFieldProgressImage = (field: FieldItemTypeJoin, progress: number, apiUrl: string): string => {

    let imageUrl = (apiUrl + field?.seeds?.productImage) || "";

    if (field.seedsProgressImage[0].icon && progress <= 25) {
        imageUrl = apiUrl + field.seedsProgressImage[0].icon
    } else if (field.seedsProgressImage[1].icon && progress > 25 && progress <= 50) {
        imageUrl = apiUrl + field.seedsProgressImage[1].icon

    } else if (field.seedsProgressImage[2].icon && progress > 50 && progress <= 75) {
        imageUrl = apiUrl + field.seedsProgressImage[2].icon

    } else if (field.seedsProgressImage[3].icon && progress > 75) {
        imageUrl = apiUrl + field.seedsProgressImage[3].icon

    } else if (progress >= 100) {
        imageUrl = apiUrl + field?.seeds?.productImage
    }

    return imageUrl;
}
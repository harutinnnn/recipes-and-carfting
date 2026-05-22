export  type FoodType = {
    id: number;
    title: string;
    price: number;
    energyPower: number;
    icon: string;
}

export type FoodFileType = {
    title: string,
    price: number;
    energyPower: number;
    icon: File | null,
}

export type UserFoodType = {
    id: number,
    userId: number;
    foodId: number;
    count: number;
}



export  type FoodTypeJoin = {
    foods: FoodType;
    userFoods: UserFoodType
}


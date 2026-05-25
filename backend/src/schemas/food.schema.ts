import {z} from "zod";
import {IngredientTypesEnum} from "../enums/IngredientTypesEnum";

export const ProductSchema = z.object({
    title: z.string().min(1, "Title is required"),
    userProductTypes: z.enum(IngredientTypesEnum, {
        error: "IngredientType is required",
    }),
});

export const FoodSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.coerce.number({error: "Price is required"}),
    energyPower: z.coerce.number({error: "Min cell price is required"}),
});


export const SettingsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required"),
});


export const FactorySchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.coerce.number({error: "Price is required"}),
    availableFromLevel: z.coerce.number({error: "Price is required"}),
});

export const IngredientSchema = z.object({
    recipeId: z.number().optional(),
    ingredientType: z.enum(IngredientTypesEnum, {
        error: "IngredientType is required",
    }),
    ingredientId: z.coerce.number({
        error: "IngredientId is required",
    }),
    ingredientNeedsCount: z.coerce.number({
        error: "IngredientNeedsCount is required",
    }),
});

const IngredientsSchema = z.preprocess((value) => {
    if (value === undefined || value === "") {
        return [];
    }

    if (typeof value !== "string") {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}, z.array(IngredientSchema).default([]));


export const RecipeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.coerce.number({error: "Price is required"}),
    factoryId: z.coerce.number({error: "FactoryId is required"}),
    availableFromLevel: z.coerce.number({error: "AvailableFromLevel is required"}),
    xpOnCollect: z.coerce.number({error: "XpOnCollect is required"}),
    takeEnergyCollect: z.coerce.number({error: "TakeEnergyCollect is required"}),
    ingredients: IngredientsSchema,
});


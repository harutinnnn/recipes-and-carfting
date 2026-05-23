import {z} from "zod";

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


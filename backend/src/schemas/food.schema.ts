import {z} from "zod";

export const FoodSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.coerce.number({error: "Price is required"}),
    energyPower: z.coerce.number({error: "Min cell price is required"}),
});


import {z} from "zod";

export const SeedsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.coerce.number({error: "Price is required"}),
    availableLevel: z.coerce.number({error: "Available Level is required"}),
    xpOnCollect: z.coerce.number({error: "XP On Collect is required"}),
    collectionTime: z.coerce.number({error: "Collection Time is required"}),
});


export const UserSeedSchema = z.object({
    fieldId: z.coerce.number({error: "Field is required"}),
    seedId: z.coerce.number({error: "Seed is required"}),
});


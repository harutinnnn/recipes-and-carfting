import {z} from "zod";

export const SeedsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.coerce.number({error: "Price is required"}),
    minSellPrice: z.coerce.number({error: "Min cell price is required"}),
    availableLevel: z.coerce.number({error: "Available Level is required"}),
    xpOnCollect: z.coerce.number({error: "XP On Collect is required"}),
    collectionTime: z.coerce.number({error: "Collection Time is required"}),
    takeEnergyCollect: z.coerce.number({error: "Take Energy Collect"}),
});


export const UserSeedSchema = z.object({
    fieldId: z.coerce.number({error: "Field is required"}),
    seedId: z.coerce.number({error: "Seed is required"}),
});


export const UploadSeedProgressFile = z.object({
    seedId: z.coerce.number({error: "Seed is required"}),
    pos: z.coerce.number({error: "Position is required"}).min(1).max(4),
});


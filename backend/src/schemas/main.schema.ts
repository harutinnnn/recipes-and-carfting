import {z} from "zod";

export const QueryParamId = z.object({
    id: z.coerce.number({error: "Id is required"}),
});

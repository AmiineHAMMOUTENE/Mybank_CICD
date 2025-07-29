import * as z from "zod"


export const OperationFormSchema = z.object({
    "label": z.string().min(1).max(255),
    "amount": z.coerce.number().gte(0).lte(9999),
    "category": z.string()
})
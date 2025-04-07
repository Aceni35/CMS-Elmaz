import { z } from "zod";

export const documentInputSchema = (isAllOptional = false) => {
  const baseSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string(),
    file: z.string().url(), 
    categoryId: z.string(), 
    size: z.number().min(1), 
    type: z.enum(["PDF", "WORD", "EXCEL", "PPT", "TXT", "OTHER"]),
  });

  return isAllOptional ? baseSchema.partial() : baseSchema;
};

import { z } from "zod";

export const invoiceDocumentInputSchema = (isAllOptional = false) => {
  const baseSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string(),
    file: z.string().url(),
    categoryId: z.string(),
    size: z.number().min(1),
    type: z.enum(["PDF", "WORD", "EXCEL", "PPT", "TXT", "OTHER"]),
    invoiceType: z.enum(["Company", "Personal"]),
    area: z.enum(["Plav", "Murino", "Ruralne oblasti"]),
    year: z.number().min(1900),
    month: z.number().min(1).max(12),
  });

  return isAllOptional ? baseSchema.partial() : baseSchema;
};

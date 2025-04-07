import { z } from "zod";

export const categoryInputSchema = (isAllOptional = false) => {
  const CategorySchema: z.ZodType<any> = z.lazy(() =>
    z.object({
      name: z.string(),
      parentId: z.string(),

      breadcrumb: z
        .object({
          id: z.string(),
          name: z.string(),
          children: z.array(CategorySchema).optional(),
        })
        .optional(),

      children: z.array(CategorySchema).optional(),
    })
  );

  const PartialCategorySchema: z.ZodType<any> = z.lazy(() =>
    z.object({
      name: z.string().optional(),
      parentId: z.string().optional(),

      breadcrumb: z
        .object({
          id: z.string().optional(),
          name: z.string().optional(),
          children: z.array(PartialCategorySchema).optional(),
        })
        .optional(),

      children: z.array(PartialCategorySchema).optional(),
    })
  );

  return isAllOptional ? PartialCategorySchema : CategorySchema;
};

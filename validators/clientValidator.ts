import { z } from "zod";
import { sharedUserFields } from "./helperValidators";

const clientFields = {
  ...sharedUserFields,
  invoiceToEmail: z.boolean(),
  company: z.string(),
  code: z.string(),
  type: z.enum(["company", "personal"]),
  area: z.enum(["Plav", "Murino", "Ruralne Oblasti"]),
};

export const clientInputSchema = (isAllOptional = false) => {
  const schema = z.object(clientFields);
  return isAllOptional ? schema.partial() : schema;
};

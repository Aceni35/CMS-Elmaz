import { z } from "zod";
import { sharedUserFields } from "./helperValidators";

const baseSchema = {
  ...sharedUserFields,
  avatar: z.string().url(),
  role: z.enum(["super_admin", "admin"]),
  permissions: z
    .record(
      z.enum(["news", "documents", "gallery", "admins", "clients"]),
      z.array(z.enum(["view", "add", "update", "delete"]))
    )
    .optional(),
};

export const adminInputSchema = (isAllOptional = false) => {
  const schema = z.object(baseSchema);
  return isAllOptional ? schema.partial() : schema;
};


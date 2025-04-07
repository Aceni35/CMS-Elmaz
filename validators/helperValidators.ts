import { z } from "zod";
import { hashPassword } from "../helpers/helperFunctions";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long").transform(async (val)=>{
    return await hashPassword(val)
  })
;

export const sharedUserFields = {
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  password: passwordSchema,
};
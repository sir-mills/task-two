import z from "zod";

export const createUser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email({ message: "invalid email address" }),
  phone: z.string(),
  password: z.string().min(6, { message: "must be more than six charecters" }),
});

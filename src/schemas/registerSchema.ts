import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email").min(5, "Invalid email"),
  password: z.string().min(3, "Password must be at least 3 charactors"),
});

export const registerSchema = loginSchema
  .extend({
    phoneNumber: z
      .string()
      .refine(
        (value) =>
          /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(value ?? ""),
        "Invalid value"
      ),
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
    confirmPassword: z.string().min(3, "Confirm password don't match"),
    gender: z.string().min(1, "Please select your gender"),
    address: z.string().min(5, "Please enter valid address"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password don't match",
    path: ["confirmPassword"],
  });

export type IRegister = z.infer<typeof registerSchema>;
export type ILogin = z.infer<typeof loginSchema>;

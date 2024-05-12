import { z } from "zod";

export const userSchema = z.object({
  phoneNumber: z
    .string()
    .refine(
      (value) =>
        /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(value ?? ""),
      "Invalid value"
    ),
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  address: z.string().optional(),
  gender: z.string().min(1, "Please select your gender"),
  avatar: z.custom<File>().optional(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(3, "Password must be at least 3 charactors"),
    newPassword: z.string().min(3, "Password must be at least 3 charactors"),
    confirmPassword: z.string().min(3, "Confirm password don't match"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password cannot the same current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password don't match",
    path: ["confirmPassword"],
  });

export type IUpdatePassword = z.infer<typeof updatePasswordSchema>;

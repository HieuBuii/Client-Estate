import { z } from "zod";

export const apartmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number({ message: "Price is required" }).min(1, "Invalid value"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  bedrooms: z
    .number({ message: "Number of bedroom is required" })
    .min(0, "Invalid value"),
  bathrooms: z
    .number({ message: "Number of bathroom is required" })
    .min(0, "Invalid value"),
  latitute: z.string().min(1, "Latitute is required"),
  longitute: z.string().min(1, "Longitute is required"),
  desc: z.string().min(1, "Description is required"),
  utilities: z.string().min(1, "Utilities is required"),
  pet: z.string().min(1, "Pet policy is required"),
  income: z.string().min(1, "Income is required"),
  size: z.number({ message: "Size is required" }).min(0, "Invalid value"),
  school: z
    .number({ message: "This field is required" })
    .min(0, "Invalid value"),
  bus: z.number({ message: "This field is required" }).min(0, "Invalid value"),
  restaurant: z
    .number({ message: "This field is required" })
    .min(0, "Invalid value"),
  type: z.string().min(1, "Type is required"),
  property: z.string().min(1, "Property is required"),
  status: z.string().min(1, "Status is required"),
});

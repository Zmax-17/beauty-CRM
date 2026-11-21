import { z } from "zod";

export const clientFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120),
  phone: z
    .string()
    .trim()
    .min(5, "Phone is required")
    .max(30),
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("")),
});

export type ClientFormValues = z.infer<
  typeof clientFormSchema
>;

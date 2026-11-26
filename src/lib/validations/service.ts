import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Service name is required"),
  duration: z.coerce
    .number()
    .int("Duration must be an integer")
    .positive("Duration must be greater than 0"),
  price: z.coerce
    .number()
    .nonnegative("Price cannot be negative")
    .transform((value) => Math.round(value * 100)),
});

export type ServiceFormValues = z.infer<
  typeof serviceFormSchema
>;

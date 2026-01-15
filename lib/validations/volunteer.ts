import { z } from "zod";

export const volunteerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 10,
      "Phone number must be at least 10 digits"
    ),
  age: z
    .number()
    .min(18, "You must be at least 18 years old")
    .max(30, "Maximum age is 30")
    .optional(),
  university: z
    .string()
    .min(2, "Please enter your university or college name"),
  motivation: z
    .string()
    .min(50, "Please write at least 50 characters about why you want to volunteer")
    .max(1000, "Please keep your response under 1000 characters"),
});

export type VolunteerFormData = z.infer<typeof volunteerSchema>;

"use server";

import { createClient } from "@/lib/supabase/server";
import { volunteerSchema, type VolunteerFormData } from "@/lib/validations/volunteer";

export type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitVolunteerApplication(
  data: VolunteerFormData
): Promise<ActionResult> {
  // Validate data on server
  const result = volunteerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("volunteer_applications").insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      age: result.data.age || null,
      university: result.data.university,
      motivation: result.data.motivation,
    });

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to submit application. Please try again.",
      };
    }

    return {
      success: true,
      message: "Application submitted successfully!",
    };
  } catch (error) {
    console.error("Server error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

import { z } from "zod";

export const EmergencyContactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." }),
  relationship: z.string().min(2, { message: "Relationship must be at least 2 characters." }),
});

export type EmergencyContactFormValues = z.infer<typeof EmergencyContactSchema>;

export const MedicalHistorySchema = z.object({
  allergies: z.string().optional(),
  conditions: z.string().optional(),
  medications: z.string().optional(),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]).optional(),
  notes: z.string().optional(),
});

export type MedicalHistoryFormValues = z.infer<typeof MedicalHistorySchema>;

export const MedicalProfileSchema = z.object({
  medicalHistory: MedicalHistorySchema,
  emergencyContacts: z.array(EmergencyContactSchema).min(1, {message: "At least one emergency contact is required."}).max(3, {message: "Maximum of 3 emergency contacts."}),
  consent: z.boolean().refine(val => val === true, { message: "Consent is required to share information in emergencies." }),
});

export type MedicalProfileFormValues = z.infer<typeof MedicalProfileSchema>;

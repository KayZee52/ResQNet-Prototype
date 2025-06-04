"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MedicalProfileSchema, type MedicalProfileFormValues } from "@/lib/schemas";
import { PlusCircle, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultValues: MedicalProfileFormValues = {
  medicalHistory: {
    allergies: "",
    conditions: "",
    medications: "",
    bloodType: "Unknown",
    notes: "",
  },
  emergencyContacts: [{ name: "", phone: "", relationship: "" }],
  consent: false,
};

export default function MedicalProfilePage() {
  const { toast } = useToast();
  const form = useForm<MedicalProfileFormValues>({
    resolver: zodResolver(MedicalProfileSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emergencyContacts",
  });

  function onSubmit(data: MedicalProfileFormValues) {
    console.log("Medical Profile Data:", data);
    // Placeholder for saving data
    toast({ title: "Profile Saved!", description: "Your medical profile has been updated." });
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto mt-4 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">Medical Profile</CardTitle>
          <CardDescription>
            Provide vital information for emergencies. This information can be crucial for responders.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              {/* Medical History Section */}
              <section>
                <h3 className="font-headline text-xl font-semibold mb-4 border-b pb-2">Medical History</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="medicalHistory.allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Penicillin, Peanuts" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalHistory.conditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Existing Conditions</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Asthma, Diabetes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalHistory.medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Medications</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Insulin, Ventolin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalHistory.bloodType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="medicalHistory.notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Important Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Pacemaker installed, Prefers specific hospital" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Emergency Contacts Section */}
              <section>
                <h3 className="font-headline text-xl font-semibold mb-4 border-b pb-2">Emergency Contacts</h3>
                {fields.map((field, index) => (
                  <Card key={field.id} className="mb-4 p-4 space-y-3 relative">
                    <FormField
                      control={form.control}
                      name={`emergencyContacts.${index}.name`}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Contact Name #{index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" {...formField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`emergencyContacts.${index}.phone`}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1234567890" {...formField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`emergencyContacts.${index}.relationship`}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Spouse, Parent" {...formField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </Card>
                ))}
                {fields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ name: "", phone: "", relationship: "" })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Emergency Contact
                  </Button>
                )}
                 <FormMessage>{form.formState.errors.emergencyContacts?.root?.message}</FormMessage>
              </section>

              {/* Consent Section */}
              <section>
                <h3 className="font-headline text-xl font-semibold mb-4 border-b pb-2">Consent</h3>
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I consent to share this medical information with emergency responders and verified community helpers during an emergency situation.
                        </FormLabel>
                        <FormDescription>
                          This information will only be accessible when an alert is triggered or with your explicit permission.
                        </FormDescription>
                         <FormMessage className="pt-1 !mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
              </section>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-5 w-5" /> {form.formState.isSubmitting ? "Saving..." : "Save Medical Profile"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

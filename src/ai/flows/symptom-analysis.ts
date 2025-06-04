
/**
 * @fileOverview This file defines the symptom analysis flow for the AI Emergency Assistant.
 *
 * - analyzeSymptoms - Analyzes user-provided symptoms and provides a summary of possible conditions
 *   with recommendations on seeking medical attention.
 * - SymptomAnalysisInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalysisOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomAnalysisInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'A description of the symptoms being experienced. Be as detailed as possible.'
    ),
});
export type SymptomAnalysisInput = z.infer<typeof SymptomAnalysisInputSchema>;

const SymptomAnalysisOutputSchema = z.object({
  possibleConditions: z
    .string()
    .describe('A summary of the possible medical conditions indicated by the symptoms.'),
  recommendation: z
    .string()
    .describe(
      'A recommendation on whether to seek immediate medical attention or monitor symptoms at home.'
    ),
});
export type SymptomAnalysisOutput = z.infer<typeof SymptomAnalysisOutputSchema>;

export async function analyzeSymptoms(
  input: SymptomAnalysisInput
): Promise<SymptomAnalysisOutput> {
  return symptomAnalysisFlow(input);
}

const symptomAnalysisPrompt = ai.definePrompt({
  name: 'symptomAnalysisPrompt',
  input: {schema: SymptomAnalysisInputSchema},
  output: {schema: SymptomAnalysisOutputSchema},
  prompt: `You are an AI Emergency Assistant that helps users understand the severity of their symptoms.

  Analyze the following symptoms and provide a summary of the possible conditions and a recommendation on whether to seek immediate medical attention or monitor symptoms at home.

  Symptoms: {{{symptoms}}}
  `,
});

const symptomAnalysisFlow = ai.defineFlow(
  {
    name: 'symptomAnalysisFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async input => {
    const {output} = await symptomAnalysisPrompt(input);
    return output!;
  }
);

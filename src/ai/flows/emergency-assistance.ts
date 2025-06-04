
'use server';
/**
 * @fileOverview An AI assistant for providing emergency assistance.
 *
 * - emergencyAssistance - A function that provides emergency assistance based on user input.
 * - EmergencyAssistanceInput - The input type for the emergencyAssistance function.
 * - EmergencyAssistanceOutput - The return type for the emergencyAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyAssistanceInputSchema = z.object({
  symptoms: z
    .string()
    .describe('Description of the symptoms being experienced by the user.'),
  voiceNoteUri: z
    .string()
    .optional()
    .describe(
      "Optional voice note describing the emergency, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EmergencyAssistanceInput = z.infer<typeof EmergencyAssistanceInputSchema>;

const EmergencyAssistanceOutputSchema = z.object({
  instructions: z.string().describe('Step-by-step instructions for the user.'),
  shouldIncludeFirstAid: z
    .boolean()
    .describe(
      'Whether or not the first aid protocol should be included in the response.'
    ),
});
export type EmergencyAssistanceOutput = z.infer<typeof EmergencyAssistanceOutputSchema>;

export async function emergencyAssistance(
  input: EmergencyAssistanceInput
): Promise<EmergencyAssistanceOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("GOOGLE_API_KEY is not set. AI flow may not function correctly.");
    // Fallback or error for deployed environments if key is missing
    return {
        instructions: "AI service is temporarily unavailable. Please ensure API key is configured. For immediate help, use the SOS alert.",
        shouldIncludeFirstAid: false,
    };
  }
  return emergencyAssistanceFlow(input);
}

const shouldIncludeFirstAidTool = ai.defineTool({
  name: 'shouldIncludeFirstAid',
  description: 'Determines if first aid instructions should be included.',
  inputSchema: z.object({
    symptoms: z.string().describe('The symptoms being experienced by the user.'),
  }),
  outputSchema: z.boolean(),
},
async input => {
    // Basic logic to determine if first aid is needed.
    // Improved logic or a call to an external API could be implemented here.
    const symptoms = input.symptoms.toLowerCase();
    return symptoms.includes('pain') || symptoms.includes('bleeding') || symptoms.includes(' травма');
  }
);

const prompt = ai.definePrompt({
  name: 'emergencyAssistancePrompt',
  input: {schema: EmergencyAssistanceInputSchema},
  output: {schema: EmergencyAssistanceOutputSchema},
  tools: [shouldIncludeFirstAidTool],
  prompt: `You are an AI Emergency Assistant. A user will describe their symptoms, and you will provide immediate, step-by-step guidance tailored to their situation.

  Symptoms: {{{symptoms}}}
  {{#if voiceNoteUri}} Voice Note: {{media url=voiceNoteUri}}{{/if}}

  Based on the symptoms, decide if first aid instructions are needed by calling the shouldIncludeFirstAid tool.

  Provide step-by-step instructions. If the shouldIncludeFirstAid tool returns true, include basic first aid steps in the instructions.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  }
});

const emergencyAssistanceFlow = ai.defineFlow(
  {
    name: 'emergencyAssistanceFlow',
    inputSchema: EmergencyAssistanceInputSchema,
    outputSchema: EmergencyAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


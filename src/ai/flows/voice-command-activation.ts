
/**
 * @fileOverview Implements the voice command activation for the AI Emergency Assistant.
 *
 * - activateAssistant - A function to activate the AI Emergency Assistant with a voice command.
 * - ActivateAssistantInput - The input type for the activateAssistant function.
 * - ActivateAssistantOutput - The return type for the activateAssistant function, providing spoken instructions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActivateAssistantInputSchema = z.object({
  voiceCommand: z
    .string()
    .describe('The voice command spoken by the user to activate the assistant.'),
});
export type ActivateAssistantInput = z.infer<typeof ActivateAssistantInputSchema>;

const ActivateAssistantOutputSchema = z.object({
  spokenInstructions: z
    .string()
    .describe(
      'Spoken instructions and guidance for the user in the emergency, adapted to the situation.'
    ),
});
export type ActivateAssistantOutput = z.infer<typeof ActivateAssistantOutputSchema>;

export async function activateAssistant(input: ActivateAssistantInput): Promise<ActivateAssistantOutput> {
  return activateAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceCommandActivationPrompt',
  input: {schema: ActivateAssistantInputSchema},
  output: {schema: ActivateAssistantOutputSchema},
  prompt: `You are an AI Emergency Assistant. A user has activated you with the following voice command: "{{voiceCommand}}".

  Provide clear and concise spoken instructions to help the user. Focus on immediate safety and gathering essential information.
  Consider the user may not be able to easily use their hands, so instructions should be verbal and require minimal physical interaction with the device.
  Format your response as a single string of spoken instructions the user can immediately follow.
  Speak in a calm, reassuring, and clear tone. Be directive.
  If the user indicates distress or provides information suggesting a specific type of emergency (medical, fire, etc.) adapt your response to provide initial guidance.
`,
});

const activateAssistantFlow = ai.defineFlow(
  {
    name: 'activateAssistantFlow',
    inputSchema: ActivateAssistantInputSchema,
    outputSchema: ActivateAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

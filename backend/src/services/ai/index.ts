import OpenAI from 'openai';
import { ZodType } from 'zod';
import { config } from '../../config';
import { PROMPT } from './prompt';

const client = new OpenAI({ apiKey: config.openAiApiKey });

async function llmCall<T>(input: string, schema: ZodType<T>, name: string, customPrompt?: string): Promise<T> {
    try {
        const systemPrompt = customPrompt || PROMPT;
        
        const response = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: input,
                },
            ],
            response_format: { type: 'json_object' },
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        const parsedContent = JSON.parse(content);
        return schema.parse(parsedContent);
    } catch (err: unknown) {
        throw err;
    }
}

export { llmCall };

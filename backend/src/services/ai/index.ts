import OpenAI from 'openai';
import { ZodObject } from 'zod';
import { config } from '../../config';
import { PROMPT } from './prompt';

const client = new OpenAI({ apiKey: config.openAiApiKey });

async function llmCall(input: string, schema: ZodObject, name: string) {
    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: PROMPT,
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

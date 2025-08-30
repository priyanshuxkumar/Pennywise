import z from 'zod';
import { llmCall } from '.';

const LLMResponseFormatSchema = z.object({
    amount: z.number(),
    currency: z.string(),
    type: z.enum(['income', 'expense']),
    category: z.string(),
    description: z.string()
});

async function parseContent(text: string) {
    try {
        return await llmCall(text, LLMResponseFormatSchema, 'parse-transaction');
    } catch (err: unknown) {
        throw err;
    }
}

export { parseContent };

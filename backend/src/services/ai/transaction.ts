import z from 'zod';
import { llmCall } from '.';
import { EXTRACTION_PROMPT, PROMPT } from './prompt';

const BaseTransactionSchema = z.object({
    amount: z.number(),
    currency: z.string(),
    type: z.enum(['income', 'expense']),
});

const TransactionSchema = BaseTransactionSchema.extend({
    category: z.string(),
    description: z.string(),
});

const TransactionExtractionSchema = z.object({
    transactions: z.array(BaseTransactionSchema.extend({ rawText: z.string() })),
});

const SingleTransactionExtractionSchema = BaseTransactionSchema.extend({
    rawText: z.string(),
});

type Transaction = z.infer<typeof TransactionSchema>;

async function tryLLMCall<T>(text: string, schema: z.ZodType<T>, action: string, prompt: string): Promise<T | null> {
    try {
        const result = await llmCall<T>(text, schema, action, prompt);
        return result;
    } catch {
        return null;
    }
}

async function parseContent(text: string): Promise<Transaction[]> {
    let extraction = await tryLLMCall(text, TransactionExtractionSchema, 'extract-transactions', EXTRACTION_PROMPT);

    if (!extraction) {
        const single = await tryLLMCall(
            text,
            SingleTransactionExtractionSchema,
            'extract-single-transaction',
            EXTRACTION_PROMPT,
        );

        if (single) {
            extraction = { transactions: [single] };
        }
    }
    console.log(extraction)
    if (!extraction) {
        console.log('enter');
        const direct = await tryLLMCall<Transaction>(text, TransactionSchema, 'direct-transaction-parse', PROMPT);
        if (!direct) throw new Error('Failed to extract transactions');
        return [direct];
    }

    const processedTransactions: Transaction[] = [];
    for (const t of extraction.transactions) {
        console.log('t', t);
        const detailed = await llmCall<Transaction>(
            t.rawText,
            TransactionSchema,
            'process-transaction-details',
            PROMPT,
        );
        processedTransactions.push(detailed);
    }
    return processedTransactions;
}
export { parseContent, type Transaction };

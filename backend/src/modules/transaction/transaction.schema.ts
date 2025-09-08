import z from 'zod';

const TransactionParseSchema = z.object({
    content: z.string().nonempty({ message: 'Invalid value provided of transaction' }),
});

const CreateTransactionSchema = z.object({
    amount: z.number().nonoptional({ message: 'Amount is required' }),
    currency: z.string().nonempty({ message: 'Currency is required' }),
    type: z.enum(['income', 'expense']).nonoptional({ message: 'Type is required and must be either income or expense' }),
    category: z.string().nonempty({ message: 'Category is required' }),
    description: z.string().nonempty({ message: 'Description is required' }),
});

const UpdateTransactionSchema = z.object({
    amount: z.number().nonoptional({ message: 'Amount is required to update' }),
    currency: z.string().nonempty({ message: 'Currency is required to update' }),
    description: z.string().nonempty({message: 'Description cannot be empty'})
});

export type TransactionParse = z.infer<typeof TransactionParseSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;

export { TransactionParseSchema, CreateTransactionSchema, UpdateTransactionSchema };

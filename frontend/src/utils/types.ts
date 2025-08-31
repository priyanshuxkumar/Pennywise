export interface TransactionDataProps {
    id: string;
    amount: string;
    currency: string;
    type: 'income' | 'expense';
    category: string;
    description: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface TransactionCardProp extends TransactionDataProps {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

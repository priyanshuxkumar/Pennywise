import { and, desc, eq, gte, lte, SQL } from 'drizzle-orm';
import { db } from './index';
import { Transaction, transactions, User, users } from './schema';

async function getUser(email: string): Promise<User | null> {
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).$withCache();
        return user || null;
    } catch (err: unknown) {
        throw err;
    }
}

async function getUserById(id: string): Promise<User | null> {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, id)).$withCache();
        return user || null;
    } catch (err: unknown) {
        throw err;
    }
}

async function createUser({
    name,
    email,
    emailVerified,
    avatar,
}: {
    name: string;
    email: string;
    emailVerified: boolean;
    avatar?: string;
}): Promise<User | null> {
    try {
        const [user] = await db
            .insert(users)
            .values({
                name,
                email,
                emailVerified,
                avatar,
            })
            .returning();
        return user || null;
    } catch (err: unknown) {
        throw err;
    }
}

async function updateUser(userId: string, data: Partial<User>) {
    try {
        return await db.update(users).set(data).where(eq(users.id, userId));
    } catch (err: unknown) {
        throw err;
    }
}

async function removeUserById(id: string) {
    try {
        return await db.delete(users).where(eq(users.id, id));
    } catch (err: unknown) {
        throw err;
    }
}

async function createTransaction({
    amount,
    currency,
    type,
    category,
    description,
    userId,
}: {
    amount: number;
    currency: string;
    type: 'income' | 'expense';
    category: string;
    description: string;
    userId: string;
}): Promise<Transaction | null> {
    try {
        const [transaction] = await db
            .insert(transactions)
            .values({
                amount: amount.toString(),
                currency,
                type,
                category,
                description,
                userId,
            })
            .returning();
        return transaction || null;
    } catch (err: unknown) {
        throw err;
    }
}

async function getUserTransactions(
    userId: string,
    category?: string,
    stDate?: Date | string,
    enDate?: Date | string,
): Promise<Array<Transaction>> {
    const conditions: SQL[] = [eq(transactions.userId, userId)];
    if (category) {
        conditions.push(eq(transactions.category, category));
    }

    if (
        stDate &&
        enDate &&
        stDate !== 'null' &&
        enDate !== 'null' &&
        stDate !== 'undefined' &&
        enDate !== 'undefined'
    ) {
        const startDate = new Date(stDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(enDate);
        endDate.setHours(23, 59, 59, 999);

        conditions.push(gte(transactions.createdAt, startDate));
        conditions.push(lte(transactions.createdAt, endDate));
    }
    try {
        return await db
            .select()
            .from(transactions)
            .where(and(...conditions))
            .orderBy(desc(transactions.createdAt))
            .$withCache();
    } catch (err: unknown) {
        throw err;
    }
}

async function updateTransactionById(
    id: string,
    userId: string,
    payload: { amount: number; currency: string },
): Promise<Transaction> {
    try {
        const [updatedTransaction] = await db
            .update(transactions)
            .set({ amount: payload.amount.toString(), currency: payload.currency })
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
            .returning();
        return updatedTransaction;
    } catch (err: unknown) {
        throw err;
    }
}

async function removeTransactionById(id: string, userId: string): Promise<Transaction> {
    try {
        const [removedTransaction] = await db
            .delete(transactions)
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
            .returning();
        return removedTransaction;
    } catch (err: unknown) {
        throw err;
    }
}

export {
    getUser,
    getUserById,
    createUser,
    updateUser,
    removeUserById,
    createTransaction,
    getUserTransactions,
    updateTransactionById,
    removeTransactionById,
};

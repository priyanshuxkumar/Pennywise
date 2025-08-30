import { eq } from 'drizzle-orm';
import { db } from './index';
import { transactions, User, users } from './schema';

async function getUser(email: string): Promise<User | null> {
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).$withCache();
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

async function updateUser(userId: string, data: { refreshToken: string }) {
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

export { getUser, createUser, updateUser, removeUserById };

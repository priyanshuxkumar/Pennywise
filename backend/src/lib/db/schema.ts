import { InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { v4 as uuid } from 'uuid';

export const users = pgTable('users', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => uuid()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    role: varchar('role', {enum: ['user', 'admin']}).notNull().default('user'),
    avatar: text('avatar'),
    refreshToken: text('refresh_token'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const transactions = pgTable('transactions', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => uuid()),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export type User = InferSelectModel<typeof users>;
export type Transaction = InferSelectModel<typeof transactions>;

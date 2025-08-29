import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

export const user = pgTable('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => uuidv4()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

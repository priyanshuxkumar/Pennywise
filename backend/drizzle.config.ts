import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/config';

export default defineConfig({
    out: 'drizzle/migrations',
    schema: './src/lib/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: config.dbUrl,
    },
});

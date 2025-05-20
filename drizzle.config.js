import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './config/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_DFMBdKP51UOX@ep-wandering-morning-a4mzdswl-pooler.us-east-1.aws.neon.tech/neondb?",
  },
});

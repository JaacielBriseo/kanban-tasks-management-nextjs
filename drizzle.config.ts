// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	dbCredentials: {
		url: 'postgresql://postgres:postgres@localhost:5432/kanban-tasks-management'
	},
	schema: './db/schema.ts',
	out: './db/migrations',
});

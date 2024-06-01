import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const usersTable = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),

	// timestamps
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp('deleted_at'),
});

export const userBoardsRelation = relations(usersTable, ({ many }) => ({
	boards: many(boardsTable),
}));

export const boardsTable = pgTable('boards', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: integer('user_id')
		.references(() => usersTable.id, {
			onDelete: 'cascade',
		})
		.notNull(),

	// timestamps
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp('deleted_at'),
});

export const boardColumnsRelation = relations(boardsTable, ({ many }) => ({
	columns: many(columnsTable),
}));

export const columnsTable = pgTable('columns', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	color: text('color').notNull(),
	boardId: integer('board_id')
		.references(() => boardsTable.id, {
			onDelete: 'cascade',
		})
		.notNull(),

	// timestamps
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp('deleted_at'),
});

export const columnTasksRelation = relations(columnsTable, ({ many }) => ({
	tasks: many(tasksTable),
}));

export const tasksTable = pgTable('tasks', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	status: text('status').notNull(),
	columnId: integer('column_id')
		.references(() => columnsTable.id, {
			onDelete: 'cascade',
		})
		.notNull(),

	// timestamps
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp('deleted_at'),
});

export const taskSubtasksRelation = relations(tasksTable, ({ many }) => ({
	subtasks: many(subtasksTable),
}));

export const subtasksTable = pgTable('subtasks', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	isCompleted: boolean('isCompleted').notNull(),
	taskId: integer('task_id')
		.references(() => tasksTable.id, {
			onDelete: 'cascade',
		})
		.notNull(),

	// timestamps
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp('deleted_at'),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertBoard = typeof boardsTable.$inferInsert;
export type SelectBoard = typeof boardsTable.$inferSelect;

export type InsertColumn = typeof columnsTable.$inferInsert;
export type SelectColumn = typeof columnsTable.$inferSelect;

export type InsertTask = typeof tasksTable.$inferInsert;
export type SelectTask = typeof tasksTable.$inferSelect;

export type InsertSubtask = typeof subtasksTable.$inferInsert;
export type SelectSubtask = typeof subtasksTable.$inferSelect;
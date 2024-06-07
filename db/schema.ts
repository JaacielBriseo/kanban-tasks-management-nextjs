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

export const usersTableRelations = relations(usersTable, ({ many }) => ({
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

export const boardRelations = relations(boardsTable, ({ many, one }) => ({
	columns: many(columnsTable),
	user: one(usersTable, {
		fields: [boardsTable.userId],
		references: [usersTable.id],
	}),
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

export const columnTasksRelation = relations(columnsTable, ({ many, one }) => ({
	tasks: many(tasksTable),
	board: one(boardsTable, {
		fields: [columnsTable.boardId],
		references: [boardsTable.id],
	}),
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

export const taskSubtasksRelation = relations(tasksTable, ({ many, one }) => ({
	subtasks: many(subtasksTable),
	column: one(columnsTable, {
		fields: [tasksTable.columnId],
		references: [columnsTable.id],
	}),
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

export const subtaskTaskRelation = relations(subtasksTable, ({ one }) => ({
	task: one(tasksTable, {
		fields: [subtasksTable.taskId],
		references: [tasksTable.id],
	}),
}));

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type Board = typeof boardsTable.$inferSelect;
export type InsertBoard = typeof boardsTable.$inferInsert;

export type Column = typeof columnsTable.$inferSelect;
export type InsertColumn = typeof columnsTable.$inferInsert;

export type Task = typeof tasksTable.$inferSelect;
export type InsertTask = typeof tasksTable.$inferInsert;

export type Subtask = typeof subtasksTable.$inferSelect;
export type InsertSubtask = typeof subtasksTable.$inferInsert;


export type TaskWithSubtasks = Task & {
	subtasks: Subtask[];
};

export type ColumnWithTasks = Column & {
	tasks: TaskWithSubtasks[];
};

export type BoardWithColumns = Board & {
	columns: Column[];
};

export type UserWithBoards = User & {
	boards: BoardWithColumns[];
};
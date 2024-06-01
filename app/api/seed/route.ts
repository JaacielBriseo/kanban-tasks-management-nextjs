import { db } from '@/db/db';
import {
	usersTable,
	boardsTable,
	columnsTable,
	tasksTable,
	subtasksTable,
} from '@/db/schema';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
	await db.delete(usersTable);
	await db.delete(boardsTable);
	await db.delete(columnsTable);
	await db.delete(tasksTable);
	await db.delete(subtasksTable);

	const [demoUser] = await db
		.insert(usersTable)
		.values([
			{
				email: 'demo@user.com',
				password: 'password',
				name: 'Demo User',
			},
		])
		.returning();

	const [platformLaunch, marketingPlan, roadmap] = await db
		.insert(boardsTable)
		.values([
			{
				name: 'Platform Launch',
				userId: demoUser.id,
			},
			{
				name: 'Marketing Plan',
				userId: demoUser.id,
			},
			{
				name: 'Roadmap',
				userId: demoUser.id,
			},
		])
		.returning();

	const platformLaunchColumns = await db
		.insert(columnsTable)
		.values([
			{
				name: 'Todo',
				boardId: platformLaunch.id,
				color: 'blue',
			},
			{
				name: 'Doing',
				boardId: platformLaunch.id,
				color: 'yellow',
			},
			{
				name: 'Done',
				boardId: platformLaunch.id,
				color: 'green',
			},
		])
		.returning();

	const marketingPlanColumns = await db
		.insert(columnsTable)
		.values([
			{
				name: 'Todo',
				boardId: marketingPlan.id,
				color: 'blue',
			},
			{
				name: 'Doing',
				boardId: marketingPlan.id,
				color: 'yellow',
			},
			{
				name: 'Done',
				boardId: marketingPlan.id,
				color: 'green',
			},
		])
		.returning();

	const roadmapColumns = await db
		.insert(columnsTable)
		.values([
			{
				name: 'Now',
				boardId: roadmap.id,
				color: 'blue',
			},
			{
				name: 'Next',
				boardId: roadmap.id,
				color: 'yellow',
			},
			{
				name: 'Later',
				boardId: roadmap.id,
				color: 'green',
			},
		])
		.returning();

	const platformLaunchTasks = await db
		.insert(tasksTable)
		.values([
			{
				title: 'Build UI for onboarding flow',
				description: '',
				status: 'Todo',
				columnId: platformLaunchColumns[0].id,
			},
			{
				title: 'Build UI for search',
				description: '',
				status: 'Todo',
				columnId: platformLaunchColumns[0].id,
			},
			{
				title: 'Build settings UI',
				description: '',
				status: 'Todo',
				columnId: platformLaunchColumns[0].id,
			},
			{
				title: 'QA and test all major user journeys',
				description:
					'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',
				status: 'Todo',
				columnId: platformLaunchColumns[0].id,
			},
			{
				title: 'Design settings and search pages',
				description: '',
				status: 'Doing',
				columnId: platformLaunchColumns[1].id,
			},
			{
				title: 'Add account management endpoints',
				description: '',
				status: 'Doing',
				columnId: platformLaunchColumns[1].id,
			},
			{
				title: 'Design onboarding flow',
				description: '',
				status: 'Doing',
				columnId: platformLaunchColumns[1].id,
			},
			{
				title: 'Add search enpoints',
				description: '',
				status: 'Doing',
				columnId: platformLaunchColumns[1].id,
			},
			{
				title: 'Add authentication endpoints',
				description: '',
				status: 'Doing',
				columnId: platformLaunchColumns[1].id,
			},
			{
				title:
					'Research pricing points of various competitors and trial different business models',
				description:
					"We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
				status: 'Doing',
				columnId: platformLaunchColumns[1].id,
			},
			{
				title: 'Conduct 5 wireframe tests',
				description:
					'Ensure the layout continues to make sense and we have strong buy-in from potential users.',
				status: 'Done',
				columnId: platformLaunchColumns[2].id,
			},
			{
				title: 'Create wireframe prototype',
				description:
					'Create a greyscale clickable wireframe prototype to test our asssumptions so far.',
				status: 'Done',
				columnId: platformLaunchColumns[2].id,
			},
		])
		.returning();

	const marketingPlanTasks = await db
		.insert(tasksTable)
		.values([
			{
				title: 'Plan Product Hunt launch',
				description: '',
				status: 'Todo',
				columnId: marketingPlanColumns[0].id,
			},
			{
				title: 'Share on Show HN',
				description: '',
				status: '',
				columnId: marketingPlanColumns[0].id,
			},
			{
				title: 'Write launch article to publish on multiple channels',
				description: '',
				status: '',
				columnId: marketingPlanColumns[0].id,
			},
		])
		.returning();

	const roadmapTasks = await db
		.insert(tasksTable)
		.values([
			{
				title: 'Launch version one',
				description: '',
				status: '',
				columnId: roadmapColumns[0].id,
			},
			{
				title: 'Review early feedback and plan next steps for roadmap',
				description:
					"Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.",
				status: '',
				columnId: roadmapColumns[0].id,
			},
		])
		.returning();

	const platformLaunchSubtasks = await db.insert(subtasksTable).values([
		{
			title: 'Sign up page',
			isCompleted: true,
			taskId: platformLaunchTasks[0].id,
		},
		{
			title: 'Sign in page',
			isCompleted: false,
			taskId: platformLaunchTasks[0].id,
		},
		{
			title: 'Welcome page',
			isCompleted: false,
			taskId: platformLaunchTasks[0].id,
		},
		{
			title: 'Search page',
			isCompleted: false,
			taskId: platformLaunchTasks[1].id,
		},
		{
			title: 'Account page',
			isCompleted: false,
			taskId: platformLaunchTasks[2].id,
		},
		{
			title: 'Billing page',
			isCompleted: false,
			taskId: platformLaunchTasks[2].id,
		},
		{
			title: 'Internal testing',
			isCompleted: false,
			taskId: platformLaunchTasks[3].id,
		},
		{
			title: 'External testing',
			isCompleted: false,
			taskId: platformLaunchTasks[3].id,
		},
		{
			title: 'Settings - Account page',
			isCompleted: true,
			taskId: platformLaunchTasks[4].id,
		},
		{
			title: 'Settings - Billing page',
			isCompleted: true,
			taskId: platformLaunchTasks[4].id,
		},
		{
			title: 'Search page',
			isCompleted: false,
			taskId: platformLaunchTasks[5].id,
		},
		{
			title: 'Upgrade plan',
			isCompleted: true,
			taskId: platformLaunchTasks[5].id,
		},
		{
			title: 'Cancel plan',
			isCompleted: true,
			taskId: platformLaunchTasks[5].id,
		},
		{
			title: 'Update payment method',
			isCompleted: false,
			taskId: platformLaunchTasks[5].id,
		},
		{
			title: 'Sign up page',
			isCompleted: true,
			taskId: platformLaunchTasks[6].id,
		},
		{
			title: 'Sign in page',
			isCompleted: false,
			taskId: platformLaunchTasks[6].id,
		},
		{
			title: 'Welcome page',
			isCompleted: false,
			taskId: platformLaunchTasks[6].id,
		},
		{
			title: 'Add search endpoint',
			isCompleted: true,
			taskId: platformLaunchTasks[7].id,
		},

		{
			title: 'Define search filters',
			isCompleted: false,
			taskId: platformLaunchTasks[7].id,
		},
		{
			title: 'Define user model',
			isCompleted: true,
			taskId: platformLaunchTasks[8].id,
		},
		{
			title: 'Add auth endpoints',
			isCompleted: false,
			taskId: platformLaunchTasks[8].id,
		},
		{
			title: 'Research competitor pricing and business models',
			isCompleted: true,
			taskId: platformLaunchTasks[9].id,
		},
		{
			title: 'Outline a business model that works for our solution',
			isCompleted: false,
			taskId: platformLaunchTasks[9].id,
		},
		{
			title:
				'Talk to potential customers about our proposed solution and ask for fair price expectancy',
			isCompleted: false,
			taskId: platformLaunchTasks[9].id,
		},
		{
			title: 'Complete 5 wireframe prototype tests',
			isCompleted: true,
			taskId: platformLaunchTasks[10].id,
		},
		{
			title: 'Create clickable wireframe prototype in Balsamiq',
			isCompleted: true,
			taskId: platformLaunchTasks[11].id,
		},
	]);

	const marketingPlanSubtasks = await db.insert(subtasksTable).values([
		{
			title: 'Find hunter',
			isCompleted: false,
			taskId: marketingPlanTasks[0].id,
		},
		{
			title: 'Gather assets',
			isCompleted: false,
			taskId: marketingPlanTasks[0].id,
		},
		{
			title: 'Draft product page',
			isCompleted: false,
			taskId: marketingPlanTasks[0].id,
		},
		{
			title: 'Notify customers',
			isCompleted: false,
			taskId: marketingPlanTasks[0].id,
		},
		{
			title: 'Notify network',
			isCompleted: false,
			taskId: marketingPlanTasks[0].id,
		},
		{
			title: 'Launch!',
			isCompleted: false,
			taskId: marketingPlanTasks[0].id,
		},
		{
			title: 'Draft out HN post',
			isCompleted: false,
			taskId: marketingPlanTasks[1].id,
		},
		{
			title: 'Get feedback and refine',
			isCompleted: false,
			taskId: marketingPlanTasks[1].id,
		},
		{
			title: 'Publish post',
			isCompleted: false,
			taskId: marketingPlanTasks[1].id,
		},
		{
			title: 'Write article',
			isCompleted: false,
			taskId: marketingPlanTasks[2].id,
		},
		{
			title: 'Publish on LinkedIn',
			isCompleted: false,
			taskId: marketingPlanTasks[2].id,
		},
		{
			title: 'Publish on Inndie Hackers',
			isCompleted: false,
			taskId: marketingPlanTasks[2].id,
		},
		{
			title: 'Publish on Medium',
			isCompleted: false,
			taskId: marketingPlanTasks[2].id,
		},
	]);

	const roadmapSubtasks = await db.insert(subtasksTable).values([
		{
			title: 'Launch privately to our waitlist',
			isCompleted: false,
			taskId: roadmapTasks[0].id,
		},
		{
			title: 'Launch publicly on PH, HN, etc.',
			isCompleted: false,
			taskId: roadmapTasks[0].id,
		},
		{
			title: 'Interview 10 customers',
			isCompleted: false,
			taskId: roadmapTasks[1].id,
		},
		{
			title: 'Review common customer pain points and suggestions',
			isCompleted: false,
			taskId: roadmapTasks[1].id,
		},
		{
			title: 'Outline next steps for our roadmap',
			isCompleted: false,
			taskId: roadmapTasks[1].id,
		},
	]);

	return NextResponse.json(
		{
			message: 'Hello World',
		},
		{ status: 200 }
	);
};

'use client';

import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createTaskSchema } from '@/lib/schemas/create-task-schema';
import { useParams } from 'next/navigation';
import { boardColumnsQuery } from '@/lib/queries/board-columns-query';
import { useTransition } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { createTaskAction } from '@/lib/actions/create-task-action';
import { toast } from 'sonner';
import iconCross from '@/public/icon-cross.svg';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';

interface Props {
	onAfterSuccess?: () => void;
}

export const CreateTaskForm = ({ onAfterSuccess }: Props) => {
	const params = useParams();

	const [isPending, startTransition] = useTransition();

	const boardId = params.boardId;

	const { data: columns } = useQuery({
		queryKey: [`columns.from.${boardId}`],
		queryFn: async () => {
			return await boardColumnsQuery(Number(boardId));
		},
		enabled: !!boardId && !isNaN(Number(boardId)),
		initialData: [],
	});

	const form = useForm<z.infer<typeof createTaskSchema>>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			title: '',
			description: '',
			subtasks: ['Make coffee', 'Drink coffee & smile'],
			columnId: columns?.[0]?.id.toString() ?? '',
		},
	});

	const {
		fields: formSubtasks,
		append: appendSubtask,
		remove: removeSubtask,
	} = useFieldArray({
		// @ts-ignore
		name: 'subtasks',
		control: form.control,
	});

	function onSubmit(values: z.infer<typeof createTaskSchema>) {
		startTransition(() => {
			createTaskAction(values)
				.then(response => {
					if (response.ok) {
						toast.success('Task created successfully');
						if (!!onAfterSuccess) {
							onAfterSuccess();
						}
					} else {
						toast.error(response.error);
					}
				})
				.catch(error => {
					console.error(error);
					toast.error('Failed to create task');
				});
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-5'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='font-semibold text-sm text-grayish'>Title</FormLabel>
							<FormControl>
								<Input
									placeholder='e.g. Take coffee break'
									className='focus-visible:ring-main'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='font-semibold text-sm text-grayish'>Description</FormLabel>
							<FormControl>
								<Textarea
									className='resize-none w-full rounded-md p-2 focus-visible:ring-main'
									placeholder={`e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.`}
									{...field}
									rows={5}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='space-y-5'>
					<div className='space-y-2'>
						<h2 className='font-semibold text-sm text-grayish'>Subtasks</h2>
						{formSubtasks.map((subtask, index) => {
							return (
								<FormField
									key={subtask.id}
									control={form.control}
									name={`subtasks.${index}`}
									render={({ field }) => (
										<FormItem>
											<div className='flex items-center gap-5'>
												<FormControl>
													<Input
														className='focus-visible:ring-main'
														{...field}
													/>
												</FormControl>
												<button
													type='button'
													onClick={() => removeSubtask(index)}>
													<Image
														src={iconCross}
														alt='Remove Column'
													/>
													<span className='sr-only'>Remove Column</span>
												</button>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							);
						})}
					</div>

					<button
						type='button'
						disabled={isPending}
						onClick={() => appendSubtask('New Subtask')}
						className='bg-main/10 text-main font-bold py-[6px] rounded-full w-full'>
						+ Add New Subtask
					</button>
				</div>

				<FormField
					control={form.control}
					name='columnId'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='font-semibold text-sm text-grayish'>Status</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={columns?.[0]?.id.toString() ?? ''}>
								<FormControl>
									<SelectTrigger
										iconClassName='text-main opacity-100 size-5 stroke-[2.5]'
										className='border-0 ring-input ring-1 active:ring-main focus:ring-main focus-within:ring-main'>
										<SelectValue placeholder='Select a status' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{columns?.map(column => (
										<SelectItem
											key={column.id}
											value={column.id.toString()}>
											{column.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<button
					type='submit'
					disabled={isPending}
					className='bg-main text-white font-bold py-[6px] rounded-full w-full'>
					{isPending ? 'Creating Task...' : 'Create Task'}
				</button>
			</form>
		</Form>
	);
};

'use client';

import { useTransition } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import { createBoardAction } from '@/lib/actions/create-board-action';
import { createBoardSchema } from '@/lib/schemas/create-board-schema';

import {
	Form,
	FormItem,
	FormField,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import iconCross from '@/public/icon-cross.svg';

interface Props {
	afterSubmitFn?: (...args: any) => any;
}

export const CreateBoardForm = ({ afterSubmitFn }: Props) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<z.infer<typeof createBoardSchema>>({
		resolver: zodResolver(createBoardSchema),
		defaultValues: {
			boardName: '',
			boardColumns: [
				{
					name: 'To Do',
					color: '#49C4E5',
				},
				{
					name: 'In Progress',
					color: '#8471F2',
				},
			],
		},
	});

	const {
		append: appendColumn,
		remove: removeColumn,
		fields: formColumns,
	} = useFieldArray({
		// @ts-ignore
		name: 'boardColumns',
		control: form.control,
	});

	const onSubmit = (values: z.infer<typeof createBoardSchema>) => {
		startTransition(async () => {
			const response = await createBoardAction(values);

			if (response.ok) {
				toast.success(response.message);

				router.push(`/${response.boardId}`);
				router.refresh();

				if (!!afterSubmitFn) {
					afterSubmitFn();
				}
			} else {
				toast.error(response.error);
			}
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-5'>
				<FormField
					control={form.control}
					name='boardName'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='font-semibold text-sm text-grayish'>
								Board Name
							</FormLabel>
							<FormControl>
								<Input
									variant='main'
									placeholder='e.g. Web Design'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div>
					<h2 className='font-semibold text-sm text-grayish'>Board Columns</h2>
					{formColumns.map((item, index) => (
						<FormField
							key={item.id}
							control={form.control}
							name={`boardColumns.${index}`}
							render={({ field }) => (
								<FormItem>
									<FormLabel className='sr-only'>Column Name</FormLabel>
									<div className='flex items-center gap-5'>
										<FormControl>
											<Input
												variant='main'
												placeholder='e.g. To Do'
												value={field.value.name}
												onChange={e => {
													field.onChange({
														...field.value,
														name: e.target.value,
													});
												}}
											/>
										</FormControl>

										<div className='relative size-6'>
											<input
												name={`boardColumns.${index}.color`}
												id={`boardColumns.${index}.color`}
												type='color'
												value={field.value.color}
												onChange={e => {
													field.onChange({
														...field.value,
														color: e.target.value,
													});
												}}
												className='sr-only'
											/>
											<label
												htmlFor={`boardColumns.${index}.color`}
												style={{ backgroundColor: field.value.color }}
												className='absolute inset-0 size-6 rounded-full cursor-pointer'
											/>
										</div>

										<button
											type='button'
											onClick={() => removeColumn(index)}>
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
					))}
				</div>

				<button
					type='button'
					disabled={isPending}
					onClick={() =>
						appendColumn({ name: 'Column Name', color: '#000000' })
					}
					className='bg-main/10 text-main font-bold py-[6px] rounded-full w-full dark:bg-white'>
					+ Add New Column
				</button>

				<button
					type='submit'
					disabled={isPending}
					className='bg-main text-white font-bold py-[6px] rounded-full w-full'>
					{isPending ? 'Creating Board...' : 'Create New Board'}
				</button>
			</form>
		</Form>
	);
};

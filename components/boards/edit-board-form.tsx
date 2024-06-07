'use client';

import { useTransition } from 'react';

import Image from 'next/image';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { editBoardAction } from '@/lib/actions/edit-board-action';
import { editBoardSchema } from '@/lib/schemas/edit-board-schema';

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

import type { BoardWithColumns } from '@/db/schema';

interface Props {
	board: BoardWithColumns;
	afterSubmitFn?: (...args: any) => any;
}

export const EditBoardForm = ({ board, afterSubmitFn }: Props) => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof editBoardSchema>>({
		resolver: zodResolver(editBoardSchema),
		defaultValues: {
			boardName: board.name,
			boardColumns: board.columns.map(column => ({
				id: column.id,
				name: column.name,
				color: column.color,
				shouldDelete: false,
			})),
		},
	});

	const onSubmit = (values: z.infer<typeof editBoardSchema>) => {
		startTransition(async () => {
			const response = await editBoardAction({
				boardId: board.id,
				data: values,
			});

			if (response.ok) {
				toast.success(response.message);

				if (!!afterSubmitFn) {
					afterSubmitFn();
				}
			} else {
				toast.error(response.error);
			}
		});
	};

	const formColumns = form.watch('boardColumns');

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
					{formColumns.map((column, index) =>
						column.shouldDelete ? null : (
							<FormField
								key={column.id}
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
												onClick={() => {
													if (!!field.value.id) {
														field.onChange({
															...field.value,
															shouldDelete: true,
														});
													} else {
														form.setValue('boardColumns', [
															...formColumns.slice(0, index),
															...formColumns.slice(index + 1),
														]);
													}
												}}>
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
						)
					)}
				</div>

				<button
					type='button'
					disabled={isPending}
					onClick={() =>
						form.setValue('boardColumns', [
							...formColumns,
							{
								name: 'Column Name',
								color: '#000000',
								shouldDelete: false,
							},
						])
					}
					className='bg-main/10 text-main font-bold py-[6px] rounded-full w-full dark:bg-white'>
					+ Add New Column
				</button>

				<button
					type='submit'
					disabled={isPending}
					className='bg-main text-white font-bold py-[6px] rounded-full w-full'>
					{isPending ? 'Saving...' : 'Save Changes'}
				</button>
			</form>
		</Form>
	);
};

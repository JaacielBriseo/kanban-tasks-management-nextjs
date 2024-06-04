'use client';

import { useOptimistic, useTransition } from 'react';

import { toast } from 'sonner';

import { toggleSubtaskAction } from '@/lib/actions/toggle-subtask-action';

import type { Subtask } from '@/db/schema';

interface Props {
	subtask: Subtask;
}

export const SubtaskToggleCheckbox = ({ subtask }: Props) => {
	const [pending, startTransition] = useTransition();
	const [optimisticChecked, toggleOptimisticChecked] = useOptimistic(
		subtask.isCompleted,
		(_, newValue: boolean) => newValue
	);

	const onCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked;

		startTransition(async () => {
			toggleOptimisticChecked(checked);

			const response = await toggleSubtaskAction(subtask.id);

			if (!response.ok) {
				toast.error(response.error);
			}
		});
	};

	return (
		<label
			htmlFor={subtask.id.toString()}
			className='bg-light w-full p-2 rounded-md flex items-center justify-between relative'>
			<input
				type='checkbox'
				name='subtask-checkbox'
				id={subtask.id.toString()}
				checked={optimisticChecked}
				onChange={onCheckboxChange}
				className='w-1/12 peer caret-white accent-main size-[15px]'
			/>
			<span className='w-11/12 text-[15px] font-extrabold text-black peer-checked:text-grayish peer-checked:line-through'>
				{subtask.title}
			</span>

			{pending && (
				<span className='animate-spin absolute right-5'>&#x21bb;</span>
			)}
		</label>
	);
};

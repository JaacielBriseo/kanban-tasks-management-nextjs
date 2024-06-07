import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const textareaVariants = cva(
	'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'border-input bg-background ring-offset-background focus-visible:ring-ring',
				'main':
					'border-input bg-background ring-offset-background focus-visible:ring-main dark:focus-visible:ring-1 dark:bg-transparent dark:focus-visible:ring-offset-transparent dark:border-[#828FA3]',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<textarea
				className={cn(textareaVariants({ className, variant }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Textarea.displayName = 'Textarea';

export { Textarea };

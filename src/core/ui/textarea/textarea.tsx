import type { ComponentProps } from 'react';

import { cn } from '~/core/lib/cn';

import styles from './textarea.module.scss';

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot='textarea'
			className={cn(styles.textarea, className)}
			autoComplete='off'
			autoCorrect='off'
			spellCheck={false}
			{...props}
		/>
	);
}

export { Textarea };

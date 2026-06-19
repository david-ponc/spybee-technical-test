import type { ComponentProps } from 'react';

import { cn } from '~/core/lib/cn';

import styles from './spinner.module.scss';

interface SpinnerProps extends ComponentProps<'span'> {
	size?: number;
}

export function Spinner({ size = 16, className, ...props }: SpinnerProps) {
	return (
		<span
			className={cn(styles.spinner, className)}
			style={{ width: size, height: size }}
			role='status'
			aria-label='Loading'
			{...props}
		/>
	);
}

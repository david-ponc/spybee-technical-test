import type { ComponentProps } from 'react';

import { cn } from '~/core/lib/cn';

import styles from './skeleton.module.scss';

interface SkeletonProps extends ComponentProps<'span'> {
	variant?: 'default' | 'circle';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
	return (
		<span
			className={cn(styles.skeleton, variant === 'circle' && styles.circle, className)}
			data-slot='skeleton'
			{...props}
		/>
	);
}

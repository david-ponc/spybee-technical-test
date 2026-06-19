import type { ComponentProps } from 'react';

import { cn } from '~/core/lib/cn';

import styles from './badge.module.scss';

export type BadgeVariant =
	| 'default'
	| 'secondary'
	| 'outline'
	| 'ghost'
	| 'destructive'
	| 'warning'
	| 'success'
	| 'info';

export type BadgeSize = 'default' | 'sm';

interface BadgeProps extends ComponentProps<'span'> {
	variant?: BadgeVariant;
	size?: BadgeSize;
}

const variantClasses: Record<BadgeVariant, string> = {
	default: styles.variantsDefault,
	secondary: styles.variantsSecondary,
	outline: styles.variantsOutline,
	ghost: styles.variantsGhost,
	destructive: styles.variantsDestructive,
	warning: styles.variantsWarning,
	success: styles.variantsSuccess,
	info: styles.variantsInfo,
};

const sizeClasses: Record<BadgeSize, string> = {
	default: styles.sizesDefault,
	sm: styles.sizesSm,
};

export function Badge({
	className,
	variant = 'default',
	size = 'default',
	...props
}: BadgeProps) {
	return (
		<span
			data-slot='badge'
			className={cn(styles.badge, variantClasses[variant], sizeClasses[size], className)}
			{...props}
		/>
	);
}

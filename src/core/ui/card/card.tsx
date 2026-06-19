import type { ComponentProps } from 'react';

import { cn } from '~/core/lib/cn';

import styles from './card.module.scss';

function CardRoot({
	className,
	size = 'default',
	...props
}: ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
	return (
		<div
			data-slot='card'
			data-size={size}
			className={cn(styles.root, className)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: ComponentProps<'header'>) {
	return (
		<header data-slot='card-header' className={cn(styles.header, className)} {...props} />
	);
}

function CardTitle({ className, ...props }: ComponentProps<'p'>) {
	return <p data-slot='card-title' className={cn(styles.title, className)} {...props} />;
}

function CardDescription({ className, ...props }: ComponentProps<'p'>) {
	return (
		<p
			data-slot='card-description'
			className={cn(styles.description, className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: ComponentProps<'menu'>) {
	return (
		<menu data-slot='card-action' className={cn(styles.action, className)} {...props} />
	);
}

function CardPanel({ className, ...props }: ComponentProps<'section'>) {
	return (
		<section data-slot='card-panel' className={cn(styles.panel, className)} {...props} />
	);
}

function CardFooter({
	className,
	variant = 'default',
	...props
}: ComponentProps<'footer'> & { variant?: 'default' | 'ghost' }) {
	return (
		<footer
			data-slot='card-footer'
			className={cn(variant === 'ghost' ? styles.footerGhost : styles.footer, className)}
			{...props}
		/>
	);
}

export {
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardPanel,
	CardRoot,
	CardTitle,
};

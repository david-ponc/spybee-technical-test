import type { ComponentProps } from 'react';

import { cn } from '~/core/lib/cn';

import styles from './table.module.scss';

export function TableRoot({ className, ...props }: ComponentProps<'table'>) {
	return (
		<div data-slot='table-container' className={styles.container}>
			<table data-slot='table' className={cn(styles.root, className)} {...props} />
		</div>
	);
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
	return (
		<thead data-slot='table-header' className={cn(styles.header, className)} {...props} />
	);
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
	return (
		<tbody data-slot='table-body' className={cn(styles.body, className)} {...props} />
	);
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
	return (
		<tfoot data-slot='table-footer' className={cn(styles.footer, className)} {...props} />
	);
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
	return <tr data-slot='table-row' className={cn(styles.row, className)} {...props} />;
}

export function TableHead({ className, ...props }: ComponentProps<'th'>) {
	return <th data-slot='table-head' className={cn(styles.head, className)} {...props} />;
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
	return <td data-slot='table-cell' className={cn(styles.cell, className)} {...props} />;
}

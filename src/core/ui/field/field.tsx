'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';

import { cn, cnWithState } from '~/core/lib/cn';

import styles from './field.module.scss';

type FieldOrientation = 'vertical' | 'horizontal';

interface FieldRootProps extends BaseField.Root.Props {
	orientation?: FieldOrientation;
}

export function FieldRoot({
	className,
	orientation = 'vertical',
	...props
}: FieldRootProps) {
	const orientationClass =
		orientation === 'horizontal' ? styles.horizontal : styles.vertical;

	return (
		<BaseField.Root
			role='group'
			data-slot='field'
			data-orientation={orientation}
			className={cnWithState(orientationClass, className)}
			{...props}
		/>
	);
}

export function FieldItem({ className, ...props }: BaseField.Item.Props) {
	return (
		<BaseField.Item
			data-slot='field-item'
			className={cnWithState(styles.item, className)}
			{...props}
		/>
	);
}

export function FieldLabel({ className, ...props }: BaseField.Label.Props) {
	return (
		<BaseField.Label
			data-slot='field-label'
			className={cnWithState(styles.label, className)}
			{...props}
		/>
	);
}

export function FieldDescription({ className, ...props }: BaseField.Description.Props) {
	return (
		<BaseField.Description
			data-slot='field-description'
			className={cnWithState(styles.description, className)}
			{...props}
		/>
	);
}

export function FieldError({
	className,
	match,
	children,
	...props
}: BaseField.Error.Props) {
	if (!match) return null;

	return (
		<BaseField.Error
			role='alert'
			data-slot='field-error'
			match={match}
			className={cnWithState(styles.error, className)}
			{...props}
		>
			{children}
		</BaseField.Error>
	);
}

export function FieldSeparator({ children, className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot='field-separator'
			data-content={!!children}
			className={cn(styles.separator, className)}
			{...props}
		>
			{children && (
				<span className={styles.separatorContent} data-slot='field-separator-content'>
					{children}
				</span>
			)}
		</div>
	);
}

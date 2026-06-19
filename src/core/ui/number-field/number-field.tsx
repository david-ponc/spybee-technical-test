'use client';

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { cnWithState } from '~/core/lib/cn';

import styles from './number-field.module.scss';

function NumberFieldRoot({ className, ...props }: BaseNumberField.Root.Props) {
	return (
		<BaseNumberField.Root
			data-slot='number-field'
			className={cnWithState(styles.root, className)}
			{...props}
		/>
	);
}

function NumberFieldGroup({ className, ...props }: BaseNumberField.Group.Props) {
	return (
		<BaseNumberField.Group
			data-slot='number-field-group'
			className={cnWithState(styles.group, className)}
			{...props}
		/>
	);
}

function NumberFieldInput({ className, ...props }: BaseNumberField.Input.Props) {
	return (
		<BaseNumberField.Input
			data-slot='number-field-input'
			className={cnWithState(styles.input, className)}
			autoComplete='off'
			{...props}
		/>
	);
}

interface NumberFieldIncrementProps extends BaseNumberField.Increment.Props {
	variant?: 'default' | 'ghost';
}

function NumberFieldIncrement({
	className,
	variant = 'default',
	...props
}: NumberFieldIncrementProps) {
	return (
		<BaseNumberField.Increment
			data-slot='number-field-increment'
			className={cnWithState(
				variant === 'ghost' ? styles.incrementGhost : styles.increment,
				className,
			)}
			{...props}
		>
			<PlusIcon className='size-3.5' />
		</BaseNumberField.Increment>
	);
}

interface NumberFieldDecrementProps extends BaseNumberField.Decrement.Props {
	variant?: 'default' | 'ghost';
}

function NumberFieldDecrement({
	className,
	variant = 'default',
	...props
}: NumberFieldDecrementProps) {
	return (
		<BaseNumberField.Decrement
			data-slot='number-field-decrement'
			className={cnWithState(
				variant === 'ghost' ? styles.decrementGhost : styles.decrement,
				className,
			)}
			{...props}
		>
			<MinusIcon className='size-3.5' />
		</BaseNumberField.Decrement>
	);
}

function NumberFieldScrubArea({ className, ...props }: BaseNumberField.ScrubArea.Props) {
	return (
		<BaseNumberField.ScrubArea
			data-slot='number-field-scrub-area'
			className={cnWithState(styles.scrubArea, className)}
			{...props}
		/>
	);
}

function NumberFieldScrubAreaCursor({
	className,
	...props
}: BaseNumberField.ScrubAreaCursor.Props) {
	return (
		<BaseNumberField.ScrubAreaCursor
			data-slot='number-field-scrub-area-cursor'
			className={cnWithState(styles.scrubAreaCursor, className)}
			{...props}
		/>
	);
}

export type { NumberFieldDecrementProps, NumberFieldIncrementProps };
export {
	BaseNumberField,
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
	NumberFieldRoot,
	NumberFieldScrubArea,
	NumberFieldScrubAreaCursor,
};

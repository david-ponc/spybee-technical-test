'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { X } from 'lucide-react';
import type { HTMLAttributes, MouseEventHandler, ReactNode, RefObject } from 'react';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

import { cn } from '~/core/lib/cn';
import { Button } from '~/core/ui/button/button';
import { type BaseInput, Input } from '~/core/ui/input/input';

import styles from './tags-input.module.scss';

interface TagsInputContextValue {
	chips: string[];
	inputValue: string;
	setInputValue: (value: string) => void;
	addChips: (rawValues: string[]) => void;
	removeChip: (index: number) => void;
	removeLastChip: () => void;
	disabled: boolean;
	readOnly: boolean;
	inputRef: RefObject<HTMLInputElement | null>;
}

const TagsInputContext = createContext<TagsInputContextValue | null>(null);

function useTagsInputContext(componentName: string): TagsInputContextValue {
	const ctx = useContext(TagsInputContext);
	if (!ctx) {
		throw new Error(
			`<TagsInput.${componentName}> debe usarse dentro de <TagsInput.Root>.`,
		);
	}
	return ctx;
}

interface RootProps {
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
	onInputChange?: (query: string) => void;
	disabled?: boolean;
	readOnly?: boolean;
	name?: string;
	allowDuplicates?: boolean;
	children: ReactNode;
}

function TagsInputRoot({
	value,
	defaultValue,
	onChange,
	onInputChange,
	disabled = false,
	readOnly = false,
	name,
	allowDuplicates = false,
	children,
}: RootProps) {
	const isControlled = value !== undefined;
	const [internalChips, setInternalChips] = useState<string[]>(defaultValue ?? []);
	const [inputValue, setInputValueState] = useState('');
	const inputRef = useRef<HTMLInputElement | null>(null);

	const chips = isControlled ? value : internalChips;

	const commit = useCallback(
		(next: string[]) => {
			if (!isControlled) setInternalChips(next);
			onChange?.(next);
		},
		[isControlled, onChange],
	);

	const normalize = useCallback(
		(rawValues: string[]) =>
			rawValues
				.map((v) => v.trim())
				.filter((v) => v.length > 0 && (allowDuplicates || !chips.includes(v))),
		[chips, allowDuplicates],
	);

	const addChips = useCallback(
		(rawValues: string[]) => {
			const toAdd = normalize(rawValues);
			if (toAdd.length === 0) return;
			commit([...chips, ...toAdd]);
			setInputValueState('');
			onInputChange?.('');
		},
		[chips, normalize, commit, onInputChange],
	);

	const removeChip = useCallback(
		(index: number) => commit(chips.filter((_, i) => i !== index)),
		[chips, commit],
	);

	const removeLastChip = useCallback(() => {
		if (chips.length > 0) commit(chips.slice(0, -1));
	}, [chips, commit]);

	const setInputValue = useCallback(
		(val: string) => {
			setInputValueState(val);
			onInputChange?.(val);
		},
		[onInputChange],
	);

	return (
		<TagsInputContext.Provider
			value={{
				chips,
				inputValue,
				setInputValue,
				addChips,
				removeChip,
				removeLastChip,
				disabled,
				readOnly,
				inputRef,
			}}
		>
			{name && <input type='hidden' name={name} value={chips.join(',')} readOnly />}
			{children}
		</TagsInputContext.Provider>
	);
}

interface InputGroupProps extends useRender.ComponentProps<'div'> {
	className?: string;
}

function TagsInputInputGroup({
	className,
	onClick,
	render,
	children,
	...props
}: InputGroupProps) {
	const { inputRef, disabled, readOnly } = useTagsInputContext('InputGroup');

	const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
		if (!(e.target as HTMLElement).closest('[data-tags-chip]')) {
			inputRef.current?.focus();
		}
		onClick?.(e);
	};

	return useRender({
		defaultTagName: 'div',
		props: mergeProps<'div'>(
			{
				'data-slot': 'tags-input-group',
				'data-disabled': disabled || undefined,
				'data-readonly': readOnly || undefined,
				onClick: handleClick,
				className: cn(styles.inputGroup, className),
				children,
			} as HTMLAttributes<HTMLDivElement>,
			props,
		),
		render,
	});
}

interface ChipProps extends useRender.ComponentProps<'span'> {
	index: number;
	className?: string;
}

function TagsInputChip({ index, className, render, children, ...props }: ChipProps) {
	return useRender({
		defaultTagName: 'span',
		props: mergeProps<'span'>(
			{
				'data-slot': 'tags-input-chip',
				'data-tags-chip': true,
				'data-index': index,
				className: cn(styles.chip, className),
				children,
			} as HTMLAttributes<HTMLSpanElement>,
			props,
		),
		render,
	});
}

interface ChipDeleteProps
	extends Omit<Parameters<typeof Button>[0], 'variant' | 'size' | 'children'> {
	index: number;
	children?: ReactNode;
}

function TagsInputChipDelete({
	index,
	className,
	children,
	onClick,
	...props
}: ChipDeleteProps) {
	const { removeChip, disabled, readOnly } = useTagsInputContext('ChipDelete');

	const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.stopPropagation();
		if (!disabled && !readOnly) removeChip(index);
		onClick?.(e);
	};

	return (
		<Button
			variant='ghost'
			size='icon-xs'
			tabIndex={-1}
			aria-label='Eliminar'
			data-slot='tags-input-chip-delete'
			data-tags-chip-delete
			disabled={disabled}
			onClick={handleClick}
			className={cn(styles.chipDelete, className)}
			{...props}
		>
			{children ?? <X className='size-4' />}
		</Button>
	);
}

type TagsInputInputProps = Omit<
	Parameters<typeof Input>[0],
	'value' | 'onChange' | 'ref' | 'className'
> & { className?: string };

function TagsInputInput({
	className,
	onKeyDown,
	onPaste,
	...props
}: TagsInputInputProps) {
	const {
		inputValue,
		setInputValue,
		addChips,
		removeLastChip,
		disabled,
		readOnly,
		inputRef,
	} = useTagsInputContext('Input');

	const handleKeyDown: BaseInput.Props['onKeyDown'] = (e) => {
		if (e.key === 'Enter' && inputValue.trim()) {
			e.preventDefault();
			addChips([inputValue]);
		}
		if (e.key === 'Backspace' && inputValue === '') {
			e.preventDefault();
			removeLastChip();
		}
		onKeyDown?.(e);
	};

	const handlePaste: BaseInput.Props['onPaste'] = (e) => {
		const text = e.clipboardData.getData('text');
		if (text.includes(',')) {
			e.preventDefault();
			addChips(text.split(','));
		}
		onPaste?.(e);
	};

	return (
		<Input
			ref={inputRef}
			data-slot='tags-input-input'
			value={inputValue}
			onChange={(e) => setInputValue(e.target.value)}
			onKeyDown={handleKeyDown}
			onPaste={handlePaste}
			disabled={disabled}
			readOnly={readOnly}
			className={cn(styles.input, className)}
			{...props}
		/>
	);
}

export {
	TagsInputChip,
	TagsInputChipDelete,
	TagsInputInput,
	TagsInputInputGroup,
	TagsInputRoot,
};

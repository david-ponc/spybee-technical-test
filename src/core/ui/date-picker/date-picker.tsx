/** biome-ignore-all lint/suspicious/noExplicitAny: Complex types from react-day-picker */
'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { cn, cnWithState } from '~/core/lib/cn';
import { Calendar } from '~/core/ui/calendar';
import { Popover, PopoverPopup, PopoverTrigger } from '~/core/ui/popover/popover';

import styles from './date-picker.module.scss';

export const DatePickerRoot = Popover.Root;

interface DatePickerTriggerProps extends ComponentProps<typeof PopoverTrigger> {
	placeholder?: string;
}

export function DatePickerTrigger({
	className,
	placeholder = 'Seleccionar fecha',
	children,
	...props
}: DatePickerTriggerProps) {
	return (
		<PopoverTrigger
			data-slot='date-picker-trigger'
			className={cnWithState(styles.trigger, className)}
			{...props}
		>
			<span className={styles.triggerContent}>
				<CalendarIcon aria-hidden='true' className={styles.icon} />
				{children || <span className={styles.placeholder}>{placeholder}</span>}
			</span>
		</PopoverTrigger>
	);
}

interface DatePickerPopupProps
	extends Omit<ComponentProps<typeof PopoverPopup>, 'onSelect'> {
	mode?: 'single' | 'multiple' | 'range';
	selected?: any;
	onSelect?: any;
	calendarProps?: any;
}

export function DatePickerPopup({
	className,
	mode = 'single',
	selected,
	onSelect,
	calendarProps,
	...props
}: DatePickerPopupProps) {
	return (
		<PopoverPopup
			align='start'
			data-slot='date-picker-popup'
			className={cnWithState(styles.popup, className)}
			{...props}
		>
			<Calendar
				mode={mode}
				className={styles.calendar}
				selected={selected}
				onSelect={onSelect}
				{...calendarProps}
			/>
		</PopoverPopup>
	);
}

interface DatePickerProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	className?: string;
	calendarProps?: any;
}

export function DatePicker({
	value,
	onChange,
	placeholder = 'Seleccionar fecha',
	className,
	calendarProps,
}: DatePickerProps) {
	const [open, setOpen] = useState(false);

	const handleSelect = (date: Date | undefined) => {
		onChange?.(date);
		setOpen(false);
	};

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<DatePickerTrigger
				data-slot='date-picker-trigger'
				className={cn(styles.trigger, className)}
				placeholder={placeholder}
			>
				{value ? format(value, 'PPP', { locale: es }) : null}
			</DatePickerTrigger>
			<DatePickerPopup
				mode='single'
				selected={value}
				onSelect={handleSelect}
				calendarProps={calendarProps}
			/>
		</Popover.Root>
	);
}

interface DateRangePickerProps {
	value?: DateRange;
	onChange?: (range: DateRange | undefined) => void;
	placeholder?: string;
	className?: string;
	calendarProps?: any;
}

export function DateRangePicker({
	value,
	onChange,
	placeholder = 'Seleccionar rango de fechas',
	className,
	calendarProps,
}: DateRangePickerProps) {
	const [open, setOpen] = useState(false);

	const handleSelect = (range: DateRange | undefined) => {
		onChange?.(range);
		if (range?.from && range?.to) {
			setOpen(false);
		}
	};

	const formatDate = (date: Date | undefined) => {
		if (!date) return null;
		return format(date, 'LLL dd, y', { locale: es });
	};

	const displayText = value?.from
		? value.to
			? `${formatDate(value.from)} - ${formatDate(value.to)}`
			: formatDate(value.from)
		: null;

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<DatePickerTrigger
				data-slot='date-picker-trigger'
				className={cn(styles.trigger, className)}
				placeholder={placeholder}
			>
				{displayText}
			</DatePickerTrigger>
			<DatePickerPopup
				mode='range'
				selected={value}
				onSelect={handleSelect}
				calendarProps={{
					...calendarProps,
					defaultMonth: value?.from,
				}}
			/>
		</Popover.Root>
	);
}

'use client';

import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';

import { cn } from '~/core/lib/cn';

import styles from './calendar.module.scss';

type CalendarProps = DayPickerProps & {
	className?: string;
};

export function Calendar({ className, classNames, ...props }: CalendarProps) {
	return (
		<DayPicker
			locale={es}
			className={cn(styles.calendar, className)}
			classNames={{
				months: cn(styles.months, classNames?.months),
				month: cn(styles.month, classNames?.month),
				month_caption: cn(styles.monthCaption, classNames?.month_caption),
				nav: cn(styles.nav, classNames?.nav),
				weekdays: cn(styles.weekdays, classNames?.weekdays),
				weekday: cn(styles.weekday, classNames?.weekday),
				weeks: cn(styles.weeks, classNames?.weeks),
				week: cn(styles.week, classNames?.week),
				day: cn(styles.day, classNames?.day),
				selected: cn(styles.daySelected, classNames?.selected),
				today: cn(styles.dayToday, classNames?.today),
				outside: cn(styles.dayOutside, classNames?.outside),
				disabled: cn(styles.dayDisabled, classNames?.disabled),
				range_start: cn(styles.dayRangeStart, classNames?.range_start),
				range_end: cn(styles.dayRangeEnd, classNames?.range_end),
				range_middle: cn(styles.dayRangeMiddle, classNames?.range_middle),
				hidden: cn(styles.dayHidden, classNames?.hidden),
				...classNames,
			}}
			components={{
				Chevron: ({ orientation }) => {
					if (orientation === 'left') {
						return <ChevronLeft className='size-4' />;
					}
					return <ChevronRight className='size-4' />;
				},
				...props.components,
			}}
			showOutsideDays
			{...props}
		/>
	);
}

'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { Field } from '~/core/ui/field';
import { Select } from '~/core/ui/select';

import { STATS_PERIOD_OPTIONS } from '../types';
import styles from './period-filter.module.scss';

const PERIOD_OPTIONS = [
	{ value: STATS_PERIOD_OPTIONS.SevenDays, label: 'Últimos 7 días' },
	{ value: STATS_PERIOD_OPTIONS.FifteenDays, label: 'Últimos 15 días' },
	{ value: STATS_PERIOD_OPTIONS.ThirtyDays, label: 'Últimos 30 días' },
	{ value: STATS_PERIOD_OPTIONS.NinetyDays, label: 'Últimos 90 días' },
	{ value: STATS_PERIOD_OPTIONS.SixMonths, label: 'Últimos 6 meses' },
];

export function PeriodFilter() {
	const [period, setPeriod] = useQueryState(
		'period',
		parseAsString.withDefault(STATS_PERIOD_OPTIONS.ThirtyDays),
	);

	return (
		<Field.Root className={styles.field}>
			<Field.Label className={styles.label}>Periodo</Field.Label>
			<Select.Root
				items={PERIOD_OPTIONS}
				value={period}
				onValueChange={(value) => setPeriod(value)}
			>
				<Select.Trigger className={styles.trigger}>
					<Select.Value />
				</Select.Trigger>
				<Select.Popup>
					{PERIOD_OPTIONS.map((option) => (
						<Select.Item key={option.value} value={option.value}>
							{option.label}
						</Select.Item>
					))}
				</Select.Popup>
			</Select.Root>
		</Field.Root>
	);
}

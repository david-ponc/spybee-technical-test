'use client';

import {
	CheckCircle2,
	Clock,
	FolderOpen,
	Percent,
	PlusCircle,
	TriangleAlert,
} from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';

import { roundToMaxTwoDecimals } from '../lib/format-number';
import { useIncidentStatsQuery } from '../queries/hooks';
import { STATS_PERIOD_OPTIONS, type StatsPeriod } from '../types';
import styles from './incident-stats.module.scss';
import { PeriodFilter } from './period-filter';
import { StatCard } from './stat-card';

function formatNumber(value: number): string {
	return value.toLocaleString('es-ES');
}

function formatRate(value: number): string {
	return `${roundToMaxTwoDecimals(value * 100)}%`;
}

function formatAverageDays(value: number | null): string {
	if (value === null) {
		return 'Sin datos';
	}

	return `${roundToMaxTwoDecimals(value)} días`;
}

export function IncidentStats() {
	const [period] = useQueryState(
		'period',
		parseAsString.withDefault(STATS_PERIOD_OPTIONS.ThirtyDays),
	);

	const validatedPeriod = useMemo(
		() =>
			Object.values(STATS_PERIOD_OPTIONS).includes(period as StatsPeriod)
				? (period as StatsPeriod)
				: STATS_PERIOD_OPTIONS.ThirtyDays,
		[period],
	);

	const { data, isPending } = useIncidentStatsQuery({ period: validatedPeriod });

	const cards = useMemo(
		() => [
			{
				title: 'Abiertas',
				value: data ? formatNumber(data.open) : 0,
				subtitle: 'actualmente',
				icon: <FolderOpen />,
			},
			{
				title: 'Creadas',
				value: data ? formatNumber(data.created) : 0,
				subtitle: 'en el periodo',
				icon: <PlusCircle />,
				comparison: data
					? { value: data.created, previousValue: data.createdPreviousPeriod }
					: undefined,
			},
			{
				title: 'Cerradas',
				value: data ? formatNumber(data.closed) : 0,
				subtitle: 'en el periodo',
				icon: <CheckCircle2 />,
				comparison: data
					? { value: data.closed, previousValue: data.closedPreviousPeriod }
					: undefined,
			},
			{
				title: 'Tasa de cierre',
				value: data ? formatRate(data.closingRate) : '0%',
				subtitle: 'cerradas / creadas',
				icon: <Percent />,
			},
			{
				title: 'Tiempo medio resolución',
				value: data ? formatAverageDays(data.averageResolutionDays) : 'Sin datos',
				subtitle: 'días promedio',
				icon: <Clock />,
				comparison: data
					? {
							value: data.averageResolutionDays,
							previousValue: data.averageResolutionDaysPreviousPeriod,
						}
					: undefined,
			},
			{
				title: 'Vencidas activas',
				value: data ? formatNumber(data.overdue) : 0,
				subtitle: 'estado actual',
				icon: <TriangleAlert />,
			},
		],
		[data],
	);

	return (
		<section className={styles.section} aria-labelledby='incident-stats-heading'>
			<div className={styles.header}>
				<h2 id='incident-stats-heading' className={styles.title}>
					Estadísticas
				</h2>
				<PeriodFilter />
			</div>
			<div className={styles.grid}>
				{cards.map((card) => (
					<StatCard
						key={card.title}
						title={card.title}
						value={card.value}
						subtitle={card.subtitle}
						icon={card.icon}
						comparison={card.comparison}
						isLoading={isPending}
					/>
				))}
			</div>
		</section>
	);
}

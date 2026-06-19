import type { ReactNode } from 'react';

import { Card } from '~/core/ui/card';
import { Skeleton } from '~/core/ui/skeleton';

import { roundToMaxTwoDecimals } from '../lib/format-number';
import styles from './stat-card.module.scss';

interface Comparison {
	value: number | null;
	previousValue: number | null;
}

interface StatCardProps {
	title: string;
	value: ReactNode;
	subtitle: string;
	icon?: ReactNode;
	comparison?: Comparison;
	isLoading?: boolean;
}

function formatComparison(
	current: number | null,
	previous: number | null,
): string | null {
	if (current === null || previous === null) {
		return '— vs periodo anterior';
	}

	const diff = current - previous;

	if (diff === 0) {
		return `0 vs periodo anterior`;
	}

	const sign = diff > 0 ? '↑' : '↓';
	return `${sign}${roundToMaxTwoDecimals(Math.abs(diff))} vs periodo anterior`;
}

export function StatCard({
	title,
	value,
	subtitle,
	icon,
	comparison,
	isLoading = false,
}: StatCardProps) {
	return (
		<Card.Root className={styles.root}>
			<Card.Header className={styles.header}>
				<Card.Title className={styles.title}>{title}</Card.Title>
				{icon && <Card.Action className={styles.action}>{icon}</Card.Action>}
			</Card.Header>
			<Card.Panel className={styles.panel}>
				{isLoading ? (
					<Skeleton className={styles.valueSkeleton} />
				) : (
					<span className={styles.value}>{value}</span>
				)}
				{isLoading ? (
					<Skeleton className={styles.subtitleSkeleton} />
				) : (
					<span className={styles.subtitle}>{subtitle}</span>
				)}
				{comparison &&
					(isLoading ? (
						<Skeleton className={styles.comparisonSkeleton} />
					) : (
						<span className={styles.comparison}>
							{formatComparison(comparison.value, comparison.previousValue ?? null)}
						</span>
					))}
			</Card.Panel>
		</Card.Root>
	);
}

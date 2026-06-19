import { Skeleton } from '~/core/ui/skeleton';

import styles from './incident-heatmap-skeleton.module.scss';

export function IncidentHeatmapSkeleton() {
	return <Skeleton className={styles.mapSkeleton} />;
}

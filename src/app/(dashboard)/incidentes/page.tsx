import { verifySession } from '~/core/data-access/verify-session';
import { IncidentHeatmap } from '~/features/incident-heatmap/components/incident-heatmap';
import { IncidentList } from '~/features/incident-list/components/incident-list';
import { IncidentStats } from '~/features/incident-stats/components/incident-stats';

import styles from './page.module.scss';

export default async function Page() {
	await verifySession();

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<h1 className={styles.title}>Incidentes</h1>
			</header>
			<IncidentStats />
			<IncidentHeatmap />
			<IncidentList />
		</div>
	);
}

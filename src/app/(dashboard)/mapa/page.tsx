import { verifySession } from '~/core/data-access/verify-session';
import { IncidentDetailDialog } from '~/features/incident-detail/components/incident-detail-dialog';
import { Mapbox } from '~/features/map/components/map';
import { Toolbar } from '~/features/toolbar/toolbar';

import styles from './page.module.scss';

export default async function Page() {
	await verifySession();

	return (
		<div className={styles.page}>
			<Mapbox />
			<Toolbar />
			<IncidentDetailDialog />
		</div>
	);
}

import type { User } from '~/contexts/dashboard/incidents/domain/incident';
import { Tooltip } from '~/core/ui/tooltip';

import styles from './incident-assignees.module.scss';

interface IncidentAssigneesProps {
	assignees: User[];
}

export function IncidentAssignees({ assignees }: IncidentAssigneesProps) {
	if (assignees.length === 0) {
		return <span className={styles.empty}>Sin asignados</span>;
	}

	const visible = assignees.slice(0, 3);
	const remaining = assignees.length - visible.length;
	const names = assignees.map((assignee) => assignee.name).join(', ');

	const trigger = (
		<button type='button' className={styles.group} aria-label={`Asignados: ${names}`}>
			{visible.map((assignee) => (
				// biome-ignore lint/performance/noImgElement: Avatars use external URLs; next/image would require remotePatterns config.
				<img
					key={assignee.id}
					src={assignee.avatarUrl}
					alt={assignee.name}
					className={styles.avatar}
				/>
			))}
			{remaining > 0 && <span className={styles.overflow}>+{remaining}</span>}
		</button>
	);

	return (
		<Tooltip.Root>
			<Tooltip.Trigger render={trigger} />
			<Tooltip.Popup>{names}</Tooltip.Popup>
		</Tooltip.Root>
	);
}

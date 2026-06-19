import {
	INCIDENT_STATUS,
	type IncidentStatus,
} from '~/contexts/dashboard/incidents/domain/incident';
import { Badge } from '~/core/ui/badge';

const statusLabels: Record<IncidentStatus, string> = {
	[INCIDENT_STATUS.Open]: 'Abierto',
	[INCIDENT_STATUS.Closed]: 'Cerrado',
	[INCIDENT_STATUS.OnPause]: 'En pausa',
};

const statusVariants: Record<IncidentStatus, 'info' | 'success' | 'warning'> = {
	[INCIDENT_STATUS.Open]: 'info',
	[INCIDENT_STATUS.Closed]: 'success',
	[INCIDENT_STATUS.OnPause]: 'warning',
};

interface IncidentStatusBadgeProps {
	status: IncidentStatus;
}

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
	return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}

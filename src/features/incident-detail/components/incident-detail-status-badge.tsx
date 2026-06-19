import {
	INCIDENT_STATUS,
	type IncidentStatus,
} from '~/contexts/building/incidents/domain/incident';
import { Badge } from '~/core/ui/badge';

const statusLabels: Record<IncidentStatus, string> = {
	[INCIDENT_STATUS.Open]: 'Abierta',
	[INCIDENT_STATUS.InProgress]: 'En progreso',
	[INCIDENT_STATUS.Resolved]: 'Resuelta',
	[INCIDENT_STATUS.Closed]: 'Cerrada',
};

const statusVariants: Record<
	IncidentStatus,
	'info' | 'warning' | 'success' | 'secondary'
> = {
	[INCIDENT_STATUS.Open]: 'info',
	[INCIDENT_STATUS.InProgress]: 'warning',
	[INCIDENT_STATUS.Resolved]: 'success',
	[INCIDENT_STATUS.Closed]: 'secondary',
};

interface IncidentDetailStatusBadgeProps {
	status: IncidentStatus;
}

export function IncidentDetailStatusBadge({ status }: IncidentDetailStatusBadgeProps) {
	return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}

import { PRIORITY, type Priority } from '~/contexts/dashboard/incidents/domain/incident';
import { Badge } from '~/core/ui/badge';

const priorityLabels: Record<Priority, string> = {
	[PRIORITY.High]: 'Alta',
	[PRIORITY.Medium]: 'Media',
	[PRIORITY.Low]: 'Baja',
};

const priorityVariants: Record<Priority, 'destructive' | 'warning' | 'success'> = {
	[PRIORITY.High]: 'destructive',
	[PRIORITY.Medium]: 'warning',
	[PRIORITY.Low]: 'success',
};

interface IncidentPriorityBadgeProps {
	priority: Priority;
}

export function IncidentPriorityBadge({ priority }: IncidentPriorityBadgeProps) {
	return <Badge variant={priorityVariants[priority]}>{priorityLabels[priority]}</Badge>;
}

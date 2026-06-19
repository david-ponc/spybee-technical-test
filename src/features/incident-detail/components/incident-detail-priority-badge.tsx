import { PRIORITY, type Priority } from '~/contexts/building/incidents/domain/incident';
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

interface IncidentDetailPriorityBadgeProps {
	priority: Priority;
}

export function IncidentDetailPriorityBadge({
	priority,
}: IncidentDetailPriorityBadgeProps) {
	return <Badge variant={priorityVariants[priority]}>{priorityLabels[priority]}</Badge>;
}

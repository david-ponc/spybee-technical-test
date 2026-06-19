import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDueDate(date: Date | null): string {
	if (!date) return 'Sin fecha';

	return format(date, 'dd MMM yyyy', { locale: es });
}

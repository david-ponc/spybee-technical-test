'use client';

import type { Table as TanstackTable } from '@tanstack/react-table';

import type { Incident } from '~/contexts/dashboard/incidents/domain/incident';
import { Button } from '~/core/ui/button';

import styles from './incident-pagination.module.scss';

interface IncidentPaginationProps {
	table: TanstackTable<Incident>;
	total: number;
}

export function IncidentPagination({ table, total }: IncidentPaginationProps) {
	const { pageIndex, pageSize } = table.getState().pagination;
	const pageCount = table.getPageCount();
	const start = total === 0 ? 0 : pageIndex * pageSize + 1;
	const end = Math.min((pageIndex + 1) * pageSize, total);

	return (
		<div className={styles.container}>
			<span className={styles.info}>
				Mostrando {start}-{end} de {total} incidentes
			</span>

			<div className={styles.controls}>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Anterior
				</Button>

				<span className={styles.pageInfo}>
					Página {pageIndex + 1} de {pageCount}
				</span>

				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Siguiente
				</Button>
			</div>
		</div>
	);
}

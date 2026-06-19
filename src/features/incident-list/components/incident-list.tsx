'use client';

import { getCoreRowModel, type SortingState, useReactTable } from '@tanstack/react-table';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';

import { useIncidentsQuery } from '../queries/hooks';
import styles from './incident-list.module.scss';
import { IncidentListSkeleton } from './incident-list-skeleton';
import { IncidentPagination } from './incident-pagination';
import { IncidentTable, incidentListColumns } from './incident-table';

const PAGE_SIZE = 10;
const DEFAULT_SORT = 'priority:desc,dueDate:asc';

function parseSortParam(sortString: string): SortingState {
	return sortString.split(',').map((part) => {
		const [id, order] = part.split(':');
		return { id, desc: order === 'desc' };
	});
}

function serializeSort(sorting: SortingState): string {
	return sorting.map(({ id, desc }) => `${id}:${desc ? 'desc' : 'asc'}`).join(',');
}

export function IncidentList() {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
	const [sort, setSort] = useQueryState('sort', parseAsString.withDefault(DEFAULT_SORT));

	const { data, isPending, error } = useIncidentsQuery({
		page,
		limit: PAGE_SIZE,
		sort,
	});

	const pagination = useMemo(
		() => ({ pageIndex: page - 1, pageSize: PAGE_SIZE }),
		[page],
	);
	const sorting = useMemo(() => parseSortParam(sort), [sort]);

	const table = useReactTable({
		data: data?.data ?? [],
		columns: incidentListColumns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		enableSortingRemoval: false,
		rowCount: data?.meta.total ?? 0,
		state: { pagination, sorting },
		onPaginationChange: (updater) => {
			const next = typeof updater === 'function' ? updater(pagination) : updater;
			setPage(next.pageIndex + 1);
		},
		onSortingChange: (updater) => {
			const next = typeof updater === 'function' ? updater(sorting) : updater;
			setSort(serializeSort(next));
			setPage(1);
		},
	});

	if (isPending) {
		return <IncidentListSkeleton />;
	}

	if (error) {
		return (
			<div className={styles.error}>
				Error al cargar incidentes. Intenta recargar la página.
				{error.message}
			</div>
		);
	}

	if (!data) return null;

	return (
		<div className={styles.container}>
			<IncidentTable table={table} />
			<IncidentPagination table={table} total={data.meta.total} />
		</div>
	);
}

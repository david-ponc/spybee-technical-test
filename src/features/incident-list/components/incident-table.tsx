'use client';

import {
	type ColumnDef,
	flexRender,
	type Table as TanstackTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import type { Incident } from '~/contexts/dashboard/incidents/domain/incident';
import { Table } from '~/core/ui/table';

import { formatDueDate } from '../lib/format-due-date';
import { IncidentAssignees } from './incident-assignees';
import { IncidentPriorityBadge } from './incident-priority-badge';
import { IncidentStatusBadge } from './incident-status-badge';
import styles from './incident-table.module.scss';

interface IncidentTableProps {
	table: TanstackTable<Incident>;
}

export function IncidentTable({ table }: IncidentTableProps) {
	return (
		<div className={styles.wrapper}>
			<Table.Root className={styles.table}>
				<Table.Header>
					{table.getHeaderGroups().map((headerGroup) => (
						<Table.Row key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<Table.Head key={header.id} className={styles.head}>
									{header.isPlaceholder ? null : header.column.getCanSort() ? (
										<button
											type='button'
											className={styles.sortButton}
											onClick={header.column.getToggleSortingHandler()}
										>
											{flexRender(header.column.columnDef.header, header.getContext())}
											<SortIcon sorted={header.column.getIsSorted()} />
										</button>
									) : (
										flexRender(header.column.columnDef.header, header.getContext())
									)}
								</Table.Head>
							))}
						</Table.Row>
					))}
				</Table.Header>
				<Table.Body>
					{table.getRowModel().rows.length === 0 ? (
						<Table.Row>
							<Table.Cell colSpan={table.getAllColumns().length} className={styles.empty}>
								No hay incidentes para mostrar
							</Table.Cell>
						</Table.Row>
					) : (
						table.getRowModel().rows.map((row) => (
							<Table.Row key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<Table.Cell key={cell.id} className={styles.cell}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</Table.Cell>
								))}
							</Table.Row>
						))
					)}
				</Table.Body>
			</Table.Root>
		</div>
	);
}

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
	if (sorted === 'asc') return <ArrowUp size={14} />;
	if (sorted === 'desc') return <ArrowDown size={14} />;
	return <ArrowUpDown size={14} className={styles.sortIconInactive} />;
}

export const incidentListColumns: ColumnDef<Incident>[] = [
	{
		accessorKey: 'sequenceId',
		header: 'ID',
		cell: ({ row }) => <span className={styles.idCell}>#{row.original.sequenceId}</span>,
		enableSorting: false,
		size: 80,
	},
	{
		accessorKey: 'title',
		header: 'Título',
		enableSorting: false,
		cell: ({ row }) => <span className={styles.titleCell}>{row.original.title}</span>,
	},
	{
		accessorKey: 'priority',
		header: 'Prioridad',
		cell: ({ row }) => <IncidentPriorityBadge priority={row.original.priority} />,
	},
	{
		accessorKey: 'status',
		header: 'Estado',
		cell: ({ row }) => <IncidentStatusBadge status={row.original.status} />,
		enableSorting: false,
	},
	{
		accessorKey: 'assignees',
		header: 'Asignados',
		cell: ({ row }) => <IncidentAssignees assignees={row.original.assignees} />,
		enableSorting: false,
	},
	{
		accessorFn: (row: Incident) => row.owner,
		id: 'owner',
		header: 'Creado por',
		cell: ({ row }) => {
			const owner = row.original.owner;
			if (!owner) return <span className={styles.muted}>Sin asignar</span>;

			return (
				<div className={styles.owner}>
					{/* biome-ignore lint/performance/noImgElement: Avatars use external URLs; next/image would require remotePatterns config. */}
					<img src={owner.avatarUrl} alt={owner.name} className={styles.ownerAvatar} />
					<span>{owner.name}</span>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'dueDate',
		header: 'Vencimiento',
		cell: ({ row }) => formatDueDate(row.original.dueDate),
	},
];

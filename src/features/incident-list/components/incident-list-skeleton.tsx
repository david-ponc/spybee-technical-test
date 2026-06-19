import { Skeleton } from '~/core/ui/skeleton';
import { Table } from '~/core/ui/table';

import styles from './incident-list-skeleton.module.scss';
import tableStyles from './incident-table.module.scss';

const ROWS = 10;

const skeletonRows = Array.from({ length: ROWS }, (_, index) => ({
	id: `incident-list-skeleton-row-${index}`,
}));

export function IncidentListSkeleton() {
	return (
		<div className={styles.container}>
			<div className={tableStyles.wrapper}>
				<Table.Root className={tableStyles.table}>
					<Table.Header>
						<Table.Row>
							<Table.Head className={tableStyles.head}>ID</Table.Head>
							<Table.Head className={tableStyles.head}>Título</Table.Head>
							<Table.Head className={tableStyles.head}>Prioridad</Table.Head>
							<Table.Head className={tableStyles.head}>Estado</Table.Head>
							<Table.Head className={tableStyles.head}>Asignados</Table.Head>
							<Table.Head className={tableStyles.head}>Creado por</Table.Head>
							<Table.Head className={tableStyles.head}>Vencimiento</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{skeletonRows.map((row) => (
							<Table.Row key={row.id}>
								<Table.Cell className={tableStyles.cell}>
									<Skeleton className={styles.idSkeleton} />
								</Table.Cell>
								<Table.Cell className={tableStyles.cell}>
									<Skeleton className={styles.titleSkeleton} />
								</Table.Cell>
								<Table.Cell className={tableStyles.cell}>
									<Skeleton className={styles.badgeSkeleton} />
								</Table.Cell>
								<Table.Cell className={tableStyles.cell}>
									<Skeleton className={styles.badgeSkeleton} />
								</Table.Cell>
								<Table.Cell className={tableStyles.cell}>
									<Skeleton className={styles.assigneesSkeleton} />
								</Table.Cell>
								<Table.Cell className={tableStyles.cell}>
									<Skeleton className={styles.ownerSkeleton} />
								</Table.Cell>
								<Table.Cell className={tableStyles.cell}>
									<Skeleton className={styles.dateSkeleton} />
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</div>

			<div className={styles.pagination}>
				<Skeleton className={styles.infoSkeleton} />
				<div className={styles.controlsSkeleton}>
					<Skeleton className={styles.buttonSkeleton} />
					<Skeleton className={styles.pageInfoSkeleton} />
					<Skeleton className={styles.buttonSkeleton} />
				</div>
			</div>
		</div>
	);
}

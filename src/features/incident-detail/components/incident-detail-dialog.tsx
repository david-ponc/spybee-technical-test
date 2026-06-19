'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileIcon, MapPinIcon } from 'lucide-react';

import { Badge } from '~/core/ui/badge';
import { Dialog } from '~/core/ui/dialog';

import { useIncidentDetailStore } from '../stores/use-incident-detail-store';
import styles from './incident-detail-dialog.module.scss';
import { IncidentDetailPriorityBadge } from './incident-detail-priority-badge';
import { IncidentDetailStatusBadge } from './incident-detail-status-badge';

const CATEGORY_LABELS: Record<string, string> = {
	electric: 'Eléctrico',
	stability: 'Estabilidad',
	'design-coordination': 'Coordinación de Diseños Duvan',
	'risk-prevention': 'Prevención de riesgos',
	'general-observation': 'Observación General',
	infrastructure: 'Infraestructura',
	structural: 'Estructural',
	'soil-study': 'Estudio Suelos',
	foundation: 'Cimentación',
	urbanism: 'Urbanismo',
};

function formatDate(date: Date | null | undefined): string | null {
	if (!date) return null;
	return format(date, 'PPp', { locale: es });
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className={styles.row}>
			<span className={styles.label}>{label}</span>
			<div className={styles.value}>{children}</div>
		</div>
	);
}

export function IncidentDetailDialog() {
	const incident = useIncidentDetailStore((s) => s.selectedIncident);
	const clear = useIncidentDetailStore((s) => s.clearIncident);

	return (
		<Dialog.Root
			open={incident !== null}
			onOpenChange={(open) => {
				if (!open) clear();
			}}
		>
			{incident && (
				<Dialog.Popup>
					<Dialog.Header>
						<Dialog.Title>{incident.title}</Dialog.Title>
						<Dialog.Description>Detalle del incidente</Dialog.Description>
					</Dialog.Header>
					<Dialog.Panel>
						<div className={styles.detail}>
							<DetailRow label='Descripción'>{incident.description}</DetailRow>

							<DetailRow label='Prioridad'>
								<IncidentDetailPriorityBadge priority={incident.priority} />
							</DetailRow>

							<DetailRow label='Categoría'>
								{CATEGORY_LABELS[incident.category] ?? incident.category}
							</DetailRow>

							<DetailRow label='Estado'>
								<IncidentDetailStatusBadge status={incident.status} />
							</DetailRow>

							<DetailRow label='Edificio'>
								<span className={styles.value}>#{incident.buildingId}</span>
							</DetailRow>

							<DetailRow label='Ubicación'>
								<span className={styles.value}>
									<MapPinIcon
										size={14}
										style={{
											display: 'inline',
											verticalAlign: '-2px',
											marginRight: '4px',
										}}
									/>
									{incident.coordinates[1].toFixed(6)},{' '}
									{incident.coordinates[0].toFixed(6)}
								</span>
							</DetailRow>

							{incident.locationDetails && (
								<DetailRow label='Detalles de localización'>
									{incident.locationDetails}
								</DetailRow>
							)}

							{incident.dueDate && (
								<DetailRow label='Fecha de vencimiento'>
									{formatDate(incident.dueDate)}
								</DetailRow>
							)}

							{incident.observations && (
								<DetailRow label='Observaciones'>{incident.observations}</DetailRow>
							)}

							<DetailRow label='Etiquetas'>
								{incident.tags.length > 0 ? (
									<ul className={styles.badgeList}>
										{incident.tags.map((tag) => (
											<li key={tag}>
												<Badge variant='secondary' size='sm'>
													{tag}
												</Badge>
											</li>
										))}
									</ul>
								) : (
									<span className={styles.empty}>Sin etiquetas</span>
								)}
							</DetailRow>

							<DetailRow label='Asignados'>
								{incident.assignees.length > 0 ? (
									<ul className={styles.badgeList}>
										{incident.assignees.map((assignee) => (
											<li key={assignee}>
												<Badge variant='secondary' size='sm'>
													{assignee}
												</Badge>
											</li>
										))}
									</ul>
								) : (
									<span className={styles.empty}>Sin asignados</span>
								)}
							</DetailRow>

							<DetailRow label='Archivos adjuntos'>
								{incident.files.length > 0 ? (
									<ul className={styles.fileList}>
										{incident.files.map((file) => (
											<li key={file.id}>
												<a
													href={file.publicUrl}
													target='_blank'
													rel='noopener noreferrer'
													className={styles.fileLink}
												>
													<FileIcon size={16} />
													{file.name}
												</a>
											</li>
										))}
									</ul>
								) : (
									<span className={styles.empty}>Sin archivos adjuntos</span>
								)}
							</DetailRow>

							<DetailRow label='Fecha de creación'>
								{formatDate(incident.createdAt)}
							</DetailRow>

							<DetailRow label='Última actualización'>
								{formatDate(incident.updatedAt)}
							</DetailRow>
						</div>
					</Dialog.Panel>
					<Dialog.Footer showCloseButton />
				</Dialog.Popup>
			)}
		</Dialog.Root>
	);
}

'use client';

import { Card } from '~/core/ui/card';

import { useIncidentHeatmapMap } from '../hooks/use-incident-heatmap-map';
import styles from './incident-heatmap.module.scss';
import { IncidentHeatmapSkeleton } from './incident-heatmap-skeleton';

export function IncidentHeatmap() {
	const { mapContainer, isPending, error } = useIncidentHeatmapMap();

	return (
		<section className={styles.section}>
			<Card.Root className={styles.card}>
				<Card.Header>
					<Card.Title>Mapa de calor</Card.Title>
					<Card.Description>
						Visualiza las áreas con mayor concentración de incidentes en el area.
					</Card.Description>
				</Card.Header>
				<Card.Panel className={styles.panel}>
					{isPending ? (
						<IncidentHeatmapSkeleton />
					) : (
						<div ref={mapContainer} className={styles.map} />
					)}
					{error && (
						<div className={styles.overlayError}>
							Error al cargar el mapa de calor. Intenta recargar la página.
						</div>
					)}
				</Card.Panel>
			</Card.Root>
		</section>
	);
}

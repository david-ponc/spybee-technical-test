'use client';

import { useMapbox } from '../hooks/use-mapbox';

export function Mapbox() {
	const { mapContainer } = useMapbox();

	return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}

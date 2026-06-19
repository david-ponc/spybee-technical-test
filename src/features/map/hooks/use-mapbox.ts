'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { Incident } from '~/contexts/building/incidents/domain/incident';
import { env } from '~/core/env';
import { useColorScheme } from '~/core/hooks/use-color-scheme';
import { useIncidentDetailStore } from '~/features/incident-detail/stores/use-incident-detail-store';
import { useIncidents } from '~/features/incidents/queries/hooks';

import { useBuildingSelectionStore } from '../stores/use-building-selection-store';

const BUILDING_SOURCE = {
	source: 'composite',
	sourceLayer: 'building',
} as const;

const MAPBOX_STYLES = {
	light: 'mapbox://styles/mapbox/streets-v12',
	dark: 'mapbox://styles/mapbox/dark-v11',
} as const;

const BUILDING_LAYER_ID = '3d-buildings';

function createMarkerElement(): HTMLDivElement {
	const element = document.createElement('div');
	element.style.cssText = `
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: #ef4444;
		border: 2px solid white;
		box-shadow: 0 2px 6px rgba(0,0,0,0.3);
	`;

	element.innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 18 18">
    <path opacity="0.3" d="M7.63796 3.48996L2.21295 12.89C1.60795 13.9399 2.36395 15.25 3.57495 15.25H14.425C15.636 15.25 16.392 13.9399 15.787 12.89L10.362 3.48996C9.75696 2.44996 8.24296 2.44996 7.63796 3.48996Z" fill="currentColor"></path>
    <path d="M7.63796 3.48996L2.21295 12.89C1.60795 13.9399 2.36395 15.25 3.57495 15.25H14.425C15.636 15.25 16.392 13.9399 15.787 12.89L10.362 3.48996C9.75696 2.44996 8.24296 2.44996 7.63796 3.48996Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
    <path d="M9 6.75V9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
    <path d="M9 13.5C8.448 13.5 8 13.05 8 12.5C8 11.95 8.448 11.5 9 11.5C9.552 11.5 10 11.9501 10 12.5C10 13.0499 9.552 13.5 9 13.5Z" fill="currentColor"></path>
  </svg>
	`;

	return element;
}

function findLabelLayerId(map: mapboxgl.Map): string | undefined {
	const layers = map.getStyle().layers;

	for (const layer of layers) {
		if (layer.type === 'symbol' && layer.layout?.['text-field']) {
			return layer.id;
		}
	}

	return undefined;
}

function addBuildingLayer(map: mapboxgl.Map) {
	if (map.getLayer(BUILDING_LAYER_ID)) return;

	const labelLayerId = findLabelLayerId(map);

	map.addLayer(
		{
			id: BUILDING_LAYER_ID,
			source: 'composite',
			'source-layer': 'building',
			filter: ['==', 'extrude', 'true'],
			type: 'fill-extrusion',
			minzoom: 14,
			paint: {
				'fill-extrusion-color': [
					'case',
					['boolean', ['feature-state', 'selected'], false],
					'#3b82f6',
					['boolean', ['feature-state', 'has-incident'], false],
					'#ef4444',
					'#aaa',
				],
				'fill-extrusion-height': ['get', 'height'],
				'fill-extrusion-base': ['get', 'min_height'],
				'fill-extrusion-opacity': 0.6,
			},
		},
		labelLayerId,
	);
}

export function useMapbox() {
	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<mapboxgl.Map | null>(null);
	const markersRef = useRef<mapboxgl.Marker[]>([]);
	const colorScheme = useColorScheme();
	const currentStyleRef = useRef(MAPBOX_STYLES[colorScheme]);
	const [mapReady, setMapReady] = useState(false);
	const selectedBuilding = useBuildingSelectionStore((s) => s.selectedBuilding);
	const { data: incidents = [] } = useIncidents();
	const prevFeatureRef = useRef<{
		id: number;
		source: string;
		sourceLayer: string;
	} | null>(null);

	const handleBuildingSelect = useEffectEvent(
		(feature: mapboxgl.GeoJSONFeature, lngLat: mapboxgl.LngLat) => {
			useBuildingSelectionStore.getState().selectBuilding({
				id: feature.id as number,
				coordinates: [lngLat.lng, lngLat.lat],
				height: feature.properties?.height,
				minHeight: feature.properties?.min_height,
			});
		},
	);

	const handleClearSelection = useEffectEvent(() => {
		useBuildingSelectionStore.getState().clearSelection();
	});

	const handleMarkerClick = useEffectEvent((incident: Incident) => {
		useIncidentDetailStore.getState().selectIncident(incident);
	});

	useEffect(() => {
		if (!mapContainer.current || map.current) return;

		mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: currentStyleRef.current,
			center: [-75.5686, 6.2476],
			zoom: 15,
			pitch: 60,
			bearing: -20,
		});

		const currentMap = map.current;

		currentMap.on('load', () => {
			if (!map.current) return;

			addBuildingLayer(map.current);

			map.current.on('click', (e) => {
				if (!map.current) return;

				const features = map.current.queryRenderedFeatures(e.point, {
					layers: [BUILDING_LAYER_ID],
				});

				if (features.length > 0) {
					handleBuildingSelect(features[0], e.lngLat);
				} else {
					handleClearSelection();
				}
			});

			map.current.on('mousemove', BUILDING_LAYER_ID, () => {
				if (!map.current) return;
				map.current.getCanvas().style.cursor = 'pointer';
			});

			map.current.on('mouseleave', BUILDING_LAYER_ID, () => {
				if (!map.current) return;
				map.current.getCanvas().style.cursor = '';
			});

			setMapReady(true);
		});

		currentMap.on('style.load', () => {
			if (!map.current) return;

			addBuildingLayer(map.current);
			setMapReady(true);
		});

		return () => {
			currentMap.remove();
			map.current = null;
			setMapReady(false);
		};
	}, []);

	useEffect(() => {
		if (!mapContainer.current) return;

		let rafId: number;

		const resizeObserver = new ResizeObserver(() => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				map.current?.resize();
			});
		});

		resizeObserver.observe(mapContainer.current);

		return () => {
			cancelAnimationFrame(rafId);
			resizeObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!map.current || !mapReady) return;

		const nextStyle = MAPBOX_STYLES[colorScheme];
		if (currentStyleRef.current === nextStyle) return;

		currentStyleRef.current = nextStyle;
		map.current.setStyle(nextStyle);
		setMapReady(false);
	}, [colorScheme, mapReady]);

	useEffect(() => {
		if (!mapReady || !map.current) return;

		if (prevFeatureRef.current) {
			map.current.setFeatureState(
				{
					...BUILDING_SOURCE,
					id: prevFeatureRef.current.id,
				},
				{ selected: false },
			);
			prevFeatureRef.current = null;
		}

		if (selectedBuilding) {
			map.current.setFeatureState(
				{
					...BUILDING_SOURCE,
					id: selectedBuilding.id,
				},
				{ selected: true },
			);
			prevFeatureRef.current = {
				id: selectedBuilding.id,
				...BUILDING_SOURCE,
			};
		}
	}, [selectedBuilding, mapReady]);

	useEffect(() => {
		if (!mapReady || !map.current) return;

		for (const incident of incidents) {
			map.current.setFeatureState(
				{
					...BUILDING_SOURCE,
					id: incident.buildingId,
				},
				{ 'has-incident': true },
			);
		}

		return () => {
			if (!map.current) return;
			for (const incident of incidents) {
				map.current.setFeatureState(
					{
						...BUILDING_SOURCE,
						id: incident.buildingId,
					},
					{ 'has-incident': false },
				);
			}
		};
	}, [incidents, mapReady]);

	useEffect(() => {
		if (!mapReady || !map.current) return;

		for (const marker of markersRef.current) {
			marker.remove();
		}
		markersRef.current = [];

		for (const incident of incidents) {
			const element = createMarkerElement();

			element.style.cursor = 'pointer';
			element.addEventListener('click', (e) => {
				e.stopPropagation();
				handleMarkerClick(incident);
			});

			const marker = new mapboxgl.Marker({ element })
				.setLngLat(incident.coordinates)
				.addTo(map.current);

			markersRef.current.push(marker);
		}

		return () => {
			for (const marker of markersRef.current) {
				marker.remove();
			}
			markersRef.current = [];
		};
	}, [incidents, mapReady]);

	return { mapContainer };
}

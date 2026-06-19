'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

import { env } from '~/core/env';
import { type ColorScheme, useColorScheme } from '~/core/hooks/use-color-scheme';

import { useIncidentHeatmapQuery } from '../queries/hooks';
import type { IncidentHeatmapResponse } from '../types';

const SOURCE_ID = 'incidents-heatmap';
const LAYER_ID = 'incidents-heatmap';

const MAPBOX_STYLES: Record<ColorScheme, string> = {
	light: 'mapbox://styles/mapbox/streets-v12',
	dark: 'mapbox://styles/mapbox/dark-v11',
};

const HEATMAP_COLORS: Record<ColorScheme, mapboxgl.Expression> = {
	light: [
		'interpolate',
		['linear'],
		['heatmap-density'],
		0,
		'rgba(33, 102, 172, 0)',
		0.2,
		'rgb(103, 169, 207)',
		0.4,
		'rgb(209, 229, 240)',
		0.6,
		'rgb(253, 219, 199)',
		0.8,
		'rgb(239, 138, 98)',
		1,
		'rgb(178, 24, 43)',
	],
	dark: [
		'interpolate',
		['linear'],
		['heatmap-density'],
		0,
		'rgba(0, 0, 0, 0)',
		0.2,
		'rgb(0, 200, 255)',
		0.4,
		'rgb(0, 255, 170)',
		0.6,
		'rgb(255, 255, 0)',
		0.8,
		'rgb(255, 140, 0)',
		1,
		'rgb(255, 0, 80)',
	],
};

function addHeatmapLayer(map: mapboxgl.Map, colorScheme: ColorScheme) {
	if (map.getSource(SOURCE_ID) || map.getLayer(LAYER_ID)) return;

	map.addSource(SOURCE_ID, {
		type: 'geojson',
		data: { type: 'FeatureCollection', features: [] },
	});

	map.addLayer({
		id: LAYER_ID,
		type: 'heatmap',
		source: SOURCE_ID,
		paint: {
			'heatmap-weight': ['get', 'weight'],
			'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
			'heatmap-color': HEATMAP_COLORS[colorScheme],
			'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
			'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0.5],
		},
	});
}

export function useIncidentHeatmapMap() {
	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<mapboxgl.Map | null>(null);
	const [mapReady, setMapReady] = useState(false);
	const colorScheme = useColorScheme();
	const colorSchemeRef = useRef(colorScheme);
	const currentStyleRef = useRef(MAPBOX_STYLES[colorScheme]);
	const previousDataRef = useRef<IncidentHeatmapResponse | null>(null);
	const hasFittedBoundsRef = useRef(false);
	const { data, isPending, error } = useIncidentHeatmapQuery();

	useEffect(() => {
		colorSchemeRef.current = colorScheme;
	}, [colorScheme]);

	useEffect(() => {
		if (!mapContainer.current || map.current) return;

		mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: currentStyleRef.current,
			center: [-74.05772, 4.652022],
			zoom: 12,
		});

		const currentMap = map.current;

		currentMap.on('load', () => {
			if (!map.current) return;

			addHeatmapLayer(map.current, colorSchemeRef.current);
			setMapReady(true);
		});

		currentMap.on('style.load', () => {
			if (!map.current) return;

			addHeatmapLayer(map.current, colorSchemeRef.current);
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
		if (!mapReady || !map.current || !data) return;

		const source = map.current.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
		if (!source) return;

		source.setData(data);

		const isNewData = previousDataRef.current !== data;
		previousDataRef.current = data;

		if (isNewData) {
			hasFittedBoundsRef.current = false;
		}

		if (hasFittedBoundsRef.current) return;

		const bounds = new mapboxgl.LngLatBounds();
		let hasBounds = false;

		for (const feature of data.features) {
			bounds.extend(feature.geometry.coordinates);
			hasBounds = true;
		}

		if (hasBounds) {
			map.current.fitBounds(bounds, { padding: 40, maxZoom: 15 });
			map.current.resize();
			hasFittedBoundsRef.current = true;
		}
	}, [data, mapReady]);

	return { mapContainer, isPending, error };
}

'use client';

import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

function getInitialColorScheme(): ColorScheme {
	if (typeof window === 'undefined') return 'light';

	return window.matchMedia(DARK_MODE_QUERY).matches ? 'dark' : 'light';
}

export function useColorScheme(): ColorScheme {
	const [colorScheme, setColorScheme] = useState<ColorScheme>(getInitialColorScheme);

	useEffect(() => {
		const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

		const handleChange = (event: MediaQueryListEvent) => {
			setColorScheme(event.matches ? 'dark' : 'light');
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, []);

	return colorScheme;
}

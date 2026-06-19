import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5,
				refetchOnWindowFocus: false,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
	if (typeof window === 'undefined') {
		return makeQueryClient();
	}

	browserQueryClient ??= makeQueryClient();
	return browserQueryClient;
}

/** biome-ignore-all lint/suspicious/noExplicitAny: Need flexibility for @base-ui/react className functions */
export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ');
}

export function cnWithState(
	...classes: (
		| string
		| undefined
		| null
		| false
		| ((...args: any[]) => string | undefined)
	)[]
): (...args: any[]) => string {
	return (...args: any[]) =>
		classes
			.map((c) => (typeof c === 'function' ? c(...args) : c))
			.filter(Boolean)
			.join(' ');
}

import { mergeProps, useRender } from '@base-ui/react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '~/core/lib/cn';

import { Spinner } from '../loaders/spinner';
import styles from './button.module.scss';

type ButtonVariant =
	| 'default'
	| 'secondary'
	| 'outline'
	| 'ghost'
	| 'link'
	| 'destructive'
	| 'destructive-outline';

type ButtonSize = 'default' | 'sm' | 'xs' | 'icon' | 'icon-sm' | 'icon-xs';

interface ButtonProps extends useRender.ComponentProps<'button'> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
	default: styles.variantsDefault,
	secondary: styles.variantsSecondary,
	outline: styles.variantsOutline,
	ghost: styles.variantsGhost,
	link: styles.variantsLink,
	destructive: styles.variantsDestructive,
	'destructive-outline': styles.variantsDestructiveOutline,
};

const sizeClasses: Record<ButtonSize, string> = {
	default: styles.sizesDefault,
	sm: styles.sizesSm,
	xs: styles.sizesXs,
	icon: styles.sizesIcon,
	'icon-sm': styles.sizesIconSm,
	'icon-xs': styles.sizesIconXs,
};

export function Button({
	className,
	variant = 'default',
	size = 'default',
	render,
	children,
	loading = false,
	disabled: disabledProp,
	...props
}: ButtonProps) {
	const isDisabled = Boolean(disabledProp || loading);
	const typeValue: ButtonHTMLAttributes<HTMLButtonElement>['type'] = render
		? undefined
		: 'button';

	const defaultProps = {
		children: (
			<>
				{loading ? <span className={styles.hiddenContent}>{children}</span> : children}
				{loading && (
					<Spinner
						className={styles.loadingIndicator}
						data-slot='button-loading-indicator'
						size={16}
					/>
				)}
			</>
		),
		className: cn(
			styles.button,
			variantClasses[variant],
			sizeClasses[size],
			isDisabled && styles.disabled,
			loading && styles.loading,
			className,
		),
		'aria-disabled': loading || undefined,
		'data-loading': loading ? '' : undefined,
		'data-disabled': isDisabled ? '' : undefined,
		'data-slot': 'button',
		disabled: isDisabled,
		type: typeValue,
	};

	return useRender({
		defaultTagName: 'button',
		props: mergeProps<'button'>(defaultProps, props),
		render,
	});
}

export const buttonVariants = {
	variants: Object.keys(variantClasses) as ButtonVariant[],
	sizes: Object.keys(sizeClasses) as ButtonSize[],
};

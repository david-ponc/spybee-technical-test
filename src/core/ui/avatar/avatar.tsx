'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ComponentProps } from 'react';

import { cn, cnWithState } from '~/core/lib/cn';

import styles from './avatar.module.scss';

export function AvatarRoot({
	className,
	size = 'default',
	...props
}: BaseAvatar.Root.Props & {
	size?: 'default' | 'sm' | 'lg';
}) {
	return (
		<BaseAvatar.Root
			data-slot='avatar'
			data-size={size}
			className={cnWithState(styles.root, className)}
			{...props}
		/>
	);
}

export function AvatarImage({ className, ...props }: BaseAvatar.Image.Props) {
	return (
		<BaseAvatar.Image
			data-slot='avatar-image'
			className={cnWithState(styles.image, className)}
			{...props}
		/>
	);
}

export function AvatarFallback({ className, ...props }: BaseAvatar.Fallback.Props) {
	return (
		<BaseAvatar.Fallback
			data-slot='avatar-fallback'
			className={cnWithState(styles.fallback, className)}
			{...props}
		/>
	);
}

export function AvatarBadge({ className, ...props }: ComponentProps<'span'>) {
	return (
		<span data-slot='avatar-badge' className={cn(styles.badge, className)} {...props} />
	);
}

export function AvatarGroup({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div data-slot='avatar-group' className={cn(styles.group, className)} {...props} />
	);
}

export function AvatarGroupCount({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot='avatar-group-count'
			className={cn(styles.groupCount, className)}
			{...props}
		/>
	);
}

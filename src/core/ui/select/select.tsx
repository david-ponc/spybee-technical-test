'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Select as BaseSelect } from '@base-ui/react/select';
import { useRender } from '@base-ui/react/use-render';
import { Check, ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

import { cn, cnWithState } from '~/core/lib/cn';

import styles from './select.module.scss';

export const SelectRoot: typeof BaseSelect.Root = BaseSelect.Root;

type SelectSize = 'default' | 'sm' | 'lg';

const triggerClasses: Record<SelectSize, string> = {
	default: styles.trigger,
	sm: styles.triggerSm,
	lg: styles.triggerLg,
};

export const selectTriggerIconClassName = styles.triggerIcon;

interface SelectButtonProps extends useRender.ComponentProps<'button'> {
	size?: SelectSize;
}

export function SelectButton({
	className,
	size = 'default',
	render,
	children,
	...props
}: SelectButtonProps) {
	const typeValue: ButtonHTMLAttributes<HTMLButtonElement>['type'] = render
		? undefined
		: 'button';

	const defaultProps = {
		children: (
			<>
				<span className={styles.buttonValue}>{children}</span>
				<ChevronsUpDown className={styles.triggerIcon} />
			</>
		),
		className: cn(triggerClasses[size], styles.button, className),
		'data-slot': 'select-button',
		type: typeValue,
	};

	return useRender({
		defaultTagName: 'button',
		props: mergeProps<'button'>(defaultProps, props),
		render,
	});
}

interface SelectTriggerProps extends BaseSelect.Trigger.Props {
	size?: SelectSize;
}

export function SelectTrigger({
	className,
	size = 'default',
	children,
	...props
}: SelectTriggerProps) {
	return (
		<BaseSelect.Trigger
			className={cnWithState(triggerClasses[size], className)}
			data-slot='select-trigger'
			{...props}
		>
			{children}
			<BaseSelect.Icon data-slot='select-icon'>
				<ChevronsUpDown className={styles.triggerIcon} />
			</BaseSelect.Icon>
		</BaseSelect.Trigger>
	);
}

export function SelectValue({ className, ...props }: BaseSelect.Value.Props) {
	return (
		<BaseSelect.Value
			className={cnWithState(styles.value, className)}
			data-slot='select-value'
			{...props}
		/>
	);
}

interface SelectPopupProps extends BaseSelect.Popup.Props {
	portalProps?: BaseSelect.Portal.Props;
	side?: BaseSelect.Positioner.Props['side'];
	sideOffset?: BaseSelect.Positioner.Props['sideOffset'];
	align?: BaseSelect.Positioner.Props['align'];
	alignOffset?: BaseSelect.Positioner.Props['alignOffset'];
	alignItemWithTrigger?: BaseSelect.Positioner.Props['alignItemWithTrigger'];
	anchor?: BaseSelect.Positioner.Props['anchor'];
}

export function SelectPopup({
	className,
	children,
	side = 'bottom',
	sideOffset = 4,
	align = 'start',
	alignOffset = 0,
	alignItemWithTrigger = true,
	anchor,
	portalProps,
	...props
}: SelectPopupProps) {
	return (
		<BaseSelect.Portal {...portalProps}>
			<BaseSelect.Positioner
				align={align}
				alignItemWithTrigger={alignItemWithTrigger}
				alignOffset={alignOffset}
				anchor={anchor}
				className={styles.positioner}
				data-slot='select-positioner'
				side={side}
				sideOffset={sideOffset}
			>
				<BaseSelect.Popup className={styles.popup} data-slot='select-popup' {...props}>
					<BaseSelect.ScrollUpArrow
						className={styles.scrollUpArrow}
						data-slot='select-scroll-up-arrow'
					>
						<ChevronUp />
					</BaseSelect.ScrollUpArrow>
					<div className={styles.listWrapper}>
						<BaseSelect.List
							className={cnWithState(styles.list, className)}
							data-slot='select-list'
						>
							{children}
						</BaseSelect.List>
					</div>
					<BaseSelect.ScrollDownArrow
						className={styles.scrollDownArrow}
						data-slot='select-scroll-down-arrow'
					>
						<ChevronDown />
					</BaseSelect.ScrollDownArrow>
				</BaseSelect.Popup>
			</BaseSelect.Positioner>
		</BaseSelect.Portal>
	);
}

export function SelectItem({ className, children, ...props }: BaseSelect.Item.Props) {
	return (
		<BaseSelect.Item
			className={cnWithState(styles.item, className)}
			data-slot='select-item'
			{...props}
		>
			<BaseSelect.ItemText className={styles.itemText}>{children}</BaseSelect.ItemText>
			<BaseSelect.ItemIndicator className={styles.itemIndicator}>
				<Check />
			</BaseSelect.ItemIndicator>
		</BaseSelect.Item>
	);
}

export function SelectSeparator({ className, ...props }: BaseSelect.Separator.Props) {
	return (
		<BaseSelect.Separator
			className={cnWithState(styles.separator, className)}
			data-slot='select-separator'
			{...props}
		/>
	);
}

export function SelectGroup(props: BaseSelect.Group.Props) {
	return <BaseSelect.Group data-slot='select-group' {...props} />;
}

export function SelectLabel({ className, ...props }: BaseSelect.Label.Props) {
	return (
		<BaseSelect.Label
			className={cnWithState(styles.label, className)}
			data-slot='select-label'
			{...props}
		/>
	);
}

export function SelectGroupLabel(props: BaseSelect.GroupLabel.Props) {
	return (
		<BaseSelect.GroupLabel
			className={styles.groupLabel}
			data-slot='select-group-label'
			{...props}
		/>
	);
}

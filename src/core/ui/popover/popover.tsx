'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';

import { cnWithState } from '~/core/lib/cn';

import styles from './popover.module.scss';

export const PopoverCreateHandle = BasePopover.createHandle;

interface PopoverPopupProps extends BasePopover.Popup.Props {
	tooltipStyle?: boolean;
	side?: BasePopover.Positioner.Props['side'];
	align?: BasePopover.Positioner.Props['align'];
	sideOffset?: BasePopover.Positioner.Props['sideOffset'];
	alignOffset?: BasePopover.Positioner.Props['alignOffset'];
	portalProps?: BasePopover.Portal.Props;
}

export function PopoverPopup({
	className,
	tooltipStyle = false,
	side = 'bottom',
	align = 'center',
	sideOffset = 4,
	alignOffset = 0,
	portalProps,
	...props
}: PopoverPopupProps) {
	return (
		<BasePopover.Portal {...portalProps}>
			<BasePopover.Positioner
				align={align}
				alignOffset={alignOffset}
				className={styles.positioner}
				data-slot='popover-positioner'
				side={side}
				sideOffset={sideOffset}
			>
				<BasePopover.Popup
					className={cnWithState(
						styles.popup,
						tooltipStyle && styles.tooltipStyle,
						className,
					)}
					data-slot='popover-popup'
					{...props}
				/>
			</BasePopover.Positioner>
		</BasePopover.Portal>
	);
}

export function PopoverTitle({ className, ...props }: BasePopover.Title.Props) {
	return (
		<BasePopover.Title
			className={cnWithState(styles.title, className)}
			data-slot='popover-title'
			{...props}
		/>
	);
}

export function PopoverDescription({
	className,
	...props
}: BasePopover.Description.Props) {
	return (
		<BasePopover.Description
			className={cnWithState(styles.description, className)}
			data-slot='popover-description'
			{...props}
		/>
	);
}

export const Popover = BasePopover;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;

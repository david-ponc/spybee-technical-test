'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

import { cnWithState } from '~/core/lib/cn';

import styles from './tooltip.module.scss';

export const TooltipCreateHandle = BaseTooltip.createHandle;

export function TooltipProvider({ delay = 0, ...props }: BaseTooltip.Provider.Props) {
	return <BaseTooltip.Provider data-slot='tooltip-provider' delay={delay} {...props} />;
}

export function TooltipRoot({ ...props }: BaseTooltip.Root.Props) {
	return <BaseTooltip.Root data-slot='tooltip' {...props} />;
}

export function TooltipTrigger({ ...props }: BaseTooltip.Trigger.Props) {
	return <BaseTooltip.Trigger data-slot='tooltip-trigger' {...props} />;
}

interface TooltipPopupProps
	extends BaseTooltip.Popup.Props,
		Pick<BaseTooltip.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> {}

export function TooltipPopup({
	className,
	side = 'top',
	sideOffset = 4,
	align = 'center',
	alignOffset = 0,
	children,
	...props
}: TooltipPopupProps) {
	return (
		<BaseTooltip.Portal>
			<BaseTooltip.Positioner
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				className={styles.positioner}
				data-slot='tooltip-positioner'
			>
				<BaseTooltip.Popup
					data-slot='tooltip-content'
					className={cnWithState(styles.popup, className)}
					{...props}
				>
					{children}
				</BaseTooltip.Popup>
			</BaseTooltip.Positioner>
		</BaseTooltip.Portal>
	);
}

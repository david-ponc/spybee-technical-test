'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn, cnWithState } from '~/core/lib/cn';

import { Button } from '../button';
import styles from './dialog.module.scss';

function DialogRoot({ ...props }: BaseDialog.Root.Props) {
	return <BaseDialog.Root data-slot='dialog' {...props} />;
}

function DialogTrigger({ ...props }: BaseDialog.Trigger.Props) {
	return <BaseDialog.Trigger data-slot='dialog-trigger' {...props} />;
}

function DialogPortal({ ...props }: BaseDialog.Portal.Props) {
	return <BaseDialog.Portal data-slot='dialog-portal' {...props} />;
}

function DialogClose({ ...props }: BaseDialog.Close.Props) {
	return <BaseDialog.Close data-slot='dialog-close' {...props} />;
}

function DialogOverlay({ className, ...props }: BaseDialog.Backdrop.Props) {
	return (
		<BaseDialog.Backdrop
			data-slot='dialog-overlay'
			className={cnWithState(styles.overlay, className)}
			{...props}
		/>
	);
}

function DialogViewport({ className, ...props }: BaseDialog.Viewport.Props) {
	return (
		<BaseDialog.Viewport
			className={cnWithState(styles.viewport, className)}
			data-slot='dialog-viewport'
			{...props}
		/>
	);
}

interface DialogPopupProps extends BaseDialog.Popup.Props {
	showCloseButton?: boolean;
}

function DialogPopup({
	className,
	children,
	showCloseButton = true,
	...props
}: DialogPopupProps) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogViewport>
				<BaseDialog.Popup
					data-slot='dialog-popup'
					className={cnWithState(styles.popup, className)}
					{...props}
				>
					{children}
					{showCloseButton && (
						<BaseDialog.Close
							data-slot='dialog-close'
							render={
								<Button variant='ghost' className={styles.closeButton} size='icon-sm'>
									<X />
									<span className={styles.srOnly}>Cerrar</span>
								</Button>
							}
						/>
					)}
				</BaseDialog.Popup>
			</DialogViewport>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: ComponentProps<'header'>) {
	return (
		<header
			data-slot='dialog-header'
			className={cn(styles.header, className)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }: BaseDialog.Title.Props) {
	return (
		<BaseDialog.Title
			data-slot='dialog-title'
			className={cnWithState(styles.title, className)}
			{...props}
		/>
	);
}

function DialogDescription({ className, ...props }: BaseDialog.Description.Props) {
	return (
		<BaseDialog.Description
			data-slot='dialog-description'
			className={cnWithState(styles.description, className)}
			{...props}
		/>
	);
}

interface DialogPanelProps extends ComponentProps<'div'> {
	children: ReactNode;
}

function DialogPanel({ className, children, ...props }: DialogPanelProps) {
	return (
		<div data-slot='dialog-panel' className={cn(styles.panel, className)} {...props}>
			{children}
		</div>
	);
}

interface DialogFooterProps extends ComponentProps<'footer'> {
	showCloseButton?: boolean;
}

function DialogFooter({
	className,
	showCloseButton = false,
	children,
	...props
}: DialogFooterProps) {
	return (
		<footer
			data-slot='dialog-footer'
			className={cn(styles.footer, styles.withBorder, className)}
			{...props}
		>
			{children}
			{showCloseButton && (
				<BaseDialog.Close render={<Button variant='outline'>Cerrar</Button>} />
			)}
		</footer>
	);
}

export {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPanel,
	DialogPopup,
	DialogPortal,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
};

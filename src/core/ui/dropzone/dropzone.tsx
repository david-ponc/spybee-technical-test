'use client';

import { Upload } from 'lucide-react';
import {
	type ChangeEvent,
	type DragEvent,
	type InputHTMLAttributes,
	useCallback,
	useRef,
	useState,
} from 'react';

import { cn } from '~/core/lib/cn';

import styles from './dropzone.module.scss';

interface DropzoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	onFilesChange?: (files: File[]) => void;
	accept?: string;
	multiple?: boolean;
	label?: string;
	hint?: string;
	className?: string;
}

export function Dropzone({
	onFilesChange,
	accept,
	multiple = true,
	label = 'Arrastra archivos aquí o haz clic para seleccionar',
	hint = 'Soporta imágenes, videos y documentos',
	className,
	disabled,
	...props
}: DropzoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFiles = useCallback(
		(fileList: FileList | null) => {
			if (!fileList) return;
			const files = Array.from(fileList);
			onFilesChange?.(files);
		},
		[onFilesChange],
	);

	const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			handleFiles(e.dataTransfer.files);
		},
		[handleFiles],
	);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			handleFiles(e.target.files);
			if (inputRef.current) {
				inputRef.current.value = '';
			}
		},
		[handleFiles],
	);

	const handleClick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleClick();
			}
		},
		[handleClick],
	);

	return (
		// biome-ignore lint/a11y/useSemanticElements: div needed for drag & drop functionality
		<div
			role='button'
			tabIndex={disabled ? -1 : 0}
			data-slot='dropzone'
			data-dragging={isDragging}
			data-disabled={disabled}
			className={cn(styles.dropzone, className)}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			aria-label={label}
		>
			<Upload className={styles.icon} aria-hidden='true' />
			<span className={styles.label}>{label}</span>
			<span className={styles.hint}>{hint}</span>
			<input
				ref={inputRef}
				type='file'
				accept={accept}
				multiple={multiple}
				disabled={disabled}
				className={styles.input}
				onChange={handleChange}
				{...props}
			/>
		</div>
	);
}

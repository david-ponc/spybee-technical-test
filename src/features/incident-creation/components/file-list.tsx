'use client';

import { File, Film, Image as ImageIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '~/core/lib/cn';
import { Badge } from '~/core/ui/badge';

import styles from './file-list.module.scss';

type FileCategory = 'image' | 'video' | 'document';

interface FileItem {
	id: string;
	file: File;
	preview?: string;
	category: FileCategory;
}

interface FileListProps {
	files: FileItem[];
	onRemove: (id: string) => void;
	className?: string;
}

function getFileCategory(file: File): FileCategory {
	if (file.type.startsWith('image/')) return 'image';
	if (file.type.startsWith('video/')) return 'video';
	return 'document';
}

function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

function getCategoryLabel(category: FileCategory): string {
	const labels: Record<FileCategory, string> = {
		image: 'Imagen',
		video: 'Video',
		document: 'Documento',
	};
	return labels[category];
}

function getCategoryIcon(category: FileCategory) {
	const icons: Record<FileCategory, typeof File> = {
		image: ImageIcon,
		video: Film,
		document: File,
	};
	return icons[category];
}

interface FileListItemProps {
	item: FileItem;
	onRemove: (id: string) => void;
}

function FileListItem({ item, onRemove }: FileListItemProps) {
	const Icon = getCategoryIcon(item.category);

	return (
		<div className={styles.fileItem} data-slot='file-item'>
			<div className={styles.preview}>
				{item.category === 'image' && item.preview ? (
					// biome-ignore lint/performance/noImgElement: Dynamic preview of uploaded files
					<img src={item.preview} alt={item.file.name} />
				) : (
					<Icon className={styles.previewIcon} aria-hidden='true' />
				)}
			</div>
			<div className={styles.fileInfo}>
				<span className={styles.fileName} title={item.file.name}>
					{item.file.name}
				</span>
				<div className={styles.fileMeta}>
					<Badge variant='secondary' size='sm'>
						{getCategoryLabel(item.category)}
					</Badge>
					<span>{item.file.type || 'Desconocido'}</span>
					<span>{formatFileSize(item.file.size)}</span>
				</div>
			</div>
			<button
				type='button'
				className={styles.removeButton}
				onClick={() => onRemove(item.id)}
				aria-label={`Eliminar ${item.file.name}`}
			>
				<X className={styles.removeIcon} aria-hidden='true' />
			</button>
		</div>
	);
}

export function FileList({ files, onRemove, className }: FileListProps) {
	if (files.length === 0) return null;

	return (
		<div className={cn(styles.fileList, className)} data-slot='file-list'>
			{files.map((item) => (
				<FileListItem key={item.id} item={item} onRemove={onRemove} />
			))}
		</div>
	);
}

export function useFileList() {
	const [files, setFiles] = useState<FileItem[]>([]);

	const addFiles = (newFiles: File[]) => {
		const items: FileItem[] = newFiles.map((file) => {
			const category = getFileCategory(file);
			const id = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
			return { id, file, category };
		});

		setFiles((prev) => [...prev, ...items]);
	};

	const removeFile = (id: string) => {
		setFiles((prev) => {
			const item = prev.find((f) => f.id === id);
			if (item?.preview) {
				URL.revokeObjectURL(item.preview);
			}
			return prev.filter((f) => f.id !== id);
		});
	};

	useEffect(() => {
		const itemsWithPreviews = files.filter(
			(item) => item.category === 'image' && !item.preview,
		);

		itemsWithPreviews.forEach((item) => {
			const preview = URL.createObjectURL(item.file);
			setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, preview } : f)));
		});

		return () => {
			itemsWithPreviews.forEach((item) => {
				if (item.preview) {
					URL.revokeObjectURL(item.preview);
				}
			});
		};
	}, [files]);

	return { files, addFiles, removeFile };
}

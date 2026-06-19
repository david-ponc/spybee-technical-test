'use client';

import { Controller } from 'react-hook-form';

import { DatePicker } from '~/core/ui/date-picker';
import { Dropzone } from '~/core/ui/dropzone';
import { Field } from '~/core/ui/field';
import { Input } from '~/core/ui/input';
import { NumberField } from '~/core/ui/number-field';
import { Select } from '~/core/ui/select';
import {
	TagsInputChip,
	TagsInputChipDelete,
	TagsInputInput,
	TagsInputInputGroup,
	TagsInputRoot,
} from '~/core/ui/tags-input/tags-input';
import { Textarea } from '~/core/ui/textarea';

import type { CreateIncidentFormValues } from '../hooks/use-create-incident-form';
import { useCreateIncidentForm } from '../hooks/use-create-incident-form';
import styles from './create-incident-form.module.scss';
import { FileList, useFileList } from './file-list';

const CATEGORY_OPTIONS = [
	{ value: 'electric', label: 'Eléctrico' },
	{ value: 'stability', label: 'Estabilidad' },
	{ value: 'design-coordination', label: 'Coordinación de Diseños Duvan' },
	{ value: 'risk-prevention', label: 'Prevención de riesgos' },
	{ value: 'general-observation', label: 'Observación General' },
	{ value: 'infrastructure', label: 'Infraestructura' },
	{ value: 'structural', label: 'Estructural' },
	{ value: 'soil-study', label: 'Estudio Suelos' },
	{ value: 'foundation', label: 'Cimentación' },
	{ value: 'urbanism', label: 'Urbanismo' },
];

const PRIORITY_OPTIONS = [
	{ value: 'low', label: 'Baja' },
	{ value: 'medium', label: 'Media' },
	{ value: 'high', label: 'Alta' },
];

interface CreateIncidentFormProps {
	defaultValues?: Partial<CreateIncidentFormValues>;
	buildingId: number;
	onSubmit: (data: CreateIncidentFormValues, files: File[]) => Promise<void> | void;
	onSuccess?: () => void;
	isSubmitting?: boolean;
}

export function CreateIncidentForm({
	defaultValues,
	buildingId,
	onSubmit,
	onSuccess,
	isSubmitting = false,
}: CreateIncidentFormProps) {
	const form = useCreateIncidentForm({ buildingId, defaultValues });
	const { register, control, handleSubmit } = form;
	const { files, addFiles, removeFile } = useFileList();

	const onFormSubmit = handleSubmit(async (data) => {
		await onSubmit(
			data,
			files.map((item) => item.file),
		);
		onSuccess?.();
	});

	return (
		<form
			id='incident-creation-form'
			className={styles.form}
			onSubmit={onFormSubmit}
			aria-busy={isSubmitting}
		>
			<section className={styles.section}>
				<Field.Root>
					<Field.Label>Título</Field.Label>
					<Input type='text' placeholder='' {...register('title')} />
				</Field.Root>
				<Field.Root>
					<Field.Label>Descripción</Field.Label>
					<Textarea {...register('description')} />
				</Field.Root>
			</section>
			<section className={styles.section}>
				<Field.Root>
					<Field.Label>Fecha de vencimiento</Field.Label>
					<Controller
						control={control}
						name='dueDate'
						render={({ field }) => (
							<DatePicker
								value={field.value ?? undefined}
								onChange={(date) => field.onChange(date ?? null)}
							/>
						)}
					/>
				</Field.Root>
				<Field.Root>
					<Field.Label>Categoría</Field.Label>
					<Controller
						control={control}
						name='category'
						render={({ field }) => (
							<Select.Root
								items={CATEGORY_OPTIONS}
								value={field.value}
								onValueChange={field.onChange}
							>
								<Select.Trigger>
									<Select.Value placeholder='Selecciona una categoría' />
								</Select.Trigger>
								<Select.Popup>
									{CATEGORY_OPTIONS.map((option) => (
										<Select.Item key={option.value} value={option.value}>
											{option.label}
										</Select.Item>
									))}
								</Select.Popup>
							</Select.Root>
						)}
					/>
				</Field.Root>
				<Field.Root>
					<Field.Label>Prioridad</Field.Label>
					<Controller
						control={control}
						name='priority'
						render={({ field }) => (
							<Select.Root
								items={PRIORITY_OPTIONS}
								value={field.value}
								onValueChange={field.onChange}
							>
								<Select.Trigger>
									<Select.Value />
								</Select.Trigger>
								<Select.Popup>
									{PRIORITY_OPTIONS.map((option) => (
										<Select.Item key={option.value} value={option.value}>
											{option.label}
										</Select.Item>
									))}
								</Select.Popup>
							</Select.Root>
						)}
					/>
				</Field.Root>
			</section>
			<section className={styles.section}>
				<Field.Root>
					<Field.Label>Etiquetas</Field.Label>
					<Controller
						control={control}
						name='tags'
						render={({ field }) => (
							<TagsInputRoot value={field.value} onChange={field.onChange}>
								<TagsInputInputGroup>
									{field.value.map((tag: string, index: number) => (
										<TagsInputChip key={tag} index={index}>
											{tag}
											<TagsInputChipDelete index={index} />
										</TagsInputChip>
									))}
									<TagsInputInput placeholder='Agrega etiquetas' />
								</TagsInputInputGroup>
							</TagsInputRoot>
						)}
					/>
				</Field.Root>
				<Field.Root>
					<Field.Label>Asignados</Field.Label>
					<Controller
						control={control}
						name='assignees'
						render={({ field }) => (
							<TagsInputRoot value={field.value} onChange={field.onChange}>
								<TagsInputInputGroup>
									{field.value.map((assignee: string, index: number) => (
										<TagsInputChip key={assignee} index={index}>
											{assignee}
											<TagsInputChipDelete index={index} />
										</TagsInputChip>
									))}
									<TagsInputInput placeholder='Agrega asignados' />
								</TagsInputInputGroup>
							</TagsInputRoot>
						)}
					/>
				</Field.Root>
				<Field.Root>
					<Field.Label>Observaciones</Field.Label>
					<Textarea {...register('observations')} />
				</Field.Root>
			</section>
			<section className={styles.section}>
				<Field.Root>
					<Field.Label>Latitud</Field.Label>
					<Controller
						control={control}
						name='coordinates.1'
						render={({ field }) => (
							<NumberField.Root
								min={-90}
								max={90}
								step={0.000001}
								value={field.value}
								onValueChange={field.onChange}
								disabled
							>
								<NumberField.ScrubArea>
									<NumberField.Input placeholder='0.000000' />
								</NumberField.ScrubArea>
							</NumberField.Root>
						)}
					/>
				</Field.Root>
				<Field.Root>
					<Field.Label>Longitud</Field.Label>
					<Controller
						control={control}
						name='coordinates.0'
						render={({ field }) => (
							<NumberField.Root
								min={-180}
								max={180}
								step={0.000001}
								value={field.value}
								onValueChange={field.onChange}
								disabled
							>
								<NumberField.ScrubArea>
									<NumberField.Input placeholder='0.000000' />
								</NumberField.ScrubArea>
							</NumberField.Root>
						)}
					/>
				</Field.Root>
			</section>
			<section className={styles.section}>
				<Field.Root>
					<Field.Label>Detalles de localización</Field.Label>
					<Textarea {...register('locationDetails')} />
				</Field.Root>
			</section>
			<section className={styles.section}>
				<Field.Root>
					<Field.Label>Archivos adjuntos</Field.Label>
					<Dropzone onFilesChange={addFiles} />
					<FileList files={files} onRemove={removeFile} />
				</Field.Root>
			</section>
		</form>
	);
}

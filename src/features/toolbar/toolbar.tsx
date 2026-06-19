'use client';

import { CircleXIcon, MapPinPlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { CreateIncidentCommand } from '~/contexts/building/incidents/domain/incident';
import { Button } from '~/core/ui/button';
import { Card } from '~/core/ui/card';
import { Dialog } from '~/core/ui/dialog';
import { Tooltip } from '~/core/ui/tooltip';
import { CreateIncidentForm } from '~/features/incident-creation/components/create-incident-form';
import { useCreateIncidentMutation } from '~/features/incidents/mutations/hooks';
import { useBuildingSelectionStore } from '~/features/map/stores/use-building-selection-store';

import styles from './toolbar.module.scss';

export function Toolbar() {
	const selectedBuilding = useBuildingSelectionStore((s) => s.selectedBuilding);
	const clearSelection = useBuildingSelectionStore((s) => s.clearSelection);
	const [isClosing, setIsClosing] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const createIncident = useCreateIncidentMutation();

	const handleSubmit = async (data: CreateIncidentCommand, files: File[]) => {
		await createIncident.mutateAsync({ command: data, files });

		setDialogOpen(false);
		clearSelection();
	};

	useEffect(() => {
		if (selectedBuilding) {
			setIsMounted(true);
			setIsClosing(false);
		} else if (isMounted) {
			setIsClosing(true);
		}
	}, [selectedBuilding, isMounted]);

	if (!isMounted || !selectedBuilding) return null;

	return (
		<Tooltip.Provider>
			<Card.Root
				className={`${styles.toolbar} ${isClosing ? styles.toolbarClosing : ''}`}
				onTransitionEnd={() => isClosing && setIsMounted(false)}
			>
				<Card.Panel>
					<Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
						<Tooltip.Root>
							<Tooltip.Trigger
								render={
									<Dialog.Trigger
										render={
											<Button type='button' size='icon'>
												<MapPinPlusIcon />
											</Button>
										}
									/>
								}
							/>
							<Tooltip.Popup side='left'>Crear incidente</Tooltip.Popup>
						</Tooltip.Root>
						<Dialog.Popup>
							<Dialog.Header>
								<Dialog.Title>Creación de incidente</Dialog.Title>
								<Dialog.Description>
									Asocia este incidente al edificio seleccionado:{' '}
									<strong>{selectedBuilding.id}</strong>.
								</Dialog.Description>
							</Dialog.Header>
							<Dialog.Panel>
								<CreateIncidentForm
									buildingId={selectedBuilding.id}
									defaultValues={{
										coordinates: selectedBuilding.coordinates,
									}}
									onSubmit={handleSubmit}
									isSubmitting={createIncident.isPending}
								/>
							</Dialog.Panel>
							<Dialog.Footer>
								<Dialog.Close
									render={
										<Button type='button' variant='outline' size='sm'>
											Cancelar
										</Button>
									}
								/>
								<Button
									type='submit'
									size='sm'
									form='incident-creation-form'
									disabled={createIncident.isPending}
								>
									{createIncident.isPending ? 'Guardando...' : 'Crear incidente'}
								</Button>
							</Dialog.Footer>
						</Dialog.Popup>
					</Dialog.Root>
					<Tooltip.Root>
						<Tooltip.Trigger
							render={
								<Button
									type='button'
									variant='outline'
									size='icon'
									onClick={clearSelection}
								>
									<CircleXIcon />
								</Button>
							}
						/>
						<Tooltip.Popup side='left'>Limpiar selección</Tooltip.Popup>
					</Tooltip.Root>
				</Card.Panel>
			</Card.Root>
		</Tooltip.Provider>
	);
}

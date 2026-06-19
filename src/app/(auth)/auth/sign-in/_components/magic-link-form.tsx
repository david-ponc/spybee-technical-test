'use client';

import { type SubmitEvent, useState } from 'react';

import { createClient } from '~/core/auth/browser/client';
import { env } from '~/core/env';
import { Button } from '~/core/ui/button';
import { Field } from '~/core/ui/field';
import { Input } from '~/core/ui/input';

import styles from './magic-link-form.module.scss';

interface MagicLinkFormProps {
	onError: (message: string) => void;
	onSuccess: (message: string) => void;
	loading: boolean;
	setLoading: (loading: 'magic-link' | null) => void;
}

export function MagicLinkForm({
	onError,
	onSuccess,
	loading,
	setLoading,
}: MagicLinkFormProps) {
	const [email, setEmail] = useState('');
	const supabase = createClient();

	const handleMagicLink = async (e: SubmitEvent) => {
		e.preventDefault();
		if (!email) return;
		setLoading('magic-link');
		onError('');
		try {
			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
				},
			});
			if (error) throw error;
			onSuccess('Revisa tu correo para el enlace mágico');
		} catch (err) {
			onError(err instanceof Error ? err.message : 'Error al enviar el enlace mágico');
		} finally {
			setLoading(null);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleMagicLink}>
			<Field.Root>
				<Field.Label>Correo electrónico</Field.Label>
				<Input
					type='email'
					placeholder='correo@dominio.com'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<Field.Description>
					Te enviaremos un enlace para iniciar sesión o crear tu cuenta
				</Field.Description>
			</Field.Root>
			<Button
				type='submit'
				variant='secondary'
				className={styles.magicLinkButton}
				loading={loading}
			>
				Enviar enlace mágico
			</Button>
		</form>
	);
}

'use client';

import { useState } from 'react';

import { Card } from '~/core/ui/card';
import { Field } from '~/core/ui/field';

import styles from '../page.module.scss';
import { GithubSignInForm } from './github-sign-in-form';
import { MagicLinkForm } from './magic-link-form';

export function SignInClient() {
	const [loading, setLoading] = useState<'github' | 'magic-link' | null>(null);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const handleError = (message: string) => {
		setMessage({ type: 'error', text: message });
	};

	const handleSuccess = (message: string) => {
		setMessage({ type: 'success', text: message });
	};

	return (
		<div className={styles.container}>
			<Card.Root className={styles.card}>
				<Card.Header>
					<Card.Title>Iniciar sesión</Card.Title>
					<Card.Description>
						Accede a tu cuenta o crea una nueva para continuar
					</Card.Description>
				</Card.Header>
				<Card.Panel>
					<GithubSignInForm
						onError={handleError}
						loading={loading === 'github'}
						setLoading={setLoading}
					/>
					<Field.Separator>o</Field.Separator>
					<MagicLinkForm
						onError={handleError}
						onSuccess={handleSuccess}
						loading={loading === 'magic-link'}
						setLoading={setLoading}
					/>
					{message && (
						<p
							className={message.type === 'success' ? styles.success : styles.error}
							data-slot='auth-message'
						>
							{message.text}
						</p>
					)}
				</Card.Panel>
			</Card.Root>
		</div>
	);
}

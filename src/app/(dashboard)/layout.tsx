import type { User } from '@supabase/supabase-js';
import type { PropsWithChildren } from 'react';

import { verifySession } from '~/core/data-access/verify-session';

import { Sidebar } from './_components/sidebar';
import styles from './layout.module.scss';

function getSidebarUser(user: User) {
	const metadata = user.user_metadata;
	const name =
		metadata?.full_name ??
		metadata?.name ??
		metadata?.user_name ??
		user.email ??
		'Usuario';

	return {
		name,
		email: user.email ?? '',
		avatarUrl: metadata?.avatar_url as string | undefined,
	};
}

export default async function DashboardLayout({ children }: PropsWithChildren) {
	const { user } = await verifySession();

	return (
		<div className={styles.layout}>
			<Sidebar user={getSidebarUser(user)} />
			<main className={styles.main}>{children}</main>
		</div>
	);
}

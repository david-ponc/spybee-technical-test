import { verifyGuestSession } from '~/core/data-access/verify-guest-session';

import { SignInClient } from './_components/sign-in-client';

export default async function Page() {
	await verifyGuestSession();

	return <SignInClient />;
}

'use client';

import {
	ClipboardListIcon,
	LogOutIcon,
	MapIcon,
	MenuIcon,
	PanelLeftCloseIcon,
	PanelLeftOpenIcon,
	XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar } from '~/core/ui/avatar';
import { Button } from '~/core/ui/button';
import { Tooltip } from '~/core/ui/tooltip';
import { signOutAction } from '~/features/auth/actions';

import styles from './sidebar.module.scss';
import { useSidebarStore } from './use-sidebar-store';

interface SidebarUser {
	name: string;
	email: string;
	avatarUrl?: string;
}

interface SidebarProps {
	user: SidebarUser;
}

const navItems = [
	{ href: '/mapa', label: 'Mapa', icon: MapIcon },
	{ href: '/incidentes', label: 'Incidentes', icon: ClipboardListIcon },
];

function getInitials(name: string) {
	return name
		.split(' ')
		.slice(0, 2)
		.map((part) => part[0])
		.join('')
		.toUpperCase();
}

export function Sidebar({ user }: SidebarProps) {
	const collapsed = useSidebarStore((s) => s.collapsed);
	const mobileOpen = useSidebarStore((s) => s.mobileOpen);
	const toggle = useSidebarStore((s) => s.toggle);
	const openMobile = useSidebarStore((s) => s.openMobile);
	const closeMobile = useSidebarStore((s) => s.closeMobile);
	const pathname = usePathname();

	return (
		<>
			<Button
				type='button'
				size='icon'
				variant='outline'
				className={styles.mobileToggle}
				onClick={openMobile}
				aria-label='Abrir menú'
			>
				<MenuIcon />
			</Button>

			{mobileOpen && (
				<div className={styles.overlay} onClick={closeMobile} aria-hidden='true' />
			)}

			<aside
				className={styles.sidebar}
				data-collapsed={collapsed}
				data-mobile-open={mobileOpen}
			>
				<div className={styles.sidebarInner}>
					<header className={styles.header}>
						<span className={styles.logo}>Spybee</span>

						<div className={styles.desktopControls}>
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger
										render={
											<Button
												type='button'
												size='icon-sm'
												variant='ghost'
												onClick={toggle}
											>
												<PanelLeftCloseIcon />
											</Button>
										}
									/>
									<Tooltip.Popup side='right'>Colapsar sidebar</Tooltip.Popup>
								</Tooltip.Root>
							</Tooltip.Provider>
						</div>

						<div className={styles.mobileControls}>
							<Button
								type='button'
								size='icon-sm'
								variant='ghost'
								onClick={closeMobile}
								aria-label='Cerrar menú'
							>
								<XIcon />
							</Button>
						</div>
					</header>

					<div className={styles.content}>
						<nav className={styles.nav}>
							{navItems.map(({ href, label, icon: Icon }) => (
								<Link
									key={href}
									href={href}
									className={styles.navItem}
									data-active={pathname === href}
									onClick={closeMobile}
								>
									<Icon />
									<span>{label}</span>
								</Link>
							))}
						</nav>
					</div>

					<footer className={styles.footer}>
						<div className={styles.userInfo}>
							<Avatar.Root size='sm'>
								{user.avatarUrl && <Avatar.Image src={user.avatarUrl} alt={user.name} />}
								<Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
							</Avatar.Root>
							<div className={styles.userText}>
								<span className={styles.userName}>{user.name}</span>
								<span className={styles.userEmail}>{user.email}</span>
							</div>
						</div>

						<form action={signOutAction}>
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger
										render={
											<Button
												type='submit'
												size='icon-sm'
												variant='ghost'
												aria-label='Cerrar sesión'
											>
												<LogOutIcon />
											</Button>
										}
									/>
									<Tooltip.Popup side='top'>Cerrar sesión</Tooltip.Popup>
								</Tooltip.Root>
							</Tooltip.Provider>
						</form>
					</footer>
				</div>
			</aside>

			{collapsed && (
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger
							render={
								<Button
									type='button'
									size='icon'
									variant='secondary'
									className={styles.floatingToggle}
									onClick={toggle}
									aria-label='Abrir sidebar'
								>
									<PanelLeftOpenIcon />
								</Button>
							}
						/>
						<Tooltip.Popup side='right'>Abrir sidebar</Tooltip.Popup>
					</Tooltip.Root>
				</Tooltip.Provider>
			)}
		</>
	);
}

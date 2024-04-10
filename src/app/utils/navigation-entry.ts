export const navigationEntries = {
	login: {
		title: 'Login',
		path: '/login',
	},
	home: {
		title: 'Home',
		path: '/',
		icon: 'home-2-line',
		activeIcon: 'home-2-fill',
	},
	membership: {
		title: 'Memberships',
		icon: 'user-3-line',
		activeIcon: 'user-3-fill',
		path: '/memberships',
	},
	environment: {
		title: 'Environments',
		icon: 'archive-drawer-line',
		activeIcon: 'archive-drawer-fill',
		path: '/environments',
	},
	feature: {
		title: 'Features',
		icon: 'flag-line',
		activeIcon: 'flag-fill',
		path: '/features',
	},
	changelog: {
		title: 'Changelog',
		icon: 'lock-line',
		activeIcon: 'lock-fill',
		path: '/changelog',
	},
} as const;

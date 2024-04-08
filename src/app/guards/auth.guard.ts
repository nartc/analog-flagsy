import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthStore } from '../stores/auth.store';

export function authGuard(alreadyLoggedIn: boolean): CanMatchFn {
	return () => {
		const router = inject(Router);
		const authStore = inject(AuthStore);

		return authStore.me$.pipe(
			map((me) => {
				if (alreadyLoggedIn) {
					if (me) return true;
					return router.createUrlTree(['/login']);
				}

				if (!me) return true;
				return router.createUrlTree(['/']);
			}),
			take(1),
		);
	};
}

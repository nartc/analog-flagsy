import { HttpClient } from '@angular/common/http';
import { effect, inject, signal, untracked } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { createInjectable } from 'ngxtension/create-injectable';
import { catchError, interval, of, retry, switchMap, tap } from 'rxjs';
import type { MeHandlerResponse } from '../../server/routes/users/me.get';
import type { RefreshHandlerResponse } from '../../server/routes/users/refresh.post';
import { injectAppAbility } from '../utils/inject-app-ability';

export const AuthStore = createInjectable(
	() => {
		const http = inject(HttpClient);
		const router = inject(Router);
		const appAbility = injectAppAbility();

		const me = signal<MeHandlerResponse>(null!);
		const refreshToken = signal('');

		const me$ = toObservable(me);

		const getMe = (refreshJwt: string) => {
			return http
				.get<MeHandlerResponse>('/api/users/me', {
					withCredentials: true,
				})
				.pipe(
					tap({
						next: (user) => {
							setMe(user);
							if (refreshJwt) {
								setToken(refreshJwt);
							}
							appAbility.update(user.abilities);
						},
						error: () => {
							setMe(null!);
							if (refreshJwt) {
								setToken('');
							}
							appAbility.update([]);
						},
					}),
				);
		};

		effect((onCleanup) => {
			const [token, user] = [refreshToken(), untracked(me)];
			if (!token || !user) {
				return;
			}

			const sub = getMe('').subscribe();

			sub.add(
				interval(1000 * 60 * 45 /* every 45 minutes */)
					.pipe(
						switchMap(() =>
							http
								.post<RefreshHandlerResponse>(
									'/api/users/refresh',
									{ refreshJwt: token },
									{ withCredentials: true },
								)
								.pipe(
									switchMap(({ refreshJwt }) => getMe(refreshJwt)),
									catchError((err) => {
										console.log(`Error refreshing token: `, err);
										return http
											.post('/api/users/logout', {}, { withCredentials: true })
											.pipe(
												tap(() => {
													setMe(null!);
													setToken('');
													appAbility.update([]);
													void router.navigate(['/login']);
												}),
											);
									}),
									retry({
										count: 3,
										delay: (_, retryCount) => of((retryCount + 1) * 1000),
										resetOnSuccess: true,
									}),
								),
						),
					)
					.subscribe(),
			);

			onCleanup(sub.unsubscribe.bind(sub));
		});

		const setMe = (user: MeHandlerResponse) => {
			me.set(user);
		};

		const setToken = (token: string) => {
			refreshToken.set(token);
		};

		return { me: me.asReadonly(), me$, setMe, setToken };
	},
	{ providedIn: 'root' },
);

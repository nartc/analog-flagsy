import { provideFileRouter } from '@analogjs/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import {
	APP_INITIALIZER,
	ApplicationConfig,
	ENVIRONMENT_INITIALIZER,
	importProvidersFrom,
	inject,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { withComponentInputBinding } from '@angular/router';
import { PureAbility } from '@casl/ability';
import { createPrismaAbility } from '@casl/prisma';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { provideRemixIcon } from 'angular-remix-icon';
import { PrimeNGConfig } from 'primeng/api';
import type { MeHandlerResponse } from '../server/routes/users/me.get';
import { ICONS } from './icons';
import { AuthStore } from './stores/auth.store';
import { injectAppAbility } from './utils/inject-app-ability';

export const appConfig: ApplicationConfig = {
	providers: [
		{ provide: PureAbility, useValue: createPrismaAbility([]) },
		provideFileRouter(withComponentInputBinding()),
		provideHttpClient(withFetch()),
		provideAnimationsAsync(),
		provideRemixIcon(ICONS),
		importProvidersFrom(LoadingBarRouterModule),
		{
			provide: ENVIRONMENT_INITIALIZER,
			useValue: () => {
				const primeNgConfig = inject(PrimeNGConfig);
				primeNgConfig.ripple = true;
			},
			multi: true,
		},
		{
			provide: APP_INITIALIZER,
			useFactory: () => {
				const authStore = inject(AuthStore);
				const http = inject(HttpClient);
				const appAbility = injectAppAbility();

				return () => {
					return http
						.get<MeHandlerResponse>('/api/users/me', { withCredentials: true })
						.subscribe({
							next: (user) => {
								authStore.setMe(user);
								appAbility.update(user.abilities);
							},
							error: (err) => {
								console.log(err);
								authStore.setMe(null!);
								appAbility.update([]);
							},
						});
				};
			},
			multi: true,
		},
	],
};

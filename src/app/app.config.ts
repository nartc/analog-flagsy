import { provideFileRouter } from '@analogjs/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
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
import { ICONS } from './icons';

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
	],
};

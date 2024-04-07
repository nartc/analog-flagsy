import { provideFileRouter } from '@analogjs/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { withComponentInputBinding } from '@angular/router';
import { PureAbility } from '@casl/ability';
import { createPrismaAbility } from '@casl/prisma';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { provideRemixIcon } from 'angular-remix-icon';
import { ICONS } from './icons';

export const appConfig: ApplicationConfig = {
	providers: [
		{ provide: PureAbility, useValue: createPrismaAbility([]) },
		provideFileRouter(withComponentInputBinding()),
		provideHttpClient(withFetch()),
		provideAnimationsAsync(),
		provideRemixIcon(ICONS),
		provideHotToastConfig({ role: 'status', theme: 'toast' }),
		importProvidersFrom(LoadingBarRouterModule),
	],
};

import { provideFileRouter } from '@analogjs/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { withComponentInputBinding } from '@angular/router';

export const appConfig: ApplicationConfig = {
	providers: [
		provideFileRouter(withComponentInputBinding()),
		provideHttpClient(withFetch()),
	],
};

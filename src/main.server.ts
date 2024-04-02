import '@angular/platform-server/init';
import 'zone.js/node';

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

if (import.meta.env.PROD) {
	enableProdMode();
}

export function bootstrap() {
	return bootstrapApplication(AppComponent, config);
}

export default async function render(url: string, document: string) {
	const html = await renderApplication(bootstrap, {
		document,
		url,
	});

	return html;
}

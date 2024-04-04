/// <reference types="vite/client" />

import type { Type } from '@angular/core';
import type { AppAbility } from './server/abilities/app-ability.server';

interface ImportAttributes {
	analog: 'imports' | 'providers' | 'viewProviders' | 'exposes';
}

declare global {
	import type { Component } from '@angular/core';

	interface Window {
		/**
		 * Define the metadata for the component.
		 * @param metadata
		 */
		defineMetadata: (
			metadata: Omit<
				Component,
				| 'template'
				| 'standalone'
				| 'changeDetection'
				| 'styles'
				| 'outputs'
				| 'inputs'
			> & { exposes?: unknown[] },
		) => void;
		/**
		 * Invoke the callback when the component is initialized.
		 */
		onInit: (initFn: () => void) => void;
		/**
		 * Invoke the callback when the component is destroyed.
		 */
		onDestroy: (destroyFn: () => void) => void;
	}
}

declare module '*.analog' {
	declare const cmp: Type<any>;
	export default cmp;
}

declare module 'h3' {
	interface H3EventContext {
		user?: {
			id: string;
			email: string;
			firstName: string;
			lastName: string;
			memberships: { orgId: string; role: string }[];
		};
		ability?: AppAbility;
	}
}

import { createError, defineEventHandler } from 'h3';
import type { Actions, AppSubjects } from '../abilities/app-ability.server';
import { assertCondition } from '../utilities/assert-condition.server';

export const abilityMiddleware = (action: Actions, subject: AppSubjects) =>
	defineEventHandler({
		handler: async (event) => {
			assertCondition(
				event.context.user != null && event.context.ability != null,
				() => {
					throw createError({ status: 401, message: 'Unauthorized' });
				},
			);

			const can = event.context.ability.can(action, subject);
			if (!can) {
				throw createError({ status: 403, message: 'Forbidden' });
			}
		},
	});

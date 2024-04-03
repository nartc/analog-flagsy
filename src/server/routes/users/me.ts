import { createError, defineEventHandler } from 'h3';
import auth from '../../middlewares/auth.server';
import { assertCondition } from '../../utilities/assert-condition.server';

export default defineEventHandler({
	onRequest: [auth],
	handler: async (event) => {
		assertCondition(
			event.context.user != null && event.context.ability != null,
			() => {
				throw createError({ status: 401, message: 'Unauthorized' });
			},
		);

		return Object.assign(event.context.user, {
			abilities: event.context.ability.rules,
		});
	},
});

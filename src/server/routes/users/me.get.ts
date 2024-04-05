import { createError, defineEventHandler } from 'h3';
import { authMiddleware } from '../../middlewares/auth.server';
import { assertCondition } from '../../utilities/assert-condition.server';

const meHandler = defineEventHandler({
	onRequest: [authMiddleware()],
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

export type MeHandlerResponse = Awaited<ReturnType<typeof meHandler>>;

export default meHandler;

import { createError, defineEventHandler, deleteCookie } from 'h3';
import { authMiddleware } from '../../middlewares/auth.server';
import { assertCondition } from '../../utilities/assert-condition.server';
import { inMemoryRefreshToken } from '../../utilities/auth.server';

export default defineEventHandler({
	onRequest: [authMiddleware()],
	handler: async (event) => {
		assertCondition(event.context.user != null, () => {
			throw createError({ status: 401, message: 'Unauthorized' });
		});

		inMemoryRefreshToken.delete(event.context.user.id);

		delete event.context.user;
		delete event.context.ability;

		deleteCookie(event, 'accessToken');
		return { ok: true };
	},
});

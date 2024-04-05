import {
	createError,
	defineEventHandler,
	readValidatedBody,
	setCookie,
	setResponseStatus,
} from 'h3';
import { z } from 'zod';
import { authMiddleware } from '../../middlewares/auth.server';
import { assertCondition } from '../../utilities/assert-condition.server';
import {
	generateJwt,
	inMemoryRefreshToken,
	verifyJwt,
} from '../../utilities/auth.server';

const refreshSchema = z.object({
	refreshToken: z.string(),
});

const refreshHandler = defineEventHandler({
	onRequest: [authMiddleware()],
	handler: async (event) => {
		assertCondition(event.context.user != null, () => {
			throw createError({ status: 401, message: 'Unauthorized' });
		});
		const { refreshToken } = await readValidatedBody(
			event,
			refreshSchema.parse,
		);

		const storedRefreshToken = inMemoryRefreshToken.get(event.context.user.id);
		if (storedRefreshToken !== refreshToken) {
			throw createError({ status: 401, message: 'Unauthorized' });
		}

		try {
			verifyJwt(refreshToken);
		} catch (err) {
			console.log('Error refresh token', err);
			throw createError({ status: 401, message: 'Unauthorized' });
		}

		const [jwt, refreshJwt] = [
			generateJwt({
				id: event.context.user.id,
				email: event.context.user.email,
			}),
			generateJwt({ id: event.context.user.id }, true),
		];

		setCookie(event, 'accessToken', jwt, {
			httpOnly: true,
			path: '/',
			maxAge: 60 * 60,
		});
		inMemoryRefreshToken.set(event.context.user.id, refreshJwt);

		setResponseStatus(event, 201);
		return { refreshJwt };
	},
});

export type RefreshHandlerResponse = Awaited<ReturnType<typeof refreshHandler>>;

export default refreshHandler;

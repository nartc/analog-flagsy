import * as bcrypt from 'bcrypt';
import {
	createError,
	defineEventHandler,
	readValidatedBody,
	setCookie,
	setResponseStatus,
} from 'h3';
import { z } from 'zod';
import { prisma } from '../../prisma';
import { generateJwt, inMemoryRefreshToken } from '../../utilities/auth.server';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

const loginHandler = defineEventHandler({
	handler: async (event) => {
		const { email, password } = await readValidatedBody(
			event,
			loginSchema.parse,
		);

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw createError({ status: 401, message: 'Invalid Credentials' });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			throw createError({ status: 401, message: 'Invalid Credentials' });
		}

		const [jwt, refreshJwt] = [
			generateJwt({ id: user.id, email: user.email }),
			generateJwt({ id: user.id }, true),
		];

		setCookie(event, 'accessToken', jwt, {
			httpOnly: true,
			path: '/',
			maxAge: 60 * 60,
		});
		inMemoryRefreshToken.set(user.id, refreshJwt);

		setResponseStatus(event, 201);
		return { refreshJwt };
	},
});

export type LoginHandlerResponse = Awaited<ReturnType<typeof loginHandler>>;

export default loginHandler;

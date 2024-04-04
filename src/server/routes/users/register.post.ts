import {
	defineEventHandler,
	readValidatedBody,
	setCookie,
	setResponseStatus,
} from 'h3';
import { z } from 'zod';
import { prisma } from '../../prisma';
import {
	generateJwt,
	hashPassword,
	inMemoryRefreshToken,
} from '../../utilities/auth.server';

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	organizationName: z.string(),
});

export default defineEventHandler({
	handler: async (event) => {
		const body = await readValidatedBody(event, registerSchema.parse);
		const hashedPassword = await hashPassword(body.password);

		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: hashedPassword,
				firstName: body.firstName,
				lastName: body.lastName,
			},
			select: { id: true, email: true },
		});

		const organizationKey = body.organizationName
			.replace(/\s/g, '-')
			.toLowerCase();

		await prisma.org.upsert({
			where: { key: organizationKey },
			// creating a new organization when a user signs up
			create: {
				name: body.organizationName,
				key: organizationKey,
				members: { create: { role: 'ADMIN', userId: user.id } },
			},
			// adding the user to an existing organization when a user accepts an invite
			update: {
				members: { create: { role: 'MEMBER', userId: user.id } },
			},
		});

		const [jwt, refreshJwt] = [
			generateJwt(user),
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

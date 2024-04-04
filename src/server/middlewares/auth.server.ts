import { createError, defineEventHandler, getCookie } from 'h3';
import { defineUserAbilities } from '../abilities/user-abilities.server';
import { prisma } from '../prisma';
import { verifyJwt } from '../utilities/auth.server';

export const authMiddleware = () =>
	defineEventHandler({
		handler: async (event) => {
			const accessToken = getCookie(event, 'accessToken');
			if (!accessToken) {
				throw createError({ status: 401, message: 'Unauthorized' });
			}

			const { id } = verifyJwt<{ id: string }>(accessToken);

			const user = await prisma.user.findUnique({
				where: { id },
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
					memberships: { select: { role: true, orgId: true } },
				},
			});

			if (!user) {
				throw createError({ status: 401, message: 'Unauthorized' });
			}

			event.context.user = user;
			event.context.ability = defineUserAbilities(user.id);
		},
	});

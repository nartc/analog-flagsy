import { accessibleBy } from '@casl/prisma';
import { createError, defineEventHandler } from 'h3';
import { abilityMiddleware } from '../../middlewares/ability.server';
import { authMiddleware } from '../../middlewares/auth.server';
import { prisma } from '../../prisma';
import { assertCondition } from '../../utilities/assert-condition.server';

const orgsHandler = defineEventHandler({
	onRequest: [authMiddleware(), abilityMiddleware('read', 'Org')],
	handler: async (event) => {
		assertCondition(
			event.context.user != null && event.context.ability != null,
			() => {
				throw createError({ status: 401, message: 'Unauthorized' });
			},
		);

		const organizations = await prisma.org.findMany({
			where: accessibleBy(event.context.ability).Org,
			include: {
				members: {
					where: { userId: event.context.user.id, role: 'ADMIN' },
					select: { role: true, userId: true },
				},
			},
		});

		return { organizations };
	},
});

export type OrgsHandlerResponse = Awaited<ReturnType<typeof orgsHandler>>;

export default orgsHandler;

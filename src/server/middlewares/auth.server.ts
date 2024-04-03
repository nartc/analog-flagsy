import type { User } from '@prisma/client';
import { createError, defineEventHandler } from 'h3';
import { defineUserAbilities } from '../abilities/user-abilities.server';

export default defineEventHandler({
	handler: async (event) => {
		// const accessToken = getCookie(event, 'accessToken');
		// if (!accessToken) {
		// 	throw createError({ status: 401, message: 'Unauthorized' });
		// }

		/* parse the token get the user id from the token */ const userId = '';

		// const user = await prisma.user.findFirst({
		// 	where: { id: userId },
		// });

		const user = { id: '123', firstName: 'Chau' } as User;

		if (!user) {
			throw createError({ status: 401, message: 'Unauthorized' });
		}

		event.context.user = user;
		event.context.ability = defineUserAbilities(user);
	},
});

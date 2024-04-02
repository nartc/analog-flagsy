import type { PageServerLoad } from '@analogjs/router';
import { setCookie } from 'h3';
import { prisma } from '../../server/prisma';

export const load = async ({ event }: PageServerLoad) => {
	setCookie(event, 'test', 'foo');
	return await prisma.user.findMany();
};

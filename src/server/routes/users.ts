import { defineEventHandler } from 'h3';
import { prisma } from '../prisma';

export default defineEventHandler({
	onRequest: [],
	handler: async () => await prisma.user.findMany(),
});

import { defineNitroPlugin } from 'nitropack/runtime';
import { prisma } from '../prisma';

export default defineNitroPlugin((nitro) => {
	nitro.hooks.hookOnce('close', async () => {
		// Will run when nitro is closed
		console.log('Closing nitro server...');
		await prisma.$disconnect();
	});
});

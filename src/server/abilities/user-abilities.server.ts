import type { User } from '@prisma/client';
import { createAbilityBuilder } from './app-ability.server';

export function defineUserAbilities(user: User) {
	const { can, cannot, build } = createAbilityBuilder();

	can('read', 'Org', { members: { some: { userId: user.id } } });
	can('update', 'Org', {
		members: { some: { userId: user.id, role: 'ADMIN' } },
	});

	return build();
}

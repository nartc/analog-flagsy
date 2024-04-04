import { createAbilityBuilder } from './app-ability.server';

export function defineUserAbilities(userId: string) {
	const { can, cannot, build } = createAbilityBuilder();

	// every member can read the org
	can('read', 'Org', { members: { some: { userId } } });
	// member can only update the members field if they're not in the members list
	// when then accept an invite
	can('update', 'Org', 'members', {
		members: { none: { userId } },
	});
	// org admin can manage the org
	can('manage', 'Org', {
		members: { some: { AND: [{ userId }, { role: 'ADMIN' }] } },
	});

	return build();
}

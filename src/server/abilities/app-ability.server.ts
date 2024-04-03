import { AbilityBuilder, PureAbility } from '@casl/ability';
import {
	createPrismaAbility,
	type PrismaQuery,
	type Subjects,
} from '@casl/prisma';
import type { Membership, Org, User } from '@prisma/client';

type WithKind<T, Kind> = T & { kind: Kind };

export type Actions = 'create' | 'read' | 'update' | 'delete';

export type AppAbility = PureAbility<
	[Actions, Subjects<{ Org: Org; User: User; Membership: Membership }>],
	PrismaQuery
>;

export function createAbilityBuilder() {
	return new AbilityBuilder<AppAbility>(createPrismaAbility);
}

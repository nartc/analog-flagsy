import { AbilityBuilder, PureAbility } from '@casl/ability';
import {
	createPrismaAbility,
	type PrismaQuery,
	type Subjects,
} from '@casl/prisma';
import type { Membership, Org, User } from '@prisma/client';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type AppSubjects =
	| 'all'
	| Subjects<{ Org: Org; User: User; Membership: Membership }>;

export type AppAbility = PureAbility<[Actions, AppSubjects], PrismaQuery>;

export function createAbilityBuilder() {
	return new AbilityBuilder<AppAbility>(createPrismaAbility);
}

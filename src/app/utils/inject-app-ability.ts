import { inject } from '@angular/core';
import { PureAbility } from '@casl/ability';
import type { AppAbility } from '../../server/abilities/app-ability.server';

export function injectAppAbility() {
	return inject(PureAbility) as AppAbility;
}

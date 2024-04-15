import { computed, signal } from '@angular/core';
import { createInjectable } from 'ngxtension/create-injectable';
import type { OrgsHandlerResponse } from '../../server/routes/orgs/index.get';

export const OrganizationStore = createInjectable(
	() => {
		const userOrganizations = signal<OrgsHandlerResponse['organizations']>([]);
		const selectedOrganization = signal<
			OrgsHandlerResponse['organizations'][number] | null
		>(null);
		const apiStatus = signal<'idle' | 'loading'>('idle');

		const isLoading = computed(() => apiStatus() === 'loading');

		const setUserOrganizations = (
			organizations: OrgsHandlerResponse['organizations'],
		) => {
			userOrganizations.set(organizations);
			setApiStatus('idle');

			const storedSelectedOrgId = localStorage.getItem(
				'flagsy_analog_selected_org_id',
			);

			const selectedOrg = organizations.find(
				(org) => org.id === storedSelectedOrgId,
			);

			selectedOrganization.set(selectedOrg || organizations[0]);
		};

		const setApiStatus = apiStatus.set.bind(apiStatus);

		const selectOrganization = (
			organization: OrgsHandlerResponse['organizations'][number],
		) => {
			selectedOrganization.set(organization);
			localStorage.setItem('flagsy_analog_selected_org_id', organization.id);
		};

		return {
			setUserOrganizations,
			setApiStatus,
			selectOrganization,
			userOrganizations: userOrganizations.asReadonly(),
			selectedOrganization: selectedOrganization.asReadonly(),
			isLoading,
		};
	},
	{ providedIn: 'root' },
);

import type { ApplicationState } from '$lib/manifest/application.manifest';

export function updateElementZ(applications: Array<ApplicationState>) {
	applications.forEach((app) => {
		const component = document.getElementById(app.context.appID);
		if (component) {
			if (app.z < 0) {
				component.style.zIndex = `0`;
			} else {
				component.style.zIndex = `${app.z}`;
			}
		}
	});
}
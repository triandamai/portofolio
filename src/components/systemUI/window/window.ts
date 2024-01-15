import type { ApplicationState } from '$lib/manifest/application.manifest';

export function updateElementZ(applications: Map<string,ApplicationState>, appID: string) {
	applications.forEach((app,key) => {
		const component = document.getElementById(key);
		if (component) {
			if (key !== appID) {
				component.style.zIndex = `${app.z}`;
			} else {
				component.style.zIndex = `${applications.size + 1}`;
			}
		}
	});
}

export function normalizePosition(app: Map<string, ApplicationState>, activeApp: ApplicationState): Map<string, ApplicationState> {
	let data: Map<string, ApplicationState> = new Map();
	const index = (idx: number, dec: boolean) => {
		if (idx <= 0) return 0;
		else if (dec)
			return (idx - 1);
		else return idx;
	};

	app.forEach((state, key) => {
		if (key === activeApp.context.appID) {
			activeApp.z = index(activeApp.z, false);
			data.set(key, activeApp);
		} else {
			state.z = index(state.z, true);
			data.set(key, state);
		}
	});
	return data;
}
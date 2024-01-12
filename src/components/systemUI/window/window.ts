import type { Application } from '$lib/manifest/application.manifest';


export function normalizeZIndex(applications:Array<Application>, name: string) {
	applications.forEach((app) => {
		let component = document.getElementById(app.appID);
		if (component) {
			if (name == app.appID) {
				component.style.zIndex = `1`;
			} else {
				component.style.zIndex = `0`;
			}
		}
	});
}
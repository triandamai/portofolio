import { browser } from '$app/environment';
import type { Application } from './application';
import { appManager, type AppManager } from './app-manager';
import { systemManager, type SystemManager } from './system-manager';
import { dockManager, type DockManager } from './dock-manager';
import { statusbarManager, type StatusbarManager } from './statusbar-manager';
import { launchpadManager, type LaunchpadManager } from '$lib/core/framework/launchpad-manager';

export class Host {
	constructor() {
		if (browser) {
			systemManager.setWidth(document.documentElement.clientWidth);
			systemManager.setHeight(document.documentElement.clientHeight);
		}
	}
	static init() {
		return new Host();
	}

	static appManager(): AppManager {
		return appManager;
	}

	static systemManager(): SystemManager {
		return systemManager;
	}

	static dockManager(): DockManager {
		return dockManager;
	}

	static statusbarManager(): StatusbarManager {
		return statusbarManager;
	}

	static launchpadManager():LaunchpadManager{
		return launchpadManager
	}

	static findApplication(applicationId: string): Application | null {
		if (appManager.getListApplication().has(applicationId)) {
			return appManager.getListApplication().get(applicationId) ?? null;
		}
		return null;
	}

	static async loadApplication(target: Application) {
		return await import(
			`../../../applications/${target.getApplicationInfo().applicationId}/${
				target.getApplicationInfo().activity.componentName
			}.svelte`
		);
	}
}

export const host = Host.init();

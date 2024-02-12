import type { Application } from './application';
export type FullscreenCallbackListener = (fullscreen: boolean) => void;
export type MoveEnabledCallbackListener = (isMoving: boolean) => void;
export type RunningApplicatinCallbackListener = (isRemove: boolean, app: Application) => void;
export type ActiveAppChangeCallbackListener = (app: Application | null) => void;

export class AppManager {
	private isOnFullscreenMode: boolean = false;
	private onFullScreenChangeListener: Map<string, FullscreenCallbackListener> = new Map();

	private isMoveEnabled: boolean = false;
	private onMoveEnabledChangeListener: Map<string, MoveEnabledCallbackListener> = new Map();

	private applications: Map<string, Application> = new Map();

	private runningApplication: Map<string, Application> = new Map();
	private onRunningApplicationChangeListener: Map<string, RunningApplicatinCallbackListener> =
		new Map();

	private activeApplication: Application | null = null;
	private onActiveApplicationChangeListener: Map<string, ActiveAppChangeCallbackListener> =
		new Map();

	static init() {
		return new AppManager();
	}
	//list application
	getListApplication() {
		return this.applications;
	}
	setOrUpdateListApplication(app: Application) {
		this.applications.set(app.getApplicationInfo().applicationId, app);
	}
	//end list application
	// runtime app
	getListRuntimeApplication(): Map<string, Application> {
		return this.runningApplication;
	}

	addOnRuntimeApplicationChangeListener(key: string, listener: RunningApplicatinCallbackListener) {
		this.onRunningApplicationChangeListener.set(key, listener);
	}

	removeRuntimeApplicationChangeListener(key: string) {
		this.onRunningApplicationChangeListener.delete(key);
	}

	setOrUpdateRuntimeApplication(app: Application) {
		this.runningApplication.set(app.getApplicationInfo().applicationId, app);
		this.onRunningApplicationChangeListener.forEach((listener) => listener(false, app));
	}

	removeAppFromRuntime(app: Application) {
		this.runningApplication.delete(app.getApplicationInfo().applicationId);
		this.onRunningApplicationChangeListener.forEach((listener) => listener(true, app));
	}
	// end runtime app
	// active app
	getActiveApplication(): Application | null {
		return this.activeApplication;
	}
	addOnActiveApplicationChangeListener(key: string, listener: ActiveAppChangeCallbackListener) {
		this.onActiveApplicationChangeListener.set(key, listener);
	}
	removeOnActiveApplicationChangeListener(key: string) {
		this.onActiveApplicationChangeListener.delete(key);
	}
	setActiveApplication(app: Application | null) {
		this.activeApplication = app;
		this.onActiveApplicationChangeListener.forEach((listener) => listener(this.activeApplication));
	}

	openApplication(app: Application) {
		//set current to back
		const currentApplication = this.activeApplication;
		if (currentApplication != null) {
			const z = (currentApplication.getZIndex() ?? 0) - 1;
			if (z >= 0) {
				currentApplication.setZIndex(z);
			} else {
				currentApplication.setZIndex(0);
			}
			this.setOrUpdateRuntimeApplication(currentApplication);
		}
		//set new opened app to front
		app.setZIndex(this.runningApplication.size);
		this.setActiveApplication(app);
		this.onActiveApplicationChangeListener.forEach((listener) => listener(app));
		this.setOrUpdateRuntimeApplication(app)
	}

	closeApplication(app: Application) {
		if (
			this.activeApplication?.getApplicationInfo().applicationId ===
			app.getApplicationInfo().applicationId
		) {
			this.setActiveApplication(null);
			this.onActiveApplicationChangeListener.forEach((listener) => listener(app));
		}
		this.removeAppFromRuntime(app);
		this.onRunningApplicationChangeListener.forEach((listener) => listener(true, app));
	}
	// end active app
	//fullscreen change
	getIsFullscreenMode(): boolean {
		return this.isOnFullscreenMode;
	}

	addOnFullscreenModeChangeListener(key: string, listener: FullscreenCallbackListener) {
		this.onFullScreenChangeListener.set(key, listener);
	}

	removeFullscreenModeChangeListener(key: string) {
		this.onFullScreenChangeListener.delete(key);
	}

	setFullscreen(isFullscreen: boolean) {
		this.isOnFullscreenMode = isFullscreen;
		this.onFullScreenChangeListener.forEach((listener) => listener(this.isOnFullscreenMode));
	}
	//end fullscreen change

	//moving application(this is for dragging app)
	getIsMoveEnabled(): boolean {
		return this.isMoveEnabled;
	}

	addOnMoveEnabledChangeListener(key: string, listener: MoveEnabledCallbackListener) {
		this.onMoveEnabledChangeListener.set(key, listener);
	}

	removeMoveEnabledChangeListener(key: string) {
		this.onMoveEnabledChangeListener.delete(key);
	}

	setEnableMove(isEnabled: boolean) {
		this.isMoveEnabled = isEnabled;
		this.onMoveEnabledChangeListener.forEach((listener) => listener(this.isMoveEnabled));
	}
	//end moving
}

export const appManager = AppManager.init();

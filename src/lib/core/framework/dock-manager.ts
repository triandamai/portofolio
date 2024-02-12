import type { Application } from './application';

export type DockListenerCallback = (isRemove: boolean, app: Application) => void;
export type DockVisibilityChangedCallbackListener = (show:boolean) =>void

export class DockManager {
	private dockedApp: Map<string, Application> = new Map();
	private onDockChangeListener: Map<string, DockListenerCallback> = new Map();

	private isDockShow:boolean = true
	private onDockVisibilityChangedListener:Map<string,DockVisibilityChangedCallbackListener> = new Map()


	static init() {
		return new DockManager();
	}
	getIsDockShow():boolean{
		return this.isDockShow
	}

	addOnDockVisibilityChangedListener(key:string,listener:DockVisibilityChangedCallbackListener){
		this.onDockVisibilityChangedListener.set(key,listener)
	}

	removeDockVisibilityChangedListener(key:string){
		this.onDockVisibilityChangedListener.delete(key)
	}

	showDock(){
		this.isDockShow = true
		this.onDockVisibilityChangedListener.forEach(listener=>listener(this.isDockShow))
	}

	hideDock(){
		this.isDockShow = false
		this.onDockVisibilityChangedListener.forEach(listener=>listener(this.isDockShow))
	}

	getDockedApplication(): Map<string, Application> {
		return this.dockedApp;
	}

	getPinnedApplication(): Map<string, Application> {
		const dock: Map<string, Application> = new Map();
		Array.from(this.dockedApp.values())
			.filter((value) => value.isPinnedToDock)
			.forEach((app) => {
				dock.set(app.getApplicationInfo().applicationId, app);
			});
		return dock;
	}

	setOrUpdateDock(app: Application) {
		this.dockedApp.set(app.getApplicationInfo().applicationId, app);
		this.onDockChangeListener.forEach((listener) => listener(false, app));
	}

	removeApplicationFromDock(app: Application) {
		if (!app.isPinnedToDock) this.dockedApp.delete(app.getApplicationInfo().applicationId);
		this.onDockChangeListener.forEach((listener) => listener(true, app));
	}

	addOnDockChangeListener(key: string, listener: DockListenerCallback) {
		this.onDockChangeListener.set(key, listener);
	}

	removeDockListener(key: string) {
		this.onDockChangeListener.delete(key);
	}
}

export const dockManager = DockManager.init();

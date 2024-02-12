import type { Activity, ApplicationManifest, OptionsMenu, Toolbar } from '$lib/core/type';
import { Host } from '$lib/core/framework/host';

let oldYPosition: number = 0;

export interface OnTrafficLightCallbackListener {
	onRed: () => void;
	onYellow: () => void;
	onGreen: () => void;
}

export type SizeChangeCallbackListener = (
	width: number,
	height: number,
	x: number,
	y: number
) => void;

export type MoveListener = (x: number, y: number) => void;
export type ScreenApp = 'full' | 'relative';
export type ApplicationState = 'open' | 'close' | 'hidden';
export type ScreenChangeListener = (screen: ScreenApp) => void;

export class Application {
	private readonly applicationInfo: ApplicationManifest | null = null;
	private toolbar: Array<Toolbar> = [];
	private menubar: Array<OptionsMenu> = [];
	private showListener: Map<string, () => void> = new Map<string, () => void>();
	private hideListener: Map<string, () => void> = new Map<string, () => void>();
	private sizeChangedListener: Map<string, SizeChangeCallbackListener> = new Map();
	private onApplicationMoveListener: Map<string, MoveListener> = new Map();
	private onZIndexChangeListener: () => void = function () {};
	private onFullScreenChangeListener: Map<string, ScreenChangeListener> = new Map();
	private onTrafficLightListener:Map<string,OnTrafficLightCallbackListener>= new Map();

	z: number = 0;
	state: ApplicationState = 'close';
	screen: ScreenApp = 'relative';
	width: number = Host.systemManager().getWidth();
	height: number = Host.systemManager().getHeight();
	x: number = 0;
	y: number = 30;
	isPinnedToDock: boolean = false;

	constructor(options: ApplicationManifest, toolbar: Array<Toolbar>, menubar: Array<OptionsMenu>) {
		this.applicationInfo = options;
		this.toolbar = toolbar;
		this.menubar = menubar;
	}

	//registering application to os
	static register(
		opt: {
			applicationName: string;
			applicationId: string;
			author: string;
			toolbar: Array<Toolbar>;
			menubar: Array<OptionsMenu>;
			activity: Activity;
		},
		pinToDock: boolean
	) {
		const app = new Application(
			{
				applicationName: opt.applicationName,
				applicationId: opt.applicationId,
				author: opt.author,
				activity: opt.activity,
				state: 'quit'
			},
			opt.toolbar,
			opt.menubar
		);

		app.width = opt.activity.width;
		app.height = opt.activity.height;

		//set default position to center
		const w = app.width / 2;
		const h = app.height / 2;
		const yPos = Host.systemManager().getHeight() / 3 - h;

		app.x = Host.systemManager().getWidth() / 2 - w;
		if (yPos >= 28) {
			app.y = yPos;
		}

		if (pinToDock) {
			Host.dockManager().setOrUpdateDock(app);
		}
		Host.appManager().setOrUpdateListApplication(app);
	}

	getInstance(): Application {
		return this;
	}

	getApplicationInfo(): ApplicationManifest {
		return this.applicationInfo!;
	}

	openApplication() {
		if (this.applicationInfo === null) return;
		Host.appManager().openApplication(this.getInstance());
		Host.dockManager().setOrUpdateDock(this.getInstance());
		this.showApplication();
		if(this.getIsFullScreen()){
			this.enterFullScreen()
		}
	}

	closeApplication() {
		if (this.applicationInfo === null) return;
		Host.appManager().closeApplication(this.getInstance());
		Host.dockManager().removeApplicationFromDock(this.getInstance());
		this.hideApplication();
		this.exitFullScreen()
	}

	moveApplication(e: MouseEvent, maxYOffset: number) {
		//only move window when not in full screen
		if (this.screen === 'relative') {
			let posX = this.x;
			let posY = this.y;
			if (e.pageY < oldYPosition) {
				//top
				if (posY > maxYOffset && e.clientY > maxYOffset) {
					posX += e.movementX;
					posY += e.movementY;
				}
			} else {
				//bottom
				posX += e.movementX;
				posY += e.movementY;
			}
			oldYPosition = e.pageY;
			this.x = posX;
			this.y = posY;
			this.onApplicationMoveListener.forEach((cb) => cb(this.x, this.y));
		}
	}
	addOnTrafficLightListener(key:'desktop'|'app'|'cupertino',listener:OnTrafficLightCallbackListener){
		this.onTrafficLightListener.set(key,listener)
	}

	addOnMoveListener(key: 'desktop' | 'app', listener: (x: number, y: number) => void) {
		this.onApplicationMoveListener.set(key, listener);
	}

	removeOnMoveListener(key: 'desktop' | 'app') {
		this.onApplicationMoveListener.delete(key);
	}

	addOnShowListener(key: string, listener: () => void) {
		this.showListener.set(key, listener);
	}

	addOnHideListener(key: string, listener: () => void) {
		this.hideListener.set(key, listener);
	}

	addOnSizeChangedListener(
		key: string,
		listener: (w: number, height: number, x: number, y: number) => void
	) {
		this.sizeChangedListener.set(key, listener);
	}
	addOnZIndexChangeListener(listener: () => void) {
		this.onZIndexChangeListener = listener;
	}

	addOnScreenChangeListener(key: 'desktop' | 'app' | 'cupertino', listener: ScreenChangeListener) {
		this.onFullScreenChangeListener.set(key, listener);
	}

	enterFullScreen() {
		const w = Host.systemManager().getWidth();
		const h = Host.systemManager().getHeight();
		this.sizeChangedListener.forEach((cb) => cb(w, h, 0, 0));
		this.screen = 'full';
		Host.appManager().setFullscreen(true);
		this.onFullScreenChangeListener.forEach((listener) => listener(this.screen));
	}

	exitFullScreen() {
		this.sizeChangedListener.forEach((cb) => cb(this.width, this.height, this.x, this.y));
		this.screen = 'relative';
		Host.appManager().setFullscreen(false);
		this.onFullScreenChangeListener.forEach((listener) => listener(this.screen));
	}

	showApplication() {
		if (this.showListener) {
			this.showListener.forEach((cb) => cb());
		}
	}

	hideApplication() {
		if (this.hideListener) {
			this.hideListener.forEach((cb) => cb());
		}
	}

	onRedClicked(){
		this.closeApplication()
		this.onTrafficLightListener.forEach(listener=>listener.onRed())
	}

	onYellowClicked(){
		this.onTrafficLightListener.forEach(listener=>listener.onYellow())
	}

	onGreenClicked(){
		this.onTrafficLightListener.forEach(listener=>listener.onGreen())
	}

	getToolbar(): Array<Toolbar> {
		return this.toolbar;
	}

	getMenubar(): Array<OptionsMenu> {
		return this.menubar;
	}
	setZIndex(z: number) {
		this.z = z;
		this.onZIndexChangeListener();
	}
	getZIndex() {
		return this.z;
	}

	getIsFullScreen(): boolean {
		return this.screen === 'full';
	}
}

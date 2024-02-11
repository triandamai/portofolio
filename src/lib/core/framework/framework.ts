import type { Activity, ApplicationManifest, OptionsMenu, Toolbar } from '$lib/core/type';
import { dockedApp, Host, host } from '$lib/core/framework/host';

let oldYPosition: number = 0;

export class Application {
	private readonly applicationInfo: ApplicationManifest | null = null;
	private toolbar: Array<Toolbar> = [];
	private menubar: Array<OptionsMenu> = [];
	private showListener: Map<string, () => void> = new Map<string, () => void>();
	private hideListener: Map<string, () => void> = new Map<string, () => void>();
	private sizeChangedListener: Map<
		string,
		(w: number, height: number, x: number, y: number) => void
	> = new Map<string, (w: number, height: number, x: number, y: number) => void>();
	private onApplicationMoveListener: Map<string, (w: number, height: number) => void> = new Map<
		string,
		(w: number, height: number) => void
	>();
	private onZIndexChangeListener: () => void = function () {};
	private onFullScreenChangeListener: Map<string, (fullscreen: boolean) => void> = new Map<
		string,
		(full: boolean) => void
	>();

	z: number = 0;
	state: 'open' | 'close' | 'hidden' = 'close';
	screen: 'full' | 'relative' = 'relative';
	width: number = host.getWidth();
	height: number = host.getHeight();
	x: number = 0;
	y: number = 30;

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
		const yPos = host.getHeight() / 3 - h;

		app.x = host.getWidth() / 2 - w;
		if (yPos >= 28) {
			app.y = yPos;
		}

		if (pinToDock) {
			dockedApp.update((value) => {
				value.set(opt.applicationId, app);
				return value;
			});
		}
		Host.setApplication(opt.applicationId, app);
	}

	getInstance(): Application {
		return this;
	}

	getApplicationInfo(): ApplicationManifest {
		return this.applicationInfo!;
	}

	openApplication() {
		if (this.applicationInfo === null) return;
		Host.openApplication(this.applicationInfo.applicationId, this.getInstance());
		dockedApp.update((dock) => {
			dock.set(this.applicationInfo!.applicationId, this.getInstance());
			return dock;
		});
		this.showApplication();
	}

	closeApplication() {
		if (this.applicationInfo === null) return;
		Host.closeApplication(this.applicationInfo.applicationId);
		dockedApp.update((dock) => {
			dock.delete(this.getInstance().applicationInfo?.applicationId ?? '');
			return dock;
		});
		this.hideApplication();
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
	addOnFullScreenChangeListener(
		key: 'desktop' | 'app' | 'cupertino',
		listener: (isFullScreen: boolean) => void
	) {
		this.onFullScreenChangeListener.set(key, listener);
	}

	enterFullScreen() {
		const w = host.getWidth();
		const h = host.getHeight();
		this.sizeChangedListener.forEach((cb) => cb(w, h, 0, 0));
		this.screen = 'full';
		host.notifyIsAppInFullScreen(true);
		this.onFullScreenChangeListener.forEach((cb) => cb(true));
	}

	exitFullScreen() {
		this.sizeChangedListener.forEach((cb) => cb(this.width, this.height, this.x, this.y));
		this.screen = 'relative';
		host.notifyIsAppInFullScreen(false);
		this.onFullScreenChangeListener.forEach((cb) => cb(false));
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

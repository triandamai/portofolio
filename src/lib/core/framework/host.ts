import type { Toolbar } from '$lib/core/type';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Application } from './framework';

let systemTheme: boolean = false;
let systemWallpaper: string = '';
let systemToolbar: Array<Toolbar> = [];

export const dockedApp = writable<Map<string, Application>>(new Map<string, Application>());
let currentApplication: Application | null = null;
const openedApplication: Map<string, Application> = new Map();
const applications: Map<string, Application> = new Map<string, Application>();

export class Host {
	private width: number = 0;
	private height: number = 0;
	private maxYOffset: number = 27;
	private isOnFullScreenMode: boolean = false;
	private toolbarChangeListener: Map<string, (statusBar: Toolbar[]) => void> = new Map<
		string,
		() => void
	>();
	private currentApplicationChangeListener: Map<string, (app: Application) => void> = new Map<
		string,
		(app: Application) => void
	>();
	private enableMoveListener: () => void = function () {};
	private fullScreenChangeListener: (isFullScreen: boolean) => void = function () {};

	constructor() {
		if (browser) {
			this.width = document.documentElement.clientWidth;
			this.height = document.documentElement.clientHeight;
		}
	}

	getMaxYOffset(): number {
		return this.maxYOffset;
	}
	getWidth() {
		return this.width;
	}

	setWidth(w: number) {
		this.width = w;
	}

	setHeight(h: number) {
		this.height = h;
	}

	getHeight() {
		return this.height;
	}

	static init() {
		return new Host();
	}

	static findApplication(applicationId: string): Application | null {
		if (applications.has(applicationId)) {
			return applications.get(applicationId) ?? null;
		}
		return null;
	}

	static getCurrentApplication(): Application | null {
		return currentApplication;
	}

	static getApplicationList() {
		return applications;
	}

	static async loadApplication(target: Application) {
		return await import(
			`../../../applications/${target.getApplicationInfo().applicationId}/${
				target.getApplicationInfo().activity.componentName
			}.svelte`
		);
	}

	static setApplication(applicationId: string, target: Application) {
		applications.set(applicationId, target);
	}

	static openApplication(applicationId: string, target: Application) {
		if (currentApplication != null) {
			const z = currentApplication.getZIndex() - 1;
			if (z >= 0) {
				currentApplication.setZIndex(z);
			} else {
				currentApplication.setZIndex(0);
			}
			openedApplication.set(
				currentApplication.getApplicationInfo().applicationId,
				currentApplication
			);
		}

		openedApplication.set(applicationId, target);
		currentApplication = target;
		currentApplication.setZIndex(openedApplication.size);
		host.notifyCurrentApplicationChanged(target);
	}

	static closeApplication(applicationId: string) {
		if (!openedApplication.has(applicationId)) return;
		openedApplication.delete(applicationId);
	}

	changeTheme(isDark: boolean) {
		systemTheme = isDark;
		if (browser) {
			if (isDark) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}

	getFullScreenMode(): boolean {
		return this.isOnFullScreenMode;
	}

	addOnFullScreenChange(listener: (isFullScreen: boolean) => void) {
		this.fullScreenChangeListener = listener;
	}

	notifyIsAppInFullScreen(fullscreen: boolean) {
		this.isOnFullScreenMode = fullscreen;
		this.fullScreenChangeListener(fullscreen);
	}

	addOnEnableMoveListener(listener: () => void) {
		this.enableMoveListener = listener;
	}

	enableMove() {
		this.enableMoveListener();
	}

	addOnCurrentApplicationChangeListener(key: string, listener: (app: Application) => void) {
		this.currentApplicationChangeListener.set(key, listener);
	}

	removeCurrentApplicationChangeListener(key: string) {
		this.currentApplicationChangeListener.delete(key);
	}

	notifyCurrentApplicationChanged(target: Application) {
		this.currentApplicationChangeListener.forEach((v) => {
			v(target);
		});
	}
}

export const host = Host.init();

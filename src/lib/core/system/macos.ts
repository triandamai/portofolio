import type {
	OsKernel,
	RootListener,
	Application,
	OptionsMenu,
	Frame,
	Toolbar
} from '$lib/core/type';
import { systemToolbar } from '$lib/core/data';
import { writable } from 'svelte/store';

export const macos: OsKernel = {
	isDark: false,
	screen: {
		maxYOffset: 28,
		width: 900,
		height: 500
	},
	applications: [],
	docked_app: ['finder', 'launchpad', 'settings'],
	toolbar: [],
	toolbarSystem: [],
	menuToolbarSystem: systemToolbar,
	wallpaper: ''
};

export const theme = writable<'dark' | 'light'>(macos.isDark ? 'dark' : 'light');

export const rootListener: Map<string, RootListener> = new Map();

export function registerEvent(cb: RootListener, key: string = 'root') {
	rootListener.set(key, cb);
}

export function unregisterEvent(key: string = 'root') {
	rootListener.delete(key);
}
export function openApplication(target: Application) {
	rootListener.forEach((e) => e.openApp(target));
}
export function closeApplication(target: Application) {
	rootListener.forEach((e) => e.closeApp(target));
}
export function minimizeApplication(target: Application) {
	rootListener.forEach((e) => e.minimizeApp(target));
}
export function maximizeApplication(target: Application) {
	rootListener.forEach((e) => e.maximizeApp(target));
}
export function notifyEnableMoveApplication(target: Application) {
	rootListener.forEach((observer) => observer.onEnableMoveApp(target));
}

export function notifyApplicationActive(target: Application) {
	rootListener.forEach((observer) => observer.onAppActiveChanged(target));
}

export function MacOs() {
	function createOptionsMenu(...options: Array<Array<string>>): Array<OptionsMenu> {
		let menus: Array<OptionsMenu> = [];
		options.forEach((opt, index) => {
			const merge: Array<OptionsMenu> = opt.map((value) => {
				return {
					name: value,
					type: 'button'
				};
			});
			if (index < options.length - 1) {
				merge.push({ name: '', type: 'divider' });
			}
			menus = [...menus, ...merge];
		});
		return menus;
	}

	function changeTheme() {
		theme.update((theme) => {
			if (theme === 'dark') {
				macos.isDark = false;
				return 'light';
			}
			macos.isDark = true;
			return 'dark';
		});
	}

	function createFrameConfig(config: Frame): Frame {
		return config;
	}

	function createWindowConfig(width: number, height: number, maxYOffset: number) {
		macos.screen = {
			maxYOffset: maxYOffset,
			width: width,
			height: height
		};
	}

	function createToolbar(...tools: Array<Toolbar>) {
		return tools;
	}

	function createAppConfig(config: {
		appID: string;
		appName: string;
		author: string;
		component: Frame;
		openWhenStarting: boolean;
		toolbar: Array<Toolbar>;
	}) {
		const app: Application = {
			name: config.appName,
			appID: config.appID,
			author: config.author,
			component: config.component,
			state: config.openWhenStarting ? 'open' : 'quit',
			isDocked: macos.docked_app.includes(config.appID),
			tools: config.toolbar
		};
		macos.applications.push(app);
	}

	function createSystemToolbar(...config: Array<Toolbar>) {
		macos.toolbarSystem = config;
	}
	return {
		createToolbar,
		createOptionsMenu,
		createAppConfig,
		createWindowConfig,
		createFrameConfig,
		createSystemToolbar,
		changeTheme
	};
}

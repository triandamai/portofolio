import type {
	OsKernel,
	RootListener,
	Application,
	OptionsMenu,
	Frame,
	Toolbar
} from '$lib/kernel/type';
import { systemToolbar } from '$lib/kernel/data';
import { writable } from 'svelte/store';

export const kernel: OsKernel = {
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

export const theme = writable<'dark' | 'light'>(kernel.isDark ? 'dark' : 'light');

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

export function Os() {
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
				kernel.isDark = false;
				return 'light';
			}
			kernel.isDark = true;
			return 'dark';
		});
	}

	function createFrameConfig(config: Frame): Frame {
		return config;
	}

	function createWindowConfig(width: number, height: number, maxYOffset: number) {
		kernel.screen = {
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
			isDocked: kernel.docked_app.includes(config.appID),
			tools: config.toolbar
		};
		kernel.applications.push(app);
	}

	function createSystemToolbar(...config: Array<Toolbar>) {
		kernel.toolbarSystem = config;
	}

	function getOs(): OsKernel {
		return kernel;
	}
	return {
		createToolbar,
		createOptionsMenu,
		createAppConfig,
		createWindowConfig,
		createFrameConfig,
		createSystemToolbar,
		getOs,
		changeTheme
	};
}

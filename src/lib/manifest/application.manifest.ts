export type ApplicationState = {
	z: number,
	context: Application,
	state: 'open' | 'close' | 'idle',
	x: number,
	y: number
}
export type SystemToolbarMenu = {
	name: string;
	contextMenu: Array<OptionsMenu>
}

export type OptionsMenu = {
	name: string,
	type: 'divider' | 'button',
}
export type Window = {
	componentName: string,
	width: number,
	height: number,
	x: number,
	y: number,
	useDefaultPlatform: boolean
}
export type Application = {
	name: string,
	author: string,
	appID: string,
	component: Window,
	state: 'open' | 'quit',
	options: Array<OptionsMenu>,
	isDocked: boolean
}
export type OsKernel = {
	user: string,
	password: string,
	showLaunchpad: boolean,
	showStatusBar: boolean,
	lock: boolean,
	observer: Map<string, Map<string, (data: never) => void>>,
	applications: Array<Application>,
	docked_app: Array<string>,
	toolbar: Array<OptionsMenu>,
	toolbarSystem: Array<SystemToolbarMenu>,
	menuToolbarSystem: Array<OptionsMenu>,
	wallpaper: string
}
export const kernel: OsKernel = {
	user: 'Trian Damai',
	password: '',
	showLaunchpad: false,
	showStatusBar: false,
	lock: false,
	observer: new Map(),
	applications: [],
	docked_app: ['finder', 'launchpad', 'settings'],
	toolbar: [],
	toolbarSystem: [],
	menuToolbarSystem: [
		{
			name: 'About This Mac',
			type: 'button'
		},
		{
			name: '',
			type: 'divider'
		},
		{
			name: 'System Settings',
			type: 'button'
		},
		{
			name: 'App Store',
			type: 'button'
		},
		{
			name: '',
			type: 'divider'
		},
		{
			name: 'Sleep',
			type: 'button'
		},
		{
			name: 'Restart',
			type: 'button'
		},
		{
			name: 'Shutdown',
			type: 'button'
		},
		{
			name: '',
			type: 'divider'
		},
		{
			name: 'LockScreen',
			type: 'button'
		},
		{
			name: 'Log Out',
			type: 'button'
		}],
	wallpaper: ''
};

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

	function createWindowConfig(config: Window): Window {
		return config;
	}

	function createAppConfig(
		config: {
			appID: string,
			appName: string,
			author: string,
			component: Window,
			openWhenStarting: boolean,
			options: Array<OptionsMenu>
		}
	) {

		const app: Application = {
			name: config.appName,
			appID: config.appID,
			author: config.author,
			component: config.component,
			state: config.openWhenStarting ? 'open' : 'quit',
			options: [...config.options],
			isDocked: kernel.docked_app.includes(config.appID)
		};
		kernel.applications.push(app);
	}


	function createSystemToolbar(
		config: SystemToolbarMenu
	) {
		kernel.toolbarSystem.push(config);
	}

	function getOs(): OsKernel {
		return kernel;
	}

	function subscribe(target: string, key: string, event: (data: never) => void) {
		if (!kernel.observer.has(target)) {
			const map = new Map<string, (data: never) => void>();
			map.set(key, event);
			kernel.observer.set(target, map);
		} else {
			kernel.observer.get(target)?.set(key, event);
		}
	}

	function unsubscribe(target: string, key: string) {
		if (kernel.observer.has(target)) {
			kernel.observer.get(target)?.delete(key);
		}
	}

	function broadcastEvent(data: never) {
		kernel.observer.forEach((observer) => {
			observer.forEach((subs) => {
				subs(data);
			});
		});
	}

	function publishEvent(target: string, data: never) {
		kernel.observer.get(target)?.forEach((subs) => {
			subs(data);
		});
	}

	return {
		createOptionsMenu,
		createAppConfig,
		createWindowConfig,
		createSystemToolbar,
		subscribe,
		unsubscribe,
		publishEvent,
		broadcastEvent,
		getOs
	};
}

export type osEvent = 'selected-menu' | 'os-state-changed'
export type ApplicationState = {
	z: number,
	context: Application,
	state: 'open' | 'close' | 'idle',
	size: 'max' | 'min'
	width: number,
	height: number,
	x:number,
	y:number
}
export type Toolbar = {
	name: string;
	contextMenu: Array<OptionsMenu>
}

export type OptionsMenu = {
	name: string,
	type: 'divider' | 'button',
}
export type Window = {
	maxYOffset:number,
	width: number,
	height: number
}
export type Frame = {
	componentName: string,
	width: number,
	height: number,
	useDefaultPlatform: boolean
}
export type Application = {
	name: string,
	author: string,
	appID: string,
	component: Frame,
	state: 'open' | 'quit',
	tools: Array<Toolbar>,
	isDocked: boolean
}
export type OsKernel = {
	isDark:boolean,
	observer: Map<osEvent, Map<string, (data: any) => void>>,
	applications: Array<Application>,
	docked_app: Array<string>,
	toolbar: Array<Toolbar>,
	toolbarSystem: Array<Toolbar>,
	menuToolbarSystem: Array<OptionsMenu>,
	screen: Window,
	wallpaper: string
}
export const kernel: OsKernel = {
	isDark:false,
	screen: {
		maxYOffset:28,
		width: 900,
		height: 500
	},
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

	function changeTheme(isDark:boolean=false){
		kernel.isDark = isDark
	}

	function createFrameConfig(config: Frame): Frame {
		return config;
	}

	function createWindowConfig(width: number, height: number,maxYOffset:number) {
		kernel.screen = {
			maxYOffset:maxYOffset,
			width: width,
			height: height
		};
	}

	function createToolbar(...tools: Array<Toolbar>) {
		return tools;
	}

	function createAppConfig(
		config: {
			appID: string,
			appName: string,
			author: string,
			component: Frame,
			openWhenStarting: boolean,
			toolbar: Array<Toolbar>
		}
	) {

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


	function createSystemToolbar(
		...config: Array<Toolbar>
	) {
		kernel.toolbarSystem = config;
	}

	function getOs(): OsKernel {
		return kernel;
	}

	function subscribe(target: osEvent, key: string, event: (data: any) => void) {
		if (!kernel.observer.has(target)) {
			const map = new Map<string, (data: any) => void>();
			map.set(key, event);
			kernel.observer.set(target, map);
		} else {
			kernel.observer.get(target)?.set(key, event);
		}
	}

	function unsubscribe(target: osEvent, key: string) {
		if (kernel.observer.has(target)) {
			kernel.observer.get(target)?.delete(key);
		}
	}

	function broadcastEvent(data: any) {
		kernel.observer.forEach((observer) => {
			observer.forEach((subs) => {

				subs(data);
			});
		});
	}

	function publishEvent(target: osEvent, data: never) {
		kernel.observer.get(target)?.forEach((subs) => {
			subs(data);
		});
	}

	return {
		createToolbar,
		createOptionsMenu,
		createAppConfig,
		createWindowConfig,
		createFrameConfig,
		createSystemToolbar,
		subscribe,
		unsubscribe,
		publishEvent,
		broadcastEvent,
		getOs,
		changeTheme
	};
}

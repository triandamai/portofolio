const applications: Array<Application> = [];
const menu_toolbar_system: Array<SystemToolbarMenu> = [];
const systemContext: Array<OptionsMenu> = [
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
	}];


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
	state: 'open' | 'close' | 'quit',
	options: Array<OptionsMenu>
}

function createOptionsMenu(...options: Array<Array<string>>): Array<OptionsMenu> {
	let menus: Array<OptionsMenu> = [];
	options.forEach((opt, index) => {
		let merge: Array<OptionsMenu> = opt.map((value) => {
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
		options: Array<OptionsMenu>
	}
) {
	const app: Application = {
		name: config.appName,
		appID: config.appID,
		author: config.author,
		component: config.component,
		state: 'open',
		options: [...config.options]
	};
	applications.push(app);
}


function createSystemToolbar(
	config: SystemToolbarMenu
) {
	menu_toolbar_system.push(config);
}

export {
	applications,
	menu_toolbar_system,
	systemContext,
	createOptionsMenu,
	createAppConfig,
	createWindowConfig,
	createSystemToolbar
};

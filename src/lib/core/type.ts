export type RootListener = {
	onEnableMoveApp: (target: Application) => void;
	onAppActiveChanged: (target: Application) => void;
	openApp: (target: Application) => void;
	closeApp: (target: Application) => void;
	minimizeApp: (target: Application) => void;
	maximizeApp: (target: Application) => void;
};

export type ApplicationListener = {
	onMaximize: (width: number, height: number, x: number, y: number) => void;
	onMinimize: (width: number, height: number) => void;
	onPositionChanged: (x: number, y: number) => void;
	onStatusbarSelected: (menu: OptionsMenu) => void;
	onOpenApplication: (x: number, y: number) => void;
	onCloseApplication: () => void;
};
export type DataEvent = {
	[key: string]: DataEvent;
};
export type ApplicationState = {
	z: number;
	context: Application;
	state: 'open' | 'close' | 'idle';
	size: 'max' | 'min';
	width: number;
	height: number;
	x: number;
	y: number;
};
export type Toolbar = {
	name: string;
	contextMenu: Array<OptionsMenu>;
};

export type OptionsMenu = {
	name: string;
	type: 'divider' | 'button';
};
export type Window = {
	maxYOffset: number;
	width: number;
	height: number;
};
export type Frame = {
	componentName: string;
	width: number;
	height: number;
	useDefaultPlatform: boolean;
	fixedSize: boolean;
};
export type Application = {
	name: string;
	author: string;
	appID: string;
	component: Frame;
	state: 'open' | 'quit';
	tools: Array<Toolbar>;
	isDocked: boolean;
};
export type OsKernel = {
	isDark: boolean;
	applications: Array<Application>;
	docked_app: Array<string>;
	toolbar: Array<Toolbar>;
	toolbarSystem: Array<Toolbar>;
	menuToolbarSystem: Array<OptionsMenu>;
	screen: Window;
	wallpaper: string;
};

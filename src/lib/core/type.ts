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

export type Activity = {
	componentName: string;
	width: number;
	height: number;
	useDefaultPlatform: boolean;
	fixedSize: boolean;
};

export type ApplicationManifest = {
	applicationName: string;
	applicationId: string;
	author: string;
	activity: Activity;
	state: 'open' | 'quit';
};

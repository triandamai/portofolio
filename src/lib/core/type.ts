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

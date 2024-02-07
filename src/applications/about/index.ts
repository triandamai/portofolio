import { MacOs } from '$lib/core/system/macos';

const {
	createAppConfig,
	createOptionsMenu,
	createToolbar,
	createFrameConfig
} = MacOs();


createAppConfig({
	appName: 'About',
	appID: 'about',
	author: 'Trian Damai',
	component: createFrameConfig({
		componentName: 'About',
		width: 300,
		height: 400,
		useDefaultPlatform: true,
		fixedSize: false
	}),
	openWhenStarting: false,
	toolbar: createToolbar({
		name: 'About',
		contextMenu: createOptionsMenu(['About Notes'], ['Settings...'], ['Hide Note', 'Close Note'])
	})
});

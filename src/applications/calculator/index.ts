import { MacOs } from '$lib/core/system/macos';

const { createAppConfig, createOptionsMenu, createToolbar, createFrameConfig } = MacOs();

createAppConfig({
	appName: 'Calculator',
	appID: 'calculator',
	author: 'Trian Damai',
	component: createFrameConfig({
		componentName: 'Calculator',
		width: 300,
		height: 400,
		useDefaultPlatform: true,
		fixedSize: false
	}),
	openWhenStarting: false,
	toolbar: createToolbar({
		name: 'Calculator',
		contextMenu: createOptionsMenu(['About Notes'], ['Settings...'], ['Hide Note', 'Close Note'])
	})
});

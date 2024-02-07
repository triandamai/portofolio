import { MacOs } from '$lib/core/system/macos';

const { createAppConfig, createOptionsMenu, createToolbar, createFrameConfig } = MacOs();

createAppConfig({
	appName: 'Notes',
	appID: 'notes',
	author: 'Trian Damai',
	component: createFrameConfig({
		componentName: 'Notes',
		width: 600,
		height: 400,
		useDefaultPlatform: true,
		fixedSize: false
	}),
	openWhenStarting: false,
	toolbar: createToolbar({
		name: 'Notes',
		contextMenu: createOptionsMenu(['About Notes'], ['Settings...'], ['Hide Note', 'Close Note'])
	})
});

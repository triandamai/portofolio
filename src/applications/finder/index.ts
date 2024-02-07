import { MacOs } from '$lib/core/system/macos';

const { createAppConfig, createOptionsMenu, createToolbar, createFrameConfig } = MacOs();

createAppConfig({
	appName: 'Finder',
	appID: 'finder',
	author: 'Trian Damai',
	component: createFrameConfig({
		componentName: 'Finder',
		width: 600,
		height: 400,
		useDefaultPlatform: true,
		fixedSize: false
	}),
	openWhenStarting: false,
	toolbar: createToolbar(
		{
			name: 'Finder',
			contextMenu: createOptionsMenu(
				['About Finder'],
				['Settings...'],
				['Hide Finder', 'Close Finder']
			)
		},
		{
			name: 'Edit',
			contextMenu: createOptionsMenu(['New Folder'], ['Trash'], ['Hide File'])
		}
	)
});

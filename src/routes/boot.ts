import { Os } from '$lib/kernel/kernel';

const {
	createAppConfig,
	createSystemToolbar,
	createOptionsMenu,
	createToolbar,
	createFrameConfig
} = Os();

createSystemToolbar(
	{
		name: 'File',
		contextMenu: createOptionsMenu(['New', 'Open...', 'Save as', 'Recent'], ['Remote Developments'])
	},
	{
		name: 'Edit',
		contextMenu: createOptionsMenu(
			['Undo', 'Redo'],
			['Cut', 'Copy', 'Paste', 'Copy Path/Reference', 'Delete'],
			['Find', 'Find Usages']
		)
	},
	{
		name: 'Selection',
		contextMenu: createOptionsMenu(['Always Show Bookmar Bar', 'Always Hide Toolbar'])
	},
	{
		name: 'View',
		contextMenu: createOptionsMenu(['Always Show Bookmar Bar', 'Always Hide Toolbar'])
	},
	{
		name: 'Terminal',
		contextMenu: createOptionsMenu(
			['New Terminal', 'Split Terminal'],
			['Run Task...', 'Built Task...', 'Active Task']
		)
	}
);

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

import {
	Os
} from '$lib/manifest/application.manifest';

const kernel = Os();

kernel.createSystemToolbar(
	{
		name: 'File',
		contextMenu: kernel.createOptionsMenu(
			['New', 'Open...', 'Save as', 'Recent'],
			['Remote Developments']
		)
	},
	{
		name: 'Edit',
		contextMenu: kernel.createOptionsMenu(
			['Undo', 'Redo'],
			['Cut', 'Copy', 'Paste', 'Copy Path/Reference', 'Delete'],
			['Find', 'Find Usages']
		)
	},
	{
		name: 'Selection',
		contextMenu: kernel.createOptionsMenu(
			['Always Show Bookmar Bar', 'Always Hide Toolbar']
		)
	},
	{
		name: 'View',
		contextMenu: kernel.createOptionsMenu(
			['Always Show Bookmar Bar', 'Always Hide Toolbar']
		)
	},
	{
		name: 'Terminal',
		contextMenu: kernel.createOptionsMenu(
			['New Terminal', 'Split Terminal'],
			['Run Task...', 'Built Task...', 'Active Task']
		)
	});

kernel.createAppConfig(
	{
		appName: 'Finder',
		appID: 'finder',
		author: 'Trian Damai',
		component: kernel.createFrameConfig({
			componentName: 'Finder',
			width: 600,
			height: 400,
			useDefaultPlatform: true
		}),
		openWhenStarting: false,
		toolbar: kernel.createToolbar({
				name: 'Finder',
				contextMenu: kernel.createOptionsMenu(
					['About Finder'], ['Settings...'], ['Hide Finder', 'Close Finder']
				)
			},
			{
				name: 'Edit',
				contextMenu: kernel.createOptionsMenu(
					['New Folder'], ['Trash'], ['Hide File']
				)
			})
	}
);

kernel.createAppConfig(
	{
		appName: 'Notes',
		appID: 'notes',
		author: 'Trian Damai',
		component: kernel.createFrameConfig({
			componentName: 'Notes',
			width: 600,
			height: 400,
			useDefaultPlatform: true
		}),
		openWhenStarting: false,
		toolbar: kernel.createToolbar({
				name: 'Notes',
				contextMenu: kernel.createOptionsMenu(
					['About Notes'], ['Settings...'], ['Hide Note', 'Close Note']
				)
			}
		)
	}
);

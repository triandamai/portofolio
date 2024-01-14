import {
	Os
} from '$lib/manifest/application.manifest';

const kernel = Os();

kernel.createSystemToolbar({
	name: 'File',
	contextMenu: kernel.createOptionsMenu(
		['New', 'Open...', 'Save as', 'Recent'],
		['Remote Developments']
	)
});
kernel.createSystemToolbar({
	name: 'Edit',
	contextMenu: kernel.createOptionsMenu(
		['Undo', 'Redo'],
		['Cut', 'Copy', 'Paste', 'Copy Path/Reference', 'Delete'],
		['Find', 'Find Usages']
	)
});
kernel.createSystemToolbar({
	name: 'Selection',
	contextMenu: kernel.createOptionsMenu(
		['Always Show Bookmar Bar', 'Always Hide Toolbar']
	)
});
kernel.createSystemToolbar({
	name: 'View',
	contextMenu: kernel.createOptionsMenu(
		['Always Show Bookmar Bar', 'Always Hide Toolbar']
	)
});
kernel.createSystemToolbar(
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
		component: kernel.createWindowConfig({
			componentName: 'Finder',
			width: 600,
			height: 400,
			x: 0,
			y: 0,
			useDefaultPlatform: true
		}),
		openWhenStarting: false,
		options: kernel.createOptionsMenu(
			['About Finder'], ['Settings...'], ['Hide Finder', 'Close Finder']
		)
	}
);

kernel.createAppConfig(
	{
		appName: 'Notes',
		appID: 'notes',
		author: 'Trian Damai',
		component: kernel.createWindowConfig({
			componentName: 'Notes',
			width: 600,
			height: 400,
			x: 0,
			y: 0,
			useDefaultPlatform: true
		}),
		openWhenStarting: false,
		options: kernel.createOptionsMenu(
			['About Notes'], ['Settings...'], ['Hide Note', 'Close Note']
		)
	}
);

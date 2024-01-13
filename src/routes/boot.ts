import {
	createAppConfig,
	createOptionsMenu,
	createSystemToolbar,
	createWindowConfig
} from '$lib/manifest/application.manifest';

function loadSystemConfig() {
	createSystemToolbar({
		name: 'File',
		contextMenu: createOptionsMenu(
			['New', 'Open...', 'Save as', 'Recent'],
			['Remote Developments']
		)
	});
	createSystemToolbar({
		name: 'Edit',
		contextMenu: createOptionsMenu(
			['Undo', 'Redo'],
			['Cut', 'Copy', 'Paste', 'Copy Path/Reference', 'Delete'],
			['Find', 'Find Usages']
		)
	});
	createSystemToolbar({
		name: 'Selection',
		contextMenu: createOptionsMenu(
			['Always Show Bookmar Bar', 'Always Hide Toolbar']
		)
	});
	createSystemToolbar({
		name: 'View',
		contextMenu: createOptionsMenu(
			['Always Show Bookmar Bar', 'Always Hide Toolbar']
		)
	});
	createSystemToolbar(
		{
			name: 'Terminal',
			contextMenu: createOptionsMenu(
				['New Terminal', 'Split Terminal'],
				['Run Task...', 'Built Task...', 'Active Task']
			)
		});
}

function run() {
	createAppConfig(
		{
			appName: 'Finder',
			appID: 'finder',
			author: 'Trian Damai',
			component: createWindowConfig({
				componentName: 'Finder',
				width: 600,
				height: 400,
				x: 0,
				y: 0,
				useDefaultPlatform: true
			}),
			openWhenStarting:false,
			options: createOptionsMenu(
				['About Finder'], ['Settings...'], ['Hide Finder', 'Close Finder']
			)
		}
	);

	createAppConfig(
		{
			appName: 'Notes',
			appID: 'notes',
			author: 'Trian Damai',
			component: createWindowConfig({
				componentName: 'Notes',
				width: 600,
				height: 400,
				x: 0,
				y: 0,
				useDefaultPlatform: true
			}),
			openWhenStarting:false,
			options: createOptionsMenu(
				['About Notes'], ['Settings...'], ['Hide Note', 'Close Note']
			)
		}
	);
}

export { run, loadSystemConfig };
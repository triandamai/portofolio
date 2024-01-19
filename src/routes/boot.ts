import { MacOs } from '$lib/core/system/macos';

const { createSystemToolbar, createOptionsMenu } = MacOs();

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

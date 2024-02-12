import { Application } from '$lib/core/framework/application';

Application.register(
	{
		applicationName: 'System Setting',
		applicationId: 'setting',
		author: 'Trian Damai',
		activity: {
			componentName: 'Setting',
			width: 500,
			height: 600,
			useDefaultPlatform: true,
			fixedSize: false
		},
		toolbar: [
			{
				name: 'File',
				contextMenu: [
					{
						name: 'New File',
						type: 'button'
					}
				]
			}
		],
		menubar: []
	},
	false
);

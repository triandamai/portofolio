import { Application } from '$lib/core/framework/framework';

Application.register({
		applicationName: 'Notes',
		applicationId: 'notes',
		author: 'Trian Damai',
		activity: {
			componentName: 'Notes',
			width: 700,
			height: 400,
			useDefaultPlatform: true,
			fixedSize: false
		},
		toolbar: [
			{
				name:"File",
				contextMenu:[
					{
						name:"New File",
						type:"button"
					}
				]
			}
		],
		menubar: []
	},
	false
);
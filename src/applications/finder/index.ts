import { Application } from '$lib/core/framework/application';

Application.register({
		applicationName: 'Finder',
		applicationId: 'finder',
		author: 'Trian Damai',
		activity: {
			componentName: 'Finder',
			width: 600,
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
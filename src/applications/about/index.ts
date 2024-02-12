import { Application } from '$lib/core/framework/application';

Application.register({
		applicationName: 'About',
		applicationId: 'about',
		author: 'Trian Damai',
		activity: {
			componentName: 'About',
			width: 300,
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
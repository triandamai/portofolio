import { Application } from '$lib/core/framework/framework';

Application.register({
		applicationName: 'Calculator',
		applicationId: 'calculator',
		author: 'Trian Damai',
		activity: {
			componentName: 'Calculator',
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
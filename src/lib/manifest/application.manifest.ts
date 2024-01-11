type Application = {
	name: string,
	author: string,
	appID: string,
	component: string,
	width: number,
	height: number,
	state: 'open' | 'close' | 'quit',
	options: Array<{
		name: string,
		type: 'divider' | 'button',
	}>
}
const applications: Array<Application> = [
	{
		name: 'Notes',
		appID: 'Notes',
		author: 'Trian Damai',
		width: 900,
		height: 500,
		component: 'Notes',
		state: 'open',
		options: []
	},
	{
		name: 'Finder',
		appID: 'Finder',
		author: 'Trian Damai',
		width: 900,
		height: 500,
		component: 'Finder',
		state: 'open',
		options: []
	},
	{
		name: 'About',
		appID: 'About',
		author: 'Trian Damai',
		width: 600,
		height: 500,
		component: 'About',
		state: 'open',
		options: []
	}
];

export {
	applications
};
export type { Application };

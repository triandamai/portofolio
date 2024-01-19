import type { OptionsMenu } from '$lib/core/type';

export const systemToolbar:Array<OptionsMenu> = [
	{
		name: 'About This Mac',
		type: 'button'
	},
	{
		name: '',
		type: 'divider'
	},
	{
		name: 'System Settings',
		type: 'button'
	},
	{
		name: 'App Store',
		type: 'button'
	},
	{
		name: '',
		type: 'divider'
	},
	{
		name: 'Sleep',
		type: 'button'
	},
	{
		name: 'Restart',
		type: 'button'
	},
	{
		name: 'Shutdown',
		type: 'button'
	},
	{
		name: '',
		type: 'divider'
	},
	{
		name: 'LockScreen',
		type: 'button'
	},
	{
		name: 'Log Out',
		type: 'button'
	}
]
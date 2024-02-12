import type { Toolbar } from '../type';

export type ActiveToolbarCallbackListener = (toolbar: Array<Toolbar>) => void;
export type StatusbarVisibilityCallbackListener = (show:boolean)=>void

export class StatusbarManager {
	private systemToollbar: Toolbar = {
		name: 'System',
		contextMenu: [
			{
				name: 'About This Mac',
				type: 'button'
			},
			{
				name: '',
				type: 'divider'
			},
			{
				name: 'System Settings...',
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
				name: 'Restart...',
				type: 'button'
			},
			{
				name: 'Shut Down...',
				type: 'button'
			},
			{
				name: '',
				type: 'divider'
			},
			{
				name: 'Lock Screen',
				type: 'button'
			},
			{
				name: 'Log Out',
				type: 'button'
			}
		]
	};

	private activeToolbar: Array<Toolbar> = [];
	private onActiveToolbarChangeListener: Map<string, ActiveToolbarCallbackListener> = new Map();

	private isShowStatusbar:boolean=true
	private onStatusbarVisibilityChangedListener:Map<string,StatusbarVisibilityCallbackListener> = new Map()

	static init() {
		return new StatusbarManager();
	}

	getIsStatusbarShow():boolean{
		return this.isShowStatusbar
	}

	addOnStatusbarVisibilityChangedListener(key:string,listener:StatusbarVisibilityCallbackListener){
		this.onStatusbarVisibilityChangedListener.set(key,listener)
	}

	removeStatusbarVisibilityChangedListener(key:string){
		this.onStatusbarVisibilityChangedListener.delete(key)
	}

	showStatusbar(){
		this.isShowStatusbar = true
		this.onStatusbarVisibilityChangedListener.forEach(listener=>listener(this.isShowStatusbar))
	}

	hideStatusbar(){
		this.isShowStatusbar = false
		this.onStatusbarVisibilityChangedListener.forEach(listener=>listener(this.isShowStatusbar))
	}

	getSystemToolbar(): Toolbar {
		return this.systemToollbar;
	}

	getActiveToolbar(): Array<Toolbar> {
		return this.activeToolbar;
	}
}

export const statusbarManager = StatusbarManager.init();

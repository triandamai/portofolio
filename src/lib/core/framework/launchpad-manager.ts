import { Host } from '$lib/core/framework/host';

export type LaunchpadVisibilityCallbackListener=(isShow:boolean)=>void
export class LaunchpadManager {
	private isLaunchpadShow:boolean = false
	private onLaunchpadVisibilityChangedListener:Map<string,LaunchpadVisibilityCallbackListener> = new Map()

	static init(){
		return new LaunchpadManager()
	}

	getIsLaunchpadShow():boolean{
		return  this.isLaunchpadShow
	}

	addOnLaunchpadVisibilityChangedListener(key:string,listener:LaunchpadVisibilityCallbackListener){
		this.onLaunchpadVisibilityChangedListener.set(key,listener)
	}

	removeLaunchpadVisibilityChangedListener(key:string){
		this.onLaunchpadVisibilityChangedListener.delete(key)
	}

	showLaunchpad(){
		this.isLaunchpadShow = true
		Host.statusbarManager().hideStatusbar()
		this.onLaunchpadVisibilityChangedListener.forEach(listener=>listener(this.isLaunchpadShow))
	}

	hideLaunchpad(){
		this.isLaunchpadShow = false
		if(!Host.appManager().getIsFullscreenMode()) {
			Host.statusbarManager().showStatusbar()
		}
		this.onLaunchpadVisibilityChangedListener.forEach(listener=>listener(this.isLaunchpadShow))
	}
}

export const launchpadManager = LaunchpadManager.init()
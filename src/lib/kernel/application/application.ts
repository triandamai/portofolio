import { writable } from 'svelte/store';
import type { ApplicationState, ApplicationListener, OptionsMenu } from '../type';

const applicationObserver: Map<string, Map<string, ApplicationListener>> = new Map();
export const currentApplication = writable<ApplicationState | null>(null);
export const activeApplication = writable<Map<string, ApplicationState>>(new Map());

export function notifyAppMaximize(
	target: string,
	width: number,
	height: number,
	x: number = 0,
	y: number = 0
) {
	applicationObserver.get(target)?.forEach((e) => e.onMaximize(width, height, x, y));
}

export function notifyAppMinimize(target: string, width: number, height: number) {
	applicationObserver.get(target)?.forEach((e) => e.onMinimize(width, height));
}
export function notifyAppClose(target: string) {
	applicationObserver.get(target)?.forEach((e) => e.onCloseApplication());
}
export function notifyAppOpen(target: string, x: number, y: number) {
	applicationObserver.get(target)?.forEach((e) => e.onOpenApplication(x, y));
}

export function notifyPositionChanged(target: string, x: number, y: number) {
	applicationObserver.get(target)?.forEach((e) => e.onPositionChanged(x, y));
}
export function changeCurrentApplication(application: ApplicationState | null) {
	currentApplication.update(() => application);
}

export function invalidateActiveApp(data: Map<string, ApplicationState>) {
	activeApplication.set(data);
}

export function openApplication(target: ApplicationState) {
	activeApplication.update((value) => {
		value.set(target.context.appID, target);
		return value;
	});
}
export function closeApplication(target: string) {
	activeApplication.update((e) => {
		e.delete(target);
		return e;
	});
}
export function updateActiveApplication(app: ApplicationState) {
	activeApplication.update((e) => {
		e.set(app.context.appID, app);
		return e;
	});
}

export function registerReceiver(target: string, cb: ApplicationListener) {
	if (applicationObserver.has(target)) {
		applicationObserver.get(target)?.set(target, cb);
		return;
	}
	const map = new Map();
	map.set(target, cb);
	applicationObserver.set(target, map);
	return;
}

export function unregisterReceiver(target: string) {
	if (applicationObserver.has(target)) {
		applicationObserver.get(target)?.delete(target);
	}
}

export function subscribe(target: string, sub: string, cb: ApplicationListener) {
	if (applicationObserver.has(target)) {
		applicationObserver.get(target)?.set(sub, cb);
		return;
	}
	const map = new Map();
	map.set(sub, cb);
	applicationObserver.set(target, map);
	return;
}

export function unsubscribe(target: string, sub: string) {
	if (applicationObserver.has(target)) {
		applicationObserver.get(target)?.delete(sub);
	}
}

export function notifySelectedStatusBar(target: string, data: OptionsMenu) {
	applicationObserver.get(target)?.forEach((event) => event.onStatusbarSelected(data));
}

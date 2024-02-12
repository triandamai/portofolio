import { browser } from '$app/environment';

export type SystemTheme = 'dark' | 'light';
export type ThemeChangeCallbackListener = (theme: SystemTheme) => void;
export type WallpaperChangeCallbackListener = (wallpaper: string) => void;
export class SystemManager {
	private systemTheme: SystemTheme = 'dark';
	private onThemeChangeListener: Map<string, ThemeChangeCallbackListener> = new Map();

	private systemWallpaper: string = '';
	private listWallpaper: Array<string> = [];
	private onWallpaperChangeListener: Map<string, WallpaperChangeCallbackListener> = new Map();

	private width: number = 0;
	private height: number = 0;
	private maxYOffset: number = 27;

	static init() {
		return new SystemManager();
	}

	//theme
	getSystemTheme(): SystemTheme {
		return this.systemTheme;
	}
	addOnThemeChangeListener(key: string, listener: ThemeChangeCallbackListener) {
		this.onThemeChangeListener.set(key, listener);
	}

	removeOnThemeChangeListener(key: string) {
		this.onThemeChangeListener.delete(key);
	}

	changeSystemTheme(theme: SystemTheme) {
		this.systemTheme = theme;
		if (browser) {
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
		this.onThemeChangeListener.forEach((listener) => listener(this.systemTheme));
	}
	//end theme
	// walpaper
	getAvailableWallpaper(): Array<string> {
		return this.listWallpaper;
	}
	getSystemWalpaper(): string {
		return this.systemWallpaper;
	}

	addOnWallpaperChangeListener(key: string, listener: WallpaperChangeCallbackListener) {
		this.onWallpaperChangeListener.set(key, listener);
	}

	removeOnWallpaperChangeListener(key: string) {
		this.onWallpaperChangeListener.delete(key);
	}

	changeSystemWallpaper(wallpaper: string) {
		this.systemWallpaper = wallpaper;
		this.onWallpaperChangeListener.forEach((listener) => listener(this.systemWallpaper));
	}
	//end wallpaper

	getMaxYOffset(): number {
		return this.maxYOffset;
	}

	getWidth() {
		return this.width;
	}

	setWidth(w: number) {
		this.width = w;
	}

	setHeight(h: number) {
		this.height = h;
	}

	getHeight() {
		return this.height;
	}
}

export const systemManager = SystemManager.init();

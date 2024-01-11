import { readable } from 'svelte/store';

export const createIntervalStore = (duration: number) =>
	readable(new Date(), (setTime) => {
		const interval = setInterval(() => setTime(new Date()), duration);

		return () => clearInterval(interval);
	});

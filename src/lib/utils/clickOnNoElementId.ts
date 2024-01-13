/** Dispatch event on click outside of node */
export function clickOnNoElementId(
	node: HTMLElement,
	options: {
		callback: () => void
	}
) {
	const handleClick = (e: MouseEvent) => {
		if ((e.target as HTMLDivElement).id.length < 1) {
			if (node.contains(e.target as HTMLElement)) {
				options.callback();
			}
		}
	};

	node.addEventListener('click',handleClick,true)

	// document.addEventListener('mousedown', handleClick, true);

	return {
		destroy() {
			node.removeEventListener("click",handleClick,true)
			// document.removeEventListener('mousedown', handleClick, true);
		}
	};
}

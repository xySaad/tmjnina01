export function reSize(node: HTMLElement, onResize: () => void) {
	const observer = new ResizeObserver(onResize);
	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		}
	};
}

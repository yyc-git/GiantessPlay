import { getActualHeight, getActualWidth, isNeedHandleLandscape } from "./View";

export let rotateDom = (targetDom) => {
	let width = getActualWidth()
	let height = getActualHeight()

	targetDom.style.position = 'absolute';
	targetDom.style.width = `${height}px`;
	targetDom.style.height = `${width}px`;
	targetDom.style.left = `${0 - (height - width) / 2}px`;
	targetDom.style.top = `${(height - width) / 2}px`;
	targetDom.style.transform = 'rotate(90deg)';
	targetDom.style.transformOrigin = '50% 50%';
}

export let restoreDom = (targetDom) => {
	targetDom.style.position = 'absolute';
	targetDom.style.width = `100%`;
	targetDom.style.height = `100%`;
	targetDom.style.left = `${0}px`;
	targetDom.style.top = `${0}px`;
	targetDom.style.transform = 'none';
	targetDom.style.transformOrigin = '50% 50%';
}

export let getRootDom = () => {
	return document.querySelector("#root")
}

export let getPageX = ({ pageX, pageY }) => {
	if (isNeedHandleLandscape()) {
		return pageY
	}

	return pageX
}

export let getPageY = ({ pageX, pageY }) => {
	if (isNeedHandleLandscape()) {
		return getActualWidth() - pageX
	}

	return pageY
}


// export let getMovementX = ({ movementX, movementY }) => {
// 	if (isNeedHandleLandscape()) {
// 		return movementY
// 	}

// 	return movementX
// }

// export let getMovementY = ({ movementX, movementY }) => {
// 	if (isNeedHandleLandscape()) {
// 		// return -movementX
// 		return movementX
// 	}

// 	return movementY
// }

export let getScrollLeft = (scrollLeft, scrollTop) => {
	if (isNeedHandleLandscape()) {
		return scrollTop
	}

	return scrollLeft
}

export let getScrollTop = (scrollLeft, scrollTop) => {
	if (isNeedHandleLandscape()) {
		return getActualWidth() - scrollLeft
	}

	return scrollTop
}

export let getBoundingClientRect = (boundingClientRect) => {
	if (isNeedHandleLandscape()) {
		let top = getActualWidth() - boundingClientRect.left - boundingClientRect.width
		let left = boundingClientRect.top
		let width = boundingClientRect.height
		let height = boundingClientRect.width

		return {
			top,
			left,
			right: boundingClientRect.bottom,
			bottom: boundingClientRect.right,
			x: left,
			y: top,
			width,
			height,
		}
	}

	return boundingClientRect
}
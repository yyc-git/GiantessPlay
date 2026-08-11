import { readState } from "../../business_layer/State"
import { getIsDebug } from "../../scene3d_layer/script/scene/Scene"

export let buildCanvasId = () => {
	return "canvas"
}

export let getCanvas = () => {
	return document.querySelector<HTMLElement>(`#${buildCanvasId()}`)
}

export let restoreCanvasDisplay = () => {
	getCanvas().style.display = "block"

	if (getIsDebug(readState())) {
		getCanvas().style.zIndex = "1"
	}
}

export let showCanvas = () => {
	if (getIsDebug(readState())) {
		getCanvas().style.zIndex = "1"
		getCanvas().style.display = "block"
		return
	}

	// getCanvas().style.display = "block"
	// getCanvas().style.top = "0px"
	getCanvas().style.zIndex = "1"
}

export let hideCanvas = () => {
	if (getIsDebug(readState())) {
		getCanvas().style.display = "none"
		return
	}

	// getCanvas().style.display = "none"
	// getCanvas().style.opacity = "0"
	// getCanvas().style.top = "-10000px"
	getCanvas().style.zIndex = "-1000"
}

export let isCanvasShow = () => {
	if (getIsDebug(readState())) {
		return getCanvas().style.display == "block"
	}

	// return getCanvas().style.display == "block"
	return getCanvas().style.zIndex == "1"
}

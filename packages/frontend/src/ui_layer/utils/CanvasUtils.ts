export let buildCanvasId = () => {
	return "canvas"
}


export let showCanvas = () => {
	document.querySelector<HTMLElement>(`#${buildCanvasId()}`).style.display = "block"
}

export let hideCanvas = () => {
	document.querySelector<HTMLElement>(`#${buildCanvasId()}`).style.display = "none"
}

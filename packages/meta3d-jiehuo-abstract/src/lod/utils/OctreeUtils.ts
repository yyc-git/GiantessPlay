import * as THREE from "three";

export let addIndexToBox = (newIndex: number, box: THREE.Box3) => {
	(box as any).index = newIndex

	return box
}

export let getIndexFromBox = (box: THREE.Box3) => {
	return (box as any).index
}
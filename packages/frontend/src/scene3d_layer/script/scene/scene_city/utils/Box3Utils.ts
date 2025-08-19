import { Box3, Vector3 } from "three";

const _v1 = new Vector3();
const _v2 = new Vector3();


export let makeBoxHeightMax = (box: Box3) => {
    return box.expandByVector(_v1.set(0, 10000, 0))
}

export let makeBoxHeightMaxAndExpand = (box: Box3, scalar = 1.1) => {
    return box.expandByVector(_v1.set(0, 10000, 0)).expandByScalar(scalar)
}

export let expandBox = (box: Box3, scalar = 1.1) => {
    return box.expandByScalar(scalar)
}

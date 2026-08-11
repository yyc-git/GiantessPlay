import { NumberUtils } from "meta3d-jiehuo-abstract";
import { Box3, Vector3 } from "three";

let _v1 = new Vector3();
let _v2 = new Vector3();


export let makeBoxHeightMax = (box: Box3) => {
    return box.expandByVector(_v1.set(0, 10000, 0))
}

export let makeBoxHeightMaxAndExpand = (box: Box3, scalar = 1.1) => {
    return box.expandByVector(_v1.set(0, 10000, 0)).expandByScalar(scalar)
}

export let setBoxHeight = (box: Box3, height, centerY) => {
    return box.setFromCenterAndSize(
        box.getCenter(_v1).setY(centerY),
        box.getSize(_v2).setY(height)
    )
}


export let expandBox = (box: Box3, scalar = 1.1) => {
    return box.expandByScalar(scalar)
}

export let getBoxTopPoint = (box: Box3, factor, result: Vector3) => {
    let center = box.getCenter(result)

    return center.setY(
        // center.y + (box.getSize(_v1).y / 2)
        center.y + (box.getSize(_v1).y * (0.5 + factor))
    )
}

export let getBoxBottomPoint = (box: Box3, factor, result: Vector3) => {
    let center = box.getCenter(result)

    return center.setY(
        center.y - (box.getSize(_v1).y * (0.5 + factor))
    )
}


export let getBoxMaxXZSize = (box: Box3) => {
    let size = box.getSize(_v1)

    return Math.max(size.x, size.z)
}

export let getBoxMinXZSize = (box: Box3) => {
    let size = box.getSize(_v1)

    return Math.min(size.x, size.z)
}


export let getBoxMaxSize = (box: Box3) => {
    let size = box.getSize(_v1)

    return Math.max(size.x, size.y, size.z)
}

export let findMaxSizeIndex = (box: Box3) => {
    let size = box.getSize(_v1)

    let maxValue = Math.max(size.x, size.y, size.z)

    if (maxValue == size.x) {
        return 0
    }
    if (maxValue == size.y) {
        return 1
    }

    return 2
}

export let getRandomBoxEdgePoint = (box: Box3) => {
    let low = box.min;
    let high = box.max;

    return new Vector3().fromArray(NumberUtils.randomSelect(
        [
            [low.x, low.y, low.z],
            [high.x, low.y, low.z],
            [low.x, high.y, low.z],
            [low.x, low.y, high.z],

            [high.x, high.y, low.z],
            [high.x, low.y, high.z],
            [low.x, high.y, high.z],
            [high.x, high.y, high.z],
        ]
    ))
}


export let getBoxEdgePoint = (box: Box3, result = new Vector3()) => {
    let low = box.min;
    // let high = box.max;

    return result.fromArray([low.x, low.y, low.z])
}

export let getBoxVolumn = (box: Box3) => {
    let s = box.getSize(_v1)

    return s.x * s.y * s.z
}
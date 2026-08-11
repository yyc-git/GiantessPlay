import { Box3, Vector3 } from "three"
import { findMaxSizeIndex } from "./Box3Utils";
import { ArrayUtils } from "meta3d-jiehuo-abstract";


const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();


export let changeStandBoxToLieBox = (box: Box3) => {
    let center = box.getCenter(_v1)
    let size = box.getSize(_v2).toArray()


    let index = findMaxSizeIndex(box)

    let newSize = ArrayUtils.range(0, 2).reduce((newSize, i) => {
        if (i == index) {
            newSize[i] = size[i] / 4
        }
        else {
            newSize[i] = size[i] * 1.5
        }

        return newSize
    }, [])

    // let newCenter = center.clone().setY(size[index] / 8)
    let newCenter = center.clone().setY(
        center.y - (
            size[index] / 2 - size[index] / 8
        )
    )

    box.setFromCenterAndSize(
        newCenter,
        _v1.fromArray(newSize)
    )
}
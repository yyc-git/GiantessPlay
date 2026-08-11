import { NumberUtils } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { Vector3 } from "three";

export let findValidPoints = (points: Array<Vector3>, position: Vector3, min, max, isSortByDistance): Array<Vector3> => {
    let result = ArrayUtils.randomShuffle(points.filter(d => {
        // return NumberUtils.clamp(d.distanceTo(position), min, max)
        let distance = d.distanceTo(position)

        return distance >= min && distance <= max
    }))

    if (isSortByDistance) {
        return result.sort((a, b) => {
            return a.distanceTo(position) - b.distanceTo(position)
        })
    }

    return result
}
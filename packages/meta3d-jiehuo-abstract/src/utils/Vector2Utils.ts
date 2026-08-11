import { Vector2 } from "three";

const _v1_1 = new Vector2()
const _v1_2 = new Vector2()
const _v1_3 = new Vector2()


export let isNearlyEqual = (value1: Vector2, value2: Vector2, rangeSquared: number) => {
    return value1.distanceToSquared(value2) < rangeSquared
}

export let isInLine = (point: Vector2, lineStartPoint: Vector2, lineEndPoint: Vector2, rangeSquared = 0.1) => {
    return isNearlyEqual(
        _v1_1.copy(point).sub(lineStartPoint)
            .add(
                _v1_2.copy(lineEndPoint).sub(point)
            ),
        _v1_3.copy(lineEndPoint).sub(lineStartPoint),
        rangeSquared
    )
}

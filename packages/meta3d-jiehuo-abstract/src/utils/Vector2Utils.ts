import { Vector2 } from "three";

export let isNearlyEqual = (value1: Vector2, value2: Vector2, rangeSquared: number) => {
    return value1.distanceToSquared(value2) < rangeSquared
}

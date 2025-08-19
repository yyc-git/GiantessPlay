import { Vector3 } from "three";

export let getMaxValue = (v: Vector3) => {
    return Math.max(Math.max(v.x, v.y), v.z)
}

export let isNearlyEqual = (value1: Vector3, value2: Vector3, rangeSquared: number) => {
    return value1.distanceToSquared(value2) < rangeSquared
}

export let map = (v: Vector3, func) => {
    return v.set(func(v.x), func(v.y), func(v.z))
}
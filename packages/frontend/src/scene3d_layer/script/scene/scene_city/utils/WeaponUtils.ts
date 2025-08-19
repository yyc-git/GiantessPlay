import { Vector3 } from "three";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

export let computeHitPosition = (position, pointBox, direction, scalar) => {
    return _v1.fromArray(position).add(
        _v3.fromArray(direction).multiplyScalar(
            pointBox.getSize(_v2).length() * scalar
        )
    )
}
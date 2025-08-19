import { Vector2, Vector3, Camera } from "three"
import { getHeight, getWidth } from "meta3d-utils/src/View";
import { between } from "./NumberUtils";

const _v1 = new Vector3();
const _v2 = new Vector3();

export let convertWorldCoordniateToScreenCoordniate = (worldCoordniate: Vector3, camera: Camera) => {
    let widthHalf = getWidth() / 2
    let heightHalf = getHeight() / 2;

    let pos = _v1.copy(worldCoordniate)

    pos.project(camera);
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;

    return new Vector2(pos.x, pos.y)
}

export let convertScreenCoordniateToWorldCoordniate = (screenCoordniate: Vector2, camera: Camera, toNearPlane) => {
    const near = -1
    const far = 1

    return new Vector3(screenCoordniate.x / getWidth() * 2 - 1, -(screenCoordniate.y / getHeight() * 2 - 1), toNearPlane ? near : far).unproject(camera)
}

export let isOutsideScreen = (screenCoordniate, heightFactor) => {
    return !(between(screenCoordniate.x, 0, getWidth()) && between(screenCoordniate.y, getHeight() * heightFactor, getHeight() * (1 - heightFactor)))
}
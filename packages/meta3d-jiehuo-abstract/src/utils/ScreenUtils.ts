import { Vector2, Vector3, Camera } from "three"
import { getHeight, getWidth } from "meta3d-utils/src/View";
import { between } from "./NumberUtils";
import { NumberUtils } from "../Main";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v2_1 = new Vector2();


export let convertWorldCoordniateToScreenCoordniate = (worldCoordniate: Vector3, camera: Camera, result = new Vector2()) => {
    let widthHalf = getWidth() / 2
    let heightHalf = getHeight() / 2;

    let pos = _v1.copy(worldCoordniate)

    pos.project(camera);
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;

    return result.set(pos.x, pos.y)
}

export let convertScreenCoordniateToWorldCoordniate = (screenCoordniate: Vector2, camera: Camera, toNearPlane) => {
    const near = -1

    /*! fix 人类族群后退时准心消失的问题仍然存在 bug
    * 
    // const far = 1
    */
    const far = 0.9999

    return new Vector3(screenCoordniate.x / getWidth() * 2 - 1, -(screenCoordniate.y / getHeight() * 2 - 1), toNearPlane ? near : far).unproject(camera)
}

export let isOutsideScreen = (screenCoordniate, heightFactor) => {
    return !(between(screenCoordniate.x, 0, getWidth()) && between(screenCoordniate.y, getHeight() * heightFactor, getHeight() * (1 - heightFactor)))
}


let _handlePosition = (position, originPosition, camera, minPositionY, count) => {
    let screenCoordniate = convertWorldCoordniateToScreenCoordniate(position, camera, _v2_1)

    // if (position.y < minPositionY) {
    //     return position
    // }

    /*! handle screenCoordniate.x not in screen case(should adjust position.x)
    * 
    */
    if (position.y <= NumberUtils.lessThan(minPositionY, 0)
        // || count > 100
        || count > 20
    ) {
        return position
    }

    if (isOutsideScreen(screenCoordniate, 0.1)) {
        // return handlePositionRecur(position.setY(position.y - NumberUtils.greaterThan(position.y * 0.1, 1)), camera, minPositionY, count + 1)
        return _handlePosition(position.setY(position.y - NumberUtils.greaterThan(originPosition.y * 0.1, 5)), originPosition, camera, minPositionY, count + 1)
    }

    return position
}

export let handlePositionRecur = (position, camera, minPositionY, count = 0) => {
    return _handlePosition(position, position.clone(), camera, minPositionY, count)
}
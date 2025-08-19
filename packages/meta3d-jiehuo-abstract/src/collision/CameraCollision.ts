import { Ray, Vector3 } from "three"
import { state } from "../type/StateType"
// import { queryNeareastByRay } from "../StaticLODContainerUtils"
// import { getCameraCollisionableOctrees } from "./Collision"
import { getExn, isNullable, isStrictNullable, return_ } from "../utils/NullableUtils"
import { getOctreeForStaticLODContainer } from "../lod/LOD"

export let handleCameraCollision = (state: state, distanceBeforeCameraCollision, targetWorldPosition: Vector3, cameraCurrentWorldPosition: Vector3, velocity: Vector3) => {
    let targetToCameraDirection = cameraCurrentWorldPosition.clone().sub(targetWorldPosition).normalize()

    let ray = new Ray(targetWorldPosition, targetToCameraDirection)


    // let result = queryNeareastByRay(getCameraCollisionableOctrees(state), ray)
    let result = getOctreeForStaticLODContainer(state).queryByRay(state, ray)

    let cameraToTargetDistance = cameraCurrentWorldPosition.clone().distanceTo(targetWorldPosition)

    let currentDistance = cameraToTargetDistance



    if (
        isNullable(distanceBeforeCameraCollision) &&
        result[0] < cameraToTargetDistance
    ) {
        distanceBeforeCameraCollision = return_(currentDistance)
    }


    if (isNullable(distanceBeforeCameraCollision)) {
        return [velocity, distanceBeforeCameraCollision]
    }


    distanceBeforeCameraCollision = getExn(distanceBeforeCameraCollision)

    if (currentDistance < distanceBeforeCameraCollision
        && (
            // intersects.length == 0
            // || intersects[0].distance > currentDistance
            isStrictNullable(result[1])
            || result[0] > currentDistance
        )
    ) {
        let speed
        if (
            // intersects.length == 0 || intersects[0].distance > defaultDistance
            isStrictNullable(result[1])
            || result[0] > distanceBeforeCameraCollision
        ) {
            speed = distanceBeforeCameraCollision / currentDistance

            // speed = 0
        }
        else {
            speed = result[0] / currentDistance

            if (result[0] + speed > currentDistance) {
                speed = 0
            }
        }


        return [targetToCameraDirection.clone().multiplyScalar(speed), return_(distanceBeforeCameraCollision)]
    }

    if (
        // intersects.length == 0 || intersects[0].distance >= cameraToTargetDistance
        isStrictNullable(result[1])
        || result[0] >= cameraToTargetDistance

    ) {
        return [velocity, return_(distanceBeforeCameraCollision)]
    }

    let cameraToTargetDirection = targetWorldPosition.clone().sub(cameraCurrentWorldPosition).normalize()
    let speed = cameraToTargetDistance / result[0]

    return [velocity.add(cameraToTargetDirection.multiplyScalar(speed)), return_(distanceBeforeCameraCollision)]
}

export let computeAfterAddVelocity = (
    distanceBeforeCameraCollision, targetWorldPosition: Vector3, cameraCurrentWorldPosition: Vector3,
) => {
    if (isNullable(distanceBeforeCameraCollision)) {
        return distanceBeforeCameraCollision
    }

    let cameraToTargetDistance = cameraCurrentWorldPosition.clone().distanceTo(targetWorldPosition)

    if (cameraToTargetDistance >= getExn(distanceBeforeCameraCollision)) {
        return null
    }

    return distanceBeforeCameraCollision
}
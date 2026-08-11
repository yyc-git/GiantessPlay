import { OBB } from "meta3d-jiehuo-abstract/src/three/OBB";
import { Matrix4, Quaternion, Vector3 } from "three";

let _v1 = new Vector3();

export let makeOBBHeightMax = (obb: OBB) => {
    obb.halfSize.add(_v1.set(0, 10000, 0))

    return obb
}


export let expandOBB = (obb: OBB, scalar) => {
    obb.halfSize.multiplyScalar(scalar)

    return obb
}

export let getQuaternion = (obb: OBB, q = new Quaternion(), m = new Matrix4()) => {
    return q.setFromRotationMatrix(
        m.setFromMatrix3(
            obb.rotation
        )
    )
}
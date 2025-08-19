import { Euler, EulerOrder, Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { state } from "../type/StateType";
import { getScene } from "../scene/Scene";

const _v1 = /*@__PURE__*/ new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();
const _q1 = /*@__PURE__*/ new Quaternion();
const _m1 = /*@__PURE__*/ new Matrix4();
const _target = /*@__PURE__*/ new Vector3();

export let getWorldPosition = (obj: Object3D, target: Vector3) => {
    return target.setFromMatrixPosition(obj.matrixWorld);
}

export let setWorldPosition = (obj: Object3D, state: state, worldPosition: Vector3) => {
    let parent = obj.parent

    getScene(state).attach(obj)
    obj.position.copy(worldPosition)
    parent.attach(obj)

    return obj
}

// export let getLocalPosition = (matrixWorld: Matrix4, worldPosition: Vector3) => {
//     return worldPosition.clone().applyMatrix4(
//         _m1.copy(matrixWorld).invert()
//     )
// }

export let setWorldQuaternion = (obj: Object3D, state: state, worldQuaternion: Quaternion) => {
    let beforePosition = _v1.copy(obj.position)
    let beforeScale = _v2.copy(obj.scale)

    let parent = obj.parent

    getScene(state).attach(obj)
    obj.quaternion.copy(worldQuaternion)
    parent.attach(obj)

    obj.position.copy(beforePosition)
    obj.scale.copy(beforeScale)

    return obj
}

// export let convertWorldToLocalPosition = (worldMatrix: Matrix4, worldPosition: Vector3) => {
//     return worldPosition.applyMatrix4(_m1.copy(worldMatrix).invert())
// }

// export let convertLocalToWorldPosition = (worldMatrix: Matrix4, localPosition: Vector3) => {
//     return localPosition.applyMatrix4(worldMatrix)
// }

export let rotateOnWorldAxis = (quaternion: Quaternion, angle: number, axis: Vector3) => {
    // rotate object on axis in world space
    // axis is assumed to be normalized
    // method assumes no rotated parent

    _q1.setFromAxisAngle(axis, angle)

    return quaternion.premultiply(_q1)
}


export let rotateOnLocalAxis = (quaternion: Quaternion, angle: number, axis: Vector3) => {
    // rotate object on axis in world space
    // axis is assumed to be normalized
    // method assumes no rotated parent

    _q1.setFromAxisAngle(axis, angle)

    return quaternion.multiply(_q1);
}

export let rotate= (quaternion: Quaternion, euler:Euler) => {
    return quaternion.multiply(_q1.setFromEuler(euler));
}


// export let rotateAround = (
//     obj: Object3D,
//     // angle: number,
//     rot:Quaternion,

//     center: Vector3,

//     // axis: Vector3

//     ) => {
//     // var angle = null,
//     //     center = null,
//     //     axis = null,
//     // let rot: Quaternion = null,
//         let dir: Vector3 = null;

//     // if (args.length === 3) {
//     //     angle = args[0];
//     //     center = args[1];
//     //     axis = args[2];
//     // }
//     // else {
//     //     angle = args[0];
//     //     center = Vector3.create(args[1], args[2], args[3]);
//     //     axis = Vector3.create(args[4], args[5], args[6]);
//     // }

//     // rot = _q1.setFromAxisAngle(axis, angle);



//     // find current direction relative to center
//     dir = obj.position.clone().sub(center);

//     // rotate the direction
//     dir = dir.applyQuaternion(rot)

//     // define new position
//     obj.position.copy(center.add(dir))

//     //todo why "this.rotation = this.rotation.multiply(rot)" will cause entityObject rotate direction around self?
//     obj.quaternion.copy(rot.multiply(obj.quaternion))
//     // obj.quaternion.copy(rot)

//     return obj
// }

// export let rotateAround = (
//     // obj: Object3D,
//     // angle: number,
//     rot: Quaternion,

//     center: Vector3,

//     position: Vector3,
//     quaternion: Quaternion,

//     // axis: Vector3

// ):[Vector3, Quaternion] => {
//     // var angle = null,
//     //     center = null,
//     //     axis = null,
//     // let rot: Quaternion = null,
//     let dir: Vector3 = null;

//     // if (args.length === 3) {
//     //     angle = args[0];
//     //     center = args[1];
//     //     axis = args[2];
//     // }
//     // else {
//     //     angle = args[0];
//     //     center = Vector3.create(args[1], args[2], args[3]);
//     //     axis = Vector3.create(args[4], args[5], args[6]);
//     // }

//     // rot = _q1.setFromAxisAngle(axis, angle);



//     // find current direction relative to center
//     dir = position.clone().sub(center);

//     // rotate the direction
//     dir = dir.applyQuaternion(rot)

//     return [
//         center.clone().add(dir),
//         rot.multiply(quaternion)
//     ]
// }


export let rotateAround = (
    // obj: Object3D,
    angle: number,
    // rot: Quaternion,
    axis: Vector3,

    center: Vector3,

    position: Vector3,
    quaternion: Quaternion,


): [Vector3, Quaternion] => {
    // var angle = null,
    //     center = null,
    //     axis = null,
    // let rot: Quaternion = null,
    let dir: Vector3 = null;

    // if (args.length === 3) {
    //     angle = args[0];
    //     center = args[1];
    //     axis = args[2];
    // }
    // else {
    //     angle = args[0];
    //     center = Vector3.create(args[1], args[2], args[3]);
    //     axis = Vector3.create(args[4], args[5], args[6]);
    // }

    // let rot = _q1.setFromAxisAngle(axis, angle);
    let rot = new Quaternion().setFromAxisAngle(axis, angle);



    // find current direction relative to center
    dir = position.clone().sub(center);

    // rotate the direction
    dir = dir.applyQuaternion(rot)

    return [
        center.clone().add(dir),
        rot.multiply(quaternion)
    ]
}

export let getPositionFromMatrix4 = (mat: Matrix4) => {
    // return _v1.setFromMatrixPosition(mat)
    return new Vector3().setFromMatrixPosition(mat)
}

export let getPositionYFromMatrix4 = (mat: Matrix4) => {
    return mat.elements[13]
}

export let setPositionToMatrix4 = (mat: Matrix4, position: Vector3) => {
    mat.decompose(_v1, _q1, _v2)

    mat.compose(
        position,
        _q1,
        _v2
    )

    return mat
}

export let getScaleFromMatrix4 = (mat: Matrix4) => {
    return new Vector3().setFromMatrixScale(mat)
}

export let setScaleToMatrix4 = (mat: Matrix4, scale: Vector3) => {
    mat.decompose(_v1, _q1, _v2)

    mat.compose(
        _v1,
        _q1,
        scale
    )

    return mat
}

export let getRotationEulerFromMatrix4 = (mat: Matrix4, order = 'XYZ'): Euler => {
    return new Euler().setFromRotationMatrix(mat, order as EulerOrder)
}

export let getRotationQuaternionFromMatrix4 = (mat: Matrix4): Quaternion => {
    return new Quaternion().setFromRotationMatrix(mat)
}

export let setQuaternionToMatrix4 = (mat: Matrix4, quat) => {
    mat.decompose(_v1, _q1, _v2)

    mat.compose(
        _v1,
        quat,
        _v2
    )

    return mat
}

export let getLookatQuaternion = (sourcePosition, targetPosition) => {
    _m1.lookAt(targetPosition, sourcePosition, Object3D.DEFAULT_UP)

    return new Quaternion().setFromRotationMatrix(_m1)
}

export let getLookatEuler = (sourcePosition, targetPosition, order = 'XYZ') => {
    _m1.lookAt(targetPosition, sourcePosition, Object3D.DEFAULT_UP)

    return new Euler().setFromRotationMatrix(_m1, order as EulerOrder)
}

export let setMatrix = (obj: Object3D, matrix: Matrix4) => {
    obj.matrix.copy(matrix)

    obj.matrix.decompose(obj.position, obj.quaternion, obj.scale);

    return obj
}

export let positionAddY = (position: Vector3, value) => {
    return position.setY(position.y + value)
}
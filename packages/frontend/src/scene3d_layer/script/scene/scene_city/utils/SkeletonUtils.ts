import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { Box3, Matrix4, Quaternion, Vector3 } from "three"
import { getIsDebug } from "../../Scene";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getGirl } from "../girl/Girl";
import { getBone } from "./MMDUtils";
import { getCollisionPartOBB } from "../girl/Collision";
import { giantessAddToSkeletonData } from "../type/StateType";

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


let _getDebugValue = (key, defaultValue) => {
    let value = NullableUtils.getWithDefault(
        NullableUtils.map(value => Number(value),
            globalThis[key]
        ),
        defaultValue
    )

    return NumberUtils.isNumber(value) ? value : defaultValue
}


export let getPickTransformPrefix = () => "PickedTransform_"

export let getBreastTransformPrefix = () => "BreastTransform_"

export let getLittleHandTransformPrefix = () => "LittleHandTransform_"

export let getGiantessTransformFunc = (
    getInitialQuaternionFunc,

    transformPrefix,

    position,

    angle1,
    // axis1,
    angle2,
    // axis2,
    angle3,
    // axis3,

    isMultiplyScalar = true
) => {
    return (state, transform, collisionPartBox) => {
        let s = collisionPartBox.getSize(_v1).x

        let initialQuaternion = getInitialQuaternionFunc(state)

        if (getIsDebug(state)
            && NullableUtils.getWithDefault(
                NullableUtils.map(value => value != "null",
                    globalThis[transformPrefix + "tx"]
                ), false)
        ) {
            return new Matrix4().compose(
                isMultiplyScalar ? new Vector3(_getDebugValue(transformPrefix + "tx", position.x), _getDebugValue(transformPrefix + "ty", position.y), _getDebugValue(transformPrefix + "tz", position.z)).multiplyScalar(s) : new Vector3(_getDebugValue(transformPrefix + "tx", position.x), _getDebugValue(transformPrefix + "ty", position.y), _getDebugValue(transformPrefix + "tz", position.z)),
                // new Vector3(_getDebugValue(transformPrefix + "tx", position.x), _getDebugValue(transformPrefix + "ty", position.y), _getDebugValue(transformPrefix + "tz", position.z)).multiplyScalar(s),


                initialQuaternion.clone().premultiply(
                    TransformUtils.rotateOnLocalAxis(
                        new Quaternion(),
                        _getDebugValue(transformPrefix + "angle", angle1),
                        // new Vector3(
                        //     _getDebugValue(transformPrefix+ "ax"), _getDebugValue(transformPrefix+ "ay"), _getDebugValue(transformPrefix+ "az")
                        // )

                        // NullableUtils.getWithDefault(
                        //     globalThis[transformPrefix+ "a1"],
                        //     new Vector3(1, 0, 0)
                        // )
                        new Vector3(1, 0, 0)
                    )
                        .multiply(
                            TransformUtils.rotateOnLocalAxis(
                                new Quaternion(),
                                _getDebugValue(transformPrefix + "angle2", angle2),
                                // new Vector3(
                                //     _getDebugValue(transformPrefix+ "ax2"), _getDebugValue(transformPrefix+ "ay2"), _getDebugValue(transformPrefix+ "az2")
                                // )

                                // NullableUtils.getWithDefault(
                                //     globalThis[transformPrefix+ "a2"],
                                //     new Vector3(0, 1, 0)
                                // )
                                new Vector3(0, 1, 0)
                            )
                        )
                        .multiply(
                            TransformUtils.rotateOnLocalAxis(
                                new Quaternion(),
                                _getDebugValue(transformPrefix + "angle3", angle3),
                                // NullableUtils.getWithDefault(
                                //     globalThis[transformPrefix+ "a3"],
                                //     new Vector3(0, 0, 1)
                                // )
                                new Vector3(0, 0, 1)
                            )
                        )
                ),
                TransformUtils.getScaleFromMatrix4(transform)
            )
        }

        // Console.log(
        //     "sk:",
        //     transform,
        //     TransformUtils.getScaleFromMatrix4(transform)
        // )

        return new Matrix4().compose(
            isMultiplyScalar ? position.clone().multiplyScalar(s) : position.clone(),
            initialQuaternion.clone().premultiply(
                TransformUtils.rotateOnLocalAxis(
                    new Quaternion(),
                    angle1,
                    new Vector3(1, 0, 0)
                ).multiply(
                    TransformUtils.rotateOnLocalAxis(
                        new Quaternion(),
                        angle2,
                        new Vector3(0, 1, 0)
                    )
                ).multiply(
                    TransformUtils.rotateOnLocalAxis(
                        new Quaternion(),
                        angle3,
                        new Vector3(0, 0, 1)
                    )
                )
            ),
            TransformUtils.getScaleFromMatrix4(transform)
        )
    }
}

// export let getLittleHandTransformFunc = (
//     transformPrefix,

//     position,

//     angle1,
//     // axis1,
//     angle2,
//     // axis2,
//     angle3,
//     // axis3,

// ) => {
//     return (state, scale) => {
//         // let s = collisionPartBox.getSize(_v1).x

//         if (getIsDebug(state)
//             && NullableUtils.getWithDefault(
//                 NullableUtils.map(value => value != "null",
//                     globalThis[transformPrefix + "tx"]
//                 ), false)
//         ) {
//             return new Matrix4().compose(
//                 new Vector3(_getDebugValue(transformPrefix + "tx", position.x), _getDebugValue(transformPrefix + "ty", position.y), _getDebugValue(transformPrefix + "tz", position.z)),
//                 // .multiplyScalar(s),
//                 TransformUtils.rotateOnLocalAxis(
//                     new Quaternion(),
//                     _getDebugValue(transformPrefix + "angle", angle1),
//                     // new Vector3(
//                     //     _getDebugValue(transformPrefix+ "ax"), _getDebugValue(transformPrefix+ "ay"), _getDebugValue(transformPrefix+ "az")
//                     // )

//                     // NullableUtils.getWithDefault(
//                     //     globalThis[transformPrefix+ "a1"],
//                     //     new Vector3(1, 0, 0)
//                     // )
//                     new Vector3(1, 0, 0)
//                 )
//                     .multiply(
//                         TransformUtils.rotateOnLocalAxis(
//                             new Quaternion(),
//                             _getDebugValue(transformPrefix + "angle2", angle2),
//                             // new Vector3(
//                             //     _getDebugValue(transformPrefix+ "ax2"), _getDebugValue(transformPrefix+ "ay2"), _getDebugValue(transformPrefix+ "az2")
//                             // )

//                             // NullableUtils.getWithDefault(
//                             //     globalThis[transformPrefix+ "a2"],
//                             //     new Vector3(0, 1, 0)
//                             // )
//                             new Vector3(0, 1, 0)
//                         )
//                     )
//                     .multiply(
//                         TransformUtils.rotateOnLocalAxis(
//                             new Quaternion(),
//                             _getDebugValue(transformPrefix + "angle3", angle3),
//                             // NullableUtils.getWithDefault(
//                             //     globalThis[transformPrefix+ "a3"],
//                             //     new Vector3(0, 0, 1)
//                             // )
//                             new Vector3(0, 0, 1)
//                         )
//                     ),
//                 // TransformUtils.getScaleFromMatrix4(transform)
//                 scale
//             )
//         }

//         return new Matrix4().compose(
//             position.clone(),
//             // .multiplyScalar(s),
//             TransformUtils.rotateOnLocalAxis(
//                 new Quaternion(),
//                 angle1,
//                 new Vector3(1, 0, 0)
//             ).multiply(
//                 TransformUtils.rotateOnLocalAxis(
//                     new Quaternion(),
//                     angle2,
//                     new Vector3(0, 1, 0)
//                 )
//             ).multiply(
//                 TransformUtils.rotateOnLocalAxis(
//                     new Quaternion(),
//                     angle3,
//                     new Vector3(0, 0, 1)
//                 )
//             ),
//             // TransformUtils.getScaleFromMatrix4(transform)
//             scale
//         )
//     }
// }


export let getLittleHandTransform = (
    scale,

    position,

    angle1,
    // axis1,
    angle2,
    // axis2,
    angle3,
    // axis3,

) => {
    return new Matrix4().compose(
        position.clone(),
        // .multiplyScalar(s),
        TransformUtils.rotateOnLocalAxis(
            new Quaternion(),
            angle1,
            new Vector3(1, 0, 0)
        ).multiply(
            TransformUtils.rotateOnLocalAxis(
                new Quaternion(),
                angle2,
                new Vector3(0, 1, 0)
            )
        ).multiply(
            TransformUtils.rotateOnLocalAxis(
                new Quaternion(),
                angle3,
                new Vector3(0, 0, 1)
            )
        ),
        // TransformUtils.getScaleFromMatrix4(transform)
        scale
    )
}


export let getLittleHandTransformForDebug = (
    // transformPrefix,

    scale,

    position,

    angle1,
    // axis1,
    angle2,
    // axis2,
    angle3,
    // axis3,

) => {
    let transformPrefix = getLittleHandTransformPrefix()

    // let s = collisionPartBox.getSize(_v1).x

    // if (
    //     NullableUtils.getWithDefault(
    //         NullableUtils.map(value => value != "null",
    //             globalThis[transformPrefix + "tx"]
    //         ), false)
    // ) {
    // }
    return new Matrix4().compose(
        new Vector3(_getDebugValue(transformPrefix + "tx", position.x), _getDebugValue(transformPrefix + "ty", position.y), _getDebugValue(transformPrefix + "tz", position.z)),
        // .multiplyScalar(s),
        TransformUtils.rotateOnLocalAxis(
            new Quaternion(),
            _getDebugValue(transformPrefix + "angle", angle1),
            // new Vector3(
            //     _getDebugValue(transformPrefix+ "ax"), _getDebugValue(transformPrefix+ "ay"), _getDebugValue(transformPrefix+ "az")
            // )

            // NullableUtils.getWithDefault(
            //     globalThis[transformPrefix+ "a1"],
            //     new Vector3(1, 0, 0)
            // )
            new Vector3(1, 0, 0)
        )
            .multiply(
                TransformUtils.rotateOnLocalAxis(
                    new Quaternion(),
                    _getDebugValue(transformPrefix + "angle2", angle2),
                    // new Vector3(
                    //     _getDebugValue(transformPrefix+ "ax2"), _getDebugValue(transformPrefix+ "ay2"), _getDebugValue(transformPrefix+ "az2")
                    // )

                    // NullableUtils.getWithDefault(
                    //     globalThis[transformPrefix+ "a2"],
                    //     new Vector3(0, 1, 0)
                    // )
                    new Vector3(0, 1, 0)
                )
            )
            .multiply(
                TransformUtils.rotateOnLocalAxis(
                    new Quaternion(),
                    _getDebugValue(transformPrefix + "angle3", angle3),
                    // NullableUtils.getWithDefault(
                    //     globalThis[transformPrefix+ "a3"],
                    //     new Vector3(0, 0, 1)
                    // )
                    new Vector3(0, 0, 1)
                )
            ),
        // TransformUtils.getScaleFromMatrix4(transform)
        scale
    )

}

export let getGiantessParentTransform = (state: state, boneName): [state, Matrix4] => {
    let d = getBone(state, getGirl(state), boneName)
    state = d[0]
    let bone = d[1]

    return [state,
        TransformUtils.setScaleToMatrix4(
            bone.matrixWorld.clone(), _v1.set(1, 1, 1)
        )]
}


export let updateGiantessAddToSkeletonData = (state: state, giantessAddToSkeletonData: giantessAddToSkeletonData, collisionPart_, boneName) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(({ getTransformFunc, updateTransformFunc, getLocalTransformFunc, queue, index, name }) => {
            let collisionPartBox = getCollisionPartOBB(state, collisionPart_).toBox3()


            let d = getGiantessParentTransform(state, boneName)
            state = d[0]
            let parentTransform = d[1]

            state = updateTransformFunc(state, queue, index,
                parentTransform,
                getTransformFunc(
                    state,
                    getLocalTransformFunc(state, queue, index, name),
                    collisionPartBox
                )
            )

            return Promise.resolve(state)
        }, giantessAddToSkeletonData),
        Promise.resolve(state)
    )
}
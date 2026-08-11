import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { Box3, Matrix4, Quaternion, Vector3 } from "three"
import { getIsDebug } from "../../Scene";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getCurrentMMDCharacterName, getGirl } from "../girl/Girl";
import { getBone } from "./MMDUtils";
import { getCollisionPartOBB } from "../girl/Collision";
import { collisionPart, giantessAddToSkeletonData } from "../type/StateType";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { List } from "immutable";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getPositionOffset, getPutToBreastPositionOffset, getPutToShoePositionOffset, getUBControlledPositionOffset, isFirstUpdatePositionForPick, isFirstUpdatePositionForPutToBreast, isFirstUpdatePositionForPutToShoe, isFirstUpdatePositionForUBControlled, setPositionOffset, setPutToBreastPositionOffset, setPutToShoePositionOffset, setUBControlledPositionOffset } from "../girl/PickPoseUtils";
import { getBoneName } from "../girl/UBUtils";
import { getPutToBreastBoneName, getPutToShoeBoneName } from "../girl/PutUtils";
import { getPickedTransform, getPutToBreastTransform, getPutToShoeTransform, getUBControlledTransform } from "../../../../mod/MMDMod";

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

export let getUBControlledTransformPrefix = () => "UBControlledTransform_"

export let getPutToBreastTransformPrefix = () => "getPutToBreastTransformPrefix"

export let getPutToShoeTransformPrefix = () => "getPutToShoeTransformPrefix"

export let getBreastTransformPrefix = () => "BreastTransform_"

export let getLittleHandTransformPrefix = () => "LittleHandTransform_"

let _getGiantessTransformFunc = (
    [getInitialQuaternionFunc, getPositionOffsetFunc, getTransformFunc],

    transformPrefix,

    // position,

    angle1,
    // axis1,
    angle2,
    // axis2,
    angle3,
    // axis3,

    // isMultiplyScalar = true
) => {
    // return (state, transform, collisionPartBox, name) => {
    return (state, usedGirl, collisionPartBox, name) => {
        let [positionOffset, newAngle1] = NullableUtils.getWithDefaultFunc(
            NullableUtils.map(data => {
                let newAngle1

                if (data.isToToe === true) {
                    newAngle1 = 0
                }
                else {
                    newAngle1 = angle1
                }

                return [_v1.fromArray(data.positionOffset), newAngle1]
            }, getTransformFunc(state).find(d => d.mmdCharacter == getCurrentMMDCharacterName(state, usedGirl))),
            () => [_v1.set(0, 0, 0), angle1]
        )


        // let newPosition = position.clone().add(getPositionOffsetFunc(state, name)).add(positionOffset)
        let newPosition = getPositionOffsetFunc(state, usedGirl, name).clone().add(positionOffset)

        // let s = collisionPartBox.getSize(_v1).x

        let initialQuaternion = getInitialQuaternionFunc(state)

        if (getIsDebug(state)
            && NullableUtils.getWithDefault(
                NullableUtils.map(value => value != "null",
                    globalThis[transformPrefix + "tx"]
                ), false)
        ) {
            return new Matrix4().compose(
                new Vector3(_getDebugValue(transformPrefix + "tx", newPosition.x), _getDebugValue(transformPrefix + "ty", newPosition.y), _getDebugValue(transformPrefix + "tz", newPosition.z)),

                initialQuaternion.clone().premultiply(
                    TransformUtils.rotateOnLocalAxis(
                        new Quaternion(),
                        _getDebugValue(transformPrefix + "angle", newAngle1),
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
                // TransformUtils.getScaleFromMatrix4(transform)
                _v1.set(1, 1, 1)
            )
        }

        // Console.log(
        //     "sk:",
        //     transform,
        //     TransformUtils.getScaleFromMatrix4(transform)
        // )

        return new Matrix4().compose(
            newPosition,
            initialQuaternion.clone().premultiply(
                TransformUtils.rotateOnLocalAxis(
                    new Quaternion(),
                    newAngle1,
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
            // TransformUtils.getScaleFromMatrix4(transform)
            _v1.set(1, 1, 1)
        )
    }
}

export let getGiantessTransformFunc = (
    getInitialQuaternionFunc,

    transformPrefix,

    // position,

    angle1,
    // axis1,
    angle2,
    // axis2,
    angle3,
    // axis3,

    // isMultiplyScalar = true
) => {
    return _getGiantessTransformFunc(
        [getInitialQuaternionFunc, getPositionOffset, getPickedTransform],

        transformPrefix,

        // position,

        angle1,
        // axis1,
        angle2,
        // axis2,
        angle3,
        // axis3,

        // isMultiplyScalar
    )
}

export let getGiantessUBControlledTransformFunc = (
    getInitialQuaternionFunc,

    transformPrefix,

    // position,

    angle1,
    // axis1,
    angle2,
    // axis2,
    angle3,
    // axis3,

    // isMultiplyScalar = true
) => {
    return _getGiantessTransformFunc(
        [getInitialQuaternionFunc, getUBControlledPositionOffset, getUBControlledTransform],

        transformPrefix,

        // position,

        angle1,
        // axis1,
        angle2,
        // axis2,
        angle3,
        // axis3,

        // isMultiplyScalar
    )
}

export let getGiantessPutToBreastTransformFunc = (
    getInitialQuaternionFunc,

    transformPrefix,

    // position,

    angle1,
    // axis1,
    angle2,
    // axis2,
    angle3,
    // axis3,

    // isMultiplyScalar = true
) => {
    return _getGiantessTransformFunc(
        [getInitialQuaternionFunc, getPutToBreastPositionOffset, getPutToBreastTransform],

        transformPrefix,

        // position,

        angle1,
        // axis1,
        angle2,
        // axis2,
        angle3,
        // axis3,

        // isMultiplyScalar
    )
}

export let getGiantessPutToShoeTransformFunc = (
    getInitialQuaternionFunc,

    transformPrefix,

    // position,

    angle1,
    // axis1,
    angle2,
    // axis2,
    angle3,
    // axis3,

    // isMultiplyScalar = true
) => {
    return _getGiantessTransformFunc(
        [getInitialQuaternionFunc, getPutToShoePositionOffset, getPutToShoeTransform],

        transformPrefix,

        // position,

        angle1,
        // axis1,
        angle2,
        // axis2,
        angle3,
        // axis3,

        // isMultiplyScalar
    )
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

export let getGiantessParentTransform = (state: state, usedGirl, boneName): [state, Matrix4] => {
    let d = getBone(state, usedGirl, getGirl(state, usedGirl), boneName)
    state = d[0]
    let bone = d[1]

    return [state,
        // TransformUtils.setScaleToMatrix4(
        //     bone.matrixWorld.clone(), _v1.set(1, 1, 1)
        // )
        bone.matrixWorld.clone()
    ]
}

export let getHandBox = (state: state, usedGirl) => {
    return getCollisionPartOBB(state, usedGirl, collisionPart.RightHand).toBox3()
}

let _getHandBoneName = () => "右手首"

let _updateGiantessAddToSkeletonData = (state: state,
    [isFirstUpdatePositionFunc, setPositionOffsetFunc, getBoxFunc],
    boneName, giantessAddToSkeletonData: List<giantessAddToSkeletonData>) => {
    return ArrayUtils.reducePromise(
        giantessAddToSkeletonData.toArray(),
        (state, { getTransformFunc, updateTransformFunc, usedGirl, queue, index, name, originTransform }) => {
            let collisionPartBox = getBoxFunc(state, usedGirl)

            let d = getGiantessParentTransform(state, usedGirl, boneName)
            state = d[0]
            let parentTransform = d[1]

            if (
                NullableUtils.getWithDefault(
                    NullableUtils.map(queue => {
                        return queue.isAlive(index)
                    }, queue),
                    true
                )
            ) {
                if (isFirstUpdatePositionFunc(state, usedGirl, name)) {
                    state = setPositionOffsetFunc(state, usedGirl, name,
                        new Vector3(
                            NumberUtils.getRandomFloat(-0.1, 0.1),
                            NumberUtils.getRandomFloat(-0.05, 0.05),
                            NumberUtils.getRandomFloat(-0.1, 0.1),
                        )
                    )
                }

                state = updateTransformFunc(state, usedGirl, queue, index,
                    parentTransform,
                    getTransformFunc(
                        state,
                        usedGirl,
                        // getLocalTransformFunc(state, queue, index, name),
                        collisionPartBox,
                        name
                    ),
                    originTransform
                )
            }

            return Promise.resolve(state)
        },
        state
    )
}

export let updateGiantessAddToHandSkeletonData = (state: state, giantessAddToSkeletonData: List<giantessAddToSkeletonData>) => {
    return _updateGiantessAddToSkeletonData(state,
        [isFirstUpdatePositionForPick, setPositionOffset, getHandBox],
        _getHandBoneName(), giantessAddToSkeletonData)
}

export let getUBBox = (state: state, usedGirl) => {
    return getCollisionPartOBB(state, usedGirl, collisionPart.TrigoneAndButt).toBox3()
}

export let getPutToBreastBox = (state: state, usedGirl) => {
    return getCollisionPartOBB(state, usedGirl, collisionPart.RightBreast).toBox3()
}

export let getPutToShoeBox = (state: state, usedGirl) => {
    return getCollisionPartOBB(state, usedGirl, collisionPart.RightFoot).toBox3()
}


export let updateGiantessAddToUBSkeletonData = (state: state, giantessAddToSkeletonData: List<giantessAddToSkeletonData>) => {
    return _updateGiantessAddToSkeletonData(state,
        [isFirstUpdatePositionForUBControlled, setUBControlledPositionOffset, getUBBox],
        getBoneName(), giantessAddToSkeletonData)
}

export let updateGiantessAddToPutToBreastSkeletonData = (state: state, giantessAddToSkeletonData: List<giantessAddToSkeletonData>) => {
    return _updateGiantessAddToSkeletonData(state,
        [isFirstUpdatePositionForPutToBreast, setPutToBreastPositionOffset, getPutToBreastBox],
        getPutToBreastBoneName(), giantessAddToSkeletonData)
}

export let updateGiantessAddToPutToShoeSkeletonData = (state: state, giantessAddToSkeletonData: List<giantessAddToSkeletonData>) => {
    return _updateGiantessAddToSkeletonData(state,
        [isFirstUpdatePositionForPutToShoe, setPutToShoePositionOffset, getPutToShoeBox],
        getPutToShoeBoneName(), giantessAddToSkeletonData)
}
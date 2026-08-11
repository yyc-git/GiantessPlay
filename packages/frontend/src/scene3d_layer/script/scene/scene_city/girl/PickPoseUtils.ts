import { Box3, DstAlphaFactor, Matrix4, Quaternion, Vector3 } from "three";
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue";
import { lodQueueIndex, name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "../../../../type/StateType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue";
import { LOD } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../../../state/State";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { getCurrentUsedGirls, getUsedGirlData, isTriggerAction, isUseGirl, setUsedGirlData } from "./Girl";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { actionName, animationName } from "../data/DataType";
import { getBoxVolumn } from "../utils/Box3Utils";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { Event } from "meta3d-jiehuo-abstract";
import { buildRemoveDataData, getRemoveBreastDataEventName, getRemovePickDataEventName, getRemoveShoeDataEventName, getRemoveUBDataEventName } from "../../../../utils/EventUtils";
import { usedGirl, usedGirlEnum } from "../type/StateType";

const _v1 = new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();
const _q1 = /*@__PURE__*/ new Quaternion();
const _m1 = new Matrix4();
const _m2 = new Matrix4();

// let _makeSureScaleOfWorldMatrixEqualLocalOne = (transform, localTransform) => {
//     return TransformUtils.setScaleToMatrix4(
//         transform,
//         TransformUtils.getScaleFromMatrix4(localTransform)
//     )
// }

let _updateTransform = (queue: LODQueue, index: lodQueueIndex, parentTransform: Matrix4, localTransform: Matrix4, originTransform) => {
    queue.updateTransform2(
        (transform) => {
            transform.copy(
                /*! keep scale not change
                * 
                */
                TransformUtils.setScaleToMatrix4(
                    _m1.multiplyMatrices(
                        parentTransform,
                        localTransform,
                    ),
                    TransformUtils.getScaleFromMatrix4(originTransform)
                )
            )
        }, index, true
    )
}

export let updateTransform = (state: state, usedGirl, queue: LODQueue, index: lodQueueIndex, parentTransform: Matrix4, localTransform: Matrix4, originTransform) => {
    _updateTransform(queue, index, parentTransform, localTransform, originTransform)

    return state
}

// export let updateHierachyLODQueueTransform = (state: state, queue: HierachyLODQueue, index: lodQueueIndex, parentTransform: Matrix4, localTransform: Matrix4) => {
export let updateHierachyLODQueueTransform = (state: state, usedGirl, queue: HierachyLODQueue, index: lodQueueIndex, parentTransform: Matrix4, localTransform: Matrix4, originTransform) => {
    LOD.markNeedsUpdate(getAbstractState(state), queue.name, index, true)

    _updateTransform(queue, index, parentTransform, localTransform, originTransform)

    return state
}

export let updateUBControlledTransform = updateTransform

export let updatePutToBreastTransform = updateTransform

export let updatePutToShoeTransform = updateTransform


export let getLocalTransform = (state: state, queue, index, name): nullable<Matrix4> => {
    return NullableUtils.getExn(queue).getTransform(index)
}

export let getBoxForPick = (state: state, queue, index, name): nullable<Box3> => {
    return NullableUtils.getExn(queue).getBox(index)
}

export let hasPickData = (state: state, usedGirl) => {
    // return isUseGirl(state, usedGirl) && !NullableUtils.isNullable(getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData)
    return isUseGirl(state, usedGirl) && getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.count() > 0
}

export let getPositionOffset = (state: state, usedGirl, name: name) => {
    return NullableUtils.getExn(getUsedGirlData(state, usedGirl).positionOffsetForPick.get(name))
}

export let getUBControlledPositionOffset = (state: state, usedGirl, name: name) => {
    return NullableUtils.getExn(getUsedGirlData(state, usedGirl).positionOffsetForUBControlled.get(name))
}

export let getPutToBreastPositionOffset = (state: state, usedGirl, name: name) => {
    return NullableUtils.getExn(getUsedGirlData(state, usedGirl).positionOffsetForPutToBreast.get(name))
}

export let getPutToShoePositionOffset = (state: state, usedGirl, name: name) => {
    return NullableUtils.getExn(getUsedGirlData(state, usedGirl).positionOffsetForPutToShoe.get(name))
}


export let isFirstUpdatePositionForPick = (state: state, usedGirl, name: name) => {
    return !getUsedGirlData(state, usedGirl).positionOffsetForPick.has(name)
}

export let isFirstUpdatePositionForUBControlled = (state: state, usedGirl, name: name) => {
    return !getUsedGirlData(state, usedGirl).positionOffsetForUBControlled.has(name)
}

export let isFirstUpdatePositionForPutToBreast = (state: state, usedGirl, name: name) => {
    return !getUsedGirlData(state, usedGirl).positionOffsetForPutToBreast.has(name)
}

export let isFirstUpdatePositionForPutToShoe = (state: state, usedGirl, name: name) => {
    return !getUsedGirlData(state, usedGirl).positionOffsetForPutToShoe.has(name)
}


export let setPositionOffset = (state: state, usedGirl, name: name, offset: Vector3) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        positionOffsetForPick: getUsedGirlData(state, usedGirl).positionOffsetForPick.set(name, offset),
    })
}

export let setUBControlledPositionOffset = (state: state, usedGirl, name: name, offset: Vector3) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        positionOffsetForUBControlled: getUsedGirlData(state, usedGirl).positionOffsetForUBControlled.set(name, offset),
    })
}

export let setPutToBreastPositionOffset = (state: state, usedGirl, name: name, offset: Vector3) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        positionOffsetForPutToBreast: getUsedGirlData(state, usedGirl).positionOffsetForPutToBreast.set(name, offset),
    })
}

export let setPutToShoePositionOffset = (state: state, usedGirl, name: name, offset: Vector3) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        positionOffsetForPutToShoe: getUsedGirlData(state, usedGirl).positionOffsetForPutToShoe.set(name, offset),
    })
}


export let removePickData = (state: state, name: name) => {
    return ArrayUtils.reducePromise(
        getCurrentUsedGirls(state),
        (state, usedGirl) => {
            let promise = Promise.resolve(state)
            if (!NullableUtils.isNullable(getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.find(data => data.name == name))) {
                promise = Event.trigger(state, getAbstractState, getRemovePickDataEventName(), NullableUtils.return_(buildRemoveDataData(name)))
            }

            return promise.then(state => {
                return setUsedGirlData(state, usedGirl, {
                    ...getUsedGirlData(state, usedGirl),
                    giantessAddToHandSkeletonData: getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.filter(data => data.name != name),
                    positionOffsetForPick: getUsedGirlData(state, usedGirl).positionOffsetForPick.remove(name),
                })
            })
        },
        state
    )
}

export let removeUBData = (state: state, name: name) => {
    return ArrayUtils.reducePromise(
        getCurrentUsedGirls(state),
        (state, usedGirl) => {
            let promise = Promise.resolve(state)
            if (!NullableUtils.isNullable(getUsedGirlData(state, usedGirl).giantessAddToUBSkeletonData.find(data => data.name == name))) {
                promise = Event.trigger(state, getAbstractState, getRemoveUBDataEventName(), NullableUtils.return_(buildRemoveDataData(name)))
            }

            return promise.then(state => {
                return setUsedGirlData(state, usedGirl, {
                    ...getUsedGirlData(state, usedGirl),
                    giantessAddToUBSkeletonData: getUsedGirlData(state, usedGirl).giantessAddToUBSkeletonData.filter(data => data.name != name),
                    positionOffsetForUBControlled: getUsedGirlData(state, usedGirl).positionOffsetForUBControlled.remove(name),
                })
            })

        },
        state
    )

}

export let removePutToBreastData = (state: state, name: name) => {
    return ArrayUtils.reducePromise(
        getCurrentUsedGirls(state),
        (state, usedGirl) => {
            let promise = Promise.resolve(state)
            if (!NullableUtils.isNullable(getUsedGirlData(state, usedGirl).giantessAddToBreastSkeletonData.find(data => data.name == name))) {
                promise = Event.trigger(state, getAbstractState, getRemoveBreastDataEventName(), NullableUtils.return_(buildRemoveDataData(name)))
            }

            return promise.then(state => {
                return setUsedGirlData(state, usedGirl, {
                    ...getUsedGirlData(state, usedGirl),
                    giantessAddToBreastSkeletonData: getUsedGirlData(state, usedGirl).giantessAddToBreastSkeletonData.filter(data => data.name != name),
                    positionOffsetForPutToBreast: getUsedGirlData(state, usedGirl).positionOffsetForPutToBreast.remove(name),
                })
            })

        },
        state
    )


}

export let removePutToShoeData = (state: state, name: name) => {
    return ArrayUtils.reducePromise(
        getCurrentUsedGirls(state),
        (state, usedGirl) => {
            let promise = Promise.resolve(state)
            if (!NullableUtils.isNullable(getUsedGirlData(state, usedGirl).giantessAddToShoeSkeletonData.find(data => data.name == name))) {
                promise = Event.trigger(state, getAbstractState, getRemoveShoeDataEventName(), NullableUtils.return_(buildRemoveDataData(name)))
            }

            return promise.then(state => {
                return setUsedGirlData(state, usedGirl, {
                    ...getUsedGirlData(state, usedGirl),
                    giantessAddToShoeSkeletonData: getUsedGirlData(state, usedGirl).giantessAddToShoeSkeletonData.filter(data => data.name != name),
                    positionOffsetForPutToShoe: getUsedGirlData(state, usedGirl).positionOffsetForPutToShoe.remove(name),
                })
            })
        },
        state
    )

}

export let removeFromAllData = (state: state, name: name) => {
    return ArrayUtils.reducePromise(
        getCurrentUsedGirls(state),
        (state, usedGirl) => {
            if (!isUseGirl(state, usedGirl)) {
                return Promise.resolve(state)
            }

            return removePickData(state, name).then(state => {
                return removeUBData(state, name)
            }).then(state => {
                return removePutToBreastData(state, name)
            }).then(state => {
                return removePutToShoeData(state, name)
            })
        },
        state
    )
}


export let getPickObjectBox = (state: state, usedGirl) => {
    // let { getBoxFunc, queue, index, name } = NullableUtils.getExn(getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData)

    // return getBoxFunc(state, queue, index, name)

    return getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.reduce((box, { getBoxFunc, queue, index, name }) => {
        let b = getBoxFunc(state, queue, index, name)
        if (NullableUtils.isNullable(b)) {
            return box
        }

        return box.union(b)
    }, new Box3())
}

let _getTotalBoxVolume = (state: state, data) => {
    return data.reduce((volume, { getBoxFunc, queue, index, name }) => {
        return volume + NullableUtils.getWithDefault(
            NullableUtils.map(getBoxVolumn, getBoxFunc(state, queue, index, name)),
            0
        )
    }, 0)
}

export let getPickObjectTotalBoxVolume = (state: state, usedGirl) => {
    return _getTotalBoxVolume(state, getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData)
}

export let getUBObjectTotalBoxVolume = (state: state, usedGirl) => {
    return _getTotalBoxVolume(state, getUsedGirlData(state, usedGirl).giantessAddToUBSkeletonData)
}

export let getBreastObjectTotalBoxVolume = (state: state, usedGirl) => {
    return _getTotalBoxVolume(state, getUsedGirlData(state, usedGirl).giantessAddToBreastSkeletonData)
}

export let getShoeObjectTotalBoxVolume = (state: state, usedGirl) => {
    return _getTotalBoxVolume(state, getUsedGirlData(state, usedGirl).giantessAddToShoeSkeletonData)
}


// export let getPickObjectQueueName = (state: state): nullable<name> => {
//     // let { queue } = NullableUtils.getExn(getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData)

//     // return NullableUtils.map(queue => queue.name, queue)

//     return NullableUtils.map(
//         queue => queue.name,
//         NumberUtils.randomSelect(getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.toArray()).queue
//     )
// }

export let getRandomPickObjectName = (state: state, usedGirl): nullable<name> => {
    return NullableUtils.map(
        data => data.name,
        NumberUtils.randomSelect(getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.toArray())
    )
}

// export let getPickObjectName = (state) => {
//     let { name } = NullableUtils.getExn(getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData)

//     return name
// }

export let getPickObjectData = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData
}

export let getUBObjectData = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).giantessAddToUBSkeletonData
}

export let getPutToBreastObjectData = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).giantessAddToBreastSkeletonData
}

export let getPutToShoeObjectData = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).giantessAddToShoeSkeletonData
}

export let getPickObjectNames = (state, usedGirl) => {
    return getPickObjectData(state, usedGirl).map(data => data.name).toArray()
}

export let getUBObjectNames = (state, usedGirl) => {
    return getUBObjectData(state, usedGirl).map(data => data.name).toArray()
}

export let getPutToBreastNames = (state, usedGirl) => {
    return getPutToBreastObjectData(state, usedGirl).map(data => data.name).toArray()
}

export let getPutToShoeNames = (state, usedGirl) => {
    return getPutToShoeObjectData(state, usedGirl).map(data => data.name).toArray()
}

export let getAllControlledData = (state: state, usedGirl) => {
    return getUBObjectData(state, usedGirl).concat(
        getPutToShoeObjectData(state, usedGirl),
        getPutToBreastObjectData(state, usedGirl),
        getPickObjectData(state, usedGirl)
    )
}

export let hasControlledData = (state: state, usedGirl) => {
    return getAllControlledData(state, usedGirl).count()
}

export let isPicked = (state: state, name) => {
    return ArrayUtils.reduce(
        getCurrentUsedGirls(state),
        (result, usedGirl) => {
            if (result) {
                return result
            }

            return hasPickData(state, usedGirl) && getPickObjectNames(state, usedGirl).includes(name)
        },
        false
    )
}

export let isUBed = (state: state, name) => {
    return ArrayUtils.reduce(
        getCurrentUsedGirls(state),
        (result, usedGirl) => {
            if (result) {
                return result
            }

            return getUBObjectNames(state, usedGirl).includes(name)
        },
        false
    )
}

export let getIsControlledData = (state: state, name): [boolean, usedGirl] => {
    return ArrayUtils.reduce(
        getCurrentUsedGirls(state),
        ([isControlled, usedGirlResult], usedGirl) => {
            if (isControlled) {
                return [isControlled, usedGirlResult]
            }

            if (getPickObjectNames(state, usedGirl)
                .concat(
                    getUBObjectNames(state, usedGirl)
                )
                .concat(
                    getPutToBreastNames(state, usedGirl)
                )
                .concat(
                    getPutToShoeNames(state, usedGirl)
                )
                .includes(name)
            ) {
                return [true, usedGirl]
            }

            return [isControlled, usedGirlResult]
        },
        [false, usedGirlEnum.None]
    )
}

export let isControlledExceptBy = (state, usedGirl, name) => {
    let [isControlled, usedGirl_] = getIsControlledData(state, name)

    return isControlled && usedGirl_ != usedGirl
}

export let isControlled = (state, name) => {
    let [isControlled, usedGirl_] = getIsControlledData(state, name)

    return isControlled
}


export let isEatingFromPick = (state: state, usedGirl) => {
    return hasPickData(state, usedGirl) && isTriggerAction(state, usedGirl, actionName.Eat)
}

export let getPickupWorkFrameIndex = () => 41

export let getPinchWorkFrameIndex = () => 10

export let getEatWorkFrameIndex = () => 20

export let getEatRemovePickDataFrameIndex = () => 25
// export let getEatHandleFrameIndex = () => 15

export let getPickdownWorkFrameIndex = () => 45
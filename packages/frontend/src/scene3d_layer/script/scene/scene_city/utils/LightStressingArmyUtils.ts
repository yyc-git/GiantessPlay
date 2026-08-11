import { getAbstractState } from "../../../../state/State"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { clamp, handleTweenRepeatComplete2 } from "../utils/DamageUtils"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../data/DataUtils"
import { articluatedAnimationName, forceSize } from "../data/DataType"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { toRadians } from "../../../../utils/QuatUtils"
import { Box3, Matrix4, Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { addTweens, removeTweens } from "../TweenManager"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { updatePositionTween } from "../data/InstancedLOD2Utils"
import { isArmy } from "../utils/ArmyUtils"
import { getIsLightStressing, markNotLightStressing, setIsLightStressing } from "../manage/city1/Army"
import { LOD } from "meta3d-jiehuo-abstract"
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue"
import { translatePosition } from "meta3d-jiehuo-abstract/src/utils/TransformUtils"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();


let _isCanLightStressing = (state, damage, targetName) => {
    // return damage >= forceSize.VeryLow && isArmy(targetName) && !getIsLightStressing(state, targetName)
    // return damage >= forceSize.VeryLow / 2 && isArmy(targetName) && !getIsLightStressing(state, targetName)
    return damage >= 10 && isArmy(state, targetName) && !getIsLightStressing(state, targetName)
}

let _translatePosition = (transform, lastObject, currentObject) => {
    let translation = NullableUtils.getWithDefault<[number, number, number]>(
        NullableUtils.map(lastObject => {
            return [
                currentObject.x - lastObject.x,
                currentObject.y - lastObject.y,
                currentObject.z - lastObject.z,
            ]
        }, lastObject),
        [0, 0, 0]
    )

    translatePosition(transform, translation)

    return {
        ...currentObject
    }
}

export let handleLightStressing = (state, targetName, damage, transform: Matrix4, box: Box3) => {
    if (!_isCanLightStressing(state, damage, targetName)) {
        return state
    }

    let localPosition = TransformUtils.getPositionFromMatrix4(transform)
    let lodQueue = LOD.getLODQueue(getAbstractState(state), targetName)
    let isHierachyLODQueue = (lodQueue as HierachyLODQueue).isHierachyLODQueue
    let lodQueueIndex
    if (isHierachyLODQueue) {
        lodQueueIndex = lodQueue.getIndex(targetName)
    }

    // let width = box.getSize(_v1).x
    let size = box.getSize(_v1)
    let bigLength = Math.max(size.x, size.z)

    let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.Light_Stressing_Army_Move)

    state = setIsLightStressing(state, targetName, true)

    let lastObject = NullableUtils.getEmpty()

    let allTweens = playArticluatedAnimation(state,
        [
            object => {
                // updatePositionTween(transform, object)
                lastObject = NullableUtils.return_(_translatePosition(transform, lastObject, object))

                if (isHierachyLODQueue) {
                    LOD.markNeedsUpdate(getAbstractState(state),
                        lodQueue.name,
                        lodQueueIndex, true)
                }
            },
            state => {
                return localPosition
            },
            state => {
                let damageRadio = damage / forceSize.Middle

                let amplitude = clamp(bigLength / 4 * damageRadio, bigLength / 5)

                return [
                    localPosition,
                    amplitude / 2,
                    1
                ]
            },
            (allTweens) => {
                handleTweenRepeatComplete2(state => {
                    // let _ = box.setFromCenterAndSize(
                    //     TransformUtils.getPositionFromMatrix4(transform, _v1),
                    //     size
                    // )
                    let _ = TransformUtils.setPositionToMatrix4(
                        transform,
                        localPosition
                    )

                    // state = setIsLightStressing(state, targetName, false)
                    state = markNotLightStressing(state, targetName)

                    state = removeTweens(state, allTweens)

                    return Promise.resolve(state)
                }, allTweens, articluatedAnimationData.repeatCount)
            },
            NullableUtils.getEmpty()
        ],
        articluatedAnimationData
    )

    state = addTweens(state, allTweens)

    return state

}

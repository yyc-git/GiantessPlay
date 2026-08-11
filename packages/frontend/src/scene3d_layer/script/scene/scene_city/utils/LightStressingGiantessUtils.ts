import { MMD } from "meta3d-jiehuo-abstract"
import { collisionPart, usedGirl } from "../type/StateType"
import { getAbstractState } from "../../../../state/State"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { handleTweenRepeatComplete2 } from "../utils/DamageUtils"
import { getBone } from "../utils/MMDUtils"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../data/DataUtils"
import { articluatedAnimationName, forceSize } from "../data/DataType"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { toRadians } from "../../../../utils/QuatUtils"
import { Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { addTweens, removeTweens } from "../TweenManager"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getGirl, getCurrentMMDCharacterName, setIsLightStressing } from "../girl/Girl"
import { getGirlScale } from "../CityScene"
import { getFactorByScale } from "../girl/Utils"
import { markNotLightStressing } from "../manage/city1/Army"
import { getBoneNameForLightStressing } from "../../../../mod/MMDMod"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();


let _buildBoneCustomDataKey = (collisionPart_) => {
    switch (collisionPart_) {
        case collisionPart.RightFoot:
        case collisionPart.RightThigh:
        case collisionPart.RightShank:
            return "RightLeg"
        case collisionPart.LeftFoot:
        case collisionPart.LeftThigh:
        case collisionPart.LeftShank:
            return "LeftLeg"

        case collisionPart.RightHand:
        case collisionPart.RightLowerArm:
        case collisionPart.RightUpperArm:
            return "RightArm"
        case collisionPart.LeftHand:
        case collisionPart.LeftLowerArm:
        case collisionPart.LeftUpperArm:
            return "LeftArm"

        default:
            return String(collisionPart_)
    }
}

let _isCanLightStressing = (state, usedGirl, damage, collisionPart_, minDamage = 15) => {
    let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

    // return damage >= forceSize.Low && !MutableRecordUtils.has(helper.ikBoneCustomData, _buildBoneCustomDataKey(collisionPart_))
    // return damage >= forceSize.VeryLow && !MutableRecordUtils.has(helper.ikBoneCustomData, _buildBoneCustomDataKey(collisionPart_))
    return damage >= minDamage && !MutableRecordUtils.has(helper.ikBoneCustomData, _buildBoneCustomDataKey(collisionPart_))
}

let _computeAmplitude = (state: state, usedGirl, amplitude) => {
    let factor = getFactorByScale(state, usedGirl, [
        {
            scale: 30,
            factor: 1
        },
        {
            scale: 50,
            factor: 0.75
        },
        {
            factor: 0.5
        },
    ])

    return amplitude * factor
}

let _getMoveAmplitude = () => 0.15

export let getMoveAmplitude = (state, usedGirl) => _computeAmplitude(state, usedGirl, _getMoveAmplitude())

let _handleMoveBoneCase = (state: state, handleCompleteFunc, usedGirl: usedGirl, collisionPart_, boneCustomData, boneName, articluatedAnimationName_) => {
    let amplitude = getMoveAmplitude(state, usedGirl)

    // let data1 = getBone(state,usedGirl, getGirl(state, usedGirl), boneName)
    // state = data1[0]
    // let bone = data1[1]


    // let boneLocalPosition = bone.position.clone()

    let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName_)

    let boneCustomDataKey = _buildBoneCustomDataKey(collisionPart_)

    let initialValue = { x: 0 }

    let allTweens = playArticluatedAnimation(state,
        [
            object => {
                MutableRecordUtils.set(boneCustomData, boneCustomDataKey, (bone) => {
                    if (bone.name == boneName) {
                        bone.position.setX(bone.position.x + object.x)
                    }
                })
            },
            state => {
                return initialValue
            },
            state => {
                return [
                    initialValue,
                    amplitude,
                    1
                ]
            },
            (allTweens) => {
                handleTweenRepeatComplete2(state => {
                    MutableRecordUtils.remove(boneCustomData, boneCustomDataKey)

                    state = handleCompleteFunc(state, collisionPart_)

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

let _handleRotateBoneCase = (state: state, handleCompleteFunc, usedGirl: usedGirl, collisionPart_, boneCustomData, boneName, articluatedAnimationName_, axis, amplitude) => {
    amplitude = _computeAmplitude(state, usedGirl, amplitude)


    let data1 = getBone(state, usedGirl, getGirl(state, usedGirl), boneName)
    state = data1[0]
    let bone = data1[1]

    let boneLocalQuaternion = bone.quaternion.clone()

    let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName_)

    let boneCustomDataKey = _buildBoneCustomDataKey(collisionPart_)

    let allTweens = playArticluatedAnimation(state,
        [
            object => {
                MutableRecordUtils.set(boneCustomData, boneCustomDataKey, (bone) => {
                    if (bone.name == boneName) {
                        let quat = TransformUtils.rotateOnWorldAxis(bone.quaternion, toRadians(object.euler), axis)

                        bone.quaternion.copy(quat)
                    }
                })
            },
            state => {
                return boneLocalQuaternion
            },
            state => {
                return [
                    amplitude,
                    1
                ]
            },
            (allTweens) => {
                handleTweenRepeatComplete2(state => {
                    MutableRecordUtils.remove(boneCustomData, boneCustomDataKey)

                    state = handleCompleteFunc(state, collisionPart_)

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

let _handleComplete = (state, collisionPart_) => {
    // return setIsLightStressing(state, collisionPart_, false)
    return markNotLightStressing(state, collisionPart_)
}

// export let handleLightStressing = (state, boneNameForLightStressing, damage, collisionPart_, isUseHandIK, minDamage = 15) => {
export let handleLightStressing = (state, usedGirl: usedGirl, damage, collisionPart_, isUseHandIK, minDamage = 15) => {
    if (!_isCanLightStressing(state, usedGirl, damage, collisionPart_, minDamage)) {
        return state
    }

    let boneNameForLightStressing = getBoneNameForLightStressing(state)

    let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

    let mmdCharacter = getCurrentMMDCharacterName(state, usedGirl)

    let xAxis = _v1.set(1, 0, 0)
    let yAxis = _v2.set(0, 1, 0)
    let zAxis = _v3.set(0, 0, 1)


    state = setIsLightStressing(state, usedGirl, collisionPart_, true)

    switch (collisionPart_) {
        case collisionPart.RightFoot:
        case collisionPart.RightThigh:
        case collisionPart.RightShank:
            state = _handleMoveBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.ikBoneCustomData, "右足ＩＫ", articluatedAnimationName.Light_Stressing_Giantess_Move)
            break
        case collisionPart.LeftFoot:
        case collisionPart.LeftThigh:
        case collisionPart.LeftShank:
            state = _handleMoveBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.ikBoneCustomData, "左足ＩＫ", articluatedAnimationName.Light_Stressing_Giantess_Move)
            break

        case collisionPart.RightHand:
        case collisionPart.RightLowerArm:
        case collisionPart.RightUpperArm:
            if (isUseHandIK) {
                state = _handleMoveBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.ikBoneCustomData, "右腕ＩＫ", articluatedAnimationName.Light_Stressing_Giantess_Move)
            }
            else {
                state = _handleRotateBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.notIKBoneCustomData, "右肩", articluatedAnimationName.Light_Stressing_Giantess_Rotate, yAxis, 3)
            }
            break
        case collisionPart.LeftHand:
        case collisionPart.LeftLowerArm:
        case collisionPart.LeftUpperArm:
            if (isUseHandIK) {
                state = _handleMoveBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.ikBoneCustomData, "左腕ＩＫ", articluatedAnimationName.Light_Stressing_Giantess_Move)
            }
            else {
                state = _handleRotateBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.notIKBoneCustomData, "左肩", articluatedAnimationName.Light_Stressing_Giantess_Rotate, yAxis, 3)
            }
            break


        case collisionPart.RightBreast:
        case collisionPart.LeftBreast:
            if (!NullableUtils.isNullable(boneNameForLightStressing.find(d => d.mmdCharacter == mmdCharacter))) {
                state = _handleRotateBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.notIKBoneCustomData,
                    // NullableUtils.map(d => d.boneName[collisionPart_], getBoneNameForLightStressing().find(d => d.mmdCharacter == mmdCharacter)), articluatedAnimationName.Light_Stressing_Giantess_Rotate, xAxis, NullableUtils.getWithDefault(
                    NullableUtils.getExn(boneNameForLightStressing.find(d => d.mmdCharacter == mmdCharacter)).boneName[collisionPart_],
                    articluatedAnimationName.Light_Stressing_Giantess_Rotate, xAxis, NullableUtils.getWithDefault(
                        NullableUtils.bind(d => {
                            return NullableUtils.map(boneAmplitude => {
                                return boneAmplitude[collisionPart_]
                            }, d.boneAmplitude)
                        }, boneNameForLightStressing.find(d => d.mmdCharacter == mmdCharacter)),
                        20
                    ))
            }
            break
        case collisionPart.TrigoneAndButt:
            state = _handleRotateBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.notIKBoneCustomData,
                NullableUtils.getWithDefault(
                    NullableUtils.map(d => d.boneName[collisionPart_], boneNameForLightStressing.find(d => d.mmdCharacter == mmdCharacter)),
                    "腰"
                ), articluatedAnimationName.Light_Stressing_Giantess_Rotate, yAxis, 2)
            break

        case collisionPart.Torso:
            state = _handleRotateBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.notIKBoneCustomData,
                "上半身", articluatedAnimationName.Light_Stressing_Giantess_Rotate, yAxis, 2)
            break

        case collisionPart.Head:
            state = _handleRotateBoneCase(state, _handleComplete, usedGirl, collisionPart_, helper.notIKBoneCustomData,
                "頭", articluatedAnimationName.Light_Stressing_Giantess_Rotate, yAxis, 2)
            break


        default:
            break
    }

    return state
}

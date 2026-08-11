import { MMD } from "meta3d-jiehuo-abstract"
import { collisionPart } from "../type/StateType"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { handleTweenRepeatComplete2 } from "../utils/DamageUtils"
import { getBone } from "../utils/MMDUtils"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../data/DataUtils"
import { articluatedAnimationName, forceSize } from "../data/DataType"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { toRadians } from "../../../../utils/QuatUtils"
import { Bone, Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { addTweens, removeTweens } from "../TweenManager"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getGirl, getCurrentMMDCharacterName, setIsLightStressing, getBreastPartialScaleMaxFactor, getTorsorPartialScaleMaxFactor } from "../girl/Girl"
import { getCollisionShapeData, getGirlScale, isBossLevel, onlySetCollisionShapeData, restoreCollisionShapeData, restoreCollisionShapeDataByCondition, setCollisionShapeData } from "../CityScene"
import { getFactorByScale } from "../girl/Utils"
import { markNotLightStressing } from "../manage/city1/Army"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../Scene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getBoneNameForLightStressing, getDataForPartialScale } from "../../../../mod/MMDMod"
import { updateAllCollisionShapes } from "../girl/Collision"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { Flow } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

// let _buildTorsorBoneCustomDataKey = () => {
//     return "Torsor"
// }

// let _buildBreastBoneCustomDataKey = () => {
//     return "Breast"
// }

let _getBreastBoneNames = (state: state, mmdCharacter) => {
    // let mmdCharacter = getCurrentMMDCharacterName(state, usedGirl)

    let boneNameForLightStressing = getBoneNameForLightStressing(state)

    return NullableUtils.getWithDefault(
        NullableUtils.map(boneNameForLightStressingData => {
            let boneName = boneNameForLightStressingData.boneName

            return MutableRecordUtils.toArray(
                MutableRecordUtils.filter(boneName, (_, collisionPart_) => {
                    return _getBreastCollisionParts().includes(collisionPart_)
                })
            )
        }, boneNameForLightStressing.find(d => d.mmdCharacter == mmdCharacter)),
        []
    )
}

// let _breastCondition = (state, data) => {
//     return data.mmds.includes(getCurrentMMDCharacterName(state, usedGirl))
//         &&
//         (
//             data.collisionPart == collisionPart.RightBreast
//             || data.collisionPart == collisionPart.LeftBreast
//         )
// }
let _getBreastCollisionParts = () => [collisionPart.RightBreast, collisionPart.LeftBreast]

let _getPartialScaleRatio = (state: state, usedGirl, boneName) => {
    let bone
    [state, bone] = getBone(state, usedGirl, getGirl(state, usedGirl), NullableUtils.getExn(boneName))

    return bone.scale.x - 1
}

export let getBreastPartialScaleRatio = (state: state, usedGirl) => {
    let boneName = _getBreastBoneNames(state, getCurrentMMDCharacterName(state, usedGirl))[0]

    if (NullableUtils.isNullable(boneName)) {
        return 0
    }

    return _getPartialScaleRatio(state, usedGirl, boneName)
}

export let getTorsorPartialScaleRatio = (state: state, usedGirl) => {
    if (NullableUtils.isNullable(getDataForPartialScale(state).find(d => d.mmdCharacter == getCurrentMMDCharacterName(state, usedGirl)))) {
        return 0
    }

    return _getPartialScaleRatio(state, usedGirl, TupleUtils.getTuple2First(_getTorsorBoneNames()))
}

export let partialScaleBreast = (state: state, usedGirl, ratio: number) => {
    requireCheck(() => {
        // test("ratio should in [0,1]", () => {
        //     return NumberUtils.between(ratio, 0, 1)
        // })
        test("ratio should >= 0", () => {
            return ratio >= 0
        })
    }, getIsDebug(state))

    let boneNames = _getBreastBoneNames(state, getCurrentMMDCharacterName(state, usedGirl))

    if (boneNames.length == 0
        || isBossLevel(state)
    ) {
        return state
    }

    let dataForPartialScale = getDataForPartialScale(state).find(d => d.mmdCharacter == getCurrentMMDCharacterName(state, usedGirl))

    if (NullableUtils.isNullable(dataForPartialScale)) {
        return state
    }

    let { scaleXYForBreast, scaleZForBreast } = NullableUtils.getExn(dataForPartialScale)

    // const maxScaleNumber = 1

    let scaleNumber = 1 + 1 * ratio

    // let data1 = getBone(state,usedGirl, getGirl(state, usedGirl), boneName1)
    // state = data1[0]
    // let bone = data1[1]

    // let boneLocalScale = bone.scale.clone()


    // let data2 = getBone(state,usedGirl, getGirl(state, usedGirl), boneName2)
    // state = data2[0]
    // let bone2 = data2[1]

    // let boneLocalScale2 = bone2.scale.clone()



    let bone
    [state, bone] = getBone(state, usedGirl, getGirl(state, usedGirl), boneNames[0])
    bone.scale.setScalar(scaleNumber)

    let d = getBone(state, usedGirl, getGirl(state, usedGirl), boneNames[1])
    state = d[0]
    bone = d[1]
    bone.scale.setScalar(scaleNumber)



    // let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

    // let boneCustomDataKey = _buildBreastBoneCustomDataKey()


    // MutableRecordUtils.set(helper.notIKBoneCustomData, boneCustomDataKey, (bone: Bone) => {
    //     if (boneNames.includes(bone.name)) {
    //         bone.scale.setScalar(scaleNumber)
    //     }
    // })

    state = restoreCollisionShapeDataByCondition(state, getCurrentMMDCharacterName(state, usedGirl), _getBreastCollisionParts())
    state = onlySetCollisionShapeData(state, getCollisionShapeData(state).map(data => {
        if (
            data.mmds.includes(getCurrentMMDCharacterName(state, usedGirl))
            &&
            _getBreastCollisionParts().includes(data.collisionPart)
        ) {
            return {
                ...data,
                oneBone: {
                    ...data.oneBone,
                    size: data.oneBone.size.map(s => {
                        let [x, y, z] = s.value
                        let scalarXY = 1 + scaleXYForBreast * ratio
                        let scalarZ = 1 + (scalarXY - 1) * scaleZForBreast

                        return {
                            ...s,
                            value: [x * scalarXY, y * scalarXY, z * scalarZ]
                        }
                    })
                }
            }
        }

        return data
    }))
    state = updateAllCollisionShapes(state, usedGirl, getGirl(state, usedGirl))

    return state

}

let _getTorsorBoneNames = () => [
    "上半身",
    "上半身2"
]

// let _torsorCondition = (state, data) => {
//     return data.mmds.includes(getCurrentMMDCharacterName(state, usedGirl))
//         &&
//         (
//             data.collisionPart == collisionPart.Torso
//         )
// }
let _getTorsorCollisionParts = () => [collisionPart.Torso]

export let partialScaleTorsor = (state: state, usedGirl, ratio: number) => {
    // requireCheck(() => {
    //     test("ratio should in [0,1]", () => {
    //         return NumberUtils.between(ratio, 0, 1)
    //     })
    // }, getIsDebug(state))
    requireCheck(() => {
        test("ratio should >= 0", () => {
            return ratio >= 0
        })
    }, getIsDebug(state))


    if (NullableUtils.isNullable(getDataForPartialScale(state).find(d => d.mmdCharacter == getCurrentMMDCharacterName(state, usedGirl)))
        || isBossLevel(state)
    ) {
        return state
    }

    const maxScaleNumber = 1

    let scaleNumber = 1 + maxScaleNumber * ratio

    let [boneName1, boneName2] = _getTorsorBoneNames()

    let bone
    [state, bone] = getBone(state, usedGirl, getGirl(state, usedGirl), boneName1)
    bone.scale.set(scaleNumber, 1, scaleNumber)

    let d = getBone(state, usedGirl, getGirl(state, usedGirl), boneName2)
    state = d[0]
    bone = d[1]
    bone.scale.set(1 / scaleNumber, 1, 1 / scaleNumber)


    // let data1 = getBone(state,usedGirl, getGirl(state, usedGirl), boneName1)
    // state = data1[0]
    // let bone = data1[1]

    // let boneLocalScale = bone.scale.clone()


    // let data2 = getBone(state,usedGirl, getGirl(state, usedGirl), boneName2)
    // state = data2[0]
    // let bone2 = data2[1]

    // let boneLocalScale2 = bone2.scale.clone()


    // let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

    // let boneCustomDataKey = _buildTorsorBoneCustomDataKey()


    // MutableRecordUtils.set(helper.notIKBoneCustomData, boneCustomDataKey, (bone: Bone) => {
    //     if (bone.name == boneName1) {
    //         // bone.scale.setScalar(scaleNumber)
    //         bone.scale.set(scaleNumber, 1, scaleNumber)
    //     }
    //     if (bone.name == boneName2) {
    //         // bone.scale.setScalar(1 / scaleNumber)
    //         bone.scale.set(1 / scaleNumber, 1, 1 / scaleNumber)
    //     }
    // })

    state = restoreCollisionShapeDataByCondition(state, getCurrentMMDCharacterName(state, usedGirl), _getTorsorCollisionParts())
    state = onlySetCollisionShapeData(state, getCollisionShapeData(state).map(data => {
        if (
            data.mmds.includes(getCurrentMMDCharacterName(state, usedGirl))
            &&
            _getTorsorCollisionParts().includes(data.collisionPart)
        ) {

            return {
                ...data,
                oneBone: {
                    ...data.oneBone,
                    size: data.oneBone.size.map(s => {
                        let [x, y, z] = s.value
                        // let scalar = 1.5 * ratio
                        let scalarX = 1 + 0.5 * ratio
                        let scalarZ = 1 + 0.65 * ratio

                        return {
                            ...s,
                            value: [x * scalarX, y, z * scalarZ]
                        }
                    })
                }
            }
        }

        return data
    }))
    state = updateAllCollisionShapes(state, usedGirl, getGirl(state, usedGirl))

    return state
}

// let _restore = (state: state, boneNames, boneCustomDataKey) => {
let _restore = (state: state, usedGirl, boneNames) => {
    state = boneNames.reduce((state, boneName) => {
        let data = getBone(state, usedGirl, getGirl(state, usedGirl), boneName)
        state = data[0]
        let bone = data[1]

        bone.scale.set(1, 1, 1)

        return state
    }, state)

    // let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

    // MutableRecordUtils.remove(helper.notIKBoneCustomData, boneCustomDataKey)

    return state
}

let _buildKey = (usedGirl) => `${usedGirl}_partialSmallByTime`

export let smallByTime = (state: state, usedGirl) => {
    return setAbstractState(state, Flow.addInterval(getAbstractState(state), [getAbstractState, setAbstractState, state => {
        // state = partialScaleBreast(state, limitBreastRatio(state, usedGirl,getBreastPartialScaleRatio(state, usedGirl) - 0.1))
        state = partialScaleBreast(state, usedGirl, limitBreastRatio(state, usedGirl, getBreastPartialScaleRatio(state, usedGirl) - 0.06))
        // state = partialScaleTorsor(state, usedGirl, limitTorsorRatio(state, usedGirl, getTorsorPartialScaleRatio(state, usedGirl) - 0.05))
        state = partialScaleTorsor(state, usedGirl, limitTorsorRatio(state, usedGirl, getTorsorPartialScaleRatio(state, usedGirl) - 0.08))

        return Promise.resolve(state)
        // }], 8, _buildKey()))
    }], 10, _buildKey(usedGirl)))
    // }], 1, _buildKey()))
}

export let stopSmallByTime = (state, usedGirl) => {
    return setAbstractState(state, Flow.clearInterval(getAbstractState(state), _buildKey(usedGirl)))
}

export let restorePartialScale = (state: state, usedGirl, mmdCharacter = getCurrentMMDCharacterName(state, usedGirl)) => {
    // state = _restore(state, _getTorsorBoneNames(), _buildTorsorBoneCustomDataKey())
    // state = _restore(state, _getBreastBoneNames(state, mmdCharacter), _buildBreastBoneCustomDataKey())
    state = _restore(state, usedGirl, _getTorsorBoneNames())
    state = _restore(state, usedGirl, _getBreastBoneNames(state, mmdCharacter))

    state = restoreCollisionShapeData(state)

    state = stopSmallByTime(state, usedGirl)

    return state
}

// export let limitBreastRatio = (ratio) => NumberUtils.clamp(ratio, 0, 2)
export let limitBreastRatio = (state: state, usedGirl, ratio) => NumberUtils.clamp(ratio, 0, 1.5 * (1 + getBreastPartialScaleMaxFactor(state, usedGirl)))

export let limitTorsorRatio = (state: state, usedGirl, ratio) => NumberUtils.clamp(ratio, 0, 1 * (1 + getTorsorPartialScaleMaxFactor(state, usedGirl)))

// export let reset = (state: state) => {
//     state = setAbstractState(state, Flow.clearInterval(getAbstractState(state), _buildKey()))

//     state = partialScaleBreast(state, 0)
//     state = partialScaleTorsor(state, usedGirl, 0)

//     return state
// }

// export let dispose = (state: state) => {
//     state = reset(state)

//     return Promise.resolve(state)
// }

export let isFullTorsor = (state: state, usedGirl, torsorPartialScaleRatio) => {
    return torsorPartialScaleRatio >= 1 * (1 + getTorsorPartialScaleMaxFactor(state, usedGirl))
}
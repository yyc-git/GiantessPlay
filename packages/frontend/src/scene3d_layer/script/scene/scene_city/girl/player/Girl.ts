import { cameraType, state } from "../../../../../type/StateType"
import { clearAttackTargetObjectOrBuilding, resetAttackUnits, setCamp } from "../../manage/city1/Army"
import { attackTarget, camp, crawlMovePhase, phase, playerGirlData, playerStateStatusName, runPhase, studyAction, upgradeLevel, usedGirlEnum } from "../../type/StateType"
import { getPlayerCamp } from "../../utils/PlayerUtils"
import { clearNeedUpdateStatus, damageUtils, getAllUsedMMDData, getGirlState, setGirlState, setGirlScale, getValue, getValueByUsedGirl, isPlayerGirlByUsedGirl, getGirlMesh, getGirl, getExcitement, hasGirlMesh, isBelongToCurrentPoseAndScaleState, getSkillData, isActionTriggering, isTriggerAction, isActionState, isDamageAction, setTriggerAction, setActionState, setLastScaleChangeTime, resetIsTriggerAction, getActiveBiggerIncreaseScale, setGirlScaleAndKeepCamera, changeToInitialScale, isSmallerAction, setBiggerCount, getBiggerCount, updateDamageType, computeForce, changeToSmallestActiveBigger, getCurrentMMDCharacterName, getBodyHp, getUsedGirlData, addCurrentUsedGirl, setCurrentUsedGirls, removeCurrentUsedGirl, setUsedGirlData, buildNameByUsedGirl } from "../Girl"
import { addGirl, isSmallestToZeroBiggerCount, refreshBiggerTime, removeGirl } from "../InitWhenImportScene"
import { Event, NullableUtils, Scene, Device, SkinAnimation, Loader, ModelLoader, Camera, DisposeUtils, ThirdPersonControls, Layer } from "meta3d-jiehuo-abstract"
// import { state } from "../../type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
// import { damageType, collisionPart, girl, mmdCharacter, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, result, giantessStrength, giantessScale } from "../type/StateType"
import { AnimationClip, AxesHelper, Box3, Box3Helper, Color, CompressedArrayTexture, Euler, Matrix3, Matrix4, Mesh, MeshPhongMaterial, Object3D, Quaternion, Vector3 } from "three"
// import { setTarget } from "./Camera"
import { getThirdPersonCameraTarget, getOrbitControlsTarget, isCameraCollision, updateThirdPersonControlsForChangeScale, getCameraType, updateFirstPersonControls, updateDistanceRateOnlyOnceInOneFrame, useThirdPersonControls, setSavedCameraType, setSavedCameraTarget, getGiantessCameraTarget, setTargetToCameraDirection } from "../../Camera"
import { Flow, Capsule } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract"
import { List, Map, get } from "immutable"
import { ScreenShake } from "meta3d-jiehuo-abstract"
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera"
// import { getGiantessStatusUpdateEventName, getPickupEventName, getPickdownEventName, getPinchJudageDamageEventName, getEatEventName, getStandToCrawlEventName, getCrawlToStandEventName, getLittleManStatusUpdateEventName, } from "../../../../utils/EventUtils"
// import { actionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../data/DataType"
import { move } from "../Move"
import { computeGirlBoxAndSetToState, computeHeight, getGirlBox, getCurrentHeight, getScale, getScaleByHeight, setGirlRotation, markGirlVisible, markGirlNotVisible, getScaleIncreaseTimes, updateMMDPhysicsConfigForScale, getDamagePartFactor, getForceFactor, getSkillStateFactor, getCollisionPartFactor, getScaleFactor, setHeight, isCanStressing, getDamageTypeFactor, getBaseFactor, getStressingFactorByJudgeLastStressingTime, triggerScaleAction, handlePickDataWhenExecuteDestroyed, getMaxScale as getMaxScaleUtils, getGirlPosition } from "../Utils"
import { getAllAnimationNames, getCurrentAnimationName, isChangeScaling, isCompletelyPlayingAnimation, isKeepPoseAnimation, isPlayingAnimation, isPlayingAnimationByWeight, playBiggerAnimation, playSmallerAnimation, updateAnimation, updateAnimationDuration } from "../Animation"
import { updateAnimationCollision } from "../Collision"
import * as PickPose from "../PickPose"
import { getStateMachine, isChangeCrawlPoseState, isSkillState, setStateMachine } from "../FSMState"
import { createStressingState, update as updateFSMState } from "./FSMState"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { girlValue, weaponType } from "../../data/ValueType"
import { buildGiantessStatusUpdateEventNameEventData, getGiantessStatusUpdateEventName, getLevelStatusUpdateEventName, getUpgradeEventName } from "../../../../../utils/EventUtils"
import { actionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../../data/DataType"
import { damageType, collisionPart, girl, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, result, giantessStrength, giantessScale, damagePart } from "../../type/StateType"
// import { getGiantessSetting, getLittleManSetting } from "../../CityScene"
import { getDamagePartByCollisionPart, getDamagePartByJudge, isCloth } from "../Cloth"
import { buildLevelStatusUpdateEventData } from "../../utils/EventUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { isControlledState, isDestoryRelatedStates, isNotDamageState } from "../../utils/FSMStateUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getCollisionShapeData, getConfigData, getGirlScale, getScene, getSmallerSoundResourceId, setCollisionShapeData, setConfigData, setGirlValue } from "../../CityScene"
import { giantessUpgradeName } from "../../data/build/BuildData"
import { hasStudyAction, setAttribute, setFullHp, setInitialScaleAndUpdateScale, studyActions } from "../../utils/build/GiantessBuildUtils"
import { buildFuncData } from "../../data/FuncData"
import { getIsApplying } from "../../build/Upgrade"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { isEnteringNextLevel } from "../../manage/mission/Mission"
import { handleLightStressing } from "../../utils/LightStressingGiantessUtils"
import { getNow } from "../../Time"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { getGirlVolume } from "../../utils/SoundUtils"
import { isExcitementEnough, subExcitement } from "../Excitement"
// import { setNeedShowSkillBar } from "../../UI"
import { buildAPI } from "../../../../../mod/Mod"
import * as PlayerGirlData from "../../data/player/GirlData"
import { isUseInfinityBig } from "../../../../../mod/PropOtherMod"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
// import { isUseCareer } from "../../build/Career"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getFoodieBlockService } from "../../../../../mod/CareerMod"
import { getDamagePositionForLabel } from "../../utils/DamageUtils"
import { getLittleManThirdPersonControlOrbitControlsTarget, getTargetToCameraDirection } from "../../LittleManCamera"
import { getBone } from "../../utils/MMDUtils"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getStompBlockService } from "../../../../../mod/SkillGiantessMod"
import { isActionValid as isActionValidMod, triggerAction as triggerActionMod } from "../../../../../mod/SkillGiantessMod"
import { restorePartialScale, smallByTime, stopSmallByTime } from "../../utils/PartialScaleGiantessUtils"


const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

// let _adjustRenderAccuracy = (state: state, scale) => {
//     if (scale <= 100) {
//         return state
//     }

//     let level
//     if (scale <= 200) {
//         level = renderAccuracyLevel.High
//     }
//     else if (scale <= 400) {
//         level = renderAccuracyLevel.VeryHigh
//     }
//     else {
//         level = renderAccuracyLevel.MostHigh
//     }

//     let renderAccuracy = getRenderSetting(state).renderAccuracy
//     if (renderAccuracy <= level) {
//         return state
//     }

//     return setRenderAccuracy(state, level)
// }

export let addPlayerGirl = (state: state, worldPosition, worldQuaternion) => {
    let usedGirl = usedGirlEnum.PlayerGirl
    // state = setCurrentUsedGirl(state, usedGirlEnum.PlayerGirl)
    state = addCurrentUsedGirl(state, usedGirl)
    state = setCamp(state, buildNameByUsedGirl(usedGirl), getPlayerCamp())

    state = setCurrentStudyActions(state, getSavedStudyActions(state))

    // // state = NullableUtils.getWithDefaultFunc(
    // //     NullableUtils.map(scale => {
    // //         return setGirlScale(state, scale)
    // //     }, _getData(state).originPlayerGirlScale),
    // //     () => {
    // //         return setGirlScale(state, getValue(state).initialScale)
    // //     }
    // // )
    // state = NullableUtils.getWithDefaultFunc(
    //     NullableUtils.map(scale => {
    //         return setGirlScale(state, scale)
    //     }, _getData(state).originPlayerGirlScale),
    //     () => {
    //         return changeToInitialScale(state)
    //     }
    // )
    // state = setGirlScale(state, NullableUtils.getWithDefault(_getData(state).originPlayerGirlScale, getValueByUsedGirl(state, usedGirlEnum.PlayerGirl).initialScale))
    state = setGirlScale(state, usedGirl, NullableUtils.getWithDefault(_getData(state).originPlayerGirlScale, getValueByUsedGirl(state, usedGirl).initialScale + getScaleIncrease(state)))



    state = smallByTime(state, usedGirl)



    // // let boneName = "右胸"
    // let boneName = "上半身"
    // let boneName2 = "上半身2"
    // let boneName3 = "右胸4"
    // let boneName4 = "左胸4"
    // // let boneName3 = "右胸"
    // // let boneName4 = "左胸"

    // let data1 = getBone(state,usedGirl, getGirl(state, usedGirl), boneName)
    // state = data1[0]
    // let bone = data1[1]

    // let boneLocalScale = bone.scale.clone()


    // let data2 = getBone(state,usedGirl, getGirl(state, usedGirl), boneName2)
    // state = data2[0]
    // let bone2 = data2[1]

    // let boneLocalScale2 = bone2.scale.clone()




    // let data3 = getBone(state,usedGirl, getGirl(state, usedGirl), boneName3)
    // state = data3[0]
    // let bone3 = data3[1]

    // let boneLocalScale3 = bone3.scale.clone()
    // let boneLocalPosition3 = bone3.position.clone()

    // bone3.updateWorldMatrix(true, true)
    // let boneWorldPosition3 = TransformUtils.getWorldPosition(bone3, new Vector3())

    // let boneParentWorldPosition3 = TransformUtils.getWorldPosition(bone3.parent, new Vector3())

    // let bone3Ratio = boneWorldPosition3.distanceTo(boneParentWorldPosition3) /
    //     boneWorldPosition3.distanceTo(getGirlPosition(state, usedGirl))


    // let boneWorldPosition3_2 = boneWorldPosition3.clone()


    // let data4 = getBone(state,usedGirl, getGirl(state, usedGirl), boneName4)
    // state = data4[0]
    // let bone4 = data4[1]

    // let boneLocalScale4 = bone4.scale.clone()



    // let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)

    // let boneCustomDataKey = String(collisionPart.RightBreast)

    // let scaleNumber = 2
    // // let scaleNumber = 3
    // // let scaleNumber = 1.5


    // let torsorScaleNumber = 2
    // // let torsorScaleNumber = 1
    // // let torsorScaleNumber = 4

    // MutableRecordUtils.set(helper.notIKBoneCustomData, boneCustomDataKey, (bone) => {
    //     if (bone.name == boneName) {
    //         bone.scale.copy(boneLocalScale.clone().multiplyScalar(torsorScaleNumber))
    //     }

    //     if (bone.name == boneName2) {
    //         bone.scale.copy(boneLocalScale2.clone().multiplyScalar(1 / torsorScaleNumber))
    //     }

    //     if (bone.name == boneName3) {
    //         // bone.scale.copy(boneLocalScale3.clone().multiplyScalar(2))
    //         bone.scale.copy(boneLocalScale3.clone().multiplyScalar(scaleNumber))
    //         console.log(new Vector3().setFromMatrixScale(bone.matrixWorld))

    //         bone.updateWorldMatrix(true, true)
    //         boneWorldPosition3_2 = TransformUtils.getWorldPosition(bone, new Vector3())

    //         let boneParentWorldPosition3_2 = TransformUtils.getWorldPosition(bone.parent, new Vector3())

    //         let bone3Ratio_2 = boneWorldPosition3_2.distanceTo(boneParentWorldPosition3_2) /
    //             boneWorldPosition3_2.distanceTo(getGirlPosition(state, usedGirl))

    //         console.log(
    //             // boneWorldPosition3_2, boneWorldPosition3,
    //             // boneWorldPosition3_2.length() / boneWorldPosition3.length()
    //             bone3Ratio_2 / bone3Ratio
    //         )

    //         console.log(
    //             boneWorldPosition3_2.length() / boneWorldPosition3.length()
    //         )



    //     }
    //     if (bone.name == boneName4) {
    //         // bone.scale.copy(boneLocalScale4.clone().multiplyScalar(2))
    //         bone.scale.copy(boneLocalScale4.clone().multiplyScalar(scaleNumber))
    //     }
    // })


    // let cd = getCollisionShapeData(state)
    // let newCd = cd.map(data => {
    //     if (data.mmds.includes(getCurrentMMDCharacterName(state, usedGirl))) {
    //         if (data.collisionPart == collisionPart.RightBreast) {
    //             return {
    //                 ...data,
    //                 oneBone: {
    //                     ...data.oneBone,
    //                     // frontDirectionScalar: 
    //                     size: data.oneBone.size.map(s => {
    //                         let [x, y, z] = s.value
    //                         let scalar = 1.5
    //                         // let scalar = 0.4 * scaleNumber + 0.6
    //                         // let scalar = 0.5 * scaleNumber + 0.6

    //                         // let scalar = 1.6
    //                         // let scalar = 1.6 *1.5
    //                         // let scalar = 1.6 * 1.5 / 2

    //                         return {
    //                             ...s,
    //                             value: [x * scalar, y * scalar, z * scalar * 0.9]

    //                             // value: [x * scalar, y * scalar, z * scalar * 1.25]

    //                             // value: [x * boneWorldPosition3_2.x / boneWorldPosition3.x,
    //                             // y * boneWorldPosition3_2.y / boneWorldPosition3.y,
    //                             // z * boneWorldPosition3_2.z / boneWorldPosition3.z]
    //                         }
    //                     })
    //                 }
    //             }
    //         }

    //         if (data.collisionPart == collisionPart.Torso) {
    //             return {
    //                 ...data,
    //                 oneBone: {
    //                     ...data.oneBone,
    //                     // frontDirectionScalar: 
    //                     size: data.oneBone.size.map(s => {
    //                         let [x, y, z] = s.value
    //                         // let scalar = 1.4
    //                         // let scalar = 0.4 * scaleNumber + 0.6
    //                         // let scalar = 0.5 * scaleNumber + 0.6
    //                         // let scalar = 1.6
    //                         // let scalar = 1.6 *1.5
    //                         // let scalar = 1.6 * 1.5 / 2
    //                         // let scalar = 1.5
    //                         let scalar = 1.5 

    //                         return {
    //                             ...s,
    //                             // value: [x * scalar, y * scalar, z * scalar]
    //                             value: [x * scalar, y, z * scalar * 1.1]
    //                             // value: [x * boneWorldPosition3_2.x / boneWorldPosition3.x,
    //                             // y * boneWorldPosition3_2.y / boneWorldPosition3.y,
    //                             // z * boneWorldPosition3_2.z / boneWorldPosition3.z]
    //                         }
    //                     })
    //                 }
    //             }
    //         }
    //     }

    //     return data
    // })

    // state = setCollisionShapeData(state, (state) => newCd)




    // state = setGirlScale(
    //     state,
    //     getGirlScale(state, usedGirl) + getScaleIncrease(state)
    // )

    state = setTargetToCameraDirection(state, getTargetToCameraDirection(state))


    // state = _adjustRenderAccuracy(state, getGirlScale(state, usedGirl))

    return addGirl(state, usedGirlEnum.PlayerGirl, getAllUsedMMDData(state), worldPosition, worldQuaternion)
}

export let resetPlayerGirlValue = (state: state) => {
    state = setGirlValue(state, usedGirlEnum.PlayerGirl, PlayerGirlData.getValue(state))

    return state
}

export let removePlayerGirl = (state: state) => {
    // state = resetPlayerGirlValue(state)
    let usedGirl = usedGirlEnum.PlayerGirl

    state = stopSmallByTime(state, usedGirl)

    state = setSavedStudyActions(state, getCurrentStudyActions(state))

    state = useThirdPersonControls(state)

    // if (getBiggerWay(state) == biggerWay.Active) {
    if (hasStudyAction(state, buildFuncData(state), actionName.Bigger)) {
        state = changeToSmallestActiveBigger(state, usedGirl, _computeIncreaseScale)
        // state = setNeedShowSkillBar(state, usedGirl, true)
        state = refreshBiggerTime(state, usedGirl)
    }


    return removeGirl(state, usedGirl, getAllUsedMMDData(state)).then(state => {
        state = setOriginPlayerGirlScale(state, getScale(state, usedGirl))

        // state = setCurrentUsedGirl(state, usedGirlEnum.None)
        state = removeCurrentUsedGirl(state, usedGirl)

        return state
    })
}

export let afterInitWhenImportScene = (state: state) => {
    state = setFullHp(state, buildFuncData(state), (state, hp) => {
        return hp + getHpIncrease(state)
    }, true, usedGirlEnum.PlayerGirl)

    return Promise.resolve(state)
}

export let initWhenImportScene = (state: state) => {
    return Promise.resolve(state)
}

export let update = (state: state, usedGirl) => {
    state = setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        isMoveCollisioned: false,
        // isRotationLock: false,
    })


    let velocity

    if (isPlayingAnimation(state, usedGirl, animationName.Walk)
        || isPlayingAnimation(state, usedGirl, animationName.Run)
        || isPlayingAnimation(state, usedGirl, animationName.CrawlMove)
    ) {
        let data = move(state, usedGirl)
        state = data[0]
        velocity = data[1]
    }
    else {
        velocity = new Vector3(0, 0, 0)
    }


    // if (isGiantessCharacterType(state)) {
    // if (isPlayingAnimation(state, usedGirl,  animationName.Walk)
    //     || isPlayingAnimation(state, usedGirl,  animationName.Run)
    //     || isPlayingAnimation(state, usedGirl,  animationName.CrawlMove)
    // ) {
    //     let data = move(state)
    //     state = data[0]
    //     velocity = data[1]
    // }
    // else {
    //     velocity = new Vector3(0, 0, 0)
    // }

    // state = setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getOrbitControlsTarget(state),
    //     isCameraCollision(state)
    // )
    // )
    // }
    // else if (isLittleCharacterType(state)) {
    // }

    return updateAnimation(state, usedGirl).then(state => {
        return updateAnimationCollision(state, usedGirl, velocity)
    }).then(state => {
        return updateFSMState(state, usedGirl)
    }).then(state => {
        // state = updateByExcitement(state)


        if (getCameraType(state) == cameraType.FirstPerson) {
            state = updateFirstPersonControls(state)
        }
        else {
            let { screenShake } = getUsedGirlData(state, usedGirl)
            screenShake.update(state, getCurrentCamera(getAbstractState(state)))

            if (getCameraType(state) == cameraType.ThirdPerson) {
                state = setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getOrbitControlsTarget(state),
                    isCameraCollision(state)
                )
                )
            }
        }


        let promise
        let newHeight = computeHeight(state, usedGirl)
        let oldHeight = getCurrentHeight(state, usedGirl)
        if (newHeight != oldHeight) {
            state = computeGirlBoxAndSetToState(state, usedGirl)

            state = setHeight(state, usedGirl, newHeight)


            state = updateAnimationDuration(state, usedGirl, getScale(state, usedGirl))



            if (getCameraType(state) == cameraType.ThirdPerson) {
                // if (isGiantessCharacterType(state)) {
                state = updateThirdPersonControlsForChangeScale(state,
                    // getScaleByHeight(oldHeight) == 0 ? 1 :
                    //     getScaleByHeight(newHeight) / getScaleByHeight(oldHeight)
                )
                // }
            }

            state = updateMMDPhysicsConfigForScale(state, usedGirl)



            // promise = Event.trigger(state, getAbstractState, getLevelStatusUpdateEventName(), buildLevelStatusUpdateEventData(state))
            promise = Promise.resolve(state)
        }
        else {
            promise = Promise.resolve(state)
        }

        return promise
    })
        // .then(state => {
        //     if (!NullableUtils.isNullable(getUsedGirlData(state, usedGirl).needUpdateStatus)) {
        //         return Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), buildGiantessStatusUpdateEventNameEventData(
        //             NullableUtils.getExn(getUsedGirlData(state, usedGirl).needUpdateStatus).damagePart
        //         ))
        //     }

        //     return state
        // })
        .then(state => PickPose.update(state, usedGirl))
    // .then(clearNeedUpdateStatus)
    // .then(_handleDecreaseGirlScale)
}

let _isStressingByRate = (state: state, usedGirl, damage, damageType_: damageType, collisionPart_: collisionPart, damagePart) => {
    let damageTypeFactor = getDamageTypeFactor(damageType_)

    let collisionPartFactor = getCollisionPartFactor(collisionPart_)

    let forceFactor = getForceFactor(getBodyHp(state, usedGirl), damage, 0.025)


    let settingFactor

    // if (isGiantessCharacterType(state)) {
    // switch (getGiantessSetting(state).giantessStrength) {
    //     case giantessStrength.Low:
    //         settingFactor = 2
    //         break
    //     case giantessStrength.Middle:
    settingFactor = 1
    //         break
    //     case giantessStrength.High:
    //         settingFactor = 0.5
    //         break
    //     case giantessStrength.VeryHigh:
    //         settingFactor = 0.15
    //         break
    //     default:
    //         throw new Error("err")
    // }
    // }
    // else {
    //     switch (getLittleManSetting(state).giantessStrength) {
    //         case giantessStrength.Low:
    //             settingFactor = 2
    //             break
    //         case giantessStrength.Middle:
    //             settingFactor = 1
    //             break
    //         case giantessStrength.High:
    //             settingFactor = 0.5
    //             break
    //         case giantessStrength.VeryHigh:
    //             settingFactor = 0.15
    //             break
    //         default:
    //             throw new Error("err")
    //     }
    // }

    let scaleFactor = getScaleFactor(state, usedGirl)


    // const factor = 0.8
    const factor = getBaseFactor()

    let damagePartFactor = getDamagePartFactor(state, usedGirl, damagePart)

    let timeFactor = getStressingFactorByJudgeLastStressingTime(state, usedGirl)

    // let rate = NumberUtils.clamp(1 * (1 / Math.sqrt(scale)) * (damage / forceSize.Middle) * damageTypeFactor * collisionPartFactor * factor, 0, 1)
    let rate = NumberUtils.clamp(1 * scaleFactor * forceFactor * damageTypeFactor * collisionPartFactor * factor * settingFactor * damagePartFactor * getSkillStateFactor(state, usedGirl)
        * getValue(state, usedGirl).stressingRateFactor, 0, 1) * timeFactor

    // Console.warn(rate,
    //     damage, weaponType_, collisionPart_
    // )

    return NumberUtils.isRandomRate(rate)
}

export let damage = (state: state, usedGirl, [force, damageType, weaponType], fromName, collisionPart_: collisionPart, damagePosition: nullable<Vector3>, weaponValue_,
    // critRatioFactor,
    // attackFactor,
) => {
    return damageUtils(state,
        [
            (state, collisionPart_) => {
                let [damagePartByCollisionPart, actuallyDamagePartsByCollisionPart] = getDamagePartByCollisionPart(state, usedGirl, collisionPart_)
                let [damagePartByJudge, actuallyDamagePartsByJudge] = getDamagePartByJudge(state, usedGirl, damagePartByCollisionPart, actuallyDamagePartsByCollisionPart)

                return [damagePartByCollisionPart, damagePartByJudge, actuallyDamagePartsByJudge]
            },
            updateDamageType,
            computeForce,
            getDamagePositionForLabel,
            (state, stateMachine, damage, weaponType, collisionPart_, damagePartByCollisionPart, fromName) => {
                state = handleLightStressing(state, usedGirl, damage, collisionPart_, false)

                if (
                    isCanStressing(state, usedGirl, stateMachine)
                    && _isStressingByRate(state, usedGirl, damage, damageType, collisionPart_, damagePartByCollisionPart)
                ) {
                    return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
                        return setStateMachine(usedGirl)(state, stateMachine)
                    }, stateMachine, createStressingState(usedGirl), buildNameByUsedGirl(usedGirl), [collisionPart_, fromName, damagePosition])
                }

                return Promise.resolve(state)
            },
            createStressingState,
        ],
        usedGirl,
        [force, damageType, weaponType],
        fromName,
        collisionPart_, damagePosition, weaponValue_,
        // critRatioFactor,
        // attackFactor,
    )
}

let _getData = (state: state) => {
    return getGirlState(state).playerGirlData
}

let _setData = (state: state, d: playerGirlData) => {
    return setGirlState(state, {
        ...getGirlState(state),
        playerGirlData: d
    })
}





export let getMaxBiggerCount = (state: state) => {
    // if (isUseInfinityBig(state)) {
    //     return +Infinity
    // }

    return _getData(state).maxBiggerCount
}

export let setMaxBiggerCount = (state: state, value) => {
    return _setData(state, {
        ..._getData(state),
        maxBiggerCount: value
    })
}

// export let getBiggerWay = (state: state) => {
//     return _getData(state).biggerWay
// }

// export let setBiggerWay = (state: state, value) => {
//     return _setData(state, {
//         ..._getData(state),
//         biggerWay: value
//     })
// }

// let _handleFirstSwitchBiggerWay = (state, biggerWay_) => {
//     // let removedGiantessUpgradeNames
//     switch (biggerWay_) {
//         // case biggerWay.Passive:
//         //     state = _removeStudyActions(state, [actionName.Bigger])
//         //     removedGiantessUpgradeNames = [giantessUpgradeName.LearnBigger, giantessUpgradeName.EnhanceBigger]
//         //     break
//         case biggerWay.Active:
//             state = studyActions(state, buildFuncData(state), [actionName.Bigger])

//             // state = _setData(state, {
//             //     ..._getData(state),
//             //     sumExcitement: 0
//             // })

//             // removedGiantessUpgradeNames = [giantessUpgradeName.ChangeToPassiveBigger]
//             break
//         default:
//             throw new Error("err")
//     }

//     // let funcData = buildFuncData(state)

//     // return ArrayUtils.reducePromise(
//     //     removedGiantessUpgradeNames,
//     //     (state, removedGiantessUpgradeName: giantessUpgradeName) => {
//     //         return removeGiantessUpgrade(state, funcData, removedGiantessUpgradeName)
//     //     },
//     //     state
//     // )
//     // // .then(state => {
//     // //     if (!getIsApplying(state)
//     // //         && !isSmallestToZeroBiggerCount(state)
//     // //     ) {
//     // //         return triggerAction(state, usedGirl, actionName.Smallest).then(TupleUtils.getTuple2First)
//     // //     }

//     // //     return Promise.resolve(state)
//     // // })
//     return Promise.resolve(state)
// }

export let setOriginPlayerGirlScale = (state: state, scale) => {
    return _setData(state, {
        ..._getData(state),
        originPlayerGirlScale: NullableUtils.return_(scale)
    })
}

// export let switchBiggerWay = (state: state, biggerWay_:  level: upgradeLevel) => {
//     state = setBiggerWay(state, biggerWay_)

//     switch (biggerWay_) {
//         // case biggerWay.Passive:
//         //     state = setMaxScale(
//         //         state,
//         //         getPassiveMaxBiggerScaleByLevel(state, buildFuncData(state), level)
//         //     )

//         //     if (getIsApplying(state)) {
//         //         // state = setGirlScale(state, _getData(state).scale)
//         //         state = _updateGirlScale(state)
//         //         state = setOriginPlayerGirlScale(state, getScale(state, usedGirl))
//         //         // state = _setData(state, {
//         //         //     ..._getData(state),
//         //         //     originPlayerGirlScale: NullableUtils.return_(getScale(state, usedGirl))
//         //         // })
//         //     }
//         //     break
//         case biggerWay.Active:
//             state = setMaxBiggerCount(state, level)
//             break
//         default:
//             throw new Error("err")
//     }

//     if (!getIsApplying(state) && level > 1) {
//         return Promise.resolve(state)
//     }


//     return _handleFirstSwitchBiggerWay(state, biggerWay_)
// }

export let studyActiveBigger = (state: state, level: upgradeLevel) => {
    state = setMaxBiggerCount(state, level)

    if (!getIsApplying(state) && level > 1) {
        return Promise.resolve(state)
    }


    state = studyActions(state, buildFuncData(state), [actionName.Bigger])

    return Promise.resolve(state)
}

// let _updateGirlScale = (state: state) => {
//     if (getGirlScale(state, usedGirl) >= getMaxScale(state)) {
//         return state
//     }

//     return setGirlScaleAndKeepCamera(state,usedGirl, NumberUtils.lessThan(getValue(state).initialScale + getPassiveScaleIncrease(_getData(state).sumExcitement), getMaxScale(state)))
// }


// let _handleDecreaseGirlScale = (state: state) => {
//     if (getBiggerWay(state) != biggerWay.Passive) {
//         return state
//     }

//     // if (getExcitement(state, usedGirl) >= 30) {
//     if (getExcitement(state, usedGirl) >= 10) {
//         return state
//     }

//     let now = getNow(state) / 1000

//     if (now - NullableUtils.getWithDefault(
//         _getData(state).lastDecreaseScaleTime,
//         0
//     ) >= 10) {
//         let girlScale = getGirlScale(state, usedGirl)
//         let targetScale = NumberUtils.greaterThan(
//             girlScale - NumberUtils.greaterThan(girlScale * 0.2, 5),
//             getValue(state).initialScale)

//         state = _setData(state, {
//             ..._getData(state),
//             lastDecreaseScaleTime: NullableUtils.return_(now),
//         })

//         if (girlScale == targetScale) {
//             return state
//         }

//         state = _setData(state, {
//             ..._getData(state),
//             sumExcitement: _getSumExcitementByPassiveScaleIncrease(targetScale - getValue(state).initialScale)
//         })

//         state = playSmallerAnimation(state, (state) => {
//             return Promise.resolve(state)
//         },
//             targetScale
//         )

//         return state
//     }

//     return state
// }

// export let getPassiveScaleIncrease = (sumExcitement: number) => {
//     return Math.round(sumExcitement / 5)
// }

// let _getSumExcitementByPassiveScaleIncrease = (passiveScaleIncrease) => {
//     return passiveScaleIncrease * 5
// }

// export let getSumExcitement = (state: state) => {
//     return _getData(state).sumExcitement
// }

// export let addScale = (state: state, excitement: excitement) => {
//     // let scaleIncrease = excitement / 5

//     // state = _setGirlScale(state, Math.min(getGirlScale(state, usedGirl) + scaleIncrease, getMaxScale(state)))
//     // state = _setGirlScale(state, excitement)

//     if (getGirlScale(state, usedGirl) >= getMaxScale(state)) {
//         return state
//     }

//     state = _setData(state, {
//         ..._getData(state),
//         sumExcitement: _getData(state).sumExcitement + excitement * (1 + getScaleRatio(_getData(state).excitementFactorLevel))
//     })

//     // state = setGirlScale(state, Math.min(getValue(state).initialScale + getPassiveScaleIncrease(_getData(state).sumExcitement), getMaxScale(state)))
//     state = _updateGirlScale(state)

//     return state
// }

// export let getMaxScale = (state: state) => {
//     // if (isUseInfinityBig(state)) {
//     //     return +Infinity
//     // }

//     return _getData(state).maxScale
// }

// export let setMaxScale = (state: state, value) => {
//     return _setData(state, {
//         ..._getData(state),
//         maxScale: value
//     })
// }

export let getExcitementFactorLevel = (state: state) => {
    return _getData(state).excitementFactorLevel
}

export let setExcitementFactorLevel = (state: state, value) => {
    return _setData(state, {
        ..._getData(state),
        excitementFactorLevel: getScaleRatio(value)
    })
}

export let getDamageBiggerFactorLevel = (state: state) => {
    return _getData(state).damageBiggerFactorLevel
}

export let setDamageBiggerFactorLevel = (state: state, value) => {
    return _setData(state, {
        ..._getData(state),
        damageBiggerFactorLevel: getScaleRatio(value)
    })
}


export let getBiggerEnhanceLevel = (state: state) => {
    return _getData(state).biggerEnhanceLevel
}

export let setBiggerEnhanceLevel = (state: state, value) => {
    return _setData(state, {
        ..._getData(state),
        biggerEnhanceLevel: value
    })
}

export let getEnhanceIncreaseScale = (state: state, increaseScale: number, biggerEnhanceLevel: number) => {
    let factor
    switch (biggerEnhanceLevel) {
        case 0:
            factor = 1
            break

        case 1:
            factor = 1.5
            break
        default:
            factor = biggerEnhanceLevel
            break
        // case 2:
        //     factor = 2
        //     break
        // case 3:
        //     factor = 2.5
        //     break
        // default:
        //     throw new Error("err")
    }

    return Math.round(increaseScale * factor)
}

export let getEnhanceBiggerFullTime = (state: state, fullBiggerTime, biggerEnhanceLevel: number) => {
    let factor
    switch (biggerEnhanceLevel) {
        case 0:
            factor = 1
            break
        case 1:
            factor = 0.7
            break
        case 2:
            factor = 0.5
            break
        case 3:
        default:
            factor = 0.3
            break
    }

    return Math.round(fullBiggerTime * factor)
}


// let _getMoveAndStompDamageEnhanceLevel = (state: state) => {
//     return _getData(state).moveDamageEnhanceLevel
// }

// export let setMoveAndStompDamageEnhanceLevel = (state: state, value) => {
//     return _setData(state, {
//         ..._getData(state),
//         moveDamageEnhanceLevel: value
//     })
// }

// export let getMoveAndStompDamageEnhanceRatio = (moveDamageEnhanceLevel) => {
//     // return moveDamageEnhanceLevel * 0.5
//     return moveDamageEnhanceLevel * 0.3
// }

export let updateForce = (state: state, animationName_, phase_: phase, forceSize: forceSize) => {
    return forceSize
    // let level = _getMoveAndStompDamageEnhanceLevel(state)

    // if (!isPlayerGirlByUsedGirl(usedGirl_)
    //     || level == 0
    // ) {
    //     return forceSize
    // }

    // let isEnhanceForce = false
    // switch (animationName_) {
    //     case animationName.Walk:
    //     // if (phase_ == walkPhase.LeftFootDown || phase_ == walkPhase.RightFootDown) {
    //     //     isEnhanceForce = true
    //     // }
    //     // break
    //     case animationName.Run:
    //     // if (phase_ == runPhase.LeftFootDown || phase_ == runPhase.RightFootDown) {
    //     //     isEnhanceForce = true
    //     // }
    //     // break
    //     case animationName.CrawlMove:
    //     // case animationName.Stomp:
    //     case getStompBlockService(state).getForceAnimationName():
    //         // if (phase_ == crawlMovePhase.Down) {
    //         //     isEnhanceForce = true
    //         // }
    //         isEnhanceForce = true
    //         break
    // }

    // if (!isEnhanceForce) {
    //     return forceSize
    // }

    // return forceSize + forceSize * getMoveAndStompDamageEnhanceRatio(level)
}


export let getScaleRatio = (level) => {
    // return 0.2 * level
    return 0.05 * level
}

export let addScaleIncrease = (state: state, level, usedGirl) => {
    state = setAttribute(state, buildFuncData(state), (girlValue) => {
        return {
            ...girlValue,
            scaleIncrease: Math.round(
                girlValue.scaleIncrease *
                (1 + getScaleRatio(level))
            ),
            // initialScale: Math.round(
            //     girlValue.initialScale *
            //     (1 + getScaleRatio(level))
            // )
        }
    }, usedGirl)

    // state = setGirlScale(state, getValueByUsedGirl(state, usedGirlEnum.PlayerGirl).initialScale)

    return state
}

export let addInitialScale = (state: state, level, usedGirl) => {
    state = setAttribute(state, buildFuncData(state), (girlValue) => {
        return {
            ...girlValue,
            initialScale: Math.round(
                girlValue.initialScale *
                (1 + getScaleRatio(level))
            )
        }
    }, usedGirl)

    state = setGirlScale(state, usedGirl, getValueByUsedGirl(state, usedGirl).initialScale)
    // state = setInitialScaleAndUpdateScale(state, buildFuncData(state), (state, initialScale) => {
    //     return Math.round(
    //         initialScale *
    //         (1 + getScaleRatio(level))
    //     )
    // }, setGirlScale)

    return state
}


export let getBiggerTimeRatio = (level) => {
    return 0.1 * level
}

export let addBiggerTime = (state: state, level, usedGirl) => {
    state = setAttribute(state, buildFuncData(state), (girlValue) => {
        return {
            ...girlValue,
            biggerMaxTime: Math.round(
                girlValue.biggerMaxTime *
                (1 + getBiggerTimeRatio(level))
            ),
        }
    }, usedGirl)

    return state
}


export let getCurrentStudyActions = (state: state) => {
    return _getData(state).currentStudyActions
}

export let setCurrentStudyActions = (state: state, value: List<studyAction<actionName>>) => {
    return _setData(state, {
        ..._getData(state),
        currentStudyActions: value
    })
}

export let getCurrentStudyActionNames = (state: state) => {
    return getCurrentStudyActions(state).map(a => a.name)
}

export let getSavedStudyActions = (state: state) => {
    return _getData(state).savedStudyActions
}

export let setSavedStudyActions = (state: state, value) => {
    return _setData(state, {
        ..._getData(state),
        savedStudyActions: value
    })
}




export let getScaleIncrease = (state: state) => {
    return _getData(state).scaleIncrease
}

export let setScaleIncrease = (state: state, value) => {
    return _setData(state, {
        ..._getData(state),
        scaleIncrease: value
    })
}


export let getHpIncrease = (state: state) => {
    return _getData(state).hpIncrease
}

export let setHpIncrease = (state: state, value) => {
    return _setData(state, {
        ..._getData(state),
        hpIncrease: value
    })
}

// let _removeStudyActions = (state: state, value: Array<actionName>) => {
//     state = setCurrentStudyActions(state, getCurrentStudyActions(state).filter(({ name }) => !value.includes(name)))

//     state = setSavedStudyActions(state, getSavedStudyActions(state).filter(({ name }) => !value.includes(name)))

//     return state
// }


export let dispose = (state): playerGirlData => {
    if (isEnteringNextLevel(state)
        // && isUseCareer(state, characterType.Giantess, getFoodieBlockService(state).getName())
    ) {
        return {
            ...createData(),
            scaleIncrease: _getData(state).scaleIncrease,
            hpIncrease: _getData(state).hpIncrease,
        }
    }

    return createData()
}

export let createData = (): playerGirlData => {
    return {
        currentStudyActions: List(),
        savedStudyActions: List(),

        // biggerWay: biggerWay.None,
        maxBiggerCount: 1,
        biggerEnhanceLevel: 0,

        // maxScale: -1,
        // scale: -1,
        // sumExcitement: 0,
        excitementFactorLevel: 0,
        // lastDecreaseScaleTime: NullableUtils.getEmpty(),
        damageBiggerFactorLevel: 0,

        // moveDamageEnhanceLevel: 0,

        originPlayerGirlScale: NullableUtils.getEmpty(),

        scaleIncrease: 0,
        hpIncrease: 0,
    }
}


// export let isActionValid = (state: state, name: actionName, isCheckExcitement: boolean) => {
export let isActionValid = (state: state, usedGirl, name: actionName) => {
    requireCheck(() => {
        test("should >= minScale", () => {
            return getGirlScale(state, usedGirl) >= getValue(state, usedGirl).minScale
        })
    }, getIsDebug(state))

    if (!hasGirlMesh(state, usedGirl)) {
        return false
    }

    if (!getCurrentStudyActionNames(state).includes(name)) {
        return false
    }

    // if (!isActionValidMod(state, name)) {
    //     return false
    // }

    if (name == actionName.SmallerToLastBiggerCount
        // && (
        //     isChangeScaling(state, usedGirl) || getGirlScale(state, usedGirl) <= getValue(state).scaleIncrease
        // )
        // && !isSmallestToZeroBiggerCount(state)

        // && getGirlScale(state, usedGirl) > getValue(state).minScale
    ) {
        return true
    }

    if (name == actionName.Bigger
        && (
            isChangeScaling(state, usedGirl)

            // || (!getIsBiggerNoLimit(state) && getGirlScale(state, usedGirl) >= getValue(state).maxScale)
            || getGirlScale(state, usedGirl) >= getMaxScaleUtils(state, getValue(state, usedGirl))
            // || (isGiantessCharacterType(state) && PlayerGirl.getBiggerCount(state, usedGirl) >= PlayerGirl.getMaxBiggerCount(state))
            || (getBiggerCount(state, usedGirl) >= getMaxBiggerCount(state))
        )
    ) {
        return false
    }


    if (name == actionName.Reborn) {
        return true
    }


    if (!isBelongToCurrentPoseAndScaleState(state, usedGirl, name)) {
        return false
    }


    // if (isCheckExcitement) {
    let { excitement } = getSkillData(state, usedGirl, name)

    if (!isExcitementEnough(state, usedGirl, excitement)) {
        return false
    }
    // }


    if (isActionTriggering(state, usedGirl, name)) {
        return false
    }


    if (name == actionName.Bigger) {
        return true
    }

    if (name == actionName.Eat && isChangeScaling(state, usedGirl)) {
        return false
    }

    if (!isNotDamageState(getStateMachine(state, usedGirl)) || isControlledState(state, getStateMachine(state, usedGirl))) {
        return false
    }

    if (isKeepPoseAnimation(state, name, getCurrentAnimationName(state, usedGirl))) {
        return true
    }

    switch (name) {
        case actionName.Run:
            if (isTriggerAction(state, usedGirl, actionName.Bigger)
            ) {
                return false
            }

            return getCurrentAnimationName(state, usedGirl) == animationName.Walk
        // case actionName.Stomp:
        //     return getCurrentAnimationName(state, usedGirl) == animationName.Walk || isActionState(state, actionState.Run)
        default:
            if (isActionValidMod(state, usedGirl, name)) {
                return true
            }

            return false
    }
}

let _computeIncreaseScale = (state, usedGirl) => {
    return getEnhanceIncreaseScale(state, getActiveBiggerIncreaseScale(state, usedGirl), getBiggerEnhanceLevel(state))
}

// export let triggerAction = (state, name: actionName, isJudgeRun = false, isSubExcitement = true): Promise<[state, result]> => {
export let triggerAction = (state, usedGirl, name: actionName): Promise<[state, result]> => {
    if (isDamageAction(state, name)) {
        state = setTriggerAction(state, usedGirl, name)
        // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
        return Promise.resolve([state, result.Success])
    }




    if (name == actionName.Run
        && isActionTriggering(state, usedGirl, actionName.Run)
    ) {
        state = setActionState(state, usedGirl, actionState.Initial)

        return Promise.resolve([state, result.Success])
    }



    // if (!isActionValid(state, name, isSubExcitement)) {
    if (!isActionValid(state, usedGirl, name)) {
        return Promise.resolve([state, result.Fail])
    }


    // if (isSubExcitement) {
    let { excitement } = getSkillData(state, usedGirl, name)

    state = subExcitement(state, usedGirl, excitement)
    // }


    // if (isJudgeRun && name == actionName.Run) {
    if (name == actionName.Run) {
        // if (isActionTriggering(state, actionName.Run)) {
        //     state = setActionState(state, actionState.Initial)
        // }
        // else {
        state = setActionState(state, usedGirl, actionState.Run)
        // }


        // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
        return Promise.resolve([state, result.Success])
    }



    if (!isSmallerAction(name)) {
        state = setTriggerAction(state, usedGirl, name)
    }



    state = triggerScaleAction(state, usedGirl, _computeIncreaseScale, name)

    switch (name as any) {
        // case actionName.Bigger:
        //     state = setActionState(state, actionState.Initial)

        //     // if (isGiantessCharacterType(state)) {
        //     state = setBiggerCount(state,usedGirl,  getBiggerCount(state, usedGirl) + 1)
        //     // }
        //     // else if (isWildGiantess(state, usedGirl)) {
        //     //     state = WildGiantess.setBiggerCount(state,usedGirl,  WildGiantess.getBiggerCount(state, usedGirl) + 1)
        //     // }
        //     // else if (isEnemyGiantess(state, usedGirl)) {
        //     //     state = EnemyGiantess.setBiggerCount(state,usedGirl,  EnemyGiantess.getBiggerCount(state, usedGirl) + 1)
        //     // }
        //     // else if (isPlayerGoddess(state, usedGirl)) {
        //     //     state = PlayerGoddess.setBiggerCount(state,usedGirl,  PlayerGoddess.getBiggerCount(state, usedGirl) + 1)
        //     // }

        //     state = playBiggerAnimation(state, [(state) => {
        //         state = setLastScaleChangeTime(state)
        //         state = setNeedShowSkillBar(state, usedGirl, true)
        //         state = refreshBiggerTime(state, usedGirl)

        //         if (isTriggerAction(state, actionName.Bigger)) {
        //             state = resetIsTriggerAction(state, usedGirl)
        //         }

        //         // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
        //         return Promise.resolve(state)
        //     },
        //     state => {
        //         return [
        //             getScale(state, usedGirl) + getEnhanceIncreaseScale(state, getActiveBiggerIncreaseScale(state), getBiggerEnhanceLevel(state)),
        //             1
        //         ]
        //     },
        //     ])
        //     break
        // case actionName.SmallerToLastBiggerCount:
        //     state = setActionState(state, actionState.Initial)

        //     state = playSmallerAnimation(state, (state) => {
        //         // if (InitWhenImportScene.isSmallestToZeroBiggerCount(state)) {
        //         //     state = setNeedShowSkillBar(state, usedGirl, false)
        //         state = setLastScaleChangeTime(state)
        //         // }
        //         // else {
        //         //     state = setLastScaleChangeTime(state, scaleState.Big)
        //         //     state = setNeedShowSkillBar(state, usedGirl, true)
        //         //     state = InitWhenImportScene.refreshBiggerTime(state, usedGirl)
        //         // }
        //         state = setNeedShowSkillBar(state, usedGirl, false)
        //         // state = setLastScaleChangeTime(state, scaleState.Normal)

        //         // if (isGiantessCharacterType(state)) {
        //         // state = setBiggerCount(state,usedGirl,  0)
        //         state = setBiggerCount(state,usedGirl,  NumberUtils.greaterThan(getBiggerCount(state, usedGirl) - 1, 0))
        //         // }
        //         // else if (isWildGiantess(state, usedGirl)) {
        //         //     state = WildGiantess.setBiggerCount(state,usedGirl,  0)
        //         // }
        //         // else if (isEnemyGiantess(state, usedGirl)) {
        //         //     state = EnemyGiantess.setBiggerCount(state,usedGirl,  0)
        //         // }
        //         // else if (isPlayerGoddess(state, usedGirl)) {
        //         //     state = PlayerGoddess.setBiggerCount(state,usedGirl,  0)
        //         // }

        //         if (isTriggerAction(state, actionName.SmallerToLastBiggerCount)) {
        //             state = resetIsTriggerAction(state, usedGirl)
        //         }


        //         // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
        //         return Promise.resolve(state)
        //     },
        //         getValue(state).initialScale + getEnhanceIncreaseScale(state, getActiveBiggerIncreaseScale(state) * getBiggerCount(state, usedGirl), getBiggerEnhanceLevel(state)),
        //     )
        //     break
        case actionName.Run:
            state = setActionState(state, usedGirl, actionState.Run)
            break
    }

    // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    // return Promise.resolve([state, result.Success])
    return triggerActionMod(state, usedGirl, name)
}

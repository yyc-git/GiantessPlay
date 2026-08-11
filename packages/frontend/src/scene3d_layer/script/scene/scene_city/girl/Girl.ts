import { Event, NullableUtils, Scene, Device, SkinAnimation, Loader, ModelLoader, Camera, DisposeUtils, ThirdPersonControls, Layer } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../../type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State"
import { getScene, getState, setState, getDynamicGroup, getWalkLeftSoundResourceId, getWalkRightSoundResourceId, getWalkVehicle1SoundResourceId, getWalkVehicle2SoundResourceId, getGirlScale, getConfigData, isGiantessCharacterType, isLittleCharacterType, getSceneChapter, getConfigOperateRenderData, isGiantessCharacterTypeByUsedGirl } from "../CityScene"
import { damageType, collisionPart, girl, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, result, giantessStrength, giantessScale, damagePart, usedGirlEnum, studyAction, usedGirlData, waterPropName, camp, autoDifficulty, usedGirl } from "../type/StateType"
import { AnimationClip, AxesHelper, Box3, Box3Helper, Color, CompressedArrayTexture, Euler, Matrix3, Matrix4, Mesh, MeshPhongMaterial, Object3D, Quaternion, Vector2, Vector3 } from "three"
// import { setTarget } from "./Camera"
import { getIsDebug } from "../../Scene"
import { getThirdPersonCameraTarget, getOrbitControlsTarget, isCameraCollision, updateThirdPersonControlsForChangeScale, getCameraType, updateDistanceRateOnlyOnceInOneFrame } from "../Camera"
import { Flow, Capsule } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract"
import { List, Map } from "immutable"
import { ScreenShake } from "meta3d-jiehuo-abstract"
import { buildLevelStatusUpdateEventData, getDestroyedEventName } from "../utils/EventUtils"
import { getGiantessStatusUpdateEventName, getPickupEventName, getPickdownEventName, getPinchJudageDamageEventName, getEatEventName, getStandToCrawlEventName, getCrawlToStandEventName, getLittleManStatusUpdateEventName, buildGiantessStatusUpdateEventNameEventData, } from "../../../../utils/EventUtils"
import { actionName, animatioNameAndActionName, animationName, armorStrength, armorRatio, articluatedAnimationName, defenseFactor, effect, excitement, forceSize, frameIndex, particle, track, armorType } from "../data/DataType"
import { move } from "./Move"
import { computeGirlBoxAndSetToState, computeHeight, getGirlBox, getCurrentHeight, getScale, getScaleByHeight, setGirlRotation, markGirlVisible, markGirlNotVisible, getScaleIncreaseTimes, updateMMDPhysicsConfigForScale, isCanStressing, computeGirlBoxDefault, offAllEvents, buildFakeGirlWeaponValue, handlePickDataWhenExecuteDestroyed, getMaxScale as getMaxScaleUtils, getGirlPosition, getGirlRotation, isSmallGiantess, isMiddleGiantess, getForceFactor, computeGirlBoxAndNotChangeCenterXY } from "./Utils"
import { createFSMStateByChangeAnimationNameDefault, getAllAnimationNames, getCurrentAnimationName, isChangeScaling, isCompletelyPlayingAnimation, isKeepPoseAnimation, isPlayingAnimation, isPlayingAnimationByWeight, playBiggerAnimation, playSmallerAnimation, updateAnimation, updateAnimationDuration } from "./Animation"
import { computeDamageTypeDefault, computeForceDirectionDefault, getCollisionPartOBB, updateAnimationCollision } from "./Collision"
import * as PickPose from "./PickPose"
import * as InitWhenImportScene from "./InitWhenImportScene"
import { createInitialState, getStateMachine, isChangeCrawlPoseState, isSkillState, setStateMachine, update as updateFSMState } from "./FSMState"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import * as StateMachine from "meta3d-jiehuo-abstract/src/fsm/StateMachine"
import * as DamageUtils from "../utils/DamageUtils"
import { characterType, fontType, labelAnimation, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { armorPiercingForceRatio, girlValue, weaponType, weaponValue } from "../data/ValueType"
import { isControlledState, isDestoryRelatedStates, isNotDamageState } from "../utils/FSMStateUtils"
import { getCurrentPose } from "./Pose"
import { addExcitement, addExcitementDirectly, isExcitementEnough, isZeroExcitement, setExcitement, subExcitement, update as updateExcitement } from "./Excitement"
import { disposeAllLoadedMMDResources, getBone, isEnablePhysics } from "../utils/MMDUtils"
// import { setNeedShowSkillBar } from "../UI"
import { crawlToStandHandler, standToCrawlHandler, updateCrawlPosePivot } from "./Crawl"
import { getAllBodyNames, getDamagePartByCollisionPart, getDamagePartByJudge, getHpData, handleClothDestroyed, isCloth } from "./Cloth"
import { getBody, isShoe, mmdCharacter } from "../data/mmd/MMDData"
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType"
import { handleRemoveShoe } from "../data/mmd/Shoe"
import { isEnter } from "../scenario/ScenarioManager"
import { MMDAnimationHelper } from "meta3d-jiehuo-abstract/src/three/MMDAnimationHelper"
import { ScreenUtils } from "meta3d-jiehuo-abstract"
import * as PlayerGirl from "./player/Girl"
import * as WildGiantess from "./wild/Girl"
import * as EnemyGiantess from "./enemy/Girl"
import * as PlayerGoddess from "./player_goddess/Girl"
import * as BossGiantess from "./boss/Girl"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getNow } from "../Time"
import { handleAfterComputeDamage, handleDamageForceSize } from "../StaticDynamic"
import { addBox3Helper } from "../utils/ConfigUtils"
import { isEnteringNextLevel } from "../manage/mission/Mission"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { addHitEffectForGirl } from "../utils/HitEffectUtils"
import { getPropValue } from "../reward/Prop"
import { computeCrit, computeExcitementFactor } from "../utils/WeaponUtils"
import { getAttackFactor, getCritRatioFactor } from "../StaticDynamicUnit"
// import { computeMiss } from "../utils/ValueUtils"
import { getCampWithDefault, getCampExn } from "../manage/city1/Army"
import { getPlayerCamp } from "../utils/PlayerUtils"
import { mmdCharacter as mmdCharacterType } from "type-default/src/Type"
import { buildAPI } from "../../../../mod/Mod"
import { isLevelGiantess as isLevelGiantessMod, isLevelGiantessExceptPlayer as isLevelGiantessExceptPlayerMod, triggerAction as triggerActionMod, update as updateMod, damage as damageMod, getUsedGirl, isPlayerLevelGiantess } from "../../../../mod/LevelGiantessMod"
import { addDamageForce } from "../Statistic"
import { computeColor } from "../utils/ColorUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { getQuaternion } from "../utils/OBBUtils"
import { getIsNotDamage } from "../Status"
import { getModAPI } from "../Mod"
import { getAutoDifficulty } from "../difficulty/Difficulty"
import { getHeavyStressingBlockService, getHeavyStressingBreastBlockService, getHeavyStressingTrigoneAndButtBlockService, getKeepSitBlockService, getSitDeathBlockService, getUBHeavyStressingBlockService, } from "../../../../mod/SkillGiantessMod"
// import { setCurrentUsedGirl } from "../BossStateStatus"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _c1 = new Color();

export let getGirlNamePrefix = () => "girl"

export let buildNameByUsedGirl = (usedGirl: usedGirl) => {
    return `${getGirlNamePrefix()}_${usedGirl}`
}

export let getUsedGirlByName = (name: string) => {
    if (isGirl(name)) {
        return name.slice(getGirlNamePrefix().length + 1)
    }

    return usedGirlEnum.None
}

// export let getUsedGirlByCharacterType = (characterType_) => {
//     switch (characterType_) {
//         case characterType.Giantess:
//             return usedGirlEnum.PlayerGirl
//         case characterType.LittleMan:
//             return usedGirlEnum.None
//         default:
//             // throw new Error("");
//             return usedGirlEnum.None
//     }
// }

export let isGirl = (name) => {
    return name.includes(getGirlNamePrefix())
}

export let isPlayerGirlByName = (state: state, name) => {
    return isGirl(name) && isGiantessCharacterType(state)
}


export let getGirlState = (state: state) => {
    return getState(state).girl
}

export let setGirlState = (state: state, girlState: girl) => {
    return setState(state, {
        ...getState(state),
        girl: NullableUtils.return_(girlState)
    })
}

export let hasUsedGirlData = (state: state, usedGirl) => {
    return MutableMapUtils.has(getGirlState(state).usedGirlDataMap, usedGirl)
}

export let getUsedGirlData = (state: state, usedGirl) => {
    return MutableMapUtils.getExn(getGirlState(state).usedGirlDataMap, usedGirl)
}

export let setUsedGirlData = (state: state, usedGirl, Data: usedGirlData) => {
    return setGirlState(state, {
        ...getGirlState(state),
        usedGirlDataMap: MutableMapUtils.set(getGirlState(state).usedGirlDataMap, usedGirl, Data)
    })
}

// export let getCurrentUsedGirlDataByUsedGirl = (state: state, usedGirl): usedGirlData => {
//     return MutableMapUtils.getExn(getGirlState(state).usedGirlDataMap, usedGirl)
// }

// export let hasCurrentUsedGirlData = (state: state) => {
//     return hasUsedGirlData(state, usedGirl)
// }

// export let getCurrentUsedGirlData = (state: state): usedGirlData => {
//     // return getCurrentUsedGirlDataByUsedGirl(state, usedGirl)
//     return getUsedGirlData(state, usedGirl)
// }

// export let setCurrentUsedGirlData = (state: state, usedGirlData: usedGirlData) => {
//     return setUsedGirlData(state, usedGirlData, usedGirl)
// }

export let setAllUsedGirlData = (state: state, getUsedGirlDataFunc) => {
    return setGirlState(state, {
        ...getGirlState(state),
        usedGirlDataMap: MutableMapUtils.map(getGirlState(state).usedGirlDataMap, (data, usedGirl) => {
            return getUsedGirlDataFunc(state, data, usedGirl)
        })
    })
}

// let _setAllEnemyUsedGirlData = (state: state, getUsedGirlDataFunc) => {
//     return setGirlState(state, {
//         ...getGirlState(state),
//         usedGirlDataMap: getGirlState(state).usedGirlDataMap.map((data, usedGirl_) => {
//             if (usedGirl_ == usedGirlEnum.PlayerGirl) {
//                 return data
//             }

//             return getUsedGirlDataFunc(state, data, usedGirl_)
//         })
//     })
// }

export let getGirlByUsedGirl = (state: state, usedGirl) => {
    return NullableUtils.getExn(getUsedGirlData(state, usedGirl).girlGroup)
}

export let getGirl = (state: state, usedGirl) => {
    return getGirlByUsedGirl(state, usedGirl)
}

export let hasGirlByUsedGirl = (state: state, usedGirl) => {
    return !NullableUtils.isNullable(getUsedGirlData(state, usedGirl).girlGroup)
}

export let hasGirl = (state: state, usedGirl) => {
    return hasGirlByUsedGirl(state, usedGirl)
}

export let hasGirlValue = (state: state, usedGirl) => {
    return getConfigData(state).girlValueMap.has(usedGirl)
}

// export let hasCurrentGirlValue = (state: state) => {
//     return getConfigData(state).girlValueMap.has(getGirlState(state).currentUsedGirl)
// }


export let getGirlMeshByUsedGirl = (state: state, usedGirl_) => {
    return NullableUtils.getExn(getUsedGirlData(state, usedGirl_).girlMesh)
    // return NullableUtils.getWithDefault(getUsedGirlData(state, usedGirl).girlMeshMap.get(usedGirl_),
    //     getUsedGirlData(state, usedGirl).girlMeshMap.get(usedGirlEnum.PlayerGirl)
    // )
}

export let getGirlMesh = getGirlMeshByUsedGirl

// export let getGirlMMDAnimation = (state: state, usedGirl) => {
//     return NullableUtils.getExn(getUsedGirlData(state, usedGirl).girlMMDAnimation)
// }

export let hasGirlMesh = (state: state, usedGirl) => {
    return isUseGirl(state, usedGirl) && !NullableUtils.isNullable(getUsedGirlData(state, usedGirl).girlMesh)
}

export let getValueByUsedGirl = (state: state, usedGirl) => {
    // return updateGirlValueByAutoDifficulty(state, NullableUtils.getExn(getConfigData(state).girlValueMap.get(usedGirl)), usedGirl)
    return NullableUtils.getExn(getConfigData(state).girlValueMap.get(usedGirl))
}

export let getValue = (state: state, usedGirl) => {
    return getValueByUsedGirl(state, usedGirl)
}

export let getStatusUpdateLoops = () => 100

export let getSkillData = (state: state, usedGirl, name: actionName) => {
    return NullableUtils.getExn(getValue(state, usedGirl).allSkillData.find(data => data.name == name))
}

let _getDefaultAnimationName = () => animationName.Idle

export let createUsedGirlData = (usedGirl): usedGirlData => {
    return {
        giantessStressingRate: 1,
        upgradeFuncs: ArrayUtils.create(),

        stateMachine: StateMachine.create(buildNameByUsedGirl(usedGirl), createInitialState()),


        currentMMDCharacter: mmdCharacterType.None,
        // currentMMDCharacter: mmdCharacter.Miku,
        // currentMMDCharacter: mmdCharacter.Haku_QP,
        // currentMMDCharacter: mmdCharacter.Luoli1,
        // currentMMDCharacter: mmdCharacter.Haku_Lady,
        // currentMMDCharacter: mmdCharacter.Baixi_Maid,
        // currentMMDCharacter: mmdCharacter.Luka,
        // currentMMDCharacter: mmdCharacter.Meiko,
        usedMMDData: NullableUtils.getEmpty(),

        // currentMMDCharacter: mmdCharacter.XiaHui,
        // currentMMDCharacter: mmdCharacter.Xiaye1,
        // currentMMDCharacter: mmdCharacter.Xiaye2,
        // currentMMDCharacter: mmdCharacter.Nero,
        // currentMMDCharacter: mmdCharacter.Changee,
        ////currentMMDCharacter: mmdCharacter.Luotianyi,
        // currentMMDCharacter: mmdCharacter.Miku1,
        // currentMMDCharacter: mmdCharacter.Vanilla,
        // currentMMDCharacter: mmdCharacter.Meibiwusi,
        // currentMMDCharacter: mmdCharacter.Moye,

        currentPose: pose.Stand,

        currentHeight: 0,

        currentAnimationName: _getDefaultAnimationName(),
        nextBlendingAnimationName: NullableUtils.getEmpty(),
        previousAnimationName: NullableUtils.getEmpty(),
        isCurrentAnimationOnlyPlayOnce: false,
        noBlend: false,

        tweens: ArrayUtils.create(),

        customDuration: NullableUtils.getEmpty(),
        durationFactor: 1,


        // capsule: Capsule.create(),
        // capsuleMesh: NullableUtils.getEmpty(),
        box: new Box3(),

        girlMesh: NullableUtils.getEmpty(),
        // girlMMDAnimation: [],
        girlGroup: NullableUtils.getEmpty(),


        originScale: 1,
        initialPosition: NullableUtils.getEmpty(),
        initialQuaternion: NullableUtils.getEmpty(),


        // rotationYForThirdPersonControl: 0,
        // // lastRotationYForThirdPersonControl: NullableUtils.getEmpty(),
        // lastRotationYForThirdPersonControl: NullableUtils.return_(0),
        // quaternionForThirdPersonControl: new Quaternion(0, 0, 0, 1),


        collisionShapeMap: Map(),
        getCenterFunc: NullableUtils.getEmpty(),


        isComputeCollisionMap: Map(),
        isComputeDamageMap: Map(),
        lastFrameIndexMap: Map(),

        screenShake: new ScreenShake.ScreenShake(),

        excitement: 0,
        lastAddExcitementTime: NullableUtils.getEmpty(),

        // lastDamageTime: 0,
        lastDamageTime: performance.now(),

        lastMoveCollisionedTime: 0,

        hpMap: Map(),

        // isStatusChange: true,
        needUpdateStatusDamagePart: NullableUtils.getEmpty(),
        needUpdateStatusName: NullableUtils.getEmpty(),
        // isNeedUpdateStatus: false,


        triggeredAction: NullableUtils.getEmpty(),
        actionState: actionState.Initial,

        // lastChangePoseTime: NullableUtils.getEmpty(),


        // scaleState: scaleState.Normal,
        lastScaleChangeTime: 0,

        isChangeScaling: false,


        boneCacheMap: Map(),

        giantessAddToHandSkeletonData: List(),
        positionOffsetForPick: Map(),

        giantessAddToUBSkeletonData: List(),
        positionOffsetForUBControlled: Map(),

        giantessAddToBreastSkeletonData: List(),
        positionOffsetForPutToBreast: Map(),

        giantessAddToShoeSkeletonData: List(),
        positionOffsetForPutToShoe: Map(),

        isMoveCollisioned: false,
        isAllowMoveCollision: true,
        isRotationLock: false,
        isOnlyDamageLittleMan: false,

        girlGroupPositionDiffForChangePivot: NullableUtils.getEmpty(),


        // isUseNonPlayerGoddess: false,

        lastStressingTime: 0,

        breastPartialScaleMaxFactor: 0,
        torsorPartialScaleMaxFactor: 0,


        isLightStressingMap: MutableMapUtils.create() as any,
        movableRanges: ArrayUtils.create(),

        biggerCount: 0,
        addScaleByBiggerCount: MutableMapUtils.create(),



        computeBoxFunc: computeGirlBoxDefault,
        // createFSMStateByCurrentAnimationNameFunc: createFSMStateByCurrentAnimationNameDefault,
        createFSMStateByChangeAnimationNameFunc: createFSMStateByChangeAnimationNameDefault,
        computeForceDirectionFunc: computeForceDirectionDefault,
        computeDamageTypeFunc: computeDamageTypeDefault,
    }
}

export let createState = (): girl => {
    let usedGirlDataMap = MutableMapUtils.create()

    return {
        usedGirlDataMap: usedGirlDataMap as any,

        // currentUsedGirl: usedGirlEnum.None,
        currentUsedGirls: ArrayUtils.create(),



        playerGirlData: PlayerGirl.createData(),
        wildGiantessData: WildGiantess.createData(),
        enemyGiantessData: EnemyGiantess.createData(),
        playerGiantessData: PlayerGoddess.createData(),

        // isFirstAdd: MutableMapUtils.create(),

        // isCanActiveSmallerFunc: state => PlayerGirl.getBiggerWay(state) != biggerWay.Passive
        isCanActiveSmallerFunc: NullableUtils.getEmpty(),
        addHitEffectFunc: NullableUtils.getEmpty(),
    }
}

// export let getCapsuleConfig = (scale) => {
//     let capsuleRadius = 0.2 * scale
//     let capsuleLengthBetweenStartAndEnd = 1.6 * scale

//     return { capsuleRadius, capsuleLengthBetweenStartAndEnd }
// }

// let _setCapsuleScale = (state: state) => {
//     let scale = getScale(state, usedGirl)
//     let { capsule } = getUsedGirlData(state, usedGirl)

//     let { capsuleRadius, capsuleLengthBetweenStartAndEnd } = getCapsuleConfig(scale)

//     capsule.set(
//         _v1.set(capsule.start.x, capsuleRadius, capsule.start.z),
//         _v2.set(capsule.end.x, capsuleRadius + capsuleLengthBetweenStartAndEnd, capsule.end.z),
//         capsuleRadius
//     )


//     return state
// }

export let disablePhysics = (state: state, usedGirl) => {
    let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)
    helper.enabled.physics = false

    return state
}

export let enablePhysics = (state: state, usedGirl) => {
    let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)
    helper.enabled.physics = true
    // MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).isDisablePhysicsTranslation = false

    return state
}

export let restorePhysics = (state: state, usedGirl) => {
    let helper = MMD.getMMDAnimationHelperByUsedGirl(getAbstractState(state), usedGirl)
    helper.enabled.physics = isEnablePhysics(state, usedGirl)

    return state
}

export let setIsUpdatePhysics = (state: state, usedGirl, isUpdate: boolean) => {
    let helper = MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl)
    helper.isUpdatePhysics = isUpdate

    return state
}


export let limitScale = (state: state, usedGirl, scale) => {
    return NumberUtils.clamp(scale, getValue(state, usedGirl).minScale, getMaxScaleUtils(state, getValue(state, usedGirl)))
}

export let setGirlScale = (state: state, usedGirl, scale) => {
    scale = limitScale(state, usedGirl, scale)

    // console.log(scale)

    // let girl = getGirl(state, usedGirl)
    let girlMesh = getGirlMesh(state, usedGirl)

    let { originScale } = getUsedGirlData(state, usedGirl)

    // let scaleIncrease = scale / getScale(state, usedGirl)

    // scale = Math.round(scale)

    let scaleFactor = NumberUtils.fixFloatError(originScale * scale)

    girlMesh.scale.set(scaleFactor, scaleFactor, scaleFactor)

    // let girl = getGirl(state, usedGirl)
    // girl.updateWorldMatrix(true, true)
    // girlMesh.updateWorldMatrix(true, true)

    state = updateCrawlPosePivot(state, usedGirl)

    // state = _setCapsuleScale(state)

    // if (getIsDebug(state)) {
    //     let capsuleMesh = NullableUtils.getExn(getUsedGirlData(state, usedGirl).capsuleMesh)

    //     capsuleMesh.scale.set(scale, scale, scale)
    // }


    return state
}

/*! for solve mesh flicker problem: bigger at a short time->then be setted scale
* 
*/
export let setGirlScaleByDeferTimeout0 = (scale: number, usedGirl) => {
    setTimeout(() => {
        let state = readState()

        state = setGirlScale(state, usedGirl, scale)

        writeState(state)
    }, 0)
}

export let changeToInitialScale = (state: state, usedGirl) => {
    return setGirlScale(state, usedGirl, getValue(state, usedGirl).initialScale)
}

export let changeToSmallestActiveBigger = (state: state, usedGirl, computeIncreaseScaleFunc) => {
    if (getBiggerCount(state, usedGirl) <= 0) {
        return state
    }

    state = ArrayUtils.range(1, getBiggerCount(state, usedGirl)).reduce((state, biggerCount) => {
        return setGirlScale(state, usedGirl,
            NumberUtils.greaterThan(getScale(state, usedGirl) - getAddScaleByBiggerCount(state, usedGirl, biggerCount), getValue(state, usedGirl).minScale)
        )
    }, state)

    state = setBiggerCount(state, usedGirl, 0)
    state = clearAddScaleByBiggerCount(state, usedGirl)

    return state
}


export let setGirlScaleAndKeepCamera = (state: state, usedGirl, scale) => {
    if (isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
        state = updateDistanceRateOnlyOnceInOneFrame(state)
    }

    state = setGirlScale(state, usedGirl, scale)

    return computeGirlBoxAndNotChangeCenterXY(state, usedGirl)
}

export let activateAllActions = (state: state, usedGirl) => {
    // requireCheck(() => {
    //     test("first animation name should be Idle", () => {
    //         return getConfigData(state).girlAllAnimationNames[0] == animationName.Idle
    //     })
    // }, getIsDebug(state))

    let abstractState = SkinBlendAnimation.activateAllActions(getAbstractState(state), getGirlMesh(state, usedGirl),
        MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl),
        getConfigData(state).girlAllAnimationNames
    )

    return setAbstractState(state, abstractState)
}

export let showGirlAndActiveAllActions = (state: state, usedGirl) => {
    // requireCheck(() => {
    //     test("state should be Idle", () => {
    //         return StateMachine.isState(getStateMachine(state), objectStateName.Initial)
    //     })
    // }, getIsDebug(state))

    // if (getIsDebug(state)) {
    //     let capsuleMesh = getUsedGirlData(state, usedGirl).capsuleMesh
    //     // capsuleMesh.visible = true
    // }



    // setTimeout(() => {
    //     girl.visible = true
    // }, deferLoopCount)
    // Layer.setAllToVisibleLayer(girl)

    // state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
    //     girl.visible = true

    //     // return Promise.resolve(setAbstractState(state, SkinAnimation.playSkinAnimation(getAbstractState(state), getUsedGirlData(state, usedGirl).currentAnimationName, getName(), true)))


    //     return Promise.resolve(setAbstractState(state, SkinBlendAnimation.activateAllActions(getAbstractState(state), girl,
    //         MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl),
    //         getAllAnimationNames()
    //     )))
    // }, deferLoopCount))

    state = markGirlVisible(state, usedGirl)

    // let abstractState = SkinBlendAnimation.activateAllActions(getAbstractState(state), getGirlMesh(state, usedGirl),
    //     MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl),
    //     getConfigData(state).girlAllAnimationNames
    // )

    // // abstractState = SkinAnimation.playSkinAnimation(abstractState, animationName.Idle, getName(), true)
    // // SkinBlendAnimation.play(getGirlMesh(state, usedGirl), MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl), animationName.Idle, true)
    // // abstractState = SkinBlendAnimation.play(abstractState, getGirlMesh(state, usedGirl), MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl), animationName.Idle, true)

    // state = setAbstractState(state, abstractState)
    state = activateAllActions(state, usedGirl)


    // state = setUsedGirlData(state, usedGirl,{
    //     ...getUsedGirlData(state, usedGirl),
    //     currentAnimationName: _getDefaultAnimationName()
    // })
    // return StateMachine.execute(state, getStateMachine(state), null)

    return state
}

export let hideGirl = (state: state, usedGirl) => {
    state = markGirlNotVisible(state, usedGirl)

    return state
}


// export let immediatelyShowGirl = (state: state) => {
//     return showGirlAndActiveAllActions(state, 0)
// }

// export let parseAndAddResources = (state: state) => {
//     if (getIsDebug(state)) {
//         let { capsuleRadius, capsuleLengthBetweenStartAndEnd } = getCapsuleConfig(1)

//         let capsuleMesh = Capsule.createCapsuleMesh({
//             radius: capsuleRadius,
//             length: capsuleLengthBetweenStartAndEnd
//         }, "red")

//         // scene.add(capsuleMesh)

//         state = setUsedGirlData(state, usedGirl,{
//             ...getUsedGirlData(state, usedGirl),
//             capsuleMesh: NullableUtils.return_(capsuleMesh)
//         })
//     }

//     return Promise.resolve(state)
// }

// export let initAtVeryBegin = (state: state) => {
//     // return [
//     //     usedGirlEnum.WildGiantess,
//     //     usedGirlEnum.EnemyGiantess,
//     //     usedGirlEnum.PlayerGoddess,
//     //     usedGirlEnum.PlayerGirl,
//     //     usedGirlEnum.BossGiantess,
//     //     ...getUsedGirl(state)
//     // ].reduce((state, usedGirl) => {
//     //     return setUsedGirlData(state, usedGirl,createUsedGirlData(), usedGirl)
//     // }, state)
//     return state

// }

export let initWhenImportScene = state => InitWhenImportScene.initWhenImportScene(state, getAllUsedMMDData(state))

export let update = (state: state, usedGirl) => {
    let promise

    switch (usedGirl) {
        case usedGirlEnum.PlayerGirl:
            promise = PlayerGirl.update(state, usedGirl)
            break
        case usedGirlEnum.WildGiantess:
            promise = WildGiantess.update(state, usedGirl)
            break
        case usedGirlEnum.EnemyGiantess:
            promise = EnemyGiantess.update(state, usedGirl)
            break
        case usedGirlEnum.PlayerGoddess:
            promise = PlayerGoddess.update(state, usedGirl)
            break
        default:
            if (isLevelGiantessMod(state, usedGirl)) {
                promise = updateMod(state, usedGirl)
            }
            else {
                promise = Promise.resolve(state)
            }
            break
    }

    return promise.then(state => updateExcitement(state, usedGirl))
}

export let getCenter = (state: state, usedGirl) => {
    // let { capsule } = getUsedGirlData(state, usedGirl)

    // return capsule.start.clone().add(_v1.set(0, (capsule.end.y - capsule.start.y) / 2, 0))

    return getGirlBox(state, usedGirl).getCenter(new Vector3())
}

export let getCenterInFloor = (state: state, usedGirl) => {
    return getCenter(state, usedGirl).setY(0)
}

export let getCurrentMMDCharacterName = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).currentMMDCharacter
}

export let setCurrentMMDCharacter = (state: state, usedGirl, mmdCharacter: mmdCharacter) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        currentMMDCharacter: mmdCharacter,
    })
}

export let getCurrentMMDCharacterNameByUsedGirl = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).currentMMDCharacter
}

export let setCurrentMMDCharacterByUsedGirl = (state: state, mmdCharacter: mmdCharacter, usedGirl: usedGirl) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        currentMMDCharacter: mmdCharacter,
    })
}


// export let hasCurrentMMDCharacter = (state: state) => {
//     return usedGirl != usedGirlEnum.None && getUsedGirlData(state, usedGirl).currentMMDCharacter !== mmdCharacter.None
// }

export let hasCurrentMMDCharacterByUsedGirl = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).currentMMDCharacter !== mmdCharacterType.None
}

export let isMMDCharacterExist = (state: state, mmdCharacterName) => {
    return getCurrentUsedGirls(state).reduce((isExist, usedGirl) => {
        if (isExist) {
            return isExist
        }

        if (getCurrentMMDCharacterNameByUsedGirl(state, usedGirl) == mmdCharacterName) {
            return true
        }

        return isExist
    }, false)
}

export let isCollisionWithGirl = (box, state, usedGirl) => {
    if (!isUseGirl(state, usedGirl)) {
        return false
    }

    // let capsuleBox = getCapsuleBox(state)

    // return capsuleBox.intersectsBox(box) && getUsedGirlData(state, usedGirl).capsule.intersectsBox(box)

    return getGirlBox(state, usedGirl).intersectsBox(box)
}

// let _isActionValid = (state: state, name: animationName) => {
//     switch (name) {
//         case animationName.Pickdown:
//             return PickPose.isPickdownValid(state)
//         default:
//             return true
//     }
// }

export let isActionTriggering = (state: state, usedGirl, name: actionName) => {
    switch (name) {
        case actionName.Run:
            return isActionState(state, usedGirl, actionState.Run)
        default:
            return isTriggerAction(state, usedGirl, name)
    }
}

export let isBelongToCurrentPoseAndScaleState = (state: state, usedGirl, name: actionName) => {
    return ArrayUtils.flatten(getConfigOperateRenderData(state).poseData.filter(value => {
        return value.pose == getCurrentPose(state, usedGirl)
        // && value.scaleState == getScaleState(state)
    }).map(v => {
        return v.names
    })).includes(name)
}


export let isDamageAction = (state: state, name: actionName) => {
    return [
        actionName.HeavyStressing,
        actionName.HeavyStressingBreast,
        actionName.HeavyStressingTrigoneAndButt,
        actionName.Death,

        actionName.CrawlHeavyStressing,
        actionName.CrawlHeavyStressingBreast,
        actionName.CrawlHeavyStressingTrigoneAndButt,
        actionName.CrawlDeath,

        getHeavyStressingBlockService(state).getActionName(),
        getHeavyStressingBreastBlockService(state).getActionName(),
        getHeavyStressingTrigoneAndButtBlockService(state).getActionName(),

        getSitDeathBlockService(state).getActionName(),

        getUBHeavyStressingBlockService(state).getActionName(),
    ].includes(name as any)
}

export let isSmallerAction = (name: actionName) => {
    return [
        // actionName.Bigger,
        actionName.SmallerToLastBiggerCount,
    ].includes(name as any)
}

export let getTriggerAction = <actionName>(state, usedGirl): actionName => {
    return getUsedGirlData(state, usedGirl).triggeredAction as actionName
}

export let setTriggerAction = (state, usedGirl, triggeredAction) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        triggeredAction: NullableUtils.return_(triggeredAction)
    })
}

export let getActiveBiggerIncreaseScale = (state: state, usedGirl) => {
    return getValue(state, usedGirl).scaleIncrease * 1
}

// export let triggerAction = (state, name: actionName, isJudgeRun = false, isSubExcitement = true): Promise<[state, result]> => {
export let triggerAction = (state, usedGirl, name: actionName): Promise<[state, result]> => {
    if (isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
        return PlayerGirl.triggerAction(state, usedGirl, name)
    }
    else if (isWildGiantess(state, usedGirl)) {
        return WildGiantess.triggerAction(state, usedGirl, name)
    }
    else if (isEnemyGiantess(state, usedGirl,)) {
        return EnemyGiantess.triggerAction(state, usedGirl, name)
    }
    else if (isPlayerGoddess(state, usedGirl)) {
        return PlayerGoddess.triggerAction(state, usedGirl, name)
    }
    else if (isLevelGiantessMod(state, usedGirl)) {
        return triggerActionMod(state, usedGirl, name)
    }
    else if (isBossGiantess(state, usedGirl)) {
        return BossGiantess.triggerAction(state, usedGirl, name)
    }

    throw new Error("err")
}

export let isTriggerAction = (state, usedGirl, name) => {
    if (!isUseGirl(state, usedGirl)) {
        return false
    }

    return NullableUtils.getWithDefault(
        NullableUtils.map(
            triggeredAction => {
                return triggeredAction == name
            },
            getUsedGirlData(state, usedGirl).triggeredAction
        ),
        false
    )
}

export let resetIsTriggerAction = (state, usedGirl) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        triggeredAction: NullableUtils.getEmpty()
    })
}


// export let removeAction = (state, name) => {
//     Console.log("remove: ",name)
//     return setUsedGirlData(state, usedGirl,{
//         ...getUsedGirlData(state, usedGirl),
//         isTriggerActionMap: getUsedGirlData(state, usedGirl).isTriggerActionMap.remove(name)
//     })
// }

export let getActionState = (state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).actionState
}

export let isActionState = (state, usedGirl, actionState) => {
    return getActionState(state, usedGirl) == actionState
}

export let setActionState = (state, usedGirl, actionState) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        actionState: actionState
    })
}

export let resetAction = (state: state, usedGirl) => {
    state = setActionState(state, usedGirl, actionState.Initial)
    state = resetIsTriggerAction(state, usedGirl)

    return state
}


// export let getScaleState = (state) => {
// return getUsedGirlData(state, usedGirl).scaleState
// }

// export let isScaleState = (state, scaleState) => {
//     return getScaleState(state) == scaleState
// }

export let setLastScaleChangeTime = (state, usedGirl) => {
    // if (isScaleState(state, scaleState)) {
    //     return state
    // }

    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        // scaleState: scaleState,
        lastScaleChangeTime: getNow(state)
    })
}

export let setInitialTransform = (state: state, usedGirl, position, quaternion) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        initialPosition: NullableUtils.return_(position),
        initialQuaternion: NullableUtils.return_(quaternion)
    })
}

let _createUsedGirlDataForDispose = (state: state, usedGirl) => {
    return {
        ...createUsedGirlData(usedGirl),

        currentMMDCharacter: getUsedGirlData(state, usedGirl).currentMMDCharacter
    }
}

export let dispose = (state: state) => {
    state = MutableMapUtils.reduce(getGirlState(state).usedGirlDataMap, (state, usedGirlData, usedGirl) => {
        if (hasGirlByUsedGirl(state, usedGirl)) {
            let girl = getGirlByUsedGirl(state, usedGirl)

            return setAbstractState(state, SkinAnimation.disposeSkinAnimation(getAbstractState(state), girl, buildNameByUsedGirl(usedGirl)))
        }

        return state
    }, state)


    state = offAllEvents(state)


    state = disposeAllLoadedMMDResources(state)



    // state = setUsedGirlData(state, usedGirl,{
    //     ...getUsedGirlData(state, usedGirl),
    //     stateMachine: StateMachine.create(getName(), createInitialState()),
    //     currentAnimationName: _getDefaultAnimationName(),
    //     nextBlendingAnimationName: NullableUtils.getEmpty(),
    //     collisionShapeMap: Map(),
    //     isComputeCollisionMap: Map(),
    //     screenShake: new ScreenShake.ScreenShake(),
    //     excitement: 0,
    //     lastUpdatedExcitement: 0,

    //     noBlend: false,

    //     isCurrentAnimationOnlyPlayOnce: false,

    //     currentPose: pose.Stand,
    //     currentHeight: 0,


    //     girlMesh: null,
    //     girlGroup: new Object3D(),



    //     lastDamageTime: 0,

    //     lastMoveCollisionedTime: 0,


    //     isComputeDamageMap: Map(),

    //     isResetActionCollision: false,

    //     hp: 0,

    //     isStatusChange: true,

    //     triggeredAction: NullableUtils.getEmpty(),
    //     actionState: actionState.Initial,


    //     scaleState: scaleState.Normal,

    //     isChangeScaling: false,

    //     boneCacheMap: Map(),

    //     isMoveCollisioned: false,
    //     isRotationLock: false,
    // })


    state = setGirlState(state, {
        ...getGirlState(state),

        playerGirlData: PlayerGirl.dispose(state),
        wildGiantessData: WildGiantess.dispose(state),
        enemyGiantessData: EnemyGiantess.dispose(state),
        playerGiantessData: PlayerGoddess.dispose(state),

        // isFirstAdd: MutableMapUtils.create(),

        isCanActiveSmallerFunc: NullableUtils.getEmpty(),
        addHitEffectFunc: NullableUtils.getEmpty(),
    })


    // state = setCurrentUsedGirl(state, usedGirlEnum.None)
    state = setCurrentUsedGirls(state, [])

    // if (isEnteringNextLevel(state)) {
    //     state = _setAllEnemyUsedGirlData(state, (state, usedGirlData, usedGirl) => {
    //         return _createUsedGirlDataForDispose(state, usedGirl)
    //     })
    // }
    // else {
    //     state = setAllUsedGirlData(state, (state, usedGirlData, usedGirl) => {
    //         return _createUsedGirlDataForDispose(state, usedGirl)
    //     })
    // }

    state = setAllUsedGirlData(state, (state, usedGirlData, usedGirl) => {
        return _createUsedGirlDataForDispose(state, usedGirl)
    })


    return Promise.resolve(state)
}

export let getInitialEulerForTweenToFaceNegativeX = () => {
    return new Euler(0, -Math.PI / 2, 0)
    // return new Euler(0, 0, 0)
}

export let getDefenseData = (state, usedGirl, name, damagePart): [defenseFactor, armorType, armorRatio, armorStrength] => {
    let data
    if (getHp(state, usedGirl, damagePart) <= 0) {
        // factor = 0.3
        data = NullableUtils.getExn(getHpData(state, usedGirl).find(d => d.damagePart == getBody()))
    }
    else {
        // factor = 1
        data = NullableUtils.getExn(getHpData(state, usedGirl).find(d => d.damagePart == damagePart))
    }

    // console.warn(factor);


    return [getValue(state, usedGirl).defenseFactor, data.armorType, data.armorRatio * getValue(state, usedGirl).armorRatio, data.armorStrength * getValue(state, usedGirl).armorStrength]
}

export let getFullHpByUsedGirl = (state: state, usedGirl) => {
    return getValueByUsedGirl(state, usedGirl).hp
}

export let getFullHp = (state: state, usedGirl) => {
    return getFullHpByUsedGirl(state, usedGirl)
}

export let getFullHpByDamagePart = (state: state, usedGirl, damagePart: damagePart) => {
    // return NullableUtils.getExn(getHpData(state, usedGirl).find(d => {
    //     return d.damagePart == damagePart
    // })).hp


    if (damagePart == getBody()) {
        return getFullHpByUsedGirl(state, usedGirl)
    }

    return NullableUtils.getWithDefault(getHpData(state, usedGirl).find(d => {
        return d.damagePart == damagePart
    }), { hp: 10000 } as any).hp
}

export let getHpByUsedGirl = (state, usedGirl, damagePart) => {
    // return NullableUtils.getExn(getUsedGirlData(state, usedGirl).hpMap.get(damagePart))
    return NullableUtils.getWithDefault(getUsedGirlData(state, usedGirl).hpMap.get(damagePart), 10000)
}

export let getHp = (state, usedGirl, damagePart) => {
    return getHpByUsedGirl(state, usedGirl, damagePart)
}

export let getBodyHp = (state, usedGirl) => {
    return getHpByUsedGirl(state, usedGirl, getBody())
}

export let setHpByUsedGirl = (state, usedGirl, damagePart, hp) => {
    // console.log("set Hp: ", damagePart, hp, usedGirl)

    hp = Math.round(hp)

    let isStatusChange = getUsedGirlData(state, usedGirl).hpMap.has(damagePart) ? getHpByUsedGirl(state, usedGirl, damagePart) != hp : true

    state = setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        hpMap: getUsedGirlData(state, usedGirl).hpMap.set(damagePart, hp),
        // needUpdateStatus: isStatusChange ? NullableUtils.return_({
        //     damagePart
        // }) : getUsedGirlData(state, usedGirl).needUpdateStatus
    })


    if (isStatusChange) {
        // if (!isPlayerGirlByUsedGirl(usedGirl)) {
        //     state = setCurrentUsedGirl(state, usedGirl)
        // }

        state = setNeedUpdateStatusDamagePart(state, usedGirl, damagePart)

        // state = setIsNeedUpdateStatus(state, usedGirl, true)
    }

    return state
}

export let setHp = (state, usedGirl, damagePart, hp) => {
    return setHpByUsedGirl(state, usedGirl, damagePart, hp)
}

export let setFullHp = (state, usedGirl, hp) => {
    return setHpByUsedGirl(state, usedGirl, getBody(), hp)
}


// export let getIsNeedUpdateStatus = (state, usedGirl) => {
//     return getUsedGirlData(state, usedGirl).isNeedUpdateStatus
// }

// export let setIsNeedUpdateStatus = (state, usedGirl, value) => {
//     return setUsedGirlData(state, usedGirl, {
//         ...getUsedGirlData(state, usedGirl),
//         isNeedUpdateStatus: value
//     })
// }

export let getNeedUpdateStatusName = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).needUpdateStatusName
}

export let getNeedUpdateStatusDamagePart = (state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).needUpdateStatusDamagePart
}

export let setNeedUpdateStatusDamagePart = (state, usedGirl, value) => {
    // state = setCurrentUsedGirl(state, usedGirl)

    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        needUpdateStatusDamagePart: NullableUtils.return_(value)
    })
}

export let setNeedUpdateStatusName = (state, usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        needUpdateStatusName: NullableUtils.return_(value)
    })
}

export let clearNeedUpdateStatusDamagePart = (state, usedGirl) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        needUpdateStatusDamagePart: NullableUtils.getEmpty(),
    })
}

export let clearNeedUpdateStatus = (state, usedGirl) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        needUpdateStatusDamagePart: NullableUtils.getEmpty(),
        needUpdateStatusName: NullableUtils.getEmpty(),
        // isNeedUpdateStatus: false
    })
}

export let addHp = (state, usedGirl, damageType, value) => {
    return setHp(state, usedGirl, damageType, NumberUtils.clamp(getHp(state, usedGirl, damageType) + value, 0, getFullHp(state, usedGirl)))
}

export let getExcitement = (state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).excitement
}

export let getFullExcitement = (state, usedGirl, name) => {
    return getValue(state, usedGirl).maxExcitement
}


// let _updateHp = (state, name, hp) => {
//     return setUsedGirlData(state, usedGirl,{
//         ...getUsedGirlData(state, usedGirl),
//         hp
//     })
// }

// let _getStateMachine = (state: state, name: string) => {
//     return getStateMachine(state)
// }

// let _setStateMachine = (state: state, name: string, stateMachine) => {
//     return setStateMachine(state, stateMachine)
// }

export let getLabelTime = (damage) => {
    return damage <= 0 ? 20 : 100
}

export let updateDamageType = (damageType_, collisionPart_) => {
    if (damageType_ == damageType.Range) {
        return damageType_
    }

    switch (collisionPart_) {
        case collisionPart.Head:
        case collisionPart.Torso:
            return damageType.Heavy
        case collisionPart.LeftBreast:
        case collisionPart.RightBreast:
        case collisionPart.TrigoneAndButt:
            return damageType.Weakness
        default:
            // return damageType_
            return damageType.Normal
    }
}

export let computeForce = (state: state, usedGirl, force: number, collisionPart_: collisionPart) => {
    let factor, weaknessFactor
    // switch (collisionPart_) {
    //     case collisionPart.Head:
    //         factor = 4
    //         break
    //     case collisionPart.LeftBreast:
    //     case collisionPart.RightBreast:
    //         // factor = 0.5
    //         factor = 2
    //         break
    //     case collisionPart.TrigoneAndButt:
    //         factor = 2.5
    //         break
    //     case collisionPart.LeftHand:
    //     case collisionPart.RightHand:
    //     case collisionPart.LeftFoot:
    //     case collisionPart.RightFoot:
    //         factor = 0.6
    //         break
    //     // case collisionPart.LeftLowerArm:
    //     // case collisionPart.RightLowerArm:
    //     // case collisionPart.LeftUpperArm:
    //     // case collisionPart.RightUpperArm:
    //     //     factor = 0.6
    //     //     break
    //     // case collisionPart.LeftShank:
    //     // case collisionPart.RightShank:
    //     // case collisionPart.LeftThigh:
    //     // case collisionPart.RightThigh:
    //     //     factor = 0.7
    //     //     break
    //     case collisionPart.Torso:
    //         factor = 1.5
    //         break
    //     default:
    //         factor = 0.8
    //         // factor = 1
    //         break
    // }


    if (isSmallGiantess(state, usedGirl) || getAutoDifficulty(state) <= autoDifficulty.VeryEasy) {
        weaknessFactor = 0.25
    }
    else if (isMiddleGiantess(state, usedGirl) || getAutoDifficulty(state) <= autoDifficulty.Easy) {
        weaknessFactor = 0.5
    }
    else {
        weaknessFactor = 1
    }

    switch (collisionPart_) {
        case collisionPart.Head:
            // factor = 5
            factor = 4 * weaknessFactor
            break
        case collisionPart.LeftBreast:
        case collisionPart.RightBreast:
            // factor = 0.5
            factor = 3 * weaknessFactor
            break
        case collisionPart.TrigoneAndButt:
            // factor = 3.5
            factor = 4 * weaknessFactor
            break
        case collisionPart.LeftHand:
        case collisionPart.RightHand:
        case collisionPart.LeftFoot:
        case collisionPart.RightFoot:
            factor = 0.4
            break
        // case collisionPart.LeftLowerArm:
        // case collisionPart.RightLowerArm:
        // case collisionPart.LeftUpperArm:
        // case collisionPart.RightUpperArm:
        //     factor = 0.6
        //     break
        // case collisionPart.LeftShank:
        // case collisionPart.RightShank:
        // case collisionPart.LeftThigh:
        // case collisionPart.RightThigh:
        //     factor = 0.7
        //     break
        case collisionPart.Torso:
            factor = 1.5
            break
        default:
            factor = 0.6
            // factor = 1
            break
    }

    return force * factor
}

// let _getDamagePositionForLabel = (state: state, damagePosition, height) => {
//     switch (getCameraType(state)) {
//         case cameraType.FirstPerson:
//             return ScreenUtils.convertScreenCoordniateToWorldCoordniate(
//                 _v1_1.set(
//                     getWidth() / 2,
//                     getHeight() / 2 * 0.5
//                 ),
//                 Camera.getCurrentCamera(getAbstractState(state)),
//                 false
//             )
//         case cameraType.ThirdPerson:
//         // if (isLittleCharacterType(state)) {
//         //     return new Vector3(damagePosition.x, damagePosition.y + 2, damagePosition.z)
//         // }

//         // return new Vector3(damagePosition.x, damagePosition.y + height / 10, damagePosition.z)
//         case cameraType.No:
//             return new Vector3(damagePosition.x, damagePosition.y + 2, damagePosition.z)
//         default:
//             throw new Error("err")
//     }

// }

let _addExcitement = (state, usedGirl, damageType_, damage, weaponValue: weaponValue) => {
    if (damageType_ != damageType.Weakness) {
        return state
    }

    return addExcitementDirectly(state, usedGirl,
        //  0.2
        0.3
        // * NumberUtils.lessThan(damage / forceSize.VeryHigh, 8) * NumberUtils.greaterThan(weaponValue.armorPiercingForceRatio / armorPiercingForceRatio.Middle, 0.5) * (weaponValue.type / weaponType.Middle)
        // * NumberUtils.lessThan(damage / forceSize.VeryHigh, 8) * NumberUtils.greaterThan(weaponValue.armorPiercingForceRatio / armorPiercingForceRatio.Middle, 0.5)
        // * getForceFactor(getBodyHp(state, usedGirl), damage, 0.1, 5)
        // * getForceFactor(getBodyHp(state, usedGirl), damage, 0.35, 5)

        * NumberUtils.lessThan(damage / forceSize.VeryHigh2, 4)

        * NumberUtils.greaterThan(weaponValue.armorPiercingForceRatio / armorPiercingForceRatio.Middle, 0.5)
        * computeExcitementFactor(weaponValue.type)
    )
}

export let damageUtils = (state: state, [
    getDamagePartDataFunc,
    updateDamageTypeFunc,
    computeForceFunc,
    getDamagePositionForLabelFunc,
    handleRemainHpFunc, createStressingStateFunc], usedGirl, [force, damageType, weaponType_], fromName, collisionPart_: collisionPart, damagePosition: nullable<Vector3>,
    weaponValue_,
    // value: girlValue
    // critRatioFactor,
    // attackFactor,
) => {
    let name = buildNameByUsedGirl(usedGirl)

    // if (state.config.isNotDamage) {
    if (state.config.isNotDamage || getIsNotDamage(state, name)) {
        return Promise.resolve(state)
    }


    let stateMachine = getStateMachine(state, usedGirl)

    if (isDestoryRelatedStates(stateMachine)) {
        return Promise.resolve(state)
    }

    let heightOfFromName = DamageUtils.getHeightByDynamicName(state, fromName)
    // if (NullableUtils.isNullable(heightOfFromName)) {
    //     return Promise.resolve(state)
    // }
    // heightOfFromName = NullableUtils.getExn(heightOfFromName)

    // let box = getCapsuleBox(state)
    let box = getGirlBox(state, usedGirl)

    // let [damagePartByCollisionPart, actuallyDamagePartsByCollisionPart] = getDamagePartByCollisionPart(state, usedGirl, collisionPart_)
    // let [damagePartByJudge, actuallyDamagePartsByJudge] = getDamagePartByJudge(state, usedGirl, damagePartByCollisionPart, actuallyDamagePartsByCollisionPart)
    let [damagePartByCollisionPart, damagePartByJudge, actuallyDamagePartsByJudge] = getDamagePartDataFunc(state, collisionPart_)

    let defenseData = getDefenseData(state, usedGirl, name, damagePartByJudge)
    // let height = box.getSize(_v1).y
    let height = computeHeight(state, usedGirl)

    let d = handleDamageForceSize(state, fromName, name, NullableUtils.return_(collisionPart_),
        weaponType_, defenseData[1],
        force)
    state = d[0]
    force = d[1]



    // let hp = getHp(state, damagePartByJudge)


    damageType = updateDamageTypeFunc(damageType, collisionPart_)




    let d3 = computeCrit([force, damageType], weaponValue_, getCritRatioFactor(state, fromName))
    force = d3[0]
    damageType = d3[1]

    // let d4 = computeMiss(d3, getValue(state).missRatio)
    // force = d4[0]
    // damageType = d4[1]


    force = DamageUtils.computeForceByAttackFactor(force, getAttackFactor(state, fromName))

    force = computeForceFunc(state, usedGirl, force, collisionPart_)

    let damage = DamageUtils.computeDamage(defenseData, weaponValue_, [height,
        heightOfFromName
    ], force)



    let userData = {
        usedGirl,
        forceSize: force,
        damage,
        damageType,
        fromName,
        name: name,
        box,
        damagePosition: NullableUtils.getWithDefault(damagePosition, getGirlPosition(state, usedGirl)),
        damagePartByJudge,
        actuallyDamagePartsByJudge,
        collisionPart: collisionPart_,
        weaponValue: weaponValue_
    }
    let promise
    if (weaponValue_.type !== weaponType.EffectSelf) {
        promise = Event.triggerWithUserData(state, getAbstractState, getModAPI(state).event.getHandleDamageGiantessEventName(), NullableUtils.return_(
            userData
        )
        ).then(([state,
            data
        ]) => {
            return Event.triggerWithUserData(state, getAbstractState, getModAPI(state).event.getHandleAfterDamageGiantessEventName(), NullableUtils.return_(
                data
            )
            )
        })
    }
    else {
        promise = Promise.resolve(
            [state,
                userData
            ]
        )
    }

    return promise.then(([state, {
        usedGirl,
        forceSize,
        damage,
        damageType,
        fromName,
        name,
        damagePosition,
        damagePartByJudge,
        actuallyDamagePartsByJudge,
        collisionPart,
        weaponValue,
    }]) => {
        weaponValue_ = weaponValue
        collisionPart_ = collisionPart

        let hp = getHp(state, usedGirl, damagePartByJudge)
        let remainedHp = DamageUtils.computeHp(hp, damage)


        // console.log(
        //     "forceSize:", forceSize,
        //     "damage: ", damage, "remainedHp:", remainedHp,
        //     fromName
        // )

        state = setHp(state, usedGirl, damagePartByJudge, remainedHp)

        state = DamageUtils.addLabel(state, damage, box,
            DamageUtils.computeFontType(
                // state, fromName, name, getPlayerCamp(), camp.Enemy,
                state, fromName, name,
                damageType),
            getDamagePositionForLabelFunc(state, damagePosition, height, damageType),
            // NullableUtils.map(
            //     damagePosition => {
            //         return _getDamagePositionForLabel(state, damagePosition, height)
            //     },
            //     damagePosition
            // ),
            name,
            getLabelTime(damage),
            NullableUtils.getEmpty(),
            labelAnimation.None)

        if (damage > 0) {
            state = _addExcitement(state, usedGirl, damageType, damage, weaponValue_)

            state = addDamageForce(state, fromName, damage)
        }

        state = addHitEffectForGirl(state, fromName, damagePosition, damageType, defenseData[1])

        return handleAfterComputeDamage(state, fromName, name, damage, remainedHp).then(state => {
            if (damage <= 0) {
                return state
            }


            state = setUsedGirlData(state, usedGirl, {
                ...getUsedGirlData(state, usedGirl),
                lastDamageTime: getNow(state)
            })


            // // TODO restore
            // if (isCloth(damagePartByJudge)) {
            //     actuallyDamagePartsByJudge.forEach(part => {
            //         let materials = getGirlMesh(state, usedGirl).material as Array<any>
            //         materials.forEach(m => {
            //             if (m.name == part) {
            //                 // m.emissive = new Color("blue")
            //                 m.emissive = new Color(2, 1, 1)
            //             }
            //         })
            //     })
            // }
            // else {
            //     let allBodyNames = getAllBodyNames(state, usedGirl)
            //     let materials = getGirlMesh(state, usedGirl).material as Array<any>
            //     materials.forEach(m => {
            //         if (allBodyNames.includes(m.name)) {
            //             m.emissive = new Color("red")
            //         }
            //     })
            // }



            if (remainedHp <= 0 && isCloth(damagePartByJudge)) {
                let promise = Promise.resolve(state)
                if (isShoe(damagePartByJudge)) {
                    promise = handleRemoveShoe(state, usedGirl)
                }

                return promise.then(state => handleClothDestroyed(state,
                    [createStressingStateFunc, isCanStressing], usedGirl,
                    NullableUtils.getExn(damagePosition), collisionPart_, actuallyDamagePartsByJudge, fromName))
            }


            if (remainedHp > 0) {
                return Event.trigger(state, getAbstractState, getModAPI(state).event.getHandleGiantessRemainHpEventName(), NullableUtils.return_(
                    {
                        getStateMachine,
                        damage,
                        weaponType_, collisionPart: collisionPart_,
                        // damagePartByCollisionPart,
                        damagePosition,
                        fromName,
                        damageType: damageType,
                        usedGirl,
                    }
                ))
                    .then(state => {
                        // if (isExecutingState(state, stateMachine)) {
                        //     return state
                        // }

                        return handleRemainHpFunc(state, getStateMachine(state, usedGirl), damage, weaponType_, collisionPart_, damagePartByCollisionPart, fromName)
                    })
            }

            return state
        })
    })
}

export let damage = (state: state, usedGirl, [force, damageType, weaponType], fromName: name, collisionPart_: collisionPart, damagePosition: nullable<Vector3>, weaponValue_,
    // critRatioFactor,
    // attackFactor,
) => {
    switch (usedGirl) {
        case usedGirlEnum.PlayerGirl:
            return PlayerGirl.damage(
                state, usedGirl,
                [force, damageType, weaponType],
                fromName,
                collisionPart_, damagePosition, weaponValue_,
                // critRatioFactor,
                // attackFactor,
            )
        case usedGirlEnum.WildGiantess:
            return WildGiantess.damage(
                state, usedGirl,
                [force, damageType, weaponType],
                fromName,
                collisionPart_, damagePosition, weaponValue_,
                // critRatioFactor,
                // attackFactor,
            )
        case usedGirlEnum.EnemyGiantess:
            return EnemyGiantess.damage(
                state, usedGirl,
                [force, damageType, weaponType],
                fromName,
                collisionPart_, damagePosition, weaponValue_,
                // critRatioFactor,
                // attackFactor,
            )
        case usedGirlEnum.PlayerGoddess:
            return PlayerGoddess.damage(
                state, usedGirl,
                [force, damageType, weaponType],
                fromName,
                collisionPart_, damagePosition, weaponValue_,
                // critRatioFactor,
                // attackFactor,
            )
        default:
            if (isLevelGiantessMod(state, usedGirl)) {
                return damageMod(
                    state, usedGirl,
                    [force, damageType, weaponType],
                    fromName,
                    collisionPart_, damagePosition, weaponValue_,
                    // critRatioFactor,
                    // attackFactor,
                )
            }

            throw new Error("err")
    }
}

export let getIsOnlyDamageLittleMan = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).isOnlyDamageLittleMan
}

export let setIsOnlyDamageLittleMan = (state: state, usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        isOnlyDamageLittleMan: value
    })
}


// export let isUseNonPlayerGoddess = (state: state) => {
//     return getUsedGirlData(state, usedGirl).isUseNonPlayerGoddess
// }

// export let getCurrentUsedGirl = (state: state) => {
//     return getGirlState(state).currentUsedGirl
// }

export let getCurrentUsedGirls = (state: state) => {
    return getGirlState(state).currentUsedGirls
}

export let getSpecificUsedGirl = (state: state, index) => {
    return NullableUtils.getWithDefault(getGirlState(state).currentUsedGirls[index], usedGirlEnum.None)
}

export let getFirstUsedGirl = (state: state) => {
    return getSpecificUsedGirl(state, 0)
}

export let getNonPlayerCurrentUsedGirls = (state: state) => {
    return getCurrentUsedGirls(state).filter(usedGirl => {
        return usedGirl != usedGirlEnum.PlayerGirl
    })
}

export let hasCurrentUsedGirl = (state: state, usedGirl) => {
    return getGirlState(state).currentUsedGirls.includes(usedGirl)
}


export let hasUsedGirl = (state: state) => {
    return getGirlState(state).currentUsedGirls.length > 0
}


export let isUseGirl = (state: state, usedGirl: usedGirl) => {
    // return usedGirl !== usedGirlEnum.None
    return getCurrentUsedGirls(state).includes(usedGirl)
}

export let isPlayerGirlByUsedGirl = (usedGirl_) => {
    return usedGirl_ == usedGirlEnum.PlayerGirl
}

export let isPlayerGirl = (state: state, usedGirl) => {
    // return isPlayerGirlByUsedGirl(usedGirl) && hasUsedGirlData(state, usedGirl)
    return isPlayerGirlByUsedGirl(usedGirl) && isUseGirl(state, usedGirl)
}

export let isWildGiantess = (state: state, usedGirl) => {
    return usedGirl == usedGirlEnum.WildGiantess && isUseGirl(state, usedGirl)
}

export let isEnemyGiantess = (state: state, usedGirl) => {
    return usedGirl == usedGirlEnum.EnemyGiantess && isUseGirl(state, usedGirl)
}

let _isPlayerGoddessByUsedGirl = (usedGirl_) => {
    return usedGirl_ == usedGirlEnum.PlayerGoddess
}

export let isPlayerGoddess = (state: state, usedGirl) => {
    return _isPlayerGoddessByUsedGirl(usedGirl) && isUseGirl(state, usedGirl)
}

export let isPlayerGiantess = (state: state, usedGirl) => {
    return isPlayerGoddess(state, usedGirl) || isPlayerLevelGiantess(state, usedGirl)
}

export let isPlayerGirlOrGiantess = (state: state, usedGirl) => {
    return isGiantessCharacterTypeByUsedGirl(state, usedGirl) || isPlayerGoddess(state, usedGirl) || isPlayerLevelGiantess(state, usedGirl)
}

export let isLevelGiantess = (state: state, usedGirl) => {
    return (isWildGiantess(state, usedGirl) || isEnemyGiantess(state, usedGirl,) || isPlayerGoddess(state, usedGirl) || isLevelGiantessMod(state, usedGirl)) && isUseGirl(state, usedGirl)
}

export let isLevelGiantessExceptPlayer = (state: state, usedGirl) => {
    return (isWildGiantess(state, usedGirl) || isEnemyGiantess(state, usedGirl,) || isLevelGiantessExceptPlayerMod(state, usedGirl)) && isUseGirl(state, usedGirl)
}

export let isLevelGiantessExceptPlayerGirl = (state: state, usedGirl) => {
    if (isPlayerGirlByUsedGirl(usedGirl)) {
        return false
    }

    return isUseGirl(state, usedGirl)
}

export let hasLevelGiantessExceptPlayer = (state: state) => {
    return getCurrentUsedGirls(state).reduce((result, usedGirl) => {
        if (result) {
            return result
        }

        if (isLevelGiantessExceptPlayer(state, usedGirl)) {
            return true
        }

        return false
    }, false)
}

export let hasLevelGiantessExceptPlayerGirl = (state: state) => {
    return getCurrentUsedGirls(state).reduce((result, usedGirl) => {
        if (result) {
            return result
        }

        if (isLevelGiantessExceptPlayerGirl(state, usedGirl)) {
            return true
        }

        return false
    }, false)
}

export let hasPlayerGirlOrGiantess = (state: state) => {
    return getCurrentUsedGirls(state).reduce((result, usedGirl) => {
        if (result) {
            return result
        }

        if (isPlayerGirlOrGiantess(state, usedGirl)) {
            return true
        }

        return result
    }, false)
}

export let hasPlayerGirl = (state: state) => {
    return hasCurrentUsedGirl(state, usedGirlEnum.PlayerGirl)
}

export let isGiantessExceptPlayer = (state: state, usedGirl) => {
    return isLevelGiantessExceptPlayer(state, usedGirl) || isBossGiantess(state, usedGirl)
}

export let isBossGiantess = (state: state, usedGirl) => {
    return usedGirl == usedGirlEnum.BossGiantess && isUseGirl(state, usedGirl)
}

export let isUsePlayerGoddess = (state: state, usedGirl) => {
    return isPlayerGoddess(state, usedGirl) || isGiantessCharacterTypeByUsedGirl(state, usedGirl)
}

export let isUsePlayerGiantess = (state: state, usedGirl) => {
    return isPlayerGiantess(state, usedGirl) || isGiantessCharacterTypeByUsedGirl(state, usedGirl)
}

// export let isUsePlayerGoddessByUsedGirl = (usedGirl_) => {
//     return _isPlayerGoddessByUsedGirl(usedGirl_) || isPlayerGirlByUsedGirl(usedGirl_)
// }

export let isUsePlayerGiantessByUsedGirl = (state: state, usedGirl_) => {
    return _isPlayerGoddessByUsedGirl(usedGirl_) || isPlayerGirlByUsedGirl(usedGirl_) || isPlayerLevelGiantess(state, usedGirl_)
}

// export let setCurrentUsedGirl = (state: state, value) => {
//     state = setAbstractState(state, MMD.setCurrentUsedGirl(getAbstractState(state), value))

//     return setGirlState(state, {
//         ...getGirlState(state),
//         currentUsedGirl: value
//     })
// }

export let addCurrentUsedGirl = (state: state, value) => {
    state = setAbstractState(state, MMD.addCurrentUsedGirl(getAbstractState(state), value))

    return setGirlState(state, {
        ...getGirlState(state),
        currentUsedGirls: ArrayUtils.push(getGirlState(state).currentUsedGirls, value)
    })
}

export let removeCurrentUsedGirl = (state: state, value) => {
    state = setAbstractState(state, MMD.removeCurrentUsedGirl(getAbstractState(state), value))

    return setGirlState(state, {
        ...getGirlState(state),
        currentUsedGirls: ArrayUtils.filter(getGirlState(state).currentUsedGirls, (currentUsedGirl) => {
            return currentUsedGirl != value
        })
    })
}

export let setCurrentUsedGirls = (state: state, value) => {
    state = setAbstractState(state, MMD.addCurrentUsedGirl(getAbstractState(state), value))

    return setGirlState(state, {
        ...getGirlState(state),
        currentUsedGirls: value
    })
}


export let getUsedMMDDataByUsedGirl = (state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).usedMMDData
}

export let getAllUsedMMDData = (state) => {
    // return getGirlState(state).usedGirlDataMap.reduce((result, data) => {
    //     return NullableUtils.getWithDefault(
    //         NullableUtils.map(usedMMDData => {
    //             return ArrayUtils.push(
    //                 result,
    //                 usedMMDData
    //             )
    //         }, data.usedMMDData),
    //         result
    //     )
    // }, [])

    return MutableMapUtils.reduce(getGirlState(state).usedGirlDataMap, (result, data, usedGirl) => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(usedMMDData => {
                return ArrayUtils.push(
                    result,
                    {
                        usedGirl: usedGirl,
                        data: usedMMDData
                    }
                )
            }, data.usedMMDData),
            result
        )
    }, [])
}


export let getMovableRanges = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).movableRanges
}

export let setMovableRanges = (state: state, usedGirl, movableRanges) => {
    if (getIsDebug(state)) {
        let scene = getScene(state)

        movableRanges.forEach(range => {
            addBox3Helper(getAbstractState(state), scene, new Box3(new Vector3(range.minX, -50, range.minZ), new Vector3(range.maxX, 50, range.maxZ)), 0x0000FF)
        })
    }

    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        movableRanges: movableRanges
    })
}

export let useWater = (state: state, usedGirl, name: waterPropName) => {
    switch (name) {
        case waterPropName.AddHp1:
        case waterPropName.AddHp2:
        case waterPropName.AddHp3:
        case waterPropName.AddHp4:
            state = addHp(state, usedGirl, getBody(), getFullHp(state, usedGirl) * getPropValue()[name])
            break
        case waterPropName.AddExcitement1:
        case waterPropName.AddExcitement2:
        case waterPropName.AddExcitement3:
        case waterPropName.AddExcitement4:
            state = addExcitementDirectly(state, usedGirl, getPropValue()[name])
            break
    }

    return Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), buildGiantessStatusUpdateEventNameEventData(
        getBody(), usedGirl
    ))
}


export let getLastStressingTime = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).lastStressingTime
}

export let setLastStressingTime = (state: state, usedGirl) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        lastStressingTime: getNow(state)
    })
}

export let getBreastPartialScaleMaxFactor = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).breastPartialScaleMaxFactor
}

export let setBreastPartialScaleMaxFactor = (state: state, usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        breastPartialScaleMaxFactor: value
    })
}

export let getTorsorPartialScaleMaxFactor = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).torsorPartialScaleMaxFactor
}

export let setTorsorPartialScaleMaxFactor = (state: state, usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        torsorPartialScaleMaxFactor: value
    })
}


export let getIsLightStressing = (state: state, usedGirl, collisionPart) => {
    return NullableUtils.getWithDefault(MutableMapUtils.get(getUsedGirlData(state, usedGirl).isLightStressingMap, collisionPart), false)
}

export let setIsLightStressing = (state: state, usedGirl, collisionPart, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        isLightStressingMap: MutableMapUtils.set(getUsedGirlData(state, usedGirl).isLightStressingMap, collisionPart, value)
    })
}

export let getIsCanActiveSmallerFuncExn = (state: state) => {
    return NullableUtils.getExn(getGirlState(state).isCanActiveSmallerFunc)
}

export let setIsCanActiveSmallerFunc = (state: state, func) => {
    return setGirlState(state, {
        ...getGirlState(state),
        isCanActiveSmallerFunc: NullableUtils.return_(func)
    })
}

export let getBiggerCount = (state: state, usedGirl) => {
    // if (!hasUsedGirlData(state, usedGirl)) {
    //     return 0
    // }

    // return getGirlState(state).biggerCount
    return getUsedGirlData(state, usedGirl).biggerCount
}

export let setBiggerCount = (state: state, usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        biggerCount: value
    })
}

export let getAddScaleByBiggerCount = (state: state, usedGirl, biggerCount) => {
    return MutableMapUtils.getWithDefault(getUsedGirlData(state, usedGirl).addScaleByBiggerCount, biggerCount, 0)
}

export let setAddScaleByBiggerCount = (state: state, usedGirl, biggerCount, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        addScaleByBiggerCount: MutableMapUtils.set(getUsedGirlData(state, usedGirl).addScaleByBiggerCount, biggerCount, value)
    })
}

export let clearAddScaleByBiggerCount = (state: state, usedGirl) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        addScaleByBiggerCount: MutableMapUtils.create()
    })
}


// // TODO restore
// if (isCloth(damagePartByJudge)) {
//     actuallyDamagePartsByJudge.forEach(part => {
//         let materials = getGirlMesh(state, usedGirl).material as Array<any>
//         materials.forEach(m => {
//             if (m.name == part) {
//                 // m.emissive = new Color("blue")
//                 m.emissive = new Color(2, 1, 1)
//             }
//         })
//     })
// }
// else {
//     let allBodyNames = getAllBodyNames(state, usedGirl)
//     let materials = getGirlMesh(state, usedGirl).material as Array<any>
//     materials.forEach(m => {
//         if (allBodyNames.includes(m.name)) {
//             m.emissive = new Color("red")
//         }
//     })
// }

export let setMaterialColor = (material, color) => {
    material.emissive.add(_c1.fromArray(color))
    // material.color.add(_c1.fromArray(color))
}

let _setClothColor = (state: state, usedGirl, damagePart, color, value) => {
    let materials = getGirlMesh(state, usedGirl).material as Array<any>

    color = computeColor(color, state, value)

    materials.forEach(m => {
        if (m.name == damagePart) {
            setMaterialColor(m, color)
        }
    })

    return state
}

let _setBodyColor = (state: state, usedGirl, color, value) => {
    let allBodyNames = getAllBodyNames(state, usedGirl)
    let materials = getGirlMesh(state, usedGirl).material as Array<any>

    color = computeColor(color, state, value)

    materials.forEach(m => {
        if (allBodyNames.includes(m.name)) {
            setMaterialColor(m, color)
        }
    })

    return state
}

export let setPartColor = (state: state, usedGirl, damagePart, actuallyDamageParts, color, value) => {
    if (isCloth(damagePart)) {
        state = actuallyDamageParts.reduce((state, part) => {
            return _setClothColor(state, usedGirl, part, color, value)
        }, state)
    }
    else {
        state = _setBodyColor(state, usedGirl, color, value)
    }

    return state
}

export let setAllColor = (state: state, color, value: number, usedGirl) => {
    let materials = getGirlMeshByUsedGirl(state, usedGirl).material as Array<any>

    color = computeColor(color, state, value)

    materials.forEach(m => {
        setMaterialColor(m, color)
    })

    return state
}

export let computeAttenuationByHeightForEffect = (value: number, state: state, usedGirl, damagePartByJudge) => {
    // value = value / (Math.sqrt(computeHeight(state, usedGirl)) * 0.5)
    // value = value / NumberUtils.clamp(Math.sqrt(computeHeight(state, usedGirl)) * 0.2, 1, 10)
    value = value / NumberUtils.clamp(Math.sqrt(computeHeight(state, usedGirl)) * 0.25, 1, 20)

    if (
        NullableUtils.getWithDefault(
            NullableUtils.map(damagePartByJudge => {
                return isCloth(damagePartByJudge)
            }, damagePartByJudge),
            false
        )
    ) {
        value *= 0.5
    }

    return value
}

export let getAddHitEffectFunc = (state: state) => {
    return getGirlState(state).addHitEffectFunc
}

export let setAddHitEffectFunc = (state: state, func) => {
    return setGirlState(state, {
        ...getGirlState(state),
        addHitEffectFunc: NullableUtils.return_(func)
    })
}

export let removeAddHitEffectFunc = (state: state) => {
    return setGirlState(state, {
        ...getGirlState(state),
        addHitEffectFunc: NullableUtils.getEmpty()
    })
}


export let getUpgradeFuncs = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).upgradeFuncs
}

export let setUpgradeFuncs = (state: state, usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        upgradeFuncs: value
    })
}



export let getGiantessStressingRate = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).giantessStressingRate
}

export let setGiantessStressingRate = (state: state, usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        giantessStressingRate: value
    })
}

export let isBack = (state: state, usedGirl, collisionPart_, damagePosition) => {
    if (collisionPart_ == collisionPart.BoundingBox) {
        return false
    }

    let obb = getCollisionPartOBB(state, usedGirl, collisionPart_)

    let faceDirection = TransformUtils.getFaceDirection(
        getQuaternion(obb), _v1)

    return TransformUtils.isBack(
        faceDirection,
        damagePosition,
        obb.center
    )
}




// export let getLastChangePoseTime = (state: state) => {
//     return getUsedGirlData(state, usedGirl).lastChangePoseTime
// }

// export let setLastChangePoseTime = (state: state, value) => {
//     return setUsedGirlData(state, usedGirl,{
//         ...getUsedGirlData(state, usedGirl),
//         lastChangePoseTime: NullableUtils.return_(value)
//     })
// }

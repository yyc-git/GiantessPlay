import { cameraType, state } from "../../../../../type/StateType"
import { setCamp } from "../../manage/city1/Army"
import { bossStateStatusName, camp, usedGirl, playerGiantessData, usedGirlEnum } from "../../type/StateType"
import { getPlayerCamp } from "../../utils/PlayerUtils"
import { getGirlState, setGirlState, hasGirlMesh, isBelongToCurrentPoseAndScaleState, isActionTriggering, isTriggerAction, isActionState, isDamageAction, setTriggerAction, setActionState, setLastScaleChangeTime, resetIsTriggerAction, getActiveBiggerIncreaseScale, changeToInitialScale } from "../Girl"
import { addGirl, refreshBiggerTime, removeGirl } from "../InitWhenImportScene"
import { Event, NullableUtils, Scene, Device, SkinAnimation, Loader, ModelLoader, Camera, DisposeUtils, ThirdPersonControls, Layer } from "meta3d-jiehuo-abstract"
// import { state } from "../../type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../state/State"
// import { damageType, collisionPart, girl, mmdCharacter, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, result, giantessStrength, giantessScale } from "../type/StateType"
import { AnimationClip, AxesHelper, Box3, Box3Helper, CompressedArrayTexture, Euler, Matrix3, Matrix4, Mesh, MeshPhongMaterial, Object3D, Quaternion, Vector3 } from "three"
// import { setTarget } from "./Camera"
import { getThirdPersonCameraTarget, getOrbitControlsTarget, isCameraCollision, updateThirdPersonControlsForChangeScale, getCameraType, updateFirstPersonControls } from "../../Camera"
import { Flow, Capsule } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract"
import { List, Map } from "immutable"
import { ScreenShake } from "meta3d-jiehuo-abstract"
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera"
// import { getGiantessStatusUpdateEventName, getPickupEventName, getPickdownEventName, getPinchJudageDamageEventName, getEatEventName, getStandToCrawlEventName, getCrawlToStandEventName, getLittleManStatusUpdateEventName, } from "../../../../utils/EventUtils"
// import { actionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../data/DataType"
import { move } from "../Move"
import { computeGirlBoxAndSetToState, computeHeight, getGirlBox, getCurrentHeight, getScale, getScaleByHeight, setGirlRotation, markGirlVisible, markGirlNotVisible, getScaleIncreaseTimes, updateMMDPhysicsConfigForScale, getDamagePartFactor, getForceFactor, getSkillStateFactor, getCollisionPartFactor, getScaleFactor, setHeight, isCanStressing, unlockGirlRotation, getGirlPosition, getDamageTypeFactor, getBaseFactor } from "../Utils"
import { getAllAnimationNames, getCurrentAnimationName, isChangeScaling, isCompletelyPlayingAnimation, isKeepPoseAnimation, isPlayingAnimation, isPlayingAnimationByWeight, playBiggerAnimation, playSmallerAnimation, updateAnimation, updateAnimationDuration } from "../Animation"
import { getCollisionPartCenter, updateAnimationCollision } from "../Collision"
import * as PickPose from "../PickPose"
import { getStateMachine, isChangeCrawlPoseState, isSkillState, setStateMachine } from "../FSMState"
// import { createStressingState, update as updateFSMState } from "./FSMState"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { girlValue, weaponType } from "../../data/ValueType"
import { actionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../../data/DataType"
import { damageType, collisionPart, girl, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, result, giantessStrength, giantessScale, damagePart } from "../../type/StateType"
import { getConfigData, getGirlScale, removeBehaviourTreeData, setGirlValue } from "../../CityScene"
import { isCloth, updateHpData } from "../Cloth"
import { buildLevelStatusUpdateEventData } from "../../utils/EventUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { isControlledState, isDestoryRelatedStates, isNotDamageState } from "../../utils/FSMStateUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import * as BehaviourTreeManager from "../../behaviour_tree/BehaviourTreeManager"
import { getGiantessCharacters } from "../../character/Character"
import { setExcitement, setExcitementByUsedGirl } from "../Excitement"
import { getNow } from "../../Time"
import { generateReward } from "../../reward/RewardGenerator"
import { getBone } from "../../utils/MMDUtils"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../../data/DataUtils"
import { handleTweenRepeatComplete2 } from "../../utils/DamageUtils"
import { addTweens } from "../../TweenManager"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { toRadians } from "../../../../../utils/QuatUtils"
import { handleLightStressing } from "../../utils/LightStressingGiantessUtils"
import { buildBossStatusUpdateEventNameEventData } from "../../../../../utils/EventUtils"
import { addLevelGiantess, removeLevelGiantess, updateUtils, damage as damageUtils, createDestroyedStateUtils, createDestroyingStateUtils, triggerAction as triggerActionUtils } from "../utils/LevelGirlUtils"
import { disposeEnemyData as disposeBuffData } from "../../buff/Buff"
import * as GirlFSMState from "../FSMState"
import { setAttribute } from "../../utils/build/GiantessBuildUtils"
import { buildFuncData } from "../../data/FuncData"
import * as PlayerGoddessData from "../../data/play/level1/player_goddess/GirlData"
// import { setNeedShowSkillBar } from "../../UI"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { resetPose } from "../Pose"
import { computeIncreaseFactor } from "../../build/Upgrade"


const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

let _getData = (state: state) => {
    return getGirlState(state).playerGiantessData
}

let _setData = (state: state, d: playerGiantessData) => {
    return setGirlState(state, {
        ...getGirlState(state),
        playerGiantessData: d
    })
}

export let addPlayerGoddess = (state: state, worldPosition, worldQuaternion) => {
    let usedGirl = usedGirlEnum.PlayerGoddess
    return addLevelGiantess(state, usedGirl, camp.Player, worldPosition, worldQuaternion).then(state => {
        state = updateHpData(state, usedGirl)

        return changeToInitialScale(state, usedGirl)
    })
}

// export let resetPlayerGoddessValue = (state: state) => {
//     state = setGirlValue(state, usedGirlEnum.PlayerGoddess, PlayerGoddessData.getValue(state))

//     return state
// }

export let removePlayerGoddess = (state: state) => {
    let usedGirl = usedGirlEnum.PlayerGoddess
    state = resetPose(state, usedGirl)

    return removeLevelGiantess(state, state => {
        return Promise.resolve(state)
    }, usedGirl)
    // .then(state => {
    //     // return setAttribute(state, buildFuncData(state), (_) => PlayerGoddessData.getValue(state), usedGirlEnum.PlayerGoddess)
    //     return resetPlayerGoddessValue(state)
    // })
}

export let update = (state: state, usedGirl) => {
    return updateUtils(state, usedGirl, updateFSMState)
}

export let damage = (state: state, usedGirl, [force, damageType, weaponType], fromName, collisionPart_: collisionPart, damagePosition: nullable<Vector3>, weaponValue_,
) => {
    return damageUtils(state,
        createStressingState,
        usedGirl,
        [force, damageType, weaponType], fromName, collisionPart_, damagePosition, weaponValue_,
    )
}

// export let updateStatus = (state: state) => {
//     return updateStatusUtils(state, getBiggerCount)
// }

export let dispose = (state): playerGiantessData => {
    return createData()
}

export let createData = (): playerGiantessData => {
    return {
        biggerCount: 0,
    }
}

// export let createStressingState = createStressingStateUtils(buildPlayerGoddessStressingName)

export let createStressingState = (usedGirl) => {
    return {
        name: objectStateName.Stressing,
        enterFunc: (state) => {
            return Promise.resolve(BehaviourTreeManager.markWhetherNotExecuteGiantessAI(state, usedGirl, true))
        },
        executeFunc: (state, [collisionPart_, fromName, damagePosition]) => {
            return GirlFSMState.executeStressing(state, usedGirl, collisionPart_, fromName)
        },
        exitFunc: (state: state) => {
            state = GirlFSMState.handleStressingStateExit(state, usedGirl)

            return Promise.resolve(BehaviourTreeManager.markWhetherNotExecuteGiantessAI(state, usedGirl, false))
        }
    }
}

export let createDestroyedState = createDestroyedStateUtils([removePlayerGoddess, disposeBuffData])

export let createDestroyingState = createDestroyingStateUtils(createDestroyedState)

export let updateFSMState = (state: state, usedGirl) => {
    return GirlFSMState.update(state, createDestroyingState, usedGirl)
}

export let triggerAction = (state, usedGirl, name: actionName): Promise<[state, result]> => {
    return triggerActionUtils(state, usedGirl, name)
}


// export let increaseGirlAttribute = (state: state, level) => {
//     let funcData = buildFuncData(state)

//     let scaleIncrease = 0.5 * level

//     let usedGirl = usedGirlEnum.PlayerGoddess

//     state = funcData.GiantessBuildUtils.setFullHp(state, funcData, (state, hp) => {
//         // return hp + 30 * level
//         return hp + 300 * level
//     }, false, usedGirl_)
//     state = funcData.GiantessBuildUtils.setAttribute(state, funcData, (girlValue) => {
//         return {
//             ...girlValue,
//             scaleIncrease: girlValue.scaleIncrease + scaleIncrease,
//             // initialScale: girlValue.initialScale + scaleIncrease,


//             // attackFactor: girlValue.attackFactor + level * computeIncreaseFactor(0.03, level),
//             attackFactor: girlValue.attackFactor + level * computeIncreaseFactor(0.01, level),
//             // defenseFactor: girlValue.defenseFactor < 0.6 ? girlValue.defenseFactor + level * computeIncreaseFactor(0.006, level) : girlValue.defenseFactor,
//             defenseFactor: girlValue.defenseFactor + level * computeIncreaseFactor(0.001, level),

//         }
//     }, usedGirl_)

//     // state = setGirlScale(state, getScale(state, usedGirl) + scaleIncrease)
//     state = funcData.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, funcData, (state, initialScale) => {
//         return initialScale + scaleIncrease
//     }, usedGirl_, setGirlScale)

//     return state
// }
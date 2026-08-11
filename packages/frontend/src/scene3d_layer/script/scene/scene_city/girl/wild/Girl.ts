import { cameraType, state } from "../../../../../type/StateType"
import { setCamp } from "../../manage/city1/Army"
import { bossStateStatusName, camp, usedGirlEnum, wildGiantessData } from "../../type/StateType"
import { getPlayerCamp } from "../../utils/PlayerUtils"
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
import { buildBossStatusUpdateEventNameEventData, buildCaptureLevelGiantessEventData, buildGiantessStatusUpdateEventNameEventData, getBossStatusUpdateEventName, getCaptureLevelGiantessEventName, getGiantessStatusUpdateEventName, getLevelStatusUpdateEventName } from "../../../../../utils/EventUtils"
import { actionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../../data/DataType"
import { damageType, collisionPart, girl, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, result, giantessStrength, giantessScale, damagePart } from "../../type/StateType"
import { getConfigData, removeBehaviourTreeData, removeLevelData } from "../../CityScene"
import { buildLevelStatusUpdateEventData } from "../../utils/EventUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { isDestoryRelatedStates } from "../../utils/FSMStateUtils"
import { StateMachine } from "meta3d-jiehuo-abstract"
import * as BehaviourTreeManager from "../../behaviour_tree/BehaviourTreeManager"
import { getGiantessCharacters } from "../../character/Character"
import { setExcitement, setExcitementByUsedGirl } from "../Excitement"
import { getNow } from "../../Time"
import { generateReward } from "../../reward/RewardGenerator"
import { buildWildGiantessDestroyedName, buildWildGiantessStressingName } from "../../data/play/level1/reward/RewardData"
import { getBone } from "../../utils/MMDUtils"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../../data/DataUtils"
import { handleTweenRepeatComplete2 } from "../../utils/DamageUtils"
import { addTweens } from "../../TweenManager"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { toRadians } from "../../../../../utils/QuatUtils"
import { addLevelGiantess, removeLevelGiantess, updateUtils, damage as damageUtils, createDestroyedStateUtils, createDestroyingStateUtils, triggerAction as triggerActionUtils, createStressingStateUtils } from "../utils/LevelGirlUtils"
import { disposeEnemyData as disposeBuffData } from "../../buff/Buff"
import * as GirlFSMState from "../FSMState"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { getName as getLittleName } from "../../little_man/LittleMan"
import { buildNameByUsedGirl } from "../Girl"


const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

// let _getData = (state: state) => {
//     return getGirlState(state).wildGiantessData
// }

// let _setData = (state: state, d: wildGiantessData) => {
//     return setGirlState(state, {
//         ...getGirlState(state),
//         wildGiantessData: d
//     })
// }


export let addWildGiantess = (state: state, worldPosition, worldQuaternion) => {
    return addLevelGiantess(state, usedGirlEnum.WildGiantess, camp.Giantess, worldPosition, worldQuaternion)
}

export let removeWildGiantess = (state: state) => {
    let usedGirl = usedGirlEnum.WildGiantess
    return removeLevelGiantess(state, state => {
        let girlPosition = getGirlPosition(state, usedGirl)

        state = generateReward(state, getLittleName(), buildWildGiantessDestroyedName(), buildNameByUsedGirl(usedGirl), girlPosition, girlPosition, 3)

        return Promise.resolve(state)
    }, usedGirl)
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

export let dispose = (state): wildGiantessData => {
    return createData()
}

export let createData = (): wildGiantessData => {
    return {
        biggerCount: 0,
    }
}



export let createStressingState = createStressingStateUtils(buildWildGiantessStressingName)

export let createDestroyedState = createDestroyedStateUtils([removeWildGiantess, disposeBuffData])

export let createDestroyingState = createDestroyingStateUtils(createDestroyedState)

export let updateFSMState = (state: state, usedGirl) => {
    return GirlFSMState.update(state, createDestroyingState, usedGirl)
}


export let triggerAction = (state, usedGirl, name: actionName): Promise<[state, result]> => {
    return triggerActionUtils(state, usedGirl, name)
}
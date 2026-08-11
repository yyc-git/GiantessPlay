import type { WebGLRenderer, Object3D, Camera, Vector2, Raycaster, InstancedMesh, Scene, Group, Vector3, Mesh, PerspectiveCamera, OrthographicCamera, Texture, Box3, Box3Helper, SkinnedMesh, Quaternion, Sphere, Ray, Matrix4, Bone, Euler, AnimationClip, Sprite } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import type { List, Map as ImmutableMap } from "immutable"
import type { Capsule } from "three/examples/jsm/math/Capsule"
// import type { StaticLODContainer } from "meta3d-jiehuo-abstract/src/three/StaticLODContainer"
import type { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { cameraType, state } from "../../../../type/StateType"
// import { Terrain } from "meta3d-jiehuo-abstract/src/terrain/Terrain"
import { ScreenShake } from "meta3d-jiehuo-abstract"
import { bulletEmitterParam, details, fsm_state, id, resourceId, characterType, stateMachine, tween, usedGirlEnum as usedGirlEnumAbstract, camp as campAbstract, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType"
import { StaticLODContainer } from "meta3d-jiehuo-abstract/src/lod/lod2/StaticLODContainer";
import { MMDAnimationHelper } from "meta3d-jiehuo-abstract/src/three/MMDAnimationHelper";
import { OBB } from "meta3d-jiehuo-abstract/src/three/OBB";
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue";
import { Moment } from "moment";
import { actionData, actionName, animationBlendData, animationCollisionData, animationName, armorType, articluatedAnimationData, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, frameIndex, phaseData, speed } from "../data/DataType";
import * as BehaviourTreeDataType from "../data/behaviour_tree_data/BehaviourTreeDataType";
import * as LittleManDataType from "../little_man_data/DataType";
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD";
import { animationData, emitterLife, girlValue, objectValue, weaponName, weaponType, weaponValue } from "../data/ValueType";
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedSkinLOD2";
import { eventName_, data as gameEventData } from "../data/GameEventData";
import { eventName, data as gameEventDirectorData } from "../data/director/GameEventDirectorData";
import { data as scenarioData } from "../data/ScenarioData";
import { InstancedLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedLOD2";
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue";
// import { data } from "../data/ScenarioData";
// import * as CollisionShapeData from "../data/CollisionShapeData"
import { data, clothCollisionData, clothHpData, firstPersonControlsData, mmdCharacter, mmdCharacterData, shoeData, attributeData } from "mmd-character-protocol/src/service/ServiceType"
import { allMMDData } from "../data/mmd/MMDData";
import { modelData, modelName } from "../little_man_data/ModelData";
import * as SoldierData from "../army_data/SoldierData";
import * as MilltaryVehicleData from "../army_data/MilltaryVehicleData";
import * as MilltaryBuildingData from "../army_data/MilltaryBuildingData";
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType";
import { skillData } from "../little_man_data/SkillData";
import { littleManValue } from "../little_man_data/ValueType";
import { rewardData } from "../data/reward/RewardDataType";
import { buildData, giantessUpgradeName, littleManUpgradeName, upgradeFuncData } from "../data/build/BuildData";
import { operateRenderData } from "../data/PoseData";
import { difficultyData } from "../data/difficulty/DifficultyData";
import { singleTalentData, talentData } from "../data/build/TalentData";
import { littleManOperateData } from "../little_man_data/OperateData";
import { buffName } from "../data/buff/BuffData";
import { api } from "type-api/src/Type";
import { renderAccuracyLevel } from "setting-default/src/Type";
import { blockName, blockService } from "block/src/BlockManagerType";
import { data as dataInternation, imageData, variableData } from "../../../../internation/Data";
import { funcData } from "../data/FuncData";
import { careerFeatureName, careerFeatureValue } from "../data/build/CareerFeatureData";
import { actionPrior } from "prop-artifact-giantesscontroller/src/script/State";

// export enum footSide {
//     Left,
//     Right
// }

export enum damageType {
    // Normal,
    // Direct,
    // Range,

    Direct,
    Range,

    Normal,
    Heavy,
    Weakness,
    Crit,
    // Miss,

    Global,
}


export enum collisionPart {
    BoundingBox = "BoundingBox",

    LeftFoot = "LeftFoot",
    RightFoot = "RightFoot",
    LeftShank = "LeftShank",
    RightShank = "RightShank",
    LeftThigh = "LeftThigh",
    RightThigh = "RightThigh",
    TrigoneAndButt = "TrigoneAndButt",
    LeftBreast = "LeftBreast",
    RightBreast = "RightBreast",
    // Body = "Body",
    LeftUpperArm = "LeftUpperArm",
    RightUpperArm = "RightUpperArm",
    LeftLowerArm = "LeftLowerArm",
    RightLowerArm = "RightLowerArm",
    Head = "Head",

    Torso = "Torso",

    LeftHand = "LeftHand",
    RightHand = "RightHand",
}

type name = string

// export type isComputeObjectCollisionMap = ImmutableMap<name, boolean>

export type phase = number

export enum otherPhase {
    EmptyPhase = -100,
    NoPhase = -99,
}

// export enum walkPhase {
//     Move,
//     Down
// }
export enum walkPhase {
    LeftFootMove,
    RightFootMove,

    LeftFootDown,
    RightFootDown,
}

export enum runPhase {
    LeftFootMove,
    RightFootMove,

    LeftFootDown,
    RightFootDown,
}

export enum rangePhase {
    Range = -100
}


export enum stompPhase {
    Up,
    Down,
    Keep,
    Back,
    // Range
}


export enum standToCrawlPhase {
    ShankDown,
    HandDown,
}

export enum crawlToStandPhase {
    HandUp,
}

// export enum breastPressPhase {
//     Down,
//     Up,
// }


export enum crawlMovePhase {
    Move,
    Down
}


// export enum pickupPhase {
//     Pick
// }

// export enum pickdownPhase {
//     Pick
// }

export enum pinchPhase {
    FirstPinch,
    SecondPinch
}

export enum eatPhase {
    BeforeEat,
    Eat
}



export enum pose {
    All = "All",

    Stand = "Stand",
    Crawl = "Crawl",
    Pick = "Pick",
    Sit = "Sit",
}

type hp = number

export enum soundType {
    Laugh
}

export type forceSize = number

export type force = [forceSize, Vector3]

// export enum attackAction {
//     Idle,
//     Walk,
//     Stomp
// }

// export type command = {
//     execute: <Data> (state: state, data: Data) => Promise<state>
// }

type boneName = string

export type giantessAddToSkeletonData = {
    // getTransformFunc: (state: state, transform: Matrix4, handBox: Box3) => Matrix4,
    // getTransformFunc: (state: state, transform: Matrix4, handBox: Box3, name: name) => Matrix4,
    getTransformFunc: (state: state, usedGirl: usedGirl, handBox: Box3, name: name) => Matrix4,
    // updateTransformFunc: (state: state, queue: nullable<LODQueue>, index: lodQueueIndex, parentTransform: Matrix4, localTransform: Matrix4) => state,
    updateTransformFunc: (state: state, usedGirl: usedGirl, queue: nullable<LODQueue>, index: lodQueueIndex, parentTransform: Matrix4, localTransform: Matrix4, originTransform: Matrix4) => state,
    // getModelQueueIndexFunc: (state: state, name: name) => lodQueueIndex,
    // handlePickupFunc: (state: state, name: name) => state,
    getLocalTransformFunc: (state: state, queue: nullable<LODQueue>, index: lodQueueIndex, name: name) => nullable<Matrix4>,
    getBoxFunc: (state: state, queue: nullable<LODQueue>, index: lodQueueIndex, name: name) => nullable<Box3>,



    usedGirl: usedGirl,

    queue: nullable<LODQueue>,
    index: lodQueueIndex,
    name: name,
    // box:Box3,
    // transform:Matrix4,

    originTransform: Matrix4,
    originBox: Box3,

    // girlScaleWhenPickup:number,

    // handBox: Box3,
}

export enum actionState {
    Initial,
    Run,
}

export enum littleManActionState {
    Initial,
    // Attack,
    Shoot,
    Swiping,
    Lie,
    Run
}

// export enum scaleState {
//     Normal,
//     Big
// }

export enum particleNeedCollisionCheckLoopFrames {
    // Zero = 0,
    One = 1,
    Two = 2,
    Three = 3,
    // Four = 4
}

export enum uiUpdateLoopFrames {
    Short = 7,
    Middle = 10,
    Long = 15,
}

export type clothName = string

export type damagePart = "身体" | clothName

// export type girlStatus = {
//     name: string,
//     damagePart: damagePart
// }

// export type usedGirlAbstract

export type usedGirlEnum = usedGirlEnumAbstract
export const usedGirlEnum = { ...usedGirlEnumAbstract }

export type usedGirl = string

export type studyAction<actionName> = {
    name: actionName,
    time: number,
}

export type usedGirlData = {
    giantessStressingRate: number,

    upgradeFuncs: Array<upgradeFuncData>,

    stateMachine: stateMachine<state>,



    currentMMDCharacter: mmdCharacter,
    // usedMMDData: Array<[mmdCharacter, resourceId, any, mmdCharacterData]>,
    usedMMDData: nullable<[mmdCharacter, resourceId, any, mmdCharacterData]>,

    currentPose: pose,

    currentHeight: number,

    currentAnimationName: animationName,
    previousAnimationName: nullable<animationName>,
    nextBlendingAnimationName: nullable<animationName>,

    tweens: Array<tween>,

    noBlend: boolean,

    // playOnlyOnceAnimationNames: List<animationName>,
    isCurrentAnimationOnlyPlayOnce: boolean,

    customDuration: nullable<number>,
    durationFactor: number,

    // needExecAction: nullable<attackAction>,

    // capsule: Capsule,
    // capsuleMesh: nullable<Mesh>,

    box: Box3,


    // lastVelocity: Vector3,
    // girl: nullable<Object3D>,
    girlMesh: nullable<SkinnedMesh>,
    girlGroup: nullable<Object3D>,
    // girlMeshMap: ImmutableMap<usedGirl, SkinnedMesh>,
    // girlMMDAnimationMap: ImmutableMap<usedGirl, Array<[string, AnimationClip]>>,
    // girlMMDAnimation: Array<[string, AnimationClip]>,
    // girlGroupMap: ImmutableMap<usedGirl, Object3D>,


    originScale: number,
    initialPosition: nullable<Vector3>,
    initialQuaternion: nullable<Quaternion>,

    collisionShapeMap: ImmutableMap<collisionPart, OBB>,
    getCenterFunc: nullable<(collisionPart: collisionPart) => nullable<Vector3>>,



    isComputeCollisionMap: ImmutableMap<number, ImmutableMap<frameIndex, boolean>>,
    lastFrameIndexMap: ImmutableMap<animationName, frameIndex>,

    isComputeDamageMap: ImmutableMap<animationName, ImmutableMap<name, ImmutableMap<phase, boolean>>>,


    screenShake: any,

    excitement: number,
    hpMap: ImmutableMap<damagePart, hp>,


    // needUpdateStatus: nullable<girlStatus>,
    needUpdateStatusName: nullable<string>,
    needUpdateStatusDamagePart: nullable<damagePart>,
    // isNeedUpdateStatus: boolean,


    // lastUpdatedExcitement: number,
    lastAddExcitementTime: nullable<secondUnit>,

    lastDamageTime: millisecondUnit,

    lastMoveCollisionedTime: millisecondUnit,


    triggeredAction: nullable<actionName>,
    actionState: actionState,

    // lastChangePoseTime: nullable<millisecondUnit>,




    // scaleState: scaleState,
    lastScaleChangeTime: millisecondUnit,

    isChangeScaling: boolean,


    boneCacheMap: ImmutableMap<boneName, Bone>,



    // giantessAddToSkeletonData: nullable<giantessAddToSkeletonData>,
    giantessAddToHandSkeletonData: List<giantessAddToSkeletonData>,
    positionOffsetForPick: ImmutableMap<name, Vector3>,

    giantessAddToUBSkeletonData: List<giantessAddToSkeletonData>,
    positionOffsetForUBControlled: ImmutableMap<name, Vector3>,

    giantessAddToBreastSkeletonData: List<giantessAddToSkeletonData>,
    positionOffsetForPutToBreast: ImmutableMap<name, Vector3>,

    giantessAddToShoeSkeletonData: List<giantessAddToSkeletonData>,
    positionOffsetForPutToShoe: ImmutableMap<name, Vector3>,



    isMoveCollisioned: boolean,

    isAllowMoveCollision: boolean,

    isRotationLock: boolean,

    isOnlyDamageLittleMan: boolean,

    girlGroupPositionDiffForChangePivot: nullable<Vector3>,




    lastStressingTime: millisecondUnit,



    breastPartialScaleMaxFactor: number,
    torsorPartialScaleMaxFactor: number,



    isLightStressingMap: Map<collisionPart, boolean>,


    biggerCount: biggerCount,
    addScaleByBiggerCount: Map<biggerCount, number>,


    movableRanges: Array<xzRange>,


    // computeBoxFunc: (state: state) => state,
    computeBoxFunc: (state: state, usedGirl: usedGirl) => Box3,
    // createFSMStateByCurrentAnimationNameFunc: (state: state, nextBlendingAnimationName: animationName) => [state, nullable<fsm_state<state>>],
    createFSMStateByChangeAnimationNameFunc: (state: state, usedGirl: usedGirl, nextBlendingAnimationName: animationName) => [state, nullable<fsm_state<state>>],
    // createInitialStateFunc: () => fsm_state<state>,
    computeForceDirectionFunc: (state: state, usedGirl: usedGirl, animationName: any, velocity: Vector3, phase: any) => Vector3,
    computeDamageTypeFunc: (state: state, animationName: any, phase: any) => damageType,
}

// export enum biggerWay {
//     None,
//     Active,
//     Passive,
//     Damage,
// }

type levelNumber = number

export type playerGirlData = {
    currentStudyActions: List<studyAction<actionName>>,
    savedStudyActions: List<studyAction<actionName>>,


    // biggerWay: 

    // biggerCount: number,
    maxBiggerCount: number,
    biggerEnhanceLevel: levelNumber,

    // maxScale: number,

    // scale: number,
    // sumExcitement: number,
    excitementFactorLevel: number,
    // lastDecreaseScaleTime: nullable<secondUnit>,
    damageBiggerFactorLevel: number,



    // moveDamageEnhanceLevel: levelNumber,



    originPlayerGirlScale: nullable<number>,


    scaleIncrease: number,
    hpIncrease: number,
}

export type wildGiantessData = {
}

export type enemyGiantessData = wildGiantessData

export type playerGiantessData = wildGiantessData

type biggerCount = number

export type girl = {
    // usedGirlDataMap: ImmutableMap<usedGirlData>,
    // usedGirlDataMap: Record<usedGirl, usedGirlData>,
    usedGirlDataMap: Map<usedGirl, usedGirlData>,


    // currentUsedGirl: usedGirl,
    currentUsedGirls: Array<usedGirl>,

    playerGirlData: playerGirlData,

    wildGiantessData: wildGiantessData,
    enemyGiantessData: enemyGiantessData,
    playerGiantessData: playerGiantessData,

    // isFirstAdd: Record<usedGirl, boolean>,


    isCanActiveSmallerFunc: nullable<(state: state, usedGirl: usedGirl) => boolean>,

    addHitEffectFunc: nullable<(state: state, fromName: name, damagePosition: nullable<Vector3>, damageType_, armorType_: armorType) => state>,
}

// export type otherGirls = {
//     girls: Array<SkinnedMesh>,
// }



export enum gunName {
    LaserGun = "LaserGun",
    RocketGun = "RocketGun",
    PropGun = "PropGun",
}


export enum resourceLevel {
    White = "White",
    Green = "Green",
    Blue = "Blue",
    Purple = "Purple",
}

export type qte = {
    moveLineLeft: number,
    activeLineLeft: number,
    isHit: boolean,
    isStart: boolean,
}

// type shootTarget = [Vector3, nullable<staticLODContainerIndex>, nullable<name>, nullable<collisionPart>]
export type shootTarget = [Vector3, nullable<staticLODContainerIndex>, nullable<[Box3, name, lodQueueIndex]>, nullable<[collisionPart, usedGirl]>]

export enum fireWay {
    Burst,
    Continuous,
}

export type littleMan = {
    currentStudyActions: Array<studyAction<LittleManDataType.actionName>>,
    // savedStudyActions: Array<studyAction<LittleManDataType.actionName>>,

    stateMachine: stateMachine<state>,

    usedBulletPropName: nullable<bulletPropName | string>,
    // usedBulletPropName: bulletPropName | string,

    currentModel: modelName,

    // currentPose: pose,

    // currentHeight: number,

    currentAnimationName: LittleManDataType.animationName,
    previousAnimationName: nullable<LittleManDataType.animationName>,
    nextBlendingAnimationName: nullable<LittleManDataType.animationName>,

    noBlend: boolean,

    isCurrentAnimationOnlyPlayOnce: boolean,

    box: Box3,


    // littleMan: nullable<SkinnedMesh>,
    littleMan: nullable<Object3D>,

    // originScale: number,
    initialPosition: nullable<Vector3>,
    initialQuaternion: nullable<Quaternion>,


    // rotationYForThirdPersonControl: number,
    // lastRotationYForThirdPersonControl: nullable<number>,
    // quaternionForThirdPersonControl: Quaternion,

    // collisionShapeMap: ImmutableMap<collisionPart, OBB>,

    isComputeCollisionMap: ImmutableMap<number, ImmutableMap<frameIndex, boolean>>,
    // isResetActionCollision: boolean,
    lastFrameIndexMap: ImmutableMap<LittleManDataType.animationName, frameIndex>,


    // isComputeDamageMap: ImmutableMap<animationName, ImmutableMap<name, ImmutableMap<phase, boolean>>>,


    hp: hp,


    isStatusChange: boolean,


    // lastUpdatedExcitement: number,

    // lastDamageTime: number,


    triggeredAction: nullable<LittleManDataType.actionName>,
    actionState: littleManActionState,
    triggeredActionTime: ImmutableMap<LittleManDataType.actionName, number>,

    triggeredActionBeforeLock: nullable<LittleManDataType.actionName>,
    fireWay: fireWay,


    // scaleState: scaleState,
    // lastScaleChangeTime: number,


    // boneCacheMap: ImmutableMap<boneName, Bone>,



    // pickDataList: List<giantessAddToSkeletonData>,
    // giantessAddToSkeletonData: nullable<giantessAddToSkeletonData>,



    // gun: nullable<Object3D>,
    gunMap: ImmutableMap<gunName, Object3D>,

    aim: nullable<Sprite>,
    aimCrossWhenDamage: nullable<Sprite>,
    aimCrossWhenDestroy: nullable<Sprite>,
    headShot: nullable<Sprite>,
    isShowingHeadShot: boolean,

    aimTarget: nullable<shootTarget>,
    lockTarget: nullable<shootTarget>,
    lockImage: nullable<Sprite>,



    bloodData: bloodData,

    rebornTime: number,

    lieTime: number,

    // qte: qte

    movableRanges: Array<xzRange>,


    lastDamageTime: number,

    actuallyMoveSpeedRecordInTwoSeconds: Array<{
        speed: number,
        time: millisecondUnit
    }>,
    lastPosition: nullable<Vector3>,

    hpIncrease: number,

    updateControlsWhenZoomOutToThirdPersonControlsFunc: (state: state) => state,
}





type staticLODData = [
    // typeof StaticLODContainer.StaticLODContainer,
    // any,
    StaticLODContainer,
    details,
    name
]

// export enum girlStateName {
//     Scenario,

//     Idle,
//     Walk,
//     Stomp,

//     Stressing,
//     // LightStressing,
//     // HeavyStressing,
//     Destroying,
//     Destroyed
// }

export enum objectStateName {
    Initial,

    Initial2,


    Scenario,

    Idle,
    // Walk,
    Run,
    // Stomp,

    // StandToCrawl,
    // CrawlToStand,
    // CrawlMove,
    KeepCrawl,
    // BreastPress,


    // Pickup,
    KeepPick,
    // Pickdown,
    // Pinch,
    // Eat,


    Move,

    Attack,

    MeleeAttack,
    RemoteAttack,



    Reborn,



    PickedControlled,
    UBControlled,
    BreastControlled,
    ShoeControlled,

    Lie,
    Standup,

    Climb,


    Fall,
    Repel,

    Flatten,




    // Excitement,

    // Damaged,

    Stressing,
    Destroying,
    Destroyed
}

// type objectStateName = string

export type treeAndProp = {
    treesAndProps: Array<staticLODData>,
    // damageAnimationStatusMap: ImmutableMap<name>,
    stateMachineMap: ImmutableMap<name, stateMachine<state>>,
    // defenseFactorMap: ImmutableMap<name, number>,
    hpMap: ImmutableMap<name, hp>,

    stressingTweens: Array<tween>,
}

// export type buildingFragments = Array<Mesh>

export type building = {
    // buildings: Array<[staticLODData, buildingFragments]>,
    buildings: Array<staticLODData>,

    // fragmentCubeOriginBox: nullable<Box3>,
    fragmentCubeQueue: nullable<LODQueue>,
    // aviailablefragmentCubeNames: Array<name>,
    reallocateFragmentCubeQueueIndex: Array<lodQueueIndex>,
    fragmentCubeQueueMaxCount: number,


    crackDecalLODQueueMap: ImmutableMap<name, LODQueue>,
    isAddCrackDecalMap: ImmutableMap<name, boolean>,

    stateMachineMap: ImmutableMap<name, stateMachine<state>>,
    // defenseFactorMap: ImmutableMap<name, number>,
    hpMap: ImmutableMap<name, hp>,

    ruinOriginBox: nullable<Box3>,
    ruinQueue: nullable<LODQueue>,
    aviailableRuinNames: Array<name>,

    stressingTweens: Array<tween>,
}

export type car = {
    cars: Array<staticLODData>,
    stateMachineMap: ImmutableMap<name, stateMachine<state>>,
    // defenseFactorMap: ImmutableMap<name, number>,
    hpMap: ImmutableMap<name, hp>,

    stressingTweens: Array<tween>,
}

// type lodQueueData = {
//     // LODQueue,
//     // details
//     queue: LODQueue,
//     lod: InstancedSkinLOD2
// }


export type dynamicCar = {
    // cars: Array<lodQueueData>,
    carMap: ImmutableMap<categoryName, LODQueue>,
    lodQueueIndexMap: ImmutableMap<name, lodQueueIndex>,

    moveTweenMap: ImmutableMap<name, Array<tween>>,
    stateMachineMap: ImmutableMap<name, stateMachine<state>>,
    // defenseFactorMap: ImmutableMap<name, number>,
    hpMap: ImmutableMap<name, hp>,

    stressingTweens: Array<tween>,
}


export type tile = {
    tiles: Array<staticLODData>
}

export type mountain = {
    mountains: Array<staticLODData>
}


// export type windMill = {
//     windMills: Array<staticLODData>,

//     wingTweenMap: ImmutableMap<name, tween>,
//     stateMachineMap: ImmutableMap<name, stateMachine<state>>,
//     defenseFactorMap: ImmutableMap<name, number>,
//     hpMap: ImmutableMap<name, hp>,
// }


export type terrain = {
    // terrain: nullable<Terrain>,
    // terrainVertices: nullable<{
    //     length: number,
    //     width: number,
    //     array: Array<number>
    // }>,
    terrainMesh: nullable<Mesh>,

    footDamageDecalOriginBox: nullable<Box3>,
    footDamageDecalQueue: nullable<LODQueue>,
    aviailableFootDamageDecalNames: Array<name>,

    rightFootPrintDecalOriginBox: nullable<Box3>,
    rightFootPrintDecalQueue: nullable<LODQueue>,
    aviailableRightFootPrintDecalNames: Array<name>,

    leftFootPrintDecalOriginBox: nullable<Box3>,
    leftFootPrintDecalQueue: nullable<LODQueue>,
    aviailableLeftFootPrintDecalNames: Array<name>,

    leftCommonShoePrintDecalOriginBox: nullable<Box3>,
    leftCommonShoePrintDecalQueue: nullable<LODQueue>,
    aviailableLeftCommonShoePrintDecalNames: Array<name>,

    rightCommonShoePrintDecalOriginBox: nullable<Box3>,
    rightCommonShoePrintDecalQueue: nullable<LODQueue>,
    aviailableRightCommonShoePrintDecalNames: Array<name>,


    heelShoePrintDecalOriginBox: nullable<Box3>,
    heelShoePrintDecalQueue: nullable<LODQueue>,
    aviailableHeelShoePrintDecalNames: Array<name>,
}

export type map = {
    wall: nullable<StaticLODContainer>,
    // wall: nullable<LODQueue>,

    // meshMap: ImmutableMap<resourceId, Mesh>,

    lastRogueMapIndex: nullable<number>,
}



export type grass = {
    // grasses: Array<Object3D>
    grass1: nullable<staticLODData>,
    // grass2: nullable<staticLODData>
    grass2: nullable<Mesh>
}

export type flower = {
    flower1_1: nullable<staticLODData>,
    flower1_2: nullable<staticLODData>,
    flower1_3: nullable<staticLODData>,
    flower1_4: nullable<staticLODData>,
    flower1_5: nullable<staticLODData>,
    flower1_6: nullable<staticLODData>,
    flower2: nullable<staticLODData>
}

export type plant = {
    echeveria: nullable<staticLODData>,
    purple_flower_patch: nullable<staticLODData>,
}

export type animated = {
    box: nullable<Object3D>
}


export type orbitControlsConfig = {
    position: Vector3,
    target: Vector3,
    // minDistance:number,
    // maxDistance: number,
}

export type thirdPersonControlsConfig = {
    // targetDirection: Vector3,
    position: Vector3,
}

// export type firstPersonControlsConfig = {
//     targetDirection: Vector3,
// }

export type pick = {
    boxCube: nullable<Box3Helper>
}

export enum missionFinishStatus {
    Fail,
    FailByDestoyed,
    Complete,
    End
}

type applyFuncForNextLevel = (state: state) => Promise<state>

export type mission = {
    startGameTimeForLevel: Moment,
    startGameTimeForWhole: Moment,
    isMissionFinish: boolean,

    startNowForLevel: millisecondUnit,

    allBuildingCount: number,
    destroyedBuildingCount: number,

    lastDestroyedRate: number,

    isEnteringNextLevel: boolean,
    completeLevelData: List<{
        sceneChapter: scene,
        levelNumber: number,
    }>,


    applyFuncsForNextLevel: List<applyFuncForNextLevel>,


    // doorImage: nullable<Sprite>,
    doorImage: nullable<Mesh>,
    // isWaiting: boolean,

    isShowEnterDoorToast: boolean,




    lockedAttackTargetToPlayer: boolean,
}

// export type scene = {
//     scene: nullable<Object3D>,
//     levelNumber: number,

//     allBuildingCount: number,
//     destroyedBuildingCount: number,
// }

export enum thirdPersonCameraTarget {
    Chest,
    Foot,
    Free,
}

export enum firstPersonCameraTarget {
    Eye,
    Leg,
}

export type upgradeLevel = number

export type damageData = {
    // lodContainerGroup: nullable<Group>,

    // isSelfFuncs: List<(categoryName: string) => boolean>,
    // damageFuncs: List<(state: state, octree: StaticLODContainer, [size, direction]: [number, Vector3], transforms: Array<number>, boxes: Array<Box3>, names: Array<name>) => [state, Array<string>]>,
    funcs: List<{
        isSelfFunc: (categoryName: string) => boolean,
        // damageFunc: (state: state, container: StaticLODContainer, [size, direction]: [number, Vector3], transforms: Array<number>, boxes: Array<Box3>, names: Array<name>) => Promise<[state, Array<string>]>,
        damageFunc: (state: state, forceData: [[number, Vector3], [damageType, weaponType]], weaponValue: weaponValue, fromName: name, damagePosition: nullable<Vector3>,
            // critRatioFactor: critRatioFactor, attackFactor: attackFactor,
            transform: Matrix4, box: Box3, name: name) => Promise<[state, string]>,
        getValueFunc: (state: state, name: name) => objectValue,
    }>,
    damageGiantessFunc: nullable<(state: state, usedGirl, [size, damageType, weaponType]: [number, damageType, weaponType],
        fromName: name,
        collisionPart: collisionPart, damagePosition: nullable<Vector3>,
        weaponValue_: weaponValue,
        // critRatioFactor: critRatioFactor,
        // attackFactor: attackFactor,
    ) => Promise<state>>,






    isEnableComboStorm: boolean,
    comboStormLayerCount: nullable<number>,
    lastComboStormDamageTime: nullable<number>,
    // computeDamageForceFunc: (state: state, name: name, fromName: name, forceSize: forceSize) => [state, forceSize],


    clothDamageEnhanceLevel: upgradeLevel,


    // fragileGrowthLevel: upgradeLevel,
    crazyLevel: upgradeLevel,


    // isEnableOldSoldierForLittleMan: boolean,
    // isEnableOldSoldierForGiantess: boolean,

    oldSoldierLevelForLittleMan: number,
    oldSoldierLevelForGiantess: number,

    oldSoldierHpForLittleMan: nullable<number>,
    oldSoldierHpForGiantess: nullable<number>,




    lifeCountForLittleMan: number,
    lifeCountForGiantess: number,
    isLifeCountSubForLittleMan: boolean,
    isLifeCountSubForGiantess: boolean,
}

type lodQueueIndex = number

export type skinLODData = LODQueue

export type categoryName = string

export type bloodData = {
    bloodDecalOriginBox: nullable<Box3>,
    bloodDecalQueue: nullable<LODQueue>,
    aviailableBloodDecalNames: Array<name>,
    bloodDecalScale: Vector3,
    bloodDecalQuaternion: Quaternion,
}

export type cityzen = {
    cityzenMap: ImmutableMap<categoryName, skinLODData>,
    stateMachineMap: ImmutableMap<name, stateMachine<state>>,
    // defenseFactorMap: ImmutableMap<name, number>,
    hpMap: ImmutableMap<name, hp>,

    moveTweenMap: ImmutableMap<name, Array<tween>>,

    // cityzen1Queue: nullable<LODQueue>,
    // cityzen2Queue: nullable<LODQueue>,
    // cityzen1Lod: nullable<InstancedSkinLOD2>,
    // cityzen2Lod: nullable<InstancedSkinLOD2>,

    lodQueueIndexMap: ImmutableMap<name, lodQueueIndex>,


    // shadowQueueMap: nullable<LODQueue>,
    shadowQueueMap: ImmutableMap<name, LODQueue>,

    bloodData: bloodData,
}

// type GLTF = {
//     scene: Object3D,
//     animations: Array<AnimationClip>
// }

// export type rocket = {
//     life: number,
//     size: number,
//     speed: number,
//     position: [number, number, number],
//     direction: [number, number, number],

//     fromName: name
// }

export type rocket = bulletEmitterParam

export type xzRange = {
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
}

export type commander = {
    // pointingRange: Array<xzRange>,
    pointingRangeMap: ImmutableMap<name, xzRange>,
}

export type soldier = {
    soldierMap: ImmutableMap<categoryName, skinLODData>,

    // glb: nullable<GLTF>,

    stateMachineMap: ImmutableMap<name, stateMachine<state>>,

    // defenseFactorMap: ImmutableMap<name, defenseFactor>,
    // moveSpeedMap: ImmutableMap<name, speed>,
    // attackFactorMap: ImmutableMap<name, attackFactor>,
    // emitSpeedFactorMap: ImmutableMap<name, emitSpeedFactor>,
    // critRatioFactorMap: ImmutableMap<name, critRatioFactor>,
    // missRatioMap: ImmutableMap<name,>,

    hpMap: ImmutableMap<name, hp>,

    moveTweenMap: ImmutableMap<name, Array<tween>>,

    lodQueueIndexMap: ImmutableMap<name, lodQueueIndex>,


    shadowQueueMap: ImmutableMap<name, LODQueue>,

    bloodData: bloodData,


    allClipDurations: ImmutableMap<categoryName, Array<number>>,
    allClipSteps: ImmutableMap<categoryName, Array<number>>,

    moveDataMap: ImmutableMap<name, Array<Vector2>>,

    // crowdPositions: Array<Vector3>,

    initialQuaternionMap: ImmutableMap<SoldierData.modelName, Quaternion>,

    // rocketQueue: nullable<LODQueue>,
    // rockets: Array<rocket>,

    commander: commander,
}

type queueName = string

type hierachyLODQueueData = ImmutableMap<queueName, HierachyLODQueue>
// type hierachyLODQueueData = Array<{
//     queue: HierachyLODQueue,
//     lod: InstancedLOD2
// }>

export type milltaryVehicle = {
    // tweens: Array<tween>,

    milltaryVehicleMap: ImmutableMap<categoryName, hierachyLODQueueData>,
    // tankWholeMap: ImmutableMap<categoryName, LODQueue>,

    // glb: nullable<GLTF>,

    // fireRayMap: ImmutableMap<name, Ray>,

    stateMachineMap: ImmutableMap<name, stateMachine<state>>,

    // defenseFactorMap: ImmutableMap<name, defenseFactor>,
    // moveSpeedMap: ImmutableMap<name, speed>,
    // attackFactorMap: ImmutableMap<name, attackFactor>,
    // emitSpeedFactorMap: ImmutableMap<name, emitSpeedFactor>,
    // critRatioFactorMap: ImmutableMap<name, critRatioFactor>,
    // missRatioMap: ImmutableMap<name,>,

    hpMap: ImmutableMap<name, hp>,

    moveTweenMap: ImmutableMap<name, Array<tween>>,
    fireTweenMap: ImmutableMap<name, Array<tween>>,

    lodQueueIndexMap: ImmutableMap<name, lodQueueIndex>,

    // allQueueLocalMatrices: nullable<[Matrix4, Matrix4, Matrix4]>,
    allQueueLocalMatricesMap: ImmutableMap<categoryName, Array<Matrix4>>,

    moveDataMap: ImmutableMap<name, Array<Vector2>>,

    // crowdPositions: Array<Vector3>,

    initialQuaternionMap: ImmutableMap<MilltaryVehicleData.modelName, Quaternion>,
}

export type milltaryBuilding = {
    milltaryBuildingMap: ImmutableMap<categoryName, hierachyLODQueueData>,

    stateMachineMap: ImmutableMap<name, stateMachine<state>>,

    // defenseFactorMap: ImmutableMap<name, defenseFactor>,
    // moveSpeedMap: ImmutableMap<name, speed>,
    // attackFactorMap: ImmutableMap<name, attackFactor>,
    // emitSpeedFactorMap: ImmutableMap<name, emitSpeedFactor>,
    // critRatioFactorMap: ImmutableMap<name, critRatioFactor>,
    // missRatioMap: ImmutableMap<name,>,

    hpMap: ImmutableMap<name, hp>,

    // moveTweenMap: ImmutableMap<name, Array<tween>>,
    fireTweenMap: ImmutableMap<name, Array<tween>>,

    lodQueueIndexMap: ImmutableMap<name, lodQueueIndex>,

    allQueueLocalMatricesMap: ImmutableMap<categoryName, Array<Matrix4>>,

    // moveDataMap: ImmutableMap<name, Array<Vector2>>,

    // shellTurretPositions: Array<Vector3>,
    // missileTurretPositions: Array<Vector3>,
    turretPositionMap: ImmutableMap<categoryName, Array<Vector3>>,

    initialQuaternionMap: ImmutableMap<MilltaryBuildingData.modelName, Quaternion>,
}



export type eliteGiantess = {
    animationDurationFactor: number,
}


export enum cameraRotateSpeed {
    VeryHigh = 2,
    High = 1.5,
    Middle = 1,
    Low = 0.7,
    VeryLow = 0.4
}


export type camera = {
    cameraType: cameraType,
    thirdPersonCameraTarget: thirdPersonCameraTarget,
    firstPersonCameraTarget: firstPersonCameraTarget,
    cameraZoom: number,

    freeThirdPersonCameraTargetYOffset: number,

    distanceRateData: [frameIndex, number],
    targetToCameraDirection: Vector3,

    savedCameraType: Record<characterType, cameraType>,
    savedCameraTarget: Record<characterType, Record<cameraType, string>>,

    savedFreeThirdPersonCameraTargetYOffset: number,

    // cameraRotateSpeed: cameraRotateSpeed,
    savedCameraRotateSpeed: Record<characterType, cameraRotateSpeed>,

    // savedThirdPersonCameraToTargetDistance: Record<characterType, number>,
    // savedThirdPersonCameraToTargetDistance: Record<characterType, number>,
    // savedThirdPersonCameraToTargetDistance: Record<characterType, Record<mmdCharacter, number>>,
    savedThirdPersonCameraToTargetDistance: Record<characterType, Record<mmdCharacter | modelName, number>>,



    orbitControlsConfig: nullable<orbitControlsConfig>,
    // thirdPersonControlsConfig: nullable<thirdPersonControlsConfig>,
}


export enum littleManThirdPersonCameraTarget {
    Body
}

type near = number

type far = number

type distance = number

export type littleManCamera = {
    cameraType: cameraType,
    thirdPersonCameraTarget: littleManThirdPersonCameraTarget,
    cameraZoom: number,

    // needRestoreData: nullable<[near, far, distance, cameraType]>,
    needRestoreData: nullable<[near, far, Vector3, Vector3, cameraType]>,

    // needRestoreDistanceToTarget: nullable<number>,


    // orbitControlsConfig: nullable<orbitControlsConfig>,
    // thirdPersonControlsConfig: nullable<thirdPersonControlsConfig>,
    // firstPersonControlsConfig: nullable<firstPersonControlsConfig>,


    targetDirection: nullable<Vector3>,
}

export type commandCompleteFunc = (state: state) => Promise<state>

export type command<Data> = (state: state, onCompleteFunc: nullable<commandCompleteFunc>, data: Data) => Promise<state>

type scenarioName = any

export type scenario = {
    isEnterScenario: boolean,

    allCommands: List<[nullable<commandCompleteFunc>, any, command<any>]>,

    currentScenarioName: nullable<scenarioName>,
}

export type gameEventName = any

export type gameEvent = {
    // isTriggerEvent: ImmutableMap<event, boolean>
    isStopGameEvent: boolean,


    currentMainEventName: nullable<gameEventName>,
    currentSubEventName: nullable<gameEventName>,

    customDataMap: ImmutableMap<string, any>,
}

export enum behaviourTreeNodeExecuteResult {
    Success,
    Fail,
    // Running
}

// export type behaviourTreeNodeResult = [state, behaviourTreeNodeExecuteResult]
export type behaviourTreeNodeResult = [state, any]

export type actionNodeFunc = (state: state, usedGirl: usedGirl, id: id, config: nullable<any>) => Promise<behaviourTreeNodeResult>

export type actionNode = {
    id: id,
    func: actionNodeFunc
}

// export type controlNode = (state: state, id: id, children: Array<behaviourTreeData>) => Promise<behaviourTreeNodeResult>
export type controlNode = (state: state, key: behaviourTreeKey, children: Array<behaviourTreeData>) => Promise<behaviourTreeNodeResult>

export enum attackRange {
    // Small,
    // Middle,
    // Big,

    InfinityRange = "InfinityRange",

    PrecisionStompRange = "PrecisionStompRange",
    RangeStompRange = "RangeStompRange",
    JumpStompRange = "JumpStompRange",

    SprayMilkRange = "SprayMilkRange",

    BreastPressRange = "BreastPressRange",
    CrawlLickRange = "CrawlLickRange",
    CrawlBeatRange = "CrawlBeatRange",
    PickRange = "PickRange",


    SitRange = "SitRange",
    // PrecisionSitRange = "PrecisionSitRange",
    SitRubRange = "SitRubRange",
}

export type behaviourTreeData = {
    name?: string,
    config?: (state: state, usedGirl: usedGirl) => any,
    conditionReturnSuccess: (state: state, usedGirl: usedGirl) => boolean,
    conditionReturnFail: (state: state, usedGirl: usedGirl) => boolean,
    actionNode: nullable<actionNode>,
    controlNode: nullable<controlNode>,
    children: Array<behaviourTreeData>
}

export enum targetType {
    LittleMan,
    Building,
    Cityzen,
    Soldier,
    MilltaryVehicle,
    MilltaryBuilding,
    EliteGiantess,
}

export type targetData = {
    isAliveFunc: (state: state) => boolean,
    getPositionFunc: (state: state) => Vector3,
    getStateMachineFunc: (state: state, name: name) => stateMachine<state>,

    // position: Vector3,
    type: targetType,
    index: nullable<number>,
    name: name,
}

export type behaviourTreeKey = string

export enum attackAction {
    None = "None",

    Rest = "Rest",

    Bigger = "Bigger",

    Stomp = "Stomp",
    StompRub = "StompRub",
    LeftStomp = "LeftStomp",
    JumpStomp = "JumpStomp",

    SprayMilk = "SprayMilk",
    PutToBreast = "PutToBreast",
    PutToShoe = "PutToShoe",

    FreeUB = "FreeUB",
    FreeBreast = "FreeBreast",
    FreeShoe = "FreeShoe",

    Pickup = "Pickup",
    Pinch = "Pinch",
    Eat = "Eat",
    BreastPress = "BreastPress",
    BreastPressRub = "BreastPressRub",
    CrawlLick = "CrawlLick",
    CrawlBeat = "CrawlBeat",
    Thrust = "Thrust",
    Insert = "Insert",

    SitRub = "SitRub",
    TightenLeg = "TightenLeg",
}

export enum personality {
    Strategic = "Strategic",
    Aggressive = "Aggressive",
    Defensive = "Defensive",
    Playful = "Playful",
}

export type singleBehaviourTreeData = {
    dataMap: ImmutableMap<behaviourTreeKey, behaviourTreeData>,
    isRunningMap: ImmutableMap<behaviourTreeKey, boolean>,
    finishedDataMap: ImmutableMap<behaviourTreeKey, [id, behaviourTreeNodeExecuteResult]>,

    targetData: nullable<targetData>,
    attackAction: nullable<attackAction>,
    // targetDataMap: ImmutableMap<behaviourTreeKey, targetData>,
    // lastGirlPosition:nullable<Vector3>,
    lastChangePoseTime: nullable<millisecondUnit>,
    lastSetTargetTime: nullable<millisecondUnit>,
    // lastHardTime: nullable<millisecondUnit>,



    idMap: ImmutableMap<string, id>,
    // customDataMap: ImmutableMap<string, any>,
    // isNotExecuteGiantessAI: boolean,

    isNotExecuteGiantessAI: boolean,

    personality: personality,
}

export type behaviourTree = {
    data: Record<usedGirl, singleBehaviourTreeData>,
}

export type ui = {
    uiUpdateLoopCount: number,


    // needShowSkillBar: boolean,
    // needShowSkillBar: Record<usedGirl, boolean>,

    // intervalId: number,

    isShowingUILightTip: boolean,
    lightUITips: Array<string>,

    openedModalCount: number,

    isShowGemAnimation: boolean,
    isShowCoinAnimation: boolean,
    isGenerateProp: boolean,
    isShowUpgradeParticle: boolean,
    isShowBuildingSmoke: boolean,
    isShowExplosionSmoke: boolean,
    isEliteGiantePlayDeathAnimation: boolean,

    isFullScreenFlag: boolean,

    isHideUI: boolean,

    bossStatusUpdateFunc: nullable<(state: state, usedGirl: usedGirl) => state>,
}

export type configData = {
    operateRenderData: operateRenderData,

    littleManOperateRenderData: nullable<littleManOperateData>,


    getCollisionShapeDataFunc: (state: state) => data<any, pose, any>,
    collisionShapeData: nullable<data<any, pose, any>>,
    // originCollisionShapeData: nullable<data<any, pose, any>>,
    animationBlendData: animationBlendData<animationName>,
    animationCollisionData: Array<animationCollisionData<animationName>>,
    actionData: actionData<animationName>,
    phaseData: phaseData<animationName>,

    girlAllAnimationFrameCountMap: Record<animationName, number>,
    girlAllAnimationNames: nullable<Array<animationName>>,
    articluatedAnimationData: Array<articluatedAnimationData<any>>,
    girlAnimationData: Partial<Record<animationName, animationData>>,

    // girlValue: nullable<girlValue>,
    girlValueMap: ImmutableMap<usedGirl, girlValue>,

    // gameEventData: gameEventData<any>,
    gameEventData: nullable<gameEventData<any>>,
    scenaryData: nullable<scenarioData<any, any>>,

    gameEventDirectorData: nullable<gameEventDirectorData>,

    allMMDData: allMMDData,
    clothCollisionData: clothCollisionData<collisionPart>,
    // clothHpData: nullable<clothHpData>,
    clothHpDataMap: ImmutableMap<usedGirl, clothHpData>,
    firstPersonControlsData: firstPersonControlsData,
    shoeData: shoeData,



    behaviourTreeDataMap: ImmutableMap<behaviourTreeKey, BehaviourTreeDataType.behaviourTreeData<any>>,


    littleManAnimationBlendData: LittleManDataType.animationBlendData<LittleManDataType.animationName>,
    littleManAnimationCollisionData: Array<LittleManDataType.animationCollisionData>,
    littleModelData: Array<modelData>,
    littleManSkillData: skillData,

    littleManValue: nullable<littleManValue>,


    soldierModelData: Array<SoldierData.modelData>,
    milltaryVehicleData: Array<MilltaryVehicleData.modelData>,
    milltaryBuildingData: Array<MilltaryBuildingData.modelData>,

    // eliteGiantessModelData: Array<EliteGiantessData.modelData>,

    rewardData: nullable<rewardData>,
    buildData: nullable<buildData>,
}

// export enum mode {
//     Giantess,
//     LittleMan
// }


export enum result {
    Success,
    Fail,
}


export enum armyCount {
    High,
    Middle,
    Low,
    None
}

// export enum weaponStrength {
//     High,
//     Middle,
//     Low
// }

export enum giantessStrength {
    VeryHigh,
    High,
    Middle,
    Low
}

export enum littleManStrength {
    // VeryHigh,
    High,
    Middle,
    Low
}

export enum giantessScale {
    Low,
    Middle,
    High,
    VeryHigh,
    MostHigh,
}

export enum biggerFrequency {
    Low,
    Middle,
    High
}

export enum propCount {
    Infinity,
    High,
    Middle,
    Low
}

export enum excitementIncrease {
    High,
    Middle,
    Low
}

// export type littleManSetting = {
//     armyCount: armyCount,
//     giantessStrength: giantessStrength,
//     littleManStrength: littleManStrength,
//     giantessScale: giantessScale,
//     biggerFrequency: biggerFrequency,
//     propCount: propCount,
//     isBiggerNoLimit: boolean,
// }

// export type giantessSetting = {
//     armyCount: armyCount,
//     giantessStrength: giantessStrength,
//     giantessScale: giantessScale,
//     excitementIncrease: excitementIncrease,
//     isBiggerNoLimit: boolean,
// }

// export enum targetPrior = targetType
// export enum targetPrior {
//     None,
//     LittleMan,
//     Building,
//     Cityzen,
//     Soldier,
//     MilltaryVehicle,
//     MilltaryBuilding,
//     EliteGiantess,
// }

// export type littleManSettingInGame = {
//     // selectTargetPrior: nullable<targetPrior>,
//     selectTargetPrior: 
//     // isSelectLittleManPrior: boolean,
//     // isSelectTankPrior: boolean,
//     // isSelectSoldierPrior: boolean,
//     // isSelectBuildingPrior: boolean,
//     // isSelectCityzenPrior: boolean,
// }

// export enum camp {
//     None,
//     // Giantess,
//     // LittleMan
//     Player,
//     Enemy,
//     Giantess,
// }

export type camp = campAbstract
export const camp = { ...campAbstract }


export enum attackTargetExtend {
    None,
    Giantess,
    LittleMan,

    // Soldier,
    // MilltaryBuilding,
    // MilltaryVehicle,

    // EliteGiantess,
    Object,
    Building,
}
// export type attackTarget = collisionPart | attackTargetExtend
// export const attackTarget = { ...collisionPart, ...attackTargetExtend }
export type attackTarget = attackTargetExtend
export const attackTarget = { ...attackTargetExtend }

export type attackTargetObjectData = {
    name: name,
    getPositionFunc: (state: state) => Vector3,
    getBoxFunc: (state: state) => Box3,
}

export type army = {
    attackTargetMap: Map<name, attackTarget>,
    attackTargetObjectDataMap: Map<name, attackTargetObjectData>,
    attackTargetUsedGirlMap: Map<name, usedGirlEnum>,

    campMap: Map<name, camp>,

    crowdPositions: Array<Vector3>,
    // generatedCrowdPositions: Array<Vector3>,
    validCrowdPositions: Array<Vector3>,
    isShowNoValidCrowdPositionsTip: boolean,

    lastJudgeRayCastTimeMap: Map<name, number>,
    lastJudgeRayCastResultMap: Map<name, boolean>,

    deferDisposeDataNames: Array<[name, lodQueueIndex]>,

    isLightStressingMap: Map<name, boolean>,

    isEliteGiantessAttackingMap: Map<name, boolean>,

    lastAttackFrameMap: Map<name, frameIndex>,

    isNeedRefindPathMap: Map<name, boolean>,


    isNotAttackLittleManTime: nullable<number>,

    allArmyContainers: Array<LODQueue>,


    // defenseFactorMap: ImmutableMap<name, defenseFactor>,
    // moveSpeedMap: ImmutableMap<name, speed>,
    // attackFactorMap: ImmutableMap<name, attackFactor>,
    // emitSpeedFactorMap: ImmutableMap<name, emitSpeedFactor>,
    // critRatioFactorMap: ImmutableMap<name, critRatioFactor>,
    // missRatioMap: ImmutableMap<name,>,




    getPositionYFuncMap: Map<string, (state: state, x: number, z: number) => number>,

    updateLittleManWeaponFunc: (state: state, weaponName: weaponName, weaponValue: weaponValue) => weaponValue,

    addHitEffectFunc: nullable<(state: state, fromName: name, targetName: name, damagePosition: nullable<Vector3>, damageType_, weaponValue_: weaponValue, armorType_: armorType) => state>,
}

export type armyDirector = {
    // armyCountRatio: number,
}

export type minuteUnit = number

export type secondUnit = number

export type millisecondUnit = number

export type singleImpendingGameEventData = {
    // conditionFunc: (state: state) => boolean,

    // eventName: eventName_,
    // gameEventName: gameEventName,
    eventName: any,
    gameEventName: any,
    title: string,
    description: string,
    time: millisecondUnit,
    isAlreadyShowedUIInfo: boolean,
}

export type singleInstantGameEventData = {
    // eventName: eventName_,
    // gameEventName: gameEventName,
    eventName: any,
    gameEventName: any,
    title: string,
    description: nullable<string>,
    // time: millisecondUnit,
    // isAlreadyShowedUIInfo: boolean,
}

export type gameEventDirector = {
    // gtsPoints: Array<Vector3>,

    customData: ImmutableMap<string, any>,

    selectedGameEvents: List<eventName>,

    isTriggeredMap: ImmutableMap<eventName, boolean>,

    // impendingGameEventData: List<singleImpendingGameEventData>
    impendingGameEventData: nullable<singleImpendingGameEventData>
    instantGameEventData: List<singleInstantGameEventData>
}

export type propOnGround = {
    name: propName,
    title: string,
    description: string,
    position: Vector3,
    count: number,
    image: Sprite,
    imageSrc: string,
}

export type propNotOutLevelBuild = {
    name: propName,
    count: number,
}


// export type coinOnGround = {
//     position: Vector3,
//     // count: number,
//     image: Sprite,
// }

export type reward = {
    gem: number,
    levelGem: number,

    coin: number,
    levelCoin: number,
    // coinsOnGround: List<coinOnGround>,
    // isHandleGetCoinOnGround: boolean,

    props: List<propData>,
    propsOnGround: List<propOnGround>,
    propsNotOutLevelBuild: List<propNotOutLevelBuild>,
    isHandleGetPropOnGround: boolean,
    // disabledProps: List<propName>,

    isEnableLuckDogForLittleMan: boolean,
    isEnableLuckDogForGiantess: boolean,

    lastGemHitTime: nullable<millisecondUnit>,
    lastCoinHitTime: nullable<millisecondUnit>,

    itemPriceFactor: number,
    coinFactor: number,
    propCountFactor: number,
}


// export enum difficulty {
//     VeryEasy,
//     Easy,
//     Middle,
//     Hard,
//     VeryHard
// }

// export type biwuSetting = {
//     difficulty: difficulty
// }



export enum climbPlane {
    None,
    Verticle,
    Horrizon,
}

export enum climbDirection {
    None,
    Verticle,
    Horrizon,
}


export type climb = {
    climbPlane: climbPlane,
    currentCollisionNormal: Vector3,
    // lastVelocity: Vector3,
    currentClimbedOBB: nullable<OBB>,
    // rayStartPointOffsetForComputeNextCollisionNormal:Vector3,

    beforeCameraType: nullable<cameraType>,

    translation: nullable<Vector3>,

    isPlayingAnimation: boolean,

    notClimbCollisionParts: Array<any>,
    notOnCollisionParts: Array<any>,
}

export type levelData = {
    level: number,
    experienceValue: number,
    lastExperienceValueWhenUpgradeLevel: number,

    lastHandledLevelForUpgrade: number,

    lastHandledLevelForSelectItem: number,

    // enforceFuncs: Array<(state: state) => state>,
}

export enum upgradeInteractionWay {
    Auto,
    Manual,
}

export type level = {
    upgradeInteractionWay: upgradeInteractionWay,

    isWait: boolean,
    isSaveState: boolean,
    savedfirstPersonControlData: nullable<[number, number]>,

    // isGiveTipOnce: boolean,

    isApplying: boolean,

    isSelectItems: boolean,

    changeNeedCoin: Record<characterType, number>,

    littleMan: levelData,
    giantess: levelData,

    littleManNotWantCurrentUpgradeItems: Array<littleManUpgradeName>,
    giantessNotWantCurrentUpgradeItems: Array<giantessUpgradeName>,

    littleManUpgradeFuncs: Array<upgradeFuncData>,
    giantessUpgradeFuncs: Array<upgradeFuncData>,
}

// export type careerApplyFunc = (state:state) => Promise<state>

// export type name = string

export enum needGem {
    Zero = 0,
    // VeryLow = 500,
    // // Low = 5000,
    // Low = 1000,
    // // Middle = 10000,
    // Middle = 2000,
    // // High = 20000,
    // // VeryHigh = 40000,
    // // MostHigh = 80000,
    // High = 4000,
    // VeryHigh = 8000,

    // MostHigh = 50000,
    VeryLow = 250,
    // Low = 5000,
    Low = 500,
    // Middle = 10000,
    Middle = 1000,
    // High = 20000,
    // VeryHigh = 40000,
    // MostHigh = 80000,
    High = 2000,
    VeryHigh = 4000,
    VeryHigh2 = 6000,
    VeryHigh3 = 8000,

    // MostHigh = 80000,
    // MostHigh = 50000,
    MostHigh = 10000,
}

export type careerData = {
    name: string,
    title: string,
    imageSrc: string,

    needGem: number,


    // characterType?: characterType,

    // getCareerFeatureData: (state:state) => Array<[
    //     careerFeatureName, careerFeatureValue
    // ]>
    getCareerFeatureData: (state: state) => Record<
        careerFeatureName, careerFeatureValue
    >
    // getPositiveDescriptionFunc: (state: state) => Array<string>,
    // getNegativeDescriptionFunc: (state: state) => Array<string>,
    // applyFunc: (state: state, characterType: characterType) => Promise<state>,
}

type randomNumber = number

export type career = {
    // littleManData: nullable<careerData>,
    // giantessData: nullable<careerData>,
    littleManData: Array<careerData>,
    giantessData: Array<careerData>,

    isUseFullHpReplaceCoinCharacterTypes: Array<characterType>,
    // lastTime: Record<careerFeatureName, millisecondUnit>,
    lastTime: Record<careerFeatureName, Record<randomNumber, millisecondUnit>>,
    ubCapacityFactor: number,
    isControlledUnitCanAttack: boolean,
    enhenceByCarryLevel: number,
    expFactor: Record<characterType, number>,

    needGem: Record<characterType, number>,

}

export type talent = {
    talentData: talentData,

    // affectedUsedGirls: Array<usedGirlEnum>,
}

export type build = {
    level: level,

    career: career,

    // littleManTalentMap: ImmutableMap<modelName, singleTalentData>,
    // littleManTalentData: talentData,
    // giantessTalentData: talentData,
    talent: talent,
}

export type character = {
    littleManCharacters: List<{
        modelName: modelName,
        isAlive: boolean
    }>,
    giantessCharacters: List<{
        mmdCharacter: mmdCharacter,
        isAlive: boolean
    }>,
}

export enum bulletPropName {
    // BasicBullet = "普通子弹",
    // LaserBullet = "激光子弹",
    // RocketBullet = "火箭弹",
    // BiggerBullet = "变大子弹",
    // SmallerToLastBiggerCount = "缩小子弹",
    // BasicBullet = "1",
    LaserBullet = "LaserBullet",
    RocketBullet = "RocketBullet",
    // BiggerBullet = "4",
    // SmallerToLastBiggerCount = "5",
    // SubMachineBullet = "6",
}

export enum waterPropName {
    // AddHp1 = "加血（小）",
    // AddHp2 = "加血（中）",
    // AddHp3 = "加血（大）",
    // AddHp4 = "加血（极大）",
    // AddExcitement1 = "加兴奋（小）",
    // AddExcitement2 = "加兴奋（中）",
    // AddExcitement3 = "加兴奋（大）",
    // AddExcitement4 = "加兴奋（极大）",

    AddHp1 = "AddHp1",
    AddHp2 = "AddHp2",
    AddHp3 = "AddHp3",
    AddHp4 = "AddHp4",
    AddExcitement1 = "AddExcitement1",
    AddExcitement2 = "AddExcitement2",
    AddExcitement3 = "AddExcitement3",
    AddExcitement4 = "AddExcitement4",
}

export enum assistantPropName {
    // CallGiantess = "召唤巨大娘",
    // ClearHatred = "清除仇恨",

    CallGiantess = "CallGiantess",
    ClearHatred = "ClearHatred",
}


export enum otherPropName {
    // Revive = "复活石",
    Revive = "Revive",
}

export type propName = bulletPropName | waterPropName | assistantPropName | otherPropName | string
export const propName = {
    ...bulletPropName,
    ...waterPropName,
    ...assistantPropName,
    ...otherPropName
}

export enum propType {
    // None = "无",
    // Bullet = "子弹",
    // Water = "补品",
    // Assistant = "辅助",
    // Other = "其它",


    None = "0",
    Artifact = "1",
    Bullet = "2",
    Water = "3",
    Assistant = "4",
    Other = "5",
}

export type propData = {
    name: propName,
    title: string,
    description: string,
    imageSrc: string,
    count: number,
    type: propType,
    // typeTitle: string,

    characterType: characterType,
    isOutLevelBuild: boolean,

    // isDisable?: (state: state, name: propName) => boolean,
}

export type propDataBackend = {
    name: propName,
    count: number,
}

// export type prop = {
// }


export enum autoDifficulty {
    VeryEasy = 0,
    Easy = 1,
    Middle = 2,
    Hard = 3,
    VeryHard = 4,
    VeryHard1 = 5,
    VeryHard2 = 6,
    VeryHard3 = 7,
    VeryHard4 = 8,
    VeryHard5 = 9,
}

// type autoDifficulty = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5
// type autoDifficulty = 0 | 1 | 2 | 3 | 4 | 5


type ratio = number

type difficultyLevel = number

export type difficulty_ = {
    difficultyData: ImmutableMap<scene, ImmutableMap<levelNumber, difficultyData<any>>>,

    autoDifficultyForLittleMan: autoDifficulty,
    autoDifficultyForGiantess: autoDifficulty,


    armyCountRatio: ratio,
    eliteArmyCountRatio: ratio,
    enemyDamageRatio: ratio,
    restoreHpRatio: ratio,
    enemyHpRatio: ratio,

    enhenceArmyLevel: difficultyLevel,
    enhenceEliteGiantessLevel: difficultyLevel,
    enhenceLevelGiantessLevel: difficultyLevel,
    maxMMDGiantessCountLevel: difficultyLevel,
    isAllowFriendDamage: boolean,
    isRemoveMapEdgeZone: boolean,

    enhenceBossGiantessLevel: difficultyLevel,


    enhenceArmyFactor: number,
    enhenceEliteGiantessFactor: number,
    enhenceLevelGiantessFactor: number,

    duelistFactor: number,

    decreaseGenerateArmyIntervalRatio: ratio,
}

// export enum timeMode {
//     Default,
//     Special,
// }

// type randomNumber = number
export type specialTimeKey = string

export type time = {
    stopLoopTime: nullable<millisecondUnit>,
    deferTime: millisecondUnit,

    // mode: timeMode,
    // lastTime: Record<timeMode, millisecondUnit>,
    // startSpecialTime: Record<specialTimeKey, millisecondUnit>,
    startSpecialTime: nullable<millisecondUnit>,
    specialTimeKey: nullable<specialTimeKey>,
    specialTimeDuration: secondUnit,
}

export type tweenManager = {
    tweens: Array<tween>,
    tweensMap: Record<string, tween>,
}

export type debug = {
    hpMap: ImmutableMap<name, number>,
}

type getBoxFunc = (state: state) => Box3

type getHpRatioFunc = (state: state) => ratio

type progressValue = { value: number }

export enum playerStateStatusName {
    IncreaseMoveSpeed,
    IncreaseActionSpeed,
    // DecreaseActionSpeed,

    ActiveBiggerNumber,
    // PassiveBiggerAddedScaleNumber,

    ComboStormNumber,
    OldSoldierNumber,

    ClearHatred,

    // Strong,

}

export enum bossStateStatusName {
    // IncreaseMoveSpeed,
    IncreaseActionSpeed,
    DecreaseActionSpeed,

    ActiveBiggerNumber,

    Hard,
    UnDamage,
}

export type playerStateStatusName_ = playerStateStatusName | string

export type bossStateStatusName_ = bossStateStatusName | string

export type playerStateStatusData = {
    name: playerStateStatusName_,
    number: nullable<number>,
    characterType: characterType,
    isPositive: boolean,
    imageSrc: string,
    description: string,
}

export type bossStateStatusData = {
    name: bossStateStatusName_,
    // number: nullable<number>,
    number: nullable<string | number>,
    isPositive: boolean,
    imageSrc: string,
    description: string,
}

export type playerStateStatus = {
    status: List<playerStateStatusData>
}

export type bossStateStatus = {
    // status: List<bossStateStatusData>
    status: ImmutableMap<usedGirl, List<bossStateStatusData>>

    // currentUsedGirl: usedGirl,
}


export type status = {
    // showStatusData: ImmutableMap<staticLODContainerIndex | lodQueueIndex, [getBoxFunc, getHpRatioFunc, progressValue, [Sprite, Sprite]]>,
    // showStatusData: ImmutableMap<name, [getBoxFunc, getHpRatioFunc, progressValue, [Sprite, Sprite]]>,
    showStatusData: ImmutableMap<name, [getBoxFunc, getHpRatioFunc, progressValue, Sprite]>,
    markStatusData: ImmutableMap<name, [getBoxFunc, Sprite]>,
    // dataPool: List<[Sprite, Sprite]>,

    isNotDamage: ImmutableMap<name, boolean>,

    playerStateStatus: playerStateStatus,
    bossStateStatus: bossStateStatus,
}


export type singleBuff = {
    buffName: buffName,
    imageSrc: string,

    characterType: characterType,

    // target: target,
    name: name,
    usedGirl: nullable<usedGirl>,
    // usedGirl: usedGirl,

    superPositionCount: number,
    time: secondUnit,
    // maxSuperPositionCount: number,

    sumValue: number,


    isPositive: boolean,


    isWorkInContinueLevels?: boolean,

    getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => string,
}

type buffKey = string

export type buff = {
    // buffs: List<singleBuff>,
    // remainedBuffsForNextLevel: List<singleBuff>,

    buffs: Record<buffKey, singleBuff>,
    remainedBuffsForNextLevel: Record<buffKey, singleBuff>,

    sumValueMap: Record<buffName, Record<name, number>>,
}

export type staticDynamicUnit = {
    defenseFactorMap: ImmutableMap<name, defenseFactor>,
    moveSpeedMap: ImmutableMap<name, speed>,
    attackFactorMap: ImmutableMap<name, attackFactor>,
    emitSpeedFactorMap: ImmutableMap<name, emitSpeedFactor>,
    // emitterLifeFactorMap: ImmutableMap<name, emitterLife>,
    critRatioFactorMap: ImmutableMap<name, critRatioFactor>,
    // missRatioMap: ImmutableMap<name,>,
}

export enum interactionName {
    ChestBox,
    TradeGirl,
    // WarGirl,
    // BlessGirl,
    FateGirl,
}

export type interaction = {
    // chestBox: nullable<LODQueue>,
    queues: Array<LODQueue>,

    isUsedMap: ImmutableMap<name, boolean>,

    // currentInteractioName: nullable<interactionName>,
    currentInteractioData: nullable<[LODQueue, lodQueueIndex]>,
    // isTriggeringEvent: boolean,

    tradeVarietyFactor: number,
    freeBuyCount: number,
}


export enum cameraFarLevel {
    Normal,

    VeryHigh,
    High,
    Middle,
    Low,
}

export type mod = {
    api: api,
    // renderAccuracy: renderAccuracyLevel,
    cameraFar: cameraFarLevel,
    allBlockNames: Array<blockName>,

    allServicesCache: Map<string, blockService>,

    // giantessStressingRate: number,
}


// export enum destroyUnit {
//     Soldier,
//     MilltaryVehicle,
//     MilltaryBuilding,
//     EliteGiantess,
//     LevelGiantess,
//     Other,
// }

type namePrefix = string

export type littleManStatistic = {
    totalDamageForce: number,
    destroyUnitCountMap: Record<namePrefix, number>,
}

export type giantessStatistic = {
    totalDamageForce: number,
    destroyUnitCountMap: Record<namePrefix, number>,
}

export type statistic = {
    littleMan: littleManStatistic,
    giantess: giantessStatistic,
}

export type internation = {
    textData: dataInternation,
    textDataByVariable: variableData,
    imageData: imageData,
}


type characterFastPropData = ImmutableMap<number, {
    usePropFunc: any,
    propName: string,
    propImageSrc: string,
}>

export type fastProp = {
    littleMan: characterFastPropData,
    giantess: characterFastPropData,
}

// type pxStr = string
type rem = number

export type operate = {
    savedOperatePosition: Record<characterType,
        Record<actionName, {
            // left: pxStr,
            // top: pxStr,
            right: rem,
            bottom: rem,
        }>
    >,
    isStartDrag: boolean,
}

export enum role {
    None = 0,
    Player = 1,
    Vip = 2,
}

export enum activeType {
    No = 0,
    Full = 1,
}

export type day = number

export type momentMillisecondUnit = number

export type user = {
    isLogin: boolean,

    registerTime: nullable<momentMillisecondUnit>,
    // lastLoginTime: nullable<millisecondUnit>,
    lastGetRewardTime: nullable<momentMillisecondUnit>,
    // wholeGameTime: nullable<millisecondUnit>,
    role: role,
    activeType: activeType,
    activeDuration: day,
    activeTime: nullable<momentMillisecondUnit>,
    activeCode: nullable<string>,
    lastActiveTime: nullable<momentMillisecondUnit>,
}

export type cityScene = {
    debug: debug,

    time: time,

    tweenManager: tweenManager,

    isFirstEnter: boolean,
    // isMustStopLoop: boolean,
    isMustStopLoop: boolean,
    isDisposed: boolean,

    scene: nullable<Object3D>,

    sceneChapter: scene,
    levelNumber: levelNumber,
    levelData: ImmutableMap<string, any>,

    // mode: mode,

    damageData: damageData,

    camera: camera,

    littleManCamera: littleManCamera,

    // octree: StaticLODContainer,
    // octreeHelper: nullable<OctreeHelper>,

    girl: girl,

    littleMan: littleMan,

    grass: grass,
    // flower: flower,
    // plant: plant,
    treeAndProp: treeAndProp,
    terrain: terrain,
    // animated: animated,
    pick: pick,
    // otherGirls: otherGirls,

    building: building,
    car: car,

    tile: tile,
    mountain: mountain,

    // windMill: windMill,
    dynamicCar: dynamicCar,

    cityzen: cityzen,
    soldier: soldier,

    milltaryVehicle: milltaryVehicle,
    milltaryBuilding: milltaryBuilding,


    // eliteGiantess: eliteGiantess,


    army: army,

    map: map,
    mission: mission,

    scenario: scenario,
    gameEvent: gameEvent,

    behaviourTree: behaviourTree,

    ui: ui,

    configData: configData,

    // littleManSetting: littleManSetting,
    // giantessSetting: giantessSetting,

    // littleManSettingInGame: littleManSettingInGame,

    // biwuSetting: biwuSetting,

    climb: climb,

    reward: reward,
    build: build,
    // prop: prop,

    character: character,

    armyDirector: armyDirector,
    gameEventDirector: gameEventDirector,

    difficulty: difficulty_,

    status: status,

    buff: buff,

    staticDynamicUnit: staticDynamicUnit,

    interaction: interaction,

    mod: mod,

    statistic: statistic,

    internation: internation,

    fastProp: fastProp,

    eliteGiantess: eliteGiantess,

    operate: operate,

    user: user,


}

import type { WebGLRenderer, Object3D, Camera, Vector2, Raycaster, InstancedMesh, Scene, Group, Vector3, Mesh, PerspectiveCamera, OrthographicCamera, Texture, Box3, Box3Helper, SkinnedMesh, Quaternion, Sphere, Ray, Matrix4, Bone, Euler, AnimationClip, Sprite } from "three"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import type { List, Map } from "immutable"
import type { Capsule } from "three/examples/jsm/math/Capsule"
// import type { StaticLODContainer } from "meta3d-jiehuo-abstract/src/three/StaticLODContainer"
import type { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { cameraType, state } from "../../../../type/StateType"
// import { Terrain } from "meta3d-jiehuo-abstract/src/terrain/Terrain"
import { ScreenShake } from "meta3d-jiehuo-abstract"
import { bulletEmitterParam, details, fsm_state, id, stateMachine, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { StaticLODContainer } from "meta3d-jiehuo-abstract/src/lod/lod2/StaticLODContainer";
import { MMDAnimationHelper } from "meta3d-jiehuo-abstract/src/three/MMDAnimationHelper";
import { OBB } from "meta3d-jiehuo-abstract/src/three/OBB";
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue";
import { Moment } from "moment";
import { actionData, actionName, animationBlendData, animationCollisionData, animationName, articluatedAnimationData, frameIndex, phaseData } from "../data/DataType";
import * as BehaviourTreeDataType from "../data/behaviour_tree_data/BehaviourTreeDataType";
import * as LittleManDataType from "../little_man_data/DataType";
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD";
import { girlValue, objectValue, weaponType } from "../data/ValueType";
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedSkinLOD2";
import { eventName, data as gameEventData } from "../data/GameEventData";
import { data as scenarioData } from "../data/ScenarioData";
import { InstancedLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedLOD2";
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue";
import { data } from "../data/ScenarioData";
import { operateRenderData } from "../girl/Pose";
import * as CollisionShapeData from "../data/CollisionShapeData"
import { status } from "meta3d-jiehuo-abstract/src/lod/lod2/LODContainerType";
import { allMMDData, clothCollisionData, clothHpData, firstPersonControlsData, mmdCharacter, shoeData } from "../data/mmd/MMDData";
import { modelData, modelName } from "../little_man_data/ModelData";
import * as SoldierData from "../army_data/SoldierData";
import * as MilltaryVehicleData from "../army_data/MilltaryVehicleData";
import * as MilltaryBuildingData from "../army_data/MilltaryBuildingData";
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType";
import { skillData } from "../little_man_data/SkillData";
import { littleManValue } from "../little_man_data/ValueType";


export enum damageType {
    Normal,
    Direct,
    Range,
}


export enum collisionPart {
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

// export type isComputeObjectCollisionMap = Map<name, boolean>

export type phase = number

export enum otherPhase {
    None
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

export enum stompPhase {
    Up,
    Down,
    Range
}


export enum standToCrawlPhase {
    ShankDown,
    HandDown,
}

export enum crawlToStandPhase {
    HandUp,
}

export enum breastPressPhase {
    Down,
    Up,
}


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
    Pinch
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
}

type hp = number

export enum soundType {
    Laugh
}

export type force = [number, Vector3]

// export enum action {
//     Idle,
//     Walk,
//     Stomp
// }

// export type command = {
//     execute: <Data> (state: state, data: Data) => Promise<state>
// }

type boneName = string

export type giantessAddToSkeletonData = {
    getTransformFunc: (state: state, transform: Matrix4, handBox: Box3) => Matrix4,
    updateTransformFunc: (state: state, queue: nullable<LODQueue>, index: lodQueueIndex, parentTransform: Matrix4, localTransform: Matrix4) => state,
    // getModelQueueIndexFunc: (state: state, name: name) => lodQueueIndex,
    // handlePickupFunc: (state: state, name: name) => state,
    getLocalTransformFunc: (state: state, queue: nullable<LODQueue>, index: lodQueueIndex, name: name) => Matrix4,
    getBoxFunc: (state: state, queue: nullable<LODQueue>, index: lodQueueIndex, name: name) => Box3,



    queue: nullable<LODQueue>,
    index: lodQueueIndex,
    name: name,
    // box:Box3,
    // transform:Matrix4,

    originTransform: Matrix4,

    // girlScaleWhenPickup:number,

    // handBox: Box3,
}

export enum actionState {
    Initial,
    Run,
}

export enum littleManActionState {
    Initial,
    Attack,
    Lie
}

export enum scaleState {
    Normal,
    Big
}

export enum particleNeedCollisionCheckLoopFrames {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4
}

export enum uiUpdateLoopFrames {
    Short = 7,
    Middle = 10,
    Long = 15,
}

export type clothName = string

export type damagePart = "本体" | clothName

export type girlStatus = {
    damagePart: damagePart
}

export type girl = {
    stateMachine: stateMachine<state>,

    currentMMDCharacter: mmdCharacter,
    // lastMMDCharacter: nullable<mmdCharacter>,
    // mmdCharacterOriginTransform: Map<mmdCharacter, [Vector3, Quaternion, Vector3]>,

    currentPose: pose,

    currentHeight: number,

    currentAnimationName: animationName,
    previousAnimationName: nullable<animationName>,
    nextBlendingAnimationName: nullable<animationName>,

    noBlend: boolean,

    // playOnlyOnceAnimationNames: List<animationName>,
    isCurrentAnimationOnlyPlayOnce: boolean,

    customDuration: nullable<number>,

    // needExecAction: nullable<action>,

    // capsule: Capsule,
    // capsuleMesh: nullable<Mesh>,

    box: Box3,


    // lastVelocity: Vector3,
    // girl: nullable<Object3D>,
    girlMesh: nullable<SkinnedMesh>,
    girlGroup: Object3D,

    originScale: number,
    initialPosition: nullable<Vector3>,
    initialQuaternion: nullable<Quaternion>,


    // rotationYForThirdPersonControl: Euler, lastRotationYForThirdPersonControl: Euler,
    // rotationYForThirdPersonControl: number,
    // lastRotationYForThirdPersonControl: nullable<number>,
    // quaternionForThirdPersonControl: Quaternion,

    // idle: nullable<Object3D>,
    // walk: nullable<Object3D>,
    // position: Vector3,

    collisionShapeMap: Map<collisionPart, OBB>,
    // collisionShapeMap: Map<collisionPart, OBB | Box3 >,
    // isComputeCollisionMap: Map<collisionPart, boolean>,
    // isComputeCollisionMap: Map<collisionPart, isComputeObjectCollisionMap>,
    getCenterFunc: nullable<(collisionPart: collisionPart) => nullable<Vector3>>,



    // isComputeCollisionMap: Map<collisionPart, boolean>,
    isComputeCollisionMap: Map<number, Map<frameIndex, boolean>>,
    // isResetActionCollision: boolean,
    lastFrameIndexMap: Map<animationName, frameIndex>,
    // isSoundPlayedMap: Map<soundType, boolean>,

    isComputeDamageMap: Map<animationName, Map<name, Map<phase, boolean>>>,


    // helper: MMDAnimationHelper,

    // isOnFloor: boolean

    screenShake: any,

    // hp: hp,
    excitement: number,
    // defenseFactor: number,
    // attackFactor: number,

    // defenseFactor: number,
    // hp: hp,
    hpMap: Map<damagePart, hp>,


    // isStatusChange: boolean,
    needUpdateStatus: nullable<girlStatus>,


    lastUpdatedExcitement: number,

    lastDamageTime: number,

    lastMoveCollisionedTime: number,


    // isTriggerActionMap: Map<animationName, boolean>,
    triggeredAction: nullable<actionName>,
    actionState: actionState,


    scaleState: scaleState,
    lastScaleChangeTime: number,

    isChangeScaling: boolean,


    boneCacheMap: Map<boneName, Bone>,



    // pickDataList: List<giantessAddToSkeletonData>,
    giantessAddToSkeletonData: nullable<giantessAddToSkeletonData>,


    isMoveCollisioned: boolean,

    isAllowMoveCollision: boolean,

    isRotationLock: boolean,

    isOnlyDamageLittleMan: boolean,

    girlGroupPositionDiffForChangePivot: nullable<Vector3>,

    computeBoxFunc: (state: state) => state,
    createFSMStateByAnimationNameFunc: (state: state, nextBlendingAnimationName: any) => [state, nullable<fsm_state<state>>],
    // createInitialStateFunc: () => fsm_state<state>,
    computeForceDirectionFunc: (state: state, animationName: any, velocity: Vector3, phase: any) => Vector3,
    computeDamageTypeFunc: (state: state, animationName: any, phase: any) => damageType,





    // getValueFunc: nullable<(name: string) => girlValue>,
}

// export type otherGirls = {
//     girls: Array<SkinnedMesh>,
// }


export enum bulletPropName {
    BasicBullet,
    LaserBullet,
    RocketBullet,
    BiggerBullet,
    SmallestBullet,
}

export type propName = bulletPropName
export const propName = {
    ...bulletPropName
}

export enum propType {
    Bullet
}

export enum gunName {
    BasicGun = "BasicGun",
    LaserGun = "LaserGun",
    RocketGun = "RocketGun",
    PropGun = "PropGun",
}


export type prop = {
    name: propName,
    count: number,
    type: propType,
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

export type littleMan = {
    stateMachine: stateMachine<state>,

    props: List<prop>,
    usedBulletPropName: bulletPropName,

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

    // collisionShapeMap: Map<collisionPart, OBB>,

    isComputeCollisionMap: Map<number, Map<frameIndex, boolean>>,
    // isResetActionCollision: boolean,
    lastFrameIndexMap: Map<LittleManDataType.animationName, frameIndex>,


    // isComputeDamageMap: Map<animationName, Map<name, Map<phase, boolean>>>,


    hp: hp,


    isStatusChange: boolean,


    // lastUpdatedExcitement: number,

    // lastDamageTime: number,


    triggeredAction: nullable<LittleManDataType.actionName>,
    actionState: littleManActionState,
    triggeredActionTime: Map<LittleManDataType.actionName, number>,


    // scaleState: scaleState,
    // lastScaleChangeTime: number,


    // boneCacheMap: Map<boneName, Bone>,



    // pickDataList: List<giantessAddToSkeletonData>,
    // giantessAddToSkeletonData: nullable<giantessAddToSkeletonData>,

    // gun: nullable<Object3D>,
    gunMap: Map<gunName, Object3D>,
    aim: nullable<Sprite>,


    bloodData: bloodData,

    rebornTime: number,

    lieTime: number,

    // qte: qte

    movableRanges: Array<xzRange>,

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

    // // Idle,
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



    Controlled,

    Lie,
    Standup,

    Climb,


    // Damaged,

    Stressing,
    Destroying,
    Destroyed
}

// type objectStateName = string

export type treeAndProp = {
    treesAndProps: Array<staticLODData>,
    // damageAnimationStatusMap: Map<name>,
    stateMachineMap: Map<name, stateMachine<state>>,
    defenseFactorMap: Map<name, number>,
    hpMap: Map<name, hp>,
}

// export type buildingFragments = Array<Mesh>

export type building = {
    // buildings: Array<[staticLODData, buildingFragments]>,
    buildings: Array<staticLODData>,

    crackDecalLODQueueMap: Map<name, LODQueue>,
    isAddCrackDecalMap: Map<name, boolean>,

    stateMachineMap: Map<name, stateMachine<state>>,
    defenseFactorMap: Map<name, number>,
    hpMap: Map<name, hp>,

    ruinOriginBox: nullable<Box3>,
    ruinQueue: nullable<LODQueue>,
    aviailableRuinNames: Array<name>,
}

export type car = {
    cars: Array<staticLODData>,
    stateMachineMap: Map<name, stateMachine<state>>,
    defenseFactorMap: Map<name, number>,
    hpMap: Map<name, hp>,
}

// type lodQueueData = {
//     // LODQueue,
//     // details
//     queue: LODQueue,
//     lod: InstancedSkinLOD2
// }


export type dynamicCar = {
    // cars: Array<lodQueueData>,
    carMap: Map<categoryName, LODQueue>,
    lodQueueIndexMap: Map<name, lodQueueIndex>,

    moveTweenMap: Map<name, Array<tween>>,
    stateMachineMap: Map<name, stateMachine<state>>,
    defenseFactorMap: Map<name, number>,
    hpMap: Map<name, hp>,
}


export type tile = {
    tiles: Array<staticLODData>
}

export type mountain = {
    mountains: Array<staticLODData>
}


// export type windMill = {
//     windMills: Array<staticLODData>,

//     wingTweenMap: Map<name, tween>,
//     stateMachineMap: Map<name, stateMachine<state>>,
//     defenseFactorMap: Map<name, number>,
//     hpMap: Map<name, hp>,
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
}

export type map = {
    wall: nullable<StaticLODContainer>,
    // wall: nullable<LODQueue>,
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

export type mission = {
    startGameTime: Moment,
    isMissionFinishByDestroyedRateReach: boolean,

    allBuildingCount: number,
    destroyedBuildingCount: number,

    lastDestroyedRate: number
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
}

export enum firstPersonCameraTarget {
    Eye,
    Leg,
}


export type damageData = {
    // lodContainerGroup: nullable<Group>,

    // isSelfFuncs: List<(categoryName: string) => boolean>,
    // damageFuncs: List<(state: state, octree: StaticLODContainer, [size, direction]: [number, Vector3], transforms: Array<number>, boxes: Array<Box3>, names: Array<name>) => [state, Array<string>]>,
    funcs: List<{
        isSelfFunc: (categoryName: string) => boolean,
        damageFunc: (state: state, container: StaticLODContainer, [size, direction]: [number, Vector3], transforms: Array<number>, boxes: Array<Box3>, names: Array<name>) => Promise<[state, Array<string>]>,
        getValueFunc: (name: name) => objectValue,
    }>,
    damageGiantessFunc: nullable<(state: state, [size, damageType, weaponType]: [number, damageType, weaponType], collisionPart: collisionPart, damagePosition: nullable<Vector3>) => Promise<state>>,
}

type lodQueueIndex = number

type skinLODData = LODQueue

type categoryName = string

export type bloodData = {
    bloodDecalOriginBox: nullable<Box3>,
    bloodDecalQueue: nullable<LODQueue>,
    aviailableBloodDecalNames: Array<name>,
    bloodDecalScale: Vector3,
    bloodDecalQuaternion: Quaternion,
}

export type cityzen = {
    cityzenMap: Map<categoryName, skinLODData>,
    stateMachineMap: Map<name, stateMachine<state>>,
    defenseFactorMap: Map<name, number>,
    hpMap: Map<name, hp>,

    moveTweenMap: Map<name, Array<tween>>,

    // cityzen1Queue: nullable<LODQueue>,
    // cityzen2Queue: nullable<LODQueue>,
    // cityzen1Lod: nullable<InstancedSkinLOD2>,
    // cityzen2Lod: nullable<InstancedSkinLOD2>,

    lodQueueIndexMap: Map<name, lodQueueIndex>,


    // shadowQueueMap: nullable<LODQueue>,
    shadowQueueMap: Map<name, LODQueue>,

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
    pointingRangeMap: Map<name, xzRange>,
}

export type soldier = {
    soldierMap: Map<categoryName, skinLODData>,

    // glb: nullable<GLTF>,

    stateMachineMap: Map<name, stateMachine<state>>,
    defenseFactorMap: Map<name, number>,
    hpMap: Map<name, hp>,

    moveTweenMap: Map<name, Array<tween>>,

    lodQueueIndexMap: Map<name, lodQueueIndex>,


    shadowQueueMap: Map<name, LODQueue>,

    bloodData: bloodData,


    allClipDurations: Map<categoryName, Array<number>>,
    allClipSteps: Map<categoryName, Array<number>>,

    moveDataMap: Map<name, Array<Vector2>>,

    crowdPositions: Array<Vector3>,

    initialQuaternionMap: Map<SoldierData.modelName, Quaternion>,

    // rocketQueue: nullable<LODQueue>,
    // rockets: Array<rocket>,

    commander: commander,
}

type queueName = string

type hierachyLODQueueData = Map<queueName, HierachyLODQueue>
// type hierachyLODQueueData = Array<{
//     queue: HierachyLODQueue,
//     lod: InstancedLOD2
// }>

export type milltaryVehicle = {
    milltaryVehicleMap: Map<categoryName, hierachyLODQueueData>,
    // tankWholeMap: Map<categoryName, LODQueue>,

    // glb: nullable<GLTF>,

    // fireRayMap: Map<name, Ray>,

    stateMachineMap: Map<name, stateMachine<state>>,
    defenseFactorMap: Map<name, number>,
    hpMap: Map<name, hp>,

    moveTweenMap: Map<name, Array<tween>>,
    fireTweenMap: Map<name, Array<tween>>,

    lodQueueIndexMap: Map<name, lodQueueIndex>,

    // allQueueLocalMatrices: nullable<[Matrix4, Matrix4, Matrix4]>,
    allQueueLocalMatricesMap: Map<categoryName, Array<Matrix4>>,

    moveDataMap: Map<name, Array<Vector2>>,

    crowdPositions: Array<Vector3>,

    initialQuaternionMap: Map<MilltaryVehicleData.modelName, Quaternion>,
}

export type milltaryBuilding = {
    milltaryBuildingMap: Map<categoryName, hierachyLODQueueData>,

    stateMachineMap: Map<name, stateMachine<state>>,
    defenseFactorMap: Map<name, number>,
    hpMap: Map<name, hp>,

    // moveTweenMap: Map<name, Array<tween>>,
    fireTweenMap: Map<name, Array<tween>>,

    lodQueueIndexMap: Map<name, lodQueueIndex>,

    allQueueLocalMatricesMap: Map<categoryName, Array<Matrix4>>,

    // moveDataMap: Map<name, Array<Vector2>>,

    // shellTurretPositions: Array<Vector3>,
    // missileTurretPositions: Array<Vector3>,
    turretPositionMap: Map<categoryName, Array<Vector3>>,

    initialQuaternionMap: Map<MilltaryBuildingData.modelName, Quaternion>,
}

export type camera = {
    cameraType: cameraType,
    thirdPersonCameraTarget: thirdPersonCameraTarget,
    firstPersonCameraTarget: firstPersonCameraTarget,
    cameraZoom: number,

    distanceRate: number,
    targetToCameraDirection: Vector3,


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

type gameEventName = any

export type gameEvent = {
    // isTriggerEvent: Map<event, boolean>

    currentMainEventName: nullable<gameEventName>,
    currentSubEventName: nullable<gameEventName>,

    customDataMap: Map<string, any>,
}

export enum behaviourTreeNodeExecuteResult {
    Success,
    Fail,
    // Running
}

// export type behaviourTreeNodeResult = [state, behaviourTreeNodeExecuteResult]
export type behaviourTreeNodeResult = [state, any]

export type actionNodeFunc = (state: state, id: id, config: nullable<any>) => Promise<behaviourTreeNodeResult>

export type actionNode = {
    id: id,
    func: actionNodeFunc
}

// export type controlNode = (state: state, id: id, children: Array<behaviourTreeData>) => Promise<behaviourTreeNodeResult>
export type controlNode = (state: state, key: behaviourTreeKey, children: Array<behaviourTreeData>) => Promise<behaviourTreeNodeResult>

export enum attackRange {
    Small,
    Middle,
    Big
}

export type behaviourTreeData = {
    name?: string,
    config?: (state: state) => any,
    returnSuccessCondition: (state: state) => boolean,
    returnFailCondition: (state: state) => boolean,
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
}

export type targetData = {
    isAliveFunc: (state: state) => boolean,
    getPositionFunc: (state: state) => Vector3,

    // position: Vector3,
    type: targetType,
    index: nullable<number>,
    name: name,
}

export type behaviourTreeKey = string

export type behaviourTree = {
    // data: nullable<behaviourTreeData>,
    // isRunning: boolean,
    // finishedData: nullable<[id, behaviourTreeNodeExecuteResult]>,
    // finishedResult: nullable<behaviourTreeNodeExecuteResult>,


    dataMap: Map<behaviourTreeKey, behaviourTreeData>,
    isRunningMap: Map<behaviourTreeKey, boolean>,
    finishedDataMap: Map<behaviourTreeKey, [id, behaviourTreeNodeExecuteResult]>,

    targetData: nullable<targetData>,
    // targetDataMap: Map<behaviourTreeKey, targetData>,
    // lastGirlPosition:nullable<Vector3>,

    idMap: Map<string, id>,
    // customDataMap: Map<string, any>,

    isNotExecuteGiantessAI: boolean,
}

export type ui = {
    uiUpdateLoopCount: number,
    needUpdateSkillBar: boolean,
}

export type configData = {
    operateRenderData: operateRenderData,
    collisionShapeData: nullable<CollisionShapeData.data<pose, any>>,
    animationBlendData: animationBlendData<animationName>,
    animationCollisionData: Array<animationCollisionData<animationName>>,
    actionData: actionData<animationName>,
    phaseData: phaseData<animationName>,
    articluatedAnimationData: Array<articluatedAnimationData<any>>,
    girlAllAnimationNames: nullable<Array<animationName>>,
    girlAllAnimationFrameCountMap: Record<animationName, number>,

    girlValue: nullable<girlValue>,

    gameEventData: gameEventData<any>,
    scenaryData: nullable<scenarioData<any, any>>,

    allMMDData: allMMDData,
    clothCollisionData: clothCollisionData<collisionPart>,
    clothHpData: nullable<clothHpData>,
    firstPersonControlsData: firstPersonControlsData,
    shoeData: shoeData,



    behaviourTreeDataMap: Map<behaviourTreeKey, BehaviourTreeDataType.behaviourTreeData<any>>,


    littleManAnimationBlendData: animationBlendData<LittleManDataType.animationName>,
    littleManAnimationCollisionData: Array<LittleManDataType.animationCollisionData>,
    littleModelData: Array<modelData>,
    littleManSkillData: skillData,

    littleManValue: nullable<littleManValue>,

    soldierModelData: Array<SoldierData.modelData>,
    milltaryVehicleData: Array<MilltaryVehicleData.modelData>,
    milltaryBuildingData: Array<MilltaryBuildingData.modelData>,
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

export type littleManSetting = {
    armyCount: armyCount,
    giantessStrength: giantessStrength,
    littleManStrength: littleManStrength,
    giantessScale: giantessScale,
    biggerFrequency: biggerFrequency,
    propCount: propCount,
    isBiggerNoLimit: boolean,
}

export type giantessSetting = {
    armyCount: armyCount,
    giantessStrength: giantessStrength,
    giantessScale: giantessScale,
    excitementIncrease: excitementIncrease,
    isBiggerNoLimit: boolean,
}

// export enum targetPrior = targetType
export enum targetPrior {
    None,
    LittleMan,
    Building,
    Cityzen,
    Soldier,
    MilltaryVehicle,
    MilltaryBuilding,
}

export type littleManSettingInGame = {
    // selectTargetPrior: nullable<targetPrior>,
    selectTargetPrior: targetPrior,
    // isSelectLittleManPrior: boolean,
    // isSelectTankPrior: boolean,
    // isSelectSoldierPrior: boolean,
    // isSelectBuildingPrior: boolean,
    // isSelectCityzenPrior: boolean,
}

export enum camp {
    Giantess,
    LittleMan
}

export enum attackTargetExtend {
    None,
    Giantess,
    LittleMan,
    // Soldier,
    // MilltaryBuilding,
    // MilltaryVehicle
}
// export type attackTarget = collisionPart | attackTargetExtend
// export const attackTarget = { ...collisionPart, ...attackTargetExtend }
export type attackTarget = attackTargetExtend
export const attackTarget = { ...attackTargetExtend }

export type army = {
    attackTargetMap: Map<name, attackTarget>,
    campMap: Map<name, camp>,

    getPositionYFuncMap: Map<string, (state: state, x: number, z: number) => number>,
}

export enum difficulty {
    VeryEasy,
    Easy,
    Middle,
    Hard,
    VeryHard
}

export type biwuSetting = {
    difficulty: difficulty
}



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


export type cityScene = {
    isFirstEnter: boolean,

    scene: nullable<Object3D>,

    sceneChapter: scene,
    levelNumber: number,
    levelData: Map<string, any>,

    // mode: mode,

    hpMap: Map<name, number>,

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

    army: army,

    map: map,
    mission: mission,

    scenario: scenario,
    gameEvent: gameEvent,

    behaviourTree: behaviourTree,

    ui: ui,

    configData: configData,

    littleManSetting: littleManSetting,
    giantessSetting: giantessSetting,

    littleManSettingInGame: littleManSettingInGame,

    biwuSetting: biwuSetting,

    climb: climb,
}

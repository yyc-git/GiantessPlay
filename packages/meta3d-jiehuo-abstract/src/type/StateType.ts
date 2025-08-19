import { WebGLRenderer, Object3D, Camera, Vector2, Raycaster, Scene, Clock, AnimationMixer, AnimationClip, Mesh, Color, Vector3, LOD, Box3, Group, Matrix4, BufferGeometry, Sprite, PerspectiveCamera } from "three"
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import type { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import type { OutlinePass } from '../three/OutlinePass'
import type { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import type { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
// import type Stats from "three/examples/jsm/libs/glBench.module"
import type GLBench from 'gl-bench/dist/gl-bench';
import type RendererStats from 'three-webgl-stats';
import { nullable } from "../utils/nullable"
import type { Map, List } from "immutable"
import type { JoystickManager } from 'nipplejs'
import type { ShadowMapViewer } from "three/examples/jsm/utils/ShadowMapViewer"
import { InstancedMesh2 } from "../instance/InstancedMesh2"
import { InstancedMesh2LOD } from "../lod/InstancedMesh2LOD"
import { InstanceSourceLOD } from "../lod/InstanceSourceLOD"
import { CSM } from "three/examples/jsm/csm/CSM"
// import { InstancedLOD } from "../lod/lod2/InstancedLOD2"
import { StaticLODContainer } from "../lod/lod2/StaticLODContainer"
import { MMDLoader, MMDLoaderAnimationObject2 } from "../three/MMDLoader"
import { MMDAnimationHelper } from "../three/MMDAnimationHelper"
import { OrbitControls } from "../three/OrbitControls"
import { InstancedSkinnedMesh } from "../gpu_skin/InstancedSkinnedMesh"
import { InstancedLOD2 } from "../lod/lod2/InstancedLOD2"
import { InstancedSkinLOD2 } from "../lod/lod2/InstancedSkinLOD2"
import { LODContainer } from "../lod/lod2/LODContainer"
import type { Tween, Group as TweenGroup } from "../three/tween.module"
// import { ScreenShake } from "../effect/ScreenShake"
// import { InstancedMeshBVH } from "../instance/InstancedMeshBVH"
import type * as PF from "pathfinding"
import { status } from "../lod/lod2/LODContainerType"
import { Octree } from "../lod/utils/Octree"
import { LODQueue } from "../lod/lod2/LODQueue"
// import { MutableNumberMapUtils } from "../Main"
import { t as MutableNumberMapUtilsT } from "../utils/MutableNumberMapUtils"
import { FirstPersonControls } from "../three/FirstPersonControls"
import type { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import type { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader"
import { OBB } from "../three/OBB"

export type render = {
    // isNeedHandleLandscape: boolean,

    canvas: nullable<HTMLCanvasElement>,
    // width: number,
    // height: number,
    isNeedSetSize: boolean,
    renderer: nullable<WebGLRenderer>,
    composer: nullable<EffectComposer>,
    renderPass: nullable<RenderPass>,
    outlinePass: nullable<OutlinePass>,
    gammaCorrection: nullable<ShaderPass>
}

export type pickTarget = [number, nullable<Object3D>, nullable<[Matrix4, Box3, string]>]

export type pick = {
    // mouse: nullable<Vector2>,
    // lastMouse: nullable<Vector2>,
    screenCoordniate: nullable<Vector2>,
    targets: List<pickTarget>,
    raycaster: Raycaster
}

export type tweenId = string

export type tween = Tween

export enum articluatedAnimationStatus {
    Playing,
    NotPlaying
}

export type articluatedAnimationName = string

export type articluatedAnimation = {
    group: TweenGroup,

    // reallocateTweens: Array<tween>,

    articluatedAnimationTweens: Map<articluatedAnimationName, Array<tween>>,
    articluatedAnimationStatus: Map<articluatedAnimationName, articluatedAnimationStatus>
}

export type skinAnimationName = string

export type skinTargetName = string

export type weight = number

export type skinAnimation = {
    animationClips: Map<skinAnimationName, AnimationClip>,
    animationNames: Map<skinTargetName, List<skinAnimationName>>,
    mixerMap: Map<skinTargetName, AnimationMixer>,
    weights: Map<skinAnimationName, weight>
}

type key = string

// export enum moveDirection {
//     Forward,
//     Back,
//     Left,
//     Right,
// }

export enum road {
    Giantess,
    LittleMan
}

export type cameraControls = {
    keyState: Map<road, Map<key, boolean>>,
    joystickManager: nullable<JoystickManager>,
    moveHandlerFunc: nullable<any>,
    endHandlerFunc: nullable<any>,


    // forward: number,
    // back: number,
    // left: number,
    // right: number,
    directionData: Map<road, [
        number, number, number, number
    ]>,

    // lastForward: nullable<number>,
    // lastSide: nullable<number>,
    distanceBeforeCameraCollision: nullable<number>,

    lastExitPointerLockTime: nullable<number>,
    isEnablePointerlock: boolean,
}

export type camera = {
    // currentCamera: nullable<Camera>,
    currentCamera: nullable<PerspectiveCamera>,
    currentControls: nullable<any>,
    orbitControls: nullable<OrbitControls>,
    cameraControls: nullable<cameraControls>,
    trackballControls: nullable<TrackballControls>,
    firstPersonControls: nullable<FirstPersonControls>,
}

export type scene = {
    scene: Scene,
    currentScene: nullable<Object3D>,
    camera: nullable<camera>,

    road: road,

    pickableOctrees: Array<StaticLODContainer>,
}

export type eventName = string

export type customEvent = {
    name: eventName,
    userData: nullable<any>
}

export type handler<specificState> = (state: specificState, customEvent: customEvent) => Promise<specificState>

export type event = {
    handlers: Map<eventName, List<handler<any>>>
}

export type stats = {
    glBench: GLBench,
    rendererStats: RendererStats
}

// type instancedMeshName = string

// export type sourceMeshName = string
// export type sourceMeshId = number

export type instanceIndex = number

export type sourceObjectName = string

// export enum lodLevel {
//     High,
//     Midium,
//     Low
// }

// export type sourceLodData = {
//     maxDistanceToCamera: number,
//     sourceObjects: Array<Object3D>,
//     // level: lodLevel
// }

// type objectId = number

// type lodObject = {
//     object: Object3D,
//     // lodDataMap: Map<objectId, {
//     //     maxDistanceToCamera: number,
//     //     geometry,
//     //     material
//     // }>
//     lodData: Array<{
//         maxDistanceToCamera: number,
//         geometry,
//         material
//     }>
// }

// export type allSourceLodData = {
//     // maxDistanceToCamera: number,
//     sourceObjects: Array<LOD>,
//     // level: lodLevel
// }

type object3DId = number

export type instancedSourceId = instanceSourceLODId | object3DId

export type instancedId = number

export type instancedSource = InstanceSourceLOD | Object3D

export type instancedMesh = InstancedMesh2LOD | InstancedMesh2

export type instance = {
    // sourcesMap: Map<instancedMesh2LODId, Array<InstanceSourceLOD>>,
    // indexMap: Map<instanceSourceLODId, instanceIndex>,
    // instancedMesh2OneMap: Map<instanceSourceLODId, InstancedMesh2LOD>,
    // needUpdateColorMap: Map<instanceSourceLODId, Color>,
    // visibleMap: Map<instanceSourceLODId, boolean>

    // isInstancedSourceMap: Map<instancedSourceId, boolean>,
    // // sourcesMap: Map<instancedId, Array<InstanceSourceLOD | Mesh>>,
    // sourcesMap: Map<instancedId, Array<instancedSource>>,
    // sourceWorldBoundingBoxMap: Map<instancedSourceId, Box3>,
    // indexMap: Map<instancedSourceId, instanceIndex>,
    // instancedMesh2OneMap: Map<instancedSourceId, instancedMesh>,
    // needUpdateColorMap: Map<instancedSourceId, Color>,
    // visibleMap: Map<instancedSourceId, boolean>


    isInstancedSourceMap: Record<instancedSourceId, boolean>,
    // sourcesMap: Map<instancedId, Array<InstanceSourceLOD | Mesh>>,
    sourcesMap: Record<instancedId, Array<instancedSource>>,
    sourceWorldBoundingBoxMap: Record<instancedSourceId, Box3>,
    indexMap: Record<instancedSourceId, instanceIndex>,
    instancedMesh2OneMap: Record<instancedSourceId, instancedMesh>,
    needUpdateColorMap: Record<instancedSourceId, Color>,
    visibleMap: Record<instancedSourceId, boolean>
}

export type resourceId = string

type resource = any

export enum resourceType {
    ArrayBuffer,
    MMD,
    Texture,
    // Image,
    Audio
}

export type loader = {
    resourceData: Map<resourceId, resource>,
    dracoLoader: nullable<DRACOLoader>,
    ktx2Loader: nullable<KTX2Loader>,
}

export type device = {
    clock: Clock,
    delta: number,
    // width: number,
    // height: number
}

export enum layer {
    // Visible = 1,
    // NotVible = 2,
    Pickable = 3,
}

export type light = {
    directionLightShadowMapViewer: nullable<ShadowMapViewer>,
    csm: nullable<CSM>
}

export type instancedMesh2LODId = number

type instanceSourceLODId = number

export type level = {
    instancedMesh2s: Array<InstancedMesh2>;
    /** The distance at which to display this level of detail. Expects a `Float`. */
    distance: number;
    /** Threshold used to avoid flickering at LOD boundaries, as a fraction of distance. Expects a `Float`. */
    hysteresis: number;
}



type detail = {
    group: Group,
    level: string,
    distance: number,
}

export type details = Array<detail>

export type staticLODContainerIndex = number

export type lodQueueIndex = number

export type name = string

export type hierachyLODQueueName = string

export type lod = {
    instancedMesh2LevelsMap: Map<instancedMesh2LODId, Array<level>>,
    // bvhMap: Map<instancedMesh2LODId, InstancedMeshBVH>,
    lod2s: List<InstancedLOD2>,
    skinLOD2s: List<InstancedSkinLOD2>,

    // needsUpdateForHierachyLODQueue: Array<boolean>,
    needsUpdateForHierachyLODQueueMap: Record<hierachyLODQueueName, Array<boolean>>,



    octreeForStaticLODContainer: Octree,
    staticLODContainerMaxIndex: number,

    // visibleIndicesAfterfrustumCull: Array<staticLODContainerIndex>,
    // visibleIndicesAfterfrustumCull: Record<staticLODContainerIndex, boolean>,
    visibleIndicesAfterfrustumCull: MutableNumberMapUtilsT<staticLODContainerIndex, boolean>,

    staticLODContainerNames: Array<name>,
    staticLODContainerStatuses: Array<status>,
    staticLODContainerTransforms: Array<Matrix4>,
    staticLODContainerBoxes: Array<Box3>,
    staticLODContainerIndicesMap: Record<name, staticLODContainerIndex>,
    // staticLODContainerMap: Record<staticLODContainerIndex, StaticLODContainer>,


    lodQueueStatusMap: Record<name, status>
    lodQueueMap: Record<name, LODQueue>,
}

export type config = {
    isDebug: boolean,
    isProduction: boolean,
    isNotTestPerf: boolean,
    isSkipScenario: boolean,
    isSkipGameEvent: boolean,
}

export type deferExecFuncData<specificState> = {
    func: (specificState: specificState) => Promise<specificState>,
    loopCount: nullable<number>,
    time: nullable<number>,
    name: name,
}

export type flow = {
    isStopLoop: boolean,
    // loopIndex:number,
    // deferExecFuncs: List<deferExecFuncData<any>>,
    deferExecFuncs: Array<deferExecFuncData<any>>,

    // needRemoveDeferExecFuncs: Record<name, deferExecFuncData<any>>,
    needRemoveDeferExecFuncs: Array<name>,

    lastTime: nullable<number>,
}

export type collision = {
    // emitterCollisionContainers: Array<LODContainer>,
    // playerCollisionContainers: Array<LODContainer>,
    playerCollisionContainers: Array<LODQueue>,
    // cameraCollisionOctrees: Array<StaticLODContainer>,
}

export type mmd = {
    loader: MMDLoader,
    helper: MMDAnimationHelper,
}


// export type screenShake = {
//     screenShake: ScreenShake
// }


// export enum particleEmitterType {
//     Dust
// }

export type id = number

export type dustParticle = {
    // range: number,
    // opacity: number,
    // opacityFactor: number,
    // scale: number,
    // scaleFactor: number,
    // size: number,
    // life: number,
    // createTime: number,
    // updateTime: number,
    // speed: [number, number, number],
    // position: [number, number, number],
    // id: id,

    opacity: number,
    size: number,
    life: number,
    // changeLife: number,
    createTime: number,
    updateTime: number,
    speed: [number, number, number],
    position: [number, number, number],

}

export type dustEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<dustParticle>
}

export type dustEmitterParam = {
    // range: number,
    life: number,
    size: number,
    speed: number,
    position: [number, number, number]
}

export type stompDustParticle = {
    // id: id,

    // range: number,
    opacity: number,
    // opacityFactor: number,
    // scale: number,
    // scaleFactor: number,
    // size: number,

    size: number,
    // range:number,

    life: number,
    changeLife: number,
    createTime: number,
    updateTime: number,
    // speed: [number, number, number],
    speed: number,
    position: [number, number, number],
}

export type stompDustEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<stompDustParticle>
}

export type stompDustEmitterParam = {
    // range: number,
    life: number,
    changeLife: number,
    size: number,
    speed: number,
    position: [number, number, number]
}

export type flameParticle = {
    opacity: number,
    size: number,
    life: number,
    createTime: number,
    updateTime: number,
    // speed: [number, number, number],
    speed: number,
    position: [number, number, number],
    direction: [number, number, number],
    color: [number, number, number],
}

export type flameEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<flameParticle>
}

export type flameEmitterParam = {
    life: number,
    size: number,
    speed: number,
    position: [number, number, number],
    direction: [number, number, number],
    colors: Array<[number, number, number]>,
}


export type bulletParticle = {
    id: id,

    fromName: name,

    // rotation: number,

    opacity: number,
    size: number,
    // maxDistance: number,
    life: number,
    // changeLife: number,
    createTime: number,
    updateTime: number,
    speed: number,
    position: [number, number, number],
    direction: [number, number, number],
}

export type bulletEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<bulletParticle>
}

export type bulletEmitterParam = {
    // rotation: number,
    // maxDistance: number,
    life: number,
    size: number,
    speed: number,
    position: [number, number, number],
    direction: [number, number, number],

    fromName: name
}

export type rocketParticle = {
    id: id,

    fromName: name,

    // opacity: number,
    // size: number,
    life: number,
    createTime: number,
    updateTime: number,
    speed: number,
    position: [number, number, number],
    direction: [number, number, number],
}

export type rocketEmitter = {
    // geometry: nullable<BufferGeometry>,
    particles: Array<rocketParticle>,
    queue: nullable<LODQueue>,
    queueIndexMap: MutableNumberMapUtilsT<id, lodQueueIndex>,
}

export type rocketEmitterParam = bulletEmitterParam


export type missileVehicleMissileParticle = rocketParticle

export type missileVehicleMissileEmitter = rocketEmitter

export type missileVehicleMissileEmitterParam = rocketEmitterParam


// export type laserBulletParticle = rocketParticle

// export type laserBulletEmitter = rocketEmitter

// export type laserBulletEmitterParam = rocketEmitterParam

export type laserBulletParticle = bulletParticle

export type laserBulletEmitter = bulletEmitter

export type laserBulletEmitterParam = bulletEmitterParam



export type shellParticle = bulletParticle

export type shellEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<shellParticle>
}

export type shellEmitterParam = bulletEmitterParam


export type shellEmitOrExplodeParticle = {
    // id: id,

    opacity: number,
    size: number,
    life: number,
    createTime: number,
    updateTime: number,
    speed: number,
    position: [number, number, number],

    offset: [number, number],
    repeat: [number, number],
}

export type shellEmitOrExplodeEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<shellEmitOrExplodeParticle>
}

export type shellEmitOrExplodeEmitterParam = {
    life: number,
    size: number,
    speed: number,
    position: [number, number, number],

    offset: [number, number],
    repeat: [number, number],
}

export type bulletHitParticle = shellEmitOrExplodeParticle

export type bulletHitEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<bulletHitParticle>
}

export type bulletHitEmitterParam = shellEmitOrExplodeEmitterParam


export type laserBulletHitParticle = bulletHitParticle

export type laserBulletHitEmitter = bulletHitEmitter

export type laserBulletHitEmitterParam = bulletHitEmitterParam



export type waterBloomParticle = shellEmitOrExplodeParticle

export type waterBloomEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<waterBloomParticle>
}

export type waterBloomEmitterParam = shellEmitOrExplodeEmitterParam

export type milkSplashParticle = waterBloomParticle

export type milkSplashEmitter = waterBloomEmitter

export type milkSplashEmitterParam = waterBloomEmitterParam

export type clothDestroyedParticle = waterBloomParticle

export type clothDestroyedEmitter = waterBloomEmitter

export type clothDestroyedEmitterParam = waterBloomEmitterParam

export type blinkParticle = waterBloomParticle

export type blinkEmitter = waterBloomEmitter

export type blinkEmitterParam = waterBloomEmitterParam

export type swipingHitParticle = waterBloomParticle

export type swipingHitEmitter = waterBloomEmitter

export type swipingHitEmitterParam = waterBloomEmitterParam


export type protectParticle = {
    opacity: number,
    size: number,
    life: number,
    createTime: number,
    updateTime: number,
    speed: number,
    getPositionFunc: (specificState: any) => [number, number, number],
    getIsFinishFunc: (specificState: any) => boolean,

    // repeatCount: number,

    offset: [number, number],
    repeat: [number, number],
}

export type protectEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<protectParticle>
}


export type protectEmitterParam = {
    life: number,
    size: number,
    speed: number,
    // position: [number, number, number],
    getPositionFunc: (specificState: any) => [number, number, number],
    getIsFinishFunc: (specificState: any) => boolean,


    // repeatCount: number,

    offset: [number, number],
    repeat: [number, number],
}


export type loopCount = number


export type particle = {
    maxId: number,
    reallocateIds: Array<id>,
    allEmitParticlesForCollisionCheck: Array<any>,
    // allEmitParticlesForCollisionCheckCount: number,

    // needCollisionCheckLoopCountMap: Record<id, loopCount>,
    needCollisionCheckLoopCountMap: MutableNumberMapUtilsT<id, loopCount>,

    dustEmitter: nullable<dustEmitter>,
    stompDustEmitter: nullable<stompDustEmitter>,
    flameEmitter: nullable<flameEmitter>,
    bulletEmitter: nullable<bulletEmitter>,
    propBulletEmitter: nullable<bulletEmitter>,
    laserBulletEmitter: nullable<laserBulletEmitter>,
    shellEmitter: nullable<shellEmitter>,
    shellEmitOrExplodeEmitter: nullable<shellEmitOrExplodeEmitter>,
    bulletHitEmitter: nullable<bulletHitEmitter>,
    propBulletHitEmitter: nullable<bulletHitEmitter>,
    laserBulletHitEmitter: nullable<laserBulletHitEmitter>,
    waterBloomEmitter: nullable<waterBloomEmitter>,
    milkSplashEmitter: nullable<milkSplashEmitter>,
    clothDestroyedEmitter: nullable<clothDestroyedEmitter>,
    blinkEmitter: nullable<blinkEmitter>,
    swipingHitEmitter: nullable<swipingHitEmitter>,
    protectEmitter: nullable<protectEmitter>,

    rocketEmitter: nullable<rocketEmitter>,
    missileVehicleMissileEmitter: nullable<missileVehicleMissileEmitter>,
}


type resouceId = string

export type needToPlayData = {
    resouceId: resouceId,
    volume: number,
    isLoop: boolean
}

// export type isPlayingData = {
//     resouceId: string,
// }

export type sound = {
    needToPlayList: List<needToPlayData>,
    lastPlayTimeMap: Map<resouceId, number>,

    // isPlayingList: List<resouceId>,
}

export enum fontType {
    NormalAttack,
    HeavyAttack,
    WeaknessAttack,

    NormalDamage,
    HeavyDamage,
}

export enum labelAnimation {
    None,
    Normal
}

type labelValue = string

type targetName = name

export type needToShowData = {
    targetName: name,

    text: labelValue,
    position: Vector3,
    fontType: fontType,
    time: number,
    animation: labelAnimation,
    isSizeAttenuation: boolean,
    sizeFactor: number,

    height: nullable<number>,

    isAddToSpecifyPosition: boolean,
}

// export type labelSeat = number
// export type labelSeat = 0 | 1 | 2 | 3 | 4 | 5
// export type labelSeat = 0 | 1 | 2

export type label = {
    // ctx: CanvasRenderingContext2D,

    needToShowList: List<needToShowData>,
    // labelSeatMap: Record<labelSeat, labelValue>,
    // labelSeatTweenMap: Record<labelSeat, tween>,

    labelTweensMap: Record<targetName, Array<tween>>,
    needRemoveLabelMap: Record<targetName, Sprite>,
    aliveLabelCountMap: Record<targetName, number>
}

export enum hdLevel {
    High,
    Middle,
    Low
}

export enum renderAccuracyLevel {
    VeryHigh,
    High,
    Middle,
    Low
}

export enum shadowLevel {
    High,
    Middle,
    Low
}

export enum crowdSize {
    Small,
    Middle,
    Big,
    VeryBig
}

export enum physicsLevel {
    VeryHigh,
    High,
    Middle,
    Low,
    VeryLow
}

export type renderSetting = {
    hd: hdLevel,
    renderAccuracy: renderAccuracyLevel,
    shadow: shadowLevel,
    isShowBlood: boolean,
    crowdSize: crowdSize,
    physics: physicsLevel,
}

export type version = {
    mainVersion: number,
    subVersion: number
}

export type fsmStateName = number

export type fsm_state<specificState extends any> = {
    name: fsmStateName,
    enterFunc: (specificState: specificState, stateMachine: stateMachine<specificState>) => Promise<specificState>,
    executeFunc: (specificState: specificState, data: any, stateMachine: stateMachine<specificState>) => Promise<specificState>,
    exitFunc: (specificState: specificState, stateMachine: stateMachine<specificState>) => Promise<specificState>,
}

export type stateMachine<specificState> = {
    name: string,
    previousState: nullable<fsm_state<specificState>>,
    currentState: fsm_state<specificState>
}

// type skinObjectName = string

// type objectName = string

// type instancedSkinLOD2Name = string

export type objectName = string

// type instancedSkeletonAnimationData = {
//     name: objectName,
//     time: number
// }

type time = number

export type onCompleteFunc<specificState> = (specificState: specificState) => Promise<specificState>

export enum gpuSkinPlayMode {
    Once,
    Loop,
    KeepLast
}

export type gpuSkin = {
    clipDurationsMap: Record<objectName, Array<number>>,
    clipStepsMap: Record<objectName, Array<number>>,

    instancedSkeletonAnimationTimeMap: Record<objectName, time>,
    playedClipIndexMap: Record<objectName, [number, gpuSkinPlayMode]>,
    onceClipOnCompleteFuncMap: Record<objectName, onCompleteFunc<any>>,
    // isOnceClipOnCompleteFuncExecutedMap: Record<objectName, boolean>,
}

export type pathFind = {
    gridMap: Map<string, PF.Grid>,
    // findedPaths: List<Array<Vector3>>,

    step: nullable<number>,

    lastFindPathTimeMap: Map<name, number>
}

export type state = {
    config: config,
    renderSetting: renderSetting,

    device: device,
    flow: flow,
    // render: nullable<render>,
    render: render,
    scene: scene,
    pick: pick,
    articluatedAnimation: articluatedAnimation
    skinAnimation: skinAnimation,
    event: event
    stats: nullable<stats>,
    loader: loader,
    instance: instance,
    lod: lod,
    light: light,

    collision: collision,
    mmd: mmd,
    // screenShake: screenShake
    particle: particle,

    sound: sound,
    label: label,

    version: version,

    gpuSkin: gpuSkin,

    pathFind: pathFind,
}
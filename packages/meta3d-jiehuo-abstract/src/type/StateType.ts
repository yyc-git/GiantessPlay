import { WebGLRenderer, Object3D, Camera, Vector2, Raycaster, Scene, Clock, AnimationMixer, AnimationClip, Mesh, Color, Vector3, LOD, Box3, Group, Matrix4, BufferGeometry, Sprite, PerspectiveCamera, Quaternion } from "three"
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import type { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import type { OutlinePass } from '../three/OutlinePass'
import type { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import type { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
// import type Stats from "three/examples/jsm/libs/glBench.module"
import type GLBench from 'gl-bench/dist/gl-bench';
import type RendererStats from 'three-webgl-stats';
import { nullable } from "../utils/nullable"
import type { Map as ImmutableMap, List } from "immutable"
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
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

export type render = {
    // isNeedHandleLandscape: boolean,

    // canvas: nullable<HTMLCanvasElement>,
    // width: number,
    // height: number,
    isNeedSetSize: boolean,
    renderer: nullable<WebGLRenderer>,
    composer: nullable<EffectComposer>,
    renderPass: nullable<RenderPass>,
    outlinePass: nullable<OutlinePass>,
    gammaCorrection: nullable<ShaderPass>,


    webglcontextlostExtension: nullable<WEBGL_lose_context>,
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

    // articluatedAnimationTweens: ImmutableMap<articluatedAnimationName, Array<tween>>,
    // articluatedAnimationStatus: ImmutableMap<articluatedAnimationName, articluatedAnimationStatus>
}

export type skinAnimationName = string

export type skinTargetName = string

export type weight = number

export type skinAnimation = {
    animationClips: ImmutableMap<skinAnimationName, AnimationClip>,
    animationNames: ImmutableMap<skinTargetName, List<skinAnimationName>>,
    mixerMap: ImmutableMap<skinTargetName, AnimationMixer>,
    weights: ImmutableMap<skinAnimationName, weight>
}

type key = string

// export enum moveDirection {
//     Forward,
//     Back,
//     Left,
//     Right,
// }

export enum characterType {
    Giantess,
    LittleMan,
    Both,
    GiantessOrNone,
    LittleManOrNone,
    BothOrNone,
    None,
}

export type cameraControls = {
    // keyState: ImmutableMap<characterType, ImmutableMap<key, boolean>>,
    littleManKeyState: ImmutableMap<key, boolean>,
    giantessKeyState: ImmutableMap<usedGirl, ImmutableMap<key, boolean>>,

    joystickManager: nullable<JoystickManager>,
    moveHandlerFunc: nullable<any>,
    endHandlerFunc: nullable<any>,


    // forward: number,
    // back: number,
    // left: number,
    // right: number,
    // directionData: ImmutableMap<characterType, [
    //     number, number, number, number
    // ]>,
    littleManDirectionData: [
        number, number, number, number
    ],
    giantessDirectionDataMap: ImmutableMap<usedGirl, [
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
    // trackballControls: nullable<TrackballControls>,
    firstPersonControls: nullable<FirstPersonControls>,
}

export type scene = {
    scene: Scene,
    currentScene: nullable<Object3D>,
    camera: nullable<camera>,

    characterType: characterType,

    pickableOctrees: Array<StaticLODContainer>,
}

export type eventName = string

export type userData = nullable<any>

export type customEvent = {
    name: eventName,
    userData: userData
}

export type handler<specificState> = (state: specificState, customEvent: customEvent) => Promise<specificState>

export type handlerWithUserData<specificState> = (state: specificState, customEvent: customEvent) => Promise<[specificState, userData]>

export type handlerByReadWriteState = (customEvent: customEvent) => Promise<void>

export type gotData = any

// export type handlerForGetData<specificState> = (state: specificState, customEvent: customEvent) => Promise<[specificState, gotData]>
// export type handlerForGetData<specificState> = (state: specificState, customEvent: customEvent) => [specificState, gotData]
export type handlerForGetData<specificState> = (state: specificState, customEvent: customEvent) => gotData

export type event = {
    handlers: ImmutableMap<eventName, List<handler<any>>>,

    // handlersWithUserData: ImmutableMap<eventName, List<handlerWithUserData<any>>>,
    handlersWithUserData: Map<eventName, Array<handlerWithUserData<any>>>,

    handlersByReadWriteState: ImmutableMap<eventName, List<handlerByReadWriteState>>,

    // handlersForGetData: ImmutableMap<eventName, List<handlerForGetData<any>>>,
    handlerForGetData: ImmutableMap<eventName, handlerForGetData<any>>,
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
//     // lodDataMap: ImmutableMap<objectId, {
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
    // sourcesMap: ImmutableMap<instancedMesh2LODId, Array<InstanceSourceLOD>>,
    // indexMap: ImmutableMap<instanceSourceLODId, instanceIndex>,
    // instancedMesh2OneMap: ImmutableMap<instanceSourceLODId, InstancedMesh2LOD>,
    // needUpdateColorMap: ImmutableMap<instanceSourceLODId, Color>,
    // visibleMap: ImmutableMap<instanceSourceLODId, boolean>

    // isInstancedSourceMap: ImmutableMap<instancedSourceId, boolean>,
    // // sourcesMap: ImmutableMap<instancedId, Array<InstanceSourceLOD | Mesh>>,
    // sourcesMap: ImmutableMap<instancedId, Array<instancedSource>>,
    // sourceWorldBoundingBoxMap: ImmutableMap<instancedSourceId, Box3>,
    // indexMap: ImmutableMap<instancedSourceId, instanceIndex>,
    // instancedMesh2OneMap: ImmutableMap<instancedSourceId, instancedMesh>,
    // needUpdateColorMap: ImmutableMap<instancedSourceId, Color>,
    // visibleMap: ImmutableMap<instancedSourceId, boolean>


    isInstancedSourceMap: Record<instancedSourceId, boolean>,
    // sourcesMap: ImmutableMap<instancedId, Array<InstanceSourceLOD | Mesh>>,
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

export type needLoadResourceData = Array<{ id: resourceId, path: string | Array<string> | [string, Array<[string, string]>], type: resourceType }>

export type loader = {
    needLoadResourceData: needLoadResourceData,
    loadedIndex: number,

    // needLoadResourceDataForRetry: needLoadResourceData,

    resourceData: ImmutableMap<resourceId, resource>,

    fbxLoader: nullable<FBXLoader>,
    dracoLoader: nullable<DRACOLoader>,
    ktx2Loader: nullable<KTX2Loader>,
}

export type device = {
    clock: Clock,
    delta: number,
    // width: number,
    // height: number

    isMobile: boolean,
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
    // distance: number,
    getDistanceFunc: (specificState: any) => number,
}

export type details = Array<detail>

export type staticLODContainerIndex = number

export type lodQueueIndex = number

export type name = string

export type hierachyLODQueueName = string

export type lod = {
    instancedMesh2LevelsMap: ImmutableMap<instancedMesh2LODId, Array<level>>,
    // bvhMap: ImmutableMap<instancedMesh2LODId, InstancedMeshBVH>,
    lod2s: List<InstancedLOD2>,
    skinLOD2s: List<InstancedSkinLOD2>,

    // needsUpdateForHierachyLODQueue: Array<boolean>,
    needsUpdateForHierachyLODQueueMap: Map<hierachyLODQueueName, Array<boolean>>,



    octreeForStaticLODContainer: Octree,
    staticLODContainerMaxIndex: number,

    // visibleIndicesAfterfrustumCull: Array<staticLODContainerIndex>,
    // visibleIndicesAfterfrustumCull: Record<staticLODContainerIndex, boolean>,
    // visibleIndicesAfterfrustumCull: MutableNumberMapUtilsT<staticLODContainerIndex, boolean>,
    visibleIndicesAfterfrustumCull: Map<staticLODContainerIndex, boolean>,

    staticLODContainerNames: Map<staticLODContainerIndex, name>,
    staticLODContainerIsCollisionable: Map<staticLODContainerIndex, status>,
    staticLODContainerIsVisible: Map<staticLODContainerIndex, status>,
    staticLODContainerTransforms: Map<staticLODContainerIndex, Matrix4>,
    staticLODContainerBoxes: Map<staticLODContainerIndex, Box3>,
    staticLODContainerIndicesMap: Map<name, staticLODContainerIndex>,
    // staticLODContainerMap: Record<staticLODContainerIndex, StaticLODContainer>,


    // lodQueueStatusMap: Record<name, status>
    lodQueueMap: Map<name, LODQueue>,
}

export type config = {
    isDebug: boolean,
    isProduction: boolean,
    isNotTestPerf: boolean,
    isSkipScenario: boolean,
    isSkipGameEvent: boolean,
    isShowDemo: boolean,
}

type deferFunc<specificState> = (specificState: specificState) => Promise<specificState>

export type deferExecFuncData<specificState> = {
    func: deferFunc<specificState>,
    loopCount: nullable<number>,
    time: nullable<number>,
    name: name,

    isPause: boolean,
}

export type frameIndex = number

export type flow = {
    frameIndex: frameIndex,
    fps: number,
    maxFPS: number,

    isStopLoop: boolean,
    isInReduce: boolean,

    stoppedLoopCount: number,

    // loopIndex:number,
    // deferExecFuncs: List<deferExecFuncData<any>>,
    deferExecFuncs: Array<deferExecFuncData<any>>,

    // needRemoveDeferExecFuncs: Record<name, deferExecFuncData<any>>,
    needRemoveDeferExecFuncs: Array<name>,
    // needRemoveDeferExecFuncs: Array<[name, nullable<deferFunc<any>>]>,

    // lastTime: nullable<number>,
    // lastFrameIndex: nullable<number>,
    lastTime: number,
    lastFrameIndex: number,
    firstUpdateTime: number,

}

export type collision = {
    // emitterCollisionContainers: Array<LODContainer>,
    // playerMoveCollisionContainers: Array<LODContainer>,
    playerMoveCollisionContainers: Array<LODQueue>,
    // cameraCollisionOctrees: Array<StaticLODContainer>,
}


export enum girlType {
    PlayerGirl = "PlayerGirl",
    PlayerGoddess = "PlayerGoddess",
    LevelGiantess = "LevelGiantess",
    LevelGiantessHard = "LevelGiantessHard",
    BossGiantess = "BossGiantess",
}


export enum usedGirlEnum {
    None = "None",
    PlayerGirl = "PlayerGirl",
    WildGiantess = "WildGiantess",
    EnemyGiantess = "EnemyGiantess",
    PlayerGoddess = "PlayerGoddess",
    BossGiantess = "BossGiantess",
}

// export type usedGirlEnum | string

export type usedGirl = string

export type mmd = {
    loader: MMDLoader,
    // helper: MMDAnimationHelper,
    helperMap: ImmutableMap<usedGirl, MMDAnimationHelper>,
    // currentUsedGirl: usedGirl,
    currentUsedGirls: Array<usedGirl>,
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


export enum camp {
    None,
    Player,
    Enemy,
    Giantess,
    Other,
}


export type gemParticle = {
    id: id,

    fromName: name,
    camp: camp,

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
    getDirectionFunc: (specificState: any, position: [number, number, number]) => [number, number, number],
}

export type gemEmitter = {
    geometry: nullable<BufferGeometry>,
    particles: Array<gemParticle>
}

export type gemEmitterParam = {
    life: number,
    size: number,
    speed: number,
    position: [number, number, number],
    getDirectionFunc: (specificState: any, position: [number, number, number]) => [number, number, number],

    fromName: name
    camp: camp,
}


export type coinParticle = gemParticle

export type coinEmitter = gemEmitter

export type coinEmitterParam = gemEmitterParam

export type bulletParticle = {
    id: id,

    fromName: name,
    camp: camp,

    fromPosition: [number, number, number],

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
    direction?: [number, number, number],
    getDirectionFunc?: (specificState: any, position: [number, number, number]) => [number, number, number],
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
    // fromPosition: [number, number, number],
    direction?: [number, number, number],
    getDirectionFunc?: (specificState: any, position: [number, number, number]) => [number, number, number],

    fromName: name
    camp: camp,
}

export type rocketParticle = {
    id: id,

    fromName: name,
    camp: camp,

    // opacity: number,
    // size: number,
    life: number,
    createTime: number,
    updateTime: number,
    speed: number,
    position: [number, number, number],
    direction: [number, number, number],
    // getDirectionFunc?: (specificState: any, position: [number, number, number]) => [number, number, number],
}

export type rocketEmitter = {
    // geometry: nullable<BufferGeometry>,
    particles: Array<rocketParticle>,
    queue: nullable<LODQueue>,
    // queueIndexMap: MutableNumberMapUtilsT<id, lodQueueIndex>,
    queueIndexMap: Map<id, lodQueueIndex>,
}

export type rocketEmitterParam = {
    life: number,
    size: number,
    speed: number,
    position: [number, number, number],
    direction: [number, number, number],

    fromName: name
    camp: camp,
}



export type missileVehicleMissileParticle = rocketParticle

export type missileVehicleMissileEmitter = rocketEmitter

export type missileVehicleMissileEmitterParam = rocketEmitterParam


// export type laserBulletParticle = rocketParticle

// export type laserBulletEmitter = rocketEmitter

// export type laserBulletEmitterParam = rocketEmitterParam

// export type submachineBulletParticle = bulletParticle

// export type submachineBulletEmitter = bulletEmitter

// export type submachineBulletEmitterParam = bulletEmitterParam


export type laserBulletParticle = bulletParticle

export type laserBulletEmitter = bulletEmitter

export type laserBulletEmitterParam = bulletEmitterParam


export type fireballParticle = bulletParticle

export type fireballEmitter = bulletEmitter

export type fireballEmitterParam = bulletEmitterParam




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



// export type submachineBulletHitParticle = bulletHitParticle

// export type submachineBulletHitEmitter = bulletHitEmitter

// export type submachineBulletHitEmitterParam = bulletHitEmitterParam



export type laserBulletHitParticle = bulletHitParticle

export type laserBulletHitEmitter = bulletHitEmitter

export type laserBulletHitEmitterParam = bulletHitEmitterParam



// export type fireballHitParticle = bulletHitParticle

// export type fireballHitEmitter = bulletHitEmitter

// export type fireballHitEmitterParam = bulletHitEmitterParam




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


// export type iceEmitterParam = {
//     life: number,
//     // size: number,
//     width: number,
//     height: number,
//     speed: number,
//     position: [number, number, number],

//     resourceId: string,


//     setQuaternionFunc?: (quaternion: Quaternion) => Quaternion,

//     // offset: [number, number],
//     // repeat: [number, number],

//     // planeMesh:
// }

// export type iceParticle = {
//     // id: id,

//     opacity: number,
//     // size: number,
//     life: number,
//     createTime: number,
//     updateTime: number,
//     speed: number,
//     position: [number, number, number],

//     offset: [number, number],
//     // repeat: [number, number],

//     planeMesh: Mesh,
// }

// export type iceEmitter = {
//     // geometry: nullable<BufferGeometry>,
//     particles: Array<iceParticle>
// }

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

    bulletLastPosition: Record<id, [number, number, number]>,

    // needCollisionCheckLoopCountMap: Record<id, loopCount>,
    // needCollisionCheckLoopCountMap: MutableNumberMapUtilsT<id, loopCount>,
    needCollisionCheckLoopCountMap: Map<id, loopCount>,

    dustEmitter: nullable<dustEmitter>,
    stompDustEmitter: nullable<stompDustEmitter>,
    flameEmitter: nullable<flameEmitter>,
    // bulletEmitter: nullable<bulletEmitter>,
    // submachineBulletEmitter: nullable<submachineBulletEmitter>,
    // propBulletEmitter: nullable<bulletEmitter>,
    laserBulletEmitter: nullable<laserBulletEmitter>,
    // fireballEmitter: nullable<fireballEmitter>,
    shellEmitter: nullable<shellEmitter>,
    shellEmitOrExplodeEmitter: nullable<shellEmitOrExplodeEmitter>,
    // bulletHitEmitter: nullable<bulletHitEmitter>,
    propBulletHitEmitter: nullable<bulletHitEmitter>,
    // submachineBulletHitEmitter: nullable<submachineBulletHitEmitter>,
    laserBulletHitEmitter: nullable<laserBulletHitEmitter>,
    // fireballHitEmitter: nullable<fireballHitEmitter>,
    bloodHitEmitter: nullable<bulletHitEmitter>,
    sparkLightHitEmitter: nullable<bulletHitEmitter>,
    sparkHeavyHitEmitter: nullable<bulletHitEmitter>,
    weaknessHitEmitter: nullable<bulletHitEmitter>,
    waterBloomEmitter: nullable<waterBloomEmitter>,
    milkSplashEmitter: nullable<milkSplashEmitter>,
    clothDestroyedEmitter: nullable<clothDestroyedEmitter>,
    blinkEmitter: nullable<blinkEmitter>,
    swipingHitEmitter: nullable<swipingHitEmitter>,
    protectEmitter: nullable<protectEmitter>,

    rocketEmitter: nullable<rocketEmitter>,
    missileVehicleMissileEmitter: nullable<missileVehicleMissileEmitter>,

    gemEmitter: nullable<gemEmitter>,
    coinEmitter: nullable<coinEmitter>,



    // iceEmitter: nullable<iceEmitter>,
}



// type resourceId = string

export type needToPlayData = {
    resourceId: resourceId,
    volume: number,
    isLoop: boolean
}

// export type isPlayingData = {
//     resourceId: string,
// }

export type sound = {
    needToPlayList: List<needToPlayData>,
    lastPlayTimeMap: ImmutableMap<resourceId, number>,

    // isPlayingList: List<resourceId>,
}

export enum fontType {
    NormalAttack,
    HeavyAttack,
    WeaknessAttack,
    CritAttack,
    // MissAttack,

    NormalDamage,
    HeavyDamage,
    WeaknessDamage,
    CritDamage,
    // MissDamage,

    Heal,
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

export enum labelEffect {
    None,
    BiggerSize
}

type labelKey = string

export type label = {
    // ctx: CanvasRenderingContext2D,

    labelPool: Map<labelKey, Array<Sprite>>,

    needToShowList: List<needToShowData>,
    // labelSeatMap: Record<labelSeat, labelValue>,
    // labelSeatTweenMap: Record<labelSeat, tween>,

    labelTweensMap: Map<targetName, Array<tween>>,
    needRemoveLabelMap: Map<targetName, [labelKey, Sprite]>,
    aliveLabelCountMap: Map<targetName, number>
}

// export type renderSetting = {
//     hd: hdLevel,
//     renderAccuracy: renderAccuracyLevel,
//     shadow: shadowLevel,
//     isShowBlood: boolean,
//     maxUnitCount: maxUnitCount,
//     physics: physicsLevel,

//     cameraRotateSpeed: cameraRotateSpeed,
//     mapSize: mapSize,
// }

export type renderSetting = {
    // isRenderAccuracyIncrease: boolean,
}

export type version = {
    mainVersion: number,
    subVersion: number,
    postfix: nullable<string>,
    newContentChi: string,
    newContentEng: string,

    isVersionUpdate: boolean,
}

export type fsmStateName = number | string

export type fsm_state<specificState extends any> = {
    name: fsmStateName,
    enterFunc: (specificState: specificState, stateMachine: stateMachine<specificState>, data: any) => Promise<specificState>,
    executeFunc: (specificState: specificState, data: any, stateMachine: stateMachine<specificState>) => Promise<specificState>,
    exitFunc: (specificState: specificState, stateMachine: stateMachine<specificState>, data: any) => Promise<specificState>,
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
    OnceAndKeepLast,
    KeepLast
}

export type gpuSkin = {
    clipDurationsMap: Map<objectName, Array<number>>,
    clipStepsMap: Map<objectName, Array<number>>,

    instancedSkeletonAnimationTimeMap: Map<objectName, time>,
    playedClipIndexMap: Map<objectName, [number, gpuSkinPlayMode]>,
    onceClipOnCompleteFuncMap: Map<objectName, onCompleteFunc<any>>,
    // isOnceClipOnCompleteFuncExecutedMap: Map<objectName, boolean>,

    animationDurationFactorMap: Map<objectName, number>,
}

export type pathFind = {
    gridMap: ImmutableMap<string, PF.Grid>,
    // findedPaths: List<Array<Vector3>>,

    step: nullable<number>,

    lastFindPathTimeMap: ImmutableMap<name, number>
}

type length = number

export type optimize = {
    // float32ArrayPools: Array<Float32Array>,
    // float32ArrayPools: MutableNumberMapUtilsT<length, Float32Array>
    float32ArrayPools: Map<length, Float32Array>
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

    optimize: optimize,
}
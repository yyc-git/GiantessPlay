// import { abstractState, gameObject, position, state } from "type-default/src/Type"
import { nullable } from "block/src/Type"
import { getLevelGirlDestroyProp } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardData"
import { isExceedMaxMMDGiantessCountAfterAdd } from "frontend/src/scene3d_layer/script/scene/scene_city/difficulty/HeatImplementer"
import { isCloth } from "frontend/src/scene3d_layer/script/scene/scene_city/girl/Cloth"
import { getBodyHp } from "frontend/src/scene3d_layer/script/scene/scene_city/girl/Girl"
import { getFullHp } from "frontend/src/scene3d_layer/script/scene/scene_city/manage/city1/milltary_vehicle/Tank"
// import { api as blockAPI } from "block/src/BlockManagerType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { state as abstractState } from "meta3d-jiehuo-abstract/src/type/StateType"

type name = string

type size = [number, number, number]

export type vector2 = any

export type vector3 = any

export type box3 = any

export type obb = any

export type matrix4 = any

export type quaternion = any

export type gameObject = any

export type material = any

export type side = any

export type blending = any

export type color = any

export type animationClip = any

export type bufferGeometry = any

export type vector2API = {
    create: (x: number, y: number) => vector2,
    fromArray: (v1: vector2, arr: [number, number]) => vector2,
}

export type vector3API = {
    create: (x: number, y: number, z: number) => vector3,
    createEmpty: () => vector3,
    add: (v1: vector3, v2: vector3) => vector3,
    sub: (v1: vector3, v2: vector3) => vector3,
    getX: (v1: vector3) => number,
    getZ: (v1: vector3) => number,
    setZ: (v1: vector3, z: number) => vector3,
    getY: (v1: vector3) => number,
    setY: (v1: vector3, y: number) => vector3,
    set: (v1: vector3, x: number, y: number, z: number) => vector3,
    multiply: (v1: vector3, v2: vector3) => vector3,
    multiplyScalar: (v1: vector3, scalar: number) => vector3,
    setScalar: (v1: vector3, scalar: number) => vector3,
    fromArray: (v1: vector3, arr: [number, number, number]) => vector3,
    toArray: (v1: vector3, arr: Array<number>) => [number, number, number],
    clone: (v1: vector3) => vector3,
    normalize: (v1: vector3) => vector3,
    distanceToSquared: (v1: vector3, v2: vector3) => number,
    distanceTo: (v1: vector3, v2: vector3) => number,
    applyQuaternion: (v1: vector3, quaternion: quaternion) => vector3,
    getLength: (v1: vector3) => number,

    getTempVector1: () => vector3,
    getTempVector2: () => vector3,
    getTempVector3: () => vector3,
}

export type quaternionAPI = {
    create: (x: number, y: number, z: number, w: number) => quaternion,
    clone: (q1: quaternion) => quaternion,
}


export type box3API = {
    createEmpty: () => box3,
    getSize: (b1: box3, result: vector3) => vector3,
    getCenter: (b1: box3, result: vector3) => vector3,
    setFromCenterAndSize: (b1: box3, center: vector3, size: vector3) => box3,
    clone: (b1: box3) => box3,
    union: (b1: box3, b2: box3) => box3,
    copy: (source: box3, target: box3) => void,
    intersectsBox: (b1: box3, b2: box3) => boolean,
    applyMatrix4: (b1: box3, m1: matrix4) => box3,
    expandByScalar: (b1: box3, scalar: number) => box3,
    getBoxVolumn: (b1: box3) => number,
    getBoxMaxSize: (b1: box3) => number,
    getBoxBottomPoint: (b1: box3, factor: number, r: vector3) => vector3,
    getBoxTopPoint: (b1: box3, factor: number, r: vector3) => vector3,
    setBoxHeight: (b1: box3, height: number, centerY: number) => box3,

    getTempBox1: () => box3,
}

export type obbAPI = {
    toBox3: (o1: obb) => box3,
    getCenter: (o1: obb) => vector3,
    makeOBBHeightMax: (o1: obb) => obb,
    expandOBB: (o1: obb, scalar: number) => obb,
}

export type matrix4API = {
    create: () => matrix4,
    compose: (mat: matrix4, position: vector3, quaternion: quaternion, scale: vector3) => matrix4,
    getScaleFromMatrix4: (mat: matrix4) => vector3,
    setScaleToMatrix4: (mat: matrix4, scale: vector3) => matrix4,
}

export type materialAPI = {
    getFrontSide: () => side,
    getDoubleSide: () => side,


    getNoBlending: () => blending,
    createColor: (r: number, g: number, b: number) => color,

    setSide: (m: material, side: side) => material,
    setAlphaTest: (m: material, alphaTest: number) => material,
    setBlending: (m: material, blending: blending) => material,
    setColor: (m: material, color: color) => material,
    setSpecular: (m: material, specular: color) => material,
    setShininess: (m: material, value: number) => material,
}

export type gameObjectAPI = {
    getGameObjectByName: (gameObject: gameObject, name: name) => gameObject,
    getWorldPosition: (gameObject: gameObject) => vector3,
    clone: (gameObject: gameObject) => gameObject,
    forEach: (gameObject: gameObject, func: (gameObject: gameObject) => void) => void,

    isSkinnedMesh: (gameObject: gameObject) => boolean,

    getAnimationClip: (gameObject: gameObject) => animationClip,
}



type eventName = string

export type customEvent = {
    name: eventName,
    userData: nullable<any>
}

export type eventHandler = (api: api, state: state, customEvent: customEvent) => Promise<state>

export type eventAPI = {
    on: (state: state, name: eventName, handler: eventHandler) => state,
    onWithUserData: (state: state, name: eventName, handler: any) => state,
    onForGetData: (state: state, name: eventName, handler: any) => state,
    onByReadWriteState: (state: state, name: eventName, handler: any) => state,
    // off: (state: state, name: eventName, handler: eventHandler) => state,
    offAll: (state: state, name: eventName) => state,
    trigger: any,

    getLoadWholeResourceEventName: () => eventName,
    getPlayIndexSoundEventName: () => eventName,
    getStopIndexSoundEventName: () => eventName,


    getLoadSceneResourceEventName: () => eventName,
    getInitWhenImportSceneEventName: () => eventName,
    getUpdateEventName: () => eventName,
    getDisposeEventName: () => eventName,
    getHandleGiantessRemainHpEventName: () => eventName,
    getHandleDamageGiantessEventName: () => eventName,
    getHandleDamageLittleManEventName: () => eventName,
    getHandleDamageArmyEventName: () => eventName,
    getHandleAfterDamageLittleManEventName: () => eventName,
    getHandleAfterDamageGiantessEventName: () => eventName,
    getHandleAfterUsePropEventName: () => eventName,
    // getLevelGiantessDestoyedEventName: () => eventName,
    // getEnemyGiantessDestoyedEventName: () => eventName,
    getLevelGiantessDestoyedEventName: () => eventName,
    getBossDestroyedEventName: () => eventName,
    getBeforeAddGirlEventName: () => eventName,
    getAfterRemoveGirlEventName: () => eventName,
    getGenerateArmyEventName: () => eventName,
    getUpdateUIEventName: () => eventName,
    getMissionFinishEventName: () => eventName,
    getGetLittleManValueEventName: () => eventName,
    getGiantessStressingEventName: () => eventName,
    getGiantessExcitementEventName: () => eventName,
    getGiantessClimaxEventName: () => eventName,
    getGenerateLittleManRandomCareerEventName: () => eventName,
    getGenerateGiantessRandomCareerEventName: () => eventName,
    getTriggerPlayerGirlEatHandlerEventName: () => eventName,
    getPickPropRangeDistanceFactorForLittleManEventName: () => eventName,
    getGetPropEventName: () => eventName,
    getStompHitTerrainEventName: () => eventName,
    getStartKeepStompEventName: () => eventName,
    getEndStompBackEventName: () => eventName,
    getFirstStartKeepLeftStompEventName: () => eventName,
    getEndLeftStompBackEventName: () => eventName,
    getInsertEventName: () => eventName,
    getPutToBreastEventName: () => eventName,
    getPutToShoeEventName: () => eventName,
    getPickupEventName: () => eventName,
    getStartKeepBreastPressEventName: () => eventName,
    getEndBreastPressBackEventName: () => eventName,
    getFreeUBEventName: () => eventName,
    getFreeShoeEventName: () => eventName,
    getRemovePickDataEventName: () => eventName,
    getRemoveBreastDataEventName: () => eventName,
    getRemoveShoeDataEventName: () => eventName,
    getRemoveUBDataEventName: () => eventName,



    getKeydownEventName: () => eventName,
    getKeyupEventName: () => eventName,
    getPointdownEventName: () => eventName,
    getPointupEventName: () => eventName,
}

export type uiAPI = {
    deferShow: any,
    hide: any,
}

export type sceneUIAPI = {
    show: any,
    showModal: any,
    hideModal: any,
    alert: any,
    hasOpenedModal: any,
}


export type littleManAPI = {
    isLittleMan,
    initWhenImportScene,
    update,
    setActionState,
    getStateMachine,
    shootStartHandler,
    getBox,
    getLookat,
    triggerAction,
    isActionState,
    resetIsTriggerAction,
    getHpIncrease,
    setHpIncrease,
    updatePosition,
    isBack,

    setPosition,
    handleExitControlled,
    setStateMachine,
    createLieState,
    createInitialState,
    setWorldPositionAndComputeBox,
    updateMoveCollision,
    buildCameraFar,
    getCameraFar,
    setCameraFar,

}

export type gameEventDirectorAPI = {
    dispose,
    initWhenImportScene,
}

export type mapAPI = {
    initWhenImportScene,
    getRandomMapLoadData,
}

export type missionAPI = {
    initWhenImportScene,
}

export type configDataAPI = {
    setCollisionShapeData,
    setGirlValue,
    setGameEventData,
    setGameEventDirectorData,
    setScenaryData,
    mergeRewardData,
}


export type resourceId = string

export enum resourceType {
    ArrayBuffer,
    MMD,
    Texture,
    Audio
}

export type loadAPI = {
    addResourceData: (state: state, resourceData: Array<{ id: resourceId, path: string | Array<string> | [string, Array<[string, string]>], type: resourceType }>) => state,
    getResource: (abstractState: abstractState, resourceId: resourceId) => any,
}

type soundData = {
    resourceId: resourceId,
    volume: number,
    isLoop: boolean
}

export type soundAPI = {
    play: (state: state, data: soundData) => state,
    stop: (state: state, resourceId: resourceId) => state,
}

export type blockAPI = {
    getBlockState<blockState>(state: state, blockProtocolName: string, blockName: string): blockState,
    // hasBlockState<blockState>(state: state, blockProtocolName: string, blockName: string): boolean,
    setBlockState<blockState>(state: state, blockProtocolName: string, blockName: string, blockState: blockState): state,

    getBlockService<blockService>(state: state, blockProtocolName: string, blockName: string): blockService,

    getAllBlockServiceFuncWithDefault<blockService>(state: state, func: (service: blockService) => any, blockProtocolName: string, defaultValue: any): any,
}

export type internationAPI = {
    // isChinese: (state: state) => boolean,
    // isEnglish: (state: state) => boolean,
    isChinese: () => boolean,
    isEnglish: () => boolean,
}

export type girlAPI = {
    getGirlBox: any,
    isGirl: any,
    computeAttenuationByHeightForEffect,
    isCloth,
    getStateMachine,
    setStateMachine,
    getBodyHp,
    getFullHp,
    getCenter,
    getHpIncrease,
    setHpIncrease,
    getScaleIncrease,
    setScaleIncrease,
    updatePosition,
    getRotation,
    isBack,
    isActionState,
    getCurrentAnimationName,
    setPosition,
    getBone,
    getGirl,
    getSkillStateFactor,
    computeGirlBoxAndSetToState,
    resetAction,
    computeAnimatonDurationFactor,
    getGiantessCamp,
    // computeGirlBoxAndNotChangeCenterXY,
    getUsedGirlByName,
    getCurrentUsedGirls,
    buildNameByUsedGirl,

    initWhenImportScene,
    update,

}

export type cameraAPI = {
    update,
}

export type api = {
    NumberUtils: any,
    NullableUtils: any,
    ArrayUtils: any,
    TransformUtils: any,
    DamageUtils: any,
    TupleUtils: any,
    MutableNumberMapUtils: any,
    MutableRecordUtils,
    MutableMapUtils,

    ModelLoader: any,
    Collision: any,
    StateMachine: any,
    GPUSkin: any,
    Flow: any,
    SoundManager: any,
    ArticluatedAnimation: any,
    LOD: any,
    ParticleManager: any,
    // Terrain,
    // UI,
    NewThreeInstance: any,
    Loader: any,
    Device: any,
    PathFind: any,


    GiantessBuildUtils,
    LittleManBuildUtils,






    blockAPI: blockAPI,

    getIsProduction: (state: state) => boolean,

    internation: internationAPI,

    // isMobile: () => boolean,
    // isAndroid: () => boolean,
    // isMac: () => boolean,

    vector2: vector2API,
    vector3: vector3API,
    quaternion: quaternionAPI,
    box3: box3API,
    obb: obbAPI,
    matrix4: matrix4API,
    material: materialAPI,
    gameObject: gameObjectAPI,

    event: eventAPI,
    load: loadAPI,
    sound: soundAPI,
    girl: girlAPI,
    littleMan: littleManAPI,
    ui: uiAPI,
    sceneUI: sceneUIAPI,
    gameEventDirector: gameEventDirectorAPI,
    map: mapAPI,
    mission: missionAPI,
    configData: configDataAPI,
    camera: cameraAPI,


    multiplyScalar: (size: size, scalar: number) => size,
    getSizeFactor: (state: state) => number,

    getAbstractState: (state: state) => abstractState,
    setAbstractState: (state: state, abstractState: abstractState) => state,

    getTargetDataForSoldier: any,
    getArmyValueForAttack: any,
    getEmitSpeedFactor: any,
    isChangeToLieState: any,
    createStressingState: any,
    createDestroyingState: any,
    handleDestroying: any,
    handleDestroyed: any,
    buildBloodDecalQueue: any,
    setDefenseFactor: any,
    setMoveSpeed: any,
    setAttackFactor: any,
    setEmitSpeedFactor: any,
    setCritRatioFactor: any,
    // setMissRatio: any,
    generateArmy: any,
    generateCharacterCrowd: any,
    setCamp: any,
    addBoneGroup: any,
    setBonePositionOffset: any,
    parseCharacterQueue: any,
    getScene: any,
    getIsDebug: any,
    getVolume: any,
    // getEliteGiantessVolume: any,
    createMoveState: any,
    isMaxArmySpeed: any,
    computeEliteGiantessMoveSpeed: any,
    getMoveSpeed: any,
    getGiantessTransformFunc: any,
    getPickTransformPrefix: any,
    createBloodData: any,
    updateEliteGiantessAI: any,

    updateArmyValue: any,
    updateEliteGiantessValue: any,
    updateEliteGiantessValueDefault: any,
    addBox3Helper: any,
    handleCollision: any,
    buildDownDirection: any,
    getAttackTarget: any,
    getCampExn: any,
    computeTimeSecond: any,
    isLieState: any,
    getDamageTypeFactor: any,
    getForceFactor: any,
    disposeStaticDynamicUnitData: any,
    checkCurrentState: any,
    queryOBBShapeCollisionWithBox: any,
    queryAllOBBShapesCollisionWithBox: any,
    updateTransform: any,
    handlePickdown: any,
    getLocalTransform: any,
    getBoxForPick: any,
    changeStandBoxToLieBox: any,
    getShootDirection: any,
    getParticleNeedCollisionCheckLoopCount: any,
    getPointBoxForParticle: any,
    getPointBoxForBullet: any,
    // computeHeight: any,
    getActualGirlHeight: any,
    getIsEliteGiantessAttacking: any,
    setIsEliteGiantessAttacking: any,
    fixGiantessModelMaterial: any,
    getNearDistance: any,
    getMiddleDistance: any,

    createParticleState: any,
    buildParticleId: any,
    setNeedCollisionCheckLoopCount: any,
    getCurrentFrameImageData: any,
    buildOffsetParticle: any,
    getAllEmitParticlesForCollisionCheck: any,

    addGun: any,
    getTextureImageBase64: any,
    handleHitArmy: any,

    disposeGeometry: any,

    addBuff: any,
    getLittleManName: any,
    getLittleManValue: any,
    subPropCount: any,
    getOriginSystemVolume: any,
    getNow: any,

    buildFuncData: any,
    updateGiantessItem: any,
    getValueByUsedGirl: any,

    isLittleCharacterType: any,
    isGiantessCharacterType: any,
    isLevelGiantess: any,
    isLevelGiantessExceptPlayer: any,
    isPlayerGoddess: any,
    isPlayerGiantess: any,
    isEnemyGiantess: any,
    triggerGameEvent: any,
    addInstantGameEventData: any,
    getCommand: any,
    computeIncreaseFactor: any,
    getGirlScale: any,
    setGirlScale: any,
    selectValidGTSPoint: any,
    addPlayerGoddess: any,
    getLookatQuaternion: any,
    getPlayerPosition: any,
    setBehaviourTreeData: any,
    getBehaviourTreeManagerKey: any,
    buildTree: any,
    getLevelByCharacter: any,
    isRandomRate: any,
    // getCurrentUsedGirlData: any,
    isPose: any,
    isChangeScaling: any,
    hasPickData,
    hasTarget,
    getGirlValue,
    getGirlValueByUsedGirl,
    isInGirlAttackRange,
    getTarget,
    clearTarget,
    isGiantessNotActiveBigger,
    getSettingFactorAffectBiggerRate,
    getBiggerCount,
    getAllAliveArmyData,
    getVeryNearestTargetCount,
    generateId,
    // selectPlayerGoddessTarget,
    walkToTarget,
    rest,
    stomp,
    stompRub,
    leftStomp,
    jumpStomp,
    sprayMilk,
    putToBreast,
    putToShoe,
    freeUB,
    freeBreast,
    freeShoe,
    breastPress,
    breastPressRub,
    crawlLick,
    crawlBeat,
    sitRub,
    tightenLeg,
    pickup,
    pickdown,
    pinch,
    eat,
    thrust,
    insert,
    changePose,
    bigger,
    clearTargetAction,
    // resetGiantessControllerBlockState,


    // getGirlName: any,
    setNeedUpdateStatusName: any,
    getCurrentMMDCharacterName: any,
    getCurrentMMDCharacterNameByUsedGirl: any,
    getMMDName: any,

    getSceneChapter,
    getLanguageDataByData,


    isChangeCrawlPoseState,
    getCurrentPose,
    triggerGirlAction,
    getExcitement,
    isControlledState,
    generateReward,

    hasBuff,
    removeBuff,
    findBuff,
    findBuffData,
    subExcitement,
    getDelta,
    getDeltaFactor,
    // 
    markWhetherNotExecuteGiantessAI,
    getCollisionPartCenter,
    getGirlPosition,


    getLittleManFullHp,
    setLittleManHp,

    readState,
    writeState,
    handleMissionComplete,
    handleMissionFail,

    getMilkSplashSoundResourceId,
    getGirlVolume,
    getLittleManWorldPosition,

    isEnteringNextLevel,
    addApplyFuncForNextLevel,
    hasGirlValue,

    getDifficultyDataPlayLevel,
    buildScenePlayLevel,
    disposePlayLevel,
    handlePlayLevel,
    setCharacterType,
    setAllCollisionParts,
    getDefaultAllCollisionParts,
    initWhenImportScenePlayLevel,
    behaviourTreeManagerInitWhenImportScenePlayLevel,
    updateStatus,
    registerDamageDataPlayLevel,
    getPropLoadData,
    handleBeforeLoadResourcePlayLevel,
    initClothHpData,
    getClothHpData,
    setUsedMMDData,
    getGameTime,
    updatePlayLevel,
    updateHeadLookatTarget,
    registerBossStatusUpdateFunc,
    parseAndAddResourcesTerrain,
    getDestroyRate,
    // isSceneChapter,

    isCanGenerateMax,
    generateArmyInSpecificPosition,
    generateEliteGiantesses,
    getArmyCountFactorByAutoDifficulty,
    getAllGameEventData,
    getAllGameEventDirectorData,
    getAllScenarioData,
    markBegin,
    markFinish,
    realtimeSay,
    findValidArmyPoint,
    generateSoldiers,
    generateMelees,
    generateInfantrys,
    generateRocketeers,
    generateCommanders,
    generateLaserers,
    generateMilltaryVehicles,
    generateTanks,
    generateMissileVehicles,
    generateFlameVehicles,
    hasAttackTarget,
    findNearestData,
    findRandomNearData,
    getAllAliveEliteGiantessData,
    getAllAliveSoldierData,
    getAllAliveMilltaryVehicleData,
    getAllAliveBuildingData,
    isNearObject,
    setAttackTarget,
    setAttackTargetObjectDataByVisibleData,
    setAttackTargetUsedGirl,
    getAttackTargetUsedGirl,
    getAttackTargetObjectData,
    getAllAliveArmyExceptEliteGiantessCount,
    getAllAliveEliteGiantessCount,

    convertSToMs,
    addImpendingGameEventData,
    selectTargetBySelectTargetPrior,
    selectTargetByDefault,
    selectLittleMan,
    selectRandomNearMilltaryBuilding,
    selectRandomNearMilltaryVehicle,
    selectRandomNearSoldier,
    selectRandomNearBuilding,
    addEnemyGiantess,
    addWildGiantess,
    getRandomMMDDataExceptMMDData,
    getAllSkillDataForLevelOrBoss,
    updateEnemyGiantessValue,
    updateWildGiantessValue,
    isBossLevel,
    resetCloth,
    restoreShoe,
    isNotAttackLittleMan,
    clearAttackTargetObjectOrBuilding,

    // updateLevelGiantessValue,
    getBossDestroyProp,
    getLevelGirlDestroyProp,
    addLevelGiantess,
    removeLevelGiantess,
    getPlayerName,
    updateLevelGiantess,
    damageLevelGiantess,
    triggerLevelGiantessAction,
    mergeAllRewardData,
    createStressingStateUtils,
    createDestroyedStateUtils,
    createDestroyingStateUtils,
    disposeLevelGiantessBuffData,
    getAutoDifficulty,
    computeNewValueByMultiply,
    computeNewValueByDivid,
    computeRatio,
    getAllUsedMMDDataForPlayerMMD,
    setPlayerMMDValue,
    getPlayerAttackTarget,
    triggerGameEventByFilter,
    selectRandomNearEliteGiantess,
    isNearGirl,
    isMiddleDistanceFromGirl,
    buildAllBuildingAndTreeResourceIds,
    randomLimitAllBuildingUsedResources,
    isVehicle,
    isRigidBody,
    isCharacter,
    addFootDamageDecal,
    computeScaleByBox,
    getHeightByBox,
    getPositionParrelToObj,
    isMiddleGiantessOrBiggerByScale,
    // getMeleeRange,
    isBuildingTarget,
    showDoor,
    handleDoor,
    isTriggerGirlAction,
    getPivotWorldPosition,
    getIsHit,
    // pickdownByQTE,
    getAllAliveMilltaryBuildingData,
    generateShellTurrets,
    generateMissileTurrets,
    generateMilltaryBuildingsDirectly,
    getTotalCoin,
    // setCoin,
    setTotalCoin,
    setLastAttackFrame,
    computeAttackFrames,
    computeRemainAttackFrames,
    isCanNotAttackByCD,
    selectTarget,
    getNearGirlDistance,
    // increasePlayerGoddessAttribute,
    getMaxScale,
    updateHpData,
    changeToInitialScale,
    resetPose,
    initAllLevelGirlValue,
    getAllNotRelatedToSceneBlockNames,
    getEnhenceAutoDifficulty,
    getEnhenceLevelGiantessLevel,
    limitEliteGiantessScale,
    isEliteGiantessMaxHeight,
    isEliteGiantessMinHeight,
    limitInitialScale,
    getSpecificGiantessMMDDataExceptMMDData,

    getEarlyFrameIndex,
    getFirstFrameIndex,
    getLastFrameIndex,
    isCanActionWhenClimb,
    getSwipingWeaponValue,
    handleAllCollisions,
    getLittleManVolume,
    buildFakeBulletParticle,
    getPlayerCamp,
    getCharacterType,
    // handleSwipHitStatic,
    // handleSwipHitGirl,
    // handleSwipHitArmy,
    // handleSwipHitLittleMan,

    buildDescriptionWithCharacterType,
    finishUse,
    getInteractionLoadData,
    getLoadResourceIdData,
    getAllInteractionConfig,
    getAllMapData,
    setUpdateLittleManWeaponFunc,
    updateUIAndSound,

    fixZFighting,

    // isPlayerName,
    getPositionParrelToGround,
    checkRangeBoxCollisionWithArmy,
    setArmyAddHitEffectFunc,
    setGiantessAddHitEffectFunc,
    isUseGirl,

    buildRandomDirectionInXZ,
    buildEffectWeaponValue,
    damageWithMultipleData,
    damageWithSingleData,
    damageGiantess,

    getArmyBoxByName,
    getArmyTransformByName,
    getArmyFullHp,
    setArmyHp,
    getArmyHp,
    isStressingState,

    isPlayerGirl,
    isPlayerGirlOrGiantess,
    getExcitementFactorLevel,
    getDamageBiggerFactorLevel,
    getExcitementByName,
    playSmallerAnimation,
    // setBiggerWay,
    getIsApplying,
    setGirlScaleAndKeepCamera,
    getDestroyedEventName,

    setGiantessStressingRate,
    getLateFrameIndex,
    getLittleManHp,
    getMaxForce,
    isNotMaxForce,
    scaleEliteGiantess,
    addLittleManHp,
    isArmy,
    isEliteGiantess,
    computeRateForBuff,

    limitScale,
    wrapActionNode,
    buildActionNodeForBalance,
    updateLevelGiantessValue,
    computeForceByHeight,

    getPlayerHeight,
    setOriginPlayerGirlScale,
    updateAnimationDurationFactor,
    // getAnimationDurationFactor,
    isNearPlayer,
    isGiantessExceptPlayer,

    getGiantessCharacters,
    getCaptureLevelGiantessEventName,
    buildCaptureLevelGiantessEventData,
    isVeryNearGirl,
    destroyGiantess,

    getUseCareerCharacterType,
    findRewardData,
    buildArmyRewardKey,
    addGemInLevel,
    addCoinInLevel,
    setExperienceValue,
    isPlayerByCharacterType,
    getPlayerNamesByIsUseCareerFeature,
    getMaxActuallMoveSpeed,
    isUseCareer,
    isMeleeWeapon,
    setEliteGiantessAnimationDurationFactor,
    isBossGiantess,
    buildGiantessStubData,
    getLevelCoin,
    addRandomOffset,
    updateArmyPositionByName,
    getPositionY,
    isNotInMovableRanges,
    isRangeWeapon,
    isRemoteDamage,
    getPositionByName,
    computeRemoteDistance,
    getUpdateLittleManWeaponFunc,
    isDamageArmyBack,
    isCreature,

    isPlayerGiantessByName,
    addCurrentGunBullet,

    // restoreCloth,
    // restoreShoe,
    getScaleIncrease,

    isUseCareerFeature,
    getCareerFeatureData,
    isCharacterType,
    findCareerFeatureDataByName,
    getCareerFeatureValue,
    getCareerFeatureValueByCharacterType,
    getUseCareerFeatureCharacterType,
    isUseCareerFeatureByCharacterType,
    getPlayerNamesByCharacterType,
    getNullableCareerFeautreDataValue,

    computeCoinByItemPriceFactor,
    isStudy,
    execLoop,
    setUIUpdateLoopCount,
    setGirlScaleByDeferTimeout0,

    getLastChangePoseTime,
    setLastChangePoseTime,
    getPassTimeFromNow,

    isGiantessControlled,
    buildAddLabelFunc,
    // getLabelTime,

    increaseGirlAttribute,
    getPlayerGirlValueFromGirlData,
    // getAllAttackRanges,

    limitNonBulletEmitterSpeed,

    // getValidRandomAttackRangeForWalkToTarget,
    getSelectActionPrior,
    getAttackAction,

    playGiantessVoice,
    // getLastHardTime,
    // setLastChangePoseTime,

    getHeightByScale,

    isNotGenerateArmy,
    isNotGenerateEliteArmy,

    setCurrentMMDCharacter,

    getWholeGameTimeMinutes,

    isGiantessControlledTargetNone,

    getAllSelectCharacterData,

    getPropCount,

    getStateMachine,
    getRateByHasCount,
    isBurstFire,
    triggerDownActionForBurstFire,
    triggerDownActionForContinueFire,
    triggerUpActionForBurstFire,
    triggerUpActionForContinueFire,

    isActive,
    formatSecondUnit,

    getGiantessVolume,
    getCollisionPartOBB,
    getShoeType,
    buildStompHitTerrainEventData,
    buildUpDirection,
    // buildChangeGiantessAnimationEventData,

    updateDistanceRateOnlyOnceInOneFrame,
    restoreCameraFromSavedData,
    updateThirdPersonControlsForChangeScale,

    changePose_,
    getAnimationNamesExceptDamageNames,

    findValidPosition,
    buildMultipleTweens,

    handleCharacterExitControlled,
    isDestoryRelatedStates,
    computeMovableVelocity,

    getGridForJudgeWalkable,
    handleRepel,
    handleRepelForCharacter,

    getPickObjectData,
    getPickObjectBox,
    addExcitement,
    buildGirlWeaponValue,
    executeExcitement,
    executeClimax,

    getGiantessUBControlledTransformFunc,
    getUBControlledTransformPrefix,
    removePickData,
    updateUBControlledTransform,
    buildInsertEventData,
    isBigGiantess,
    getUBObjectData,
    getUBBox,
    getExcitementBuffSuperPositionCount,

    handleUBFall,
    buildPutToBreastEventData,
    getGiantessPutToBreastTransformFunc,
    getPutToBreastTransformPrefix,
    updatePutToBreastTransform,
    handleBreastFall,
    handleHandFall,
    getPutToBreastObjectData,
    getPutToBreastBox,

    isCarryFull,
    buildPutToShoeEventData,
    getGiantessPutToShoeTransformFunc,
    getPutToShoeTransformPrefix,
    updatePutToShoeTransform,
    handleShoeFall,
    getPutToShoeObjectData,
    getPutToShoeBox,
    buildPickupEventData,
    computeFallTime,

    isEffect,
    resetFinish,
    computeDirectionInXZ,

    getNearTargets,
    addStatusToNameInTime,

    getPersonality,

    isPointInTriangle,
    lookatTarget,
    selectOneIndexByWeight,
    selectOneByWeight,
    selectOneByTwoLayerWeights,
    isInGirlAttackRangeWithTarget,

    getPickObjectTotalBoxVolume,
    isFallState,
    isRepelState,
    setTweensByKey,
    removeTweensByKey,
    getLastSetTargetTime,
    setLastSetTargetTime,

    setPersonality,
    getAllPersonalities,
    queryOBBShapeCollision,
    hitEffect,
    addBuffEmitBuff,
    resetAllFinish,

    computeRepelDirection,
    getGiantessLevel,
    queryBoxShapeCollision,
    handleEat,
    buildFakeGirlWeaponValue,
    isStatic,
    getGroundY,
    clearTargetByName,
    isPickedControlledState,
    isUBControlledState,
    isBreastControlledState,
    isShoeControlledState,

    increaseGiantessAttribute,
    increaseGoddessAttribute,
    limitBreastRatio,
    limitTorsorRatio,
    partialScaleBreast,
    partialScaleTorsor,
    getBreastPartialScaleRatio,
    getTorsorPartialScaleRatio,
    getBreastVolumnFactor,
    buildFreeEventData,
    preHandleAttackTarget,
    selectArmy,
    isEnemeyGiantessWithRate,
    getUBCapacityFactor,
    setBreastPartialScaleMaxFactor,
    setTorsorPartialScaleMaxFactor,
    buildRemoveDataData,
    addLabel,
    healArmy,
    queryPutDataByBox,
    isChangeToFallState,
    isRemoveShoe,
    findNearData,

    hasLevelGiantessExceptPlayer,
    hasLevelGiantessExceptPlayerGirl,
    getUsedGirlData,
    getNearestUsedGirl,
    hasUsedGirl,
    isGiantessCharacterTypeByUsedGirl,

    isSmallDistanceFromGirl,
    getNeedUpdateStatusName,

    isMMDCharacterExist,
    isExceedMaxMMDGiantessCountAfterAdd,
    getIsAllowFriendDamage,

    isUBed,
    isControlled,

}
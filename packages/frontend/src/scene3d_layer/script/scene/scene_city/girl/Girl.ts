import { Event, NullableUtils, Scene, Device, SkinAnimation, Loader, ModelLoader, Camera, DisposeUtils, ThirdPersonControls, Layer } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../../type/StateType"
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../state/State"
import { getScene, getState, setState, getDynamicGroup, getWalkLeftSoundResourceId, getWalkRightSoundResourceId, getWalkVehicle1SoundResourceId, getWalkVehicle2SoundResourceId, getGirlScale, getConfigData, isGiantessRoad, isLittleRoad, getLittleManSetting, getGiantessSetting, getIsBiggerNoLimit, getSceneChapter } from "../CityScene"
import { damageType, collisionPart, girl, stompPhase, walkPhase, soundType, force, objectStateName, thirdPersonCameraTarget, pose, actionState, scaleState, result, giantessStrength, giantessScale, damagePart } from "../type/StateType"
import { AnimationClip, AxesHelper, Box3, Box3Helper, CompressedArrayTexture, Euler, Matrix3, Matrix4, Mesh, MeshPhongMaterial, Object3D, Quaternion, Vector2, Vector3 } from "three"
// import { setTarget } from "./Camera"
import { getIsDebug } from "../../Scene"
import { getThirdPersonCameraTarget, getOrbitControlsTarget, isCameraCollision, updateThirdPersonControlsForChangeScale, getCameraType } from "../Camera"
import { Flow, Capsule } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract"
import { Map } from "immutable"
import { ScreenShake } from "meta3d-jiehuo-abstract"
import { buildLevelStatusUpdateEventData, getDestroyedEventName } from "../utils/EventUtils"
import { getGiantessStatusUpdateEventName, getPickupEventName, getPickdownEventName, getPinchJudageDamageEventName, getEatEventName, getStandToCrawlEventName, getCrawlToStandEventName, getLittleManStatusUpdateEventName, } from "../../../../utils/EventUtils"
import { actionName, animatioNameAndActionName, animationName, articluatedAnimationName, effect, excitement, forceSize, frameIndex, particle, track } from "../data/DataType"
import { move } from "./Move"
import { computeGirlBox, computeHeight, getGirlBox, getCurrentHeight, getScale, getScaleByHeight, setGirlRotation, markGirlVisible, markGirlNotVisible, getScaleIncreaseTimes, updateMMDPhysicsConfigForScale, isCanStressing, computeGirlBoxDefault } from "./Utils"
import { createFSMStateByAnimationNameDefault, getAllAnimationNames, getCurrentAnimationName, isChangeScaling, isCompletelyPlayingAnimation, isKeepPoseAnimation, isPlayingAnimation, isPlayingAnimationByWeight, playBiggerAnimation, playSmallerToHalfSizeAnimation, updateAnimation, updateAnimationDuration } from "./Animation"
import { computeDamageTypeDefault, computeForceDirectionDefault, updateAnimationCollision } from "./Collision"
import * as PickPose from "./PickPose"
import * as InitWhenImportScene from "./InitWhenImportScene"
import { createDestroyingState, createInitialState, createStressingState, getStateMachine, isChangeCrawlPoseState, isSkillState, setStateMachine, update as updateFSMState } from "./FSMState"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import * as StateMachine from "meta3d-jiehuo-abstract/src/fsm/StateMachine"
import * as DamageUtils from "../utils/DamageUtils"
import { fontType, labelAnimation } from "meta3d-jiehuo-abstract/src/type/StateType"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { girlValue } from "../data/ValueType"
import { isDestoryRelatedStates, isNotDamageState } from "../utils/FSMStateUtils"
import { getCurrentPose } from "./Pose"
import { isExcitementEnough, isZeroExcitement, subExcitement } from "./Excitement"
import { disposeMMDResource, getBone, isEnablePhysics } from "../utils/MMDUtils"
import { setNeedUpdateSkillBar } from "../UI"
import { crawlToStandHandler, standToCrawlHandler, updateCrawlPosePivot } from "./Crawl"
import * as GiantessGirl from "./giantess/Girl"
import * as LittleManGirl from "./little_man/Girl"
import { getDamagePartByCollisionPart, getDamagePartByJudge, getHpData, handleClothDestroyed, isCloth } from "./Cloth"
import { getBody, isShoe, mmdCharacter } from "../data/mmd/MMDData"
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType"
import { handleRemoveShoe } from "../data/mmd/Shoe"
import { isEnter } from "../scenario/ScenarioManager"
import { MMDAnimationHelper } from "meta3d-jiehuo-abstract/src/three/MMDAnimationHelper"
import { ScreenUtils } from "meta3d-jiehuo-abstract"
import { getHeight, getWidth } from "meta3d-utils/src/View"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();

export let getName = () => "girl"

export let isGirl = (name) => {
    return name == getName()
}

export let getGirlState = (state: state) => {
    return NullableUtils.getExn(getState(state).girl)
}

export let setGirlState = (state: state, girlState: girl) => {
    return setState(state, {
        ...getState(state),
        girl: NullableUtils.return_(girlState)
    })
}

export let getGirl = (state: state): Object3D => {
    return getGirlState(state).girlGroup
}

export let getGirlMesh = (state: state) => {
    return NullableUtils.getExn(getGirlState(state).girlMesh)
}

export let hasGirlMesh = (state: state) => {
    return !NullableUtils.isNullable(getGirlState(state).girlMesh)
}

export let getValue = (state: state) => {
    // let state = readState()

    // if (isGiantessRoad(state)) {
    //     return GiantessGirl.getValue(state)
    // }
    // else {
    //     return LittleManGirl.getValue(state)
    // }

    return NullableUtils.getExn(getConfigData(state).girlValue)
}

export let getStatusUpdateLoops = () => 100

export let getSkillData = (state: state, name: actionName) => {
    return NullableUtils.getExn(getValue(state).allSkillData.find(data => data.name == name))
}

let _getDefaultAnimationName = () => animationName.Idle


export let createState = (): girl => {
    return {
        stateMachine: StateMachine.create(getName(), createInitialState()),

        // currentMMDCharacter: mmdCharacter.Miku,
        currentMMDCharacter: mmdCharacter.Haku_QP,
        // currentMMDCharacter: mmdCharacter.Luoli1,
        // currentMMDCharacter: mmdCharacter.Haku_Lady,
        // currentMMDCharacter: mmdCharacter.Baixi_Maid,
        // currentMMDCharacter: mmdCharacter.Luka,
        // currentMMDCharacter: mmdCharacter.Meiko,

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

        customDuration: NullableUtils.getEmpty(),


        // capsule: Capsule.create(),
        // capsuleMesh: NullableUtils.getEmpty(),
        box: new Box3(),

        girlMesh: NullableUtils.getEmpty(),
        girlGroup: new Object3D(),

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
        lastUpdatedExcitement: 0,

        lastDamageTime: 0,

        lastMoveCollisionedTime: 0,

        hpMap: Map(),

        // isStatusChange: true,
        needUpdateStatus: NullableUtils.getEmpty(),


        triggeredAction: NullableUtils.getEmpty(),
        actionState: actionState.Initial,


        scaleState: scaleState.Normal,
        lastScaleChangeTime: 0,

        isChangeScaling: false,


        boneCacheMap: Map(),

        giantessAddToSkeletonData: NullableUtils.getEmpty(),

        isMoveCollisioned: false,
        isAllowMoveCollision: true,
        isRotationLock: false,
        isOnlyDamageLittleMan: false,

        girlGroupPositionDiffForChangePivot: NullableUtils.getEmpty(),

        computeBoxFunc: computeGirlBoxDefault,
        createFSMStateByAnimationNameFunc: createFSMStateByAnimationNameDefault,
        computeForceDirectionFunc: computeForceDirectionDefault,
        computeDamageTypeFunc: computeDamageTypeDefault,
    }
}

// export let getCapsuleConfig = (scale) => {
//     let capsuleRadius = 0.2 * scale
//     let capsuleLengthBetweenStartAndEnd = 1.6 * scale

//     return { capsuleRadius, capsuleLengthBetweenStartAndEnd }
// }

// let _setCapsuleScale = (state: state) => {
//     let scale = getScale(state)
//     let { capsule } = getGirlState(state)

//     let { capsuleRadius, capsuleLengthBetweenStartAndEnd } = getCapsuleConfig(scale)

//     capsule.set(
//         _v1.set(capsule.start.x, capsuleRadius, capsule.start.z),
//         _v2.set(capsule.end.x, capsuleRadius + capsuleLengthBetweenStartAndEnd, capsule.end.z),
//         capsuleRadius
//     )


//     return state
// }

export let disablePhysics = (state: state) => {
    let helper = MMD.getMMDAnimationHelper(getAbstractState(state))
    helper.enabled.physics = false

    return state
}

export let enablePhysics = (state: state) => {
    let helper = MMD.getMMDAnimationHelper(getAbstractState(state))
    helper.enabled.physics = true
    // MMD.getMMDAnimationHelper(getAbstractState(state)).isDisablePhysicsTranslation = false

    return state
}

export let restorePhysics = (state: state) => {
    let helper = MMD.getMMDAnimationHelper(getAbstractState(state))
    helper.enabled.physics = isEnablePhysics(state)

    return state
}

export let setIsUpdatePhysics = (state: state, isUpdate: boolean) => {
    let helper = MMD.getMMDAnimationHelper(getAbstractState(state))
    helper.isUpdatePhysics = isUpdate

    return state
}


export let setGirlScale = (state: state, scale) => {
    // let girl = getGirl(state)
    let girlMesh = getGirlMesh(state)

    let { originScale } = getGirlState(state)

    // let scaleIncreasement = scale / getScale(state)

    girlMesh.scale.set(originScale * scale, originScale * scale, originScale * scale)


    state = updateCrawlPosePivot(state)

    // state = _setCapsuleScale(state)

    // if (getIsDebug(state)) {
    //     let capsuleMesh = NullableUtils.getExn(getGirlState(state).capsuleMesh)

    //     capsuleMesh.scale.set(scale, scale, scale)
    // }


    return state
}

let _activateAllActions = (state: state) => {
    // requireCheck(() => {
    //     test("first animation name should be Idle", () => {
    //         return getConfigData(state).girlAllAnimationNames[0] == animationName.Idle
    //     })
    // }, getIsDebug(state))

    let abstractState = SkinBlendAnimation.activateAllActions(getAbstractState(state), getGirlMesh(state),
        MMD.getMMDAnimationHelper(getAbstractState(state)),
        getConfigData(state).girlAllAnimationNames
    )

    return setAbstractState(state, abstractState)
}

export let showGirl = (state: state) => {
    // requireCheck(() => {
    //     test("state should be Idle", () => {
    //         return StateMachine.isState(getStateMachine(state), objectStateName.Initial)
    //     })
    // }, getIsDebug(state))

    // if (getIsDebug(state)) {
    //     let capsuleMesh = getGirlState(state).capsuleMesh
    //     // capsuleMesh.visible = true
    // }



    // setTimeout(() => {
    //     girl.visible = true
    // }, deferLoopCount)
    // Layer.setAllToVisibleLayer(girl)

    // state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
    //     girl.visible = true

    //     // return Promise.resolve(setAbstractState(state, SkinAnimation.playSkinAnimation(getAbstractState(state), getGirlState(state).currentAnimationName, getName(), true)))


    //     return Promise.resolve(setAbstractState(state, SkinBlendAnimation.activateAllActions(getAbstractState(state), girl,
    //         MMD.getMMDAnimationHelper(getAbstractState(state)),
    //         getAllAnimationNames()
    //     )))
    // }, deferLoopCount))

    state = markGirlVisible(state)

    // let abstractState = SkinBlendAnimation.activateAllActions(getAbstractState(state), getGirlMesh(state),
    //     MMD.getMMDAnimationHelper(getAbstractState(state)),
    //     getConfigData(state).girlAllAnimationNames
    // )

    // // abstractState = SkinAnimation.playSkinAnimation(abstractState, animationName.Idle, getName(), true)
    // // SkinBlendAnimation.play(getGirlMesh(state), MMD.getMMDAnimationHelper(getAbstractState(state)), animationName.Idle, true)
    // // abstractState = SkinBlendAnimation.play(abstractState, getGirlMesh(state), MMD.getMMDAnimationHelper(getAbstractState(state)), animationName.Idle, true)

    // state = setAbstractState(state, abstractState)
    state = _activateAllActions(state)


    // state = setGirlState(state, {
    //     ...getGirlState(state),
    //     currentAnimationName: _getDefaultAnimationName()
    // })
    return StateMachine.execute(state, getStateMachine(state), null)
}

export let hideGirl = (state: state) => {
    state = markGirlNotVisible(state)

    return state
}

// export let immediatelyShowGirl = (state: state) => {
//     return showGirl(state, 0)
// }

// export let parseAndAddResources = (state: state) => {
//     if (getIsDebug(state)) {
//         let { capsuleRadius, capsuleLengthBetweenStartAndEnd } = getCapsuleConfig(1)

//         let capsuleMesh = Capsule.createCapsuleMesh({
//             radius: capsuleRadius,
//             length: capsuleLengthBetweenStartAndEnd
//         }, "red")

//         // scene.add(capsuleMesh)

//         state = setGirlState(state, {
//             ...getGirlState(state),
//             capsuleMesh: NullableUtils.return_(capsuleMesh)
//         })
//     }

//     return Promise.resolve(state)
// }

export let initWhenImportScene = InitWhenImportScene.initWhenImportScene


export let update = (state: state) => {
    if (isGiantessRoad(state)) {
        return GiantessGirl.update(state)
    }
    else {
        return LittleManGirl.update(state)
    }
}

export let getCenter = (state: state) => {
    // let { capsule } = getGirlState(state)

    // return capsule.start.clone().add(_v1.set(0, (capsule.end.y - capsule.start.y) / 2, 0))

    return getGirlBox(state).getCenter(new Vector3())
}

export let getCenterInFloor = (state: state) => {
    return getCenter(state).setY(0)
}

export let getCurrentMMDCharacterName = (state: state) => {
    return getGirlState(state).currentMMDCharacter
}

export let setCurrentMMDCharacter = (state: state, mmdCharacter: mmdCharacter) => {
    return setGirlState(state, {
        ...getGirlState(state),
        currentMMDCharacter: mmdCharacter,
    })
}

export let isCollisionWithGirl = (box, state) => {
    // let capsuleBox = getCapsuleBox(state)

    // return capsuleBox.intersectsBox(box) && getGirlState(state).capsule.intersectsBox(box)

    return getGirlBox(state).intersectsBox(box)
}

// let _isActionValid = (state: state, name: animationName) => {
//     switch (name) {
//         case animationName.Pickdown:
//             return PickPose.isPickdownValid(state)
//         default:
//             return true
//     }
// }

export let isActionTriggering = (state: state, name: actionName) => {
    switch (name) {
        case actionName.Run:
            return isActionState(state, actionState.Run)
        default:
            return isTriggerAction(state, name)
    }
}

let _isBelongToCurrentPoseAndScaleState = (state: state, name: actionName) => {
    return getConfigData(state).operateRenderData.filter(value => {
        return value.pose == getCurrentPose(state) && value.scaleState == getScaleState(state)
    })[0].value.map(v => {
        return v.name
    }).includes(name)
}

export let isActionValid = (state: state, name: actionName, isCheckExcitement: boolean) => {
    if (!hasGirlMesh(state)) {
        return false
    }

    if (name == actionName.Smaller
        // && (
        //     isChangeScaling(state) || getGirlScale(state) <= getValue(state).minScale
        // )
        && getGirlScale(state) > getValue(state).minScale
    ) {
        return true
    }

    if (name == actionName.Bigger
        && (
            isChangeScaling(state) || (!getIsBiggerNoLimit(state) && getGirlScale(state) >= getValue(state).maxScale)
        )
    ) {
        return false
    }


    if (!_isBelongToCurrentPoseAndScaleState(state, name)) {
        return false
    }


    let { excitement } = getSkillData(state, name)

    if (isCheckExcitement && !isExcitementEnough(state, excitement)) {
        return false
    }


    if (isActionTriggering(state, name)) {
        return false
    }


    if (name == actionName.Bigger) {
        return true
    }

    if (!isNotDamageState(getStateMachine(state))) {
        return false
    }

    if (isKeepPoseAnimation(getCurrentAnimationName(state))) {
        return true
    }

    switch (name) {
        case actionName.Run:
            if (isTriggerAction(state, actionName.Bigger)
            ) {
                return false
            }

            return getCurrentAnimationName(state) == animationName.Walk
        case actionName.Stomp:
            return getCurrentAnimationName(state) == animationName.Walk || isActionState(state, actionState.Run)
        default:
            return false
    }
}

export let isDamageAction = (name: actionName) => {
    return [
        actionName.HeavyStressing,
        actionName.HeavyStressingBreast,
        actionName.HeavyStressingTrigoneAndButt,
        actionName.Death,

        actionName.CrawlHeavyStressing,
        actionName.CrawlHeavyStressingBreast,
        actionName.CrawlHeavyStressingTrigoneAndButt,
        actionName.CrawlDeath,
    ].includes(name as any)
}

export let getTriggerAction = <actionName>(state): actionName => {
    return getGirlState(state).triggeredAction as actionName
}

export let setTriggerAction = (state, triggeredAction) => {
    return setGirlState(state, {
        ...getGirlState(state),
        triggeredAction: NullableUtils.return_(triggeredAction)
    })
}

export let triggerAction = (state, name: actionName, isJudgeRun = false, isSubExcitement = true): Promise<[state, result]> => {
    if (isDamageAction(name)) {
        state = setTriggerAction(state, name)
        // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
        return Promise.resolve([state, result.Success])
    }


    if (isJudgeRun && name == actionName.Run) {
        if (isActionTriggering(state, actionName.Run)) {
            state = setActionState(state, actionState.Initial)
        }
        else {
            state = setActionState(state, actionState.Run)
        }


        // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
        return Promise.resolve([state, result.Success])
    }




    if (!isActionValid(state, name, isSubExcitement)) {
        return Promise.resolve([state, result.Fail])
    }


    if (isSubExcitement) {
        let { excitement } = getSkillData(state, name)

        state = subExcitement(state, excitement)
    }



    state = setTriggerAction(state, name)

    switch (name) {
        case actionName.Bigger:
            state = setActionState(state, actionState.Initial)

            state = playBiggerAnimation(state, [(state) => {
                state = setScaleState(state, scaleState.Big)
                state = setNeedUpdateSkillBar(state, true)
                state = InitWhenImportScene.refreshBiggerTime(state)

                if (isTriggerAction(state, actionName.Bigger)) {
                    state = resetIsTriggerAction(state)
                }

                // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
                return Promise.resolve(state)
            },
            state => {
                let currentScale = getScale(state)

                let increaseScale
                if (currentScale < 100) {
                    increaseScale = getValue(state).minScale * 3
                }
                else if (currentScale < 400) {
                    increaseScale = getValue(state).minScale * 6
                }
                else {
                    increaseScale = getValue(state).minScale * 10
                }

                return [
                    currentScale + increaseScale,
                    1
                ]
            },
            ])
            break
        case actionName.Smaller:
            state = setActionState(state, actionState.Initial)

            state = playSmallerToHalfSizeAnimation(state, (state) => {
                if (InitWhenImportScene.isSmallest(state)) {
                    state = setNeedUpdateSkillBar(state, false)
                    state = setScaleState(state, scaleState.Normal)
                }
                else {
                    state = setScaleState(state, scaleState.Big)
                    state = setNeedUpdateSkillBar(state, true)
                    state = InitWhenImportScene.refreshBiggerTime(state)
                }


                if (isTriggerAction(state, actionName.Smaller)) {
                    state = resetIsTriggerAction(state)
                }


                // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
                return Promise.resolve(state)
            })
            break
        case actionName.Run:
            state = setActionState(state, actionState.Run)
            break
    }

    // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
    return Promise.resolve([state, result.Success])
}

export let isTriggerAction = (state, name) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            triggeredAction => {
                return triggeredAction == name
            },
            getGirlState(state).triggeredAction
        ),
        false
    )
}

export let resetIsTriggerAction = (state) => {
    return setGirlState(state, {
        ...getGirlState(state),
        triggeredAction: NullableUtils.getEmpty()
    })
}


// export let removeAction = (state, name) => {
//     Console.log("remove: ",name)
//     return setGirlState(state, {
//         ...getGirlState(state),
//         isTriggerActionMap: getGirlState(state).isTriggerActionMap.remove(name)
//     })
// }

export let getActionState = (state) => {
    return getGirlState(state).actionState
}

export let isActionState = (state, actionState) => {
    return getActionState(state) == actionState
}

export let setActionState = (state, actionState) => {
    return setGirlState(state, {
        ...getGirlState(state),
        actionState: actionState
    })
}

export let getScaleState = (state) => {
    return getGirlState(state).scaleState
}

export let isScaleState = (state, scaleState) => {
    return getScaleState(state) == scaleState
}

export let setScaleState = (state, scaleState) => {
    if (isScaleState(state, scaleState)) {
        return state
    }

    return setGirlState(state, {
        ...getGirlState(state),
        scaleState: scaleState,
        lastScaleChangeTime: performance.now()
    })
}

export let setInitialTransform = (state: state, position, quaternion) => {
    return setGirlState(state, {
        ...getGirlState(state),
        initialPosition: NullableUtils.return_(position),
        initialQuaternion: NullableUtils.return_(quaternion)
    })
}

export let dispose = (state: state) => {
    let girl = NullableUtils.getExn(getGirl(state))

    let abstractState = getAbstractState(state)

    abstractState = SkinAnimation.disposeSkinAnimation(abstractState, girl, getName())

    abstractState = Event.off(abstractState, getDestroyedEventName(), InitWhenImportScene.destroyedHandler)
    abstractState = Event.off(abstractState, getPickupEventName(), PickPose.pickupHandler)
    abstractState = Event.off(abstractState, getPinchJudageDamageEventName(), PickPose.pinchJudgeDamageHandler)
    abstractState = Event.off(abstractState, getEatEventName(), PickPose.eatHandler)
    abstractState = Event.off(abstractState, getPickdownEventName(), PickPose.pickdownHandler)
    abstractState = Event.off(abstractState, getStandToCrawlEventName(), standToCrawlHandler)
    abstractState = Event.off(abstractState, getCrawlToStandEventName(), crawlToStandHandler)


    state = setAbstractState(state, abstractState)


    state = disposeMMDResource(state)



    // state = setGirlState(state, {
    //     ...getGirlState(state),
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

    let girlState = getGirlState(state)
    state = setGirlState(state, {
        ...createState(),
        currentMMDCharacter: girlState.currentMMDCharacter
    })

    // state = setGirlState(state, createState())

    return Promise.resolve(state)
}

export let getInitialEulerForTweenToFaceNegativeX = () => {
    return new Euler(0, -Math.PI / 2, 0)
    // return new Euler(0, 0, 0)
}

export let getDefenseFactor = (state, name, damagePart) => {
    let factor
    if (getHp(state, damagePart) <= 0) {
        // factor = 0.3
        factor = NullableUtils.getExn(getHpData(state).find(d => d.damagePart == getBody())).defenseFactor
    }
    else {
        // factor = 1
        factor = NullableUtils.getExn(getHpData(state).find(d => d.damagePart == damagePart)).defenseFactor
    }

    // console.warn(factor);


    return getValue(state).defenseFactor * factor
}

export let getFullHp = (state: state) => {
    // return 3000
    return getValue(state).hp
}

export let getFullHpByDamagePart = (state: state, damagePart: damagePart) => {
    return NullableUtils.getExn(getHpData(state).find(d => {
        return d.damagePart == damagePart
    })).hp
}

export let getHp = (state, damagePart) => {
    return NullableUtils.getExn(getGirlState(state).hpMap.get(damagePart))
}

export let setHp = (state, damagePart, hp) => {
    let isStatusChange = getGirlState(state).hpMap.has(damagePart) ? getHp(state, damagePart) != hp : true

    return setGirlState(state, {
        ...getGirlState(state),
        hpMap: getGirlState(state).hpMap.set(damagePart, hp),
        needUpdateStatus: isStatusChange ? NullableUtils.return_({
            damagePart
        }) : getGirlState(state).needUpdateStatus
    })
}

export let setNeedUpdateStatus = (state, damagePart) => {
    return setGirlState(state, {
        ...getGirlState(state),
        needUpdateStatus: NullableUtils.return_({
            damagePart
        })
    })
}

export let addHp = (state, damageType, value) => {
    return setHp(state, damageType, NumberUtils.clamp(getHp(state, damageType) + value, 0, getFullHp(state)))
}

export let getExcitement = (state) => {
    return getGirlState(state).excitement
}

export let getFullExcitement = (state, name) => {
    return getValue(state).maxExcitement
}


// let _updateHp = (state, name, hp) => {
//     return setGirlState(state, {
//         ...getGirlState(state),
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

export let computeForce = (force: number, collisionPart_: collisionPart) => {
    let factor
    switch (collisionPart_) {
        case collisionPart.Head:
            factor = 4
            break
        case collisionPart.LeftBreast:
        case collisionPart.RightBreast:
            // factor = 0.5
            factor = 2
            break
        case collisionPart.TrigoneAndButt:
            factor = 2.5
            break
        case collisionPart.LeftHand:
        case collisionPart.RightHand:
        case collisionPart.LeftFoot:
        case collisionPart.RightFoot:
            factor = 0.6
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
            factor = 0.8
            // factor = 1
            break
    }

    return force * factor
}

let _getDamagePositionForLabel = (state: state, damagePosition, height) => {
    switch (getCameraType(state)) {
        case cameraType.FirstPerson:
            return ScreenUtils.convertScreenCoordniateToWorldCoordniate(
                _v1_1.set(
                    getWidth() / 2,
                    getHeight() / 2 * 0.5
                ),
                Camera.getCurrentCamera(getAbstractState(state)),
                false
            )
        case cameraType.ThirdPerson:
            if (isLittleRoad(state)) {
                return new Vector3(damagePosition.x, damagePosition.y + 2, damagePosition.z)
            }

            return new Vector3(damagePosition.x, damagePosition.y + height / 10, damagePosition.z)
        default:
            throw new Error("err")
    }

}

export let damage = (state: state, [force, damageType, weaponType], collisionPart_: collisionPart, damagePosition: nullable<Vector3>) => {
    if (state.config.isNotDamage) {
        return Promise.resolve(state)
    }


    let stateMachine = getStateMachine(state)

    if (isDestoryRelatedStates(stateMachine)) {
        return Promise.resolve(state)
    }


    // let box = getCapsuleBox(state)
    let box = getGirlBox(state)

    let [damagePartByCollisionPart, actuallyDamagePartsByCollisionPart] = getDamagePartByCollisionPart(state, collisionPart_)
    let [damagePartByJudge, actuallyDamagePartsByJudge] = getDamagePartByJudge(state, damagePartByCollisionPart, actuallyDamagePartsByCollisionPart)


    let defenseFactor = getDefenseFactor(state, getName(), damagePartByCollisionPart)
    // let height = box.getSize(_v1).y
    let height = computeHeight(state)



    let hp = getHp(state, damagePartByJudge)

    let [actuallyDamage, damage, remainedHp] = DamageUtils.computeActuallyDamage(defenseFactor, height, computeForce(force, collisionPart_), hp)

    state = setHp(state, damagePartByJudge, remainedHp)

    state = DamageUtils.addLabel(state, actuallyDamage, box,
        DamageUtils.computeFontType(
            getSceneChapter(state) == scene.Biwu ? true : (
                isLittleRoad(state) ? true : false
            ),
            damageType, weaponType),
        NullableUtils.map(
            damagePosition => {
                return _getDamagePositionForLabel(state, damagePosition, height)
            },
            damagePosition
        ),
        getName(),
        getLabelTime(damage),
        NullableUtils.getEmpty(),
        labelAnimation.None)


    if (damage <= 0) {
        return Promise.resolve(state)
    }


    state = setGirlState(state, {
        ...getGirlState(state),
        lastDamageTime: performance.now()
    })


    if (remainedHp <= 0 && isCloth(damagePartByJudge)) {
        if (isShoe(damagePartByJudge)) {
            state = handleRemoveShoe(state)
        }

        return handleClothDestroyed(state,
            [createStressingState, isCanStressing],
            NullableUtils.getExn(damagePosition), collisionPart_, actuallyDamagePartsByJudge)
    }


    if (remainedHp > 0) {
        let isStressingByRateFunc = isGiantessRoad(state) ? GiantessGirl.isStressingByRate : LittleManGirl.isStressingByRate

        if (
            isCanStressing(state, stateMachine)
            && isStressingByRateFunc(state, actuallyDamage, weaponType, collisionPart_, damagePartByCollisionPart)
        ) {
            return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
                return setStateMachine(state, stateMachine)
            }, stateMachine, createStressingState(), getName(), collisionPart_)
        }

        return Promise.resolve(state)
    }

    return Promise.resolve(state)
}

export let getIsOnlyDamageLittleMan = (state: state) => {
    return getGirlState(state).isOnlyDamageLittleMan
}

export let setIsOnlyDamageLittleMan = (state: state, value) => {
    return setGirlState(state, {
        ...getGirlState(state),
        isOnlyDamageLittleMan: value
    })
}
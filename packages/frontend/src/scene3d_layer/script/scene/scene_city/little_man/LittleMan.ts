import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { cameraType, state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleCharacterType, getOrbitControlsTarget, getGirlScale, getSceneChapter, isBossLevel } from "../CityScene";
import { autoDifficulty, bulletPropName, camp, climbPlane, damageType, fireWay, littleMan, littleManActionState, littleManStrength, millisecondUnit, objectStateName, propType, studyAction, waterPropName } from "../type/StateType";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, setAbstractState } from "../../../../state/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { actionName, animationName } from "../little_man_data/DataType";
import { SkinAnimation } from "meta3d-jiehuo-abstract";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { characterType, fsm_state, labelAnimation, name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getIsDebug } from "../../Scene";
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract";
import { changeToPhongMaterial } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils";
import { addBox3Helper } from "../utils/ConfigUtils";
import { getAnimationBlendDuration } from "../little_man_data/Data";
import { getAnimationFrameCount } from "../little_man_data/Const";
import { littleManValue } from "../little_man_data/ValueType";
import { Device } from "meta3d-jiehuo-abstract";
import { NewThreeInstance } from "meta3d-jiehuo-abstract";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { move } from "./Move";
import { ThirdPersonControls } from "meta3d-jiehuo-abstract";
import { Shadow } from "meta3d-jiehuo-abstract";
import { Render } from "meta3d-jiehuo-abstract";
import { getLittleHandTransform, getLittleHandTransformForDebug, getLittleHandTransformPrefix, getGiantessTransformFunc, getPickTransformPrefix, getGiantessUBControlledTransformFunc, getUBControlledTransformPrefix, getPutToBreastTransformPrefix, getGiantessPutToBreastTransformFunc, getGiantessPutToShoeTransformFunc, getPutToShoeTransformPrefix } from "../utils/SkeletonUtils";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { Billboard } from "meta3d-jiehuo-abstract";
import { ScreenUtils } from "meta3d-jiehuo-abstract";
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { getHeight, getWidth } from "meta3d-utils/src/View";
import { getGetLittleManValueEventName, getLittleManShootEmitEventName, getLittleManShootStartEventName, getLittleManStandupEndEventName, getLittleManStatusUpdateEventName, getSwitchWeaponEventName } from "../../../../utils/EventUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { isArmy } from "../utils/ArmyUtils";
import { isPickedControlledState, isDestoryRelatedStates, isNotDamageState, isControlledState, isLieState, isControlledStateExceptStressing, isFallState, isRepelState } from "../utils/FSMStateUtils"
import { getRandomCollisionPart } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitSpeed, emitterVolume, emitterLife, emitterSize, emitterSpeed, weaponType } from "../data/ValueType";
import { updateAnimationCollision } from "./Collision";
import { List, Map } from "immutable";
import { buildCameraFar, getCameraPosition, getCameraType, getControlsTarget, getDistance, hasNeedRestoreData, updatePosition, saveNeedRestoreData, updateCamera, restoreControlsForNotChangePosition, updateControlsWhenZoomOutToThirdPersonControls, updateControlsWhenZoomOutToThirdPersonControls2, useThirdPersonControls, restoreControlsForChangePosition, isThirdPersonCamera } from "../LittleManCamera";
import * as DamageUtils from "../utils/DamageUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { getDeathAnimationResourcePath } from "../data/Const";
import { animatioNameAndActionName, defenseFactor, excitement, hp, speed, stressingRateFactor, animationName as giantessAnimationName } from "../data/DataType";
import * as InitWhenImportScene from "./InitWhenImportScene"
import { isPlayingAnimation, isPlayingAnimationByWeight, updateAnimation } from "./Animation";
import { shootEmitHandler, shootStartHandler, updateAimHud } from "./Shoot";
import { createBreastControlledState, createDestroyingState, createInitialState, createLieState, createPickedControlledState, createShoeControlledState, createStandupState, createStressingState, createUBControlledState, isProtected, standupEndHandler } from "./FSMState";
import * as Transform from "./Transform";
import { PathFind } from "meta3d-jiehuo-abstract";
import { findValidPosition, getGrid } from "../manage/city1/PathFind";
// import { getBone } from "../utils/MMDUtils";
import { getGirlPickBone } from "../girl/PickPose";
import { resetAction, resetIsTriggerAction, triggerAction } from "./Action";
import { Vector3Utils } from "meta3d-jiehuo-abstract";
import { computeHeight, getDamageTypeFactor, getForceFactor, getGirlBox, getBoxSizeForCompute as getGirlBoxSizeForCompute } from "../girl/Utils";
import { getUsedGirlByName, isGirl, isPlayerGiantess, isPlayerGoddess, isUseGirl } from "../girl/Girl";
import { createBloodData, isChangeToLieState } from "../utils/CharacterUtils";
import { Console } from "meta3d-jiehuo-abstract";
import { getLoadData, getModelRelatedLoadData, modelName } from "../little_man_data/ModelData";
// import { swipingEmitHandler, swipingStartHandler } from "./Swiping";
import { addGunToHand, getCurrentGun, getCurrentGunName, dispose as disposeGun, update as updateGun } from "./Gun";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { buildDownDirection } from "../../../../utils/DirectionUtils";
import { getClimbState } from "./climb/ClimbManager";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getNow } from "../Time";
import { handleAfterComputeDamage, handleLittleManDamage } from "../StaticDynamic";
import { getCampWithDefault, getCampExn } from "../manage/city1/Army";
import { queryOBBShapeCollisionWithBox } from "../girl/Collision";
import { getPropValue } from "../reward/Prop";
import { computeCrit } from "../utils/WeaponUtils";
import { getAttackFactor, getCritRatioFactor } from "../StaticDynamicUnit";
// import { computeMiss } from "../utils/ValueUtils";
import { getPlayerCamp } from "../utils/PlayerUtils";
import { startQTE } from "../data/biwu/level2/behaviour_tree_data/action_node/utils/QTEUtils";
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType";
import { getWeaponBasicBulletBlockService } from "../../../../mod/PropBulletMod";
import { setStressingRateFactor } from "../utils/build/LittleManBuildUtils";
import { buildFuncData } from "../data/FuncData";
import { addBuff } from "../buff/Buff";
import { buffName } from "../data/buff/BuffData";
import { buildAPI } from "../../../../mod/Mod";
import { getAllAttackAnimationNames, getFastRunBlockService, getSwipBlockService, isAllAttackAnimationNamesAreOr } from "../../../../mod/SkillLittleManMod";
import { getBox as getBoxLODQueueObjectUtils } from "../utils/LODQueueObjectUtils";
import { isEnteringNextLevel } from "../manage/mission/Mission";
import { getModAPI } from "../Mod";
import { deepDispose, removeAndDispose } from "meta3d-jiehuo-abstract/src/scene/utils/DisposeUtils";
import { getAutoDifficulty } from "../difficulty/Difficulty";
import { getLittleManFallBlockService, getLittleManRepelBlockService } from "../../../../mod/FSMMod";
import { getGirlUBBone } from "../girl/UBUtils";
import { removePickData } from "../girl/PickPoseUtils";
import { getGirlPutToBreastBone, getGirlPutToShoeBone } from "../girl/PutUtils";
import { clearTargetByName } from "../utils/BehaviourManagerUtils";
import { getCurrentAnimationName } from "../girl/Animation";
import { getCameraFar, getCameraNear } from "../Camera";
import { isChangeToFallState } from "../utils/FallUtils";

const _q = new Quaternion();
const _e = new Euler();
const _m1 = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v1_1 = new Vector2();

export let getLittleManState = (state: state) => {
    return NullableUtils.getExn(getState(state).littleMan)
}

export let setLittleManState = (state: state, littleManState: littleMan) => {
    return setState(state, {
        ...getState(state),
        littleMan: NullableUtils.return_(littleManState)
    })
}

export let getName = () => "little_man"

export let isLittleMan = (name) => {
    return name == getName()
}


export let getLittleMan = (state: state) => {
    return NullableUtils.getExn(getLittleManState(state).littleMan)
}

// let _initialAttributes = (state, name, index) => {
// 	return setLittleManState(state, {
// 		...getLittleManState(state),
// 		stateMachine: getLittleManState(state).stateMachineMap.set(name, StateMachine.create(name, createInitialState())),
// 		// defenseFactorMap: getLittleManState(state).defenseFactorMap.set(name, getValue(state).defenseFactor),
// 		// hpMap: getLittleManState(state).hpMap.set(name, getFullHp(name)),
// 	})
// }

export let getStateMachine = (state: state) => {
    return getLittleManState(state).stateMachine
}

export let setStateMachine = (state: state, stateMachine) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        stateMachine: stateMachine
    })
}

export let getSkinMeshs = (group: Object3D) => {
    let meshes = []
    group.traverse(o => {
        if ((o as SkinnedMesh).isSkinnedMesh) {
            meshes.push(o)
        }
    })

    return meshes
}

export let computeBox = (state: state) => {
    let box = getSkinMeshs(getLittleMan(state)).reduce((box, mesh) => {
        mesh.geometry.computeBoundingBox()

        mesh.updateWorldMatrix(true, true)

        return box.union(
            mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld)
        )
    }, new Box3())

    // let box = new Box3().setFromCenterAndSize(Transform.getWorldPosition(state), new Vector3(5, 5, 5))

    return setLittleManState(state, {
        ...getLittleManState(state),
        box: getBox(state).copy(
            // mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld)
            box
        )
    })
}

export let getBox = (state: state) => {
    return getLittleManState(state).box
}

export let getBoxCenter = (state: state) => {
    return getLittleManState(state).box.getCenter(new Vector3())
}

export let getBoxSizeForCompute = (state: state) => {
    // return getBox(state).getSize(_v1).y
    return getBox(state).getSize(_v1).y * 0.2
}

// let _getScalarInFBXModel = () => 100
let _getScalarInFBXModel = (state: state) => getCurrentModelData(state).gunScalar

export let setGunInititalTransform = (state: state, gun, isDebug) => {
    const scalarForLittleMan = _getScalarInFBXModel(state)

    const scalarForGun = 0.64

    let scale = new Vector3().setScalar(scalarForLittleMan * scalarForGun)

    let getFunc
    if (isDebug) {
        getFunc = getLittleHandTransformForDebug
    }
    else {
        getFunc = getLittleHandTransform
    }

    let matrix = getFunc(
        scale,

        new Vector3(
            33, 122, 33
        ).multiplyScalar(
            scalarForLittleMan / 100
        ),
        -2.97,
        0.3,
        -1.6
    )

    let _ = TransformUtils.setMatrix(gun, matrix)

    Object3DUtils.markNeedsUpdate(gun)
}

let _getLieKeepTime = (state: state) => {
    return getCurrentModelData(state).lieKeepTime * (getValue(state).stressingRateFactor / stressingRateFactor.Middle)
}

// let _getStressingRateFactorForStandupByAutoDifficulty = (state) => {
//     switch (getAutoDifficulty(state)) {
//         case autoDifficulty.VeryEasy:
//             return 0.3
//         case autoDifficulty.Easy:
//             return 0.5
//         default:
//             return 1
//     }
// }

// TODO remove
let _handleNullableState = (key) => (state) => {
    if (NullableUtils.isNullable(state)) {
        let stateMachine = getStateMachine(readState())
        throw new Error(`state nullable error:
                    key: ${key},
                    ${stateMachine.currentState.name}, ${NullableUtils.map(fsmState => fsmState.name, stateMachine.previousState)}`)
    }

    return state
}


export let updateFsmState = (state: state, filterCollisionShapesFunc = (data) => true) => {
    // return updateFSMState(state)

    let stateMachine = getStateMachine(state)

    // if (isChangeCrawlPoseState(state, usedGirl)) {
    //     state = computeGirlBoxAndSetToState(state, usedGirl)
    // }

    if (getHp(state) <= 0
        && isNotDamageState(stateMachine)
        // && !isControlledState(state, stateMachine)
        // && !isSkillState(state, usedGirl)
    ) {
        return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createDestroyingState(), NullableUtils.return_(getName()))
            .then(_handleNullableState("1"))
    }

    if (
        StateMachine.isState(stateMachine, objectStateName.Lie)
        && (getNow(state) - getLittleManState(state).lieTime) > _getLieKeepTime(state)) {
        // if (
        //     isUseGirl(state, usedGirl) && !isPlayerGiantess(state, usedGirl)
        //     && !NullableUtils.isNullable(queryOBBShapeCollisionWithBox(state, getBox(state), Transform.getPosition(state), false, filterCollisionShapesFunc))
        //     && NumberUtils.isRandomRate(
        //         // getValue(state).stressingRateFactor * NumberUtils.clamp(Math.sqrt(computeHeight(state, usedGirl)) * 0.25, 1, 10)
        //         // getValue(state).stressingRateFactor * _getStressingRateFactorForStandupByAutoDifficulty(state) * NumberUtils.clamp(Math.sqrt(computeHeight(state, usedGirl)) * 0.20, 1, 10)
        //         getValue(state).stressingRateFactor * _getStressingRateFactorForStandupByAutoDifficulty(state) * NumberUtils.clamp(Math.sqrt(computeHeight(state, usedGirl)) * 0.2, 1, 5)
        //     )
        // ) {
        //     state = setLittleManState(state, {
        //         ...getLittleManState(state),
        //         lieTime: getNow(state)
        //     })
        //     state = resetIsTriggerAction(state, usedGirl)
        //     return triggerAction(state, usedGirl, actionName.Lie)
        //         .then(_handleNullableState("2"))
        // }


        return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createStandupState(), NullableUtils.getEmpty())
            .then(_handleNullableState("3"))
    }

    return Promise.resolve(state)
        .then(_handleNullableState("4"))
}

export let updateStatus = (state: state) => {
    if (getLittleManState(state).isStatusChange) {
        state = setLittleManState(state, {
            ...getLittleManState(state),
            isStatusChange: false
        })

        return Event.trigger(state, getAbstractState, getLittleManStatusUpdateEventName(), null)
    }

    // return Promise.resolve(setLittleManState(state, {
    //     ...getLittleManState(state),
    //     isStatusChange: false
    // }))
    return Promise.resolve(state)
}

export let isCanMove = (state: state) => {
    return isPlayingAnimationByWeight(state, animationName.Run, 0.5)
        || isAllAttackAnimationNamesAreOr(state, isPlayingAnimation)
        || isPlayingAnimation(state, getFastRunBlockService(state).getAnimationName())
}

export let updateMove = (state: state) => {
    let promise
    if (isCanMove(state)) {
        promise = move(state)
    }
    else {
        promise = Promise.resolve([state, new Vector3(0, 0, 0)])
    }

    return promise
}

export let update = (state: state) => {
    if (!isLittleCharacterType(state)) {
        return Promise.resolve(state)
    }


    let promise = updateMove(state)

    return promise.then(([state, velocity]) => {
        if (!velocity.equals(_v1.set(0, 0, 0))) {
            state = updateCamera(state, velocity)
        }

        state = updateGun(state)


        return updateAnimation(state)
            .then(updateAnimationCollision)
            .then(updateFsmState)
            .then(updateStatus)
    })
}

export let setInitialTransform = (state: state, position, quaternion) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        initialPosition: NullableUtils.return_(position),
        initialQuaternion: NullableUtils.return_(quaternion)
    })
}

let _getDefaultAnimationName = () => animationName.Idle

export let createState = (): littleMan => {
    return {
        currentStudyActions: [],
        // savedStudyActions: [],

        stateMachine: StateMachine.create(getName(), createInitialState()),

        // usedBulletPropName: bulletPropName.BasicBullet,
        usedBulletPropName: NullableUtils.getEmpty(),

        currentModel: modelName.Infantry,
        // currentModel: modelName.Ninja,
        // currentModel: modelName.Ely,
        // currentModel: modelName.Maria,
        // currentModel: modelName.Dreyar,
        // currentModel: modelName.Mutant,
        // currentModel: modelName.Abe,

        currentAnimationName: _getDefaultAnimationName(),
        nextBlendingAnimationName: NullableUtils.getEmpty(),
        previousAnimationName: NullableUtils.getEmpty(),
        isCurrentAnimationOnlyPlayOnce: false,
        noBlend: false,


        box: new Box3(),

        littleMan: NullableUtils.getEmpty(),
        initialPosition: NullableUtils.getEmpty(),
        initialQuaternion: NullableUtils.getEmpty(),



        isComputeCollisionMap: Map(),

        // isResetActionCollision: false,
        lastFrameIndexMap: Map(),


        hp: 0,

        isStatusChange: true,


        triggeredAction: NullableUtils.getEmpty(),
        actionState: littleManActionState.Initial,
        triggeredActionTime: Map(),
        triggeredActionBeforeLock: NullableUtils.getEmpty(),

        fireWay: fireWay.Burst,


        gunMap: Map(),
        aim: NullableUtils.getEmpty(),
        aimCrossWhenDamage: NullableUtils.getEmpty(),
        aimCrossWhenDestroy: NullableUtils.getEmpty(),
        headShot: NullableUtils.getEmpty(),
        isShowingHeadShot: false,
        aimTarget: NullableUtils.getEmpty(),
        lockTarget: NullableUtils.getEmpty(),
        lockImage: NullableUtils.getEmpty(),

        // parent: NullableUtils.getEmpty(),


        bloodData: createBloodData(),

        rebornTime: 0,
        lieTime: 0,

        // qte: QTE.createState(),

        movableRanges: ArrayUtils.create(),

        // lastDamageTime: getNow(state),
        lastDamageTime: performance.now(),

        actuallyMoveSpeedRecordInTwoSeconds: ArrayUtils.create(),
        lastPosition: NullableUtils.getEmpty(),

        hpIncrease: 0,

        updateControlsWhenZoomOutToThirdPersonControlsFunc: state => {
            return updateControlsWhenZoomOutToThirdPersonControls2(state, getCameraNear(state), getCameraFar(state),
                // isUseGirl(state, usedGirl) ? getGirlBoxSizeForCompute(state, usedGirl) : 5
                5
            )
        }
    }
}

export let dispose = (state: state) => {
    if (!isLittleCharacterType(state)) {
        return Promise.resolve(state)
    }

    state = NullableUtils.getWithDefault(
        NullableUtils.map(littleMan => {
            return setAbstractState(state, SkinAnimation.disposeSkinAnimation(getAbstractState(state), littleMan, getName()))
        }, getLittleManState(state).littleMan),
        state
    )


    state = disposeGun(state)


    state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManShootStartEventName(), shootStartHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManShootEmitEventName(), shootEmitHandler))
    // state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManSwipingStartEventName(), swipingStartHandler))
    // state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManSwipingEmitEventName(), swipingEmitHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManStandupEndEventName(), standupEndHandler))
    // state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManDeathNeedFixPositionYOffsetEventName(), deathHandler))
    // state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManStandupNeedFixPositionYOffset1EventName(), standupNeedFixHandler))


    // state = setLittleManState(state, {
    //     ...getLittleManState(state),
    //     stateMachine: StateMachine.create(getName(), createInitialState()),
    //     currentAnimationName: _getDefaultAnimationName(),
    //     nextBlendingAnimationName: NullableUtils.getEmpty(),

    //     isCurrentAnimationOnlyPlayOnce: false,

    //     littleMan: null,

    //     isComputeCollisionMap: Map(),

    //     isResetActionCollision: false,

    //     hp: 0,

    //     isStatusChange: true,

    //     triggeredAction: NullableUtils.getEmpty(),

    //     actionState: littleManActionState.Initial,



    //     previousAnimationName: NullableUtils.getEmpty(),
    //     noBlend: false,


    //     box: new Box3(),

    //     littleMan: NullableUtils.getEmpty(),
    //     initialPosition: NullableUtils.getEmpty(),
    //     initialQuaternion: NullableUtils.getEmpty(),



    //     isComputeCollisionMap: Map(),

    //     isResetActionCollision: false,


    //     hp: 0,

    //     isStatusChange: true,


    //     triggeredAction: NullableUtils.getEmpty(),

    //     actionState: littleManActionState.Initial,

    //     gun: NullableUtils.getEmpty(),
    //     aim: NullableUtils.getEmpty(),

    //     // parent: NullableUtils.getEmpty(),


    // 	bloodData: createBloodData(),

    // })

    let littleManState = getLittleManState(state)

    // deepDispose(getLittleMan(state))
    removeAndDispose(getScene(state), getLittleMan(state))

    if (isEnteringNextLevel(state)) {
        state = setLittleManState(state, {
            ...createState(),
            currentModel: littleManState.currentModel,
            hpIncrease: littleManState.hpIncrease,
            fireWay: littleManState.fireWay,
        })
    }
    else {
        state = setLittleManState(state, {
            ...createState(),
            currentModel: littleManState.currentModel,
            fireWay: littleManState.fireWay,
        })
    }

    // state = clearPick(state)

    return Promise.resolve(state)
}

export let getValue = (state: state): littleManValue => {
    return NullableUtils.getExn(getConfigData(state).littleManValue)
}

// let _isBelongToCurrentPoseAndScaleState = (state: state, name: actionName) => {
//     return getConfigData(state).operateRenderData.filter(value => {
//         return value.pose == getCurrentPose(state, usedGirl) && value.scaleState == getScaleState(state)
//     })[0].value.map(v => {
//         return v.name
//     }).includes(name)
// }


// let _getDefenseFactor = (state, name) => {
//     return 1
// }

export let getFullHp = (state: state) => {
    return getValue(state).hp
}

export let getHp = (state) => {
    return getLittleManState(state).hp
}

export let setHp = (state, hp) => {
    // if (hp == getFullHp(state)) {
    //     return state
    // }

    hp = Math.round(hp)

    let isStatusChange = getHp(state) != hp

    return setLittleManState(state, {
        ...getLittleManState(state),
        hp,
        isStatusChange
    })
}

export let addHp = (state, value) => {
    return setHp(state, NumberUtils.clamp(getHp(state) + value, 0, getFullHp(state)))
}


// let _updateHp = (state, hp) => {
//     return setLittleManState(state, {
//         ...getLittleManState(state),
//         hp: hp
//     })
// }


// export let damage = (state: state, [size, direction], fromName, transforms, boxes, names) => {
//     return DamageUtils.damage(
//         state, [
//         _getDefenseFactor, getHp, _updateHp,

//         getStateMachine,
//         setStateMachine,
//         () => {
//             // return createStressingState([_getShakeClipIndex, getStateMachine, _setStateMachine], createShootState())
//             return createStressingState([_getShakeClipIndex, getStateMachine, _setStateMachine, createInitialState])
//         },
//         () => {
//             return createDestroyingState([_getDeathClipIndex, getLittleManState, setLittleManState, getStateMachine, setStateMachine, (state, name) => state])
//         }
//     ], [size, direction], fromName, transforms, boxes, names,
//     )
// }


let _isStressingByRate = (state: state, stressingRateFactor, damage, damageType_: damageType) => {
    let damageTypeFactor = getDamageTypeFactor(damageType_)

    // let forceFactor = getForceFactor(getHp(state), damage, 0.1)
    let forceFactor = getForceFactor(getHp(state), damage, 0.025)

    let settingFactor

    // switch (getLittleManSetting(state).littleManStrength) {
    //     case littleManStrength.Low:
    settingFactor = 1
    //         break
    //     case littleManStrength.Middle:
    //         settingFactor = 0.7
    //         break
    //     case littleManStrength.High:
    //         settingFactor = 0.4
    //         break
    //     default:
    //         throw new Error("err")
    // }

    // const factor = 0.35
    const factor = 0.3


    let rate = NumberUtils.clamp(1 * forceFactor * damageTypeFactor * factor * settingFactor * stressingRateFactor, 0, 1)

    // Console.log(rate)

    return Math.random() < rate
}

let _getDamagePositionForLabel = (state: state, center, height, damageType_) => {
    if (damageType_ == damageType.Range) {
        return NullableUtils.getEmpty()
    }

    switch (getCameraType(state)) {
        case cameraType.FirstPerson:
        case cameraType.Shoot:
            return NullableUtils.return_(ScreenUtils.convertScreenCoordniateToWorldCoordniate(
                _v1_1.set(
                    getWidth() / 2,
                    getHeight() / 2 * 0.5
                ),
                getCurrentCamera(getAbstractState(state)),
                false
            ))
        case cameraType.ThirdPerson:
            return NullableUtils.return_(center.setY(center.y + height / 2))
        default:
            throw new Error("err")
    }

}

// let _handleDamageFromArmy = (state, forceSize, fromName) => {
//     // if (getCampExn(state, fromName) == camp.Enemy) {
//     if (isArmy(state, fromName)) {
//         // return forceSize * 0.5
//         return forceSize * 0.25
//     }

//     return forceSize
// }

let _isChangeToLieState = (state: state, damageType_, direction, stressingRateFactor_, fromName) => {
    if (!isChangeToLieState(state, getStateMachine(state), damageType_, direction)) {
        return false
    }

    let height
    if (isGirl(fromName)) {
        let usedGirl = getUsedGirlByName(fromName)
        height = computeHeight(state, usedGirl)
    }
    else {
        let box = getBoxLODQueueObjectUtils(state, fromName)
        height = DamageUtils.getHeight(box)
    }

    // return Math.random() < stressingRateFactor_ / stressingRateFactor.Middle2
    return Math.random() < stressingRateFactor_ * NumberUtils.greaterThan(Math.sqrt(height) * 0.25, 1)
}

// export let damage = (state: state, force, damageType, damagePosition: nullable<Vector3>) => {
// export let damage = (state: state, force, damageType) => {
export let damage = (state: state, forceData, weaponValue_, fromName,
    damagePosition,
    // critRatioFactor,
    // attackFactor,
    transforms, boxes, names): Promise<[state, Array<string>]> => {
    if (state.config.isNotDamage
        || isProtected(state)
        || getClimbState(state).isPlayingAnimation
        || !isLittleCharacterType(state)
        // || getCampWithDefault(state, fromName, camp.Enemy) == getPlayerCamp()
    ) {
        return Promise.resolve([state, names])
    }

    damagePosition = NullableUtils.getWithDefault(damagePosition, Transform.getPosition(state))

    let stateMachine = getStateMachine(state)

    let heightOfFromName = DamageUtils.getHeightByDynamicName(state, fromName)
    // if (NullableUtils.isNullable(heightOfFromName)) {
    //     return Promise.resolve([state, []])
    // }
    // heightOfFromName = NullableUtils.getExn(heightOfFromName)

    let box = getBox(state)



    let [[size, direction], [damageType, weaponType]] = forceData

    if (isDestoryRelatedStates(stateMachine)
        // || (isGirl(fromName) && (
        //     !isChangeToLieState(damageType, direction)
        //     && (
        //         isControlledState(state, stateMachine) || isLieState(stateMachine)
        //     )
        // ))
    ) {
        return Promise.resolve([state, names])
    }


    // size = _handleDamageFromArmy(state, size, fromName)

    let height = box.getSize(_v1).y

    let userData = getValue(state)
    let promise
    if (weaponValue_.type !== weaponType.EffectSelf) {
        promise = Event.triggerWithUserData(state, getAbstractState, getGetLittleManValueEventName(), userData)
    }
    else {
        promise = Promise.resolve(
            [state,
                userData
            ]
        )
    }

    return promise.then(([state, value]) => {
        let { defenseFactor, armorType, armorRatio, armorStrength, stressingRateFactor } = value

        // console.log(stressingRateFactor)

        size = handleLittleManDamage(state, fromName,
            weaponType, armorType,
            size)


        // let hp = getHp(state)


        let d3 = computeCrit([size, damageType], weaponValue_, getCritRatioFactor(state, fromName))
        size = d3[0]
        damageType = d3[1]

        // let d4 = computeMiss(d3,)
        // size = d4[0]
        // damageType = d4[1]


        size = DamageUtils.computeForceByAttackFactor(size, getAttackFactor(state, fromName))


        // let [damage, damage, remainedHp] = DamageUtils.computeActuallyDamage(defenseFactor, height, size, hp)
        let damage = DamageUtils.computeDamageWithDamagePosition(state, [
            defenseFactor, armorType, armorRatio, armorStrength
        ], weaponValue_, [height, heightOfFromName], size,
            damageType,
            damagePosition,
            Transform.getPosition(state))


        return Event.triggerWithUserData(state, getAbstractState, getModAPI(state).event.getHandleDamageLittleManEventName(), NullableUtils.return_(
            {
                forceSize: size,
                damage,
                damageType,
                fromName,
                name: getName(),
                // transform: Transform.getWorldMatrix(state),
                box,
                damagePosition,
                weaponValue: weaponValue_
            }
        )
        ).then(([state,
            data
        ]) => {
            return Event.triggerWithUserData(state, getAbstractState, getModAPI(state).event.getHandleAfterDamageLittleManEventName(), NullableUtils.return_(
                data
            )
            )
        }).then(([state, {
            forceSize,
            damage,
            damageType,
            fromName,
            name,
            // transform,
            box,
            damagePosition,
            weaponValue
        }]) => {
            weaponValue_ = weaponValue

            let hp = getHp(state)
            let remainedHp = DamageUtils.computeHp(hp, damage)

            state = setHp(state, remainedHp)



            let center = box.getCenter(new Vector3())

            state = DamageUtils.addLabel(state, damage, box,
                // DamageUtils.computeFontType(false, damageType),
                DamageUtils.computeFontType(
                    // state, fromName, name, getPlayerCamp(), camp.Enemy,
                    state, fromName, name,
                    damageType),

                _getDamagePositionForLabel(state, center, height, damageType),
                getName(),
                40,
                NullableUtils.getEmpty(),
                labelAnimation.None,
                2
            )

            return handleAfterComputeDamage(state, fromName, getName(), damage, remainedHp).then(state => {
                // if (damage <= 0) {
                //     return [state, names]
                // }


                state = setLittleManState(state, {
                    ...getLittleManState(state),
                    lastDamageTime: getNow(state)
                })


                if (remainedHp > 0) {
                    if (_isChangeToLieState(state, damageType, direction, stressingRateFactor, fromName)) {
                        state = setLittleManState(state, {
                            ...getLittleManState(state),
                            lieTime: getNow(state)
                        })

                        return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createLieState(getBox(state)), NullableUtils.getEmpty()).then(state => {
                            return [state, names]
                        })
                    }

                    if (!StateMachine.isState(stateMachine, objectStateName.Stressing)
                    ) {

                        if (
                            // !isLieState(stateMachine)
                            !isControlledState(state, stateMachine)
                            && !(
                                StateMachine.isState(stateMachine, objectStateName.Climb)
                                && getClimbState(state).climbPlane == climbPlane.Verticle
                            )
                            &&
                            (
                                (isGirl(fromName)
                                    // || isChangeToLieState(damageType, direction)
                                    ||
                                    _isStressingByRate(state, stressingRateFactor, damage, damageType)
                                )
                            )
                        ) {
                            return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createStressingState(), NullableUtils.getEmpty()).then(state => {
                                return [state, names]
                            })
                        }
                    }

                    return [state, names]
                }

                return [state, names]
            })
        })
    })
}

export let addToScene = (state: state) => {
    getScene(state).add(getLittleMan(state))

    return state
}

// export let removeFromScene = (state: state) => {
//     getScene(state).remove(getLittleMan(state))

//     return state
// }

export let hide = (state: state) => {
    getLittleMan(state).visible = false

    return state
}

export let show = (state: state) => {
    getLittleMan(state).visible = true

    return state
}

export let initWhenImportScene = InitWhenImportScene.initWhenImportScene




export let getModelQueueIndex = (state: state, name: name) => -1

export let getPickedTransform = getGiantessTransformFunc(
    (state) => new Quaternion(),

    getPickTransformPrefix(),

    Math.PI / 2,
    Math.PI / 2,
    0,
)

export let getUBControlledTransform = getGiantessUBControlledTransformFunc(
    (state) => new Quaternion(),

    getUBControlledTransformPrefix(),

    0,
    0,
    0,
)

export let getPutToBreastTransform = getGiantessPutToBreastTransformFunc(
    (state) => new Quaternion(),

    getPutToBreastTransformPrefix(),

    0,
    0,
    0,
)

export let getPutToShoeTransform = getGiantessPutToShoeTransformFunc(
    (state) => new Quaternion(),

    getPutToShoeTransformPrefix(),

    -1.7,
    0,
    0,
)


export let isCanPickup = (state: state, name: name) => {
    // return !isLieState(getStateMachine(state)) && !isProtected(state)
    return !isProtected(state)
    //  && (
    //     !isFallState(getStateMachine(state))
    //     && !isRepelState(getStateMachine(state))
    // )
}

let _addToBone = (state, bone) => {
    bone.add(getLittleMan(state))

    return state
}

export let handlePickup = (state: state, usedGirl, name: name) => {
    // state = removeShadow(state, name)

    let d = getGirlPickBone(state, usedGirl)
    state = d[0]
    let bone = d[1]

    state = _addToBone(state, bone)

    // state = setParent(state, bone)

    // state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getDistance(state), getCameraType(state))
    state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getCameraPosition(state).clone(), getControlsTarget(state).clone(), getCameraType(state))
    state = updateControlsWhenZoomOutToThirdPersonControls2(state, 1, buildCameraFar(state, 1), getGirlBoxSizeForCompute(state, usedGirl))


    Console.log(
        // bone.getWorldScale(new Vector3())
        "handlePickup"
    )

    let promise
    // if (getSceneChapter(state) == scene.Play) {
    if (!isBossLevel(state) && getCurrentAnimationName(state, usedGirl) == giantessAnimationName.Pickup) {
        promise = startQTE(state, usedGirl, 1)
    }
    else {
        promise = Promise.resolve(state)
    }

    // return promise.then(state => triggerAction(state, usedGirl, actionName.PickedControlled))
    return promise.then(state => {
        return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createPickedControlledState(), name)
    })
}


let _makeSureScaleOfWorldMatrixEqualLocalOne = (state, localTransform, bone) => {
    return Transform.setLocalMatrix(state,
        TransformUtils.setScaleToMatrix4(
            _m1.copy(localTransform),
            _v1.copy(
                _v2.setScalar(getCurrentModelData(state).scalar).divide(
                    bone.getWorldScale(_v3)
                )
            )
        )
    )
}

let _updateTransform = (state: state, bone, distance, localTransform: Matrix4) => {
    /*! not change littleMan's scale
    * 
    */
    state = _makeSureScaleOfWorldMatrixEqualLocalOne(state, localTransform, bone)


    Object3DUtils.markNeedsUpdate(getLittleMan(state))


    state = computeBox(state)

    state = updatePosition(state)


    return state
}

export let updateTransform = (state: state, usedGirl, _queue, _index, parentTransform: Matrix4, localTransform: Matrix4) => {
    let d = getGirlPickBone(state, usedGirl)
    state = d[0]
    let bone = d[1]

    return _updateTransform(state, bone, getGirlBoxSizeForCompute(state, usedGirl), localTransform)
}


// export let handlePickdownNotJudgeValid = (state: state, targetPoint): Promise<state> => {
//     state = addToScene(state)


//     state = Transform.initTransform(state)
//     state = Transform.setPositionAndComputeBox(state, targetPoint)



//     if (hasNeedRestoreData(state)) {
//         state = restoreControlsForNotChangePosition(state)
//     }

//     return triggerAction(state, usedGirl, actionName.Idle)
// }

export let handleExitControlled = (state, currentPosition, isResetAction = true) => {
    state = addToScene(state)


    state = Transform.initTransform(state)
    state = Transform.setPositionAndComputeBox(state, currentPosition)



    if (hasNeedRestoreData(state)) {
        // state = restoreControlsForNotChangePosition(state)
        state = restoreControlsForChangePosition(state)
    }

    if (isResetAction) {
        state = resetAction(state)
    }

    return state
}

export let handlePickdown = (state: state, name: name, _index, targetPoint, _queue, originTransform: Matrix4): Promise<[state, boolean]> => {
    // let validTargetPoint = PathFind.findValidPosition(
    //     new Vector2(targetPoint.x, targetPoint.z),
    //     getGrid(state),
    //     getIsDebug(state)
    // )
    let validTargetPoint = findValidPosition(state, targetPoint)

    if (NullableUtils.isNullable(validTargetPoint)) {
        return Promise.resolve([state, false])
    }

    state = handleExitControlled(state, NullableUtils.getExn(validTargetPoint))

    // return handlePickdownNotJudgeValid(state, validTargetPoint).then(state => [state, true])
    return triggerAction(state, actionName.Idle).then(state => [state, true])

}

export let handleFall = (state: state, name: name, _index, _queue, originTransform: Matrix4): Promise<[state, boolean]> => {
    let stateMachine = getStateMachine(state)

    if (!isChangeToFallState(state, stateMachine)) {
        return Promise.resolve([state, false])
    }

    return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine,
        getLittleManFallBlockService(state).createState(getModAPI(state))()
        , NullableUtils.return_(getName()))
        .then(state => [state, true])
}

export let getLocalTransform = (state: state, queue, index, name) => {
    return Transform.getLocalMatrix(state)
}

export let getBoxForPick = (state: state, queue, index, name) => {
    return getBox(state)
}

// export let isParentGirl = (state: state) => {
//     let parent = getLittleMan(state).parent
//     let girlName = getGirlName()

//     while (NullableUtils.isNullable(parent)) {
//         if (parent.name == girlName) {
//             return true
//         }

//         parent = parent.parent
//     }

//     return false
// }


export let getCurrentModelData = (state: state) => {
    return NullableUtils.getExn(getConfigData(state).littleModelData.find(
        data => {
            return data.name == getCurrentModelName(state)
        }
    ))
}


export let getCurrentModelRelatedLoadData = (state: state) => {
    let { resourceId } = getCurrentModelData(state)

    return getModelRelatedLoadData().filter(d => d.id.includes(resourceId))
}

export let getCurrentModelName = (state: state) => {
    return getLittleManState(state).currentModel
}


export let setCurrentModelName = (state: state, name) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        currentModel: name
    })
}

export let hasUsedBulletPropName = (state: state) => {
    return !NullableUtils.isNullable(getLittleManState(state).usedBulletPropName)
}

export let getUsedBulletPropName = (state: state) => {
    return NullableUtils.getExn(getLittleManState(state).usedBulletPropName)
}

export let setUsedBulletPropName = (state: state, name: bulletPropName | string) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        usedBulletPropName: NullableUtils.return_(name)
    })
}

export let switchBulletProp = (state: state, name: bulletPropName | string) => {
    let previousGunName = getCurrentGunName(state)

    state = setUsedBulletPropName(state, name)

    return addGunToHand(state, NullableUtils.return_(previousGunName))
}

export let useWater = (state: state, name: waterPropName) => {
    switch (name) {
        case waterPropName.AddHp1:
        case waterPropName.AddHp2:
        case waterPropName.AddHp3:
        case waterPropName.AddHp4:
            state = addHp(state, getFullHp(state) * getPropValue()[name])
            break
    }

    return Event.trigger(state, getAbstractState, getLittleManStatusUpdateEventName(), null)
}

export let getMovableRanges = (state: state) => {
    return getLittleManState(state).movableRanges
}

export let setMovableRanges = (state: state, movableRanges) => {
    if (getIsDebug(state)) {
        let scene = getScene(state)

        movableRanges.forEach(range => {
            addBox3Helper(getAbstractState(state), scene, new Box3(new Vector3(range.minX, -50, range.minZ), new Vector3(range.maxX, 50, range.maxZ)), 0x0000FF)
        })
    }

    return setLittleManState(state, {
        ...getLittleManState(state),
        movableRanges
    })
}


export let getCurrentStudyActionNames = (state: state) => {
    return getLittleManState(state).currentStudyActions.map(a => a.name)
}

export let getCurrentStudyActions = (state: state) => {
    return getLittleManState(state).currentStudyActions
}

export let setCurrentStudyActions = (state: state, value: Array<studyAction<actionName>>) => {
    // console.log("setCurrentStudyActions: ", value)
    // if (NullableUtils.isNullable(value.find(d => d.name == actionName.Shoot))) {
    //     throw new Error(`not find Shoot action! old all actions are ${getCurrentStudyActionNames(state)}, new all actions are ${value.map(a => a.name)}`)
    // }

    return setLittleManState(state, {
        ...getLittleManState(state),
        currentStudyActions: value
    })
}

export let removeStudyActions = (state: state, value: Array<actionName>) => {
    return setCurrentStudyActions(state,
        getCurrentStudyActions(state).filter(c => {
            return !value.includes(c.name)
        })
    )
}



// export let getSavedStudyActions = (state: state) => {
//     return getLittleManState(state).savedStudyActions
// }

// export let setSavedStudyActions = (state: state, value) => {
//     return setLittleManState(state, {
//         ...getLittleManState(state),
//         savedStudyActions: value
//     })
// }



export let getActuallyMoveSpeedRecordInTwoSeconds = (state: state) => {
    return getLittleManState(state).actuallyMoveSpeedRecordInTwoSeconds
}

export let setActuallyMoveSpeedRecordInTwoSeconds = (state: state, value) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        actuallyMoveSpeedRecordInTwoSeconds: value
    })
}

export let getLastPosition = (state: state) => {
    return getLittleManState(state).lastPosition
}

export let setLastPosition = (state: state, value) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        lastPosition: NullableUtils.return_(value)
    })
}

export let getMaxActuallMoveSpeed = (state: state, interval: millisecondUnit) => {
    let now = getNow(state)

    return ArrayUtils.reduce(
        ArrayUtils.filter(
            getActuallyMoveSpeedRecordInTwoSeconds(state),
            (({ time }) => {
                return now - time <= interval
            })
        ),
        ((result, { speed }) => {
            return Math.max(result, speed)
        }),
        0
    )
}


export let getHpIncrease = (state: state) => {
    return getLittleManState(state).hpIncrease
}

export let setHpIncrease = (state: state, value) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        hpIncrease: value
    })
}

export let isBack = (state: state, damagePosition) => {
    let faceDirection = TransformUtils.getFaceDirection(
        Transform.getRotation(state), _v1)

    return TransformUtils.isBack(
        faceDirection,
        damagePosition,
        Transform.getPosition(state)
    )
}



export let getFireWay = (state: state) => {
    return getLittleManState(state).fireWay
}

export let setFireWay = (state: state, value) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        fireWay: value
    })
}

export let isBurstFire = (state: state) => {
    return getFireWay(state) == fireWay.Burst
}

export let handleRepel = (state: state, direction, distance, time): Promise<state> => {
    let stateMachine = getStateMachine(state)

    if (state.config.isNotDamage) {
        return Promise.resolve(state)
    }

    if (isControlledStateExceptStressing(state, stateMachine)) {
        return Promise.resolve(state)
    }

    return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine,
        getLittleManRepelBlockService(state).createState(getModAPI(state))()
        , NullableUtils.return_([direction, distance, time]))
}

let _getUBCameraDistance = (state) => {
    return getBoxSizeForCompute(state) * 8
}

let _handleCarry = (state: state, createControlledStateFunc, getBoneFunc, usedGirl, name, distance) => {
    return removePickData(state, name).then(state => {
        let d = getBoneFunc(state, usedGirl)
        state = d[0]
        let bone = d[1]

        state = _addToBone(state, bone)

        // state = clearTargetByName(state, name)

        state = updateControlsWhenZoomOutToThirdPersonControls2(state, 0.1, buildCameraFar(state, 0.1), distance)

        // return triggerAction(state, usedGirl, actionName.PickedControlled)
        return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createControlledStateFunc(), name)
    })
}

export let handleUBControl = (state: state, usedGirl, name) => {
    return _handleCarry(state, createUBControlledState, getGirlUBBone, usedGirl, name, _getUBCameraDistance(state))
}

export let handlePutToBreast = (state: state, usedGirl, name) => {
    return _handleCarry(state, createBreastControlledState, getGirlPutToBreastBone, usedGirl, name, getGirlBoxSizeForCompute(state, usedGirl))
}

export let handlePutToShoe = (state: state, usedGirl, name) => {
    return _handleCarry(state, createShoeControlledState, getGirlPutToShoeBone, usedGirl, name, getGirlBoxSizeForCompute(state, usedGirl))
}


export let updateUBControlledTransform = (state: state, usedGirl, _queue, _index, parentTransform: Matrix4, localTransform: Matrix4) => {
    let d = getGirlUBBone(state, usedGirl)
    state = d[0]
    let bone = d[1]

    return _updateTransform(state, bone, _getUBCameraDistance(state), localTransform)
}

export let updatePutToBreastTransform = (state: state, usedGirl, _queue, _index, parentTransform: Matrix4, localTransform: Matrix4) => {
    let d = getGirlPutToBreastBone(state, usedGirl)
    state = d[0]
    let bone = d[1]

    return _updateTransform(state, bone, getGirlBoxSizeForCompute(state, usedGirl), localTransform)
}

export let updatePutToShoeTransform = (state: state, usedGirl, _queue, _index, parentTransform: Matrix4, localTransform: Matrix4) => {
    let d = getGirlPutToShoeBone(state, usedGirl)
    state = d[0]
    let bone = d[1]

    return _updateTransform(state, bone, getGirlBoxSizeForCompute(state, usedGirl), localTransform)
}
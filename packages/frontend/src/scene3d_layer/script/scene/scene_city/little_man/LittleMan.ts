import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { cameraType, state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleRoad, getOrbitControlsTarget, getGirlScale, getLittleManSetting, setLittleManSettingLittleManStrength } from "../CityScene";
import { bulletPropName, climbPlane, damageType, littleMan, littleManActionState, littleManStrength, objectStateName, propType } from "../type/StateType";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, setAbstractState } from "../../../../state/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { actionName, animationName } from "../little_man_data/DataType";
import { SkinAnimation } from "meta3d-jiehuo-abstract";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { fsm_state, labelAnimation, name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
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
import { getLittleHandTransform, getLittleHandTransformForDebug, getLittleHandTransformPrefix, getGiantessTransformFunc, getPickTransformPrefix } from "../utils/SkeletonUtils";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { Billboard } from "meta3d-jiehuo-abstract";
import { ScreenUtils } from "meta3d-jiehuo-abstract";
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { getHeight, getWidth } from "meta3d-utils/src/View";
import { getLittleManShootEmitEventName, getLittleManShootStartEventName, getLittleManStandupEndEventName, getLittleManStatusUpdateEventName, getLittleManSwipingEmitEventName, getLittleManSwipingStartEventName, getMissionFailEventName } from "../../../../utils/EventUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { getGirlPositionParrelToArmy, getParticleNeedCollisionCheckLoopCount, } from "../utils/ArmyUtils";
import { isControlledState, isDestoryRelatedStates, isNotDamageState, isStressingState } from "../utils/FSMStateUtils"
import { getRandomCollisionPart } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitSpeed, emitVolume, emitterLife, emitterSize, emitterSpeed, weaponType } from "../data/ValueType";
import { updateAnimationCollision } from "./Collision";
import { List, Map } from "immutable";
import { buildCameraFar, getCameraPosition, getCameraType, getControlsTarget, getDistance, hasNeedRestoreData, keepDistance, saveNeedRestoreData, updateCamera, updateControlsWhenRestore, updateControlsWhenZoomOutToThirdPersonControls, updateControlsWhenZoomOutToThirdPersonControls2, updateThirdPersonControls, useThirdPersonControls } from "../LittleManCamera";
import * as DamageUtils from "../utils/DamageUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { getDeathAnimationResourcePath } from "../data/Const";
import { defenseFactor, excitement, hp, speed } from "../data/DataType";
import * as InitWhenImportScene from "./InitWhenImportScene"
import { isPlayingAnimationByWeight, updateAnimation } from "./Animation";
import { shootEmitHandler, shootStartHandler, updateAimHud } from "./Shoot";
import { createControlledState, createDestroyingState, createInitialState, createLieState, createStandupState, createStressingState, isProtected, standupEndHandler } from "./FSMState";
import * as Transform from "./Transform";
import { PathFind } from "meta3d-jiehuo-abstract";
import { getGrid } from "../manage/city1/PathFind";
// import { getBone } from "../utils/MMDUtils";
import { getGirlPickBone } from "../girl/PickPose";
import { triggerAction } from "./Action";
import { Vector3Utils } from "meta3d-jiehuo-abstract";
import { clearPick, isLieState } from "./Utils";
import { getForceFactor, getGirlBox, getBoxSizeForCompute as getGirlBoxSizeForCompute, getWeaponTypeFactor } from "../girl/Utils";
import { getName as getGirlName, isGirl } from "../girl/Girl";
import { createBloodData } from "../utils/CharacterUtils";
import { Console } from "meta3d-jiehuo-abstract";
import { getLoadData, getModelRelatedLoadData, modelName } from "../little_man_data/ModelData";
import { swipingEmitHandler, swipingStartHandler } from "./Swiping";
import { addGunToHand, getCurrentGun, getCurrentGunName, dispose as disposeGun } from "./Gun";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { buildDownDirection } from "../../../../utils/DirectionUtils";
import { getClimbState } from "./climb/ClimbManager";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getCameraFar, getCameraNear } from "../utils/LittleManCameraUtils";

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

export let updateFsmState = (state: state) => {
    // return updateFSMState(state)

    let stateMachine = getStateMachine(state)

    // if (isChangeCrawlPoseState(state)) {
    //     state = computeGirlBox(state)
    // }

    if (getHp(state) <= 0
        && isNotDamageState(stateMachine)
        // && !isSkillState(state)
    ) {
        return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createDestroyingState(), NullableUtils.return_(getName()))
    }

    if (
        StateMachine.isState(stateMachine, objectStateName.Lie)
        && (performance.now() - getLittleManState(state).lieTime) > getCurrentModelData(state).lieKeepTime
    ) {
        return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createStandupState(), NullableUtils.getEmpty())
    }

    return Promise.resolve(state)
}

export let updateStatus = (state: state) => {
    if (getLittleManState(state).isStatusChange) {
        return Event.trigger(state, getAbstractState, getLittleManStatusUpdateEventName(), null)
    }

    return Promise.resolve(setLittleManState(state, {
        ...getLittleManState(state),
        isStatusChange: false
    }))
}

export let update = (state: state) => {
    if (!isLittleRoad(state)) {
        return Promise.resolve(state)
    }


    let promise
    if (
        isPlayingAnimationByWeight(state, animationName.Run, 0.5)
    ) {
        promise = move(state)
    }
    else {
        promise = Promise.resolve([state, new Vector3(0, 0, 0)])
    }


    return promise.then(([state, velocity]) => {
        state = updateCamera(state, velocity)


        if (getIsDebug(state)) {
            setGunInititalTransform(state, NullableUtils.getExn(getCurrentGun(state)), getIsDebug(state))
        }


        state = updateAimHud(state)


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
        stateMachine: StateMachine.create(getName(), createInitialState()),

        props: List(),
        usedBulletPropName: bulletPropName.BasicBullet,

        currentModel: modelName.Infantry,
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

        gunMap: Map(),
        aim: NullableUtils.getEmpty(),

        // parent: NullableUtils.getEmpty(),


        bloodData: createBloodData(),

        rebornTime: 0,
        lieTime: 0,

        // qte: QTE.createState(),

        movableRanges: ArrayUtils.create(),

        updateControlsWhenZoomOutToThirdPersonControlsFunc: state => {
            return updateControlsWhenZoomOutToThirdPersonControls2(state, getCameraNear(state), getCameraFar(state), getGirlBoxSizeForCompute(state))
        }
    }
}

export let dispose = (state: state) => {
    if (!isLittleRoad(state)) {
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
    state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManSwipingStartEventName(), swipingStartHandler))
    state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManSwipingEmitEventName(), swipingEmitHandler))
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
    state = setLittleManState(state, {
        ...createState(),
        currentModel: littleManState.currentModel
    })

    // state = clearPick(state)

    return Promise.resolve(state)
}

export let getValue = (state: state): littleManValue => {
    return NullableUtils.getExn(getConfigData(state).littleManValue)
}

// let _isBelongToCurrentPoseAndScaleState = (state: state, name: actionName) => {
//     return getConfigData(state).operateRenderData.filter(value => {
//         return value.pose == getCurrentPose(state) && value.scaleState == getScaleState(state)
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
    let isStatusChange = getHp(state) != hp

    return setLittleManState(state, {
        ...getLittleManState(state),
        hp,
        isStatusChange
    })
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


let _isStressingByRate = (state: state, damage, weaponType_: weaponType) => {
    let weaponTypeFactor = getWeaponTypeFactor(weaponType_)

    let forceFactor = getForceFactor(damage)

    let settingFactor

    switch (getLittleManSetting(state).littleManStrength) {
        case littleManStrength.Low:
            settingFactor = 1
            break
        case littleManStrength.Middle:
            settingFactor = 0.7
            break
        case littleManStrength.High:
            settingFactor = 0.4
            break
        default:
            throw new Error("err")
    }

    const factor = 0.35


    let rate = NumberUtils.clamp(1 * forceFactor * weaponTypeFactor * factor * settingFactor, 0, 1)

    // Console.log(rate)

    return Math.random() < rate
}

let _isChangeToLieState = (damageType_, direction) => {
    return damageType_ == damageType.Direct && direction.equals(buildDownDirection())
}

let _getDamagePositionForLabel = (state: state, center, height) => {
    switch (getCameraType(state)) {
        case cameraType.FirstPerson:
            return ScreenUtils.convertScreenCoordniateToWorldCoordniate(
                _v1_1.set(
                    getWidth() / 2,
                    getHeight() / 2 * 0.5
                ),
                getCurrentCamera(getAbstractState(state)),
                false
            )
        case cameraType.ThirdPerson:
            return center.setY(center.y + height / 2)
        default:
            throw new Error("err")
    }

}

// export let damage = (state: state, force, damageType, damagePosition: nullable<Vector3>) => {
// export let damage = (state: state, force, damageType) => {
export let damage = (state: state, forceData, fromName,
    damagePosition,
    transforms, boxes, names): Promise<[state, Array<string>]> => {
    if (state.config.isNotDamage
        || isProtected(state)
        || getClimbState(state).isPlayingAnimation
    ) {
        return Promise.resolve([state, names])
    }


    let stateMachine = getStateMachine(state)


    let box = getBox(state)



    let [[size, direction], [damageType_, weaponType]] = forceData


    if (isDestoryRelatedStates(stateMachine) || (isGirl(fromName) && (
        !_isChangeToLieState(damageType_, direction)
        && (
            isStressingState(stateMachine) || isLieState(stateMachine)
        )
    ))) {
        return Promise.resolve([state, names])
    }




    // let defenseFactor = _getDefenseFactor()
    let defenseFactor = getValue(state).defenseFactor
    let height = box.getSize(_v1).y

    let hp = getHp(state)

    // let [actuallyDamage, damage, remainedHp] = DamageUtils.computeActuallyDamage(defenseFactor, height, size, hp)
    let [actuallyDamage, damage, remainedHp] = DamageUtils.computeActuallyDamageWithDamagePosition(state, defenseFactor, height, size,
        damageType_,
        damagePosition,
        Transform.getPosition(state),
        hp)


    state = setHp(state, remainedHp)

    let center = box.getCenter(new Vector3())

    state = DamageUtils.addLabel(state, actuallyDamage, box,
        DamageUtils.computeFontType(false, damageType_, weaponType),
        NullableUtils.return_(
            _getDamagePositionForLabel(state, center, height)
        ),
        getName(),
        40,
        NullableUtils.getEmpty(),
        labelAnimation.None,
        2
    )

    if (damage <= 0) {
        return Promise.resolve([state, names])
    }


    // state = setGirlState(state, {
    //     ...getGirlState(state),
    //     lastDamageTime: performance.now()
    // })


    if (remainedHp > 0) {
        if (_isChangeToLieState(damageType_, direction)) {
            state = setLittleManState(state, {
                ...getLittleManState(state),
                lieTime: performance.now()
            })

            return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createLieState(), NullableUtils.getEmpty()).then(state => {
                return Promise.resolve([state, names])
            })
        }

        if (!StateMachine.isState(stateMachine, objectStateName.Stressing)
        ) {

            if (
                !isLieState(stateMachine)
                && !(
                    StateMachine.isState(stateMachine, objectStateName.Climb)
                    && getClimbState(state).climbPlane == climbPlane.Verticle
                )
                &&
                (
                    (isGirl(fromName)
                        || _isStressingByRate(state, damage, weaponType)
                    )
                )
            ) {
                return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, stateMachine, createStressingState(), NullableUtils.getEmpty()).then(state => {
                    return Promise.resolve([state, names])
                })
            }
        }

        return Promise.resolve([state, names])
    }

    return Promise.resolve([state, names])
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

    new Vector3(-0.3, -0.5, -0.2),
    Math.PI / 2,
    Math.PI / 2,
    0,

    false
)

export let isCanPickup = (state: state, name: name) => {
    return !isLieState(getStateMachine(state))
}

export let handlePickup = (state: state, name: name) => {
    // state = removeShadow(state, name)

    let d = getGirlPickBone(state)
    state = d[0]
    let bone = d[1]

    bone.add(getLittleMan(state))

    // state = setParent(state, bone)

    // state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getDistance(state), getCameraType(state))
    state = saveNeedRestoreData(state, getCameraNear(state), getCameraFar(state), getCameraPosition(state).clone(), getControlsTarget(state).clone(), getCameraType(state))
    state = updateControlsWhenZoomOutToThirdPersonControls2(state, 1, buildCameraFar(state, 1), getGirlBoxSizeForCompute(state))


    Console.log(
        // bone.getWorldScale(new Vector3())
        "handlePickup"
    )

    return triggerAction(state, actionName.Controlled)

    // return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createControlledState(), name)
}

export let updateTransform = (state: state, _queue, _index, _parentTransform: Matrix4, localTransform: Matrix4) => {
    // requireCheck(() => {
    //     test("scale should be default", () => {
    //         return Vector3Utils.isNearlyEqual(TransformUtils.getScaleFromMatrix4(localTransform), new Vector3(1, 1, 1), 0.1)
    //     })
    // }, getIsDebug(state))


    let d = getGirlPickBone(state)
    state = d[0]
    let bone = d[1]


    state = Transform.setLocalMatrix(state,
        // localTransform

        TransformUtils.setScaleToMatrix4(
            _m1.copy(localTransform),
            // localTransform.clone(),
            _v1.copy(
                // _v2.set(1, 1, 1).divide(
                _v2.setScalar(getCurrentModelData(state).scalar).divide(
                    bone.getWorldScale(_v3)
                )
            )
        )
    )


    // state = zoomOutCamera(state)

    Console.log(
        "update transform"
    )
    // Console.log(
    //     "little:",
    //     // getGirlScale(state),
    //     // girlScaleWhenPickup,

    //     // TransformUtils.setScaleToMatrix4(
    //     //     // _m1.copy(localTransform),
    //     //     localTransform.clone(),
    //     //     _v1.setScalar(
    //     //         1 / (
    //     //             getGirlScale(state) / girlScaleWhenPickup
    //     //         )
    //     //     )
    //     // ),
    //     // localTransform.clone(),
    //     // TransformUtils.getScaleFromMatrix4(localTransform),
    //     // getLittleMan(state).matrix
    //     TransformUtils.getScaleFromMatrix4(Transform.getLocalMatrix(state))
    // )

    Object3DUtils.markNeedsUpdate(getLittleMan(state))


    state = computeBox(state)
    // state = updateThirdPersonControls(state, 1, buildCameraFar(state, 1), getGirlBoxSizeForCompute(state))
    // state = updateControlsWhenZoomOutToThirdPersonControls(state, 1, buildCameraFar(state, 1), getGirlBoxSizeForCompute(state))
    state = keepDistance(state, getGirlBoxSizeForCompute(state))


    return state
}

export let handlePickdown = (state: state, name: name, _index, targetPoint, _queue, originTransform: Matrix4): Promise<[state, boolean]> => {
    let validTargetPoint = PathFind.findValidPosition(
        new Vector2(targetPoint.x, targetPoint.z),
        getGrid(state),
        getIsDebug(state)
    )

    if (NullableUtils.isNullable(validTargetPoint)) {
        return Promise.resolve([state, false])
    }

    validTargetPoint = NullableUtils.getExn(validTargetPoint)

    // Transform.updateTransform(
    //     state,
    //     TransformUtils.setPositionToMatrix4(
    //         originTransform.clone(),
    //         validTargetPoint
    //     )
    // )

    // let d = getGirlPickBone(state)
    // state = d[0]
    // let bone = d[1]

    // bone.remove(getLittleMan(state))

    // state = removeFromParent(state)
    state = addToScene(state)


    state = Transform.initTransform(state)
    state = Transform.setPositionAndComputeBox(state, validTargetPoint)



    if (hasNeedRestoreData(state)) {
        // state = useThirdPersonControls(state)
        // let [near, far, distance] = getNeedRestoreDataExn(state)
        // state = updateThirdPersonControls(state, near, far, distance)
        state = updateControlsWhenRestore(state)
    }


    // return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createInitialState(), name).then(state => [state, true])
    return triggerAction(state, actionName.Idle).then(state => [state, true])
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
            return data.name == getLittleManState(state).currentModel
        }
    ))
}


export let getCurrentModelRelatedLoadData = (state: state) => {
    let { resourceId } = getCurrentModelData(state)

    return getModelRelatedLoadData().filter(d => d.id.includes(resourceId))
}

export let setCurrentModelName = (state: state, name) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        currentModel: name
    })
}

export let getAllProps = (state: state, type: propType) => {
    return getLittleManState(state).props.filter(p => p.type == type)
}

export let getUsedBulletPropName = (state: state) => {
    return getLittleManState(state).usedBulletPropName
}

export let setUsedBulletPropName = (state: state, name: bulletPropName) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        usedBulletPropName: name
    })
}

export let switchBulletProp = (state: state, name: bulletPropName) => {
    let previousGunName = getCurrentGunName(state)

    state = setUsedBulletPropName(state, name)

    return addGunToHand(state, NullableUtils.return_(previousGunName))
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

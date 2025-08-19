import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getScene, getBasicBulletGunEmmitSoundResourceId, getState as getCitySceneState, setState as setCitySceneState, getName as getCitySceneName, getName, } from "../../../CityScene"
import { getIsDebug } from "../../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { soldier, objectStateName, particleNeedCollisionCheckLoopFrames, damageType, collisionPart, attackTarget } from "../../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../../Pick"
import { Map } from "immutable"
// import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Bone, Box3, Euler, Matrix4, Mesh, Object3D, Quaternion, SkinnedMesh, Texture, Vector2, Vector3 } from "three"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract"
import { Instance } from "meta3d-jiehuo-abstract"
import * as DamageUtils from "../../../utils/DamageUtils"
import { toRadians } from "../../../../../../utils/QuatUtils"
import { buildDestroyedEventData, getDestroyedEventName } from "../../../utils/EventUtils"
import { Flow } from "meta3d-jiehuo-abstract"
import { buildDownDirection, buildRandomDirectionInXZ } from "../../../../../../utils/DirectionUtils"
import { ensureCheck, requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { InstanceSourceLOD as InstanceSourceLODType } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { bulletParticle, fontType, fsm_state, labelAnimation, lodQueueIndex, name, staticLODContainerIndex, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as Girl from "../../../girl/Girl"
import { Collision } from "meta3d-jiehuo-abstract"
import { playDestroyingAnimation, playStressingAnimation } from "../../../utils/CarUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { Device } from "meta3d-jiehuo-abstract"
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedSkinLOD2"
import { armyValue, emitPrecision, emitSpeed, emitVolume, emitterLife, emitterSize, emitterSpeed, objectValue, weaponType, weaponValue } from "../../../data/ValueType"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { add, buildQueue } from "../../../utils/LODQueueUtils"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { buildStatus } from "../../../utils/LODContainerUtils"
import { getNearestCollisionPart, getRandomCollisionPart, isNearGirl } from "../../../utils/CollisionUtils"
import { buildMultipleTweens, computeEuler, computeMoveTime, getMoveData, position, singleMoveData } from "../../../utils/MoveUtils"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { convertPositionFromThreejsToBlender } from "../../../utils/BlenderUtils"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { parseCharacter, parseCharacterQueue } from "../WholeScene"
import { Render } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
// import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { queryAllOBBShapesCollisionWithBox } from "../../../girl/Collision"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getVolume } from "../../../utils/SoundUtils"
import { getShootDirection, updateAI as updateAIUtils, createMoveState as createMoveStateUtils, setParticleNeedCollisionCheckLoopCount, getParticleNeedCollisionCheckLoopCount, checkParticleCollisionWithStatic, getGirlPositionParrelToArmy, getLittleManPositionParrelToArmy, getCrowdDataUtils } from "../../../utils/ArmyUtils"
import { LOD } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { buildBloodDecalQueue, buildNameInShadowQueue, createBloodData, createDestroyingState, createStressingState, removeShadow, restoreShadow, updateShadow, handlePickdown as handlePickdownUtils } from "../../../utils/CharacterUtils"
import { defenseFactor, excitement, forceSize, hp, speed } from "../../../data/DataType"
import { updateTransform as updateTransformUtils, getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils } from "../../../girl/PickPoseUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
// import * as BasicBulletGun from "../../../weapon/BasicBulletGun"
import { isMaxArmySpeed } from "../../../utils/ConfigUtils"
// import { animationName } from "../../../little_man_data/DataType"
// import { getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShootingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getSwipingAnimationResourcePath, getControlledAnimationResourcePath, getInfantryResourcePath, getMutantResourceId, getMutantResourcePath } from "../../../little_man_data/Const"
import {
    animationName, getModelData, modelName,
    getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShootingAnimationResourcePath, getShakeAnimationResourcePath, getDeathAnimationResourcePath, getControlledAnimationResourcePath, getInfantryResourcePath,
    getInfantryResourceId,
    getCommanderResourceId,
    getEmitAnimationResourcePath,
    getRocketResourceId,
    getLasererResourceId,
} from "../../../army_data/SoldierData"
import { addBoneGroup, setBonePositionOffset } from "../../../utils/BoneUtils"
import { getArmyValueForAttack, createState as createCommanderState } from "./utils/CommanderUtils"
import { Console } from "meta3d-jiehuo-abstract"
import * as SoldierUtils from "./utils/SoldierUtils"
import { getForceFactor, getWeaponTypeFactor } from "../../../girl/Utils"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getAttackTarget } from "../Army"
import * as LittleManTransform from "../../../little_man/Transform"

const _b = new Box3()
const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

// enum soldierAnimationClipIndex {
//     Run = 0,
//     Shoot = 1,
//     Death = 2,
//     Shake = 3,
//     Idle = 4,
//     Controlled = 5,
// }

export let getState = (state: state) => {
    return NullableUtils.getExn(getCitySceneState(state).soldier)
}

export let setState = (state: state, soldierState: soldier) => {
    return setCitySceneState(state, {
        ...getCitySceneState(state),
        soldier: NullableUtils.return_(soldierState)
    })
}

export let getNamePrefix = SoldierUtils.getNamePrefix

export let getSoldierSkinMesh = (group: Object3D) => {
    let meshes = []
    group.traverse(o => {
        if ((o as SkinnedMesh).isSkinnedMesh) {
            meshes.push(o)
        }
    })

    if (meshes.length > 1) {
        throw new Error("err")
    }

    return meshes[0]
}

export let setData = (state: state, categoryName, queue: LODQueue, shadowQueue: LODQueue) => {
    return setState(state, {
        ...getState(state),
        soldierMap: getState(state).soldierMap.set(categoryName, queue),
        shadowQueueMap: getState(state).shadowQueueMap.set(categoryName, shadowQueue)
    })
}

export let isSoldier = (name: string) => {
    return name.includes(getNamePrefix())
}

export let getAllModelQueues = (state: state) => {
    return getState(state).soldierMap.valueSeq().toArray()
}

export let getClipData = (state: state, categoryName): [Array<number>, Array<number>] => {
    return [
        NullableUtils.getExn(getState(state).allClipDurations.get(categoryName)),
        NullableUtils.getExn(getState(state).allClipSteps.get(categoryName)),
    ]
}

export let setClipData = (state: state, categoryName, allClipDurations, allClipSteps) => {
    return setState(state, {
        ...getState(state),
        allClipDurations: getState(state).allClipDurations.set(categoryName, allClipDurations),
        allClipSteps: getState(state).allClipSteps.set(categoryName, allClipSteps),
    })
}

export let createState = (): soldier => {
    return {
        soldierMap: Map(),

        // glb: NullableUtils.getEmpty(),

        stateMachineMap: Map(),
        defenseFactorMap: Map(),
        hpMap: Map(),

        lodQueueIndexMap: Map(),

        moveTweenMap: Map(),

        shadowQueueMap: Map(),

        bloodData: createBloodData(),

        allClipDurations: Map(),
        allClipSteps: Map(),

        moveDataMap: Map(),

        crowdPositions: [],

        initialQuaternionMap: Map(),

        // rocketQueue: NullableUtils.getEmpty(),

        commander: createCommanderState(),
    }
}

export let getModelQueue = (state: state, name: string): LODQueue => {
    return LOD.getLODQueue(getAbstractState(state), name)
}

export let getModelQueueIndex = (state: state, name) => {
    return NullableUtils.getExn(getState(state).lodQueueIndexMap.get(name))
}


export let initWhenImportScene = (state: state) => {
    let abstractState = getAbstractState(state)

    abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat(getAllModelQueues(state)))


    state = setAbstractState(state, abstractState)

    state = buildBloodDecalQueue(state, [getState, setState])


    return state
}

export let getDefenseFactor = (state, name) => {
    return NullableUtils.getExn(getState(state).defenseFactorMap.get(name))
}

export let getHp = (state, name) => {
    return NullableUtils.getExn(getState(state).hpMap.get(name))
}

export let updateHp = (state, name, hp) => {
    return setState(state, {
        ...getState(state),
        hpMap: getState(state).hpMap.set(name, hp)
    })
}

export let getStateMachine = (state: state, name: string) => {
    return NullableUtils.getExn(getState(state).stateMachineMap.get(name))
}

export let setStateMachine = (state: state, name: string, stateMachine) => {
    return setState(state, {
        ...getState(state),
        stateMachineMap: getState(state).stateMachineMap.set(name, stateMachine)
    })
}

// let _getAllLevelInstancedSkinnedMeshes = (state, name): Array<InstancedSkinnedMesh> => {
// 	return _getModelLOD(state, name).getAllLevelInstancedMeshes()
// }

export let isStressingByRate = (state: state, damage, weaponType_: weaponType) => {
    let weaponTypeFactor = getWeaponTypeFactor(weaponType_)

    let forceFactor = getForceFactor(damage)

    const factor = 0.35


    let rate = NumberUtils.clamp(1 * forceFactor * weaponTypeFactor * factor, 0, 1)
    // Console.log(rate)

    return Math.random() < rate
}

export let damage = (
    [
        getShakeClipIndexFunc,
        getDeathClipIndexFunc,
        createInitialStateFunc,
        handleDestroyedFunc = (state, name) => state
    ]
) => {
    return (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
        return DamageUtils.damage(
            state, [
            getDefenseFactor, getHp, updateHp,

            getStateMachine,
            setStateMachine,
            () => {
                return createStressingState([getShakeClipIndexFunc, getStateMachine, setStateMachine, createInitialStateFunc])
            },
            () => {
                return createDestroyingState([getDeathClipIndexFunc, getState, setState, getStateMachine, setStateMachine, handleDestroyedFunc]
                )
            },
            isStressingByRate
        ], forceData, fromName,
            damagePosition,
            transforms, boxes, names,
        )
    }
}



let _getInitialEulerForTweenToFaceNegativeX = () => {
    return new Euler(0, -Math.PI / 2, 0)
}


let _hasMoveTween = (state, name) => {
    return getState(state).moveTweenMap.has(name)
}

let _getMoveTween = (state, name) => {
    return NullableUtils.getWithDefault(getState(state).moveTweenMap.get(name), [])
}

let _addMoveTweens = (state, name, tweens) => {
    return setState(state, {
        ...getState(state),
        moveTweenMap: getState(state).moveTweenMap.set(name,
            ArrayUtils.pushArrs(
                _getMoveTween(state, name),
                tweens
            )
        )
    })
}

export let createMoveState = ([
    getRunClipIndexFunc,
    getShadowQueueFunc,
    createInitialStateFunc,
],
    value: armyValue,
    modelName
) => {
    return (state) => {
        return createMoveStateUtils([
            getModelQueueIndex,
            getModelQueue,
            (state, name) => {
                return setAbstractState(state, GPUSkin.playLoop(
                    getAbstractState(state),
                    name, getRunClipIndexFunc(name)
                ))
            },
            (state, _, lODQueueIndex, name, position) => {
                let shadowQueue = getShadowQueueFunc(state, name)

                updateShadow(shadowQueue, lODQueueIndex, position)

                return state
            },
            _addMoveTweens,
            _getInitialEulerForTweenToFaceNegativeX,
            (state, name) => {
                return NullableUtils.getExn(getState(state).moveDataMap.get(name))
            },
            getStateMachine,
            setStateMachine,
            createInitialStateFunc,
            _hasMoveTween,
            _getMoveTween,
            (state, name) => {
                ArticluatedAnimation.removeTweens(
                    getAbstractState(state), _getMoveTween(state, name)
                )

                return setState(state, {
                    ...getState(state),
                    moveDataMap: getState(state).moveDataMap.remove(name),
                    moveTweenMap: getState(state).moveTweenMap.remove(name),
                })
            },
        ],
            isMaxArmySpeed() ? (100 as speed) : value.moveSpeed,
            getInitialQuaternion(state, modelName).clone()
        )
    }
}

let _hasMoveData = (state, name) => {
    return getState(state).moveDataMap.has(name)
}

let _setMoveData = (state, name, moveData) => {
    return setState(state, {
        ...getState(state),
        moveDataMap: getState(state).moveDataMap.set(name, moveData)
    })
}

export let updateAI = (state: state, [
    createAttackStateFunc,
    createInitialStateFunc,
    createMoveStateFunc,
],
    queue,
    value: weaponValue) => {
    let {
        emitterSpeed,
        emitterLife,
        meleeRange,
    } = value

    return updateAIUtils(state,
        [
            getStateMachine,
            setStateMachine,
            createAttackStateFunc,
            createInitialStateFunc,
            createMoveStateFunc,
            _hasMoveData,
            _setMoveData
        ],
        // getAllModelQueues(state).reduce((result, queue) => {
        queue.getValidData(getAbstractState(state)),
        emitterLife,
        emitterSpeed,
        meleeRange
    )
}

export let getCrowdData = (state: state): Array<Vector3> => {
    return getCrowdDataUtils(state, getState(state).crowdPositions)
}

export let setCrowdData = (state: state, crowdPositions) => {
    return setState(state, {
        ...getState(state),
        crowdPositions
    })
}

export let dispose = (state: state) => {
    getAllModelQueues(state).forEach(queue => {
        queue.dispose()
    })

    state = setState(state, {
        ...createState(),
    })

    return Promise.resolve(state)
}

export let getPickedTransform = (modelName) => getGiantessTransformFunc(
    (state) => getInitialQuaternion(state, modelName),

    getPickTransformPrefix(),

    new Vector3(-0.3, -0.5, -0.2),

    Math.PI / 2,
    // new Vector3(1, 0, 0),
    Math.PI / 2,
    // new Vector3(0, 1, 0),
    0,
    // new Vector3(0, 0, 1),
)

export let handlePickup = (state: state, createControlledStateFunc, name: name) => {
    state = removeShadow(state, name)

    return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createControlledStateFunc(), name, NullableUtils.getEmpty())
}

export let updateTransform = updateTransformUtils

// export let handlePickdown = (state: state, [
//     createInitialStateFunc,
//     getShadowQueueFunc
// ], name: name, index: lodQueueIndex, targetPoint, queue: LODQueue, originTransform: Matrix4): Promise<[state, boolean]> => {
//     return handlePickdownUtils(state,
//         (state, name) => {
//             return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createInitialStateFunc(), name, NullableUtils.return_(name))
//         },
//         name, index, targetPoint, queue, getShadowQueueFunc(state, name), originTransform
//     )
// }

export let handlePickdown = ([
    createInitialStateFunc,
    getShadowQueueFunc
]) => {
    return (state: state, name: name, index: lodQueueIndex, targetPoint, queue: LODQueue, originTransform: Matrix4): Promise<[state, boolean]> => {
        return handlePickdownUtils(state,
            (state, name) => {
                return StateMachine.changeAndExecuteState(state, setStateMachine, getStateMachine(state, name), createInitialStateFunc(), name, NullableUtils.return_(name))
            },
            name, index, targetPoint, queue, getShadowQueueFunc(state, name), originTransform
        )
    }
}

export let getLocalTransform = getLocalTransformUtils

export let getBoxForPick = getBoxForPickUtils

export let getInitialQuaternion = (state: state, modelName) => {
    return NullableUtils.getExn(getState(state).initialQuaternionMap.get(modelName))
}


export let shoot = (state: state,
    emitFunc,
    // bulletStartLocalPosition,
    armyValue: armyValue,
    // emitSpeed: emitSpeed,
    weaponValue: weaponValue,
    initialQuaternion,

    name, clipIndex, lodQueue, lODQueueAndShadowLODQueueIndex) => {
    if (!StateMachine.isState(getStateMachine(state, name), objectStateName.Attack)
        // || getAttackTarget(state, name) == attackTarget.None
    ) {
        return state
    }

    let matrix = lodQueue.transforms[lODQueueAndShadowLODQueueIndex]

    let soldierPosition = TransformUtils.getPositionFromMatrix4(matrix)
    let soldierScale = TransformUtils.getScaleFromMatrix4(matrix)
    // let targetPosition = getGirlPositionParrelToArmy(state, soldierPosition.y, getRandomCollisionPart())

    let targetPosition, targetPart
    switch (getAttackTarget(state, name)) {
        case attackTarget.Giantess:
            targetPart = NullableUtils.return_(getNearestCollisionPart(state, soldierPosition))
            targetPosition = getGirlPositionParrelToArmy(state, soldierPosition.y, targetPart)
            break
        case attackTarget.LittleMan:
            targetPart = NullableUtils.getEmpty()
            targetPosition = getLittleManPositionParrelToArmy(state, soldierPosition.y, LittleManTransform.getWorldPosition(state))
            break
        default:
            throw new Error("err")
    }

    let lookatQuaternion = TransformUtils.getLookatQuaternion(
        soldierPosition,
        targetPosition
    )

    TransformUtils.setQuaternionToMatrix4(matrix,
        initialQuaternion.clone().premultiply(
            lookatQuaternion
        )
    )


    let newArmyValue = getArmyValueForAttack(state, armyValue, soldierPosition)
    // Console.log(armyValue)
    // Console.log(newArmyValue)

    let {
        emitSpeed,
    } = newArmyValue

    // let bulletStartWorldPosition = getBulletStartLocalPositionFunc(soldierScale)
    //     .applyQuaternion(lookatQuaternion)
    //     .add(
    //         soldierPosition
    //     )

    state = emitFunc(state,
        // bulletStartWorldPosition,
        targetPosition,
        targetPart,
        lookatQuaternion,
        soldierPosition,
        soldierScale,
        newArmyValue,
        weaponValue,
    )


    state = setAbstractState(state, GPUSkin.playOnce(
        getAbstractState(state),
        (state) => {
            state = setAbstractState(state, GPUSkin.playLastFrame(getAbstractState(state), name, clipIndex))


            state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
                return Promise.resolve(shoot(state,
                    emitFunc,

                    armyValue,
                    weaponValue,
                    initialQuaternion,

                    name, clipIndex, lodQueue, lODQueueAndShadowLODQueueIndex))
            }, emitSpeed))

            return Promise.resolve(state)
        },
        name, clipIndex
    ))

    return state
}

export let parseAllWeaponModels = (state: state) => {
    return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getRocketResourceId()), Render.getRenderer(getAbstractState(state))).then(rocket => {
        return rocket.scene.children[0] as Mesh
    })
    // .then(rocket => {
    //     return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getLasererResourceId()), Render.getRenderer(getAbstractState(state))).then(laser => {
    //         return laser.scene.children[0] as Mesh
    //     }).then(laser => {
    //         return [rocket, laser]
    //     })
    // })
}

export let getBulletStartLocalPositionFunc = (
    getBulletStartLocalPositionFunc,
    lookatQuaternion,
    soldierPosition,
    soldierScale,
) => {
    return getBulletStartLocalPositionFunc(soldierScale)
        .applyQuaternion(lookatQuaternion)
        .add(
            soldierPosition
        )
}

export let getFPS = () => {
    return Device.isMobile() ? 30 : 60
}

export let exitFuncForCreateShootState = (state: state, stateMachine) => {
    let name = stateMachine.name

    state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), name))

    return Promise.resolve(state)
}

export let getBloodDecalQueue = (state: state) => {
    return getState(state).bloodData.bloodDecalQueue
}
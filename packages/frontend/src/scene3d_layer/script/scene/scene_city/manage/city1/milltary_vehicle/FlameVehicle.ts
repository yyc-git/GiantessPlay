import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getDynamicGroup, getFlameGunEmitSoundResourceId, getScene, getShellGunBarretHitSoundResourceId, getState, setState } from "../../../CityScene"
import { getIsDebug } from "../../../../Scene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { milltaryVehicle, objectStateName, particleNeedCollisionCheckLoopFrames, damageType, collisionPart } from "../../../type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { Event } from "meta3d-jiehuo-abstract"
import { Pick } from "meta3d-jiehuo-abstract"
import { setBoxCube } from "../../../Pick"
import { Map } from "immutable"
// import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Box3, Euler, Group, Matrix4, Mesh, Object3D, Quaternion, Ray, SkinnedMesh, Texture, Vector2, Vector3 } from "three"
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
import { fontType, fsm_state, labelAnimation, lodQueueIndex, name, shellParticle, staticLODContainerIndex, tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Collision } from "meta3d-jiehuo-abstract"
import { playDestroyingAnimation, playStressingAnimation } from "../../../utils/CarUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { GPUSkin } from "meta3d-jiehuo-abstract"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { Device } from "meta3d-jiehuo-abstract"
import { InstancedSkinLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedSkinLOD2"
import { armyValue, emitPrecision, emitSpeed, emitVolume, emitterLife, emitterSize, emitterSpeed, objectValue, milltaryValue, explodeSize } from "../../../data/ValueType"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Loader } from "meta3d-jiehuo-abstract"
import { add, buildQueue } from "../../../utils/LODQueueUtils"
import { fixZFighting } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils"
import { solveBlackBoardProblem } from "meta3d-jiehuo-abstract/src/utils/TextureUtils"
import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import { buildStatus } from "../../../utils/LODContainerUtils"
import { buildMultipleTweens, computeEuler, computeMoveTime, getMoveData, position, singleMoveData } from "../../../utils/MoveUtils"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { convertPositionFromThreejsToBlender } from "../../../utils/BlenderUtils"
import { getGrid } from "../PathFind"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { parseArmyVehicleQueues, parseCharacter } from "../WholeScene"
import { Render } from "meta3d-jiehuo-abstract"
import { getActualHeight, getGirlPositionParrelToObj, getPositionParrelToObj, getScale, getSmallGirlBox } from "../../../girl/Utils"
import { ParticleManager } from "meta3d-jiehuo-abstract"
// import { InstancedSkinnedMesh } from "meta3d-jiehuo-abstract/src/gpu_skin/InstancedSkinnedMesh"
import * as Buildings from "../Buildings"
import { getCollisionPartCenter, getCollisionPartOBB, queryAllOBBShapesCollisionWithBox } from "../../../girl/Collision"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getVolume } from "../../../utils/SoundUtils"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract/src/lod/lod2/InstancedLOD2"
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { findArticluatedAnimationData, playArticluatedAnimation } from "../../../data/DataUtils"
import * as HierachyLODQueueUtils from "../../../utils/HierachyLODQueueUtils"
import { articluatedAnimationName, defenseFactor, excitement, forceSize, hp, speed } from "../../../data/DataType"
import { LOD } from "meta3d-jiehuo-abstract"
import { getShootDirection, updateAI, createMoveState as createMoveStateUtils, setParticleNeedCollisionCheckLoopCount, getParticleNeedCollisionCheckLoopCount, checkParticleCollisionWithStatic, getGirlPositionParrelToArmy, emitShellEmitOrExplode, deferFire, getTargetBox, handleCollision } from "../../../utils/ArmyUtils"
import * as Girl from "../../../girl/Girl"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getTransformData, updatePositionTween } from "../../../data/InstancedLOD2Utils"
import { clearTween } from "../../../utils/TweenUtils"

import { getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils } from "../../../girl/PickPoseUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
import * as FlameGun from "../../../weapon/FlameGun"
import { addBox3Helper, isMaxArmySpeed } from "../../../utils/ConfigUtils"
import { makeBoxHeightMax } from "../../../utils/Box3Utils"
import { getLookatQuaternion } from "meta3d-jiehuo-abstract/src/utils/TransformUtils"
import { getArmyValueForAttack } from "../soldier/utils/CommanderUtils"
import { getFlameVehicleResourceId, getModelData, modelName } from "../../../army_data/MilltaryVehicleData"
import * as MilltaryVehicle from "./MilltaryVehicle"
import { Console } from "meta3d-jiehuo-abstract"
import { getCurrentScene } from "meta3d-jiehuo-abstract/src/scene/Scene"
import { handleFlameHitGirl, handleFlameHitLittleMan, handleFlameHitStatic } from "./weapon/Flame"
import { getFlameVehicleNamePrefix } from "../soldier/utils/MeleeUtils"

const _b = new Box3()
const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();


export let getNamePrefix = () => `${MilltaryVehicle.getNamePrefix()}_${getFlameVehicleNamePrefix()}`

export let buildFlameVehicleCategoryName = getNamePrefix

export let buildFlameVehicleNamePrefix = (queueName) => {
    return `${queueName}_${getNamePrefix()}`
}

let _getBodyPostfix = () => "body"

export let buildBodyLODQueueName = (categoryName) => `*${categoryName}_${_getBodyPostfix()}*`


export let setHierachy = (state: state) => {
    return state
}

export let getAllMeshData = (group: Group) => {
    let obj = group.children[0]
    return [
        [obj.children[0], buildBodyLODQueueName],
        []
    ]
}

export let isFlameVehicle = (name: string) => {
    return name.includes(getNamePrefix())
}

export let getValue = (state: state): armyValue & milltaryValue => {
    return {
        excitement: excitement.High,
        defenseFactor: defenseFactor.High,
        hp: hp.High,
        // hp: 1,

        moveSpeed: speed.High,

        rotateSpeed: speed.Middle,


        emitSpeed: emitSpeed.Slow,
        emitVolume: emitVolume.Middle,
        emitPrecision: emitPrecision.High,


        emitterVolume: emitVolume.Big,
    }
}

export let getFlameVehicleBodyQueue = (state: state): HierachyLODQueue => {
    return MilltaryVehicle.getModelQueueByQueueName(state, buildFlameVehicleCategoryName(), buildBodyLODQueueName(buildFlameVehicleCategoryName()))
}

export let getAllModelQueues = (state: state): Array<LODQueue> => {
    return [getFlameVehicleBodyQueue(state)]
}

export let getModelAllQueues = (state: state): [HierachyLODQueue] => {

    let bodyQueue = getFlameVehicleBodyQueue(state)

    return [bodyQueue]
}

let _getAllBodyNames = (state): Array<string> => {
    return MilltaryVehicle.getModelQueueByQueueName(state,
        buildFlameVehicleCategoryName(),
        buildBodyLODQueueName(buildFlameVehicleCategoryName())).names
}

export let initWhenImportScene = (state: state) => {
    return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getFlameVehicleResourceId()), Render.getRenderer(getAbstractState(state))).then(flameVehicle => {
        let { quaternion, boxFactor } = getModelData(state, modelName.FlameVehicle)

        state = MilltaryVehicle.setState(state, {
            ...MilltaryVehicle.getState(state),
            initialQuaternionMap: MilltaryVehicle.getState(state).initialQuaternionMap.set(modelName.FlameVehicle,
                quaternion
            ),
        })


        let data = parseArmyVehicleQueues(state,
            [
                buildFlameVehicleCategoryName,
                getAllMeshData,
                MilltaryVehicle.setData,
                setHierachy,
            ],
            flameVehicle.scene,
            boxFactor,
            500,
            true,
            getScene(state)
        )
        state = data[0]
        let localMatrices = data[1] as [Matrix4]
        let allQueues = data[2]

        return MilltaryVehicle.setAllQueueLocalMatrices(state, buildFlameVehicleCategoryName(), localMatrices)
    })
        .then(state => {
            let abstractState = getAbstractState(state)

            abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat([MilltaryVehicle.getModelQueueByQueueName(state, buildFlameVehicleCategoryName(), buildBodyLODQueueName(buildFlameVehicleCategoryName()))]))


            state = setAbstractState(state, abstractState)

            return ArrayUtils.reducePromise(_getAllBodyNames(state), (state, name) => {
                state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
                    return StateMachine.changeAndExecuteState(state, MilltaryVehicle.setStateMachine, MilltaryVehicle.getStateMachine(state, name), createFireState(), name, NullableUtils.return_(name))
                }, 1))

                return StateMachine.execute(state, MilltaryVehicle.getStateMachine(state, name), name)
            }, state)
        })
}

let _getFullHp = (state) => {
    return getValue(state).hp
}


let _buildRoughFireRay = ([bodyQueue], lODQueueIndex) => {
    // let position = _getFlameEmitPointPosition(bodyQueue, lODQueueIndex)

    // let bodyPosition = TransformUtils.getPositionFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex))

    return new Ray(
        // bodyPosition,
        // position.clone().sub(bodyPosition).normalize()
    )
}

let _getFlameEmitPointInitialPosition = () => {
    // return new Vector3(0, 0, 5)
    return new Vector3(0, 10, 40)
}

let _getFlameEmitPointPosition = (bodyQueue, lODQueueIndex) => {
    return _getFlameEmitPointInitialPosition()
        .applyMatrix4(
            bodyQueue.getWorldMatrix(lODQueueIndex)
        )
}

let _rotateTowardsTarget = (state, [onCompleteFunc, onFailFunc], name, [bodyQueue], lODQueueIndex, targetPart) => {
    // let bodyPosition = TransformUtils.getPositionFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex))

    // let girlPosition = getPositionParrelToObj(getCollisionPartCenter(state, targetPart), bodyPosition.y)

    // let { emitPrecision } = getArmyValueForAttack(state, getValue(state), bodyPosition)

    // let bodyLookatQuaternion = TransformUtils.getLookatQuaternion(
    //     bodyPosition,
    //     (girlPosition.clone().add(_v1.set(
    //         emitPrecision * NumberUtils.getRandomValue1(),
    //         0,
    //         emitPrecision * NumberUtils.getRandomValue1(),
    //     ))),
    // )


    // let bodyTransform = bodyQueue.transforms[lODQueueIndex]

    // let _ = TransformUtils.setQuaternionToMatrix4(
    //     bodyTransform,
    //     bodyLookatQuaternion
    // )

    // state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
    //     return onCompleteFunc(state, targetPart)
    // }, 1))

    // return state
    throw new Error("err")
}

let _fireFlames = (state: state,
    name, [bodyQueue], lODQueueIndex, targetPart) => {
    let emitPosition = _getFlameEmitPointPosition(bodyQueue, lODQueueIndex)

    let {
        emitSpeed,
        emitVolume,
        emitPrecision
    } = getArmyValueForAttack(state, getValue(state), emitPosition)
    let weaponValue = FlameGun.getValue(state)
    let {
        emitterSpeed,
        emitterLife,
        emitterSize,
    } = weaponValue

    let targetPosition = getTargetBox(state, name, targetPart).getCenter(new Vector3())

    let shootDirection = getShootDirection(
        targetPosition.clone().sub(emitPosition).normalize(),
        emitPrecision
    )

    return deferFire(state, (state) => {
        state = setAbstractState(state, ParticleManager.emitFlame(getAbstractState(state), {
            speed: emitterSpeed,
            life: emitterLife,
            size: emitterSize,
            position: emitPosition.toArray(),
            direction: shootDirection.toArray(),
            colors: [[1, 0, 0], [0.6, 0, 0], [1, 1, 0], [0.8, 0.9, 0]],
        }))

        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            SoundManager.buildNeedToPlaySoundData(getFlameGunEmitSoundResourceId(), getIsDebug(state), getVolume(state, getValue(state).emitterVolume,
                emitPosition, 0
            ))
        ))

        state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
            // return handleMeleeCollision(
            //     state,
            //     [
            //         handleFlameHitStatic,
            //         handleFlameHitGirl
            //     ],
            //     name,
            //     0.5,
            //     targetPosition,
            //     targetPart,
            //     emitPosition,
            //     bodyQueue.boxes[lODQueueIndex],
            //     weaponValue,
            // )
            // let direction = targetPosition.clone().sub(emitPosition).normalize()

            // let box = bodyQueue.boxes[lODQueueIndex]

            let meleeRange = NullableUtils.getExn(
                weaponValue.meleeRange
            )


            // let center = box.getCenter(_v1).add(direction.multiplyScalar(meleeRange / 2 * 1.5))
            let center = emitPosition.clone().add(shootDirection.clone().multiplyScalar(meleeRange / 2 * 1.1))

            // let attackRangeBox

            // let xzSizeFactor = 0.5

            // let attackRangeBox = _b.setFromCenterAndSize(center, _v2.set(meleeRange * xzSizeFactor, box.getSize(_v3).y, meleeRange * xzSizeFactor,))

            let attackRangeBox = _b.setFromCenterAndSize(center, _v2.set(
                meleeRange,
                Math.abs(targetPosition.y - emitPosition.y),
                meleeRange)
            )

            if (getIsDebug(state)) {
                addBox3Helper(getAbstractState(state), getScene(state), attackRangeBox, 0x811100)
            }

            return handleCollision(
                state,
                [
                    handleFlameHitGirl,
                    // NullableUtils.return_(handleFlameHitArmy),
                    NullableUtils.getEmpty(),
                    handleFlameHitLittleMan
                ],
                // NullableUtils.return_(targetPart),
                targetPart,
                attackRangeBox, center,
                name,
                shootDirection,
                weaponValue,
                damageType.Direct
            )
        }, 0.5, name))


        return Promise.resolve(MilltaryVehicle.fire(state,
            [
                _buildRoughFireRay,
                _rotateTowardsTarget,
                _fireFlames,
                getFlameVehicleBodyQueue,
                FlameGun.getValue
            ],
            name, [bodyQueue], lODQueueIndex, targetPart, true))
    }, name, emitSpeed)
}

export let createFireState = MilltaryVehicle.createFireState(
    [
        getModelAllQueues,
        _buildRoughFireRay,
        _rotateTowardsTarget,
        _fireFlames,
        getFlameVehicleBodyQueue,
        FlameGun.getValue
    ],
    true
)

let _getInitialEulerForTweenToFaceNegativeX = () => {
    return new Euler(0, -Math.PI / 2, 0)
}

export let createMoveState = (state) => {
    return MilltaryVehicle.createMoveState(
        [
            getFlameVehicleBodyQueue,
            _getInitialEulerForTweenToFaceNegativeX
        ],
        getValue(state),
        modelName.FlameVehicle
    )
}

// export let createStressingState = () => {
//     return MilltaryVehicle.createStressingState(
//         [
//             getFlameVehicleBodyQueue,
//             _getFullHp,

//             getModelAllQueues,
//             _buildRoughFireRay,
//             _rotateTowardsTarget,
//             _fireFlames,
//             getRandomCollisionPartForMelee
//         ],
//     )
// }


let _setStatus = (state: state, status, index) => {
    let bodyQueue = getFlameVehicleBodyQueue(state)

    LOD.setStatusForLODQueue(getAbstractState(state), bodyQueue.names[index], status)

    return state
}


export let updateQueue = (state: state) => {
    let bodyQueue = getFlameVehicleBodyQueue(state)

    HierachyLODQueueUtils.update(state, bodyQueue)
}

export let initialAttributes = (state, name, index) => {
    return MilltaryVehicle.initialAttributes(state, [getValue, _getFullHp], name, index)
}

export let damage = (damageFunc) => {
    return (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
        return damageFunc(state,
            [
                getFlameVehicleBodyQueue,
                _getFullHp,
                _setStatus,
                MilltaryVehicle.emitBodyExplode,

                getModelAllQueues,
                _buildRoughFireRay,
                _rotateTowardsTarget,
                _fireFlames,
                FlameGun.getValue
            ],
            getShellGunBarretHitSoundResourceId(),
            getValue(state),

            forceData, fromName, damagePosition, transforms, boxes, names,
            true
        )
    }
}

export let update = (state: state) => {
    updateQueue(state)

    return MilltaryVehicle.updateAI(state, [
        createFireState,
        createMoveState(state)
    ],
        getFlameVehicleBodyQueue(state),
        FlameGun.getValue(state)
    )
}


// export let getPickedTransform = MilltaryVehicle.getPickedTransform(modelName.FlameVehicle)
export let getPickedTransform = getGiantessTransformFunc(
    (state) => MilltaryVehicle.getInitialQuaternion(state, modelName.FlameVehicle),

    getPickTransformPrefix(),

    new Vector3(0.1, -0.4, 0.1),
    0.4, -0.2, 1.5
)



export let handlePickup = MilltaryVehicle.handlePickup

export let updateTransform = MilltaryVehicle.updateTransform

export let handlePickdown = MilltaryVehicle.handlePickdown(getFlameVehicleBodyQueue)

export let getLocalTransform = MilltaryVehicle.getLocalTransform

export let getBoxForPick = MilltaryVehicle.getBoxForPick



export let getModelQueueIndex = MilltaryVehicle.getModelQueueIndex

export let getHp = MilltaryVehicle.getHp
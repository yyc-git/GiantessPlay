import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getDynamicGroup, getShellGunBarretEmitSoundResourceId, getScene, getShellGunBarretHitSoundResourceId, getState, setState, getMissileRackEmitSoundResourceId } from "../../../CityScene"
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
import { Box3, Euler, EulerOrder, Group, Matrix4, Mesh, Object3D, Quaternion, Ray, SkinnedMesh, Texture, Vector2, Vector3 } from "three"
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
import { getRandomCollisionPartCanAttack, isNearGirl } from "../../../utils/CollisionUtils"
import { buildMultipleTweens, computeEuler, computeMoveTime, getMoveData, position, singleMoveData } from "../../../utils/MoveUtils"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { PathFind } from "meta3d-jiehuo-abstract"
import { convertPositionFromThreejsToBlender } from "../../../utils/BlenderUtils"
import { getGrid } from "../PathFind"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { generateVehicleCrowd, parseArmyVehicleQueues, parseCharacter } from "../WholeScene"
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
import { getShootDirection, updateAI, createMoveState as createMoveStateUtils, setParticleNeedCollisionCheckLoopCount, getParticleNeedCollisionCheckLoopCount, checkParticleCollisionWithStatic, getGirlPositionParrelToArmy, emitShellEmitOrExplode, buildGunBarrelTween, deferFire, emitMissiles, getTargetBox } from "../../../utils/ArmyUtils"
import * as Girl from "../../../girl/Girl"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getTransformData, updatePositionTween } from "../../../data/InstancedLOD2Utils"
import { clearTween } from "../../../utils/TweenUtils"

import { getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils } from "../../../girl/PickPoseUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
import * as TurretMissileRack from "../../../weapon/TurretMissileRack"
import { addBox3Helper, isMaxArmySpeed } from "../../../utils/ConfigUtils"
import { makeBoxHeightMax } from "../../../utils/Box3Utils"
import { getLookatQuaternion } from "meta3d-jiehuo-abstract/src/utils/TransformUtils"
import { getArmyValueForAttack } from "../soldier/utils/CommanderUtils"
import { getModelData, modelName } from "../../../army_data/MilltaryBuildingData"
import * as MilltaryBuilding from "./MilltaryBuilding"
import { getMissileTurretResourceId } from "../../../army_data/MilltaryBuildingData"

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

export let getNamePrefix = () => `${MilltaryBuilding.getNamePrefix()}_missileTurret`

export let buildMissileTurretCategoryName = getNamePrefix

export let buildMissileTurretNamePrefix = (queueName) => {
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

export let isMissileTurret = (name: string) => {
    return name.includes(getNamePrefix())
}

export let getValue = (state:state): armyValue & milltaryValue => {
    return {
        excitement: excitement.High,
        defenseFactor: defenseFactor.Middle,
        hp: hp.Middle,

        moveSpeed: speed.Zero,

        rotateSpeed: speed.Middle,

        emitSpeed: emitSpeed.Slow,
        emitVolume: emitVolume.Middle,
        emitPrecision: emitPrecision.High,


        emitterVolume: emitVolume.Big,
    }
}

export let getMissileTurretBodyQueue = (state: state): HierachyLODQueue => {
    return MilltaryBuilding.getModelQueueByQueueName(state, buildMissileTurretCategoryName(), buildBodyLODQueueName(buildMissileTurretCategoryName()))
}

export let getAllModelQueues = (state: state): Array<LODQueue> => {
    return [getMissileTurretBodyQueue(state)]
}

export let getModelAllQueues = (state: state): [HierachyLODQueue] => {
    let bodyQueue = getMissileTurretBodyQueue(state)

    return [bodyQueue]
}

let _getAllBodyNames = (state): Array<string> => {
    return MilltaryBuilding.getModelQueueByQueueName(state,
        buildMissileTurretCategoryName(),
        buildBodyLODQueueName(buildMissileTurretCategoryName())).names
}

export let generateTurrets = (state: state, positions: Array<Vector3>, camp_, attackTarget_) => {
    return MilltaryBuilding.generateTurrets(state,
        [
            buildMissileTurretNamePrefix,
            initialAttributes
        ],
        getModelAllQueues(state),
        positions,
        modelName.MissileTurret,
        buildMissileTurretCategoryName(),
        getMissileTurretBodyQueue(state),
        camp_,
        attackTarget_
    )
}

export let initWhenImportScene = (state: state) => {
    return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getMissileTurretResourceId()), Render.getRenderer(getAbstractState(state))).then(turret => {
        let { quaternion } = getModelData(state, modelName.MissileTurret)

        state = MilltaryBuilding.setState(state, {
            ...MilltaryBuilding.getState(state),
            initialQuaternionMap: MilltaryBuilding.getState(state).initialQuaternionMap.set(modelName.MissileTurret,
                quaternion
            ),
        })


        let data = parseArmyVehicleQueues(state,
            [
                buildMissileTurretCategoryName,
                getAllMeshData,
                MilltaryBuilding.setData,
                setHierachy,
            ],
            turret.scene,
            NullableUtils.getEmpty(),
            500,
            true,
            getScene(state)
        )
        state = data[0]
        let localMatrices = data[1] as [Matrix4]
        let allQueues = data[2]

        return MilltaryBuilding.setAllQueueLocalMatrices(state, buildMissileTurretCategoryName(), localMatrices)
    })
        // .then(state => {
        //     return MilltaryBuilding.generateTurrets(state,
        //         [
        //             buildMissileTurretNamePrefix,
        //             initialAttributes
        //         ],
        //         getModelAllQueues(state),
        //         modelName.MissileTurret,
        //         buildMissileTurretCategoryName(),
        //         getMissileTurretBodyQueue(state)
        //     )
        // })
        .then(state => {
            let abstractState = getAbstractState(state)

            abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat([MilltaryBuilding.getModelQueueByQueueName(state, buildMissileTurretCategoryName(), buildBodyLODQueueName(buildMissileTurretCategoryName()))]))


            state = setAbstractState(state, abstractState)

            return ArrayUtils.reducePromise(_getAllBodyNames(state), (state, name) => {
                state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
                    return StateMachine.changeAndExecuteState(state, MilltaryBuilding.setStateMachine, MilltaryBuilding.getStateMachine(state, name), createFireState(), name, NullableUtils.return_(name))
                }, 1))

                return StateMachine.execute(state, MilltaryBuilding.getStateMachine(state, name), name)
            }, state)
        })
}

let _getFullHp = (state) => {
    return getValue(state).hp
}


let _getHeadForwardInitialPointPosition = (scale) => {
    return new Vector3(0, 0, 1).multiply(scale)
}

let _getHeadForwardPointPosition = (bodyQueue, lODQueueIndex) => {
    return _getHeadForwardInitialPointPosition(TransformUtils.getScaleFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex)))
        .applyMatrix4(
            bodyQueue.getWorldMatrix(lODQueueIndex)
        )
}

let _getMissilesStartWorldPosition = (missileQueue, lODQueueIndex, missileIndex): [Vector3, Vector3] => {
    let x = 0.1
    let y1 = 0.3
    let y2 = 0.35
    let z = 0.2

    let pStart = [
        new Vector3(x, y1, z),
        new Vector3(-x, y1, z),

        new Vector3(x, y2, z),
        new Vector3(-x, y2, z),
    ]

    // z = 0.2 + 0.4
    z = 0.2

    let pEnd = [
        new Vector3(x, y1, z),
        new Vector3(-x, y1, z),

        new Vector3(x, y2, z),
        new Vector3(-x, y2, z),
    ]


    return [
        pStart[missileIndex].multiply(TransformUtils.getScaleFromMatrix4(missileQueue.getWorldMatrix(lODQueueIndex)))
            .applyMatrix4(
                missileQueue.getWorldMatrix(lODQueueIndex)
            ),
        pEnd[missileIndex].multiply(TransformUtils.getScaleFromMatrix4(missileQueue.getWorldMatrix(lODQueueIndex)))
            .applyMatrix4(
                missileQueue.getWorldMatrix(lODQueueIndex)
            ),
    ]
}

let _buildRoughFireRay = ([bodyQueue], lODQueueIndex) => {
    let headForwardPointPosition = _getHeadForwardPointPosition(bodyQueue, lODQueueIndex)

    let bodyPosition = MilltaryBuilding.getBodyPosition(bodyQueue, lODQueueIndex)


    // let _ = addBox3Helper(readState(), getScene(readState()), new Box3().setFromCenterAndSize(headForwardPointPosition, new Vector3(5, 5, 5)), 0xffff00)

    return new Ray(
        bodyPosition,
        headForwardPointPosition.clone().sub(bodyPosition).normalize()
    )
}

// let _getLookatEuler = (
//     bodyPosition,
//     girlPosition,
//     isDebug
// ) => {
//     let value = TransformUtils.getLookatEuler(
//         bodyPosition,
//         girlPosition,
//         // 'YXZ'
//     )

//     value.y += Math.PI / 2


//     if (value.x == - Math.PI && value.z == - Math.PI) {
//         value.x = 0
//         value.z = 0
//         value.y = -value.y
//     }

//     // if (value.x % Math.PI * 2 == 0) {
//     // 	value.x = 0
//     // }
//     // if (value.z % Math.PI * 2 == 0) {
//     // 	value.z = 0
//     // }

//     return ensureCheck(value, () => {
//         test("euler.x,euler.z should be 0", () => {
//             return value.x == 0 && value.z == 0
//         })
//     }, isDebug)
// }

// let _fixGimbalLock = (turretLookatEuler, turretEuler) => {
//     if (turretLookatEuler.y < 0 && turretEuler.z > 0) {
//         let y = (Math.PI + turretLookatEuler.y) + Math.PI

//         if (y < Math.PI * 1.5) {
//             turretLookatEuler.y = y
//         }
//     }
//     else if (turretLookatEuler.y > 0 && turretEuler.z < 0) {
//         let y = - Math.PI - (Math.PI - turretLookatEuler.y)

//         if (y > -Math.PI * 1.5) {
//             turretLookatEuler.y = y
//         }
//     }

//     return turretLookatEuler
// }

// let _buildBodyTween = (state, [onCompleteFunc, onFailFunc], bodyQueue, allModelQueues, lODQueueIndex, targetPart) => {
//     // let bodyPosition = MilltaryBuilding.getBodyPosition(bodyQueue, lODQueueIndex)
//     let bodyTransform = bodyQueue.transforms[lODQueueIndex]

//     let bodyPosition = TransformUtils.getPositionFromMatrix4(bodyTransform)


//     let girlPosition = getPositionParrelToObj(getCollisionPartCenter(state, targetPart), bodyPosition.y)

//     let { emitPrecision, rotateSpeed } = getArmyValueForAttack(state, getValue(state), bodyPosition) as any

//     let eulerOrder: EulerOrder = 'YXZ'

//     let bodyLookatEuler = TransformUtils.getLookatEuler(
//         bodyPosition,
//         (girlPosition.clone().add(_v1.set(
//             emitPrecision * NumberUtils.getRandomValue1(),
//             0,
//             emitPrecision * NumberUtils.getRandomValue1(),
//         ))),
//         eulerOrder
//     )
//     // let bodyLookatQuaternion = new Quaternion(0, 0, 0, 1).setFromEuler(_e.set(-90 / 180 * Math.PI, 0, 0,
//     //     'YXZ'
//     // )).premultiply(
//     //     TransformUtils.getLookatQuaternion(
//     //         bodyPosition,
//     //         (girlPosition.clone().add(_v1.set(
//     //             emitPrecision * NumberUtils.getRandomValue1(),
//     //             0,
//     //             emitPrecision * NumberUtils.getRandomValue1(),
//     //         ))),
//     //     )
//     // )
//     // let bodyLookatEuler = new Euler().setFromQuaternion(bodyLookatQuaternion, 'YXZ')

//     // let bodyTransform = bodyQueue.transforms[lODQueueIndex].clone()


//     let bodyEuler = TransformUtils.getRotationEulerFromMatrix4(bodyTransform,
//         eulerOrder
//     )
//     // if (bodyEuler.x !== 0 || bodyEuler.z !== 0) {
//     // 	throw new Error("err")
//     // }


//     // // Console.log(
//     // // 	"data:",
//     // // 	bodyLookatEuler.y,
//     // // 	bodyEuler.z,
//     // // 	lODQueueIndex,
//     // // 	bodyPosition,
//     // // )


//     // let bodyTransform = bodyQueue.transforms[lODQueueIndex].clone()
//     // let bodyEuler = TransformUtils.getRotationEulerFromMatrix4(bodyTransform)

//     // bodyLookatEuler.set(bodyLookatEuler.x, bodyLookatEuler.y - bodyEuler.z, bodyLookatEuler.z)



//     // bodyLookatEuler = _fixGimbalLock(bodyLookatEuler, bodyEuler)



//     // bodyQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
//     //     bodyTransform,
//     //     new Quaternion(-0.707, 0, 0, 0.707)
//     //         .premultiply(
//     //             _q.setFromEuler(_e.set(
//     //                 0,
//     //                 // 0,
//     //                 bodyLookatEuler.y,
//     //                 0,
//     //                 'YXZ'
//     //             ))
//     //         )
//     // )

//     // state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))


//     let object = {
//         // x: 0,
//         // y: bodyEuler.z,
//         y: bodyEuler.y,
//         // z: 0,
//     }
//     let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
//         .to({
//             y: bodyLookatEuler.y,
//         }, Math.abs(bodyLookatEuler.y - bodyEuler.y) * 1000 * rotateSpeed)
//         .onUpdate(() => {
//             let state = readState()

//             if (MilltaryBuilding.isRoughTowardsTarget(state,
//                 _buildRoughFireRay,
//                 allModelQueues, lODQueueIndex, makeBoxHeightMax(getCollisionPartOBB(state, targetPart).toBox3()))) {
//                 return tween.end()
//             }

//             bodyQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
//                 bodyTransform,
//                 // new Quaternion(0, 0, 0, 1).setFromEuler(_e.set(-90 / 180 * Math.PI, 0, 0,
//                 //     // 'YXZ'
//                 // ))
//                 // new Quaternion(-0.707, 0, 0, 0.707)
//                 //     .premultiply(
//                 //         _q.setFromEuler(_e.set(
//                 //             0,
//                 //             // 0,
//                 //             object.y,
//                 //             0,
//                 //             'YXZ'
//                 //         ))
//                 //     )
//                 _q.setFromEuler(_e.set(
//                     0,
//                     object.y,
//                     0,
//                     eulerOrder
//                 ))
//             )

//             state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))

//             writeState(state)

//             return Promise.resolve()
//         })
//         .onComplete(() => {
//             let state = readState()

//             ArticluatedAnimation.removeTween(getAbstractState(state), tween)

//             if (!MilltaryBuilding.isRoughTowardsTarget(state,
//                 _buildRoughFireRay,
//                 allModelQueues, lODQueueIndex, makeBoxHeightMax(getCollisionPartOBB(state, targetPart).toBox3()))) {
//                 return onFailFunc(state).then(writeState)
//             }

//             return onCompleteFunc(state, targetPart).then(writeState)
//         })

//     return tween
// }

// let _getHeadPositionForRotate = (headQueue, lODQueueIndex) => {
//     let position = TransformUtils.getPositionFromMatrix4(headQueue.getWorldMatrix(lODQueueIndex))

//     return position.setY(position.y + 3)
// }

let _rotateTowardsTarget = (state, funcs, name, allModelQueues, lODQueueIndex, targetPart) => {

    let [bodyQueue] = allModelQueues
    let tween1 = MilltaryBuilding.buildBodyTween(state,
        [
            NullableUtils.return_(
                funcs,
            ),
            _buildRoughFireRay
        ],
        name,
        getValue(state),
        bodyQueue, allModelQueues, lODQueueIndex, targetPart)

    state = MilltaryBuilding.addFireTween(state, name, tween1)

    tween1.start()

    ArticluatedAnimation.addTween(getAbstractState(state), tween1)

    return state
}

// let _getRandomCollisionPartCanAttack = (state: state, lODQueueIndex) => {
//     let { emitterLife, emitterSpeed } = TurretMissileRack.getValue(state)

//     return getRandomCollisionPartCanAttack(state, getMissileTurretBodyQueue(state).getWorldMatrix(lODQueueIndex), emitterLife, emitterSpeed)
// }

let _fireMissile = (state: state,
    name, [bodyQueue], lODQueueIndex, targetPart) => {
    let bodyPosition = TransformUtils.getPositionFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex))

    let {
        emitSpeed,
        emitVolume,
        emitPrecision
    } = getArmyValueForAttack(state, getValue(state), bodyPosition)
    let {
        emitterSpeed,
        emitterLife,
        emitterSize,
    } = TurretMissileRack.getValue(state)

    let targetPosition = getTargetBox(state, name, targetPart).getCenter(new Vector3())

    return deferFire(state, (state) => {
        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            SoundManager.buildNeedToPlaySoundData(getMissileRackEmitSoundResourceId(), getIsDebug(state), getVolume(state, emitVolume, bodyPosition, 0.0))
        ))


        state = ArrayUtils.range(0, 3).reduce((state, i) => {
            return emitMissiles(state, _getMissilesStartWorldPosition, i,
                bodyQueue, lODQueueIndex,
                targetPosition,
                name,
                [
                    emitPrecision,
                    emitterSpeed,
                    emitterLife,
                    emitterSize,
                ]
            )
        }, state)

        return Promise.resolve(MilltaryBuilding.fire(state,
            [
                _buildRoughFireRay,
                _rotateTowardsTarget,
                _fireMissile,
                // MilltaryBuilding.getRandomCollisionPartCanAttackWrap(TurretMissileRack.getValue(state), getMissileTurretBodyQueue(state))
                getMissileTurretBodyQueue,
                TurretMissileRack.getValue
            ],
            name, [bodyQueue], lODQueueIndex, targetPart))
    }, name, emitSpeed)
}


export let createFireState = MilltaryBuilding.createFireState(
    [
        getModelAllQueues,
        _buildRoughFireRay,
        _rotateTowardsTarget,
        _fireMissile,
        getMissileTurretBodyQueue,
        TurretMissileRack.getValue
    ],
)



let _setStatus = (state: state, status, index) => {
    let bodyQueue = getMissileTurretBodyQueue(state)
    // let headQueue = MilltaryBuilding.getModelQueueByQueueName(state, buildMissileTurretCategoryName(), buildHeadLODQueueName(buildMissileTurretCategoryName()))
    // let headQueue = MilltaryBuilding.getModelQueueByQueueName(state, buildMissileTurretCategoryName(), buildGunBarrelLODQueueName(buildMissileTurretCategoryName()))

    LOD.setStatusForLODQueue(getAbstractState(state), bodyQueue.names[index], status)
    // LOD.setStatusForLODQueue(getAbstractState(state), headQueue.names[index], status)
    // LOD.setStatusForLODQueue(getAbstractState(state), headQueue.names[index], status)

    return state
}



export let updateQueue = (state: state) => {
    let bodyQueue = getMissileTurretBodyQueue(state)

    HierachyLODQueueUtils.update(state, bodyQueue)
}

export let initialAttributes = (state, name, index) => {
    return MilltaryBuilding.initialAttributes(state, [getValue, _getFullHp], name, index)
}

export let damage = (damageFunc) => {
    return (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
        return damageFunc(state,
            [
                getMissileTurretBodyQueue,
                _getFullHp,
                _setStatus,
                MilltaryBuilding.emitBodyExplode,

                getModelAllQueues,
                _buildRoughFireRay,
                _rotateTowardsTarget,
                _fireMissile,
                // MilltaryBuilding.getRandomCollisionPartCanAttackWrap(TurretMissileRack.getValue(state), getMissileTurretBodyQueue(state))
                TurretMissileRack.getValue
            ],
            getShellGunBarretHitSoundResourceId(),
            getValue(state),

            forceData, fromName, damagePosition, transforms, boxes, names
        )
    }
}

export let update = (state: state) => {
    updateQueue(state)

    return MilltaryBuilding.updateAI(state,
        createFireState,
        getMissileTurretBodyQueue(state),
        TurretMissileRack.getValue(state)
    )
}


export let getPickedTransform = MilltaryBuilding.getPickedTransform(modelName.MissileTurret)


export let handlePickup = MilltaryBuilding.handlePickup

// export let handlePickup = (state: state, name: name) => {
//     LOD.markNeedsUpdate(getAbstractState(state), getMissileTurretBodyQueue(state).name, getModelQueueIndex(state, name), true)

//     return StateMachine.changeAndExecuteState(state, MilltaryBuilding.setStateMachine, MilltaryBuilding.getStateMachine(state, name), MilltaryBuilding.createControlledState(), name, NullableUtils.getEmpty())
// }

export let updateTransform = MilltaryBuilding.updateTransform

export let handlePickdown = MilltaryBuilding.handlePickdown(getMissileTurretBodyQueue)

export let getLocalTransform = MilltaryBuilding.getLocalTransform

export let getBoxForPick = MilltaryBuilding.getBoxForPick



export let getModelQueueIndex = MilltaryBuilding.getModelQueueIndex

export let getHp = MilltaryBuilding.getHp
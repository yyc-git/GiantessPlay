import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getDynamicGroup, getShellGunBarretEmitSoundResourceId, getScene, getShellGunBarretHitSoundResourceId, getState, setState } from "../../../CityScene"
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
import { getShootDirection, updateAI, createMoveState as createMoveStateUtils, setParticleNeedCollisionCheckLoopCount, getParticleNeedCollisionCheckLoopCount, checkParticleCollisionWithStatic, getGirlPositionParrelToArmy, emitShellEmitOrExplode, buildGunBarrelTween, deferFire, getTargetBox } from "../../../utils/ArmyUtils"
import * as Girl from "../../../girl/Girl"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getTransformData, updatePositionTween } from "../../../data/InstancedLOD2Utils"
import { clearTween } from "../../../utils/TweenUtils"

import { getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils } from "../../../girl/PickPoseUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
import * as TurretShellGunBarrel from "../../../weapon/TurretShellGunBarrel"
import { addBox3Helper, isMaxArmySpeed } from "../../../utils/ConfigUtils"
import { makeBoxHeightMax } from "../../../utils/Box3Utils"
import { getLookatQuaternion } from "meta3d-jiehuo-abstract/src/utils/TransformUtils"
import { getArmyValueForAttack } from "../soldier/utils/CommanderUtils"
import { getModelData, modelName } from "../../../army_data/MilltaryBuildingData"
import * as MilltaryBuilding from "./MilltaryBuilding"
import { getShellTurretResourceId } from "../../../army_data/MilltaryBuildingData"

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();

export let getNamePrefix = () => `${MilltaryBuilding.getNamePrefix()}_shellTurret`

export let buildShellTurretCategoryName = getNamePrefix

export let buildShellTurretNamePrefix = (queueName) => {
    return `${queueName}_${getNamePrefix()}`
}

let _getBodyPostfix = () => "body"

let _getHeadPostfix = () => "head"

export let buildBodyLODQueueName = (categoryName) => `*${categoryName}_${_getBodyPostfix()}*`

export let buildHeadLODQueueName = (categoryName) => `*${categoryName}_${_getHeadPostfix()}*`

export let setHierachy = (state: state) => {
    let bodyQueue = getShellTurretBodyQueue(state)
    let headQueue = MilltaryBuilding.getModelQueueByQueueName(state, buildShellTurretCategoryName(), buildHeadLODQueueName(buildShellTurretCategoryName()))
    // let headQueue = MilltaryBuilding.getModelQueueByQueueName(state, buildShellTurretCategoryName(), buildGunBarrelLODQueueName(buildShellTurretCategoryName()))

    bodyQueue.addChild(headQueue)

    return state
}

// export let setData = (state: state, categoryName, queue: HierachyLODQueue) => {
//     return _setState(state, {
//         ..._getState(state),
//         // milltaryVehicleMap: _getState(state).milltaryVehicleMap.set(categoryName, NullableUtils.getWithDefault(
//         // 	NullableUtils.map(data => {
//         // 		return ArrayUtils.push(data, {
//         // 			queue, lod
//         // 		})
//         // 	}, _getState(state).milltaryVehicleMap.get(categoryName)),
//         // 	[{
//         // 		queue, lod
//         // 	}]
//         // )),

//         milltaryVehicleMap: _getState(state).milltaryVehicleMap.set(categoryName, NullableUtils.getWithDefault(
//             _getState(state).milltaryVehicleMap.get(categoryName),
//             Map()
//         ).set(queue.name, queue)
//         ),
//     })
// }

export let getAllMeshData = (group: Group) => {
    let obj = group.children[0]
    return [
        [obj.children[0], buildBodyLODQueueName],
        [
            [obj.children[0].children[0], buildHeadLODQueueName],
            // [obj.children[0].children[0].children[0], buildGunBarrelLODQueueName],
        ]
    ]
}

export let isShellTurret = (name: string) => {
    return name.includes(getNamePrefix())
}

export let getValue = (state:state): armyValue & milltaryValue => {
    return {
        excitement: excitement.High,
        defenseFactor: defenseFactor.High,
        hp: hp.High,

        moveSpeed: speed.Zero,

        rotateSpeed: speed.Middle,

        emitSpeed: emitSpeed.Slow,
        emitVolume: emitVolume.Middle,
        emitPrecision: emitPrecision.High,


        emitterVolume: emitVolume.Big,
    }
}

export let getShellTurretBodyQueue = (state: state): HierachyLODQueue => {
    return MilltaryBuilding.getModelQueueByQueueName(state, buildShellTurretCategoryName(), buildBodyLODQueueName(buildShellTurretCategoryName()))
}

export let getAllModelQueues = (state: state): Array<LODQueue> => {
    return [getShellTurretBodyQueue(state)]
}

export let getModelAllQueues = (state: state): [HierachyLODQueue, HierachyLODQueue] => {
    let bodyQueue = getShellTurretBodyQueue(state)
    let headQueue = MilltaryBuilding.getModelQueueByQueueName(state, buildShellTurretCategoryName(), buildHeadLODQueueName(buildShellTurretCategoryName()))
    // let headQueue = MilltaryBuilding.getModelQueueByQueueName(state, buildShellTurretCategoryName(), buildGunBarrelLODQueueName(buildShellTurretCategoryName()))

    return [bodyQueue, headQueue]
}

let _getAllBodyNames = (state): Array<string> => {
    return MilltaryBuilding.getModelQueueByQueueName(state,
        buildShellTurretCategoryName(),
        buildBodyLODQueueName(buildShellTurretCategoryName())).names
}

export let generateTurrets = (state: state, positions: Array<Vector3>, camp_, attackTarget_) => {
    return MilltaryBuilding.generateTurrets(state,
        [
            buildShellTurretNamePrefix,
            initialAttributes
        ],
        getModelAllQueues(state),
        positions,
        modelName.ShellTurret,
        buildShellTurretCategoryName(),
        getShellTurretBodyQueue(state),
        camp_,
        attackTarget_
    )
}

export let initWhenImportScene = (state: state) => {
    return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getShellTurretResourceId()), Render.getRenderer(getAbstractState(state))).then(turret => {
        let { quaternion } = getModelData(state, modelName.ShellTurret)

        state = MilltaryBuilding.setState(state, {
            ...MilltaryBuilding.getState(state),
            initialQuaternionMap: MilltaryBuilding.getState(state).initialQuaternionMap.set(modelName.ShellTurret,
                quaternion
            ),
        })


        let data = parseArmyVehicleQueues(state,
            [
                buildShellTurretCategoryName,
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
        let localMatrices = data[1] as [Matrix4, Matrix4]
        let allQueues = data[2]

        return MilltaryBuilding.setAllQueueLocalMatrices(state, buildShellTurretCategoryName(), localMatrices)
    })
        // .then(state => {
        //     return MilltaryBuilding.generateTurrets(state,
        //         [
        //             buildShellTurretNamePrefix,
        //             initialAttributes
        //         ],
        //         getModelAllQueues(state),
        //         modelName.ShellTurret,
        //         buildShellTurretCategoryName(),
        //         getShellTurretBodyQueue(state)
        //     )
        // })
        .then(state => {
            let abstractState = getAbstractState(state)

            abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat([MilltaryBuilding.getModelQueueByQueueName(state, buildShellTurretCategoryName(), buildBodyLODQueueName(buildShellTurretCategoryName()))]))


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
    return new Vector3(0, 0, 400).multiply(scale)
}

let _getHeadForwardPointPosition = (bodyQueue, headQueue, lODQueueIndex) => {
    return _getHeadForwardInitialPointPosition(TransformUtils.getScaleFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex)))
        .applyMatrix4(
            headQueue.getWorldMatrix(lODQueueIndex)
        )
}

let _getShellStartLocalPosition = (bodyQueue, headQueue, lODQueueIndex, shellIndex) => {
    let x = 20
    let y = 60
    let z = 280

    let p = [
        new Vector3(x, y, z),
        new Vector3(-x, y, z),
    ]

    return p[shellIndex].multiply(TransformUtils.getScaleFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex)))
        .applyMatrix4(
            headQueue.getWorldMatrix(lODQueueIndex)
        )
}

let _buildRoughFireRay = ([bodyQueue, headQueue], lODQueueIndex) => {
    let headForwardPointPosition = _getHeadForwardPointPosition(bodyQueue, headQueue, lODQueueIndex)

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

// let _buildBodyTween = (state, bodyQueue, allModelQueues, lODQueueIndex, targetPart) => {
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

//             return Promise.resolve()
//         })

//     return tween
// }

let _getHeadPositionForRotate = (headQueue, lODQueueIndex) => {
    let position = TransformUtils.getPositionFromMatrix4(headQueue.getWorldMatrix(lODQueueIndex))

    return position.setY(position.y + 3)
}

let _rotateTowardsTarget = (state, [onCompleteFunc, onFailFunc], name, allModelQueues, lODQueueIndex, targetPart) => {

    let [bodyQueue, headQueue] = allModelQueues
    let tween1 = MilltaryBuilding.buildBodyTween(state,
        [
            NullableUtils.getEmpty(),
            _buildRoughFireRay
        ],
        name,
        getValue(state),
        bodyQueue, allModelQueues, lODQueueIndex, targetPart)
    let tween2 = buildGunBarrelTween(state, [onCompleteFunc, onFailFunc,
        (angle) => -angle,
        (gunBarrelEuler) => gunBarrelEuler.x,
        (object) => {
            return _e.set(
                object.angle,
                0,
                0,
            )
        },
        MilltaryBuilding.isRoughTowardsTarget,
        _buildRoughFireRay,
    ],
        name,
        bodyQueue.name,
        headQueue, allModelQueues,
        _getHeadPositionForRotate(headQueue, lODQueueIndex),

        getValue(state).rotateSpeed,
        lODQueueIndex, targetPart)


    state = MilltaryBuilding.addFireTween(state, name, tween1)
    state = MilltaryBuilding.addFireTween(state, name, tween2)

    tween1.chain(tween2)

    tween1.start()

    ArticluatedAnimation.addTween(getAbstractState(state), tween1)
    ArticluatedAnimation.addTween(getAbstractState(state), tween2)

    return state
}

// let _getRandomCollisionPartCanAttack = (state: state, lODQueueIndex) => {
//     let { emitterLife, emitterSpeed } = TurretShellGunBarrel.getValue(state)

//     return getRandomCollisionPartCanAttack(state, getShellTurretBodyQueue(state).getWorldMatrix(lODQueueIndex), emitterLife, emitterSpeed)
// }

let _fireShell = (state: state,
    name, [bodyQueue, headQueue], lODQueueIndex, targetPart) => {
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
    } = TurretShellGunBarrel.getValue(state)

    let targetPosition = getTargetBox(state, name, targetPart).getCenter(new Vector3())

    return deferFire(state, (state) => {
        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            SoundManager.buildNeedToPlaySoundData(getShellGunBarretEmitSoundResourceId(), getIsDebug(state), getVolume(state, emitVolume, bodyPosition, 0.0))
        ))

        state = ArrayUtils.range(0, 1).reduce((state, i) => {
            let position = _getShellStartLocalPosition(bodyQueue, headQueue, lODQueueIndex, i)

            state = emitShellEmitOrExplode(state, position.toArray(), explodeSize.Big)

            return setAbstractState(state, ParticleManager.emitShell(getAbstractState(state), {
                fromName: name,
                speed: emitterSpeed,
                life: emitterLife,
                size: emitterSize,
                position: position.toArray(),
                // direction: getShootDirection(fireRay.direction, emitPrecision).toArray()
                direction: getShootDirection(
                    targetPosition.clone().sub(position).normalize(),
                    emitPrecision
                ).toArray(),
            },
                getParticleNeedCollisionCheckLoopCount(state)
            ))
        }, state)

        return Promise.resolve(MilltaryBuilding.fire(state,
            [
                _buildRoughFireRay,
                _rotateTowardsTarget,
                _fireShell,
                getShellTurretBodyQueue,
                TurretShellGunBarrel.getValue
            ],
            name, [bodyQueue, headQueue], lODQueueIndex, targetPart))
    }, name, emitSpeed)
}


export let createFireState = MilltaryBuilding.createFireState(
    [
        getModelAllQueues,
        _buildRoughFireRay,
        _rotateTowardsTarget,
        _fireShell,
        // _getRandomCollisionPartCanAttack
        getShellTurretBodyQueue,
        TurretShellGunBarrel.getValue
    ]
)



let _setStatus = (state: state, status, index) => {
    let bodyQueue = getShellTurretBodyQueue(state)
    let headQueue = MilltaryBuilding.getModelQueueByQueueName(state, buildShellTurretCategoryName(), buildHeadLODQueueName(buildShellTurretCategoryName()))
    // let headQueue = MilltaryBuilding.getModelQueueByQueueName(state, buildShellTurretCategoryName(), buildGunBarrelLODQueueName(buildShellTurretCategoryName()))

    LOD.setStatusForLODQueue(getAbstractState(state), bodyQueue.names[index], status)
    LOD.setStatusForLODQueue(getAbstractState(state), headQueue.names[index], status)
    // LOD.setStatusForLODQueue(getAbstractState(state), headQueue.names[index], status)

    return state
}



export let updateQueue = (state: state) => {
    let bodyQueue = getShellTurretBodyQueue(state)

    HierachyLODQueueUtils.update(state, bodyQueue)
}

export let initialAttributes = (state, name, index) => {
    return MilltaryBuilding.initialAttributes(state, [getValue, _getFullHp], name, index)
}

export let damage = (damageFunc) => {
    return (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
        return damageFunc(state,
            [
                getShellTurretBodyQueue,
                _getFullHp,
                _setStatus,
                MilltaryBuilding.emitBodyExplode,

                getModelAllQueues,
                _buildRoughFireRay,
                _rotateTowardsTarget,
                _fireShell,
                TurretShellGunBarrel.getValue,
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
        getShellTurretBodyQueue(state),
        TurretShellGunBarrel.getValue(state)
    )
}


export let getPickedTransform = MilltaryBuilding.getPickedTransform(modelName.ShellTurret)


export let handlePickup = MilltaryBuilding.handlePickup

// export let handlePickup = (state: state, name: name) => {
//     LOD.markNeedsUpdate(getAbstractState(state), getShellTurretBodyQueue(state).name, getModelQueueIndex(state, name), true)

//     return StateMachine.changeAndExecuteState(state, MilltaryBuilding.setStateMachine, MilltaryBuilding.getStateMachine(state, name), MilltaryBuilding.createControlledState(), name, NullableUtils.getEmpty())
// }

export let updateTransform = MilltaryBuilding.updateTransform

export let handlePickdown = MilltaryBuilding.handlePickdown(getShellTurretBodyQueue)

export let getLocalTransform = MilltaryBuilding.getLocalTransform

export let getBoxForPick = MilltaryBuilding.getBoxForPick



export let getModelQueueIndex = MilltaryBuilding.getModelQueueIndex

export let getHp = MilltaryBuilding.getHp
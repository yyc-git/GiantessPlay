import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
import { getDynamicGroup, getMissileRackEmitSoundResourceId, getScene, getShellGunBarretHitSoundResourceId, getState, setState } from "../../../CityScene"
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
import { getShootDirection, updateAI, createMoveState as createMoveStateUtils, setParticleNeedCollisionCheckLoopCount, getParticleNeedCollisionCheckLoopCount, checkParticleCollisionWithStatic, getGirlPositionParrelToArmy, emitShellEmitOrExplode, deferFire, emitMissiles, getTargetBox } from "../../../utils/ArmyUtils"
import * as Girl from "../../../girl/Girl"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getTransformData, updatePositionTween } from "../../../data/InstancedLOD2Utils"
import { clearTween } from "../../../utils/TweenUtils"

import { getLocalTransform as getLocalTransformUtils, getBoxForPick as getBoxForPickUtils } from "../../../girl/PickPoseUtils"
import { getGiantessTransformFunc, getPickTransformPrefix } from "../../../utils/SkeletonUtils"
import * as MissileRack from "../../../weapon/MissileRack"
import { addBox3Helper, isMaxArmySpeed } from "../../../utils/ConfigUtils"
import { makeBoxHeightMax } from "../../../utils/Box3Utils"
import { getLookatQuaternion } from "meta3d-jiehuo-abstract/src/utils/TransformUtils"
import { getArmyValueForAttack } from "../soldier/utils/CommanderUtils"
import { getMissileVehicleResourceId, getModelData, modelName } from "../../../army_data/MilltaryVehicleData"
import * as MilltaryVehicle from "./MilltaryVehicle"
import { Console } from "meta3d-jiehuo-abstract"
import { getCurrentScene } from "meta3d-jiehuo-abstract/src/scene/Scene"

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();
const _v1_2 = new Vector2();


export let getNamePrefix = () => `${MilltaryVehicle.getNamePrefix()}_missileVehicle`

export let buildMissileVehicleCategoryName = getNamePrefix

export let buildMissileVehicleNamePrefix = (queueName) => {
    return `${queueName}_${getNamePrefix()}`
}

// export let buildWholeLODQueueName = (categoryName) => `${categoryName}_whole`

let _getBodyPostfix = () => "body"

let _getTurretPostfix = () => "turret"

let _getMissilePostfix = () => "missile"

export let buildBodyLODQueueName = (categoryName) => `*${categoryName}_${_getBodyPostfix()}*`

export let buildTurretLODQueueName = (categoryName) => `*${categoryName}_${_getTurretPostfix()}*`

export let buildMissileLODQueueName = (categoryName) => `*${categoryName}_${_getMissilePostfix()}*`

// let _getTurretNameByBodyName = (bodyName) => {
//     return bodyName.replace(_getBodyPostfix(), _getTurretPostfix())
// }

// let _getMissileNameByBodyName = (bodyName) => {
//     return bodyName.replace(_getBodyPostfix(), _getMissilePostfix())
// }

// let _getQueueNameFromName = (name) => {
//     return name.match(/^.*(\*.+\*)/)[1]
// }

export let setHierachy = (state: state) => {
    let bodyQueue = getMissileVehicleBodyQueue(state)
    let turretQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildMissileVehicleCategoryName(), buildTurretLODQueueName(buildMissileVehicleCategoryName()))
    let missileQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildMissileVehicleCategoryName(), buildMissileLODQueueName(buildMissileVehicleCategoryName()))

    bodyQueue.addChild(turretQueue)
    turretQueue.addChild(missileQueue)

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
            [obj.children[0].children[0], buildTurretLODQueueName],
            [obj.children[0].children[0].children[0], buildMissileLODQueueName],
        ]
    ]
}

export let isMissileVehicle = (name: string) => {
    return name.includes(getNamePrefix())
}

export let getValue = (state:state): armyValue & milltaryValue => {
    return {
        excitement: excitement.High,
        defenseFactor: defenseFactor.High,
        hp: hp.Low,
        // hp: 15000,

        moveSpeed: speed.Low,

        rotateSpeed: speed.Middle,
        // speed: 3,


        // TODO update
        // emitSpeed: emitSpeed.Middle,
        emitSpeed: emitSpeed.Slow,
        emitVolume: emitVolume.Middle,
        emitPrecision: emitPrecision.High,


        emitterVolume: emitVolume.Big,
    }
}

export let getMissileVehicleBodyQueue = (state: state): HierachyLODQueue => {
    return MilltaryVehicle.getModelQueueByQueueName(state, buildMissileVehicleCategoryName(), buildBodyLODQueueName(buildMissileVehicleCategoryName()))
}

export let getAllModelQueues = (state: state): Array<LODQueue> => {
    return [getMissileVehicleBodyQueue(state)]
}

export let getModelAllQueues = (state: state): [HierachyLODQueue, HierachyLODQueue, HierachyLODQueue] => {
    // return ArrayUtils.flatten(_getState(state).milltaryVehicleMap.valueSeq().toArray().map(data => {
    // 	return data.valueSeq().toArray().map(({ queue }) => queue)
    // }))


    let bodyQueue = getMissileVehicleBodyQueue(state)
    let turretQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildMissileVehicleCategoryName(), buildTurretLODQueueName(buildMissileVehicleCategoryName()))
    let missileQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildMissileVehicleCategoryName(), buildMissileLODQueueName(buildMissileVehicleCategoryName()))

    return [bodyQueue, turretQueue, missileQueue]
}

// let _getAllModelAllQueues = (state: state): Array<[HierachyLODQueue, HierachyLODQueue, HierachyLODQueue]> => {
//     return [getModelAllQueues(state)]
// }

// let _getModelQueueByName = (state: state, name: string) => {
//     // let categoryName
//     // if (name.includes(getMissileVehicleNamePrefix())) {
//     // 	categoryName = buildMissileVehicleCategoryName()
//     // }
//     // else {
//     // 	throw new Error("err")
//     // }

//     // return MilltaryVehicle.getModelQueueByQueueName(state, categoryName, _getQueueNameFromName(name))
//     return LOD.getLODQueue(getAbstractState(state), name)
// }

// let _getModelLOD = (state: state, name: string) => {
// 	let categoryName
// 	if (name.includes(getMissileVehicleNamePrefix())) {
// 		categoryName = buildMissileVehicleCategoryName()
// 	}
// 	// else if (name.includes(getn2NamePrefix())) {
// 	// 	categoryName = buildn2CategoryName()
// 	// }
// 	else {
// 		throw new Error("err")
// 	}

// 	return NullableUtils.getExn(_getState(state).milltaryVehicleMap.get(categoryName)).lod
// }

// let _getAllLODs = (state: state) => {
// 	return [NullableUtils.getExn(_getState(state).cityzeMissileVehicleLod), NullableUtils.getExn(_getState(state).cityzen2Lod)]
// }

// let _getAllLevelInstancedMeshes = (state: state) => {
// 	return _getAllLODs(state).reduce((result, lod) => {
// 		return result.concat(lod.getAllLevelInstancedMeshes())
// 	}, [])
// }


let _getAllBodyNames = (state): Array<string> => {
    return MilltaryVehicle.getModelQueueByQueueName(state,
        buildMissileVehicleCategoryName(),
        buildBodyLODQueueName(buildMissileVehicleCategoryName())).names
}

export let initWhenImportScene = (state: state) => {
    return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getMissileVehicleResourceId()), Render.getRenderer(getAbstractState(state))).then(missileVehicle => {
        let { quaternion, boxFactor } = getModelData(state, modelName.MissileVehicle)

        state = MilltaryVehicle.setState(state, {
            ...MilltaryVehicle.getState(state),
            initialQuaternionMap: MilltaryVehicle.getState(state).initialQuaternionMap.set(modelName.MissileVehicle,
                quaternion
            ),
        })


        let data = parseArmyVehicleQueues(state,
            [
                buildMissileVehicleCategoryName,
                getAllMeshData,
                MilltaryVehicle.setData,
                setHierachy,
            ],
            missileVehicle.scene,
            boxFactor,
            500,
            true,
            getScene(state)
        )
        state = data[0]
        let localMatrices = data[1] as [Matrix4, Matrix4, Matrix4]
        let allQueues = data[2]

        return MilltaryVehicle.setAllQueueLocalMatrices(state, buildMissileVehicleCategoryName(), localMatrices)
    })
        .then(state => {
            let abstractState = getAbstractState(state)

            abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat([MilltaryVehicle.getModelQueueByQueueName(state, buildMissileVehicleCategoryName(), buildBodyLODQueueName(buildMissileVehicleCategoryName()))]))


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


let _buildRoughFireRay = ([bodyQueue, turretQueue, missileQueue], lODQueueIndex) => {
    let position = _getTurretForwardPointPosition(missileQueue, lODQueueIndex)

    let turretPosition = MilltaryVehicle.getTurretPosition(turretQueue, lODQueueIndex)

    return new Ray(
        turretPosition,
        position.clone().sub(turretPosition).normalize()
    )
}

// let _isAccurateTowardsTarget = (state: state, name) => {
// 	return NullableUtils.getWithDefault(
// 		NullableUtils.map(
// 			fireRay => {
// 				return fireRay.intersectsBox(getGirlBox(state))
// 			},
// 			_getState(state).fireRayMap.get(name),
// 		),
// 		false
// 	)
// }

// let _getRotateSpeed = () => getValue(state).rotateSpeed

// let _buildTurretTween = (state, [onCompleteFunc, onFailFunc], [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart) => {
//     // let turretWorldMatrix = turretQueue.getWorldMatrix(lODQueueIndex)
//     // let turretPosition = TransformUtils.getPositionFromMatrix4(turretWorldMatrix).setY(0)
//     let turretPosition = MilltaryVehicle.getTurretPosition(turretQueue, lODQueueIndex)


//     // let girlPosition = getGirlPositionParrelToArmy(state, 0, collisionPart.Torso)
//     // let girlPosition = getCollisionPartCenter(state, targetPart).clone().setY(0)
//     let girlPosition = getPositionParrelToObj(getCollisionPartCenter(state, targetPart).clone().setY(0), turretPosition.y)
//     // let girlPosition = getCollisionPartCenter(state, targetPart).clone().setY(0)

//     let { emitPrecision } = getArmyValueForAttack(state, getValue(state), turretPosition)

//     // let turretLookatEuler = _getLookatEuler(
//     //     turretPosition,
//     //     // girlPosition,
//     //     (girlPosition.clone().add(_v1.set(
//     //         emitPrecision * NumberUtils.getRandomValue1(),
//     //         0,
//     //         emitPrecision * NumberUtils.getRandomValue1(),
//     //     ))),
//     //     getIsDebug(state)
//     // )

//     let turretLookatQuaternion = TransformUtils.getLookatQuaternion(
//         turretPosition,
//         // girlPosition,
//         (girlPosition.clone().add(_v1.set(
//             emitPrecision * NumberUtils.getRandomValue1(),
//             0,
//             emitPrecision * NumberUtils.getRandomValue1(),
//         ))),
//         // getIsDebug(state)
//     )


//     let turretTransform = turretQueue.transforms[lODQueueIndex].clone()


//     // let turretEuler = TransformUtils.getRotationEulerFromMatrix4(turretTransform)
//     let turretEuler = TransformUtils.getRotationEulerFromMatrix4(turretTransform, 'YXZ')
//     // if (turretEuler.x !== 0 || turretEuler.y !== 0) {
//     // if (turretEuler.x !== 0 || turretEuler.z !== 0) {
//     //     throw new Error("err")
//     // }


//     let turretQuaternion = TransformUtils.getRotationQuaternionFromMatrix4(turretTransform)

//     // Console.log(
//     // 	"data:",
//     // 	turretLookatEuler.y,
//     // 	turretEuler.z,
//     // 	lODQueueIndex,
//     // 	turretPosition,
//     // )


//     let bodyTransform = bodyQueue.transforms[lODQueueIndex].clone()
//     // let bodyEuler = TransformUtils.getRotationEulerFromMatrix4(bodyTransform)

//     // // turretLookatEuler.set(turretLookatEuler.x, turretLookatEuler.y - bodyEuler.z, turretLookatEuler.z)
//     // turretLookatEuler.set(turretLookatEuler.x, turretLookatEuler.y - bodyEuler.y, turretLookatEuler.z)



//     // turretLookatEuler = _fixGimbalLock(turretLookatEuler, turretEuler)






//     // let bodyQuaternion = TransformUtils.getRotationQuaternionFromMatrix4(bodyTransform)


//     // // let turretNeedRotateQuaternion = turretLookatQuaternion.clone().premultiply(
//     // //     bodyQuaternion.clone().invert()
//     // // )
//     // let turretNeedRotateQuaternion = turretLookatQuaternion.clone().multiply(
//     //     bodyQuaternion.clone().invert()
//     // )
//     // let turretNeedRotateEuler = new Euler().setFromQuaternion(turretNeedRotateQuaternion)


//     let bodyWorldTransform = bodyQueue.getWorldMatrix(lODQueueIndex).clone()

//     let turretWorldTransform = turretQueue.getWorldMatrix(lODQueueIndex).clone()
//     let turretLookatWorldMatrix = TransformUtils.setQuaternionToMatrix4(
//         turretWorldTransform,
//         turretLookatQuaternion
//     )
//     let turretLookatLocalMatrix = bodyWorldTransform.clone().invert().multiply(
//         turretLookatWorldMatrix
//     )
//     // let turretNeedRotateQuaternion = TransformUtils.getRotationEulerFromMatrix4(turretLookatLocalMatrix)


//     let turretNeedRotateEuler = TransformUtils.getRotationEulerFromMatrix4(turretLookatLocalMatrix, 'YXZ')

//     // Console.log("e: ", turretNeedRotateEuler)

//     // turretNeedRotateEuler = _fixGimbalLock(turretNeedRotateEuler, turretEuler)




//     let object = {
//         // x: 0,
//         // y: turretEuler.z,

//         y: turretEuler.y,
//     }
//     let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)



//         // bodyQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
//         //     bodyTransform,
//         //     new Quaternion()
//         // )






//         // turretQueue.transforms[lODQueueIndex] = turretLookatLocalMatrix
//         // turretQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
//         //     turretTransform,
//         //     _q.setFromEuler(_e.set(
//         //         0,
//         //         turretNeedRotateEuler.y,
//         //         0,
//         //     ))
//         // )


//         // state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))




//         .to({
//             // x: turretLookatEuler.x,


//             // y: turretLookatEuler.y,
//             // x: turretNeedRotateQuaternion.x,
//             // y: turretNeedRotateQuaternion.y,
//             // z: turretNeedRotateQuaternion.z,
//             // w: turretNeedRotateQuaternion.w,

//             y: turretNeedRotateEuler.y,



//             // z: turretLookatEuler.z,
//             // }, _v1.set(turretLookatEuler.x, turretLookatEuler.y, turretLookatEuler.z).lengthSq() * 10000)
//             // }, Math.abs(turretLookatEuler.y - turretEuler.z) * 3000)
//             // }, Math.abs(turretLookatEuler.y - turretEuler.z) * 1000)
//             // }, Math.abs(turretLookatEuler.y - turretEuler.z) * 3000)
//             // }, Math.abs(turretLookatEuler.y - turretEuler.z) * 1000 * moveSpeed)
//             // }, Math.abs(turretLookatEuler.y - turretEuler.z) * 1000 * _getRotateSpeed())
//             // }, Math.abs(turretLookatEuler.y - turretEuler.y) * 1000 * _getRotateSpeed())
//         }, Math.abs(turretNeedRotateEuler.y - turretEuler.y) * 1000 * _getRotateSpeed())

//         // }, Math.abs(turretNeedRotateQuaternion.length() - turretQuaternion.length()) * 1000 * _getRotateSpeed())
//         // }, 2 * 1000 * _getRotateSpeed())

//         .onUpdate(() => {
//             let state = readState()

//             let box = makeBoxHeightMax(getCollisionPartOBB(state, targetPart).toBox3())


//             if (_isRoughTowardsTarget(state, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, box)) {
//                 return tween.end()
//             }


//             turretQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
//                 turretTransform,
//                 // _q.setFromEuler(_e.set(
//                 // 	object.x, object.y, object.z
//                 // )).multiply(

//                 // )

//                 // _q.setFromEuler(_e.set(
//                 // 	object.x + bodyEuler.x, object.y
//                 // + bodyEuler.y
//                 // 	, object.z + bodyEuler.z
//                 // ))


//                 _q.setFromEuler(_e.set(
//                     // object.x,
//                     0,
//                     // object.z,
//                     // 0,
//                     object.y,
//                     0,
//                     'YXZ'
//                 ))
//                 // new Quaternion(object.x, object.y, object.z, object.w)

//                 // new Quaternion().setFromEuler(new Euler().set(
//                 // 	// object.x,
//                 // 	0,
//                 // 	// object.z,
//                 // 	0,
//                 // 	object.y,
//                 // ))
//             )

//             state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))

//             writeState(state)

//             return Promise.resolve()
//         })
//         .onComplete(() => {
//             let state = readState()

//             ArticluatedAnimation.removeTween(getAbstractState(state), tween)


//             let box = makeBoxHeightMax(getCollisionPartOBB(state, targetPart).toBox3())

//             // if (!_isRoughTowardsTarget(state, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, box)) {
//             //     return onFailFunc(state).then(writeState)
//             // }

//             // return onCompleteFunc(state, targetPart).then(writeState)
//             return onFailFunc(state).then(writeState)
//         })

//     return tween
// }

let _getTurretForwardPointInitialPosition = () => {
    // return new Vector3(-10, 0, 0).multiply(missileVehicleScale)
    // return new Vector3(-10, 0, 0)
    return new Vector3(0, 0, 5)
    // return new Vector3(-400, 0, 30).multiply(missileVehicleScale)
}

let _getTurretForwardPointPosition = (missileQueue, lODQueueIndex) => {
    return _getTurretForwardPointInitialPosition()
        .applyMatrix4(
            missileQueue.getWorldMatrix(lODQueueIndex)
        )
}

let _getMissilesStartWorldPosition = (missileQueue, lODQueueIndex, missileIndex): [Vector3, Vector3] => {
    let x = 0.9
    let y1 = 0.15
    let y2 = 0.5
    let z = 0.3 - 0.9

    let pStart = [
        new Vector3(x, y1, z),
        new Vector3(0, y1, z),

        new Vector3(x, y2, z),
        new Vector3(0, y2, z),
    ]


    z = 0.3

    let pEnd = [
        new Vector3(x, y1, z),
        new Vector3(0, y1, z),

        new Vector3(x, y2, z),
        new Vector3(0, y2, z),
    ]


    return [
        pStart[missileIndex]
            .applyMatrix4(
                missileQueue.getWorldMatrix(lODQueueIndex)
            ),
        pEnd[missileIndex]
            .applyMatrix4(
                missileQueue.getWorldMatrix(lODQueueIndex)
            )
    ]
}

let _getMissilesExplodeLocalPosition = (missileQueue, lODQueueIndex, missileIndex) => {
    let x = 0.9
    let y1 = 0.15
    let y2 = 0.5
    let z = -0.7

    let p = [
        new Vector3(x, y1, z),
        new Vector3(0, y1, z),

        new Vector3(x, y2, z),
        new Vector3(0, y2, z),
    ]

    return p[missileIndex]
        .applyMatrix4(
            missileQueue.getWorldMatrix(lODQueueIndex)
        )
}


// let _buildMissileTween = (state, [onCompleteFunc, onFailFunc], name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart) => {
//     let missileWorldMatrix = missileQueue.getWorldMatrix(lODQueueIndex)
//     let missilePosition = TransformUtils.getPositionFromMatrix4(missileWorldMatrix)
//     let missilePositionY = missilePosition.y



//     // let girlPosition = getGirlPosition(state).clone().setY(0)

//     // let offsetFactor = 1
//     // let targetY = offsetFactor * Math.random() * getGirlScale(state) + missilePositionY

//     // let targetY = Math.random() * getActualHeight(state) + missilePositionY

//     // let girlPosition = getCollisionPartCenter(state, targetPart).clone().setY(0)
//     let collisionPartCenter = getCollisionPartCenter(state, targetPart).clone()

//     let targetY = collisionPartCenter.y

//     let missileLookatEulerZ = NumberUtils.clamp(Math.atan(
//         Math.max(targetY - missilePositionY, 0.1) / (missilePosition.setY(0).distanceTo(collisionPartCenter.setY(0)))
//     ), 0, Math.PI / 2)

//     let missileTransform = missileQueue.transforms[lODQueueIndex].clone()


//     let missileEuler = TransformUtils.getRotationEulerFromMatrix4(missileTransform)
//     if (missileEuler.z !== 0 || missileEuler.x !== 0) {
//         throw new Error("err")
//     }

//     // Console.log(
//     // 	"target:",
//     // 	missileLookatEuler.y,
//     // )

//     let object = {
//         z: missileEuler.y,
//         // z: 0
//     }
//     let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
//         .to({
//             z: missileLookatEulerZ
//             // }, Math.abs(missileLookatEulerZ - missileEuler.y) * 3000)
//             // }, Math.abs(missileLookatEulerZ - missileEuler.y) * 1000 * getValue(state).moveSpeed)
//             // }, Math.abs(missileLookatEulerZ - missileEuler.y) * 1000 * _getRotateSpeed())
//         }, Math.abs(missileLookatEulerZ - missileEuler.y) * 1000 * _getRotateSpeed())
//         // }, Math.abs(missileLookatEulerZ ) * 3000)
//         .onUpdate(() => {
//             missileQueue.transforms[lODQueueIndex] = TransformUtils.setQuaternionToMatrix4(
//                 missileTransform,

//                 _q.setFromEuler(_e.set(
//                     0,
//                     object.z,
//                     0,
//                 ))
//             )


//             let state = readState()

//             state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), bodyQueue.name, lODQueueIndex, true))

//             writeState(state)

//             return Promise.resolve()
//         })
//         .onComplete(() => {
//             let state = readState()

//             ArticluatedAnimation.removeTween(getAbstractState(state), tween)



//             // if (_isRoughTowardsTarget(state, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart)) {
//             // 	// let originPosition = _getTurretForwardPointInitialPosition(TransformUtils.getScaleFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex)))
//             // 	// 	// .applyQuaternion(
//             // 	// 	// 	TransformUtils.getRotationQuaternionFromMatrix4(
//             // 	// 	// 		missileQueue.transforms[lODQueueIndex]
//             // 	// 	// 	)
//             // 	// 	// )
//             // 	// 	// .add(missilePosition)
//             // 	// 	.applyMatrix4(
//             // 	// 		missileQueue.getWorldMatrix(lODQueueIndex)
//             // 	// 	)


//             // 	// let girlPosition = getCollisionPartCenter(state, targetPart).clone().setY(0)

//             // 	// let targetPosition = new Vector3(girlPosition.x, targetY, girlPosition.z)

//             // 	state = _setState(state, {
//             // 		..._getState(state),
//             // 		fireRayMap: _getState(state).fireRayMap.set(name,
//             // 			// 	 new Ray(
//             // 			// 	originPosition,
//             // 			// 	targetPosition.sub(originPosition)
//             // 			// 		.normalize()
//             // 			// )
//             // 			_buildRoughFireRay([bodyQueue, turretQueue, missileQueue], lODQueueIndex)

//             // 		)
//             // 	})
//             // }


//             if (!_isRoughTowardsTarget(state, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, getCollisionPartOBB(state, targetPart).toBox3())) {
//                 return onFailFunc(state).then(writeState)
//             }

//             return onCompleteFunc(state, targetPart).then(writeState)
//         })

//     // ArticluatedAnimation.addTween(getAbstractState(state), tween)

//     // tween.start()

//     // return state
//     return tween
// }

let _rotateTowardsTarget = (state, funcs, name, allModelQueues, lODQueueIndex, targetPart) => {
    // let _onStartFunc = (tween) => {
    // 	writeState(_addFireTween(readState(), name, tween))

    // 	return Promise.resolve()
    // }

    // let tween1 = _buildTurretTween(state, funcs, allModelQueues, lODQueueIndex, targetPart)
    let [bodyQueue, turretQueue, _] = allModelQueues
    let tween1 = MilltaryVehicle.buildTurretTween(state,
        [
            _buildRoughFireRay,
            NullableUtils.return_(funcs),
        ],
        name,
        turretQueue, allModelQueues,

        bodyQueue.getWorldMatrix(lODQueueIndex),
        bodyQueue.name,
        lODQueueIndex, targetPart,
        getValue(state)
    )
    // let tween2 = _buildMissileTween(state, funcs, name, allModelQueues, lODQueueIndex, targetPart)


    // tween1.onStart(() => _onStartFunc(tween1))
    // tween2.onStart(() => _onStartFunc(tween2))
    state = MilltaryVehicle.addFireTween(state, name, tween1)
    // state = _addFireTween(state, name, tween2)

    // tween1.chain(tween2)

    tween1.start()

    ArticluatedAnimation.addTween(getAbstractState(state), tween1)
    // ArticluatedAnimation.addTween(getAbstractState(state), tween2)


    // state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
    //     return funcs[1](state, targetPart)
    // }, 5))


    return state
}

// let _playFireAnimation = (
//     onCompleteFunc, state: state, [bodyQueue, turretQueue, missileQueue], lODQueueIndex
// ) => {
//     let missileTransform = missileQueue.transforms[lODQueueIndex]
//     let missileLocalPosition = TransformUtils.getPositionFromMatrix4(missileTransform)
//     let missileBox = missileQueue.boxes[lODQueueIndex]

//     let articluatedAnimationData = findArticluatedAnimationData(state, articluatedAnimationName.MissileVehicle_Fire)
//     playArticluatedAnimation(state,
//         [
//             object => {
//                 missileTransform.setPosition(object.x, missileLocalPosition.y, missileLocalPosition.z)

//                 let state = readState()

//                 state = setAbstractState(state, LOD.markNeedsUpdate(getAbstractState(state), lODQueueIndex, true))

//                 writeState(state)

//             },
//             state => {
//                 return missileLocalPosition.x
//             },
//             state => {
//                 // let damageRadio = DamageUtils.computeDamageRadio(damage, getFullHpFunc())


//                 let width = missileBox.getSize(_v1).x

//                 let amplitude = DamageUtils.clamp(width / 8, width / 10)

//                 // let timeScalar = DamageUtils.getStressingTimeScalar(damageRadio)
//                 // let timeScalar = 0.3 * getValue(state).moveSpeed
//                 let timeScalar = 0.3 * _getRotateSpeed()


//                 return [missileLocalPosition.x, amplitude, timeScalar]
//             },
//             (allTweens) => {
//                 DamageUtils.handleTweenRepeatComplete2(onCompleteFunc, allTweens, articluatedAnimationData.repeatCount)
//             }
//         ],
//         articluatedAnimationData
//     )

//     return state
// }

// export let addShellExplodeSound = (state: state, position: Vector3) => {
//     state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
//         SoundManager.buildNeedToPlaySoundData(getShellGunBarretHitSoundResourceId(), getIsDebug(state), getVolume(state, getValue(state).emitterVolume,
//             position, 0
//         ))
//     ))

//     return state
// }


// let _fireMissiles = (state: state, name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart) => {
//     let bodyPosition = TransformUtils.getPositionFromMatrix4(bodyQueue.getWorldMatrix(lODQueueIndex))

//     let {
//         emitSpeed,
//         emitVolume,
//         emitPrecision
//     } = getArmyValueForAttack(state, getValue(state), bodyPosition)
//     let {
//         emitterSpeed,
//         emitterLife,
//         emitterSize,
//     } = MissileRack.getValue(state)

//     state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
//         SoundManager.buildNeedToPlaySoundData(getEmmitShellSoundResourceId(), getIsDebug(state), getVolume(state, emitVolume, bodyPosition, 0.0))
//     ))

//     // let fireRay = NullableUtils.getExn(_getState(state).fireRayMap.get(name))
//     let fireRay = _buildRoughFireRay([bodyQueue, turretQueue, missileQueue], lODQueueIndex)


//     state = setAbstractState(state, ParticleManager.emitShell(getAbstractState(state), {
//         fromName: name,
//         speed: emitterSpeed,
//         life: emitterLife,
//         size: emitterSize,
//         // position: fireRay.origin.toArray(),
//         position: _getTurretForwardPointPosition(bodyQueue, missileQueue, lODQueueIndex).toArray(),
//         direction: getShootDirection(fireRay.direction, emitPrecision).toArray()
//     },
//         getParticleNeedCollisionCheckLoopCount(state)
//     ))

//     state = emitShellEmitOrExplode(state, fireRay.origin.toArray())


//     return _playFireAnimation(state => {
//         state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
//             // Console.log("begin")
//             return Promise.resolve(_fire(state, name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart))
//             // return Promise.resolve(state)
//         }, emitSpeed))
//         // }, 1))
//         // }, emitSpeed*4))

//         return Promise.resolve(state)
//     }, state, [bodyQueue, turretQueue, missileQueue], lODQueueIndex)
// }

// let _fire = (state: state, name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart) => {
//     if (!StateMachine.isState(MilltaryVehicle.getStateMachine(state, name), objectStateName.Attack)) {
//         return state
//     }

//     // if (!_isAccurateTowardsTarget(state, name)) {
//     // if (!_isRoughTowardsTarget(state, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, getSmallGirlBox(state))) {

//     if (!_isRoughTowardsTarget(state, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, makeBoxHeightMax(getCollisionPartOBB(state, targetPart).toBox3()))) {
//         // let targetPartCenter = getCollisionPartCenter(state, getRandomCollisionPart())
//         return _rotateTowardsTarget(state, [(state, targetPart) => {
//             // state = _fireMissiles(state, name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart)

//             return Promise.resolve(state)
//         }, (state) => {
//             // state = _fire(state, name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart)
//             state = _fire(state, name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, getRandomCollisionPart())

//             return Promise.resolve(state)
//         }], name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart)
//     }

//     // return _fireMissiles(state, name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart)
//     return Promise.resolve(state)
// }

// export let createFireState = (): fsm_state<state> => {
//     return {
//         name: objectStateName.Attack,
//         enterFunc: (state) => Promise.resolve(state),
//         executeFunc: (state, name) => {
//             let lODQueueIndex = MilltaryVehicle.getModelQueueIndex(state, name)


//             let targetPart = getRandomCollisionPart()

//             state = _fire(state, name, getModelAllQueues(state), lODQueueIndex, targetPart)

//             return Promise.resolve(state)
//         },
//         exitFunc: (state: state, stateMachine) => {
//             let name = stateMachine.name

//             state = clearTween(state, [
//                 _hasFireTween,
//                 _getFireTween,
//                 _removeFireTween
//             ], name)



//             return Promise.resolve(state)
//         }
//     }
// }

let _fireMissiles = (state: state,
    name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart) => {
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
    } = MissileRack.getValue(state)

    let missileName = missileQueue.names[lODQueueIndex]

    LOD.setStatusForLODQueue(getAbstractState(state), missileName, buildStatus(false, false, true))


    let targetPosition = getTargetBox(state, name, targetPart).getCenter(new Vector3())

    return deferFire(state, (state) => {
        LOD.setStatusForLODQueue(getAbstractState(state), missileName, buildStatus(false, false, false))

        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            SoundManager.buildNeedToPlaySoundData(getMissileRackEmitSoundResourceId(), getIsDebug(state), getVolume(state, emitVolume, bodyPosition, 0.0))
        ))


        state = ArrayUtils.range(0, 3).reduce((state, i) => {
            return emitMissiles(state, _getMissilesStartWorldPosition, i,
                missileQueue, lODQueueIndex,
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


        state = setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
            LOD.setStatusForLODQueue(getAbstractState(state), missileName, buildStatus(false, false, true))

            return Promise.resolve(MilltaryVehicle.fire(state,
                [
                    _buildRoughFireRay,
                    _rotateTowardsTarget,
                    _fireMissiles,
                    getMissileVehicleBodyQueue,
                    MissileRack.getValue
                ],
                name, [bodyQueue, turretQueue, missileQueue], lODQueueIndex, targetPart))
        }, 50, name))

        return Promise.resolve(state)
    }, name, emitSpeed)
}



export let createFireState = MilltaryVehicle.createFireState(
    [
        getModelAllQueues,
        _buildRoughFireRay,
        _rotateTowardsTarget,
        _fireMissiles,
        getMissileVehicleBodyQueue,
        MissileRack.getValue
    ]
)


let _getInitialEulerForTweenToFaceNegativeX = () => {
    // return new Euler(-Math.PI / 2, 0, 0)
    return new Euler(0, -Math.PI / 2, 0)
}

export let createMoveState = (state) => {
    return MilltaryVehicle.createMoveState(
        [
            getMissileVehicleBodyQueue,
            _getInitialEulerForTweenToFaceNegativeX
        ],
        getValue(state),
        modelName.MissileVehicle
    )
}

// export let createStressingState = () => {
//     return MilltaryVehicle.createStressingState(
//         [
//             getMissileVehicleBodyQueue,
//             _getFullHp,

//             getModelAllQueues,
//             _buildRoughFireRay,
//             _rotateTowardsTarget,
//             _fireMissiles
//         ],
//     )
// }


let _setStatus = (state: state, status, index) => {
    let bodyQueue = getMissileVehicleBodyQueue(state)
    let turretQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildMissileVehicleCategoryName(), buildTurretLODQueueName(buildMissileVehicleCategoryName()))
    let missileQueue = MilltaryVehicle.getModelQueueByQueueName(state, buildMissileVehicleCategoryName(), buildMissileLODQueueName(buildMissileVehicleCategoryName()))

    LOD.setStatusForLODQueue(getAbstractState(state), bodyQueue.names[index], status)
    LOD.setStatusForLODQueue(getAbstractState(state), turretQueue.names[index], status)
    LOD.setStatusForLODQueue(getAbstractState(state), missileQueue.names[index], status)

    return state
}


// export let createDestroyedState = () => {
//     return MilltaryVehicle.createDestroyedState(_setState)
// }

// export let createDestroyedState = () => {
//     return MilltaryVehicle.createDestroyedState(_setState)
// }


export let updateQueue = (state: state) => {
    let bodyQueue = getMissileVehicleBodyQueue(state)

    HierachyLODQueueUtils.update(state, bodyQueue)
}

// let _updateAI = (state: state) => {
//     let {
//         emitterSpeed,
//         emitterLife,
//         emitterSize,
//     } = MissileRack.getValue(state)

//     return updateAI(state,
//         [
//             MilltaryVehicle.getStateMachine,
//             MilltaryVehicle.setStateMachine,
//             createFireState,
//             createInitialState,
//             createMoveState,
//             _hasMoveData,
//             _setMoveData
//         ],
//         getMissileVehicleBodyQueue(state).getValidData(getAbstractState(state)),
//         emitterLife,
//         emitterSpeed,
//         NullableUtils.getEmpty(),
//     )
// }

export let initialAttributes = (state, name, index) => {
    return MilltaryVehicle.initialAttributes(state, [getValue, _getFullHp], name, index)
}

export let damage = (damageFunc) => {
    return (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
        return damageFunc(state,
            [
                getMissileVehicleBodyQueue,
                _getFullHp,
                _setStatus,
                MilltaryVehicle.emitBodyExplode,

                getModelAllQueues,
                _buildRoughFireRay,
                _rotateTowardsTarget,
                _fireMissiles,
                MissileRack.getValue
            ],
            getShellGunBarretHitSoundResourceId(),
            getValue(state),

            forceData, fromName, damagePosition, transforms, boxes, names
        )
    }
}

export let update = (state: state) => {
    updateQueue(state)

    return MilltaryVehicle.updateAI(state, [
        createFireState,
        createMoveState(state)
    ],
        getMissileVehicleBodyQueue(state),
        MissileRack.getValue(state)
    )
}


export let getPickedTransform = MilltaryVehicle.getPickedTransform(modelName.MissileVehicle)


export let handlePickup = MilltaryVehicle.handlePickup

export let updateTransform = MilltaryVehicle.updateTransform

export let handlePickdown = MilltaryVehicle.handlePickdown(getMissileVehicleBodyQueue)

export let getLocalTransform = MilltaryVehicle.getLocalTransform

export let getBoxForPick = MilltaryVehicle.getBoxForPick



export let getModelQueueIndex = MilltaryVehicle.getModelQueueIndex

export let getHp = MilltaryVehicle.getHp
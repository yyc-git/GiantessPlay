import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Color, Sprite, Ray, Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { cameraType, state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleCharacterType, getOrbitControlsTarget, useCamera, getAimResourceId, getAimAuxiliaryResourceId } from "../CityScene";
import { collisionPart, littleMan, littleManActionState, objectStateName, shootTarget, usedGirl, usedGirlEnum } from "../type/StateType";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { actionName, animationName } from "../little_man_data/DataType";
import { SkinAnimation } from "meta3d-jiehuo-abstract";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { fsm_state, labelAnimation, lodQueueIndex, name, staticLODContainerIndex } from "meta3d-jiehuo-abstract/src/type/StateType";
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
import { getLittleHandTransform, getLittleHandTransformForDebug, getLittleHandTransformPrefix } from "../utils/SkeletonUtils";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { Billboard } from "meta3d-jiehuo-abstract";
import { ScreenUtils } from "meta3d-jiehuo-abstract";
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { getHeight, getWidth } from "meta3d-utils/src/View";
import { getLittleManShootStartEventName, getMissionFailEventName } from "../../../../utils/EventUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { isInitialState, isNotDamageState } from "../utils/FSMStateUtils"
import { getAllCollisionParts, getRandomCollisionPart } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitterLife, emitterSize, emitterSpeed } from "../data/ValueType";
import { updateAnimationCollision } from "./Collision";
import { Map } from "immutable";
import * as DamageUtils from "../utils/DamageUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { getDeathAnimationResourcePath } from "../data/Const";
import { hp } from "../data/DataType";
import { computeBox, getBox, getFullHp, getLittleMan, getLittleManState, getName, getStateMachine, setGunInititalTransform, setHp, setLittleManState } from "./LittleMan";
import { getPosition, initTransform, setRotation } from "./Transform";
import { getAllAnimationNames, initWeights } from "./Animation";
import { setActionState } from "./Action";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getVolume, getLittleManVolume } from "../utils/SoundUtils";
import { getLookat, getTargetPosition } from "./Utils";
import { emitCurrentGunBullet, getBulletStartLocalPosition } from "./Gun";
import { getOctreeForStaticLODContainer } from "meta3d-jiehuo-abstract/src/lod/LOD";
import { getAllArmyContainers, getCampExn } from "../manage/city1/Army";
import { getPlayerCamp, isNearObject } from "../utils/PlayerUtils";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue";
import { getCurrentUsedGirls, isBossGiantess, isLevelGiantess, isLevelGiantessExceptPlayer, isPlayerGirl, isUseGirl } from "../girl/Girl";
import { getBigGirlBox, getGirlBox } from "../girl/Utils";
import { getCollisionPartOBB } from "../girl/Collision";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { LOD } from "meta3d-jiehuo-abstract";
import { isShootCamera, isThirdPersonCamera, removeTargetDirection } from "../LittleManCamera";
import { addStatusToShootTarget, isShootTargetNotEqual, removeStatusFromShootTarget } from "../utils/StatusUtils";
import { getLockTarget } from "./Lock";
import { hideAimCrossWhenDamage, hideAimCrossWhenDestroy } from "./AimUtils";
import { getIsAllowFriendDamage } from "../difficulty/HeatImplementer";

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();





export let handleShootAction = (state: state) => {
    // state = setRotation(state, getLookat(state))
    state = setActionState(state, littleManActionState.Shoot)

    state = handleStartShoot(state)

    return state
}

export let shootStartHandler = (state: state, { userData }) => {
    // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
    //     SoundManager.buildNeedToPlaySoundData(getBasicBulletGunEmmitSoundResourceId(), getIsDebug(state), getLittleManVolume(state))
    // ))


    state = setRotation(state, getLookat(state))

    // let position = getPosition(state)

    // let bulletStartWorldPosition = _getBulletStartLocalPosition()
    //     .applyQuaternion(getLookat(state))
    //     .add(
    //         position
    //     )

    // let targetPosition = _getTargetPosition(state)

    // state = setAbstractState(state, ParticleManager.emitBullet(getAbstractState(state), {
    //     // speed: emitterSpeed,
    //     // life: emitterLife,
    //     // size: emitterSize,
    //     speed: emitterSpeed.VeryFast,
    //     life: emitterLife.Short,
    //     size: emitterSize.Middle,

    //     position: bulletStartWorldPosition.toArray(),
    //     direction: targetPosition.clone().sub(bulletStartWorldPosition).normalize().toArray(),
    // }, getParticleNeedCollisionCheckLoopCount(state, emitterSpeed)))


    return Promise.resolve(state)
}

export let shootEmitHandler = (state: state, { userData }) => {

    state = emitCurrentGunBullet(state)

    return Promise.resolve(state)
}

let _sortDistance = (arr) => {
    return arr.sort((a, b) => {
        return a[0] - b[0]
    })
}

let _getRayQueryResultWithGirl = (state: state, usedGirl, ray: Ray): nullable<[number, collisionPart]> => {
    if (!isUseGirl(state, usedGirl) || !ray.intersectsBox(getBigGirlBox(state, usedGirl))) {
        return NullableUtils.getEmpty()
    }

    switch (usedGirl) {
        case usedGirlEnum.BossGiantess:
        default:
            // if (isLevelGiantess(state, usedGirl)) {
            if (isLevelGiantessExceptPlayer(state, usedGirl) || isBossGiantess(state, usedGirl)) {
                return ArrayUtils.get(_sortDistance(getAllCollisionParts(state, usedGirl).reduce((result: Array<[number, collisionPart]>, collisionPart_) => {
                    // let r = ray.intersectBox(
                    //     getCollisionPartOBB(state, usedGirl, collisionPart_).toBox3(),
                    //     _v1
                    // )
                    let r = getCollisionPartOBB(state, usedGirl, collisionPart_).intersectRay(ray, [_v1, _v2])



                    if (NullableUtils.isStrictNullable(r)) {
                        return result
                    }

                    return ArrayUtils.push(result, [NullableUtils.getExn(r[0]).sub(ray.origin).length(), collisionPart_])
                }, [])), 0)
            }

            return NullableUtils.getEmpty()
    }
}

// let _getRayQueryResult = (state: state, ray: Ray): Array<[number, nullable<staticLODContainerIndex>, nullable<name>]> => {
// let _getRayQueryResult = (state: state, ray: Ray): nullable<[number, nullable<staticLODContainerIndex>, nullable<name>, nullable<collisionPart>]> => {
let _getRayQueryResult = (state: state, ray: Ray): nullable<shootTarget> => {
    let playerCamp = getPlayerCamp()
    let isAllowFriendDamage = getIsAllowFriendDamage(state)

    let abstractState = getAbstractState(state)

    let armyResult: Array<[number, Matrix4, Box3, name, lodQueueIndex]> =
        _sortDistance(getAllArmyContainers(state).reduce((result, container) => {


            return NullableUtils.getWithDefault(
                NullableUtils.map(r => {
                    return ArrayUtils.push(result, r)
                    // }, container.queryByRayAndCamp(abstractState, getCampExn, state, ray, playerCamp)),
                }, isAllowFriendDamage ? container.queryByRay(abstractState, ray) : container.queryByRayAndCamp(abstractState, getCampExn, state, ray, playerCamp)),
                result
            )
        }, []))


    let result =
        NullableUtils.getWithDefault<Array<[number, nullable<staticLODContainerIndex>, nullable<[Box3, name, lodQueueIndex]>, nullable<[collisionPart, usedGirl]>]>>(
            NullableUtils.map(([distance, _, box, name, index]) => {
                return [[distance, NullableUtils.getEmpty(), NullableUtils.return_([box, name, index]), NullableUtils.getEmpty()]]
            }, ArrayUtils.get(armyResult, 0)),
            []
        )


    // let [distance, staticLODContainerIndex] = getOctreeForStaticLODContainer(abstractState).queryByRay(abstractState, ray)

    // result = ArrayUtils.push(result, [distance, staticLODContainerIndex, NullableUtils.getEmpty(), NullableUtils.getEmpty()])

    result = ArrayUtils.reduce(getCurrentUsedGirls(state), (result, usedGirl) => {
        return ArrayUtils.push(result, NullableUtils.map(r => {
            return [
                r[0], NullableUtils.getEmpty(), NullableUtils.getEmpty(),
                NullableUtils.return_([r[1], usedGirl])
            ]
        }, _getRayQueryResultWithGirl(state, usedGirl, ray)))
    }, result)


    result = _sortDistance(result)


    return NullableUtils.bind(r => {
        if (NullableUtils.isNullable(r[1]) && NullableUtils.isNullable(r[2]) && NullableUtils.isNullable(r[3])) {
            return NullableUtils.getEmpty()
        }

        return [ray.at(r[0], new Vector3()), r[1], r[2], r[3]]
    }, ArrayUtils.get(result, 0))
}

export let isIntersectPointCloseToBullStartPosition = (state, result, factor) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(([intersectPoint, staticLODContainerIndex, _, collisionPart_]) => {
            return isNearObject(getBulletStartLocalPosition(state, getPosition(state)), intersectPoint, factor)
        }, result),
        false
    )
}

let _buildRay = (nearPoint, farPoint) => {
    return new Ray(nearPoint, farPoint.clone().sub(nearPoint).normalize())
}

// let _auxiliaryAim = (state: state, aim: Sprite, nearPoint, farPoint) => {
let _auxiliaryAim = (state: state, aim: Sprite, farPoint) => {
    // let nearPoint = getBulletStartLocalPosition(state, getPosition(state))
    let nearPoint = ScreenUtils.convertScreenCoordniateToWorldCoordniate(
        _v1_1.set(
            getWidth() / 2,
            getHeight() / 2
        ),
        getCurrentCamera(getAbstractState(state)),
        true
    )
    let ray = _buildRay(nearPoint, farPoint)

    // let playerCamp = getPlayerCamp()

    let abstractState = getAbstractState(state)

    // let armyResult: Array<[number, Matrix4, Box3, name]> =
    //     getAllArmyContainers(state).reduce((result, container) => {
    //         return NullableUtils.getWithDefault(
    //             NullableUtils.map(r => {
    //                 return ArrayUtils.push(result, r)
    //             }, container.queryByRayAndCamp(abstractState, getCampExn, state, ray, playerCamp)),
    //             result
    //         )
    //     }, []).sort((a, b) => {
    //         return a[0] - b[0]
    //     })


    // let result =
    //     NullableUtils.getWithDefault(
    //         NullableUtils.map(([distance, _, _b, name]) => {
    //             return [distance, NullableUtils.getEmpty(), NullableUtils.return_(name)]
    //         }, ArrayUtils.get(armyResult, 0)),
    //         []
    //     )


    // let [distance, staticLODContainerIndex] = getOctreeForStaticLODContainer(abstractState).queryByRay(abstractState, ray)

    // result = ArrayUtils.push(result, [distance, staticLODContainerIndex, NullableUtils.getEmpty()])

    let result = _getRayQueryResult(state, ray)
    if (isIntersectPointCloseToBullStartPosition(state, result, 2)) {
        result = _getRayQueryResult(state, _buildRay(getBulletStartLocalPosition(state, getPosition(state)), farPoint))
    }


    // let result
    // result = ArrayUtils.get(rayQueryResult, 0)

    let previousAimTarget = getLittleManState(state).aimTarget

    state = setAimTarget(state, result)


    if (NullableUtils.isNullable(result)) {
        aim.material.map = Loader.getResource(abstractState, getAimResourceId())

        // if (isShootTargetNotEqual(getLockTarget(state), previousAimTarget)) {
        //     state = removeStatusFromShootTarget(state, previousAimTarget)
        // }
        // state = removeStatusFromShootTarget(state, previousAimTarget, result, getLockTarget(state))
        state = removeStatusFromShootTarget(state, previousAimTarget)
    }
    else {
        // let _ = NullableUtils.getExn(index)

        aim.material.map = Loader.getResource(abstractState, getAimAuxiliaryResourceId())

        if (isShootTargetNotEqual(previousAimTarget, result)) {
            // if (isShootTargetNotEqual(getLockTarget(state), previousAimTarget)) {
            //     state = removeStatusFromShootTarget(state, previousAimTarget)
            // }
            // state = removeStatusFromShootTarget(state, previousAimTarget, result, getLockTarget(state))
            state = removeStatusFromShootTarget(state, previousAimTarget)

            // if (isShootTargetNotEqual(getLockTarget(state), result)) {
            state = addStatusToShootTarget(state, result)
            // }
        }
    }

    return state
}

let _updateAimPosition = (state: state): [state, Vector3] => {
    let farPoint = ScreenUtils.convertScreenCoordniateToWorldCoordniate(
        _v1_1.set(
            getWidth() / 2,
            getHeight() / 2
        ),
        getCurrentCamera(getAbstractState(state)),
        false
    )

    let aim = NullableUtils.getExn(getLittleManState(state).aim)
    aim.position.copy(
        farPoint
    )
    aim.updateMatrixWorld(true)

    let aimCrossWhenDamage = NullableUtils.getExn(getLittleManState(state).aimCrossWhenDamage)
    aimCrossWhenDamage.position.copy(
        farPoint
    )
    aimCrossWhenDamage.updateMatrixWorld(true)

    let aimCrossWhenDestroy = NullableUtils.getExn(getLittleManState(state).aimCrossWhenDestroy)
    aimCrossWhenDestroy.position.copy(
        farPoint
    )
    aimCrossWhenDestroy.updateMatrixWorld(true)

    let headShot = NullableUtils.getExn(getLittleManState(state).headShot)
    headShot.position.copy(
        farPoint
    )
    headShot.updateMatrixWorld(true)

    return [state, farPoint]
}

export let updateAimHud = (state: state) => {
    let data = _updateAimPosition(state)
    state = data[0]
    let farPoint = data[1]


    state = hideAimCrossWhenDamage(state)
    state = hideAimCrossWhenDestroy(state)


    state = _auxiliaryAim(state, NullableUtils.getExn(getLittleManState(state).aim),

        // ScreenUtils.convertScreenCoordniateToWorldCoordniate(
        //     _v1_1.set(
        //         getWidth() / 2,
        //         getHeight() / 2
        //     ),
        //     getCurrentCamera(getAbstractState(state)),
        //     true
        // ) ,
        farPoint)



    return state
}

export let getAimTarget = (state: state) => {
    return getLittleManState(state).aimTarget
}

export let setAimTarget = (state: state, value) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        aimTarget: value
    })
}


export let getShootTargetBox = (state: state, [_, staticLODContainerIndex, lodQueueData, girlData]: shootTarget) => {
    if (!NullableUtils.isNullable(staticLODContainerIndex)) {
        return LOD.getBox(getAbstractState(state), NullableUtils.getExn(staticLODContainerIndex))
    }
    else if (!NullableUtils.isNullable(lodQueueData)) {
        let [box, name, index] = NullableUtils.getExn(lodQueueData)

        return box
    }
    else {
        let [collisionPart_, usedGirl] = NullableUtils.getExn(girlData)
        return getCollisionPartOBB(state, usedGirl, NullableUtils.getExn(collisionPart_)).toBox3()
    }
}

export let getShootTargetPosition = (state: state, shootTarget) => {
    let box = getShootTargetBox(state, shootTarget)

    return box.getCenter(new Vector3())
}

export let handleStartShoot = (state: state) => {
    // if (!isThirdPersonCamera(state) && !isInitialState(getStateMachine(state))) {
    if (
        !getIsDebug(state)
        &&
        isThirdPersonCamera(state)) {
        state = useCamera(state, cameraType.Shoot)
    }


    return state
}

export let handleEndShoot = (state: state) => {
    if (isShootCamera(state)) {
        state = removeTargetDirection(state)
        state = useCamera(state, cameraType.ThirdPerson)
    }

    return state
}
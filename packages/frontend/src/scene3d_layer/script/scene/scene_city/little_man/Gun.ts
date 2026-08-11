import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { state } from "../../../../type/StateType";
import { bulletPropName, camp, gunName } from "../type/StateType";
import { getBox, getCurrentStudyActions, getLittleMan, getLittleManState, getName, getValue, isLittleMan, removeStudyActions, setCurrentStudyActions, setGunInititalTransform } from "./LittleMan";
import { getPosition } from "./Transform";
import { getLookat, getTargetPosition } from "./Utils";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { getParticleNeedCollisionCheckLoopCount } from "../utils/ArmyUtils2";
// import * as BasicBulletGun from "../weapon/BasicBulletGun"
import * as LaserGun from "../weapon/LaserGun"
import * as RocketGun from "../weapon/RocketGun"
// import * as PropBulletGun from "../weapon/PropBulletGun"
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getLaserBulletGunEmmitSoundResourceId, getNoBulletEmmitSoundResourceId, getRocketGunEmmitSoundResourceId, getScene } from "../CityScene";
import { getIsDebug } from "../../Scene";
import { getVolume, getLittleManVolume } from "../utils/SoundUtils";
import * as Girl from "../girl/Girl"
import { actionName } from "../data/DataType";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { addExcitement } from "../girl/Excitement";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { DisposeUtils } from "meta3d-jiehuo-abstract";
import { getCampExn, getPositionY, getUpdateLittleManWeaponFunc } from "../manage/city1/Army";
import { getLittleManPositionYKey } from "../manage/biwu/level3/ArmyManager";
import { addPropCount, getAllPropsByType, getPropCount, getPropCountNullable, subPropCount } from "../reward/Prop";
import { emitterSpeed, weaponName, weaponValue } from "../data/ValueType";
import { getAimTarget, getShootTargetPosition, isIntersectPointCloseToBullStartPosition, updateAimHud } from "./Shoot";
import { LOD } from "meta3d-jiehuo-abstract";
import { getCollisionPartOBB } from "../girl/Collision";
import { studyActions } from "../utils/build/LittleManBuildUtils";
import { buildFuncData } from "../data/FuncData";
import { actionName as littleManActionName } from "../little_man_data/DataType";
import { getNow } from "../Time";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { clearLockTarget, getLockTarget, update as updateLock, initWhenImportScene as initWhenImportSceneLock } from "./Lock";
import { getEmitFunc, getEmitSoundResourceId, getWeaponImagePath, getWeaponValue, isLockable, getAllWeaponNames as getAllWeaponNamesMod } from "../../../../mod/PropBulletMod";
import { Event } from "meta3d-jiehuo-abstract";
import { getSwitchWeaponEventName } from "../../../../utils/EventUtils";
import { getIsAllowFriendDamage } from "../difficulty/HeatImplementer";
// import { emitBasicParticleEmit } from "../manage/city1/soldier/weapon/BasicBullet";
// import * as BasicBulletGun from "../weapon/BasicBulletGun";
// import * as FlameGun from "../weapon/FlameGun";
// import * as LaserGun from "../weapon/LaserGun";
// import * as MissileRack from "../weapon/MissileRack";
// import * as PropBulletGun from "../weapon/PropBulletGun";
// import * as RocketGun from "../weapon/RocketGun";
// import * as ShellGunBarrel from "../weapon/ShellGunBarrel";
// import * as SwipingWeapon from "../weapon/SwipingWeapon";
// import * as TurretMissileRack from "../weapon/TurretMissileRack";
// import * as TurretShellGunBarrel from "../weapon/TurretShellGunBarrel";


const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();

export let getCurrentGunName = (state: state) => {
    let gunName_
    switch (getLittleManState(state).usedBulletPropName) {
        // case bulletPropName.BasicBullet:
        //     gunName_ = gunName.BasicGun
        //     break
        case bulletPropName.LaserBullet:
            gunName_ = gunName.LaserGun
            break
        case bulletPropName.RocketBullet:
            gunName_ = gunName.RocketGun
            break
        // case bulletPropName.BiggerBullet:
        // case bulletPropName.SmallerToLastBiggerCount:
        //     gunName_ = gunName.PropGun
        //     break
        default:
            // throw new Error("err")
            gunName_ = getLittleManState(state).usedBulletPropName
            break
    }

    return gunName_
}

export let addCurrentGunBullet = (state: state, count: number) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(usedBulletPropName => {
            return addPropCount(state, usedBulletPropName, count)
        }, getLittleManState(state).usedBulletPropName),
        state
    )
}

export let getGunImageSrc = (state: state) => {
    let name = getCurrentGunName(state)
    switch (name) {
        case gunName.LaserGun:
        case gunName.PropGun:
        case gunName.RocketGun:
            return `./resource/ui/in_game/little_man/package/gun/${name}.png`
        default:
            // return getWeaponImageBase64(state, name)
            return getWeaponImagePath(state, name)
    }
}


export let getAllWeaponNames = (state: state) => {
    return getAllWeaponNamesMod(state).concat(
        [
            LaserGun.getName(),
            RocketGun.getName()
        ]
    )
}

export let getCurrentGunWeaponName = (state: state): string => {
    let weaponName_
    switch (getCurrentGunName(state)) {
        case gunName.LaserGun:
            weaponName_ = LaserGun.getName()
            break
        // case gunName.PropGun:
        //     return PropBulletGun.getValue(state)
        case gunName.RocketGun:
            weaponName_ = RocketGun.getName()
            break
        default:
            weaponName_ = getCurrentGunName(state)
            break
    }

    return weaponName_
}

export let getCurrentGunValue = (state: state): weaponValue => {
    let weaponName_ = getCurrentGunWeaponName(state)
    let gunValue
    switch (getCurrentGunName(state)) {
        case gunName.LaserGun:
            gunValue = LaserGun.getValue(state)
            break
        case gunName.RocketGun:
            gunValue = RocketGun.getValue(state)
            break
        default:
            gunValue = getWeaponValue(state, weaponName_)
            break
    }

    return _updateWeaponValue(state, gunValue, weaponName_)
}

// export let getWeaponForce = (state, weaponName, weaponValue, name) => {
//     if (isLittleMan(name)) {
//         return _updateWeaponValue(state, weaponValue, weaponName).force
//     }

//     return weaponValue.force
// }

export let updateLittleManWeaponValue = (state, weaponName, weaponValue, name) => {
    if (isLittleMan(name)) {
        return _updateWeaponValue(state, weaponValue, weaponName)
    }

    return weaponValue
}


export let addGunToHand = (state: state, previousGunName: nullable<gunName>) => {
    NullableUtils.forEach(previousGunName => {
        Object3DUtils.markAllMeshesNotVisible(
            getGunObj(state, previousGunName)
        )
    }, previousGunName)

    let gunName_ = getCurrentGunName(state)

    let currentGunObj = getGunObj(state, gunName_)

    Object3DUtils.markAllMeshesVisible(
        currentGunObj
    )


    let rightHand = getLittleMan(state).getObjectByName("mixamorigRightHand")

    rightHand.add(
        currentGunObj
    )

    return Event.trigger(state, getAbstractState, getSwitchWeaponEventName(), null)
}

export let getCurrentGun = (state: state) => {
    return NullableUtils.getExn(getLittleManState(state).gunMap.get(getCurrentGunName(state)))
}

export let getBulletStartLocalPosition = (state: state, position) => {
    let height = getBox(state).getSize(_v1).y

    let y = height * 0.8

    // let startPoint = position.clone().setY(height * 0.8)
    let startPoint = position.clone()

    let result = startPoint.add(
        new Vector3(0, 0, 1).applyQuaternion(getLookat(state)).multiplyScalar(height * 0.6)
    )
    // let result = startPoint

    return result.setY(getPositionY(state, getLittleManPositionYKey(), result.x, result.z) + y)
}

let _computeEnableLockGunDirection = (state: state,
    targetPosition, bulletStartWorldPosition
) => {
    let newTargetPosition
    if (!NullableUtils.isNullable(getLockTarget(state))) {
        newTargetPosition = getShootTargetPosition(state, NullableUtils.getExn(getLockTarget(state)))
    }
    else {
        newTargetPosition = NullableUtils.getWithDefault(
            NullableUtils.map(([intersectPoint, staticLODContainerIndex, _, collisionPart_]) => {
                return intersectPoint
            }, getAimTarget(state)),
            targetPosition
        )
    }

    return _v1.copy(newTargetPosition).sub(bulletStartWorldPosition).normalize().toArray()
}

let _computeDiabledLockGunDirection = (state: state,
    targetPosition, bulletStartWorldPosition
) => {
    let newTargetPosition = NullableUtils.getWithDefault(
        NullableUtils.map(([intersectPoint, staticLODContainerIndex, _, collisionPart_]) => {
            return intersectPoint
        }, getAimTarget(state)),
        targetPosition
    )

    return _v1.copy(newTargetPosition).sub(bulletStartWorldPosition).normalize().toArray()
}

let _updateWeaponValue = (
    state: state,
    weaponValue_: weaponValue,
    weaponName,
) => {
    return getUpdateLittleManWeaponFunc(state)(state, weaponName, weaponValue_)
}

let _handleEmitterSpeed = (state: state, emitterSpeed_) => {
    /*! slow down emitter speed to make sure bullet can hit
    * 
    */
    if (isIntersectPointCloseToBullStartPosition(state, getAimTarget(state), 3)) {
        return emitterSpeed.Middle
    }

    return emitterSpeed_
}

let _emitPropBullet = (state: state,
    [emitPropBulletFunc, computeDirectionFunc],
    bulletGunValue,
    bulletGunName,
    usedBulletPropName,
    position,
    bulletStartWorldPosition,
    targetPosition,
    soundResourceId,
) => {
    let propCount = getPropCount(state, usedBulletPropName)

    if (isFinite(propCount)) {
        if (propCount > 0) {
            state = subPropCount(state, usedBulletPropName, 1)
        }
        else {
            return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                SoundManager.buildNeedToPlaySoundData(getNoBulletEmmitSoundResourceId(), getIsDebug(state), getLittleManVolume(state, position))
            ))
        }
    }

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), getLittleManVolume(state, position))
    ))

    bulletGunValue = _updateWeaponValue(state, bulletGunValue, bulletGunName)

    let { emitterLifeFactor } = getValue(state)

    let speed = _handleEmitterSpeed(state, bulletGunValue.emitterSpeed)

    state = setAbstractState(state, emitPropBulletFunc(getAbstractState(state), {
        fromName: getName(),
        // camp: getCampExn(state, getName()),
        camp: getIsAllowFriendDamage(state) ? camp.Other : getCampExn(state, getName()),

        speed,
        life: bulletGunValue.emitterLife * emitterLifeFactor,
        size: bulletGunValue.emitterSize,
        count: bulletGunValue.emitterCount,

        position: bulletStartWorldPosition.toArray(),
        direction: computeDirectionFunc(state, targetPosition, bulletStartWorldPosition)
    }, getParticleNeedCollisionCheckLoopCount(state, speed)))

    return state
}

// TODO duplicate
let _emitPropBullet2 = (state: state,
    [emitPropBulletFunc, computeDirectionFunc],
    bulletGunValue: weaponValue,
    bulletGunName,
    usedBulletPropName,
    position,
    bulletStartWorldPosition,
    targetPosition,
    soundResourceId,
) => {
    let propCount = getPropCount(state, usedBulletPropName)

    if (isFinite(propCount)) {
        if (propCount > 0) {
            state = subPropCount(state, usedBulletPropName, 1)
        }
        else {
            return setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                SoundManager.buildNeedToPlaySoundData(getNoBulletEmmitSoundResourceId(), getIsDebug(state), getLittleManVolume(state, position))
            ))
        }
    }

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), getLittleManVolume(state, position))
    ))

    bulletGunValue = _updateWeaponValue(state, bulletGunValue, bulletGunName)

    let { emitterLifeFactor } = getValue(state)

    // console.log(
    //     bulletStartWorldPosition,
    //     computeDirectionFunc(state, targetPosition, bulletStartWorldPosition),
    //     bulletGunValue.emitterSpeed
    // )

    let speed = _handleEmitterSpeed(state, bulletGunValue.emitterSpeed)

    // TODO duplicate diff here
    state = emitPropBulletFunc(
        state, {
        ...NullableUtils.getWithDefault(bulletGunValue.customData, {}),

        fromName: getName(),
        // camp: getCampExn(state, getName()),
        // camp: camp.Other,
        camp: getIsAllowFriendDamage(state) ? camp.Other : getCampExn(state, getName()),

        speed,
        life: bulletGunValue.emitterLife * emitterLifeFactor,
        size: bulletGunValue.emitterSize,
        count: bulletGunValue.emitterCount,

        position: bulletStartWorldPosition.toArray(),
        direction: computeDirectionFunc(state, targetPosition, bulletStartWorldPosition)
    }, getParticleNeedCollisionCheckLoopCount(state, speed))

    return state
}

export let emitCurrentGunBullet = (state: state) => {
    let position = getPosition(state)

    let bulletStartWorldPosition = getBulletStartLocalPosition(state, position)


    let targetPosition = getTargetPosition(state)


    let usedBulletPropName = getLittleManState(state).usedBulletPropName

    // let bulletGunValue
    switch (usedBulletPropName) {
        case bulletPropName.LaserBullet:
            state = _emitPropBullet(state,
                // [ParticleManager.emitLaserBullet, _computeDiabledLockGunDirection],
                [ParticleManager.emitLaserBullet, _computeEnableLockGunDirection],
                LaserGun.getValue(state),
                LaserGun.getName(),
                usedBulletPropName,
                position,
                bulletStartWorldPosition,
                targetPosition,
                getLaserBulletGunEmmitSoundResourceId()
            )
            break
        case bulletPropName.RocketBullet:
            state = _emitPropBullet(state,
                // [ParticleManager.emitRocket, _computeDiabledLockGunDirection],
                [ParticleManager.emitRocket, _computeEnableLockGunDirection],
                RocketGun.getValue(state),
                RocketGun.getName(),
                usedBulletPropName,
                position,
                bulletStartWorldPosition,
                targetPosition,
                getRocketGunEmmitSoundResourceId()
            )
            break
        // case bulletPropName.BiggerBullet:
        // case bulletPropName.SmallerToLastBiggerCount:
        //     state = _emitPropBullet(state,
        //         [ParticleManager.emitPropBullet, _computeDiabledLockGunDirection],
        //         PropBulletGun.getValue(state),
        //         usedBulletPropName,
        //         position,
        //         bulletStartWorldPosition,
        //         targetPosition,
        //         getPropBulletGunEmmitSoundResourceId()
        //     )
        //     break
        default:
            // throw new Error("err")
            state = _emitPropBullet2(state,
                [
                    getEmitFunc(state, usedBulletPropName),
                    isLockable(state, usedBulletPropName) ?
                        _computeEnableLockGunDirection : _computeDiabledLockGunDirection
                ],
                // SubMachineBulletGun.getValue(state),
                getWeaponValue(state, usedBulletPropName),
                usedBulletPropName,
                usedBulletPropName,
                position,
                bulletStartWorldPosition,
                targetPosition,
                // getBasicBulletGunEmmitSoundResourceId()
                getEmitSoundResourceId(state, usedBulletPropName)
            )
            break
    }


    return state
}

// let _emitPropBulletHit = (state: state, position: [number, number, number]) => {
//     state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
//         SoundManager.buildNeedToPlaySoundData(getPropBulletGunHitSoundResourceId(), getIsDebug(state), getLittleManVolume(state, _v1.fromArray(position)))
//     ))

//     return setAbstractState(state, ParticleManager.emitPropBulletHit(getAbstractState(state), {
//         speed: 1,
//         life: 1000,
//         size: 15,
//         position: position
//     }))
// }

// export let handlePropBulletHitStatic = (state: state, handleFunc, position) => {
//     state = _emitPropBulletHit(state, position)

//     return handleFunc(state)
// }

// export let handlePropBulletHitGirl = (state: state, handleFunc, position): Promise<state> => {
//     state = _emitPropBulletHit(state, position)

//     return handleFunc(state).then(state => {
//         switch (getLittleManState(state).usedBulletPropName) {
//             case bulletPropName.BiggerBullet:
//                 return Girl.triggerAction(state, usedGirl, actionName.Bigger).then(TupleUtils.getTuple2First)
//             case bulletPropName.SmallerToLastBiggerCount:
//                 return Girl.triggerAction(state, usedGirl, actionName.SmallerToLastBiggerCount).then(TupleUtils.getTuple2First)
//             default:
//                 return Promise.resolve(state)
//         }
//     })
// }


// export let handlePropBulletHitArmy = (state: state, handleFunc, position) => {
//     throw new Error("err")
// }

// export let handlePropBulletHitLittleMan = (state: state, handleFunc, position) => {
//     // throw new Error("err")
//     return handleFunc(state)
// }

// export let emitBulletHit = (state: state, position) => {
//     switch (getLittleManState(state).usedBulletPropName) {
//         case bulletPropName.BasicBullet:
//             state = setAbstractState(state, ParticleManager.emitBulletHit(getAbstractState(state), {
//                 speed: 1,
//                 life: 500,
//                 size: 2,
//                 position: position
//             }))
//             break
//         case bulletPropName.BiggerBullet:
//             state = setAbstractState(state, ParticleManager.emitPropBulletHit(getAbstractState(state), {
//                 speed: 1,
//                 life: 1000,
//                 size: 10,
//                 position: position
//             }))
//             break
//         default:
//             throw new Error("err")
//     }

//     return state
// }

export let getGunObj = (state: state, gunName) => {
    return NullableUtils.getExn(getLittleManState(state).gunMap.get(gunName))
}

// export let isCurrentGunNeedUpdateAnimationDuration = (state: state) => {
//     switch (getLittleManState(state).usedBulletPropName) {
//         case bulletPropName.BasicBullet:
//         case bulletPropName.SubMachineBullet:
//         case bulletPropName.LaserBullet:
//         case bulletPropName.RocketBullet:
//             return true
//         case bulletPropName.BiggerBullet:
//         case bulletPropName.SmallerToLastBiggerCount:
//             return false
//         default:
//             throw new Error("err")
//     }
// }

export let dispose = (state: state) => {
    let scene = getScene(state)

    return getLittleManState(state).gunMap.reduce((state, gun) => {
        DisposeUtils.removeAndDispose(scene, gun)

        return state
    }, state)
}

export let initWhenImportScene = (state: state) => {
    state = initWhenImportSceneLock(state)

    return state
}

// let _updateStatus = (state: state) => {
//     let targetData = ArrayUtils.create()

//     targetData = NullableUtils.getWithDefault(
//         NullableUtils.map(([intersectPoint, staticLODContainerIndex, lodQueueData, collisionPart_]) => {
//             return ArrayUtils.push(
//                 targetData,
//                 [staticLODContainerIndex, lodQueueData]
//             )
//         }, getAimTarget(state)),
//         targetData
//     )
//     targetData = NullableUtils.getWithDefault(
//         NullableUtils.map(([intersectPoint, staticLODContainerIndex, lodQueueData, collisionPart_]) => {
//             return ArrayUtils.push(
//                 targetData,
//                 [staticLODContainerIndex, lodQueueData]
//             )
//         }, getLockTarget(state)),
//         targetData
//     )


// }

export let update = (state: state) => {
    if (getIsDebug(state)) {
        setGunInititalTransform(state, NullableUtils.getExn(getCurrentGun(state)), getIsDebug(state))
    }


    state = updateAimHud(state)

    state = updateLock(state)


    if (isLockable(state, getCurrentGunName(state))) {
        let currentStudyActions = getCurrentStudyActions(state)
        return setCurrentStudyActions(
            state,
            NullableUtils.isNullable(
                currentStudyActions.find(s => {
                    return s.name == littleManActionName.Lock
                })
            ) ? ArrayUtils.push(currentStudyActions, {
                name: littleManActionName.Lock,
                time: getNow(state)
            }) : currentStudyActions
        )
    }

    state = removeStudyActions(state, [littleManActionName.Lock])

    return clearLockTarget(state)
}

export let getCurrentBulletCount = (state: state) => {
    return getPropCountNullable(state,
        getLittleManState(state).usedBulletPropName
    )
}
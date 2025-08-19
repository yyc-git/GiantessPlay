import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { state } from "../../../../type/StateType";
import { bulletPropName, gunName } from "../type/StateType";
import { getBox, getLittleMan, getLittleManState, getName } from "./LittleMan";
import { getPosition } from "./Transform";
import { getLookat, getTargetPosition } from "./Utils";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { getParticleNeedCollisionCheckLoopCount } from "../utils/ArmyUtils";
import * as BasicBulletGun from "../weapon/BasicBulletGun"
import * as LaserGun from "../weapon/LaserGun"
import * as RocketGun from "../weapon/RocketGun"
import * as PropBulletGun from "../weapon/PropBulletGun"
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getBasicBulletGunEmmitSoundResourceId, getLaserBulletGunEmmitSoundResourceId, getNoBulletEmmitSoundResourceId, getPropBulletGunEmmitSoundResourceId, getPropBulletGunHitSoundResourceId, getRocketGunEmmitSoundResourceId, getScene } from "../CityScene";
import { getIsDebug } from "../../Scene";
import { getVolume, getLittleManVolume } from "../utils/SoundUtils";
import * as Girl from "../girl/Girl"
import { actionName } from "../data/DataType";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { addExcitement } from "../girl/Excitement";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { DisposeUtils } from "meta3d-jiehuo-abstract";
import { getPropCount, subPropCount } from "./Prop";
import { getPositionY } from "../manage/city1/Army";
import { getLittleManPositionYKey } from "../manage/biwu/level3/ArmyManager";


const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();

export let getCurrentGunName = (state: state) => {
    let gunName_
    switch (getLittleManState(state).usedBulletPropName) {
        case bulletPropName.BasicBullet:
            gunName_ = gunName.BasicGun
            break
        case bulletPropName.LaserBullet:
            gunName_ = gunName.LaserGun
            break
        case bulletPropName.RocketBullet:
            gunName_ = gunName.RocketGun
            break
        case bulletPropName.BiggerBullet:
        case bulletPropName.SmallestBullet:
            gunName_ = gunName.PropGun
            break
        default:
            throw new Error("err")
    }

    return gunName_
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

    return state
}

export let getCurrentGun = (state: state) => {
    return NullableUtils.getExn(getLittleManState(state).gunMap.get(getCurrentGunName(state)))
}

let _getBulletStartLocalPosition = (state: state, position) => {
    let height = getBox(state).getSize(_v1).y

    let y = height * 0.8

    // let startPoint = position.clone().setY(height * 0.8)
    let startPoint = position.clone()

    let result = startPoint.add(
        new Vector3(0, 0, 1).applyQuaternion(getLookat(state)).multiplyScalar(height * 0.6)
    )

    return result.setY(getPositionY(state, getLittleManPositionYKey(), result.x, result.z) + y)
}

let _emitPropBullet = (state: state,
    emitPropBulletFunc,
    bulletGunValue, usedBulletPropName,
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

    state = setAbstractState(state, emitPropBulletFunc(getAbstractState(state), {
        fromName: getName(),

        speed: bulletGunValue.emitterSpeed,
        life: bulletGunValue.emitterLife,
        size: bulletGunValue.emitterSize,

        position: bulletStartWorldPosition.toArray(),
        direction: targetPosition.clone().sub(bulletStartWorldPosition).normalize().toArray(),
    }, getParticleNeedCollisionCheckLoopCount(state)))

    return state
}

export let emitCurrentGunBullet = (state: state) => {
    let position = getPosition(state)

    let bulletStartWorldPosition = _getBulletStartLocalPosition(state, position)


    let targetPosition = getTargetPosition(state)


    let usedBulletPropName = getLittleManState(state).usedBulletPropName

    let bulletGunValue
    switch (usedBulletPropName) {
        case bulletPropName.BasicBullet:
            state = _emitPropBullet(state,
                ParticleManager.emitBullet,
                BasicBulletGun.getValue(state),
                usedBulletPropName,
                position,
                bulletStartWorldPosition,
                targetPosition,
                getBasicBulletGunEmmitSoundResourceId()
            )
            break
        case bulletPropName.LaserBullet:
            state = _emitPropBullet(state,
                ParticleManager.emitLaserBullet,
                LaserGun.getValue(state),
                usedBulletPropName,
                position,
                bulletStartWorldPosition,
                targetPosition,
                getLaserBulletGunEmmitSoundResourceId()
            )
            break
        case bulletPropName.RocketBullet:
            state = _emitPropBullet(state,
                ParticleManager.emitRocket,
                RocketGun.getValue(state),
                usedBulletPropName,
                position,
                bulletStartWorldPosition,
                targetPosition,
                getRocketGunEmmitSoundResourceId()
            )
            break
        case bulletPropName.BiggerBullet:
        case bulletPropName.SmallestBullet:
            state = _emitPropBullet(state,
                ParticleManager.emitPropBullet,
                PropBulletGun.getValue(state),
                usedBulletPropName,
                position,
                bulletStartWorldPosition,
                targetPosition,
                getPropBulletGunEmmitSoundResourceId()
            )
            break
        default:
            throw new Error("err")
    }


    return state
}

let _emitPropBulletHit = (state: state, position: [number, number, number]) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getPropBulletGunHitSoundResourceId(), getIsDebug(state), getLittleManVolume(state, _v1.fromArray(position)))
    ))

    return setAbstractState(state, ParticleManager.emitPropBulletHit(getAbstractState(state), {
        speed: 1,
        life: 1000,
        size: 15,
        position: position
    }))
}

export let handlePropBulletHitStatic = (state: state, handleFunc, position) => {
    state = _emitPropBulletHit(state, position)

    return handleFunc(state)
}

export let handlePropBulletHitGirl = (state: state, handleFunc, position): Promise<state> => {
    state = _emitPropBulletHit(state, position)

    return handleFunc(state).then(state => {
        switch (getLittleManState(state).usedBulletPropName) {
            case bulletPropName.BiggerBullet:
                return Girl.triggerAction(state, actionName.Bigger, false, false).then(TupleUtils.getTuple2First)
            case bulletPropName.SmallestBullet:
                return Girl.triggerAction(state, actionName.Smaller).then(TupleUtils.getTuple2First)
            default:
                return Promise.resolve(state)
        }
    })
}


export let handlePropBulletHitArmy = (state: state, handleFunc, position) => {
    throw new Error("err")
}

export let handlePropBulletHitLittleMan = (state: state, handleFunc, position) => {
    throw new Error("err")
}

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

export let isCurrentGunNeedUpdateAnimationDuration = (state: state) => {
    switch (getLittleManState(state).usedBulletPropName) {
        case bulletPropName.BasicBullet:
        case bulletPropName.LaserBullet:
        case bulletPropName.RocketBullet:
            return true
        case bulletPropName.BiggerBullet:
        case bulletPropName.SmallestBullet:
            return false
        default:
            throw new Error("err")
    }
}

export let dispose = (state: state) => {
    let scene = getScene(state)

    return getLittleManState(state).gunMap.reduce((state, gun) => {
        DisposeUtils.removeAndDispose(scene, gun)

        return state
    }, state)
}
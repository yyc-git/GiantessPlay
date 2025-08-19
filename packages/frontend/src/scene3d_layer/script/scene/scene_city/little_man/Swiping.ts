import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleRoad, getOrbitControlsTarget, getSwipingEmmitOtherSoundResourceId, getSwipingEmmitGirlSoundResourceId } from "../CityScene";
import { damageType, littleMan, littleManActionState, objectStateName } from "../type/StateType";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { getIsDebug } from "../../Scene";
import { buildFakeBulletParticle, checkRangeCollisionWithArmy, handleAllCollisions, handleCollisionWithArmy, handleHitArmy } from "../utils/ArmyUtils";
import { isNotDamageState } from "../utils/FSMStateUtils"
import { checkCollisionWithStatic, getRandomCollisionPart, handleCollisionWithEmitterCollisionableContainers } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitterLife, emitterSize, emitterSpeed, weaponType } from "../data/ValueType";
import * as DamageUtils from "../utils/DamageUtils"
import { computeBox, getBox, getCurrentModelData, getFullHp, getLittleMan, getLittleManState, getName, getStateMachine, setGunInititalTransform, setHp, setLittleManState } from "./LittleMan";
import { getPosition, initTransform, setRotation } from "./Transform";
import { getAllAnimationNames, initWeights } from "./Animation";
import { setActionState } from "./Action";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getVolume, getLittleManVolume } from "../utils/SoundUtils";
import { handleShootAction, shootStartHandler } from "./Shoot";
import { getLookat } from "./Utils";
import { queryAllOBBShapesCollisionWithBox } from "../girl/Collision";
import { getCampExn } from "../manage/city1/Army";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { TupleUtils } from "meta3d-jiehuo-abstract";

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();


export let handleSwipingAction = handleShootAction

export let swipingStartHandler = shootStartHandler

let _getDamageBox = (state: state) => {
    let position = getPosition(state)

    let height = getBox(state).getSize(_v1).y

    let startPoint = position.clone().setY(position.y + height * 0.8)

    let point = startPoint.add(
        new Vector3(0, 0, 1).applyQuaternion(getLookat(state)).multiplyScalar(height * 0.6)
    )

    return new Box3().setFromCenterAndSize(point, _v2.setScalar(height * 1))
}

let _emitHit = (state, position, swipingWeaponType) => {
    switch (swipingWeaponType) {
        // case weaponType.Middle:
        // case weaponType.Heavy:
        case weaponType.VeryHeavy:
            state = setAbstractState(state, ParticleManager.emitSwipingHit(getAbstractState(state), {
                speed: 1,
                life: 500,
                size: _getDamageBox(state).getSize(_v1).length() * 2,
                position: position.toArray()
            }))
            break
    }

    return state
}

export let swipingEmitHandler = (state: state, { userData }) => {
    let damageBox = _getDamageBox(state)
    let damagePoint = damageBox.getCenter(new Vector3())

    let { swipingForce, swipingWeaponType } = getCurrentModelData(state)

    let forceDirection = new Vector3(0, -1, 0)

    return handleAllCollisions(
        state, [
        (state: state, handleFunc, position,
            pointBox: Box3,
            direction: [number, number, number]
        ) => {
            state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                SoundManager.buildNeedToPlaySoundData(getSwipingEmmitOtherSoundResourceId(), getIsDebug(state), getLittleManVolume(state, damagePoint))
            ))

            state = _emitHit(state, damagePoint, swipingWeaponType)

            return handleFunc(state)
        },
        (state: state, handleFunc, position,
            pointBox: Box3,
            direction: [number, number, number]
        ) => {
            state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                SoundManager.buildNeedToPlaySoundData(getSwipingEmmitGirlSoundResourceId(), getIsDebug(state), getLittleManVolume(state, damagePoint))
            ))


            state = _emitHit(state, damagePoint, swipingWeaponType)

            return handleFunc(state)
        },
        handleHitArmy(
            (state: state, handleFunc, position,
                pointBox: Box3,
                direction: [number, number, number]
            ) => {
                state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                    SoundManager.buildNeedToPlaySoundData(getSwipingEmmitGirlSoundResourceId(), getIsDebug(state), getLittleManVolume(state, damagePoint))
                ))


                state = _emitHit(state, damagePoint, swipingWeaponType)

                return handleFunc(state)
            },
        ),
        (state: state, handleFunc, position,
            pointBox: Box3,
            direction: [number, number, number]
        ) => {
            return handleFunc(state)
        },
        (state, particle) => {
            return state
        },
    ],
        swipingForce,
        swipingWeaponType,
        damageType.Direct,
        damageBox,
        damageBox,
        damagePoint.toArray(),
        damagePoint,
        buildFakeBulletParticle(forceDirection.toArray(), getName()),
        true,
        true
    ).then(TupleUtils.getTuple2First)
}
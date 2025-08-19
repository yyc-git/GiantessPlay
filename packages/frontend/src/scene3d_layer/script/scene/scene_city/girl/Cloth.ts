import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getCurrentMMDCharacterName, getFullHp, getGirlMesh, getGirlState, getHp, getName, getValue } from "./Girl";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { setMaterialVisibleByName } from "../utils/MMDUtils";
import { clothName, collisionPart, damagePart } from "../type/StateType";
import { getScale, isCanStressing } from "./Utils";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { Vector3 } from "three";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getClothDestroyedSoundResourceId, getConfigData } from "../CityScene";
import { getIsDebug } from "../../Scene";
import { getGirlVolume } from "../utils/SoundUtils";
import { isNotDamageState } from "../utils/FSMStateUtils";
import { getStateMachine, setStateMachine } from "./FSMState";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { getBody } from "../data/mmd/MMDData";
import { getCollisionPartOBB } from "./Collision";
// import { findMeshByMaterialName } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils";

// const _q = new Quaternion();
// const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


export let hideCloth = (state: state, name: clothName) => {
    // NullableUtils.getExn(Object3DUtils.findObjectByName(getGirlMesh(state), name)).visible = false
    // NullableUtils.getExn(findMeshByMaterialName(getGirlMesh(state), name)).visible = false
    setMaterialVisibleByName(getGirlMesh(state), name, false)

    return state
}

export let showCloth = (state: state, name: clothName) => {
    // NullableUtils.getExn(findMeshByMaterialName(getGirlMesh(state), name)).visible = true
    setMaterialVisibleByName(getGirlMesh(state), name, true)

    return state
}


// let _reduceData = (data, func, initialValue) => {
// //TODO implement
// return {} as any
// }

// let _isBelongToDamagePart = (data, collisionPart_, damagePart) => {
//     return !NullableUtils.isNullable(data.find(d => {
//         if( d.collisionPart.includes(collisionPart_) && d.damagePart == damagePart){
//             return true
//         }

//         return _isBelongToDamagePart( d.children, collisionPart_, damagePart)
//     }))
// }

// export let isBelongToDamagePart = (collisionPart_, damagePart) => {
//     return !NullableUtils.isNullable(_getData().find(d => {
//         return d.collisionPart.includes(collisionPart_) && d.damagePart == damagePart
//     }))
// }

let _getDamagePartByCollisionPart = (result, data, state: state, collisionPart_) => {
    return data.reduce((result, d) => {
        if (d.collisionPart.includes(collisionPart_)) {
            result = [d.damagePart,
            NullableUtils.getWithDefault(
                d.damageParts,
                [d.damagePart],
            )]

            if (getHp(state, d.damagePart) <= 0) {
                return _getDamagePartByCollisionPart(result, d.children, state, collisionPart_)
            }

            return result
        }

        return result
    }, result)
}

export let getDamagePartByCollisionPart = (state: state, collisionPart_: collisionPart): [damagePart, Array<damagePart>] => {
    // return _getDamagePartByCollisionPart([getBody(), [getBody()]], NullableUtils.getExn(getClothCollisionData().find(d => d.mmdCharacter == getCurrentMMDCharacterName(state))).data, state, collisionPart_)
    let clothCollisionData = getConfigData(state).clothCollisionData

    return _getDamagePartByCollisionPart([getBody(), [getBody()]],
        NullableUtils.getWithDefault(
            NullableUtils.map(d => d.data,
                clothCollisionData.find(d => d.mmdCharacter == getCurrentMMDCharacterName(state))
            ),
            []
        ), state, collisionPart_)
}

export let getDamagePartByJudge = (state: state, damagePart, actuallyDamageParts): [damagePart, Array<damagePart>] => {
    if (getScale(state) < getValue(state).minScale * 4
        || getHp(state, damagePart) <= 0) {
        return [getBody(), [getBody()]]
    }

    return [damagePart, actuallyDamageParts]
}

export let getDamagePartByJudgeWithoutJudgeScale = (state: state, damagePart, actuallyDamageParts): [damagePart, Array<damagePart>] => {
    if (getHp(state, damagePart) <= 0) {
        return [getBody(), [getBody()]]
    }

    return [damagePart, actuallyDamageParts]
}

export let isCloth = (damagePart_) => {
    return damagePart_ != getBody()
}

let _convertDamagePartToClothName = (damagePart): clothName => {
    if (damagePart == getBody()) {
        throw new Error("err")
    }

    return damagePart
}

export let handleClothDestroyed = (state: state,
    [createStressingStateFunc, isCanStressingFunc],
    damagePosition: Vector3, collisionPart_, damageParts: Array<damagePart>): Promise<state> => {
    let sizeLength = getCollisionPartOBB(state, collisionPart_).getSize(_v1).length()

    state = setAbstractState(state, ParticleManager.emitClothDestroyed(getAbstractState(state),
        {
            speed: 1,
            life: 1000,
            size: 5 * sizeLength,
            position: damagePosition.toArray()
        }
    ))

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getClothDestroyedSoundResourceId(), getIsDebug(state), getGirlVolume(state))))


    state = damageParts.reduce((state, damagePart) => {
        return hideCloth(state, _convertDamagePartToClothName(damagePart))
    }, state)


    let stateMachine = getStateMachine(state)
    if (isCanStressingFunc(state, stateMachine)) {
        return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
            return setStateMachine(state, stateMachine)
        }, stateMachine, createStressingStateFunc(), getName(), collisionPart_)
    }

    return Promise.resolve(state)
}

export let getHpData = (state: state) => {
    return NullableUtils.getExn(NullableUtils.getExn(getConfigData(state).clothHpData).find(d => d.mmdCharacter == getCurrentMMDCharacterName(state))).data
}

export let isClothsDestroyed = (state: state, damageParts) => {
    return damageParts.filter(damagePart => {
        return getHp(state, damagePart) > 0
    }).length == 0
}
import { name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "../../../../type/StateType";
import { isSoldier } from "../manage/city1/soldier/Soldier";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Vector3 } from "three";
import { weaponType, weaponValue } from "../data/ValueType";
import { damageType } from "../type/StateType";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getHitHeadSoundResourceId, getHitWeaknessSoundResourceId } from "../CityScene";
import { getIsDebug } from "../../Scene";
import { getOriginSystemVolume, getVolume } from "./SoundUtils";
import { armorRatio, armorType } from "../data/DataType";
import { getRenderSetting } from "../../../../mod/SettingMod";
import { isEliteGiantess } from "../../../../mod/EliteGiantessMod";
import { isPlayer } from "./PlayerUtils";
import { getAddHitEffectFunc, removeAddHitEffectFunc } from "../manage/city1/Army";
import { getAddHitEffectFunc as getAddHitEffectFuncGirl, removeAddHitEffectFunc as removeAddHitEffectFuncGirl } from "../girl/Girl";

let _emitByArmorType = (state, damagePosition, armorType_) => {
    // switch (armorType_) {
    //     case armorRatio.None:
    //     case armorRatio.Light4:
    //     case armorRatio.Light3:
    //     case armorRatio.Light2:
    //     case armorRatio.Light:
    //         return setAbstractState(state, ParticleManager.emitSparkLightHit(getAbstractState(state), {
    //             speed: 1,
    //             life: 600,
    //             size: 5,
    //             position: damagePosition.toArray()
    //         }))
    //     case armorRatio.Middle:
    //     case armorRatio.Heavy:
    //     case armorRatio.VeryHeavy:
    //         return setAbstractState(state, ParticleManager.emitSparkHeavyHit(getAbstractState(state), {
    //             speed: 1,
    //             life: 300,
    //             size: 30,
    //             position: damagePosition.toArray()
    //         }))
    //     default:
    //         throw new Error("err")
    // }


    switch (armorType_) {
        case armorType.Giantess:
        case armorType.LittleMan:
        case armorType.Light:
            return setAbstractState(state, ParticleManager.emitSparkLightHit(getAbstractState(state), {
                speed: 1,
                life: 600,
                size: 5,
                position: damagePosition.toArray()
            }))
        case armorType.Mech:
        case armorType.Building:
        case armorType.Heavy:
            return setAbstractState(state, ParticleManager.emitSparkHeavyHit(getAbstractState(state), {
                speed: 1,
                life: 300,
                size: 30,
                position: damagePosition.toArray()
            }))
    }
}

export let addHitEffectForNotGirl = (state: state, fromName: name, targetName: name, damagePosition: nullable<Vector3>, damageType_, weaponValue_: weaponValue, armorType_: armorType) => {
    // if (weaponValue_.type < weaponType.Light) {
    //     return state
    // }

    let func = getAddHitEffectFunc(state)

    if (!NullableUtils.isNullable(func)) {
        state = NullableUtils.getExn(func)(state, fromName, targetName, damagePosition, damageType_, weaponValue_, armorType_)
    }
    else {
        state = NullableUtils.getWithDefault(
            NullableUtils.map(damagePosition => {
                if (damageType_ == damageType.Weakness) {
                    if (
                        isPlayer(state, fromName)
                        &&
                        (
                            isSoldier(targetName)
                            || isEliteGiantess(state, targetName)
                        )
                    ) {
                        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                            SoundManager.buildNeedToPlaySoundData(getHitHeadSoundResourceId(), getIsDebug(state), getVolume(state, 0.5, damagePosition, 0))
                        ))
                    }
                    else {
                        throw new Error("Err")
                    }
                }

                if (
                    isSoldier(targetName)
                    || isEliteGiantess(state, targetName)
                ) {
                    switch (armorType_) {
                        case armorType.Light:
                            if (getRenderSetting(state).isShowBlood) {
                                return setAbstractState(state, ParticleManager.emitBloodHit(getAbstractState(state), {
                                    speed: 1,
                                    life: 500,
                                    size: 10,
                                    position: damagePosition.toArray()
                                }))
                            }

                            return state
                    }

                    return setAbstractState(state, ParticleManager.emitSparkLightHit(getAbstractState(state), {
                        speed: 1,
                        life: 600,
                        size: 5,
                        position: damagePosition.toArray()
                    }))
                }

                return _emitByArmorType(state, damagePosition, armorType_)
                // if (isMilltaryVehicle(targetName)) {
                //     return setAbstractState(state, ParticleManager.emitSparkLightHit(getAbstractState(state), {
                //         speed: 1,
                //         life: 300,
                //         size: 5,
                //         position: damagePosition.toArray()
                //     }))
                // }

                // if (isMilltaryBuilding(targetName) || isStatic(state, targetName)) {
                //     return setAbstractState(state, ParticleManager.emitSparkHeavyHit(getAbstractState(state), {
                //         speed: 1,
                //         life: 600,
                //         size: 30,
                //         position: damagePosition.toArray()
                //     }))
                // }

                // return state
            }, damagePosition),
            state
        )
    }

    return removeAddHitEffectFunc(state)
}

export let addHitEffectForGirl = (state: state, fromName, damagePosition: nullable<Vector3>, damageType_, armorType_: armorType) => {
    let func = getAddHitEffectFuncGirl(state)

    if (!NullableUtils.isNullable(func)) {
        state = NullableUtils.getExn(func)(state, fromName, damagePosition, damageType_, armorType_)
    }
    else {
        state = NullableUtils.getWithDefault(
            NullableUtils.map(damagePosition => {
                if (damageType_ == damageType.Weakness
                    && isPlayer(state, fromName)
                ) {
                    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                        SoundManager.buildNeedToPlaySoundData(getHitWeaknessSoundResourceId(), getIsDebug(state), getVolume(state, 0.5, damagePosition, 0))
                    ))

                    return setAbstractState(state, ParticleManager.emitWeaknessHit(getAbstractState(state), {
                        speed: 1,
                        life: 800,
                        size: 10,
                        position: damagePosition.toArray()
                    }))
                }

                return _emitByArmorType(state, damagePosition, armorType_)
            }, damagePosition),
            state
        )
    }

    return removeAddHitEffectFuncGirl(state)
}
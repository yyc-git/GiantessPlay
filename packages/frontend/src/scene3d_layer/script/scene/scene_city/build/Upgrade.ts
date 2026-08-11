import { NumberUtils } from "meta3d-jiehuo-abstract";
import { cameraType, state } from "../../../../type/StateType";
import { getConfigData, getUpgradeResourceId, isGiantessCharacterType, isLittleCharacterType, setConfigData } from "../CityScene";
import { buildData, getBuildData, giantessUpgradeName, littleManUpgradeName, upgradeFuncData, upgradeName, upgradeStoreData, upgradeType } from "../data/build/BuildData";
import { getBuildState, setBuildState } from "./Build";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { Event } from "meta3d-jiehuo-abstract";
import { buildShowUITipEventData, buildUpgradeEventData, getShowUITipEventName, getUpgradeEventName } from "../../../../utils/EventUtils";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getIsDebug } from "../../Scene";
import { getSystemVolume } from "../utils/SoundUtils";
import { buildFuncData, funcData } from "../data/FuncData";
import { autoDifficulty, level, upgradeInteractionWay, usedGirlEnum } from "../type/StateType";
import { isEnteringNextLevel } from "../manage/mission/Mission";
import { getAutoDifficulty } from "../difficulty/Difficulty";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { setGirlScale, getValue, setGirlScaleAndKeepCamera, hasGirlValue, isGirl, isUseGirl } from "../girl/Girl";
import { computeHeight, getScale } from "../girl/Utils";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { Camera } from "meta3d-jiehuo-abstract";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getClickSmallSoundResourceId } from "../../../../../business_layer/Loader";
import { modProtocolName } from "../../../../mod/data/ModData";
import { getModAPI } from "../Mod";
import { getEffectUpgradeBlockName, getShareBlockName } from "../../../../mod/ParticleMod";
import { getPlayerHeight, getPlayerPosition } from "../utils/PlayerUtils";
import { Vector3 } from "three";
import { getTipCache, setTipCache } from "meta3d-jiehuo-abstract/src/storage/Storage";
import { getLanguageTextData, languageKey } from "../../../../internation/Data";
import { isLittleMan } from "../little_man/LittleMan";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { Scene } from "meta3d-jiehuo-abstract";
import { getIsShowUpgradeParticle } from "../UI";
import { getCameraType as getGiantessCameraType, updateFirstPersonControls as updateFirstPersonControlsGiantess } from "../Camera";
import { getCameraType as getLittleManCameraType, lookat, updateFirstPersonControls as updateFirstPersonControlsLittleMan } from "../LittleManCamera";
import { Device } from "meta3d-jiehuo-abstract";

const _v1 = new Vector3();
const _v2 = new Vector3();

export let getLittleManExperienceValue = (state: state) => {
    return getBuildState(state).level.littleMan.experienceValue
}

export let getGiantessExperienceValue = (state: state) => {
    return getBuildState(state).level.giantess.experienceValue
}

let _setLittleManExperienceValue = (state: state, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            littleMan: {
                ...getBuildState(state).level.littleMan,
                experienceValue: value
            }
        }
    })
}

let _setGiantessExperienceValue = (state: state, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            giantess: {
                ...getBuildState(state).level.giantess,
                experienceValue: value
            }
        }
    })
}

let _attenuationByHeight = (state: state, usedGirl, experienceValue: number) => {
    if (!isUseGirl(state, usedGirl)) {
        return experienceValue
    }

    // experienceValue /= Math.cbrt(computeHeight(state, usedGirl))
    // experienceValue /= NumberUtils.greaterThan(Math.sqrt(computeHeight(state, usedGirl)) * 0.1, 1)
    experienceValue /= NumberUtils.clamp(Math.sqrt(computeHeight(state, usedGirl)) * 0.1, 1, 4)

    // return Math.round(experienceValue)
    return experienceValue
}

export let setExperienceValue = (state, usedGirl, name, experienceValue) => {
    if (isLittleMan(name)) {
        state = _setLittleManExperienceValue(state, getLittleManExperienceValue(state) + experienceValue)
    }
    else if (isGirl(name)) {
        state = _setGiantessExperienceValue(state, getGiantessExperienceValue(state) + _attenuationByHeight(state, usedGirl, experienceValue))
    }

    return state
}

export let getLevelByCharacter = (state: state, characterType_) => {
    switch (characterType_) {
        case characterType.LittleMan:
            return getBuildState(state).level.littleMan.level
        case characterType.Giantess:
            return getBuildState(state).level.giantess.level
    }
}


export let getLevel = (state: state) => {
    if (isLittleCharacterType(state)) {
        return getLevelByCharacter(state, characterType.LittleMan)
    }

    return getLevelByCharacter(state, characterType.Giantess)
}

let _setLevel = (state: state, level) => {
    if (isLittleCharacterType(state)) {
        return setBuildState(state, {
            ...getBuildState(state),
            level: {
                ...getBuildState(state).level,
                littleMan: {
                    ...getBuildState(state).level.littleMan,
                    level
                }
            }
        })
    }

    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            giantess: {
                ...getBuildState(state).level.giantess,
                level
            }
        }
    })
}

let _getLastExperienceValueWhenUpgradeLevel = (state: state) => {
    if (isLittleCharacterType(state)) {
        return getBuildState(state).level.littleMan.lastExperienceValueWhenUpgradeLevel
    }

    return getBuildState(state).level.giantess.lastExperienceValueWhenUpgradeLevel
}

let _setLastExperienceValueWhenUpgradeLevel = (state: state, value) => {
    if (isLittleCharacterType(state)) {
        return setBuildState(state, {
            ...getBuildState(state),
            level: {
                ...getBuildState(state).level,
                littleMan: {
                    ...getBuildState(state).level.littleMan,
                    lastExperienceValueWhenUpgradeLevel: value
                }
            }
        })
    }

    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            giantess: {
                ...getBuildState(state).level.giantess,
                lastExperienceValueWhenUpgradeLevel: value
            }
        }
    })
}

// let _computeLevel = (state: state, exprienceValue) => {
//     if (exprienceValue == 0) {
//         return 1
//     }

//     return Math.ceil(exprienceValue / getOneLevelExperienceValue(state))
// }

let _upgradeOneLevel = (state: state) => {
    // if (exprienceValue == 0) {
    //     return 1
    // }

    // return Math.ceil(exprienceValue / getOneLevelExperienceValue(state))
    let experienceValue
    if (isLittleCharacterType(state)) {
        experienceValue = getLittleManExperienceValue(state)
    }
    else {
        experienceValue = getGiantessExperienceValue(state)
    }



    let oneLevelExperienceValue = getOneLevelExperienceValue(state)

    if (experienceValue - _getLastExperienceValueWhenUpgradeLevel(state) > oneLevelExperienceValue) {
        state = _setLevel(state, getLevel(state) + 1)

        state = _setLastExperienceValueWhenUpgradeLevel(state, _getLastExperienceValueWhenUpgradeLevel(state) + oneLevelExperienceValue)

        if (!NumberUtils.isRandomRate(_computeSelectItemRate(state))) {
            state = _setLastHandledLevelForSelectItem(state, _getLastHandledLevelForSelectItem(state) + 1)
        }
    }

    return state
}

// let _computeLevelExprienceValue = (state, level) => {
//     return level * getOneLevelExperienceValue(state)
// }

export let getOneLevelExperienceValue = (state: state) => {
    // let factor
    // // if (isLittleCharacterType(state)) {
    // //     factor = 1
    // // }
    // // else {
    // //     // factor = 2
    // //     factor = 1.2
    // // }
    // factor = 1

    // switch (getAutoDifficulty(state)) {
    //     case autoDifficulty.VeryEasy:
    //         return 5
    //     case autoDifficulty.Easy:
    //         return 15
    //     case autoDifficulty.Middle:
    //         return 20
    //     case autoDifficulty.Hard:
    //     case autoDifficulty.VeryHard:
    //         return 25
    // }
    let level = getLevel(state)
    // let oneLevelExperienceValue
    // if (level <= 3) {
    //     oneLevelExperienceValue = 5
    // }
    // else if (level <= 6) {
    //     oneLevelExperienceValue = 10
    // }
    // else if (level <= 9) {
    //     oneLevelExperienceValue = 15
    // }
    // else if (level <= 12) {
    //     oneLevelExperienceValue = 20
    // }
    // else {
    //     if (isLittleCharacterType(state)) {
    //         oneLevelExperienceValue = 25
    //     }
    //     else {
    //         oneLevelExperienceValue = 35
    //     }
    // }
    // oneLevelExperienceValue = NumberUtils.clamp(5 + 5 * Math.floor(level / 3), 5, 150)

    // let factor
    // if (level <= 12) {
    //     factor = 5
    // }
    // else {
    //     factor = 3
    // }

    // oneLevelExperienceValue = NumberUtils.clamp(5 + factor * Math.floor(level / 3), 5, 130)


    // let factor
    // if (level <= 12) {
    //     factor = 1
    // }
    // else if (level <= 24) {
    //     factor = 2
    // }
    // else if (level <= 36) {
    //     factor = 3
    // }

    // oneLevelExperienceValue = NumberUtils.clamp(5 + factor * level, 5, 130)
    // let base, factor
    // // 33
    // if (level <= 20) {
    //     base = 1.1
    //     factor = 0
    // }
    // 35+ 24 =55
    // else if (level <= 50) {
    //     base = 1.05
    //     factor = 20
    // }
    // oneLevelExperienceValue = 5 * Math.pow(1.1, level - 1)


    // return Math.round(oneLevelExperienceValue * factor)
    // return Math.round(oneLevelExperienceValue)

    /*! refer to:
    https://chat.deepseek.com/a/chat/s/7e7e0c54-ba7b-4203-9743-f1211b50a990
    * 
    */

    const baseExp = 5;
    const growthRate = 1.0455;
    const expNeeded = baseExp * Math.pow(growthRate, level - 1);

    // 返回四舍五入后的整数值
    // return NumberUtils.lessThan(Math.round(expNeeded), 130)
    return NumberUtils.lessThan(Math.round(expNeeded), 200)

    // // 参数校准
    // const A = 2.8;
    // const B = 1.45;
    // const C = 0.8;
    // const D = 1.08;
    // const E = 15;

    // // 计算经验值
    // const polynomialPart = A * Math.pow(level, B);
    // const exponentialPart = C * Math.pow(D, level / E);
    // const expNeeded = polynomialPart + exponentialPart;

    // // 返回四舍五入后的整数值
    // return NumberUtils.lessThan(Math.round(expNeeded), 800)


    // // 参数校准
    // const A = 0.7;
    // const B = 1.65;

    // // 计算经验值
    // const expNeeded = A * Math.pow(level, B);

    // // 返回四舍五入后的整数值
    // // return Math.round(expNeeded);
    // return NumberUtils.lessThan(Math.round(expNeeded), 600)

    // // 参数校准
    // const A = 0.8;
    // const B = 1.55;

    // // 计算经验值
    // const expNeeded = A * Math.pow(level, B);

    // // 返回四舍五入后的整数值
    // // return Math.round(expNeeded);
    // return NumberUtils.lessThan(Math.round(expNeeded), 430)


    // // 参数校准
    // const A = 1.0;
    // const B = 1.45;

    // // 计算经验值
    // const expNeeded = A * Math.pow(level, B);

    // // 返回四舍五入后的整数值
    // // return Math.round(expNeeded);
    // return NumberUtils.lessThan(Math.round(expNeeded), 260)
}


let _randomSelectItem = (result, state: state, validData: Array<upgradeFuncData>, type: upgradeType, characterLevel, isFilterSkill = false) => {
    // let funcData = buildFuncData(state)

    // let validData
    // if (getIsDebug(state)) {
    //     validData = data
    // }
    // else {
    //     validData = data.filter(d => d.conditionFunc(state, funcData, {
    //         level: d.level,
    //         characterLevel: characterLevel
    //     }))
    // }
    let typeValidData
    if (type == upgradeType.All) {
        typeValidData = validData
    }
    else {
        typeValidData = validData.filter(d => d.type == type)
    }

    let resultValidData
    if (typeValidData.length == 0) {
        if (isFilterSkill) {
            resultValidData = validData.filter(d => d.type != upgradeType.Skill)
            if (resultValidData.length == 0) {
                resultValidData = validData
            }
        }
        else {
            resultValidData = validData
        }
    }
    else {
        resultValidData = typeValidData
    }



    if (resultValidData.length == 0) {
        return [result, validData]
    }

    // let item: upgradeFuncData
    // do {
    //     item = resultValidData[NumberUtils.getRandomInteger(0, resultValidData.length - 1)]

    //     item = {
    //         ...item,
    //         level: NullableUtils.getWithDefault(
    //             NullableUtils.map(d => {
    //                 return d.level + 1
    //             }, upgradeFuncs.find(d => d.name == item.name)),
    //             1
    //         )
    //     }
    // } while (item.level <= item.maxLevel)

    let r = resultValidData[NumberUtils.getRandomInteger(0, resultValidData.length - 1)]
    return [
        ArrayUtils.push(result, r),
        validData.filter(d => d.name != r.name)
    ]
}

let _randomSelectAtMostFourItems = (state: state, characterLevel, isSelectAll = false): Array<upgradeStoreData> => {
    let data = _findSelectItems(state, characterLevel)

    // if (characterLevel % 2 != 0) {
    //     return []
    // }

    let result, newData

    if (isSelectAll) {
        let d = ArrayUtils.range(0, 3).reduce(([result, data], _) => {
            return _randomSelectItem(result, state, data, upgradeType.All, characterLevel, false)
        }, [[], data])
        result = d[0]
        newData = d[1]
    }
    else {
        // if (characterLevel % 3 == 0) {
        // if ((characterLevel - 2) % 3 == 0) {

        // if ((characterLevel / 2) % 2 == 1) {
        if (characterLevel % 2 == 0) {
            let d1 = _randomSelectItem([], state, data, upgradeType.Skill, characterLevel)
            result = d1[0]
            newData = d1[1]
            d1 = _randomSelectItem(result, state, newData, upgradeType.Skill, characterLevel)
            result = d1[0]
            newData = d1[1]
            d1 = _randomSelectItem(result, state, newData, upgradeType.Skill, characterLevel)
            result = d1[0]
            newData = d1[1]
            d1 = _randomSelectItem(result, state, newData, upgradeType.Skill, characterLevel)
            result = d1[0]
            newData = d1[1]
        }
        else {
            let d1 = _randomSelectItem([], state, data, upgradeType.Attack, characterLevel, true)
            result = d1[0]
            newData = d1[1]

            let d2 = _randomSelectItem(result, state, newData, upgradeType.Other, characterLevel, true)
            result = d2[0]
            newData = d2[1]

            let d3 = _randomSelectItem(result, state, newData, upgradeType.Defense, characterLevel, true)
            result = d3[0]
            newData = d3[1]

            let d4 = _randomSelectItem(result, state, newData, upgradeType.Assistant, characterLevel, true)
            result = d4[0]
            newData = d4[1]
        }
    }

    let funcData = buildFuncData(state)

    return ArrayUtils.removeDuplicateItemsWithBuildKeyFunc(result, item => {
        return item.name
    }).map(item => {
        return {
            name: item.name,
            title: item.title,
            imageSrc: item.imageSrc,
            type: item.type,
            level: item.level,
            maxLevel: item.maxLevel,
            // characterLevel: computeLevel(state),
            description: item.getDescriptionFunc(state, funcData, item.level)
        }
    })
}

let _addOrUpdateItem = (upgradeFuncs, item: upgradeFuncData) => {
    let hasData = false
    upgradeFuncs = upgradeFuncs.map(d => {
        if (d.name == item.name) {
            hasData = true

            return {
                ...d,
                level: item.level
            }
        }

        return d
    })

    if (!hasData) {
        upgradeFuncs = ArrayUtils.push(upgradeFuncs, item)
    }

    return upgradeFuncs
}

// export let applyItem = (state: state, name: giantessUpgradeName | littleManUpgradeName) => {
export let applyItem = (state: state, upgradeStoreData: upgradeStoreData, usedGirl) => {
    let buildData = NullableUtils.getExn(getConfigData(state).buildData)
    let data
    if (isLittleCharacterType(state)) {
        data = buildData.littleManUpgradeFuncs
    }
    else {
        data = buildData.giantessUpgradeFuncs
    }

    let item = NullableUtils.getExn(data.find(d => d.name == upgradeStoreData.name))
    item = {
        ...item,
        level: upgradeStoreData.level
    }

    let funcData = buildFuncData(state)

    // let usedGirl

    return NullableUtils.getWithDefault(
        NullableUtils.map(deupgradeFunc => {
            if (item.level == 1) {
                return Promise.resolve(state)
            }

            return deupgradeFunc(state, funcData, item.level - 1, usedGirl)
        }, item.deupgradeFunc),
        Promise.resolve(state)
    ).then(state => {
        return item.upgradeFunc(state, funcData, item.level, usedGirl)
    }).then(state => {
        if (isLittleCharacterType(state)) {
            return setBuildState(state, {
                ...getBuildState(state),
                level: {
                    ...getBuildState(state).level,
                    littleManUpgradeFuncs: _addOrUpdateItem(getBuildState(state).level.littleManUpgradeFuncs, item)
                }
            })
        }

        return setBuildState(state, {
            ...getBuildState(state),
            level: {
                ...getBuildState(state).level,
                giantessUpgradeFuncs: _addOrUpdateItem(getBuildState(state).level.giantessUpgradeFuncs, item)
            }
        })
    })
}

export let applyAllUpgradeFuncs = (state: state, isSkipGiantess) => {
    let funcData = buildFuncData(state)

    state = setIsApplying(state, true)

    return ArrayUtils.reducePromise(getBuildState(state).level.littleManUpgradeFuncs, (state, item) => {
        return item.upgradeFunc(state, funcData, item.level, usedGirlEnum.None)
    }, state).then(state => {
        if (isSkipGiantess) {
            return state
        }

        return ArrayUtils.reducePromise(getBuildState(state).level.giantessUpgradeFuncs, (state, item) => {
            return item.upgradeFunc(state, funcData, item.level, usedGirlEnum.PlayerGirl)
        }, state)
    }).then(state => {
        return setIsApplying(state, false)
    })
}

export let increaseAttribute = (state: state) => {
    state = _increaseLittleManAttribute(state, getLevelByCharacter(state, characterType.LittleMan) - 1)
    state = increaseGirlAttribute(state, getLevelByCharacter(state, characterType.Giantess) - 1)

    return state
}


// let _buildTipKey = () => `tipCache_upgrade`

// export let getUpgradeDataFromBackend = (state: state) => {
//     return getTipCache(_buildTipKey()).then(isGiveTipOnce => {
//         return NullableUtils.getWithDefault(NullableUtils.map(isGiveTipOnce => {
//             return setBuildState(state, {
//                 ...getBuildState(state),
//                 level: {
//                     ...getBuildState(state).level,
//                     isGiveTipOnce
//                 }
//             })
//         }, isGiveTipOnce), state)
//     })
// }

let _upgrade = (state: state) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getUpgradeResourceId(), getIsDebug(state), getSystemVolume(state))
    ))

    let api = getModAPI(state)

    if (getIsShowUpgradeParticle(state)) {
        // let size = getPlayerHeight(state) * 5
        let size = getPlayerHeight(state) * 4

        state = api.blockAPI.getBlockService<any>(state, modProtocolName.ParticleShareProtocol, getShareBlockName()).emit(state,
            [
                api.blockAPI.getBlockService(state, modProtocolName.ParticleProtocol, getEffectUpgradeBlockName()),
                state => api.blockAPI.getBlockState<any>(state, modProtocolName.ParticleProtocol, getEffectUpgradeBlockName()),
                (state, blockState) => {
                    return api.blockAPI.setBlockState(state, modProtocolName.ParticleProtocol, getEffectUpgradeBlockName(), blockState)
                }
            ],
            api.blockAPI.getBlockService<any>(state, modProtocolName.ParticleProtocol, getEffectUpgradeBlockName()).getParticleType(),
            {
                speed: 1,
                life: 1000,
                size: size,
                // position: getPlayerPosition(state).clone().add(_v1.set(0, size / 4 - getPlayerHeight(state) / 3, 0)).toArray(),
                // position: getPlayerPosition(state).clone().add(_v1.set(0, getPlayerHeight(state) / 2, 0)).toArray(),
                // position: getPlayerPosition(state).clone().add(_v1.set(0, getPlayerHeight(state) / 1.5, 0)).toArray(),
                getPositionFunc: state => {
                    return getPlayerPosition(state).clone().add(_v1.set(0, getPlayerHeight(state) / 1.5, 0)).toArray()
                }
                // position: getPlayerPosition(state).toArray(),
            })
    }

    // if (!getBuildState(state).level.isGiveTipOnce) {
    //     state = setBuildState(state, {
    //         ...getBuildState(state),
    //         level: {
    //             ...getBuildState(state).level,
    //             isGiveTipOnce: true
    //         }
    //     })

    //     return Event.trigger<state>(state, getAbstractState, getShowUITipEventName(), buildShowUITipEventData(
    //         getLanguageTextData(state, languageKey.UpgradeTip),
    //         () => {
    //             return setTipCache(_buildTipKey(), true)
    //         }
    //     ))
    // }

    return Promise.resolve(state)

    // let data = _randomSelectAtMostFourItems(state, characterLevel)

    // if (data.length > 0) {
    //     state = setIsWait(state, true)

    //     return Event.trigger(state, getAbstractState, getUpgradeEventName(), buildUpgradeEventData(
    //         // ArrayUtils.range(0, upgradeLevelCount - 1).reduce((result, _) => {
    //         //     return ArrayUtils.pushArrs(result, _randomSelectAtMostFourItems(state))
    //         // }, [])
    //         data
    //     ))
    // }
}

export let computeIncreaseFactor = (increasedFactor, level) => {
    // let bigLevel = _getMaxLevel()
    let bigLevel = 80

    let factor
    if (level > bigLevel) {
        // factor = increasedFactor / 2
        factor = increasedFactor
    }
    // else if (level > bigLevel / 1.2) {
    //     factor = increasedFactor
    // }
    else if (level > bigLevel / 1.5) {
        factor = increasedFactor / 1.5
    }
    else if (level > bigLevel / 2) {
        factor = increasedFactor / 2
    }
    else if (level > bigLevel / 4) {
        factor = increasedFactor / 2.5
    }
    else if (level > bigLevel / 8) {
        factor = increasedFactor / 3
    }
    else {
        // factor = increasedFactor / 1.8
        factor = increasedFactor / 3.5
    }

    return factor
    // return increasedFactor
}

let _computeAttributeFactor = (state) => {
    // let level = getLevel(state)
    // let factor
    // if (level <= 15) {
    //     factor = 1
    // }
    // else if (level <= 30) {
    //     // factor = 2
    //     // factor = 1.4
    //     factor = 1.3
    // }
    // // else if (level <= 50) {
    // //     // factor = 3 * 
    // //     factor = 2 
    // // }
    // // else if (level <= 80) {
    // //     // factor = 4
    // //     factor = 3.1 * 0.66
    // // }
    // // else {
    // //     // factor = 5
    // //     factor = 3.8 * 0.66
    // // }
    // // else if (level <= 80) {
    // //     factor = 2
    // // }
    // else {
    //     // factor = 2.5
    //     factor = 2
    // }

    // return factor
    return 1
}

let _increaseLittleManAttribute = (state: state, level) => {
    let funcData = buildFuncData(state)

    let factor = _computeAttributeFactor(state)

    // level -= 1

    state = funcData.LittleManBuildUtils.setHp(state, funcData, (state, hp) => {
        // return hp + 5 * level
        // return hp + 10 * level
        return hp + 20 * level * factor
    })
    state = funcData.LittleManBuildUtils.setAttackFactor(state, funcData, (state, attackFactor) => {
        // return attackFactor + computeIncreaseFactor(0.15, level) * level
        return attackFactor + computeIncreaseFactor(0.1, level) * level * factor
        // return attackFactor + computeIncreaseFactor(0.07, level) * level
        // return attackFactor * (1 + computeIncreaseFactor(0.05, level) * level)
    })
    state = funcData.LittleManBuildUtils.setDefenseFactor(state, funcData, (state, defenseFactor) => {
        // if (defenseFactor >= 0.6) {
        // if (defenseFactor >= 0.8) {
        //     return defenseFactor
        // }

        return defenseFactor + computeIncreaseFactor(0.015, level) * level * factor
        // return defenseFactor + computeIncreaseFactor(0.01, level) * level
        // return defenseFactor * (1 + computeIncreaseFactor(0.05, level) * level)
    })

    return state
}

export let increaseGirlAttribute = (state: state, level, usedGirl_ = usedGirlEnum.PlayerGirl) => {
    if (!hasGirlValue(state, usedGirl_)) {
        return state
    }

    let funcData = buildFuncData(state)

    let factor = _computeAttributeFactor(state)

    let scaleIncrease = 0.5 * level * factor

    // let usedGirl = usedGirlEnum.PlayerGirl

    // level -= 1

    state = funcData.GiantessBuildUtils.setFullHp(state, funcData, (state, hp) => {
        // return hp + 30 * level
        return hp + 10 * level * factor
        // return hp + 50 * level
    }, false, usedGirl_)
    state = funcData.GiantessBuildUtils.setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            // scaleIncrease: girlValue.scaleIncrease + scaleIncrease,

            // initialScale: girlValue.initialScale + scaleIncrease,

            // attackFactor: girlValue.attackFactor + level * computeIncreaseFactor(0.03, level),
            // defenseFactor: girlValue.defenseFactor + level * computeIncreaseFactor(0.006, level),
            attackFactor: girlValue.attackFactor + level * computeIncreaseFactor(0.05, level) * factor,
            defenseFactor: girlValue.defenseFactor + level * computeIncreaseFactor(0.006, level) * factor,
        }
    }, usedGirl_)


    // state = setGirlScaleAndKeepCamera(state,usedGirl, getScale(state, usedGirl) + scaleIncrease)
    state = funcData.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, funcData, (state, initialScale) => {
        return initialScale + scaleIncrease
    }, usedGirl_)

    return state
}

let _upgradeLittleMan = (state: state, isNeedUpgrade) => {
    if (!isNeedUpgrade) {
        return Promise.resolve(state)
    }

    state = setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            littleMan: {
                ...getBuildState(state).level.littleMan,
                lastHandledLevelForUpgrade: getBuildState(state).level.littleMan.lastHandledLevelForUpgrade + 1
            }
        }
    })

    // state = _increaseLittleManAttribute(state, 2)
    state = _increaseLittleManAttribute(state, 1)

    return _upgrade(state)
}

let _upgradeGiantess = (state: state, isNeedUpgrade) => {
    if (!isNeedUpgrade) {
        return Promise.resolve(state)
    }

    state = setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            giantess: {
                ...getBuildState(state).level.giantess,
                lastHandledLevelForUpgrade: getBuildState(state).level.giantess.lastHandledLevelForUpgrade + 1
            }
        }
    })

    // state = increaseGirlAttribute(state, 2)
    state = increaseGirlAttribute(state, 1)

    return _upgrade(state)
}

export let getIsWait = (state: state) => {
    return getBuildState(state).level.isWait
}

let _makeCameraNotChangeRotation = (state: state, isWait: boolean) => {
    if (isWait) {
        Camera.getOrbitControls(getAbstractState(state)).saveState()
        state = setBuildState(state, {
            ...getBuildState(state),
            level: {
                ...getBuildState(state).level,
                isSaveState: true
            }
        })
        if ((isLittleCharacterType(state) && getLittleManCameraType(state) == cameraType.FirstPerson)
            || (isGiantessCharacterType(state) && getGiantessCameraType(state) == cameraType.FirstPerson)
        ) {
            state = setBuildState(state, {
                ...getBuildState(state),
                level: {
                    ...getBuildState(state).level,
                    savedfirstPersonControlData: NullableUtils.return_(Camera.getFirstPersonControls(getAbstractState(state)).getLookData())

                }
            })
        }
    }
    // else {
    //     Camera.getOrbitControls(getAbstractState(state)).reset()
    // }

    return state
}

export let setIsWait = (state: state, isWait: boolean) => {
    state = _makeCameraNotChangeRotation(state, isWait)

    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            isWait: isWait
        }
    })
}

// let _getMaxLevel = () => 80

// let _isReachMaxLevel = (state: state) => {
//     return getLevel(state) >= _getMaxLevel()
// }

// export let change = (state: state) => {
//     // state = setBuildState(state, {
//     //     ...getBuildState(state),
//     //     level: {
//     //         ...getBuildState(state).level,
//     //         isSelectItems: false
//     //     }
//     // })

//     let lastHandledLevelForSelectItem = _getLastHandledLevelForSelectItem(state)

//     // if (lastHandledLevelForSelectItem == 1) {
//     //     lastHandledLevelForSelectItem = 2
//     // }
//     // else {
//     //     lastHandledLevelForSelectItem += 2
//     // }


//     // let data = _randomSelectAtMostFourItems(state, _getLastHandledLevelForSelectItem(state) + 1)
//     let data = _randomSelectAtMostFourItems(state, lastHandledLevelForSelectItem)

//     // state = _setLastHandledLevelForSelectItem(state, lastHandledLevelForSelectItem)

//     if (data.length > 0) {
//         state = setIsWait(state, true)

//         return Event.trigger(state, getAbstractState, getUpgradeEventName(), buildUpgradeEventData(data))
//     }

//     return Promise.resolve(state)
// }

export let getNewItems = (state: state) => {
    let lastHandledLevelForSelectItem = _getLastHandledLevelForSelectItem(state)

    if (getIsDebug(state)) {
        return _randomSelectAtMostFourItems(state, lastHandledLevelForSelectItem, false)
    }
    return _randomSelectAtMostFourItems(state, lastHandledLevelForSelectItem, true)
}

export let getChangeNeedCoin = (state: state) => {
    return MutableRecordUtils.getWithDefault(getBuildState(state).level.changeNeedCoin, Scene.getCharacterType(getAbstractState(state)), 1)
}

export let updateChangeNeedCoin = (state: state) => {
    let changeNeedCoin = getChangeNeedCoin(state)
    let result
    if (changeNeedCoin <= 32) {
        result = changeNeedCoin * 2
    }
    else {
        result = Math.round(NumberUtils.lessThan(
            changeNeedCoin * 1.2, 512
        ))
    }

    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            changeNeedCoin: MutableRecordUtils.set(
                getBuildState(state).level.changeNeedCoin,
                Scene.getCharacterType(getAbstractState(state)),
                // NumberUtils.lessThan(getChangeNeedCoin(state) * 2, 1024)
                // NumberUtils.lessThan(getChangeNeedCoin(state) * 2, 256)
                result
            )
        }
    })
}

let _computeSelectItemRate = (state: state) => {
    let level = getLevel(state)

    // if (level <= 10) {
    //     return 1
    // }
    // else if (level <= 20) {
    //     return 0.8
    // }
    // else if (level <= 30) {
    //     return 0.65
    // }
    // else if (level <= 40) {
    //     return 0.5
    // }
    // else if (level <= 80) {
    //     return 0.25
    // }
    // else if (level <= 150) {
    //     return 0.1
    // }
    // else {
    //     return 0.05
    // }

    // if (level <= 20) {
    //     return 1
    // }
    // else if (level <= 80) {
    //     return 0.5
    // }
    // else {
    //     return 0.25
    // }


    if (level <= 3) {
        return 1
    }
    else if (level <= 10) {
        return 0.5
    }
    if (level <= 16) {
        return 0.25
    }
    else if (level <= 50) {
        return 0.5
    }
    else {
        return 1
    }
}


export let updateUpgrade = (state: state) => {
    if (getIsWait(state)
        // || _isReachMaxLevel(state)
    ) {
        return Promise.resolve(state)
    }

    let promise = Promise.resolve(state)
    if (getBuildState(state).level.isSaveState) {
        Camera.getOrbitControls(getAbstractState(state)).reset()

        if (
            (isLittleCharacterType(state) && getLittleManCameraType(state) == cameraType.FirstPerson)
            || (isGiantessCharacterType(state) && getGiantessCameraType(state) == cameraType.FirstPerson)
        ) {
            let data = NullableUtils.getExn(getBuildState(state).level.savedfirstPersonControlData)

            Camera.getFirstPersonControls(getAbstractState(state)).setLookat(data[0], data[1])
            Camera.getFirstPersonControls(getAbstractState(state)).resetPointerData()

            promise = Camera.update(getAbstractState(state)).then(abstractState => {
                return setAbstractState(state, abstractState)
            }).then(state => {
                if (isLittleCharacterType(state)) {
                    state = updateFirstPersonControlsLittleMan(state)
                }
                else {
                    state = updateFirstPersonControlsGiantess(state)
                }

                return state
            })
        }

        promise = promise.then(state => {
            return setBuildState(state, {
                ...getBuildState(state),
                level: {
                    ...getBuildState(state).level,
                    isSaveState: false,
                    savedfirstPersonControlData: NullableUtils.getEmpty()
                }
            })
        })
    }
    // if (!isCanSelectItems(state)) {
    //     state = setBuildState(state, {
    //         ...getBuildState(state),
    //         level: {
    //             ...getBuildState(state).level,
    //             isSelectItems: false
    //         }
    //     })
    // }

    return promise.then(state => {
        let condition
        switch (getUpgradeInteractionWay(state)) {
            case upgradeInteractionWay.Manual:
                condition = getBuildState(state).level.isSelectItems
                if (condition) {
                    state = setBuildState(state, {
                        ...getBuildState(state),
                        level: {
                            ...getBuildState(state).level,
                            isSelectItems: false
                        }
                    })
                }
                break
            case upgradeInteractionWay.Auto:
                condition = getLevel(state) > _getLastHandledLevelForSelectItem(state) && _findSelectItems(state, getLevel(state)).length > 0
                break
            default:
                throw new Error("error")
        }

        if (condition) {
            let lastHandledLevelForSelectItem = _getLastHandledLevelForSelectItem(state)

            lastHandledLevelForSelectItem += 1

            let data = _randomSelectAtMostFourItems(state, lastHandledLevelForSelectItem)

            state = _setLastHandledLevelForSelectItem(state, lastHandledLevelForSelectItem)

            if (data.length > 0) {
                state = setIsWait(state, true)

                return Event.trigger(state, getAbstractState, getUpgradeEventName(), buildUpgradeEventData(data))
            }
        }

        state = _upgradeOneLevel(state)

        if (isLittleCharacterType(state)) {
            return _upgradeLittleMan(state, getLevel(state) > getBuildState(state).level.littleMan.lastHandledLevelForUpgrade)
        }

        return _upgradeGiantess(state, getLevel(state) > getBuildState(state).level.giantess.lastHandledLevelForUpgrade)
    })
}

// export let computeLittleManLevel = (state: state) => {
//     return _computeLevel(state, getLittleManExperienceValue(state))
// }

// export let computeGiantessLevel = (state: state) => {
//     return _computeLevel(state, getGiantessExperienceValue(state))
// }

// export let computeLevel = (state: state) => {
//     if (isLittleCharacterType(state)) {
//         return computeLittleManLevel(state)
//     }

//     return computeGiantessLevel(state)
// }

export let computeLevelProgressRatio = (state: state) => {
    let experienceValue
    if (isLittleCharacterType(state)) {
        experienceValue = getLittleManExperienceValue(state)
    }
    else {
        experienceValue = getGiantessExperienceValue(state)
    }

    // let level = _computeLevel(state, experienceValue)

    // return (experienceValue - _computeLevelExprienceValue(state, level - 1)) /
    //     (
    //         _computeLevelExprienceValue(state, level) - _computeLevelExprienceValue(state, level - 1)
    //     )
    return NumberUtils.lessThan((experienceValue - _getLastExperienceValueWhenUpgradeLevel(state)) / getOneLevelExperienceValue(state), 1)

}

let _getGiantessUpgradeFuncs = (state: state) => {
    return getBuildState(state).level.giantessUpgradeFuncs
}

let _setGiantessUpgradeFuncs = (state: state, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            giantessUpgradeFuncs: value
        }
    })
}

// export let setGiantessUpgradeLevel = (state: state, name: giantessUpgradeName, level: number) => {
//     return _setGiantessUpgradeFuncs(state, _getGiantessUpgradeFuncs(state).map(upgradeFuncData => {
//         if (upgradeFuncData.name == name) {
//             return {
//                 ...upgradeFuncData,
//                 level: level,
//             }
//         }
//     }))
// }

// export let removeGiantessUpgrade = (state: state, funcData: funcData, name: giantessUpgradeName) => {
//     return ArrayUtils.reducePromise(
//         _getGiantessUpgradeFuncs(state).filter(upgradeFuncData => {
//             return upgradeFuncData.name == name
//         }),
//         (state, upgradeFuncData) => {
//             return upgradeFuncData.deupgradeFunc(state, funcData, upgradeFuncData.level)
//         },
//         state
//     ).then(state => {
//         return _setGiantessUpgradeFuncs(state, _getGiantessUpgradeFuncs(state).filter(upgradeFuncData => {
//             upgradeFuncData.deupgradeFunc
//             return upgradeFuncData.name != name
//         }))
//     })
// }

export let getIsApplying = (state: state) => {
    return getBuildState(state).level.isApplying
}

export let setIsApplying = (state: state, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            isApplying: value
        }
    })
}

let _getLittleManNotWantCurrentUpgradeItems = (state: state) => {
    return getBuildState(state).level.littleManNotWantCurrentUpgradeItems
}

let _getGiantessNotWantCurrentUpgradeItems = (state: state) => {
    return getBuildState(state).level.giantessNotWantCurrentUpgradeItems
}

// export let addLittleManNotWantCurrentUpgradeItems = (state: state, values) => {
//     return setBuildState(state, {
//         ...getBuildState(state),
//         level: {
//             ...getBuildState(state).level,
//             littleManNotWantCurrentUpgradeItems: ArrayUtils.pushArrs(getBuildState(state).level.littleManNotWantCurrentUpgradeItems, values)
//         }
//     })
// }

// export let addGiantessNotWantCurrentUpgradeItems = (state: state, values) => {
//     return setBuildState(state, {
//         ...getBuildState(state),
//         level: {
//             ...getBuildState(state).level,
//             giantessNotWantCurrentUpgradeItems: ArrayUtils.pushArrs(getBuildState(state).level.giantessNotWantCurrentUpgradeItems, values)
//         }
//     })
// }
export let addNotWantCurrentUpgradeItems = (state: state, values) => {
    if (isLittleCharacterType(state)) {
        return setBuildState(state, {
            ...getBuildState(state),
            level: {
                ...getBuildState(state).level,
                littleManNotWantCurrentUpgradeItems: ArrayUtils.pushArrs(getBuildState(state).level.littleManNotWantCurrentUpgradeItems, values)
            }
        })
    }

    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            giantessNotWantCurrentUpgradeItems: ArrayUtils.pushArrs(getBuildState(state).level.giantessNotWantCurrentUpgradeItems, values)
        }
    })
}

export let removeNotWantCurrentUpgradeItem = (state: state, value) => {
    if (isLittleCharacterType(state)) {
        return setBuildState(state, {
            ...getBuildState(state),
            level: {
                ...getBuildState(state).level,
                littleManNotWantCurrentUpgradeItems: ArrayUtils.filter(getBuildState(state).level.littleManNotWantCurrentUpgradeItems, item => item != value)
            }
        })
    }

    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            // giantessNotWantCurrentUpgradeItems: ArrayUtils.pushArrs(getBuildState(state).level.giantessNotWantCurrentUpgradeItems, values)
            giantessNotWantCurrentUpgradeItems: ArrayUtils.filter(getBuildState(state).level.giantessNotWantCurrentUpgradeItems, item => item != value)
        }
    })
}

export let isNotWant = (state: state, value) => {
    if (isLittleCharacterType(state)) {
        return ArrayUtils.includes(getBuildState(state).level.littleManNotWantCurrentUpgradeItems, value)
    }

    return ArrayUtils.includes(getBuildState(state).level.giantessNotWantCurrentUpgradeItems, value)
}


export let updateLittleManItem = (state: state, func) => {
    let buildData = NullableUtils.getExn(getConfigData(state).buildData)

    return setConfigData(state, {
        ...getConfigData(state),
        buildData: NullableUtils.return_(
            {
                ...buildData,
                littleManUpgradeFuncs: buildData.littleManUpgradeFuncs.map(func),
            }
        )
    })
}

export let updateGiantessItem = (state: state, func: (data: upgradeFuncData) => upgradeFuncData) => {
    let buildData = NullableUtils.getExn(getConfigData(state).buildData)

    return setConfigData(state, {
        ...getConfigData(state),
        buildData: NullableUtils.return_(
            {
                ...buildData,
                giantessUpgradeFuncs: buildData.giantessUpgradeFuncs.map(func),
            }
        )
    })
}


export let createData = (): level => {
    return {
        upgradeInteractionWay: upgradeInteractionWay.Auto,

        isWait: false,
        isSaveState: false,
        savedfirstPersonControlData: NullableUtils.getEmpty(),


        isApplying: false,
        // isGiveTipOnce: false,
        isSelectItems: false,
        changeNeedCoin: MutableRecordUtils.create(),
        littleMan: {
            level: 1,
            experienceValue: 0,
            lastExperienceValueWhenUpgradeLevel: 0,
            lastHandledLevelForUpgrade: 1,
            lastHandledLevelForSelectItem: 1,
        },
        giantess: {
            level: 1,
            experienceValue: 0,
            lastExperienceValueWhenUpgradeLevel: 0,
            lastHandledLevelForUpgrade: 1,
            lastHandledLevelForSelectItem: 1,
        },

        littleManNotWantCurrentUpgradeItems: [],
        giantessNotWantCurrentUpgradeItems: [],

        littleManUpgradeFuncs: [],
        giantessUpgradeFuncs: [],
    }
}

// let _reset = (originUpgradeFuncs: Array<upgradeFuncData>, currentUpgradeFuncs: Array<upgradeFuncData>) => {
//     return currentUpgradeFuncs.map(data => {
//         let originData = NullableUtils.getExn(originUpgradeFuncs.find(d => d.name == data.name))

//         return {
//             ...originData,
//             level: NumberUtils.lessThan(data.level, originData.maxLevel)
//         }
//     })
// }

export let dispose = (state: state): level => {
    if (isEnteringNextLevel(state)) {
        // return setBuildState(state, {
        //     ...getBuildState(state),
        //     level: {
        //         ...createData(),
        //         littleMan: getBuildState(state).level.littleMan,
        //         giantess: getBuildState(state).level.giantess,
        //         littleManUpgradeFuncs: getBuildState(state).level.littleManUpgradeFuncs,
        //         giantessUpgradeFuncs: getBuildState(state).level.giantessUpgradeFuncs,
        //     }
        // })


        // let buildData = NullableUtils.return_(getBuildData(state))

        return {
            ...createData(),
            upgradeInteractionWay: getBuildState(state).level.upgradeInteractionWay,
            // isGiveTipOnce: getBuildState(state).level.isGiveTipOnce,
            changeNeedCoin: getBuildState(state).level.changeNeedCoin,

            littleMan: getBuildState(state).level.littleMan,
            giantess: getBuildState(state).level.giantess,
            // littleManUpgradeFuncs: _reset(buildData.littleManUpgradeFuncs, getBuildState(state).level.littleManUpgradeFuncs),
            // giantessUpgradeFuncs: _reset(buildData.giantessUpgradeFuncs, getBuildState(state).level.giantessUpgradeFuncs),
            littleManUpgradeFuncs: getBuildState(state).level.littleManUpgradeFuncs,
            giantessUpgradeFuncs: getBuildState(state).level.giantessUpgradeFuncs,

            littleManNotWantCurrentUpgradeItems: getBuildState(state).level.littleManNotWantCurrentUpgradeItems,
            giantessNotWantCurrentUpgradeItems: getBuildState(state).level.giantessNotWantCurrentUpgradeItems,
        }
    }

    // return setBuildState(state, {
    //     ...getBuildState(state),
    //     level: createData()
    // })
    return {
        ...createData(),
        upgradeInteractionWay: getBuildState(state).level.upgradeInteractionWay,
    }
}



export let applyUpgradeFuncsByRandomLevel = (state: state, upgradeFuncs: Array<upgradeFuncData>, usedGirl) => {
    let levelFactor = Math.floor(NumberUtils.clamp(getAutoDifficulty(state) / 2, 0, 2))

    let funcData = buildFuncData(state)

    return ArrayUtils.reducePromise(upgradeFuncs, (state, item) => {
        return item.upgradeFunc(state, funcData, NumberUtils.getRandomInteger(
            NumberUtils.lessThan(1 + levelFactor, item.maxLevel),
            item.maxLevel
        ),
            usedGirl
        )
    }, state)
}

export let applyUpgradeFuncs = (state: state, upgradeFuncs: Array<upgradeFuncData>, usedGirl) => {
    let funcData = buildFuncData(state)

    let characterType_ = Scene.getCharacterType(getAbstractState(state))

    upgradeFuncs = ArrayUtils.map(upgradeFuncs, (item) => {
        return {
            ...item,
            level: item.level + 1
        }
    })

    let funcs = _getUpgradeFuncs(state, characterType_).concat(upgradeFuncs)

    switch (characterType_) {
        case characterType.LittleMan:
            state = setBuildState(state, {
                ...getBuildState(state),
                level: {
                    ...getBuildState(state).level,
                    littleManUpgradeFuncs: funcs
                }
            })
            break
        case characterType.Giantess:
            state = _setGiantessUpgradeFuncs(state, funcs)
            break
        default:
            throw new Error("error")
    }


    return ArrayUtils.reducePromise(upgradeFuncs, (state, item) => {
        return item.upgradeFunc(state, funcData, item.level,
            usedGirl
        )
    }, state)
}

export let removeUpgradeFuncs = (state: state, upgradeFuncs: Array<upgradeFuncData>, usedGirl) => {
    let funcData = buildFuncData(state)

    return ArrayUtils.reducePromise(upgradeFuncs, (state, item) => {
        return NullableUtils.getWithDefault(
            item.removeFunc,
            (state, funcData, _) => Promise.resolve(state)
        )(state, funcData, usedGirl)
    }, state)

}

let _getLastHandledLevelForSelectItem = (state: state) => {
    if (isLittleCharacterType(state)) {
        return getBuildState(state).level.littleMan.lastHandledLevelForSelectItem
    }

    return getBuildState(state).level.giantess.lastHandledLevelForSelectItem
}

let _setLastHandledLevelForSelectItem = (state, value) => {
    if (isLittleCharacterType(state)) {
        state = setBuildState(state, {
            ...getBuildState(state),
            level: {
                ...getBuildState(state).level,
                littleMan: {
                    ...getBuildState(state).level.littleMan,
                    lastHandledLevelForSelectItem: value
                }
            }
        })
    }
    else {
        state = setBuildState(state, {
            ...getBuildState(state),
            level: {
                ...getBuildState(state).level,
                giantess: {
                    ...getBuildState(state).level.giantess,
                    lastHandledLevelForSelectItem: value
                }
            }
        })
    }

    return state
}

let _findSelectItems = (state: state, characterLevel) => {
    let buildData = NullableUtils.getExn(getConfigData(state).buildData)
    let data, upgradeFuncs, notShowUpgradeItemsAgain
    if (isLittleCharacterType(state)) {
        data = buildData.littleManUpgradeFuncs
        upgradeFuncs = getBuildState(state).level.littleManUpgradeFuncs
        notShowUpgradeItemsAgain = _getLittleManNotWantCurrentUpgradeItems(state)
    }
    else {
        data = buildData.giantessUpgradeFuncs
        upgradeFuncs = getBuildState(state).level.giantessUpgradeFuncs
        notShowUpgradeItemsAgain = _getGiantessNotWantCurrentUpgradeItems(state)
    }

    data = data.map(d => {
        return {
            ...d,
            level: NullableUtils.getWithDefault(
                NullableUtils.map(d2 => {
                    return d2.level + 1
                }, upgradeFuncs.find(d3 => d3.name == d.name)),
                1
            )
        }
    }).filter(d => {
        return d.level <= d.maxLevel
            && !notShowUpgradeItemsAgain.includes(d.name)
    })


    if (getIsDebug(state)) {
        return data
    }
    else {
        let funcData = buildFuncData(state)

        return data.filter(d => d.conditionFunc(state, funcData, {
            level: d.level,
            characterLevel
        }))
    }
}

export let isCanSelectItems = (state: state) => {
    if (isAutoUpgradeInteractionWay(state)) {
        return false
    }

    // return getLevel(state) > _getLastHandledLevelForSelectItem(state) && _findSelectItems(state, getLevel(state)).length > 0
    return getSelectLevels(state) > 0 && _findSelectItems(state, getLevel(state)).length > 0
}

export let getSelectLevels = (state: state) => {
    let lastHandledLevelForSelectItem = _getLastHandledLevelForSelectItem(state)

    // if (lastHandledLevelForSelectItem % 2 == 1) {
    //     lastHandledLevelForSelectItem -= 1
    // }

    // return Math.floor((getLevel(state) - lastHandledLevelForSelectItem) / 2)
    return Math.floor(getLevel(state) - lastHandledLevelForSelectItem)

}

export let selectItems = (state: state) => {
    requireCheck(() => {
        test("should can select items", () => {
            return isCanSelectItems(state)
        })
    }, getIsDebug(state))

    if (isAutoUpgradeInteractionWay(state)) {
        return state
    }

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getClickSmallSoundResourceId(), getIsDebug(state), getSystemVolume(state))
    ))


    state = setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            isSelectItems: true
        }
    })

    return state
}

export let getGiantessUpgradeFuncs = (state: state) => {
    return getBuildState(state).level.giantessUpgradeFuncs
}

let _getUpgradeFuncs = (state: state, characterType_) => {
    switch (characterType_) {
        case characterType.LittleMan:
            return getBuildState(state).level.littleManUpgradeFuncs
        case characterType.Giantess:
            return getBuildState(state).level.giantessUpgradeFuncs
        default:
            throw new Error("err")
    }
}

export let isStudy = (state: state, upgradeName: upgradeName) => {
    return !NullableUtils.isNullable(_getUpgradeFuncs(state, Scene.getCharacterType(getAbstractState(state))).find(d => d.name == upgradeName))
}

export let isAutoUpgradeInteractionWay = (state: state) => {
    return getUpgradeInteractionWay(state) == upgradeInteractionWay.Auto
}

export let getUpgradeInteractionWay = (state: state) => {
    return getBuildState(state).level.upgradeInteractionWay
}

export let setUpgradeInteractionWay = (state: state, value) => {
    return setBuildState(state, {
        ...getBuildState(state),
        level: {
            ...getBuildState(state).level,
            upgradeInteractionWay: value
        }
    })
}

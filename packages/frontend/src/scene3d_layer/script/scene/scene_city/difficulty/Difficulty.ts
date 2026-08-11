import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getConfigData, getIncreaseAutoDifficultyResourceId, getLevelNumber, getSceneChapter, getState, isCharacterTypeEqual, isLittleCharacterType, setConfigData, setState } from "../CityScene";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { difficultyData, difficultyDataBackend } from "../data/difficulty/DifficultyData";
import { autoDifficulty, difficulty_ } from "../type/StateType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getDifficultyData as getDifficultyDataPlay } from "../data/play/level1/difficulty/DifficultyData";
// import { getDifficultyData as getDifficultyDataProtect } from "../data/protect/level1/difficulty/DifficultyData";
import { getDifficultyData as getDifficultyDataBiwuLevel1 } from "../data/biwu/level1/difficulty/DifficultyData";
import { getDifficultyData as getDifficultyDataBiwuLevel2 } from "../data/biwu/level2/difficulty/DifficultyData";
import { getDifficultyData as getDifficultyDataBiwuLevel3 } from "../data/biwu/level3/difficulty/DifficultyData";
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType";
import { Map } from "immutable";
import { buildFuncData } from "../data/FuncData";
import { computeAutoDifficulty, getDifficultyState, isIncreaseAutoDifficulty, setDifficultyState } from "./DifficultyUtils";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getIsDebug } from "../../Scene";
import { getOriginSystemVolume, getSystemVolume } from "../utils/SoundUtils";
import { isEnteringNextLevel } from "../manage/mission/Mission";
import { getDifficultyData } from "../../../../mod/SceneMod";
import { getCustomDifficultyCache, setCustomDifficultyCache } from "meta3d-jiehuo-abstract/src/storage/Storage";
import { nullable } from "block/src/Type";
import { getLevel } from "../build/Upgrade";
import { Scene } from "meta3d-jiehuo-abstract";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { isActive } from "../User";

export let createState = (): difficulty_ => {
    return {
        difficultyData: Map(),
        autoDifficultyForLittleMan: autoDifficulty.VeryEasy,
        autoDifficultyForGiantess: autoDifficulty.VeryEasy,

        armyCountRatio: 0,
        eliteArmyCountRatio: 0,
        enemyDamageRatio: 0,
        restoreHpRatio: 0,
        enemyHpRatio: 0,

        enhenceArmyLevel: 0,
        enhenceEliteGiantessLevel: 0,
        enhenceLevelGiantessLevel: 0,
        enhenceBossGiantessLevel: 0,
        maxMMDGiantessCountLevel: 0,
        isAllowFriendDamage: false,
        isRemoveMapEdgeZone: false,

        enhenceArmyFactor: 0,
        enhenceEliteGiantessFactor: 0,
        enhenceLevelGiantessFactor: 0,

        duelistFactor: 0,

        decreaseGenerateArmyIntervalRatio: 0,
    }
}

export let getAutoDifficulty = (state: state) => {
    // return autoDifficulty.VeryHard
    // return getDifficultyState(state).autoDifficulty

    // let level = getLevel(state)

    // if (level <= 5) {
    //     return computeAutoDifficultyByLevel(getLevel(state))
    // }
    if (isLittleCharacterType(state)) {
        return getDifficultyState(state).autoDifficultyForLittleMan
    }

    return getDifficultyState(state).autoDifficultyForGiantess
}

export let getAutoDifficultyByCharacterType = (state: state, characterType_) => {
    switch (characterType_) {
        case characterType.Giantess:
            return getDifficultyState(state).autoDifficultyForGiantess
        case characterType.LittleMan:
            return getDifficultyState(state).autoDifficultyForLittleMan
        default:
            throw new Error("err")
    }
}

export let setAutoDifficulty = (state: state, value) => {
    if (isLittleCharacterType(state)) {
        return setDifficultyState(state, {
            ...getDifficultyState(state),
            autoDifficultyForLittleMan: value
        })
    }

    return setDifficultyState(state, {
        ...getDifficultyState(state),
        autoDifficultyForGiantess: value
    })
}

let _getDifficultyData = (state: state, sceneChapter, levelNumber) => {
    switch (sceneChapter) {
        case scene.Play:
            return getDifficultyDataPlay()
        // case scene.Protect:
        //     return getDifficultyDataProtect()
        case scene.Biwu:
            switch (levelNumber) {
                case 1:
                    return getDifficultyDataBiwuLevel1()
                case 2:
                    return getDifficultyDataBiwuLevel2()
                case 3:
                    return getDifficultyDataBiwuLevel3()
                default:
                    throw new Error("err")
            }
        default:
            // throw new Error("err")
            return getDifficultyData<difficultyData<any>>(state, sceneChapter)
    }
}

export let getData = (state: state, sceneChapter, levelNumber): difficultyData<any> => {
    // let sceneChapter = getSceneChapter(state)
    // let levelNumber = getLevelNumber(state)

    return NullableUtils.getWithDefault(
        NullableUtils.map(d => {
            return NullableUtils.getWithDefault(
                d.get(levelNumber),
                _getDifficultyData(state, sceneChapter, levelNumber)
            )
        }, getDifficultyState(state).difficultyData.get(sceneChapter)),
        _getDifficultyData(state, sceneChapter, levelNumber)
    )
}

export let setData = (state: state, data, sceneChapter, levelNumber) => {
    // let sceneChapter = getSceneChapter(state)
    // let levelNumber = getLevelNumber(state)

    return setDifficultyState(state, {
        ...getDifficultyState(state),
        difficultyData: getDifficultyState(state).difficultyData.set(
            sceneChapter,
            NullableUtils.getWithDefault(
                NullableUtils.map(d => {
                    return d.set(levelNumber, data)
                }, getDifficultyState(state).difficultyData.get(sceneChapter)),
                Map<any, any>().set(levelNumber, data)
            )
        )
    })
}

export let getCurrentDifficultyData = (state) => {
    return getData(state, getSceneChapter(state), getLevelNumber(state))
}

export let apply = (state: state) => {
    let funcData = buildFuncData(state)

    return ArrayUtils.reducePromise(getCurrentDifficultyData(state).filter(d => d.heat != 0),
        (state, d) => {
            return d.applyFunc(state, funcData, d.heat, d.ratioOfOneHeat)
        }, state
    )
    // .then(HeatImplementer.apply)
}

export let computeTotalHeat = (data: difficultyData<any>) => {
    return data.reduce((result, d) => {
        return result + d.heat
    }, 0)
}

let _computeTotalHeatRatio = (data: difficultyData<any>) => {
    if (NullableUtils.isNullable(data)) {
        return 0
    }

    return data.reduce((result, d) => {
        let ratio
        if (d.heat >= 0) {
            ratio = d.heat / d.maxHeat
        }
        else if (d.minHeat < 0) {
            // ratio = - d.heat / d.minHeat
            ratio = (- d.heat / d.minHeat) * 2
        }
        else {
            ratio = 0
        }

        return result + ratio * d.rewardLevel
    }, 0)
}

export let computeRewardLevel = (data: difficultyData<any>) => {
    // const rewardInterval = 3

    // return NumberUtils.clamp(NumberUtils.ceil(computeTotalHeat(data) / rewardInterval), -9, 10)

    return NumberUtils.clamp(
        Math.round(_computeTotalHeatRatio(data)),
        -49, 50
    )
}

export let computePropRewardFactor = (state: state, data: difficultyData<any>) => {
    // let factor
    // if (isActive(state)) {
    //     factor = 1.3
    // }
    // else {
    //     factor = 1
    // }

    return NumberUtils.clamp(1 + computeRewardLevel(data) * 0.05, 0.25, 2)
}

export let computeActiveGemFactor = (state) => {
    let factor
    if (isActive(state)) {
        factor = 1.5
    }
    else {
        factor = 1
    }

    return factor
}

export let computeGemFactor = (state, data: difficultyData<any>) => {
    // return NumberUtils.greaterThan(1 + computeRewardLevel(data) * 0.3, 0.1)

    // let factor
    // if (isActive(state)) {
    //     factor = 1.5
    // }
    // else {
    //     factor = 1
    // }

    return NumberUtils.greaterThan(1 + computeRewardLevel(data) * 0.1, 0.1)
}

export let dispose = (state: state) => {
    if (isEnteringNextLevel(state)) {
        return setDifficultyState(state, {
            ...createState(),
            difficultyData: getDifficultyState(state).difficultyData,
            autoDifficultyForLittleMan: getDifficultyState(state).autoDifficultyForLittleMan,
            autoDifficultyForGiantess: getDifficultyState(state).autoDifficultyForGiantess,
        })
    }

    return setDifficultyState(state, {
        ...createState(),
        difficultyData: getDifficultyState(state).difficultyData,
    })
}

export let update = (state: state) => {
    let oldAutoDifficulty = getAutoDifficulty(state)

    state = setAutoDifficulty(state, computeAutoDifficulty(state))

    if (isIncreaseAutoDifficulty(oldAutoDifficulty, getAutoDifficulty(state))) {
        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            SoundManager.buildNeedToPlaySoundData(getIncreaseAutoDifficultyResourceId(), getIsDebug(state), getSystemVolume(state, 0.5))
        ))
    }

    return state
}

let _buildKey = (sceneChapter, levelNumber) => `customDifficultyCache_${sceneChapter}_${levelNumber}`

let _handleDataToBackend = (data: difficultyData<any>): difficultyDataBackend<any> => {
    return data.map(data => {
        return {
            name: data.name,
            title: data.title,
            ratioOfOneHeat: data.ratioOfOneHeat,
            heat: data.heat,
            minHeat: data.minHeat,
            maxHeat: data.maxHeat,
        }
    })
}

let _handleDataFromBackend = (state, data: difficultyDataBackend<any>, sceneChapter, levelNumber): difficultyData<any> => {
    let originData = getData(state, sceneChapter, levelNumber)

    return data.map(data => {
        return {
            ...NullableUtils.getExn(originData.find(d => d.name == data.name)),
            ...data,
        }
    })
}



export let save = (state: state, data, sceneChapter, levelNumber) => {
    return setCustomDifficultyCache(_buildKey(sceneChapter, levelNumber), _handleDataToBackend(data)).then(_ => state)
}

export let read = (state: state, sceneChapter, levelNumber): Promise<nullable<difficultyData<any>>> => {
    return getCustomDifficultyCache<nullable<difficultyData<any>>>(_buildKey(sceneChapter, levelNumber)).then(cache => NullableUtils.map(cache => {
        return _handleDataFromBackend(state, cache, sceneChapter, levelNumber)
    }, cache))
}


export let getEnhenceArmyFactor = (state) => {
    return getDifficultyState(state).enhenceArmyFactor
}

export let setEnhenceArmyFactor = (state: state, value) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        enhenceArmyFactor: value
    })

    return state
}


export let getEnhenceEliteGiantessFactor = (state) => {
    return getDifficultyState(state).enhenceEliteGiantessFactor
}

export let setEnhenceEliteGiantessFactor = (state: state, value) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        enhenceEliteGiantessFactor: value
    })

    return state
}


export let getEnhenceLevelGiantessFactor = (state) => {
    return getDifficultyState(state).enhenceLevelGiantessFactor
}

export let setEnhenceLevelGiantessFactor = (state: state, value) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        enhenceLevelGiantessFactor: value
    })

    return state
}



export let getDuelistFactor = (state) => {
    return getDifficultyState(state).duelistFactor
}

export let setDuelistFactor = (state: state, value) => {
    state = setDifficultyState(state, {
        ...getDifficultyState(state),
        duelistFactor: value
    })

    return state
}

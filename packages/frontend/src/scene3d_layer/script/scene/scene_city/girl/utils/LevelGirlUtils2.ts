import { state } from "../../../../../type/StateType"
import { getBiggerCount, isLevelGiantess } from "../Girl"
import { bossStateStatusName, usedGirlEnum } from "../../type/StateType"
import { addOrUpdateStatus, removeStatus } from "../../BossStateStatus"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { api } from "type-api/src/Type"
import { getPlayerGiantessBlockService } from "../../../../../mod/LevelGiantessMod"
import { modProtocolName } from "../../../../../mod/data/ModData"
import { service } from "level-giantess-protocol/src/service/ServiceType"
import { getActiveBiggerRemainTime } from "../../utils/StatusUtils2"

export let updateStatus = (state: state, usedGirl) => {
    // let getBiggerCountFunc
    // switch (usedGirl) {
    //     case usedGirlEnum.WildGiantess:
    //         getBiggerCountFunc = getWildGiantessBiggerCount
    //         break
    //     case usedGirlEnum.EnemyGiantess:
    //         getBiggerCountFunc = getEnemyGiantessBiggerCount
    //         break
    //     case usedGirlEnum.PlayerGoddess:
    //         getBiggerCountFunc = getPlayerGoddessBiggerCount
    //         break
    //     default:
    //         return state
    // }

    if (isLevelGiantess(state, usedGirl)) {
        // if (getBiggerCount(state, usedGirl) == 0) {
        //     state = removeStatus(state, bossStateStatusName.ActiveBiggerNumber)
        // }
        // else {
        state = addOrUpdateStatus(state, usedGirl,
            bossStateStatusName.ActiveBiggerNumber,
            // NullableUtils.return_(getBiggerCount(state, usedGirl)),
            getActiveBiggerRemainTime(state, usedGirl),
            true,
            getLanguageTextData(state, languageKey.ActiveBiggerNumber)
        )
        // }
    }

    return state
}



export let increaseGoddessAttribute = (api: api, state: state, level) => {
    let funcData = api.buildFuncData(state)

    // let scaleIncrease = 0.5 * level
    let scaleIncrease = 2.5 * level

    state = funcData.GiantessBuildUtils.setFullHp(state, funcData, (state, hp) => {
        // return hp + 300 * level
        // return hp + 1500 * level
        return hp * 2 + 500 * level
    }, false, usedGirlEnum.PlayerGoddess)
    state = funcData.GiantessBuildUtils.setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            scaleIncrease: girlValue.scaleIncrease + scaleIncrease,
            // initialScale: girlValue.initialScale + scaleIncrease,


            // attackFactor: girlValue.attackFactor + level * api.computeIncreaseFactor(0.03, level),
            // defenseFactor: girlValue.defenseFactor + level * api.computeIncreaseFactor(0.006, level),
            // attackFactor: girlValue.attackFactor + level * api.computeIncreaseFactor(0.05, level),
            attackFactor: girlValue.attackFactor + level * api.computeIncreaseFactor(0.2, level),
            defenseFactor: girlValue.defenseFactor + level * api.computeIncreaseFactor(0.006, level),
        }
    }, usedGirlEnum.PlayerGoddess)

    // state = api.setGirlScale(state, api.NumberUtils.greaterThan(api.getGirlScale(state, usedGirl) + scaleIncrease, 50))
    // state = api.setGirlScale(state, api.getGirlScale(state, usedGirl) + scaleIncrease * 5)
    state = api.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, funcData, (state, initialScale) => {
        return initialScale * 5 + scaleIncrease
    }, usedGirlEnum.PlayerGoddess)

    return state
}

export let increaseGiantessAttribute = (api: api, state: state, level) => {
    let funcData = api.buildFuncData(state)

    let scaleIncrease = 0.5 * level

    let usedGirl = getPlayerGiantessBlockService(state).getUsedGirl()

    state = funcData.GiantessBuildUtils.setFullHp(state, funcData, (state, hp) => {
        // return hp + 300 * level
        return hp + 100 * level
    }, false, usedGirl)
    state = funcData.GiantessBuildUtils.setAttribute(state, funcData, (girlValue) => {
        return {
            ...girlValue,
            scaleIncrease: girlValue.scaleIncrease + scaleIncrease,
            // initialScale: girlValue.initialScale + scaleIncrease,

            attackFactor: girlValue.attackFactor + level * api.computeIncreaseFactor(0.05, level),
            defenseFactor: girlValue.defenseFactor + level * api.computeIncreaseFactor(0.006, level),
        }
    }, usedGirl)

    // state = api.setGirlScale(state, api.getGirlScale(state, usedGirl) + scaleIncrease)
    state = api.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, funcData, (state, initialScale) => {
        return initialScale + scaleIncrease
    }, usedGirl)

    return state
}
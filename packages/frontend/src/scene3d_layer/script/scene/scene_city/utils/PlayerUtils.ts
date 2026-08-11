import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../type/StateType"
import { getConfigData, isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl, isLittleCharacterType, setConfigData } from "../CityScene"
import { isGirl, isPlayerGoddess as isPlayerGoddessGirl, isPlayerGirl, setMovableRanges, isPlayerGiantess as isPlayerGiantessGirl, getBodyHp, getFullHp as getGirlFullHp, buildNameByUsedGirl, getUsedGirlByName } from "../girl/Girl"
import { computeHeight, getGirlBox, getGirlPosition, getPositionParrelToObj } from "../girl/Utils"
import { getName as getLittleManName, getBox as getLittleManBox, isLittleMan, setMovableRanges as setLittleManMovableRanges, getHp as getLittleManHp, getFullHp as getLittleManFullHp } from "../little_man/LittleMan"
import { getPosition, getWorldPosition } from "../little_man/Transform"
import { getCamp, getCampWithDefault } from "../manage/city1/Army"
import { camp, usedGirlEnum } from "../type/StateType"
import { isNearGirl } from "./CollisionUtils"
import { getHeight } from "./DamageUtils"
import { getIsAllowFriendDamage } from "../difficulty/HeatImplementer"
// import * as PlayerGirlData from "../data/player/GirlData"
// import { getPlayerUsedMMDData } from "../data/play/level1/MMDUtils"
// import { initClothHpData } from "../girl/InitWhenImportScene"

export let getPlayerCamp = () => {
    return camp.Player
}

export let getPlayerPosition = (state: state) => {
    if (isLittleCharacterType(state)) {
        return getWorldPosition(state)
    }

    return getGirlPosition(state, usedGirlEnum.PlayerGirl)
}

export let getPlayerBox = (state: state) => {
    if (isLittleCharacterType(state)) {
        return getLittleManBox(state)
    }

    return getGirlBox(state, usedGirlEnum.PlayerGirl)
}

export let isPlayerCamp = (state: state, name) => {
    return getCampWithDefault(state, name, camp.None) == getPlayerCamp()
}

export let isPlayer = (state: state, name) => {
    // if (isLittleCharacterType(state)) {
    //     return isLittleMan(name)
    // }

    // return isGiantessCharacterType(state) && isGirl(name)

    return isPlayerCamp(state, name) && (isLittleMan(name) || isGirl(name))
}

export let getPlayerNamesByCharacterType = (characterType_) => {
    switch (characterType_) {
        case characterType.LittleMan:
            return [getLittleManName()]
        case characterType.Giantess:
            return [buildNameByUsedGirl(usedGirlEnum.PlayerGirl)]
        case characterType.Both:
            return [getLittleManName(), buildNameByUsedGirl(usedGirlEnum.PlayerGirl)]
        default:
            return []
    }
}

export let getPlayerNamesByIsUseCareerFeature = (isUseCareerFeatureForLittleMan, isUseCareerFeatureForGiantess) => {
    if (isUseCareerFeatureForLittleMan && isUseCareerFeatureForGiantess) {
        return [getLittleManName(), buildNameByUsedGirl(usedGirlEnum.PlayerGirl)]
    }

    if (isUseCareerFeatureForLittleMan) {
        return [getLittleManName()]
    }
    if (isUseCareerFeatureForGiantess) {
        return [buildNameByUsedGirl(usedGirlEnum.PlayerGirl)]
    }

    return []
}


export let isPlayerByCharacterType = (state: state, name, characterType_) => {
    switch (characterType_) {
        case characterType.LittleMan:
            return isLittleMan(name)
        case characterType.Giantess:
            return isGirl(name) && isGiantessCharacterTypeByUsedGirl(state, getUsedGirlByName(name))
        case characterType.Both:
            return isLittleMan(name) || (isGirl(name) && isGiantessCharacterTypeByUsedGirl(state, getUsedGirlByName(name)))
        default:
            return false
    }
}

export let getCharacterTypeByName = (name) => {
    switch (name) {
        case isLittleMan(name):
            return characterType.LittleMan
        case isGirl(name):
            return characterType.Giantess
        default:
            return characterType.None
    }
}

export let isPlayerGiantess = (state: state, usedGirl, name) => {
    return isPlayerGiantessGirl(state, usedGirl) && isGirl(name)
}


export let setMoveableRange = (state: state, usedGirl, movableRanges) => {
    state = setLittleManMovableRanges(state, movableRanges)

    state = setMovableRanges(state, usedGirl, movableRanges)

    return state
}

// export let initPlayerConfigDataForBossGiantessLevel = (state: state) => {
//     state = setConfigData(state, {
//         ...getConfigData(state),
//         girlValueMap: getConfigData(state).girlValueMap.set(
//             usedGirlEnum.PlayerGirl,
//             PlayerGirlData.getValue(state)
//         ),
//     })

//     state = initClothHpData(state, getPlayerUsedMMDData(state))

//     return state
// }

export let isNearObject = (sourcePosition, targetPosition, distance) => {
    return getPositionParrelToObj(sourcePosition, targetPosition.y).distanceTo(targetPosition) < distance
}

export let getPlayerName = (state: state) => {
    if (isLittleCharacterType(state)) {
        return getLittleManName()
    }

    return buildNameByUsedGirl(usedGirlEnum.PlayerGirl)
}

export let getPlayerHeight = (state: state) => {
    if (isLittleCharacterType(state)) {
        return getHeight(getLittleManBox(state))
    }

    return computeHeight(state, usedGirlEnum.PlayerGirl)
}

export let isNearPlayer = (state: state, position) => {
    if (isLittleCharacterType(state)) {
        return isNearObject(getPosition(state), position, 100)
    }

    return isNearGirl(state, position)
}

export let getPlayerHp = (state) => {
    if (isLittleCharacterType(state)) {
        return getLittleManHp(state)
    }

    return getBodyHp(state, usedGirlEnum.PlayerGirl)
}

export let getPlayerFullHp = (state) => {
    if (isLittleCharacterType(state)) {
        return getLittleManFullHp(state)
    }

    return getGirlFullHp(state, usedGirlEnum.PlayerGirl)
}

export let isCanDamageLittleMan = (state: state, camp) => {
    return getIsAllowFriendDamage(state) ? true : camp != getPlayerCamp()
}
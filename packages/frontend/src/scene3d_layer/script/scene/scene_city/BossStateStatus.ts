import { List, Map } from "immutable";
import { bossStateStatus, bossStateStatusData, bossStateStatusName, bossStateStatusName_, usedGirl, usedGirlEnum } from "./type/StateType";
import { state } from "../../../type/StateType";
import { getState, isGiantessCharacterType, isLittleCharacterType, isNoneCharacterType, setState } from "./CityScene";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { buffName } from "./data/buff/BuffData";
import { getBuffs } from "./buff/Buff";
import { handleStatusWithNumberWithoutJudgeHas } from "./utils/StatusUtils2";
import { getBuffImageSrc, handleStatusWithNumber as handleStatusWithNumberBuffMod } from "../../../mod/BuffMod";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getName as getLittleManName } from "./little_man/LittleMan";
import { buildFuncData } from "./data/FuncData";
import { _getState } from "./LittleManCamera";

let _getImageSrc = (state, name: bossStateStatusName_) => {
    switch (name) {
        case bossStateStatusName.ActiveBiggerNumber:
            return `./resource/ui/in_game/status/active.png`
        case bossStateStatusName.Hard:
            return `./resource/ui/in_game/status/hard.png`
        case bossStateStatusName.UnDamage:
            return `./resource/ui/in_game/status/undamage.png`
        default:
            return getBuffImageSrc(state, name)
    }
}

export let createData = (): bossStateStatus => {
    return {
        status: Map(),
        // currentUsedGirl: usedGirlEnum.None,
    }
}

let _getData = (state: state) => {
    return getState(state).status.bossStateStatus
}

let _setData = (state: state, bossStateStatus: bossStateStatus) => {
    return setState(state, {
        ...getState(state),
        status: {
            ...getState(state).status,
            bossStateStatus: bossStateStatus
        }
    })
}

let _hasUsedGirlData = (state: state, usedGirl: usedGirl) => {
    return _getData(state).status.has(usedGirl)
}

let _getUsedGirlData = (state: state, usedGirl: usedGirl) => {
    return NullableUtils.getWithDefault(_getData(state).status.get(usedGirl), List())
}

let _setUsedGirlData = (state: state, usedGirl, data: List<bossStateStatusData>) => {
    return _setData(state, {
        ..._getData(state),
        status: _getData(state).status.set(usedGirl, data)
    })
}


let _addOrUpdateStatus = (state: state, usedGirl, name: bossStateStatusName_, number: nullable<number>, isPositive, imageSrc, description) => {
    usedGirl = NullableUtils.getWithDefault(usedGirl, usedGirlEnum.None)

    // if (NullableUtils.getWithDefault(NullableUtils.map(number => number <= 0, number), false)) {
    // if (NullableUtils.getWithDefault(NullableUtils.map(number => number < 0, number), false)) {
    if (NullableUtils.getWithDefault(NullableUtils.map(number => number < 0, number), true)) {
        return removeStatus(state, usedGirl, name)
    }

    let data = {
        name,
        number,
        isPositive,
        imageSrc,
        description,
    }

    if (!_hasUsedGirlData(state, usedGirl)) {
        return _setUsedGirlData(state, usedGirl, List([data]))
    }

    if (NullableUtils.isNullable(_getUsedGirlData(state, usedGirl).find(d => d.name == name))) {
        return _setUsedGirlData(state, usedGirl, _getUsedGirlData(state, usedGirl).push(data))
    }

    return _setUsedGirlData(state, usedGirl, _getUsedGirlData(state, usedGirl).map(d => {
        if (d.name == name) {
            return data
        }

        return d
    }))
}

export let addOrUpdateStatus = (state: state, usedGirl, name: bossStateStatusName_, number: nullable<number>, isPositive, description) => {
    return _addOrUpdateStatus(state, usedGirl, name, number, isPositive, _getImageSrc(state, name), description)
}

export let isValidCharacterType = (state, characterType_) => {
    return characterType_ == characterType.None || (characterType_ == characterType.GiantessOrNone)
}

export let addOrUpdateStatus2 = (state: state, getImageSrcFunc, usedGirl, name: bossStateStatusName_, number: nullable<number>, isPositive, characterType_, description) => {
    // if (characterType_ == characterType.None || (characterType_ == characterType.GiantessOrNone && isNoneCharacterType(state))) {
    // if (characterType_ == characterType.None || (characterType_ == characterType.GiantessOrNone)) {
    return _addOrUpdateStatus(state, usedGirl, name, number, isPositive, getImageSrcFunc(state, name), description)
    // }

    // return state
}

export let removeStatus = (state: state, usedGirl, name: bossStateStatusName_) => {
    // return _setData(state, {
    //     ..._getData(state),
    //     status: _getData(state).status.filter(d => d.name != name)
    // })
    return _setUsedGirlData(state, usedGirl, _getUsedGirlData(state, usedGirl).filter(d => d.name != name))
}

export let getStatus = (state: state, usedGirl) => {
    return _getUsedGirlData(state, usedGirl).sort((a, b) => {
        return Number(a.name) - Number(b.name)
    })
}

// let _hasStatus = (state: state, name, characterType_) => {
//     if (characterType_ != characterType.None) {
//         return false
//     }

//     return !NullableUtils.isNullable(_getData(state).status.find(d => d.name == name))
// }

// export let handleBossStatusWithNumber = handleStatusWithNumber([removeStatus, addOrUpdateStatus2, _hasStatus, _getImageSrc])

export let handleBossStatusWithNumberWithoutJudgeHas = handleStatusWithNumberWithoutJudgeHas([isValidCharacterType, removeStatus, addOrUpdateStatus2, _getImageSrc])


let _convertBuffName = (buffName_: buffName): bossStateStatusName_ => {
    switch (buffName_) {
        case buffName.IncreaseActionSpeed:
            return bossStateStatusName.IncreaseActionSpeed
        case buffName.DecreaseActionSpeed:
            return bossStateStatusName.DecreaseActionSpeed
        default:
            return buffName_
    }
}

// export let addStatusFromBuffs = (state: state, usedGirl_) => {
//     return getBuffs(state).reduce((state, singleBuff) => {
//         if (NullableUtils.getWithDefault(NullableUtils.map(usedGirl => {
//             return usedGirl == usedGirl_
//         }, singleBuff.usedGirl), false)) {
//             return _addOrUpdateStatus(state,
//                 _convertBuffName(singleBuff.buffName),
//                 NullableUtils.return_(singleBuff.superPositionCount),
//                 singleBuff.isPositive,
//                 singleBuff.imageSrc
//             )
//         }

//         return state
//     }, state)
// }

let _isNonPlayerGirl = (usedGirl_) => {
    usedGirl_ = NullableUtils.getWithDefault(usedGirl_, usedGirlEnum.None)

    return usedGirl_ != usedGirlEnum.None && usedGirl_ != usedGirlEnum.PlayerGirl
}

export let addOrUpdateStatusFromBuffs = (state: state, singleBuff) => {
    let characterType_ = singleBuff.characterType

    if (!isValidCharacterType(state, characterType_)) {
        return state
    }

    switch (characterType_) {
        case characterType.LittleManOrNone:
            if (singleBuff.name == getLittleManName()) {
                return state
            }
        default:
            if (NullableUtils.getWithDefault(NullableUtils.map(_isNonPlayerGirl, singleBuff.usedGirl), false)) {
                return _addOrUpdateStatus(state, singleBuff.usedGirl,
                    _convertBuffName(singleBuff.buffName),
                    NullableUtils.return_(singleBuff.superPositionCount),
                    singleBuff.isPositive,
                    singleBuff.imageSrc,
                    singleBuff.getDescriptionFunc(state, buildFuncData(state), singleBuff.superPositionCount, singleBuff.sumValue)
                )
            }

            return state
    }

}

export let removeStatusFromBuffs = (state: state, usedGirl, buffName, usedGirl_) => {
    if (NullableUtils.getWithDefault(NullableUtils.map(_isNonPlayerGirl, usedGirl_), false)) {
        return removeStatus(state, usedGirl, _convertBuffName(buffName))
    }

    return state
}


export let clearAllStatus = (state: state, usedGirl) => {
    // return _setData(state, createData())
    return _setUsedGirlData(state, usedGirl, List())
}

export let update = (state: state, usedGirl) => {
    // state = handleStatusWithNumberBuffMod(state, handleBossStatusWithNumber)
    state = handleStatusWithNumberBuffMod(state, handleBossStatusWithNumberWithoutJudgeHas, usedGirl)

    return state
}

// export let getCurrentUsedGirl = (state) => {
//     return _getData(state).currentUsedGirl
// }

// export let isCurrentUsedGirl = (state, value) => {
//     return getCurrentUsedGirl(state) == value
// }

// export let setCurrentUsedGirl = (state, usedGirl) => {
//     return _setData(state, {
//         ..._getData(state),
//         currentUsedGirl: usedGirl
//     })
// }

// export let removeCurrentUsedGirl = (state) => {
//     return setCurrentUsedGirl(state, usedGirlEnum.None)
// }


export let dispose = () => {
    return createData()
}
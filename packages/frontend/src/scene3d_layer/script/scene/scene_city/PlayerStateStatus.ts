import { List } from "immutable";
import { playerStateStatus, playerStateStatusData, playerStateStatusName, playerStateStatusName_, singleBuff, usedGirlEnum } from "./type/StateType";
import { state } from "../../../type/StateType";
import { getState, isCharacterTypeEqual, isGiantessCharacterTypeByUsedGirl, setState } from "./CityScene";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene";
import { getAbstractState } from "../../../state/State";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { getComboStormLayerCount, getOldSoldierHp } from "./StaticDynamic";
import { getBuffs } from "./buff/Buff";
import { buffName } from "./data/buff/BuffData";
import { getName as getLittleManName, getName } from "./little_man/LittleMan";
import { getNotAttackLittleManRemainTime } from "./utils/AttackTargetUtils";
import { play } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { getActiveBiggerRemainTime, handleStatusWithNumber, handleStatusWithNumberWithoutJudgeHas } from "./utils/StatusUtils2";
import { getBuffImageSrc, handleStatusWithNumber as handleStatusWithNumberBuffMod } from "../../../mod/BuffMod";
import { getBiggerCount, isGirl } from "./girl/Girl";
import { buildFuncData } from "./data/FuncData";
import { getLanguageTextData, languageKey } from "../../../internation/Data";
import { hasStudyAction } from "./utils/build/GiantessBuildUtils";
import { actionName } from "./data/DataType";

let _getImageSrc = (state, name: playerStateStatusName_) => {
    switch (name) {
        case playerStateStatusName.ActiveBiggerNumber:
            return `./resource/ui/in_game/status/active.png`
        // case playerStateStatusName.PassiveBiggerAddedScaleNumber:
        //     return `./resource/ui/in_game/status/passive.png`
        case playerStateStatusName.OldSoldierNumber:
            return `./resource/ui/in_game/status/oldsoldier.png`
        case playerStateStatusName.ComboStormNumber:
            return `./resource/ui/in_game/status/combo.png`
        case playerStateStatusName.ClearHatred:
            return `./resource/ui/in_game/buff/clear_hatred.png`
        default:
            return getBuffImageSrc(state, name)
    }
}

export let createData = (): playerStateStatus => {
    return {
        status: List()
    }
}

let _getData = (state: state) => {
    return getState(state).status.playerStateStatus
}

let _setData = (state: state, playerStateStatus: playerStateStatus) => {
    return setState(state, {
        ...getState(state),
        status: {
            ...getState(state).status,
            playerStateStatus: playerStateStatus
        }
    })
}

// let _getCharacterTypeMap = () => {
//     return {
//         [playerStateStatusName.ActiveBiggerNumber]: characterType.Giantess,
//         [playerStateStatusName.PassiveBiggerAddedScaleNumber]: characterType.Giantess,
//     }
// }

// let _getIsPositive = (playerStateStatusName_) => {
//     switch (playerStateStatusName_) {
//         case playerStateStatusName.ActiveBiggerNumber:
//         case playerStateStatusName.PassiveBiggerAddedScaleNumber:
//             return true
//         default:
//             throw new Error("err")
//     }
// }


let _isSingleStatus = (status, name, characterType) => {
    return status.name == name && isCharacterTypeEqual(status.characterType, characterType)
}

let _addOrUpdateStatusWithoutConvert = (state: state, usedGirl, name: playerStateStatusName_, number: nullable<number>, isPositive, characterType_, imageSrc, description) => {
    if (characterType_ == characterType.None) {
        return state
    }

    // if (NullableUtils.getWithDefault(NullableUtils.map(number => number <= 0, number), false)) {
    // if (NullableUtils.getWithDefault(NullableUtils.map(number => number < 0, number), false)) {
    if (NullableUtils.getWithDefault(NullableUtils.map(number => number < 0, number), true)) {
        return removeStatus(state, usedGirl, name, characterType_)
    }

    let data = {
        name,
        number,
        // isPositive: _getIsPositive(name)
        isPositive,
        characterType: characterType_,
        imageSrc,
        description
    }

    if (NullableUtils.isNullable(_getData(state).status.find(d => _isSingleStatus(d, name, characterType_)))) {
        return _setData(state, {
            ..._getData(state),
            status: _getData(state).status.push(data)
        })
    }

    return _setData(state, {
        ..._getData(state),
        status: _getData(state).status.map(d => {
            if (_isSingleStatus(d, name, characterType_)) {
                return data
            }

            return d
        })
    })
}

// let _addOrUpdateStatus = (state: state, getImageSrcFunc, usedGirl, name: playerStateStatusName_, number: nullable<number>, isPositive, characterType_, description) => {
let _addOrUpdateStatus = (state: state, getImageSrcFunc, usedGirl, name: playerStateStatusName_, number: nullable<number>, isPositive, characterType_, description) => {
    // characterType_ = _convertToCharacterType(name, usedGirl)
    characterType_ = _convertToCharacterType(state, characterType_)

    return _addOrUpdateStatusWithoutConvert(state, usedGirl, name, number, isPositive, characterType_, getImageSrcFunc(state, name), description)
}

export let removeStatus = (state: state, usedGirl, name: playerStateStatusName_, characterType_) => {
    // characterType_ = _convertToCharacterType(name, usedGirl)
    characterType_ = _convertToCharacterType(state, characterType_)

    return _setData(state, {
        ..._getData(state),
        status: _getData(state).status.filter(d => !_isSingleStatus(d, name, characterType_))
    })
}

export let getStatus = (state: state) => {
    let characterType_ = getCharacterType(getAbstractState(state))

    return _getData(state).status.filter(d => {
        return isCharacterTypeEqual(d.characterType, characterType_)
    }).sort((a, b) => {
        return Number(a.name) - Number(b.name)
    })
}

let _hasStatus = (state: state, name: playerStateStatusName_, characterType_) => {
    return !NullableUtils.isNullable(_getData(state).status.find(d => _isSingleStatus(d, name, characterType_)))
}

let _isValidCharacterType = (state, characterType_) => {
    return _convertToCharacterType(state, characterType_) != characterType.None
}

export let handlePlayerStatusWithNumber = handleStatusWithNumber([_isValidCharacterType, removeStatus, _addOrUpdateStatus, _hasStatus, _getImageSrc])

export let handlePlayerStatusWithNumberWithoutJudgeHas = handleStatusWithNumberWithoutJudgeHas([_isValidCharacterType, removeStatus, _addOrUpdateStatus, _getImageSrc])

let _convertBuffName = (buffName_: buffName): nullable<playerStateStatusName_> => {
    switch (buffName_) {
        case buffName.IncreaseMoveSpeed:
            return NullableUtils.return_(playerStateStatusName.IncreaseMoveSpeed)
        case buffName.IncreaseActionSpeed:
            return NullableUtils.return_(playerStateStatusName.IncreaseActionSpeed)
        case buffName.ClearHatred:
            return NullableUtils.return_(playerStateStatusName.ClearHatred)
        // case buffName.Strong:
        //     return NullableUtils.return_(playerStateStatusName.Strong)
        default:
            // return NullableUtils.getEmpty()
            return NullableUtils.return_(buffName_)
    }
}

// export let _convertToCharacterType = (name, usedGirl_): characterType => {
//     if (NullableUtils.getWithDefault(NullableUtils.map(usedGirl_ => {
//         return usedGirl_ == usedGirlEnum.PlayerGirl
//     }, usedGirl_), false)) {
//         return characterType.Giantess
//     }

//     switch (name) {
//         case getName():
//             return characterType.LittleMan
//         default:
//             return characterType.None
//     }
// }
let _convertToCharacterType = (state: state, characterType_): characterType => {
    // if (usedGirl != usedGirlEnum.None) {
    //     return characterType.Giantess
    // }

    let currentCharacterType = getCharacterType(getAbstractState(state))

    switch (characterType_) {
        case characterType.Both:
            return currentCharacterType
        case characterType.Giantess:
        case characterType.GiantessOrNone:
            if (currentCharacterType != characterType.Giantess) {
                return characterType.None
            }
            return characterType.Giantess
        case characterType.LittleMan:
        case characterType.LittleManOrNone:
            if (currentCharacterType != characterType.LittleMan) {
                return characterType.None
            }
            return characterType.LittleMan
        default:
            // // throw new Error("error")
            // if (usedGirl != usedGirlEnum.None) {
            //     return characterType.Giantess
            // }
            // return characterType.LittleMan
            return characterType.None
    }
    // return characterType.LittleMan
}

// let _addStatusFromBuffs = (state: state) => {
//     return getBuffs(state).reduce((state, singleBuff) => {
//         let characterType_ = _convertToCharacterType(singleBuff.name, singleBuff.usedGirl)

//         switch (characterType_) {
//             case characterType.None:
//                 return state
//             default:
//                 return _addOrUpdateStatus(state,
//                     _convertBuffName(singleBuff.buffName),
//                     NullableUtils.return_(singleBuff.superPositionCount),
//                     singleBuff.isPositive,
//                     characterType_,
//                     singleBuff.imageSrc
//                 )
//         }
//     }, state)
// }

let _isPlayerCharacterType = (characterType_) => {
    switch (characterType_) {
        case characterType.LittleMan:
        case characterType.Giantess:
            return true
        default:
            return false
    }
}

export let addOrUpdateStatusFromBuffs = (state: state, singleBuff: singleBuff) => {
    let characterType_ = _convertToCharacterType(state, singleBuff.characterType)

    if (!_isValidCharacterType(state, characterType_)) {
        return state
    }

    // if (!_isPlayerCharacterType(characterType_)) {
    //     return state
    // }

    // let characterType_ = _convertToCharacterType(singleBuff.name, singleBuff.usedGirl)
    // let characterType_ = _convertToCharacterType(singleBuff.usedGirl, singleBuff.characterType)

    //     switch (characterType_) {
    //         case characterType.None:
    //             return state
    //         // case characterType.LittleManOrNone:
    //         case characterType.LittleMan:
    //             if (singleBuff.name != getLittleManName()) {
    //                 return state
    //             }
    //         // case characterType.BothOrNone:
    //         //     // if (singleBuff.name != getLittleManName() && singleBuff.name != getGirlName()) {
    //         //     if (singleBuff.name != getLittleManName() && !isGirl(singleBuff.name)) {
    //         //         return state
    //         //     }
    //         case characterType.Giantess:
    //             if (!isGirl(singleBuff.name)) {
    //                 return state
    //             }
    //         default:
    //             return _addOrUpdateStatusWithoutConvert(state,
    //                 singleBuff.usedGirl,
    //                 NullableUtils.getExn(_convertBuffName(singleBuff.buffName)),
    //                 NullableUtils.return_(singleBuff.superPositionCount),
    //                 singleBuff.isPositive,
    //                 characterType_,
    //                 singleBuff.imageSrc,
    //                 singleBuff.getDescriptionFunc(state, buildFuncData(state), singleBuff.superPositionCount, singleBuff.sumValue)
    //             )
    //     }
    return _addOrUpdateStatusWithoutConvert(state,
        singleBuff.usedGirl,
        NullableUtils.getExn(_convertBuffName(singleBuff.buffName)),
        NullableUtils.return_(singleBuff.superPositionCount),
        singleBuff.isPositive,
        characterType_,
        singleBuff.imageSrc,
        singleBuff.getDescriptionFunc(state, buildFuncData(state), singleBuff.superPositionCount, singleBuff.sumValue)
    )
}

export let removeStatusFromBuffs = (state: state, usedGirl, buffName, characterType_) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(name => {
            // return removeStatus(state, getUsedGirlByCharacterType(characterType_), name, characterType_)
            return removeStatus(state, usedGirl, name, characterType_)
        }, _convertBuffName(buffName)),
        state
    )
}

export let update = (state: state, usedGirl) => {
    // switch (getBiggerWay(state)) {
    //     case biggerWay.Active:
    //         // state = removeStatus(state,
    //         //     playerStateStatusName.PassiveBiggerAddedScaleNumber,
    //         //     characterType.Giantess
    //         // )
    //         state = _addOrUpdateStatus(state,
    //             playerStateStatusName.ActiveBiggerNumber,
    //             NullableUtils.return_(getBiggerCount(state, usedGirl)),
    //             true,
    //             characterType.Giantess,
    //             _getImageSrc(state, playerStateStatusName.ActiveBiggerNumber),
    //             getLanguageTextData(state, languageKey.ActiveBiggerNumber)
    //         )
    //         break
    //     // case biggerWay.Passive:
    //     //     state = removeStatus(state,
    //     //         playerStateStatusName.ActiveBiggerNumber,
    //     //         characterType.Giantess
    //     //     )
    //     //     state = _addOrUpdateStatus(state,
    //     //         playerStateStatusName.PassiveBiggerAddedScaleNumber,
    //     //         NullableUtils.return_(
    //     //             getPassiveScaleIncrease(getSumExcitement(state))
    //     //         ),
    //     //         true,
    //     //         characterType.Giantess,
    //     //         _getImageSrc(state, playerStateStatusName.PassiveBiggerAddedScaleNumber)
    //     //     )
    //     //     break
    //     case biggerWay.None:
    //         state = removeStatus(state,
    //             playerStateStatusName.ActiveBiggerNumber,
    //             characterType.Giantess
    //         )
    //         // state = removeStatus(state,
    //         //     playerStateStatusName.PassiveBiggerAddedScaleNumber,
    //         //     characterType.Giantess
    //         // )
    //         break
    // }

    // if (usedGirl == usedGirlEnum.None) {
    //     return state
    // }

    if (isGiantessCharacterTypeByUsedGirl(state, usedGirl) && hasStudyAction(state, buildFuncData(state), actionName.Bigger)) {
        state = _addOrUpdateStatusWithoutConvert(state, usedGirl,
            playerStateStatusName.ActiveBiggerNumber,
            // NullableUtils.return_(getBiggerCount(state, usedGirl)),
            getActiveBiggerRemainTime(state, usedGirl),
            true,
            characterType.Giantess,
            _getImageSrc(state, playerStateStatusName.ActiveBiggerNumber),
            getLanguageTextData(state, languageKey.ActiveBiggerNumber)
        )
    }

    state = handlePlayerStatusWithNumberWithoutJudgeHas(state, getComboStormLayerCount, usedGirl, playerStateStatusName.ComboStormNumber, characterType.LittleMan, true, getLanguageTextData(state, languageKey.ComboStormNumber))
    state = handlePlayerStatusWithNumberWithoutJudgeHas(state, getOldSoldierHp, usedGirl, playerStateStatusName.OldSoldierNumber, characterType.Both, true, getLanguageTextData(state, languageKey.OldSoldierNumber))

    state = handlePlayerStatusWithNumber(state, getNotAttackLittleManRemainTime, usedGirl, playerStateStatusName.ClearHatred, characterType.LittleMan, true, getLanguageTextData(state, languageKey.ClearHatred))

    // state = handleStatusWithNumberBuffMod(state, handlePlayerStatusWithNumber)
    state = handleStatusWithNumberBuffMod(state, handlePlayerStatusWithNumberWithoutJudgeHas, usedGirl)

    return state
}

export let dispose = () => {
    return createData()
}
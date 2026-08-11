import { List } from "immutable";
import { state } from "../../../../type/StateType";
import { buffName, getBuffData } from "../data/buff/BuffData";
import { buff, secondUnit, singleBuff, usedGirlEnum, usedGirl } from "../type/StateType";
import { getState, setState } from "../CityScene";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { buildFuncData } from "../data/FuncData";
import { Flow } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { characterType, name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { addOrUpdateStatusFromBuffs as addOrUpdatePlayerStatusFromBuffs, removeStatusFromBuffs as removePlayerStatusFromBuffs } from "../PlayerStateStatus";
import { addOrUpdateStatusFromBuffs as addOrUpdateBossStatusFromBuffs, removeStatusFromBuffs as removeBossStatusFromBuffs } from "../BossStateStatus";
import { isStatic } from "../utils/OctreeObjectUtils";
import { isPlayer } from "../utils/PlayerUtils";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getIsDebug } from "../../Scene";
import { getLanguageTextData, getLanguageTextVariableData, languageKey, languageVariableKey } from "../../../../internation/Data";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { isGirl } from "../girl/Girl";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getBuffState, setBuffState } from "../../../../mod/BuffMod";
import { setBlockState } from "../../../../mod/Mod";
import { modProtocolName } from "../../../../mod/data/ModData";
import { getNow } from "../Time";

export let createState = (): buff => {
    return {
        // buffs: List(),
        // remainedBuffsForNextLevel: List(),
        buffs: MutableRecordUtils.create(),
        remainedBuffsForNextLevel: MutableRecordUtils.create(),

        sumValueMap: MutableRecordUtils.create(),
    }
}

let _getState = (state: state) => {
    return getState(state).buff
}

let _setState = (state: state, buffState: buff) => {
    return setState(state, {
        ...getState(state),
        buff: buffState
    })
}

export let findBuffData = (state, buffName: buffName) => {
    return NullableUtils.getExn(getBuffData(state).find(d => d.name == buffName))
}

let _buildDeferName = (buffName: buffName, usedGirl, name: nullable<name>) => {
    return `${buffName}_${NullableUtils.getWithDefault(usedGirl, "")}_${NullableUtils.getWithDefault(name, "")}`
}

let _buildBuffKey = (buffName, usedGirl, name) => {
    return `${buffName}_${name}_${NullableUtils.isNullable(usedGirl) ? "" : usedGirl}`
}

let _isSingleBuff = (singleBuff: singleBuff, buffName, usedGirl, name) => {
    if (singleBuff.buffName == buffName && singleBuff.name == name) {
        if (isGirl(name)) {
            return singleBuff.usedGirl == usedGirl
        }

        return true
    }

    return false
}

let _isSingleBuffByNotJudgeBuffName = (singleBuff: singleBuff, usedGirl, name) => {
    return singleBuff.usedGirl == usedGirl && singleBuff.name == name
}

export let findBuff = (state: state, buffName: buffName, name, usedGirl) => {
    // return _getState(state).buffs.find(b => _isSingleBuff(b, buffName, usedGirl, name))
    return MutableRecordUtils.get(
        _getState(state).buffs,
        _buildBuffKey(buffName, usedGirl, name)
    )
}

export let hasBuff = (state: state, buffName: buffName, name, usedGirl) => {
    return !NullableUtils.isNullable(findBuff(state, buffName, name, usedGirl))
}

export let addBuff = (state: state, buffName: buffName, name, usedGirl: nullable<usedGirl>, time: secondUnit, count: number, characterType_, value?) => {
    if (isStatic(state, name)) {
        return Promise.resolve(state)
    }

    // usedGirl = NullableUtils.getWithDefault(usedGirlEnum.None)

    let buffData = findBuffData(state, buffName)
    let funcData = buildFuncData(state)

    // let buff = _getState(state).buffs.find(b => _isSingleBuff(b, buffName, usedGirl, name))
    let buff = findBuff(state, buffName, name, usedGirl)

    value = NullableUtils.getWithDefaultFunc(
        value,
        () => {
            return NullableUtils.getWithDefault(buffData.value, 0)
        }
    )

    if (NullableUtils.isNullable(buff)) {
        if (count > buffData.maxSuperPositionCount) {
            return Promise.resolve(state)
        }

        let singleBuff = {
            buffName: buffName,
            imageSrc: buffData.imageSrc,

            characterType: characterType_,

            name,
            usedGirl,

            superPositionCount: count,
            time: time,

            // value: value,
            sumValue: value * count,


            isPositive: buffData.isPositive,

            isWorkInContinueLevels: buffData.isWorkInContinueLevels,

            getDescriptionFunc: buffData.getDescriptionFunc,
        }

        state = _setState(state, {
            ..._getState(state),
            // buffs: _getState(state).buffs.push(
            //     singleBuff
            // )
            buffs: MutableRecordUtils.set(
                _getState(state).buffs,
                _buildBuffKey(buffName, usedGirl, name),
                singleBuff
            )
        })

        state = addOrUpdatePlayerStatusFromBuffs(state, singleBuff)
        state = addOrUpdateBossStatusFromBuffs(state, singleBuff)

        return buffData.applyFunc(state, funcData, name, usedGirl, count, singleBuff.sumValue).then(state => {
            return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state),
                state => {
                    return _removeBuff(state, buffName, name, usedGirl)
                }, time, _buildDeferName(buffName, usedGirl, name)))
        })
    }

    buff = NullableUtils.getExn(buff)

    // if (count + buff.superPositionCount > buffData.maxSuperPositionCount) {
    if (buff.superPositionCount == buffData.maxSuperPositionCount) {
        state = setAbstractState(state, Flow.addOrUpdateDeferExecFuncDataByTime(getAbstractState(state),
            state => {
                return _removeBuff(state, buffName, name, usedGirl)
            }, time, _buildDeferName(buffName, usedGirl, name)))

        return Promise.resolve(state)
    }

    return buffData.deapplyFunc(state, funcData, name, usedGirl, buff.superPositionCount, buff.sumValue).then(state => {
        let newBuff = {
            ...buff,
            time: time,
            // superPositionCount: count + buff.superPositionCount,
            superPositionCount: NumberUtils.lessThan(count + buff.superPositionCount, buffData.maxSuperPositionCount),
            // value: NullableUtils.getWithDefault(
            //     value,
            //     // buff.value
            //     buffData.value
            // )
            // value: value,
            // sumValue: buff.sumValue + value * count
            sumValue: buff.sumValue + value * NumberUtils.lessThan(count, buffData.maxSuperPositionCount - buff.superPositionCount)
        }

        state = _setState(state, {
            ..._getState(state),
            // buffs: _getState(state).buffs.map(b => {
            //     if (_isSingleBuff(b, buffName, usedGirl, name)) {
            //         return newBuff
            //     }

            //     return b
            // })
            buffs: MutableRecordUtils.map(
                _getState(state).buffs,
                b => {
                    if (_isSingleBuff(b, buffName, usedGirl, name)) {
                        return newBuff
                    }

                    return b
                }
            )
        })

        state = addOrUpdatePlayerStatusFromBuffs(state, newBuff)
        state = addOrUpdateBossStatusFromBuffs(state, newBuff)

        return buffData.applyFunc(state, funcData, name, usedGirl, newBuff.superPositionCount, newBuff.sumValue).then(state => {
            return setAbstractState(state, Flow.addOrUpdateDeferExecFuncDataByTime(getAbstractState(state),
                state => {
                    return _removeBuff(state, buffName, name, usedGirl)
                }, time, _buildDeferName(buffName, usedGirl, name)))
        })
    })
}

let _invokeRemoveFunc = (state: state, buffData, funcData, name, usedGirl, superPositionCount, value) => {
    let func = NullableUtils.getWithDefault(
        buffData.removeFunc,
        buffData.deapplyFunc
    )

    return func(state, funcData, name, usedGirl, superPositionCount, value)
}

let _removeBuff = (state: state, buffName: buffName, name, usedGirl) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(buff => {
            let buffData = findBuffData(state, buffName)
            let funcData = buildFuncData(state)

            state = removePlayerStatusFromBuffs(state, usedGirl, buffName, buff.characterType)
            state = removeBossStatusFromBuffs(state, usedGirl, buffName, usedGirl)


            return _invokeRemoveFunc(state, buffData, funcData, name, usedGirl, buff.superPositionCount, buff.sumValue).then(state => {
                return _setState(state, {
                    ..._getState(state),
                    // buffs: _getState(state).buffs.filter(b => {
                    //     return !_isSingleBuff(b, buffName, usedGirl, name)
                    // }
                    // )

                    buffs: MutableRecordUtils.filter(
                        _getState(state).buffs,
                        b => {
                            return !_isSingleBuff(b, buffName, usedGirl, name)
                        }
                    )
                })
            })
            // }, _getState(state).buffs.find(b => _isSingleBuff(b, buffName, usedGirl, name))),
        }, findBuff(state, buffName, name, usedGirl)),
        Promise.resolve(state)
    )
}

export let getBuffs = (state: state) => {
    return _getState(state).buffs
}

let _batchRemoveAllBuffs = (state: state, name: name, usedGirl: nullable<usedGirl>) => {
    // let buffs = _getState(state).buffs.filter(b => _isSingleBuffByNotJudgeBuffName(b, usedGirl, name))
    let buffs = MutableRecordUtils.filter(
        _getState(state).buffs,
        b => _isSingleBuffByNotJudgeBuffName(b, usedGirl, name)
    )

    let funcData = buildFuncData(state)

    // state = ArrayUtils.reduce(buffs.toArray(), (state, buff) => {
    //     state = removePlayerStatusFromBuffs(state, buff.buffName, buff.characterType)
    //     state = removeBossStatusFromBuffs(state, buff.buffName, usedGirl)

    //     state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _buildDeferName(buff.buffName, usedGirl, name)))

    //     return state
    // }, state)

    // return _setState(state, {
    //     ..._getState(state),
    //     buffs: _getState(state).buffs.filter(b => {
    //         return !_isSingleBuffByNotJudgeBuffName(b, usedGirl, name)
    //     }
    //     )
    // })

    return MutableRecordUtils.reducePromise(buffs, (state, buff: singleBuff) => {
        state = removePlayerStatusFromBuffs(state, usedGirl, buff.buffName, buff.characterType)
        state = removeBossStatusFromBuffs(state, usedGirl, buff.buffName, usedGirl)

        state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _buildDeferName(buff.buffName, usedGirl, name)))

        let buffData = findBuffData(state, buff.buffName)

        return _invokeRemoveFunc(state, buffData, funcData, name, usedGirl, buff.superPositionCount, buff.sumValue)
    }, state)
        // return ArrayUtils.reducePromise(buffs.toArray(), (state, buff) => {
        //     state = removePlayerStatusFromBuffs(state, buff.buffName, buff.characterType)
        //     state = removeBossStatusFromBuffs(state, buff.buffName, usedGirl)

        //     state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _buildDeferName(buff.buffName, usedGirl, name)))

        //     let buffData = findBuffData(state, buff.buffName)

        //     return _invokeRemoveFunc(state, buffData, funcData, name, usedGirl, buff.superPositionCount, buff.sumValue)
        // }, state)
        .then(state => {
            return _setState(state, {
                ..._getState(state),
                // buffs: _getState(state).buffs.filter(b => {
                //     return !_isSingleBuffByNotJudgeBuffName(b, usedGirl, name)
                // }
                // )
                buffs: MutableRecordUtils.filter(
                    _getState(state).buffs,
                    b => {
                        return !_isSingleBuffByNotJudgeBuffName(b, usedGirl, name)
                    }
                )
            })
        })
}

// let _batchRemoveAllPlayerBuffs = (state: state, name: name, usedGirl: nullable<usedGirl>) => {
//     requireCheck(() => {
//         test("should be player", () => {
//             return isPlayer(state, name)
//         })
//     }, getIsDebug(state))


//     let buffs = _getState(state).buffs.filter(b => _isSingleBuffByNotJudgeBuffName(b, usedGirl, name))

//     let funcData = buildFuncData(state)

//     return ArrayUtils.reducePromise(buffs.toArray(), (state, buff) => {
//         state = removePlayerStatusFromBuffs(state, buff.buffName, buff.characterType)
//         state = removeBossStatusFromBuffs(state, buff.buffName, usedGirl)

//         state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _buildDeferName(buff.buffName, usedGirl, name)))

//         let buffData = findBuffData(state, buff.buffName)

//         return buffData.deapplyFunc(state, funcData, name, usedGirl, buff.superPositionCount, buff.value)
//     }, state).then(state => {
//         return _setState(state, {
//             ..._getState(state),
//             buffs: _getState(state).buffs.filter(b => {
//                 return !_isSingleBuffByNotJudgeBuffName(b, usedGirl, name)
//             }
//             )
//         })
//     })
// }

export let disposeEnemyData = _batchRemoveAllBuffs

export let disposePlayerData = _batchRemoveAllBuffs

export let removePlayerFiniteTimeBuffs = (state: state, name: name, usedGirl: nullable<usedGirl>) => {
    let buffs = MutableRecordUtils.filter(
        _getState(state).buffs,
        b => _isSingleBuffByNotJudgeBuffName(b, usedGirl, name)
    )

    // return MutableRecordUtils.reduce(buffs, (state, buff: singleBuff) => {
    //     if (isFinite(buff.time)) {
    //         let buffState = getBuffState(state, buff.buffName) as any

    //         if (NullableUtils.isNullable(buffState)) {
    //             return state
    //         }

    //         buffState = NullableUtils.getExn(buffState)

    //         if (NullableUtils.isNullable(buffState.startTime)) {
    //             return state
    //         }

    //         // state = setBuffState(state, buff.buffName, {
    //         //     ...buffState,
    //         //     pauseTime: NullableUtils.return_(getNow(state))
    //         // })
    //         // // console.log(getBuffState(state, buff.buffName))

    //         // return setAbstractState(state, Flow.pauseDeferExecFuncData(getAbstractState(state), _buildDeferName(buff.buffName, usedGirl, name)))

    //         return removeBuff(state, buff.name, name, usedGirl)
    //     }

    //     return state
    // }, state)
    return MutableRecordUtils.reducePromise(
        MutableRecordUtils.filter(buffs, (buff: singleBuff) => {
            if (isFinite(buff.time)) {
                let buffState = getBuffState(state, buff.buffName) as any

                if (NullableUtils.isNullable(buffState)) {
                    return false
                }

                buffState = NullableUtils.getExn(buffState)

                if (NullableUtils.isNullable(buffState.startTime)) {
                    return false
                }

                return true
            }

            return false
        }),
        (state, buff: singleBuff) => {
            return removeBuff(state, buff.buffName, name, usedGirl)
        }, state
    )
}

// export let resumePlayerData = (state: state, name: name, usedGirl: nullable<usedGirl>) => {
//     let buffs = MutableRecordUtils.filter(
//         _getState(state).buffs,
//         b => _isSingleBuffByNotJudgeBuffName(b, usedGirl, name)
//     )

//     return MutableRecordUtils.reduce(buffs, (state, buff: singleBuff) => {
//         if (isFinite(buff.time)) {
//             let buffState = getBuffState(state, buff.buffName) as any

//             if (NullableUtils.isNullable(buffState)) {
//                 return state
//             }

//             buffState = NullableUtils.getExn(buffState)

//             if (NullableUtils.isNullable(buffState.startTime) || NullableUtils.isNullable(buffState.pauseTime)) {
//                 return state
//             }

//             state = setBuffState(state, buff.buffName, {
//                 ...buffState,
//                 startTime: NullableUtils.getExn(buffState.startTime) + getNow(state) - NullableUtils.getExn(buffState.pauseTime),
//                 pauseTime: NullableUtils.getEmpty()
//             })
//             // console.log(getBuffState(state, buff.buffName))

//             return setAbstractState(state, Flow.resumeDeferExecFuncData(getAbstractState(state), _buildDeferName(buff.buffName, usedGirl, name)))
//         }

//         return state
//     }, state)
// }

export let removeBuff = (state, buffName, name, usedGirl) => {
    return _removeBuff(state, buffName, name, usedGirl).then(state => {
        return setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _buildDeferName(buffName, usedGirl, name)))
    })
}

export let dispose = (state: state) => {
    return _setState(state, {
        ...createState(),
        remainedBuffsForNextLevel: MutableRecordUtils.filter(_getState(state).buffs, b => NullableUtils.getWithDefault(b.isWorkInContinueLevels, false))
    })
}

export let applyAllRemainedBuffers = (state: state) => {
    return MutableRecordUtils.reducePromise(_getState(state).remainedBuffsForNextLevel,
        (state, buff) => {
            return addBuff(state, buff.buffName, buff.name, buff.usedGirl, buff.time, buff.superPositionCount, buff.characterType)
        },
        state
    ).then(state => {
        return _setState(state, {
            ..._getState(state),
            remainedBuffsForNextLevel: MutableRecordUtils.create()
        })
    })
}

export let buildDescription = (state, getDescriptionFunc, funcData, count, value, time) => {
    return `${getDescriptionFunc(state, funcData, count, value)}，${getLanguageTextVariableData(state, languageVariableKey.KeepTime)(time)}`
}

export let buildDescriptionWithCharacterType = (state, getDescriptionFunc, funcData, count, value, time, characterType_) => {
    let prefix
    switch (characterType_) {
        case characterType.LittleMan:
            prefix = `${getLanguageTextData(state, languageKey.LittleMan)}: `
            break
        case characterType.Giantess:
            prefix = `${getLanguageTextData(state, languageKey.Giantess)}: `
            break
        case characterType.Both:
            prefix = `${getLanguageTextData(state, languageKey.LittleManAndGiantess)}: `
            break
        case characterType.None:
        case characterType.GiantessOrNone:
        case characterType.LittleManOrNone:
            prefix = ""
            break
    }

    return `${prefix}${buildDescription(state, getDescriptionFunc, funcData, count, value, time)}`
}
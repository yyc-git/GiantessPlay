import { Vector3 } from "three";
import { state } from "../../../../type/StateType";
import { gameEventDirector, gameEventName, singleImpendingGameEventData } from "../type/StateType";
import { getConfigData, getSceneChapter, getState, setState } from "../CityScene";
import { List, Map } from "immutable";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Flow } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getIsDebug, getIsProduction } from "../../Scene";
import { getNow } from "../Time";
import { triggerMainEvent } from "../game_event/GameEvent";
import { Event } from "meta3d-jiehuo-abstract";
import { buildGameEventTipEventData, getGameEventTipEventName } from "../../../../utils/EventUtils";
import { eventName, data as gameEventDirectorData } from "../data/director/GameEventDirectorData";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType";
import { getLanguageTextData, languageKey } from "../../../../internation/Data";
import { findGameEventBlockName } from "../../../../mod/SceneMod";
import { getModAPI } from "../Mod";

const _v1 = new Vector3();
const _v2 = new Vector3();


export let createState = (): gameEventDirector => {
    return {
        // gtsPoints: [],
        customData: Map(),
        selectedGameEvents: List(),
        isTriggeredMap: Map(),
        // impendingGameEventData: List(),
        impendingGameEventData: NullableUtils.getEmpty(),
        instantGameEventData: List(),
    }
}

let _getState = (state): gameEventDirector => {
    return getState(state).gameEventDirector
}

let _setState = (state, gameEventState: gameEventDirector) => {
    return setState(state, {
        ...getState(state),
        gameEventDirector: gameEventState
    })
}



let _getIsTriggered = (state: state, eventName) => {
    return NullableUtils.getWithDefault(
        _getState(state).isTriggeredMap.get(eventName),
        false
    )
}

let _setIsTriggered = (state: state, eventName, value) => {
    return _setState(state, {
        ..._getState(state),
        isTriggeredMap: _getState(state).isTriggeredMap.set(eventName, value)
    })
}

export let getSelectedGameEventData = (state: state) => {
    return NullableUtils.getExn(getConfigData(state).gameEventDirectorData).filter(data => {
        return _getState(state).selectedGameEvents.includes(data.eventName)
    })
}


let _selectEvents = (state: state) => {
    return _setState(state, {
        ..._getState(state),
        // selectedGameEvents: List(NumberUtils.randomSelectMaxCountByRate(NullableUtils.getExn(getConfigData(state).gameEventDirectorData), 2, NullableUtils.getExn(getConfigData(state).gameEventDirectorData).map(data => data.selectRate)))
        selectedGameEvents: List(NumberUtils.randomSelectMaxCountByRate(NullableUtils.getExn(getConfigData(state).gameEventDirectorData), NullableUtils.getExn(getConfigData(state).gameEventDirectorData).length, NullableUtils.getExn(getConfigData(state).gameEventDirectorData).map(data => data.selectRate)).map(data => data.eventName))
    })
}

let _exec = (state: state) => {
    state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), state => {
        if (getIsDebug(state)) {
            return Promise.resolve(_exec(state))
        }

        return ArrayUtils.reducePromise(
            getSelectedGameEventData(state),
            (state, data) => {
                if (_isCanTrigger(state, (state, data) => data.directCondition(state) && data.directorCondition(state), data)) {
                    return data.func(state, data.eventName, data.gameEventName, data.title)
                }

                return Promise.resolve(state)
            },
            state
        ).then(_exec)
    }, 5))
    // }, 0.01))

    return state
}

export let initWhenImportScene = (state: state) => {
    state = _selectEvents(state)
    state = _exec(state)

    return Promise.resolve(state)
}

export let hasAnyImpendingGameEventData = (state: state) => {
    return !NullableUtils.isNullable(_getState(state).impendingGameEventData)
}

let _isAddToImpendingGameEventData = (state: state, eventName: eventName, isInstant) => {
    if (isInstant) {
        // return NullableUtils.isNullable(_getState(state).instantGameEventData.find(v => v.eventName == eventName))
        return false
    }

    // return !NullableUtils.isNullable(_getState(state).impendingGameEventData.find(d => d.eventName == eventName))
    return hasAnyImpendingGameEventData(state)
}

let _removeImpendingGameEventData = (state: state, eventName: eventName) => {
    return _setState(state, {
        ..._getState(state),
        // impendingGameEventData: _getState(state).impendingGameEventData.filter(d => d.eventName != eventName)
        impendingGameEventData: NullableUtils.getEmpty()
    })
}

let _markImpendingGameEventData = (state: state, eventName: eventName, isAlreadyShowedUIInfo: boolean) => {
    return _setState(state, {
        ..._getState(state),
        // impendingGameEventData: _getState(state).impendingGameEventData.map(d => {
        //     if (d.eventName == eventName) {
        //         return {
        //             ...d,
        //             isAlreadyShowedUIInfo
        //         }
        //     }

        //     return d
        // })
        impendingGameEventData: NullableUtils.map(d => {
            return {
                ...d,
                isAlreadyShowedUIInfo
            }
        }, _getState(state).impendingGameEventData)
    })
}

let _findGameEventData = (gameEventDirectorData, eventName) => {
    return gameEventDirectorData.find(data => data.eventName == eventName)
}


let _findGameEventDataExn = (gameEventDirectorData, eventName) => {
    return NullableUtils.getExn(_findGameEventData(gameEventDirectorData, eventName))
}

let _findDirectConditionFunc = (gameEventDirectorData: gameEventDirectorData, eventName) => {
    return _findGameEventDataExn(gameEventDirectorData, eventName).directCondition
}

export let update = (state: state) => {
    // return ArrayUtils.reducePromise(
    //     _getState(state).impendingGameEventData.toArray(),
    //     (state, { eventName, gameEventName, description, time, isAlreadyShowedUIInfo }) => {
    //         let directConditionFunc = _findDirectConditionFunc(NullableUtils.getExn(getConfigData(state).gameEventDirectorData), eventName)

    //         if (!isAlreadyShowedUIInfo) {
    //             if (directConditionFunc(state)) {
    //                 state = _markImpendingGameEventData(state, eventName, true)

    //                 return Event.trigger(state, getAbstractState, getGameEventTipEventName(), buildGameEventTipEventData(description))
    //             }

    //             return Promise.resolve(state)
    //         }

    //         if (getNow(state) >= time) {
    //             state = _removeImpendingGameEventData(state, eventName)

    //             if (directConditionFunc(state)) {
    //                 return _trigger(state, gameEventName, eventName)
    //             }

    //             return Event.trigger(state, getAbstractState, getGameEventTipEventName(), buildGameEventTipEventData(`“${eventName as any as string}”事件取消了`))
    //         }

    //         return Promise.resolve(state)
    //     }, state
    // )
    return NullableUtils.getWithDefault(
        NullableUtils.map(({ eventName, gameEventName, title, description, time, isAlreadyShowedUIInfo }) => {
            let directConditionFunc = _findDirectConditionFunc(NullableUtils.getExn(getConfigData(state).gameEventDirectorData), eventName)

            if (!isAlreadyShowedUIInfo) {
                if (directConditionFunc(state)) {
                    state = _markImpendingGameEventData(state, eventName, true)

                    return Event.trigger(state, getAbstractState, getGameEventTipEventName(), buildGameEventTipEventData(description))
                }

                return Promise.resolve(state)
            }

            if (getNow(state) >= time) {
                state = _removeImpendingGameEventData(state, eventName)

                if (directConditionFunc(state)) {
                    return _trigger(state, gameEventName, eventName)
                }

                return Event.trigger(state, getAbstractState, getGameEventTipEventName(), buildGameEventTipEventData(`“${title as any as string}” ${getLanguageTextData(state, languageKey.CancelEvent)}`))
            }

            return Promise.resolve(state)

        }, _getState(state).impendingGameEventData),
        Promise.resolve(state)
    ).then(state => {
        return ArrayUtils.reducePromise(
            _getState(state).instantGameEventData.toArray(),
            (state, { eventName, gameEventName, description }) => {
                let directConditionFunc = _findDirectConditionFunc(NullableUtils.getExn(getConfigData(state).gameEventDirectorData), eventName)

                if (directConditionFunc(state)) {
                    return NullableUtils.getWithDefault(
                        NullableUtils.map(description => {
                            return Event.trigger(state, getAbstractState, getGameEventTipEventName(), buildGameEventTipEventData(description))
                        }, description),
                        Promise.resolve(state)
                    ).then(state => {
                        return _trigger(state, gameEventName, eventName)
                    })
                }

                return Promise.resolve(state)
            },
            state
        ).then(state => {
            return _setState(state, {
                ..._getState(state),
                instantGameEventData: List()
            })
        })
    })
}

export let dispose = (state: state) => {
    return _setState(state, createState())
}

// export let getGTSPoints = (state: state): Array<Vector3> => {
//     return _getState(state).gtsPoints
// }

// export let setGTSPoints = (state: state, points) => {
//     return _setState(state, {
//         ..._getState(state),
//         gtsPoints: points
//     })
// }

export let hasCustomData = (state: state, key): boolean => {
    return _getState(state).customData.has(key)
}

export let getCustomDataExn = <Data>(state: state, key): Data => {
    return NullableUtils.getExn(_getState(state).customData.get(key))
}

export let getCustomData = <Data>(state: state, key, defaultValue): Data => {
    return NullableUtils.getWithDefault(_getState(state).customData.get(key), defaultValue)
}

export let setCustomData = (state: state, key, value) => {
    return _setState(state, {
        ..._getState(state),
        customData: _getState(state).customData.set(key, value)
    })
}

// export let addImpendingGameEventData = (state: state, data: singleImpendingGameEventData) => {
//     return _setState(state, {
//         ..._getState(state),
//         impendingGameEventData: _getState(state).impendingGameEventData.push(data)
//     })
// }

let _isCanTrigger = (state: state, getConditionFunc, data) => {
    // return (data.isOnlyTriggerOnce && !_getIsTriggered(state, data.eventName))
    return (data.isOnlyTriggerOnce ? !_getIsTriggered(state, data.eventName) : true)
        &&
        !_isAddToImpendingGameEventData(state, data.eventName, NullableUtils.getWithDefault(data.isInstant, false))
        &&
        // data.directCondition(state)
        getConditionFunc(state, data)
}

export let isCanTrigger = (state: state, eventName: eventName) => {
    // return _isCanTrigger(state, (state, data) => data.directCondition(state), NullableUtils.getExn(_findGameEventDataExn(NullableUtils.getExn(getConfigData(state).gameEventDirectorData), eventName))) && getSceneChapter(state) == scene.Play
    return NullableUtils.getWithDefault(
        NullableUtils.map(gameEventData => {
            return _isCanTrigger(state, (state, data) => data.directCondition(state), gameEventData)
        }, _findGameEventData(NullableUtils.getExn(getConfigData(state).gameEventDirectorData), eventName)),
        false
    )
}

let _trigger = (state, gameEventName, eventName: eventName) => {
    state = _setIsTriggered(state, eventName, true)

    return triggerMainEvent(state, gameEventName)
}

export let trigger = (state, eventName: eventName) => {
    let { gameEventName } = _findGameEventDataExn(NullableUtils.getExn(getConfigData(state).gameEventDirectorData), eventName)

    return _trigger(state, gameEventName, eventName)
}

export let triggerByFilter = (state, func, eventGameProtocolName, eventGameBlockPartName) => {
    let blockName
    switch (getSceneChapter(state)) {
        case scene.Play:
            switch (eventGameBlockPartName) {
                // case "callgiantess":
                //     return trigger(
                //         state,
                //         eventName.CallGiantess
                //     )
                case "callgiantess":
                    blockName = "event-game-attack-callgiantess"
                    break
                case "callgoddess":
                    blockName = "event-game-callgoddess"
                    break
            }
            break
        default:
            blockName = NullableUtils.getExn(findGameEventBlockName(state, getSceneChapter(state), eventGameBlockPartName))
            break
    }

    return trigger(
        state,
        func(
            getModAPI(state).blockAPI.getBlockService(state, eventGameProtocolName, blockName)
        )
    )
}

export let getTitle = (state: state, eventName: eventName) => {
    return _findGameEventDataExn(NullableUtils.getExn(getConfigData(state).gameEventDirectorData), eventName).title
}
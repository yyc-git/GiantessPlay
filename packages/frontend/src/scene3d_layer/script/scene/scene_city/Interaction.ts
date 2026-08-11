import { Box3, Matrix4, Quaternion, Vector3 } from "three";
import { state } from "../../../type/StateType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getBuyResourceId, getState, isGiantessCharacterType, isLittleCharacterType, setState } from "./CityScene";
import { interaction, interactionName, usedGirlEnum } from "./type/StateType";
import { Map } from "immutable";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, setAbstractState } from "../../../state/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { Render } from "meta3d-jiehuo-abstract";
import { buildQueue } from "./utils/LODQueueUtils";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { getPosition } from "./little_man/Transform";
import { getBoxMaxXZSize, getBoxMinXZSize } from "./utils/Box3Utils";
import { getBox, getName as getLittleManName } from "./little_man/LittleMan";
import { getGirlBox } from "./girl/Utils";
import { Event } from "meta3d-jiehuo-abstract";
import { characterType, lodQueueIndex, name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue";
import { buildInteractionEventData, getAfterBuyTradeEventName, getInteractionEventName } from "../../../utils/EventUtils";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { Device } from "meta3d-jiehuo-abstract";
import { getPlayerHeight, getPlayerPosition } from "./utils/PlayerUtils";
import { fateSingleData, getChestBoxData, getFateData, getTradeData, rewardName, tradeName, warSingleData } from "./data/interaction/InteractionData";
import { addPropCount, buildAllProps, getDescription, getImageSrc, getIsOutLevelBuild, getTitle } from "./reward/Prop";
import { addCoinInLevel } from "./reward/Coin";
import { isCanTrigger, trigger } from "./director/GameEventDirector";
import { getLanguageTextData, languageKey } from "../../../internation/Data";
import { tradeData } from "../../../../ui_layer/index/scene/store/SceneStoreType";
import { wrapDescription } from "../../../utils/ToastUtils";
import { computeDistanceByBox } from "./utils/InteractionUtils";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { getAllTriggerData } from "../../../mod/InteractionMod";
import { getHeight } from "./utils/DamageUtils";
import { computeCoinByItemPriceFactor, computeCountByLuck, computePropCountByPropCountFactor, getTotalCoin } from "./reward/RewardGenerator";

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();

let _getData = (state: state) => {
    return MutableRecordUtils.concat(
        {
            [interactionName.ChestBox]: {
                description: getLanguageTextData(readState(), languageKey.ChestBoxDescription),
                imageSrc: "./resource/ui/in_game/interaction/chest_box.png"
            },
            [interactionName.TradeGirl]: {
                description: getLanguageTextData(readState(), languageKey.TradeGirlDescription),
                imageSrc: "./resource/ui/in_game/interaction/trade.png"
            },
            // [interactionName.BlessGirl]: {
            //     description: getLanguageTextData(readState(), languageKey.BlessGirlDescription),
            //     imageSrc: "./resource/ui/in_game/interaction/bless.png"
            // },
            [interactionName.FateGirl]: {
                description: getLanguageTextData(readState(), languageKey.FateGirlDescription),
                imageSrc: "./resource/ui/in_game/interaction/fate.png"
            },
        },
        getAllTriggerData(state)
    )
}

export let getNamePrefix = () => "Interaction"

// export let buildCategoryName = (index) => `${getNamePrefix()}_${index}`

export let isInteractions = (name: string) => {
    return name.includes(getNamePrefix())
}


let _getState = (state: state) => {
    return getState(state).interaction
}

let _setState = (state: state, interactionState: interaction) => {
    return setState(state, {
        ...getState(state),
        interaction: interactionState
    })
}

export let addQueue = (state: state,
    queue: LODQueue,
) => {
    return _setState(state, {
        ..._getState(state),
        queues: ArrayUtils.push(_getState(state).queues, queue)
    })
}

export let getFreeBuyCount = (state: state) => {
    return _getState(state).freeBuyCount
}

export let setFreeBuyCount = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        freeBuyCount: value
    })
}


export let createState = (): interaction => {
    return {
        queues: ArrayUtils.create(),
        isUsedMap: Map(),
        currentInteractioData: NullableUtils.getEmpty(),

        tradeVarietyFactor: 0,
        freeBuyCount: 0,
    }
}

// let _buildChestBoxName = (index) => {
//     return `chestBox_${index}`
// }

// export let initWhenImportScene = (state: state) => {
//     const distance = 1000

//     // return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getChestBoxResourceId()), Render.getRenderer(getAbstractState(state))).then(chestBox => {
//     //     let data = buildQueue(state, distance, chestBox.scene)
//     //     state = data[0]
//     //     let queue = data[1]

//     //     return _setState(state, {
//     //         ..._getState(state),
//     //         chestBox: NullableUtils.return_(queue)
//     //     })
//     // })
// }

let _isValid = (state: state, box: Box3, position: Vector3): [boolean, number] => {
    // boxSize = NumberUtils.lessThan(boxSize, 10)
    let distance = position.distanceTo(getPlayerPosition(state))

    if (isGiantessCharacterType(state)) {
        // let height
        // switch (queueName) {
        //     case interactionName.ChestBox:
        //         height = 30
        //         break
        //     default:
        //         height = getHeight(box) * 2
        //         break
        // }
        // if (getPlayerHeight(state) > 100
        if (getPlayerHeight(state) > 400
            && getHeight(box) * 2 < getPlayerHeight(state)) {
            return [false, distance]
        }
    }

    // return [distance < NumberUtils.clamp(getBoxMinXZSize(box) * 0.5 + boxSize * factor, 8, 40), distance]
    return [distance < NumberUtils.greaterThan(getBoxMinXZSize(box) * 0.5 + computeDistanceByBox(state), 8), distance]
}

export let hasCurrentInteractioData = (state) => {
    return !NullableUtils.isNullable(_getState(state).currentInteractioData)
}

export let getCurrentInteractioDataExn = (state) => {
    return NullableUtils.getExn(_getState(state).currentInteractioData)
}

let _clearCurrentInteractionData = (state) => {
    return _setState(state, {
        ..._getState(state),
        currentInteractioData: NullableUtils.getEmpty()
    })
}

let _isCurrentInteractioData = (state, [queue, lodQueueIndex]) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map((currentInteractioData) => {
            return getInteractionName(currentInteractioData[0]) == getInteractionName(queue) && currentInteractioData[1] == lodQueueIndex
        }, _getState(state).currentInteractioData),
        false
    )
}


let _findValidInteraction = (state: state) => {
    return ArrayUtils.get(ArrayUtils.reduce<Array<[number, [LODQueue, lodQueueIndex]]>, LODQueue>(_getState(state).queues, (result, queue) => {
        return queue.reduce(result, (result, transform, index) => {
            let pos = TransformUtils.getPositionFromMatrix4(transform, _v1)

            let [isValid, distance] = _isValid(state, queue.getBox(index), pos)
            if (isValid) {
                return ArrayUtils.push(result, [distance, [queue, index]])
            }

            return result
        })
    }, []).sort((a, b) => {
        return a[0] - b[0]
    }), 0)
}

export let update = (state: state) => {
    // return ArrayUtils.reducePromise<state, [LODQueue, interactionName]>([[NullableUtils.getExn(_getState(state).chestBox), interactionName.ChestBox]], (state, [queue, interactionName_]) => {
    //     return queue.reducePromise(state, (state, transform, index) => {
    //         if (_getState(state).isTriggeringEvent) {
    //             return Promise.resolve(state)
    //         }

    //         let pos = TransformUtils.getPositionFromMatrix4(transform, _v1)

    //         if (_isValid(state, pos)) {
    //             state = markIsTriggeringEvent(state, true)

    //             return Event.trigger(state, getAbstractState, getInteractionEventName(), NullableUtils.return_(buildInteractionEventData(interactionName_)))
    //         }

    //         return Promise.resolve(state)
    //     })
    // }, state).then(state =>{
    //         if (!_getState(state).isTriggeringEvent) {
    //             return Event.trigger(state, getAbstractState, getInteractionEventName(), NullableUtils.return_(buildInteractionEventData(interactionName_)))
    //         }
    // })

    let nearestInteraction = _findValidInteraction(state)

    if (NullableUtils.isNullable(nearestInteraction)) {
        state = _clearCurrentInteractionData(state)

        return Event.trigger(state, getAbstractState, getInteractionEventName(), NullableUtils.getEmpty())
    }

    let [_, interactioData] = NullableUtils.getExn(nearestInteraction)

    // if (_isCurrentInteractioData(state, interactioData)) {
    //     return Promise.resolve(state)
    // }

    state = _setState(state, {
        ..._getState(state),
        currentInteractioData: NullableUtils.return_(interactioData)
    })

    let { description, imageSrc } = _getData(state)[getInteractionName(interactioData[0])]

    description = wrapDescription(state, description)

    return Event.trigger(state, getAbstractState, getInteractionEventName(), NullableUtils.return_(buildInteractionEventData(description, imageSrc
    )))
}

export let dispose = (state: state) => {
    state = _setState(state, createState())

    return state
}

export let getInteractionName = (queue: LODQueue) => {
    return queue.name as any as interactionName
}

let _findImageSrc = (name: rewardName, allProps) => {
    switch (name) {
        case rewardName.Coin:
            return "meta3d-jiehuo-abstract/particle/coin.png"
        default:
            return getImageSrc(allProps, name)
    }
}

export let getRandomChestBoxReward = (state: state): Array<[rewardName, string, number, string]> => {
    let data = getChestBoxData(state)

    let allProps = buildAllProps(state, 0)

    let selected = NumberUtils.randomSelectMaxCountByRate(
        data, 3, data.map(d => d.rate(state))
    )
    if (selected.length == 0) {
        selected = [data[0]]
    }

    return selected.map(d => {
        return [
            d.name,
            NullableUtils.getWithDefaultFunc(
                d.title,
                () => getTitle(allProps, d.name)
            ),
            d.count(state),
            _findImageSrc(d.name, allProps)
        ]
    })
}

// export let getRandomWarBuff = (state: state): Array<[buffName, number, number, string, string]> => {
//     return NumberUtils.randomSelectCount(
//         getWarData(),
//         NumberUtils.getRandomInteger(1, 2)
//     ).map(({ name, time, count }) => {
//         let { imageSrc, getDescriptionFunc, value } = findBuffData(name)

//         return [
//             name, time, count,
//             imageSrc,
//             buildDescription(state, getDescriptionFunc, buildFuncData(state), count, value, time)
//         ]
//     })
// }


export let getRandomFate = (state: state): Array<fateSingleData> => {
    return NumberUtils.randomSelectCount(
        getFateData().filter(data => {
            return isCanTrigger(state, data.name)
        }),
        // NumberUtils.getRandomInteger(1, 2)
        1
    )
}

export let getTradeVarietyFactor = (state: state) => {
    return _getState(state).tradeVarietyFactor
}

export let setTradeVarietyFactor = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        tradeVarietyFactor: value
    })
}


// export let getRandomTrade = (state: state, isNotCheckTotalCoin = false): tradeData => {
export let getRandomTrade = (state: state): tradeData => {
    // let totalCoin = getTotalCoin(state)

    let data = getTradeData(state)
    // if (!isNotCheckTotalCoin) {
    //     data = data.filter(data => {
    //         return data.coin <= totalCoin
    //     })
    // }

    // if (data.length == 0) {
    //     data = getTradeData(state).slice(0, 1)
    // }

    let allProps = buildAllProps(state, 0)

    return NumberUtils.randomSelectCount(
        // data, Math.round(NumberUtils.getRandomInteger(5, 8) * (1 + getTradeVarietyFactor(state)))
        data, Math.round(NumberUtils.getRandomInteger(6, 10) * (1 + getTradeVarietyFactor(state)))
    ).map(d => {
        return [
            d.name,
            computeCoinByItemPriceFactor(d.coin, state),
            d.count,
            getImageSrc(allProps, d.name),
            getTitle(allProps, d.name),
            getDescription(allProps, d.name),
            // isNotOutLevelBuild ? false : getIsOutLevelBuild(allProps, d.name),
            // getIsOutLevelBuild(allProps, d.name)
            false
        ]
    })
}

// export let computeChestBoxRewardCount = (state: state, data: [rewardName, string, number, string]) => {
export let updateChestBoxReward = (state: state, data: [rewardName, string, number, string]): [rewardName, string, number, string] => {
    let count
    switch (data[0]) {
        case rewardName.Coin:
            count = computeCountByLuck(state, data[2])
            break
        default:
            count = computePropCountByPropCountFactor(computeCountByLuck(state, data[2]), state)
            break
    }

    return [data[0], data[1], count, data[3]]
}

export let getChestBoxReward = (state: state, reward: Array<[rewardName, string, number, string]>) => {
    return reward.reduce((state, data) => {
        switch (data[0]) {
            case rewardName.Coin:
                state = addCoinInLevel(state, data[2])
                break
            default:
                state = addPropCount(state, data[0], data[2])
                break
        }

        return state
    }, state)
}

// export let addWarBuff = (state: state, data: Array<[buffName, number, number, string, string]>) => {
//     return ArrayUtils.reducePromise(
//         data, (state, [buffName, time, count]) => {
//             return ArrayUtils.reducePromise(
//                 getAllAliveArmyData(state),
//                 ((state, { name }) => {
//                     return addBuff(state, buffName, name, NullableUtils.getEmpty(), time, count, characterType.None)
//                 }),
//                 state
//             )
//         }, state
//     )
// }

export let triggerEvent = (state: state, data: Array<fateSingleData>) => {
    return ArrayUtils.reducePromise(
        data, (state, { name }) => {
            return trigger(state, name)
        }, state
    )
}

export let buyTrade = (state: state, trade: Array<[tradeName, [number, boolean]]>) => {
    // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
    //     SoundManager.buildNeedToPlaySoundData(getBuyResourceId(), getIsDebug(state), getOriginSystemVolume(state))
    // ))

    state = trade.reduce((state, data) => {
        return addPropCount(state, data[0], data[1][0], data[1][1])
    }, state)

    return Event.trigger(state, getAbstractState, getAfterBuyTradeEventName(), NullableUtils.getEmpty())
}


export let finishUse = (state: state) => {
    if (!hasCurrentInteractioData(state)) {
        return state
    }

    let [queue, lodQueueIndex] = getCurrentInteractioDataExn(state)

    state = _clearCurrentInteractionData(state)

    state = setAbstractState(state, queue.remove(getAbstractState(state), lodQueueIndex))

    return state
}
import { Event } from "meta3d-jiehuo-abstract";
import { state } from "../../../type/StateType";
import { getState, isGiantessCharacterType, isMustStopLoop, setState } from "./CityScene";
import { ui, uiUpdateLoopFrames, usedGirlEnum } from "./type/StateType";
import { getAbstractState, setAbstractState } from "../../../state/State";
import { buildBossStatusUpdateEventNameEventData, buildGiantessStatusUpdateEventNameEventData, buildShowUILightTipEventData, buildSkillStatusData, getBossSkillStatusUpdateEventName, getBossStatusUpdateEventName, getCharacterStatusUpdateEventName, getGiantessStatusUpdateEventName, getLevelBarUpdateEventName, getLevelStatusUpdateEventName, getOperateUpdateEventName, getPlayerSkillStatusUpdateEventName, getRequestFullScreenEventName, getShowUILightTipEventName } from "../../../utils/EventUtils";
import { buildCharacterStatusUpdateEventData, buildLevelStatusUpdateEventData } from "./utils/EventUtils";
import { update as updatePlayerStateStatus } from "./PlayerStateStatus";
import { update as updateBossStateStatus } from "./BossStateStatus";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getRenderAccuracy, getRenderSetting } from "../../../mod/SettingMod";
import { renderAccuracyLevel } from "setting-default/src/Type";
import { clearNeedUpdateStatusDamagePart, getNeedUpdateStatusDamagePart, getNeedUpdateStatusName, getNonPlayerCurrentUsedGirls, isUseGirl } from "./girl/Girl";
import { getBody } from "./data/mmd/MMDData";
import { buildAPI } from "../../../mod/Mod";
import { isDestoryRelatedStates } from "./utils/FSMStateUtils";
import { getStateMachine } from "./girl/FSMState";
import { getModAPI } from "./Mod";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { Flow } from "meta3d-jiehuo-abstract";
import { QueueUtils } from "meta3d-jiehuo-abstract";
import { Device } from "meta3d-jiehuo-abstract";
import { isCanFullScreenForMobile } from "../../../../ui_layer/utils/ScreenUtils";
import { getUICache, setUICache } from "meta3d-jiehuo-abstract/src/storage/Storage";
import { isPlayerGiantess } from "./utils/PlayerUtils";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { buildSkillStatus } from "../../../../ui_layer/utils/SceneUtils";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";

let _getState = (state: state): ui => {
    return getState(state).ui
}

let _setState = (state: state, uiState: ui) => {
    return setState(state, {
        ...getState(state),
        ui: uiState
    })
}

let _restoreUIUpdateLoopCount = (state: state) => {
    switch (getRenderAccuracy(state)) {
        // case renderAccuracyLevel.MostHigh2:
        // case renderAccuracyLevel.MostHigh:
        case renderAccuracyLevel.VeryHigh:
        case renderAccuracyLevel.High:
            state = setUIUpdateLoopCount(state, uiUpdateLoopFrames.Short)
            break
        case renderAccuracyLevel.Middle:
            state = setUIUpdateLoopCount(state, uiUpdateLoopFrames.Middle)
            break
        case renderAccuracyLevel.Low:
        default:
            state = setUIUpdateLoopCount(state, uiUpdateLoopFrames.Long)
            break
    }

    return state
}

let _buildIntervalName = () => "ui_buildIntervalName"

export let initWhenImportScene = (state: state) => {
    state = _restoreUIUpdateLoopCount(state)

    state = setAbstractState(state, Flow.addInterval(getAbstractState(state), [getAbstractState, setAbstractState, state => {
        if (QueueUtils.getCount(getLightUITips(state)) == 0
            || getIsShowingUILightTip(state)
        ) {
            return Promise.resolve(state)
        }

        let data = popLightUITips(state)
        state = data[0]
        let text = data[1]

        return Event.trigger(state, getAbstractState, getShowUILightTipEventName(), buildShowUILightTipEventData(
            text
        ))
    }], 2, _buildIntervalName()))

    return Promise.resolve(state)
}

let _keepFullScreenOnMobile = (state: state) => {
    if (isCanFullScreenForMobile()
        && getIsFullScreenFlag(state)
    ) {
        state = setIsFullScreenFlag(state, false)

        return Event.trigger(state, getAbstractState, getRequestFullScreenEventName(), NullableUtils.getEmpty())
    }

    return Promise.resolve(state)
}

let _updateBossStatus = (state) => {
    // return ArrayUtils.reducePromise(getNonPlayerCurrentUsedGirls(state), ([state, usedGirlResult], usedGirl) => {
    //     // if (usedGirlResult != usedGirlEnum.None) {
    //     //     return Promise.resolve([state, usedGirlResult])
    //     // }

    //     // if (isDestoryRelatedStates(getStateMachine(state, usedGirl))
    //     //     && !NullableUtils.isNullable(getNeedUpdateStatusName(state, usedGirl))
    //     // ) {
    //     //     return Event.trigger(state, getAbstractState, getBossStatusUpdateEventName(), buildBossStatusUpdateEventNameEventData(
    //     //         getBody(),
    //     //         NullableUtils.getExn(getNeedUpdateStatusName(state, usedGirl)),
    //     //         usedGirl
    //     //     )).then(state => [state, usedGirl])
    //     // }
    //     // else if (
    //     if (
    //         !NullableUtils.isNullable(getNeedUpdateStatusName(state, usedGirl))
    //         && !NullableUtils.isNullable(getNeedUpdateStatusDamagePart(state, usedGirl))
    //         // && getIsNeedUpdateStatus(state, usedGirl)
    //         && getCurrentUsedGirl(state) == usedGirl
    //     ) {
    //         let needUpdateStatusDamagePart = getNeedUpdateStatusDamagePart(state, usedGirl)
    //         // state = setIsNeedUpdateStatus(state, usedGirl, false)
    //         // state = clearNeedUpdateStatusDamagePart(state, usedGirl)

    //         return Event.trigger(state, getAbstractState, getBossStatusUpdateEventName(),
    //             buildBossStatusUpdateEventNameEventData(
    //                 NullableUtils.getExn(needUpdateStatusDamagePart),
    //                 NullableUtils.getExn(getNeedUpdateStatusName(state, usedGirl)),
    //                 usedGirl
    //             )
    //         ).then(state => [state, usedGirl])
    //     }

    //     return Promise.resolve([state, usedGirlResult])
    // }, [state, usedGirlEnum.None])

    let data = ArrayUtils.reduce(getNonPlayerCurrentUsedGirls(state), ([state, dataArr], usedGirl) => {
        if (
            !NullableUtils.isNullable(getNeedUpdateStatusName(state, usedGirl))
        ) {
            let needUpdateStatusDamagePart = NullableUtils.getWithDefault(getNeedUpdateStatusDamagePart(state, usedGirl), getBody)
            state = _getState(state).bossStatusUpdateFunc(state, usedGirl)

            return [
                state,
                ArrayUtils.push(dataArr, [
                    needUpdateStatusDamagePart,
                    NullableUtils.getExn(getNeedUpdateStatusName(state, usedGirl)),
                    usedGirl
                ])
            ]
        }

        return [state, dataArr]
    }, [state, ArrayUtils.create()])
    state = data[0]
    let dataArr = data[1]

    return Event.trigger(state, getAbstractState, getBossStatusUpdateEventName(),
        buildBossStatusUpdateEventNameEventData(
            dataArr
        )
    )
}

// let _handleNoBossCase = (state: state) => {
//     let nonPlayerCurrentUsedGirls = getNonPlayerCurrentUsedGirls(state)
//     let currentUsedGirl = getCurrentUsedGirl(state)

//     if (nonPlayerCurrentUsedGirls.length == 0 && currentUsedGirl != usedGirlEnum.None) {
//         state = setCurrentUsedGirl(state, usedGirlEnum.None)

//         return Event.trigger(state, getAbstractState, getBossStatusUpdateEventName(), null)
//             .then(state => {
//                 return Event.trigger(state, getAbstractState, getBossSkillStatusUpdateEventName(),
//                     buildSkillStatusData(
//                         false,
//                         currentUsedGirl
//                     )
//                 )
//             })
//     }

//     return Promise.resolve(state)
// }


export let update = (state: state) => {
    return Event.trigger(state, getAbstractState, getLevelStatusUpdateEventName(), buildLevelStatusUpdateEventData(state))
        .then(state => {
            state = setUIUpdateLoopCount(state, Math.max(_getState(state).uiUpdateLoopCount - 1, 0))

            if (_getState(state).uiUpdateLoopCount <= 0) {
                state = _restoreUIUpdateLoopCount(state)


                state = updatePlayerStateStatus(state, isGiantessCharacterType(state) ? usedGirlEnum.PlayerGirl : usedGirlEnum.None)

                state = ArrayUtils.reduce(getNonPlayerCurrentUsedGirls(state), (state, usedGirl) => {
                    return updateBossStateStatus(state, usedGirl)
                }, state)


                return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null).then(state => {
                    // return _updateBossStatus(state).then(([state, usedGirl]) => {
                    return _updateBossStatus(state)
                    // .then((state) => {
                    //     // state = setCurrentUsedGirl(state, usedGirl)

                    //     return Event.trigger(state, getAbstractState, getPlayerSkillStatusUpdateEventName(),
                    //         buildSkillStatusData(
                    //             _getNeedShowSkillBar(state, usedGirlEnum.PlayerGirl),
                    //             usedGirlEnum.PlayerGirl
                    //         )
                    //     ).then(state => {
                    //         // if (usedGirl != usedGirlEnum.None) {
                    //         //     state = NullableUtils.getWithDefault(
                    //         //         NullableUtils.map(func => {
                    //         //             return func(state, usedGirl)
                    //         //         }, _getState(state).bossStatusUpdateFunc),
                    //         //         state
                    //         //     )
                    //         // }


                    //         // let currentUsedGirl = getCurrentUsedGirl(state)
                    //         // let currentUsedGirl = usedGirl
                    //         // if (currentUsedGirl != usedGirlEnum.None) {
                    //         //     state = NullableUtils.getWithDefault(
                    //         //         NullableUtils.map(func => {
                    //         //             return func(state, currentUsedGirl)
                    //         //         }, _getState(state).bossStatusUpdateFunc),
                    //         //         state
                    //         //     )

                    //         //     return Event.trigger(state, getAbstractState, getBossSkillStatusUpdateEventName(),
                    //         //         buildSkillStatusData(
                    //         //             _getNeedShowSkillBar(state, currentUsedGirl),
                    //         //             currentUsedGirl
                    //         //         )
                    //         //     )
                    //         // }

                    //         return state
                    //     })
                    // })
                    // .then(_handleNoBossCase)
                })
                    // .then(state => {
                    //     return Event.trigger(state, getAbstractState, getLevelStatusUpdateEventName(), buildLevelStatusUpdateEventData(state))
                    // })
                    .then(state => {
                        return Event.trigger(state, getAbstractState, getCharacterStatusUpdateEventName(), buildCharacterStatusUpdateEventData(state))
                    })
                    .then(state => {
                        let usedGirl = usedGirlEnum.PlayerGirl
                        if (
                            isUseGirl(state, usedGirl)
                        ) {
                            if (
                                !NullableUtils.isNullable(getNeedUpdateStatusDamagePart(state, usedGirl))
                            ) {
                                return Event.trigger(state, getAbstractState, getGiantessStatusUpdateEventName(), buildGiantessStatusUpdateEventNameEventData(
                                    // NullableUtils.getExn(getBody())
                                    NullableUtils.getExn(getNeedUpdateStatusDamagePart(state, usedGirl)),
                                    usedGirl
                                ))
                            }
                        }

                        return state
                    })
                    .then(state => {
                        return Event.trigger(state, getAbstractState, getModAPI(state).event.getUpdateUIEventName(), NullableUtils.getEmpty())
                    })
                    .then(_keepFullScreenOnMobile)
            }

            return Promise.resolve(state)
        })
}


export let setUIUpdateLoopCount = (state: state, loopCount: number) => {
    return _setState(state, {
        ..._getState(state),
        uiUpdateLoopCount: loopCount
    })
}

export let addOpenedModalCount = (state: state) => {
    return _setState(state, {
        ..._getState(state),
        openedModalCount: _getState(state).openedModalCount + 1
    })
}

export let subOpenedModalCount = (state: state) => {
    return _setState(state, {
        ..._getState(state),
        openedModalCount: _getState(state).openedModalCount - 1
    })
}

export let resetOpenedModalCount = (state: state) => {
    return _setState(state, {
        ..._getState(state),
        openedModalCount: 0
    })
}


export let hasOpenedModal = (state: state) => {
    return _getState(state).openedModalCount > 0
}

// export let hasOtherOpenedModal = (state: state) => {
//     return _getState(state).openedModalCount > 1
// }

// let _getNeedShowSkillBar = (state: state, usedGirl) => {
//     return MutableRecordUtils.getWithDefault(_getState(state).needShowSkillBar, usedGirl, false)
// }

// export let setNeedShowSkillBar = (state: state, usedGirl, value) => {
//     return _setState(state, {
//         ..._getState(state),
//         needShowSkillBar: MutableRecordUtils.set(_getState(state).needShowSkillBar, usedGirl, value)
//     })
// }

export let registerBossStatusUpdateFunc = (state: state, func) => {
    return _setState(state, {
        ..._getState(state),
        bossStatusUpdateFunc: NullableUtils.return_(func)
    })
}


export let getIsShowingUILightTip = (state: state) => {
    return _getState(state).isShowingUILightTip
}

export let setIsShowingUILightTip = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isShowingUILightTip: value
    })
}


export let getLightUITips = (state: state) => {
    return _getState(state).lightUITips
}

export let setLightUITips = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        lightUITips: value
    })
}

export let pushLightUITips = (state: state, text) => {
    return setLightUITips(state, QueueUtils.push(getLightUITips(state), text))
}

export let popLightUITips = (state: state) => {
    return [state, QueueUtils.pop(getLightUITips(state))]
}




export let getIsShowCoinAnimation = (state: state) => {
    return _getState(state).isShowCoinAnimation
}

export let setIsShowCoinAnimation = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isShowCoinAnimation: value
    })
}

export let getIsShowGemAnimation = (state: state) => {
    return _getState(state).isShowGemAnimation
}

export let setIsShowGemAnimation = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isShowGemAnimation: value
    })
}


export let getIsGenerateProp = (state: state) => {
    return _getState(state).isGenerateProp
}

export let setIsGenerateProp = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isGenerateProp: value
    })
}


export let getIsShowUpgradeParticle = (state: state) => {
    return _getState(state).isShowUpgradeParticle
}

export let setIsShowUpgradeParticle = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isShowUpgradeParticle: value
    })
}

export let getIsShowBuildingSmoke = (state: state) => {
    return _getState(state).isShowBuildingSmoke
}

export let setIsShowBuildingSmoke = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isShowBuildingSmoke: value
    })
}

export let getIsShowExplosionSmoke = (state: state) => {
    return _getState(state).isShowExplosionSmoke
}

export let setIsShowExplosionSmoke = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isShowExplosionSmoke: value
    })
}


export let getIsEliteGiantePlayDeathAnimation = (state: state) => {
    return _getState(state).isEliteGiantePlayDeathAnimation
}

export let setIsEliteGiantePlayDeathAnimation = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isEliteGiantePlayDeathAnimation: value
    })
}


export let getIsFullScreenFlag = (state: state) => {
    return _getState(state).isFullScreenFlag
}

export let setIsFullScreenFlag = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isFullScreenFlag: value
    })
}


export let isHideUI = (state: state) => {
    return _getState(state).isHideUI
}

export let setIsHideUI = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isHideUI: value
    })
}

export let createState = (): ui => {
    return {
        uiUpdateLoopCount: -1,
        // needShowSkillBar: MutableRecordUtils.create(),
        openedModalCount: 0,

        isShowingUILightTip: false,
        lightUITips: QueueUtils.create(),

        isShowCoinAnimation: true,
        isShowGemAnimation: true,
        isGenerateProp: true,
        isShowUpgradeParticle: true,
        isShowBuildingSmoke: true,
        isShowExplosionSmoke: true,
        isEliteGiantePlayDeathAnimation: true,

        isFullScreenFlag: true,

        isHideUI: false,

        bossStatusUpdateFunc: NullableUtils.getEmpty(),
    }
}

export let dispose = (state: state) => {
    state = setAbstractState(state, Flow.clearInterval(getAbstractState(state), _buildIntervalName()))

    return _setState(state, {
        ...createState(),
        isShowGemAnimation: _getState(state).isShowGemAnimation,
        isShowCoinAnimation: _getState(state).isShowCoinAnimation,
        isGenerateProp: _getState(state).isGenerateProp,
        isShowUpgradeParticle: _getState(state).isShowUpgradeParticle,
        isShowBuildingSmoke: _getState(state).isShowBuildingSmoke,
        isShowExplosionSmoke: _getState(state).isShowExplosionSmoke,
        isEliteGiantePlayDeathAnimation: _getState(state).isEliteGiantePlayDeathAnimation,

        isFullScreenFlag: _getState(state).isFullScreenFlag,

        isHideUI: _getState(state).isHideUI,
    })
}

let _buildIsShowGemAnimationCacheKey = () => "_buildIsShowGemAnimationCacheKey"

let _buildIsShowCoinAnimationCacheKey = () => "_buildIsShowCoinAnimationCacheKey"

let _buildIsGeneratePropCacheKey = () => "_buildIsGeneratePropCacheKey"

let _buildIsShowUpgradeParticleCacheKey = () => "_buildIsShowUpgradeParticleCacheKey"

let _buildIsShowBuildingSmokeCacheKey = () => "_buildIsShowBuildingSmokeCacheKey"

let _buildIsShowExplosionSmokeCacheKey = () => "_buildIsShowExplosionSmokeCacheKey"

let _buildIsEliteGiantePlayDeathAnimationCacheKey = () => "_buildIsEliteGiantePlayDeathAnimationCacheKey"

// let _buildIsFullScreenFlagCacheKey = () => "_buildIsFullScreenFlagCacheKey"

let _buildIsHideUICacheKey = () => "_buildIsHideUICacheKey"

export let getUIDataFromBackend = (state: state) => {
    return getUICache(_buildIsShowGemAnimationCacheKey()).then(value => {
        return NullableUtils.getWithDefault(NullableUtils.map(value => {
            return setIsShowGemAnimation(state, value)
        }, value), state)
    })
        .then(state => {
            return getUICache(_buildIsShowCoinAnimationCacheKey()).then(value => {
                return NullableUtils.getWithDefault(NullableUtils.map(value => {
                    return setIsShowCoinAnimation(state, value)
                }, value), state)
            })
        })
        .then(state => {
            return getUICache(_buildIsGeneratePropCacheKey()).then(value => {
                return NullableUtils.getWithDefault(NullableUtils.map(value => {
                    return setIsGenerateProp(state, value)
                }, value), state)
            })
        })
        .then(state => {
            return getUICache(_buildIsShowUpgradeParticleCacheKey()).then(value => {
                return NullableUtils.getWithDefault(NullableUtils.map(value => {
                    return setIsShowUpgradeParticle(state, value)
                }, value), state)
            })
        })
        .then(state => {
            return getUICache(_buildIsShowBuildingSmokeCacheKey()).then(value => {
                return NullableUtils.getWithDefault(NullableUtils.map(value => {
                    return setIsShowBuildingSmoke(state, value)
                }, value), state)
            })
        })
        .then(state => {
            return getUICache(_buildIsShowExplosionSmokeCacheKey()).then(value => {
                return NullableUtils.getWithDefault(NullableUtils.map(value => {
                    return setIsShowExplosionSmoke(state, value)
                }, value), state)
            })
        })
        .then(state => {
            return getUICache(_buildIsEliteGiantePlayDeathAnimationCacheKey()).then(value => {
                return NullableUtils.getWithDefault(NullableUtils.map(value => {
                    return setIsEliteGiantePlayDeathAnimation(state, value)
                }, value), state)
            })
        })
        // .then(state => {
        //     return getUICache(_buildIsFullScreenFlagCacheKey()).then(value => {
        //         return NullableUtils.getWithDefault(NullableUtils.map(value => {
        //             return setIsFullScreenFlag(state, value)
        //         }, value), state)
        //     })
        // })
        .then(state => {
            return getUICache(_buildIsHideUICacheKey()).then(value => {
                return NullableUtils.getWithDefault(NullableUtils.map(value => {
                    return setIsHideUI(state, value)
                }, value), state)
            })
        })
}

export let saveIsShowGemAnimation = (state: state) => {
    return setUICache(_buildIsShowGemAnimationCacheKey(), getIsShowGemAnimation(state))
}

export let saveIsShowCoinAnimation = (state: state) => {
    return setUICache(_buildIsShowCoinAnimationCacheKey(), getIsShowCoinAnimation(state))
}

export let saveIsGenerateProp = (state: state) => {
    return setUICache(_buildIsGeneratePropCacheKey(), getIsGenerateProp(state))
}

export let saveIsShowUpgradeParticle = (state: state) => {
    return setUICache(_buildIsShowUpgradeParticleCacheKey(), getIsShowUpgradeParticle(state))
}

export let saveIsShowBuildingSmoke = (state: state) => {
    return setUICache(_buildIsShowBuildingSmokeCacheKey(), getIsShowBuildingSmoke(state))
}

export let saveIsShowExplosionSmoke = (state: state) => {
    return setUICache(_buildIsShowExplosionSmokeCacheKey(), getIsShowExplosionSmoke(state))
}

export let saveIsEliteGiantePlayDeathAnimation = (state: state) => {
    return setUICache(_buildIsEliteGiantePlayDeathAnimationCacheKey(), getIsEliteGiantePlayDeathAnimation(state))
}

// export let saveIsFullScreenFlag = (state: state) => {
//     return setUICache(_buildIsFullScreenFlagCacheKey(), getIsFullScreenFlag(state))
// }

export let saveIsHideUI = (state: state) => {
    return setUICache(_buildIsHideUICacheKey(), isHideUI(state))
}

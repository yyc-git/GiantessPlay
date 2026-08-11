// export let getClosePageEventName = () => "meta3d_close_page"

import { NullableUtils } from "meta3d-jiehuo-abstract"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { upgradeFuncData, upgradeStoreData } from "../script/scene/scene_city/data/build/BuildData"
import { Event } from "meta3d-jiehuo-abstract"

// export let getSwitchSceneEventName = () => "meta3d_switch_scene"

// export let getShowModalEventName = () => "meta3d_show_modal"

// export let getEnterOperateCabinetModeEventName = () => "meta3d_enter_operateCabinetMode"

// export let getExitOperateCabinetModeEventName = () => "meta3d_exit_operateCabinetMode"

// export let getCabinetDrawerAnimationIsPlayingEventName = () => "meta3d_cabinet_drawer_animation_is_playing"

// export let getCabinetDrawerAnimationIsStopEventName = () => "meta3d_cabinet_drawer_animation_is_stop"

// export let getShowThirdPersonControlsTipEventName = () => "meta3d_show_thirdpersoncontrols_tip"
// export let getShowTipEventName = () => "meta3d_show_tip"


export let getSceneUIEventName = () => "getSceneUIEventName"

export let getMissionCompleteEventName = () => "mission_complete"

export let getMissionFailEventName = () => "mission_fail"

export let getMissionEndEventName = () => "mission_end"

// export let getDestroyedRateUpdateEventName = () => "destoyed_rate_update"

export let getOpenSettingEventName = () => "open_setting"

// export let getHeightUpdateEventName = () => "height_update"


export let getLevelStatusUpdateEventName = () => "destoyed_rate_update"

export let getBossStatusUpdateEventName = () => "boss_status_update"

export let getGiantessStatusUpdateEventName = () => "giantess_status_update"

export let getPlayerSkillStatusUpdateEventName = () => "getPlayerSkillStatusUpdateEventName"

export let getBossSkillStatusUpdateEventName = () => "getBossSkillStatusUpdateEventName"

export let getCharacterStatusUpdateEventName = () => "character_status_update"

export let getLittleManStatusUpdateEventName = () => "little_man_status_update"

export let getLevelBarUpdateEventName = () => "level_bar_update"

export let getStompHitTerrainEventName = () => "getStompHitTerrainEventName"

export let getStartKeepStompEventName = () => "getStartKeepStompEventName"

export let getEndStompBackEventName = () => "getEndStompBackEventName"

export let getFirstStartKeepLeftStompEventName = () => "getFirstStartKeepLeftStompEventName"

export let getEndLeftStompBackEventName = () => "getEndLeftStompBackEventName"

export let getStartKeepBreastPressEventName = () => "getStartKeepBreastPressEventName"

export let getEndBreastPressBackEventName = () => "getEndBreastPressBackEventName"


export let getMoveHitTerrainEventName = () => "getMoveHitTerrainEventName"

// export let getErrorEventName = () => "error"

// export let getNetworkErrorEventName = () => "getNetworkErrorEventName"
export let getErrorEventName = Event.getErrorEventName

export let getNetworkErrorEventName = Event.getNetworkErrorEventName

export let getCanvasNoneEventName = () => "getCanvasNoneEventName"

export let getIsEnterScenarioEventName = () => "is_enter_scenario"

// export let getBlackScreenStartEventName = () => "black_screen_start"

// export let getBlackScreenStopEventName = () => "black_screen_stop"

export let getExitScenarioEventName = () => "exit_scenario"

export let getShowDialogueEventName = () => "show_dialogue"

export let getStandToCrawlEventName = () => "stand_to_crawl"

export let getCrawlToStandEventName = () => "crawl_to_stand"

export let getPickupEventName = () => "pickup"

export let getPinchJudageDamageEventName = () => "pinch_judge_damage"

export let getEatEventName = () => "eat"

export let getPickdownEventName = () => "pickdown"

export let getInsertEventName = () => "getInsertEventName"

export let getPutToBreastEventName = () => "getPutToBreastEventName"

export let getPutToShoeEventName = () => "getPutToShoeEventName"


export let getOperateUpdateEventName = () => "operate_update"


export let getManualUIUpdateEventName = () => "getManualUIUpdateEventName"

export let getLittleManShootStartEventName = () => "little_man_shoot_start"

export let getLittleManShootEmitEventName = () => "little_man_shoot_emit"

export let getLittleManSwipingStartEventName = () => "little_man_swiping_start"

export let getLittleManSwipingEndEventName = () => "little_man_swiping_end"

// export let getLittleManSwipingEmitEventName = () => "little_man_swiping_emit"

// export let getLittleManClimbToTopEventName = () => "little_man_climb_to_top"

// export let getLittleManDeathNeedFixPositionYOffsetEventName = () => "little_man_death_need_fix_positionYOffset"

// export let getLittleManStandupNeedFixPositionYOffset1EventName = () => "little_man_standup_need_fix_positionYOffset1"

// export let getLittleManStandupNeedFixPositionYOffset2EventName = () => "little_man_standup_need_fix_positionYOffset2"

export let getLittleManStandupEndEventName = () => "little_man_standup_end"



export let getHangRightLightStompEndEventName = () => "hang_right_light_stomp_env"

export let getHangLeftLightStompEndEventName = () => "hang_left_light_stomp_env"

export let getBackRightLightStompEndEventName = () => "back_right_light_stomp_env"

export let getBackLeftLightStompEndEventName = () => "back_left_light_stomp_env"

export let getPickdownFromIdleWorkEventName = () => "pickdown_fromIdle_work"

// export let getActioNodeFinishEventName = () => "action_node_finish"

// export let getQTEStartEventName = () => "qte_start"

// export let getQTEEndEventName = () => "qte_end"

export let getQTEUpdateEventName = () => "qte_update"

export let getMarkFinishEventName = () => "mark_finish"



// export let getRightHandDefaultToOneFingerEndEventName = () => "RightHandDefaultToOneFingerEndEventName"

// export let getTwoHandsDefaultToOneFingerEndEventName = () => "TwoHandsDefaultToOneFingerEndEventName"

export let getHeavyStressingLieBeginMaxEventName = () => "HeavyStressingLieBeginMaxEventName"

export let getHeavyStressingLieEndMaxEventName = () => "HeavyStressingLieEndMaxEventName"

export let getHeavyStressingLieEndEventName = () => "HeavyStressingLieEndEventName"


export let getLittleManAnimationChangeEventName = () => "little_man_animation_change"

export let getSwitchCharacterTypeEventName = () => "getSwitchCharacterTypeEventName"


export let getUpgradeEventName = () => "getUpgradeEventName"

export let getGetPropEventName = () => "getGetPropEventName"

export let getCaptureLevelGiantessEventName = () => "getCaptureLevelGiantessEventName"


export let getPointerLockEventName = () => "getPointerLockEventName"


export let getGameEventTipEventName = () => "getGameEventTipEventName"


export let getInteractionEventName = () => "getInteractionEventName"

export let getCloseAllUIEventName = () => "getCloseAllUIEventName"

export let getShowUITipEventName = () => "getShowUITipEventName"

export let getShowUILightTipEventName = () => "getShowUILightTipEventName"

export let getMissionFinishEventName = () => "getMissionFinishEventName"

// export let getSetFastPropEventName = () => "getSetFastPropEventName"

export let getShowEnterDoorToastEventName = () => "getShowEnterDoorToastEventName"

export let getHideEnterDoorToastEventName = () => "getHideEnterDoorToastEventName"


export let getGetLittleManValueEventName = () => "getGetLittleManValueEventName"

export let getGiantessStressingEventName = () => "getGiantessStressingEventName"

export let getGiantessExcitementEventName = () => "getGiantessExcitementEventName"

export let getGiantessClimaxEventName = () => "getGiantessClimaxEventName"

export let getGenerateLittleManRandomCareerEventName = () => "getGenerateLittleManRandomCareerEventName"

export let getGenerateGiantessRandomCareerEventName = () => "getGenerateGiantessRandomCareerEventName"

export let getTriggerPlayerGirlEatHandlerEventName = () => "getTriggerPlayerGirlEatHandlerEventName"

export let getAfterBuyTradeEventName = () => "getAfterBuyTradeEventName"

export let getOpenTradeEventName = () => "getOpenTradeEventName"

export let getSwitchWeaponEventName = () => "getSwitchWeaponEventName"

export let getPickPropRangeDistanceFactorForLittleManEventName = () => "getPickPropRangeDistanceFactorForLittleManEventName"

export let getRequestFullScreenEventName = () => "getRequestFullScreenEventName"

export let getFreeUBEventName = () => "getFreeUBEventName"

export let getFreeShoeEventName = () => "getFreeShoeEventName"

export let getRemovePickDataEventName = () => "getRemovePickDataEventName"

export let getRemoveUBDataEventName = () => "getRemoveUBDataEventName"

export let getRemoveBreastDataEventName = () => "getRemoveBreastDataEventName"

export let getRemoveShoeDataEventName = () => "getRemoveShoeDataEventName"

// export let getChangeGiantessAnimationEventName = () => "getChangeGiantessAnimationEventName"


export let buildStompHitTerrainEventData = (point, force, stompRangeBox,
    collisionPart_,
    shoeType,
    usedGirl
) => {
    return {
        point,
        force,
        stompRangeBox,
        collisionPart_,
        shoeType,
        usedGirl
    }
}

export let buildMoveHitTerrainEventData = (point, force,
    footBox,
    // footSide,
    collisionPart_,
    shoeType,
    usedGirl
) => {
    return {
        point,
        force,
        footBox,
        collisionPart_,
        shoeType,
        usedGirl
    }
}


export let buildErrorEventData = (error: Error) => {
    return {
        error: error
    }
}

export let buildNetworkErrorEventData = (error: Error, retryFunc) => {
    return {
        error: error,
        retryFunc
    }
}

export let buildShowDialogueEventData = (title, content, isInMiddle) => {
    return {
        data: content.length == 0 ? NullableUtils.getEmpty() : NullableUtils.return_(
            {
                title,
                content,
                isInMiddle
            }
        )
    }
}

export let buildPickupEventData = (box, usedGirl) => {
    return {
        // point,
        // force,
        box,
        usedGirl
    }
}

export let buildPickdownEventData = (point, usedGirl) => {
    return {
        point,
        usedGirl,
        // force,
        // box
    }
}

export let buildSkillStatusData = (isShow, usedGirl) => {
    return {
        isShow,
        usedGirl
    }
}

// export let buildBossStatusUpdateEventNameEventData = (damagePart, name, usedGirl) => {
//     return {
//         damagePart,
//         name,
//         usedGirl
//     }
// }
export let buildBossStatusUpdateEventNameEventData = (dataArr) => {
    return {
        dataArr
    }
}

export let buildGiantessStatusUpdateEventNameEventData = (damagePart, usedGirl) => {
    return {
        damagePart,
        usedGirl
    }
}

// export let buildHangRightLightStompEndEventNameEventData = () => {
//     return {
//     }
// }

// export let buildBackRightLightStompEndEventNameEventData = () => {
//     return {
//     }
// }

export let buildPickdownFromIdleWorkEventNameEventData = (point) => {
    return {
        point
    }
}

export let buildInsertEventData = (data, usedGirl) => {
    return {
        data, usedGirl
    }
}

export let buildPutToBreastEventData = (data, usedGirl) => {
    return {
        data, usedGirl
    }
}

export let buildPutToShoeEventData = (data, usedGirl) => {
    return {
        data, usedGirl
    }
}


// export let buildActionNodeFinishEventNameEventData = (id, result) => {
//     return {
//         id,
//         result
//     }
// }

// export let buildQTEStartEventData = (speed) => {
//     return {
//         speed
//     }
// }

// export let buildQTEEndEventData = (isHit) => {
//     return {
//         isHit
//     }
// }

export let buildLittleManAnimationChangeEventData = (currentAnimationName, nextAnimationName) => {
    return {
        currentAnimationName, nextAnimationName
    }
}

export let buildSwitchCharacterTypeEventData = (characterType: characterType) => {
    return {
        characterType
    }
}

// export let buildUpgradeEventData = (data: Array<Array<upgradeFuncData>>) => {
export let buildUpgradeEventData = (data: Array<upgradeStoreData>) => {
    return {
        data: data
    }
}

export let buildGetPropEventData = (image, imageSrc, title, name, description, count) => {
    return {
        imageSrc,
        image,
        title,
        name,
        description,
        count,
    }
}

export let buildCaptureLevelGiantessEventData = (girlPosition, mmdCharacter) => {
    return {
        girlPosition,
        mmdCharacter
    }
}

export let buildGameEventTipEventData = (description) => {
    return {
        description
    }
}


export let buildInteractionEventData = (description, imageSrc) => {
    return {
        // interactionName,
        description,
        imageSrc
    }
}


export let buildSceneUIEventData = (data) => {
    return {
        data
    }
}

export let buildShowUITipEventData = (text, closeHandler) => {
    return {
        text,
        closeHandler
    }
}

export let buildShowUILightTipEventData = (text) => {
    return {
        text,
    }
}


export let buildMissionFinishEventData = (missionFinishStatus) => {
    return {
        missionFinishStatus
    }
}

export let buildGiantessStubData = (fromName) => {
    return {
        fromName
    }
}

export let buildGenerateRandomCareerEventData = (characterType) => {
    return {
        characterType
    }
}

export let buildTriggerEatHandlerEventData = (scaleIncrease) => {
    return {
        scaleIncrease
    }
}

export let buildOpenTradeHandlerEventData = (tradeData) => {
    return {
        tradeData
    }
}

// export let buildPickPropRangeDistanceFactorForLittleManHandlerEventData = (factor) => {
//     return {
//         factor
//     }
// }

// export let buildChangeGiantessAnimationEventData = (currentAnimationName, nextAnimationName) => {
//     return {
//         currentAnimationName, nextAnimationName
//     }
// }


export let buildFreeEventData = (objectData) => {
    return {
        objectData
    }
}

export let buildRemoveDataData = (name) => {
    return {
        name
    }
}
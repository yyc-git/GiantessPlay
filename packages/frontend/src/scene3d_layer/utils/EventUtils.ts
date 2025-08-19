// export let getClosePageEventName = () => "meta3d_close_page"

import { NullableUtils } from "meta3d-jiehuo-abstract"

// export let getSwitchSceneEventName = () => "meta3d_switch_scene"

// export let getShowModalEventName = () => "meta3d_show_modal"

// export let getEnterOperateCabinetModeEventName = () => "meta3d_enter_operateCabinetMode"

// export let getExitOperateCabinetModeEventName = () => "meta3d_exit_operateCabinetMode"

// export let getCabinetDrawerAnimationIsPlayingEventName = () => "meta3d_cabinet_drawer_animation_is_playing"

// export let getCabinetDrawerAnimationIsStopEventName = () => "meta3d_cabinet_drawer_animation_is_stop"

// export let getShowThirdPersonControlsTipEventName = () => "meta3d_show_thirdpersoncontrols_tip"
// export let getShowTipEventName = () => "meta3d_show_tip"


export let getMissionCompleteEventName = () => "mission_complete"

export let getMissionFailEventName = () => "mission_fail"

// export let getDestroyedRateUpdateEventName = () => "destoyed_rate_update"

export let getOpenSettingEventName = () => "open_setting"

// export let getHeightUpdateEventName = () => "height_update"


export let getLevelStatusUpdateEventName = () => "destoyed_rate_update"

export let getGiantessStatusUpdateEventName = () => "giantess_status_update"

export let getSkillStatusUpdateEventName = () => "skill_status_update"

export let getLittleManStatusUpdateEventName = () => "little_man_status_update"

export let getHitTerrainEventName = () => "hit_terrain"

export let getErrorEventName = () => "error"

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

export let getOperateUpdateEventName = () => "operate_update"

export let getLittleManShootStartEventName = () => "little_man_shoot_start"

export let getLittleManShootEmitEventName = () => "little_man_shoot_emit"

export let getLittleManSwipingStartEventName = () => "little_man_swiping_start"

export let getLittleManSwipingEmitEventName = () => "little_man_swiping_emit"

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


export let buildHitTerrainEventData = (point, force, box) => {
    return {
        point,
        force,
        box
    }
}

export let buildErrorEventData = (error: Error) => {
    return {
        error: error
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

export let buildPickupEventData = (box) => {
    return {
        // point,
        // force,
        box
    }
}

export let buildPickdownEventData = (point) => {
    return {
        point,
        // force,
        // box
    }
}


export let buildGiantessStatusUpdateEventNameEventData = (damageType) => {
    return {
        damageType
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
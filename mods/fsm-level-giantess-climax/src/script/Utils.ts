import { api } from "type-api/src/Type"
import { state as blockState } from "fsm-protocol/src/state/StateType"

export let getProtocolName = () => "fsm-protocol"

export let getBlockName = () => "fsm-level-giantess-climax"

export let getBuffProtocolName = () => "buff-protocol"

export let getBuffExcitementBlockName = () => "buff-excitement-level-giantess"

export let getBuffTiredBlockName = () => "buff-tired-level-giantess"

export let getPropOtherProtocolName = () => "prop-other-protocol"

export let getHolyWaterBlockName = () => "prop-other-holywater"

export let getSkillGiantessProtocolName = () => "skill-giantess-protocol"

export let getSitHeavyStressingBlockName = () => "skill-giantess-sit-heavystressing"

export let createState = (api: api): blockState => {
    return {
        rate: 0.5
    }
}
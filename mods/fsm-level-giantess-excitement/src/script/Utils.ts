import { api } from "type-api/src/Type"
import { state as blockState } from "fsm-protocol/src/state/StateType"

export let getProtocolName = () => "fsm-protocol"

export let getBlockName = () => "fsm-level-giantess-excitement"

export let getBuffProtocolName = () => "buff-protocol"

export let getBuffBlockName = () => "buff-excitement-level-giantess"

export let getBuffTiredBlockName = () => "buff-tired-level-giantess"

export let getBuffExcitementBlockName = () => "buff-excitement-level-giantess"

export let getSkillGiantessProtocolName = () => "skill-giantess-protocol"

export let getSitHeavyStressingBreastBlockName = () => "skill-giantess-sit-heavystressing-breast"

export let getSitHeavyStressingTrigoneAndButtBlockName = () => "skill-giantess-sit-heavystressing-trigoneandbutt"

export let createState = (api: api): blockState => {
    return {
        rate: 0.5
    }
}
import { api } from "type-api/src/Type"
import { state as blockState } from "fsm-protocol/src/state/StateType"

export let getProtocolName = () => "fsm-protocol"

export let getBlockName = () => "fsm-girl-climax"

export let getBuffProtocolName = () => "buff-protocol"

export let getBuffExcitementBlockName = () => "buff-excitement-girl"

export let getBuffTiredBlockName = () => "buff-tired-girl"

export let getSkillGiantessProtocolName = () => "skill-giantess-protocol"

export let getSitHeavyStressingBlockName = () => "skill-giantess-sit-heavystressing"


export let createState = (api: api): blockState => {
    return {
        rate: 0.5
    }
}
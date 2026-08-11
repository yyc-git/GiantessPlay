import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName, getProtocolName } from "../script/Utils"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

// export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "FSM_LittleMan_Repel"

// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

export let isControlledState = (api: api, stateMachine) => api.StateMachine.isState(stateMachine, getName())
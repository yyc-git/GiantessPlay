import { api } from "type-api/src/Type"
import { state as blockState } from "event-game-protocol/src/state/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName, getEventGameBlockName, getEventGameProtocolName, getProtocolName } from "../script/Utils"
import { singleData as singleGameEventDirectorData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/director/GameEventDirectorData"
import { singleData as singleGameEventData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/GameEventData"
import { command_, data as scenarioData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ScenarioData"
import { rate } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { girlValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { autoDifficulty, camp } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export let getUsedGirl = () => "Level_Giantess_PlayerGiantess"

export let getCamp = () => camp.Player

export enum languageKey {
    // Title,
    // Description,
    Name,
}

export let getTextData = (): data => {
    return {
        [language.Chinese]: {
            // [languageKey.Title]: "巨大娘",
            // [languageKey.Description]: "巨大娘1出现",
            [languageKey.Name]: "玩家巨大娘",
        },
        [language.English]: {
            // [languageKey.Title]: "Giantess",
            // [languageKey.Description]: "Giantess Appear",
            [languageKey.Name]: "Player Giantess",
        },
    }
}

export let getName = (api: api, state: state) => api.getLanguageDataByData(state, getTextData(), languageKey.Name)

export let updateGiantessValue = (api: api) => (state: state, value: girlValue) => {
    return value
}
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"
import { buffName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { blessSingleData } from "interaction-protocol/src/service/ServiceType"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => `./${getBlockName()}/src/asset/${name}.mp3`

export let getAddBuffResourceId = () => "add_buff"

export let getOpenBuffGirlResourceId = () => "open_buffgirl"

export enum languageKey {
    BlessGirlDescription,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.BlessGirlDescription]: "开启祝福女神",
        },
        [language.English]: {
            [languageKey.BlessGirlDescription]: "Open Bless Giantess",
        },
    }
}

export let getBlessGirlMapResourceId = () => 1031

export let getBlessGirlResourceId = () => "blessGirl"

export let getBlessGirlResourcePath = () => _getPath(getBlessGirlResourceId(), "glb")

export let getName = () => "Interaction_BlessGirl"

export let getBlessData = (api: api): Array<blessSingleData> => {
    return [
        {
            name: buffName.IncreaseMoveSpeed,
            time: 60,
            count: api.NumberUtils.getRandomInteger(3, 8),
        },
        {
            name: buffName.IncreaseActionSpeed,
            time: 60,
            count: api.NumberUtils.getRandomInteger(2, 4),
        },
    ]
}

export let getInteractionConfig = () => {
    return {
        resourceId: getBlessGirlMapResourceId(),
        rate: 0.01
    }
}

export let getLoadResourceIdData = () => {
    return {
        [getBlessGirlMapResourceId()]: {
            loadResourceId: getBlessGirlResourceId()
        },
    }
}

export let getTriggerData = (api: api, state: state) => {
    return {
        [getName()]: {
            description: api.getLanguageDataByData(state, getTextData(), languageKey.BlessGirlDescription),
            imageSrc: _getPath("bless", "png")
        },
    }
}
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { api } from "type-api/src/Type"
import { careerData, needGem } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { missionFinishStatus } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { visibleData } from "frontend/src/scene3d_layer/script/scene/scene_city/behaviour_tree/action_node/utils/GiantessSelectTargetUtils"
import { coin, experienceValue, gem } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { careerFeatureName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/CareerFeatureData"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Career_WeaponWorkMan"

export enum languageKey {
    Title,
    PositiveDescription1,
    // PositiveDescription2,
    // NegativeDescription1,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "武器工匠",
            // [languageKey.PositiveDescription1]: "武器的子弹速度最快",
            // // [languageKey.PositiveDescription2]: "武器的射速升两级",
            // // [languageKey.NegativeDescription1]: "最多携带3把武器",
        },
        [language.English]: {
            [languageKey.Title]: "Weapon WorkMan",
            // [languageKey.PositiveDescription1]: "Bullet speed max",
            // // [languageKey.PositiveDescription2]: "EmitSpeed max",
            // // [languageKey.NegativeDescription1]: "At most can have three weapons",
        },
    }
}

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.VeryHigh,

        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.BulletSpeedMax]: api.getNullableCareerFeautreDataValue(),
            // [careerFeatureName.DecreaseLuck]: 0.2,
            [careerFeatureName.DecreaseLuck]: 0.5,
            [careerFeatureName.IncreaseUpgradeWeaponCost]: 2,
        })
    }
}

export let getCharacterType = () => characterType.LittleMan

let _getImageSrc = () => getImagePath("icon")

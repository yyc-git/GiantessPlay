import { api } from "type-api/src/Type"
import { forceSize, stressingRateFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"
import { propData, propType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Prop_Other_Capture"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "捕获器",
            [languageKey.Description]: "可捕获巨大娘为可使用的巨大娘角色。目标生命值越低，捕获几率越高",
        },
        [language.English]: {
            [languageKey.Title]: "Capture",
            [languageKey.Description]: "Capture giantess to be giantess character. The lower the target's hp, the higher the chance of capture",
        },
    }
}

export let getPropData = (api: api, state: state): propData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, getTextData(), languageKey.Title),

        description: api.getLanguageDataByData(state, getTextData(), languageKey.Description),

        imageSrc: getPropImageResourcePath(),
        count: 0,
        type: propType.Assistant,
        characterType: characterType.LittleMan,
        isOutLevelBuild: true,
    }
}

export let getPropImageResourcePath = () => getImagePath("prop")

export let getPropImageResourceId = getPropImageResourcePath


export let getSoundResourcePath = () => getSoundPath("sound")

export let getSoundResourceId = getSoundResourcePath


let _isCaptured = (api: api, state: state) => {
    let usedGirl = api.getNearestUsedGirl(state, api.getPlayerPosition(state))

    let mmdCharacter = api.getCurrentMMDCharacterName(state, usedGirl)

    return !api.NullableUtils.isNullable(api.getGiantessCharacters(state).find(c => {
        return c.mmdCharacter == mmdCharacter
    }))
}

export let isDisable = (api: api, state: state, name) => {
    switch (name) {
        case getName():
            return api.isBossLevel(state)
                || !(
                    // api.isLevelGiantessExceptPlayer(state, usedGirl)
                    api.hasLevelGiantessExceptPlayer(state)
                    // && api.isVeryNearGirl(
                    && api.isNearGirl(
                        state,
                        api.getPlayerPosition(state)
                    )
                )
                || _isCaptured(api, state)
        default:
            return false
    }
}
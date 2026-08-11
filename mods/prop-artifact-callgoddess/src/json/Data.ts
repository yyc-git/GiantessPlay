import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { getBlockName, getBuffProtocolName, getBuffCallGoddessBlockName } from "../script/Utils"
import { service as buffService } from "buff-protocol/src/service/ServiceType";
import { propData, propType, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { scene } from "frontend/src/ui_layer/global/store/GlobalStoreType"
import { data } from "frontend/src/scene3d_layer/internation/Data"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Prop_Artifact_CallGoddess"

export enum languageKey {
    Title,
    Description,
}

export let getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "召唤女神",
            [languageKey.Description]: "召唤女神为玩家作战，持续4分钟（重复使用可增加时间）",
        },
        [language.English]: {
            [languageKey.Title]: "Call Goddess",
            [languageKey.Description]: "Call goddess for player, last 4 min(Duplicate use can add time)",
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
        type: propType.Artifact,
        characterType: characterType.LittleMan,
        isOutLevelBuild: true,
    }
}

export let getPropImageResourcePath = () => getImagePath("prop")

export let getPropImageResourceId = getPropImageResourcePath

export let getSoundResourcePath = () => getSoundPath("use")

export let getSoundResourceId = getSoundResourcePath

export let hasPlayerGoddess = (api: api, state) => {
    let { getName, getTargetName } = api.blockAPI.getBlockService<buffService>(state, getBuffProtocolName(), getBuffCallGoddessBlockName())

    return api.hasBuff(state, getName(), getTargetName(api, usedGirlEnum.PlayerGoddess), usedGirlEnum.PlayerGoddess)
}

// let _notHasPlayerGoddessLevelGiantess = (api: api, state) => {
//     if (!api.isLevelGiantess(state, usedGirl)) {
//         return false
//     }

//     return !isPlayerGoddess(api, state, usedGirl)
// }

export let isDisable = (api: api, state: state, name) => {
    switch (name) {
        case getName():
            // return api.getSceneChapter(state) != scene.Play
            return api.isBossLevel(state)
                // ||
                // (
                //     api.isGiantessCharacterType(state)
                //     ||
                //     _notHasPlayerGoddessLevelGiantess(api, state)
                // )

                || (!api.isPlayerGoddess(state, usedGirlEnum.PlayerGoddess) && api.isMMDCharacterExist(state, api.getCurrentMMDCharacterNameByUsedGirl(state, usedGirlEnum.PlayerGoddess)))
                || api.isExceedMaxMMDGiantessCountAfterAdd(state)

        default:
            return false
    }
}
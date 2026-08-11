import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { api } from "type-api/src/Type"
import { careerData, needGem, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { missionFinishStatus } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { visibleData } from "frontend/src/scene3d_layer/script/scene/scene_city/behaviour_tree/action_node/utils/GiantessSelectTargetUtils"
import { coin, experienceValue, gem } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { careerFeatureName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/CareerFeatureData"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Career_Demon"

export enum languageKey {
    Title,
    PositiveDescription1,
    PositiveDescription2,
    NegativeDescription1,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "恶魔",
            // [languageKey.PositiveDescription1]: "使用最大生命值代替金币来交易（1生命值=10金币）",
            // [languageKey.PositiveDescription2]: "通关后，获得的金币的50%转换为最大生命值（1生命值=10金币）",
            // [languageKey.NegativeDescription1]: "减少0.5运气",
        },
        [language.English]: {
            [languageKey.Title]: "Demon",
            // [languageKey.PositiveDescription1]: "Use maximum health instead of coins to trade (1 hp=10 coins)",
            // [languageKey.PositiveDescription2]: "After completing the level, 50% of the obtained coins will be converted to the maximum health value (1 hp=10 coins)",
            // [languageKey.NegativeDescription1]: "Decrease 0.5 luck",
        },
    }
}

// let _handleMissionFinishHandler = (characterType_) => (api: api, state: state, data) => {
//     let userData = api.NullableUtils.getExn(data.userData)

//     if (
//         userData.missionFinishStatus == missionFinishStatus.Complete
//     ) {
//         let levelCoin = api.getLevelCoin(state)
//         let addedHp = Math.round(levelCoin * 0.5 / 10)

//         state = api.addCoinInLevel(state, -Math.round(levelCoin * 0.5))

//         if (characterType_ == characterType.LittleMan) {
//             state = api.littleMan.setHpIncrease(state,
//                 api.littleMan.getHpIncrease(state) + addedHp
//             )
//         }
//         else if (characterType_ == characterType.Giantess) {
//             state = api.girl.setHpIncrease(state,
//                 api.girl.getHpIncrease(state) + addedHp
//             )
//         }

//         return api.updateUIAndSound(state)
//     }

//     return Promise.resolve(state)
// }

export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.VeryHigh,

        // characterType: getCharacterType(),

        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.UseFullHpReplaceCoin]: api.getNullableCareerFeautreDataValue(),
            [careerFeatureName.AfterMissionComplete_ConvertCoinToFullHp]: 0.5,
            [careerFeatureName.DecreaseLuck]: 0.5
        })
        // getPositiveDescriptionFunc: (state) => {
        //     return [
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription1),
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription2)
        //     ]
        // },
        // getNegativeDescriptionFunc: (state) => {
        //     return [
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.NegativeDescription1)
        //     ]
        // },
        // applyFunc: (state, characterType_) => {
        //     state = api.event.on(state, api.event.getMissionFinishEventName(), _handleMissionFinishHandler(characterType_))

        //     switch (characterType_) {
        //         case characterType.LittleMan:
        //             state = api.LittleManBuildUtils.setLuck(state, api.buildFuncData(state), (state, luck) => luck - 0.5)
        //             break
        //         case characterType.Giantess:
        //             state = api.GiantessBuildUtils.setLuck(state, api.buildFuncData(state), (state, luck) => luck - 0.5, usedGirlEnum.PlayerGirl)
        //             break
        //     }

        //     return Promise.resolve(state)
        // },
    }
}

export let getCharacterType = () => characterType.Both

let _getImageSrc = () => getImagePath("icon")

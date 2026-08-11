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

export let getName = () => "Career_Peace"

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
            [languageKey.Title]: "和平主义者",
            // [languageKey.PositiveDescription1]: "通关后，每存活1个敌人，获得对应的宝石、金币、经验值的50%",
            // [languageKey.PositiveDescription2]: "增加0.5运气",
            // [languageKey.NegativeDescription1]: "减少100%伤害",
        },
        [language.English]: {
            [languageKey.Title]: "Pacifist",
            // [languageKey.PositiveDescription1]: "After completing the level, for every surviving enemy, receive 50% of the corresponding gems, coins, and experience points",
            // [languageKey.PositiveDescription2]: "Increase 0.5 luck",
            // [languageKey.NegativeDescription1]: "Decrease 100% damage",
        },
    }
}

// let _handleMissionFinishHandler = (characterType_) => (api: api, state: state, data) => {
//     let userData = api.NullableUtils.getExn(data.userData)

//     const rate = 0.5

//     if (
//         // api.isUseCareer(state, getName())
//         userData.missionFinishStatus == missionFinishStatus.Complete
//     ) {
//         //army
//         let [gems, coins, experiences] = api.getAllAliveArmyData(state).reduce(([gems, coins, experiences], armyData) => {
//             return armyData.filter(data => {
//                 return api.getCampExn(state, data.name) != api.getPlayerCamp()
//             }).reduce(([gems, coins, experiences], data: visibleData) => {
//                 let rewardData = api.findRewardData(state, api.buildArmyRewardKey(state, data.name))

//                 return [
//                     gems + rewardData.gem(state),
//                     coins + rewardData.coin(state),
//                     experiences + rewardData.experienceValue
//                 ]
//             }, [gems, coins, experiences])
//         }, [0, 0, 0])

//         //level giantess
//         if (api.isLevelGiantessExceptPlayer(state, usedGirl)) {
//             gems += gem.MostHigh
//             coins += coin.MostHigh
//             experiences += experienceValue.VeryHigh
//         }

//         gems = Math.round(gems * rate)
//         coins = Math.round(coins * rate)
//         experiences = Math.round(experiences * rate)


//         state = api.addGemInLevel(state, gems)
//         state = api.addCoinInLevel(state, coins)
//         state = api.getPlayerNamesByIsUseCareerFeature(state, characterType_).reduce((state, name) => {
//             return api.setExperienceValue(state, name, experiences)
//         }, state)

//         return api.updateUIAndSound(state)
//     }

//     return Promise.resolve(state)
// }


export let getCareerData = (api: api, state: state): careerData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        imageSrc: _getImageSrc(),

        needGem: needGem.VeryLow,

        // characterType: getCharacterType(),

        // getPositiveDescriptionFunc: (state) => {
        //     return [
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription1),
        //         api.getLanguageDataByData(state, _getTextData(), languageKey.PositiveDescription2)
        //     ]
        // },
        // getNegativeDescriptionFunc: (state) => {
        //     return [api.getLanguageDataByData(state, _getTextData(), languageKey.NegativeDescription1)]
        // },
        // applyFunc: (state, characterType_) => {
        //     state = api.event.on(state, api.event.getMissionFinishEventName(), _handleMissionFinishHandler(characterType_))

        //     switch (characterType_) {
        //         case characterType.LittleMan:
        //             state = api.LittleManBuildUtils.setLuck(state, api.buildFuncData(state), (state, luck) => luck + 0.5)
        //             break
        //         case characterType.Giantess:
        //             state = api.GiantessBuildUtils.setLuck(state, api.buildFuncData(state), (state, luck) => luck + 0.5, usedGirlEnum.PlayerGirl)
        //             break
        //     }


        //     return Promise.resolve(state)
        // },
        getCareerFeatureData: (state) => api.MutableRecordUtils.createFromObject({
            [careerFeatureName.IncreaseLuck]: 0.5,
            // [careerFeatureName.IncreaseLuck]: 0.3,
            // [careerFeatureName.AfterMissionComplete_AliveOneEnemy_GetReward]: 1,
            [careerFeatureName.AfterMissionComplete_AliveOneEnemy_GetReward]: 1.5,
            [careerFeatureName.ReduceDamage]: 1,
        })
    }
}

export let getCharacterType = () => characterType.Both

let _getImageSrc = () => getImagePath("icon")

import { List } from "immutable"
import { state } from "../../../../type/StateType"
import { propData, propName, propType, waterPropName } from "../type/StateType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getIsDebug, getIsProduction } from "../../Scene";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getRewardState, setRewardState } from "../reward/RewardGenerator";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getSceneChapter, isBossLevel, isEnterScene, isGiantessCharacterType } from "../CityScene";
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType";
import { isCanTrigger } from "../director/GameEventDirector";
import { eventName } from "../data/director/GameEventDirectorData";
import { readState } from "../../../../state/State";
import { getLanguageTextData, languageKey } from "../../../../internation/Data";
import { getAllPropData, isDisable as isDisablePropBulletMod } from "../../../../mod/PropBulletMod";
import { getValue } from "../little_man/LittleMan";
import { stressingRateFactor } from "../data/DataType";
import { isDisable as isDisablePropOtherMod, getAllPropData as getAllPropDataPropOtherMod } from "../../../../mod/PropOtherMod";
import { getCurrentMMDCharacterNameByUsedGirl, isEnemyGiantess, isLevelGiantess, isMMDCharacterExist, isPlayerGoddess, isUseGirl } from "../girl/Girl";
import { nullable } from "block/src/Type";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getPlayerGiantessBlockService } from "../../../../mod/LevelGiantessMod";
import { isExceedMaxMMDGiantessCountAfterAdd } from "../difficulty/HeatImplementer";

// export let createState = (): prop => {
//     return {
//         props: List(),
//     }
// }

// let getRewardState = (state): prop => {
//     return getState(state).prop
// }

// let setRewardState = (state, buildState: prop) => {
//     return setState(state, {
//         ...getState(state),
//         prop: buildState
//     })
// }

export let getPropValue = () => {
    return {
        // [waterPropName.AddHp1]: 100,
        // [waterPropName.AddHp2]: 300,
        // [waterPropName.AddHp3]: 600,
        // [waterPropName.AddHp4]: 1000,
        [waterPropName.AddHp1]: 0.1,
        [waterPropName.AddHp2]: 0.3,
        [waterPropName.AddHp3]: 0.5,
        [waterPropName.AddHp4]: 1,

        [waterPropName.AddExcitement1]: 10,
        [waterPropName.AddExcitement2]: 20,
        [waterPropName.AddExcitement3]: 30,
        [waterPropName.AddExcitement4]: 50,
    }
}

let _buildAllBulletProps = (bulletCount): List<propData> => {
    return List([
        // {
        //     name: propName.BasicBullet,
        //     title: getLanguageTextData(readState(), languageKey.BasicBulletTitle),

        //     description: getLanguageTextData(readState(), languageKey.BasicBulletDescription),

        //     imageSrc: "./resource/ui/in_game/little_man/package/bullet/BasicBullet.png",
        //     count: Infinity,
        //     type: propType.Bullet,
        //     typeTitle: getLanguageTextData(readState(), languageKey.BulletPropTypeTitle),
        //     characterType: characterType.LittleMan,
        //     isOutLevelBuild: false,
        // },
        {
            name: propName.LaserBullet,
            title: getLanguageTextData(readState(), languageKey.LaserBulletTitle),
            description: getLanguageTextData(readState(), languageKey.LaserBulletDescription),
            imageSrc: "./resource/ui/in_game/little_man/package/gun/LaserGun.png",
            count: bulletCount,
            type: propType.Bullet,
            // typeTitle: getLanguageTextData(readState(), languageKey.BulletPropTypeTitle),
            characterType: characterType.LittleMan,
            isOutLevelBuild: false,
        },
        {
            name: propName.RocketBullet,
            title: getLanguageTextData(readState(), languageKey.RocketBulletTitle),
            description: getLanguageTextData(readState(), languageKey.RocketBulletDescription),
            imageSrc: "./resource/ui/in_game/little_man/package/gun/RocketGun.png",
            count: bulletCount,
            type: propType.Bullet,
            // typeTitle: getLanguageTextData(readState(), languageKey.BulletPropTypeTitle),
            characterType: characterType.LittleMan,
            isOutLevelBuild: false,
        },
        // {
        //     name: propName.SubMachineBullet,
        //     title: getLanguageTextData(readState(), languageKey.RocketBulletTitle),
        //     description: getLanguageTextData(readState(), languageKey.RocketBulletDescription),
        //     imageSrc: "./resource/ui/in_game/little_man/package/bullet/RocketBullet.png",
        //     count: bulletCount,
        //     type: propType.Bullet,
        //     // typeTitle: getLanguageTextData(readState(), languageKey.BulletPropTypeTitle),
        //     characterType: characterType.LittleMan,
        //     isOutLevelBuild: false,
        // },


        // {
        //     name: propName.BiggerBullet,
        //     title: getLanguageTextData(readState(), languageKey.BiggerBulletTitle),
        //     description: getLanguageTextData(readState(), languageKey.BiggerBulletDescription),
        //     imageSrc: "./resource/ui/in_game/little_man/package/bullet/BiggerBullet.png",
        //     count: bulletCount,
        //     type: propType.Bullet,
        //     // typeTitle: getLanguageTextData(readState(), languageKey.BulletPropTypeTitle),
        //     characterType: characterType.LittleMan,
        //     isOutLevelBuild: true,
        //     // isDisable: (state: state, name: propName) => getSceneChapter(state) != scene.Play,
        // },
        // {
        //     name: propName.SmallerToLastBiggerCount,
        //     title: getLanguageTextData(readState(), languageKey.SmallerToLastBiggerCountBulletTitle),
        //     description: getLanguageTextData(readState(), languageKey.SmallerToLastBiggerCountBulletDescription),
        //     imageSrc: "./resource/ui/in_game/little_man/package/bullet/SmallerToLastBiggerCount.png",
        //     count: bulletCount,
        //     type: propType.Bullet,
        //     // typeTitle: getLanguageTextData(readState(), languageKey.BulletPropTypeTitle),
        //     characterType: characterType.LittleMan,
        //     isOutLevelBuild: true,
        //     // isDisable: (state: state, name: propName) => getSceneChapter(state) != scene.Play,
        // },
    ])
}

let _buildAllWaterProps = (): List<propData> => {
    return List([
        {
            name: propName.AddHp1,
            title: getLanguageTextData(readState(), languageKey.AddHp1Title),
            description: getLanguageTextData(readState(), languageKey.AddHp1Description),
            imageSrc: "./resource/ui/in_game/little_man/package/water/hp1.png",
            count: 0,
            type: propType.Water,
            // typeTitle: getLanguageTextData(readState(), languageKey.WaterPropTypeTitle),
            characterType: characterType.Both,
            isOutLevelBuild: false,
        },
        {
            name: propName.AddHp2,
            title: getLanguageTextData(readState(), languageKey.AddHp2Title),
            description: getLanguageTextData(readState(), languageKey.AddHp2Description),
            imageSrc: "./resource/ui/in_game/little_man/package/water/hp2.png",
            count: 0,
            type: propType.Water,
            // typeTitle: getLanguageTextData(readState(), languageKey.WaterPropTypeTitle),
            characterType: characterType.Both,
            isOutLevelBuild: false,
        },
        {
            name: propName.AddHp3,
            title: getLanguageTextData(readState(), languageKey.AddHp3Title),
            description: getLanguageTextData(readState(), languageKey.AddHp3Description),
            imageSrc: "./resource/ui/in_game/little_man/package/water/hp3.png",
            count: 0,
            type: propType.Water,
            // typeTitle: getLanguageTextData(readState(), languageKey.WaterPropTypeTitle),
            characterType: characterType.Both,
            isOutLevelBuild: false,
        },
        {
            name: propName.AddHp4,
            title: getLanguageTextData(readState(), languageKey.AddHp4Title),
            description: getLanguageTextData(readState(), languageKey.AddHp4Description),
            imageSrc: "./resource/ui/in_game/little_man/package/water/hp4.png",
            count: 0,
            type: propType.Water,
            // typeTitle: getLanguageTextData(readState(), languageKey.WaterPropTypeTitle),
            characterType: characterType.Both,
            isOutLevelBuild: false,
        },

        {
            name: propName.AddExcitement1,
            title: getLanguageTextData(readState(), languageKey.AddExcitement1Title),
            description: getLanguageTextData(readState(), languageKey.AddExcitement1Description),
            imageSrc: "./resource/ui/in_game/little_man/package/water/ex1.png",
            count: 0,
            type: propType.Water,
            // typeTitle: getLanguageTextData(readState(), languageKey.WaterPropTypeTitle),
            characterType: characterType.Giantess,
            isOutLevelBuild: false,
        },
        {
            name: propName.AddExcitement2,
            title: getLanguageTextData(readState(), languageKey.AddExcitement2Title),
            description: getLanguageTextData(readState(), languageKey.AddExcitement2Description),
            imageSrc: "./resource/ui/in_game/little_man/package/water/ex2.png",
            count: 0,
            type: propType.Water,
            // typeTitle: getLanguageTextData(readState(), languageKey.WaterPropTypeTitle),
            characterType: characterType.Giantess,
            isOutLevelBuild: false,
        },
        {
            name: propName.AddExcitement3,
            title: getLanguageTextData(readState(), languageKey.AddExcitement3Title),
            description: getLanguageTextData(readState(), languageKey.AddExcitement3Description),
            imageSrc: "./resource/ui/in_game/little_man/package/water/ex3.png",
            count: 0,
            type: propType.Water,
            // typeTitle: getLanguageTextData(readState(), languageKey.WaterPropTypeTitle),
            characterType: characterType.Giantess,
            isOutLevelBuild: false,
        },
        {
            name: propName.AddExcitement4,
            title: getLanguageTextData(readState(), languageKey.AddExcitement4Title),
            description: getLanguageTextData(readState(), languageKey.AddExcitement4Description),
            imageSrc: "./resource/ui/in_game/little_man/package/water/ex4.png",
            count: 0,
            type: propType.Water,
            // typeTitle: getLanguageTextData(readState(), languageKey.WaterPropTypeTitle),
            characterType: characterType.Giantess,
            isOutLevelBuild: false,
        },
    ])
}

let _buildAllAssistantProps = (): List<propData> => {
    return List([
        {
            name: propName.CallGiantess,
            title: getLanguageTextData(readState(), languageKey.CallGiantessTitle),
            description: getLanguageTextData(readState(), languageKey.CallGiantessDescription),
            imageSrc: "./resource/ui/in_game/little_man/package/assistant/call_giantess.png",
            count: 0,
            // count: 2,
            type: propType.Assistant,
            // typeTitle: getLanguageTextData(readState(), languageKey.AssistantPropTypeTitle),
            characterType: characterType.LittleMan,
            isOutLevelBuild: true,
            // isDisable: (state: state, name: propName) => !isCanTrigger(state, eventName.CallGiantess),
        },

        {
            name: propName.ClearHatred,
            title: getLanguageTextData(readState(), languageKey.ClearHatredTitle),
            description: getLanguageTextData(readState(), languageKey.ClearHatredDescription),
            imageSrc: "./resource/ui/in_game/buff/clear_hatred.png",
            count: 0,
            // count: 2,
            type: propType.Assistant,
            // typeTitle: getLanguageTextData(readState(), languageKey.AssistantPropTypeTitle),
            characterType: characterType.LittleMan,
            isOutLevelBuild: true,
        },
    ])
}

let _buildAllOtherProps = (): List<propData> => {
    return List([
        {
            name: propName.Revive,
            title: getLanguageTextData(readState(), languageKey.ReviveTitle),
            description: getLanguageTextData(readState(), languageKey.ReviveDescription),
            imageSrc: "./resource/ui/in_game/little_man/package/other/revive.png",
            count: 0,
            type: propType.Other,
            // typeTitle: getLanguageTextData(readState(), languageKey.OtherPropTypeTitle),
            characterType: characterType.Both,
            isOutLevelBuild: true,
            // isDisable: (state: state, name: propName) => isEnterScene(state)
        },
    ])
}

export let buildAllLocalAndBulletProps = (state, bulletCount): List<propData> => {
    return _buildAllWaterProps()
        .concat(_buildAllBulletProps(bulletCount))
        .concat(_buildAllAssistantProps())
        .concat(_buildAllOtherProps())
        .concat(
            List(
                getAllPropData(state)
            )
        )
}

export let buildAllProps = (state, bulletCount): List<propData> => {
    return buildAllLocalAndBulletProps(state, bulletCount)
        .concat(
            List(
                getAllPropDataPropOtherMod(state)
            )
        )
        .map(data => {
            if (
                // !getIsProduction(readState())
                getIsDebug(state)
                // true
                && data.count < 10
            ) {
                return {
                    ...data,
                    count: 666
                    // count: 1
                }
            }

            return data
        })
}

export let isPropExist = (state, propName) => {
    return !NullableUtils.isNullable(buildAllProps(state, 0).find(p => p.name == propName))
}

export let findOriginPropData = (state, propName) => {
    return NullableUtils.getExn(buildAllProps(state, 0).find(p => p.name == propName))
}

export let getImageSrc = (allProps, propName) => {
    return NullableUtils.getExn(allProps.find(p => p.name == propName)).imageSrc
}

export let getTitle = (allProps, propName) => {
    return NullableUtils.getExn(allProps.find(p => p.name == propName)).title
}

export let getDescription = (allProps, propName) => {
    return NullableUtils.getExn(allProps.find(p => p.name == propName)).description
}

export let getIsOutLevelBuild = (allProps, propName) => {
    return NullableUtils.getExn(allProps.find(p => p.name == propName)).isOutLevelBuild
}


export let initProps = (state: state, outLevelBuildProps) => {
    let bulletCount = 0
    if (getIsDebug(state)) {
        bulletCount = 999
    }

    return buildAllProps(state, bulletCount).map(p => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(outLevelBuildProp => {
                // return outLevelBuildProp
                return {
                    ...p,
                    count: outLevelBuildProp.count,
                }
            }, outLevelBuildProps.find(outLevelBuildProp => outLevelBuildProp.name == p.name)),
            p
        )
    })
        .map(data => {
            if (
                // !getIsProduction(readState())
                getIsDebug(state)
                // true
                && data.count < 10
            ) {
                return {
                    ...data,
                    count: 666
                    // count: 1
                }
            }

            return data
        })
}

export let subPropCount = (state: state, name: propName, count: number) => {
    return setRewardState(state, {
        ...getRewardState(state),
        propsNotOutLevelBuild: getRewardState(state).propsNotOutLevelBuild.map(p => {
            if (p.name == name) {
                return {
                    ...p,
                    count: NumberUtils.greaterThan(p.count - count, 0)
                }
            }

            return p
        }),
        props: getRewardState(state).props.map(p => {
            if (p.name == name) {
                return {
                    ...p,
                    count: NumberUtils.greaterThan(p.count - count, 0)
                }
            }

            return p
        })
    })
}

// export let addPropCount = (state: state, name: propName, [count, isOutLevelBuild]: [number, nullable<boolean>]) => {
export let addPropCount = (state: state, name: propName, count, isMarkNotOutLevelBuild = false) => {
    requireCheck(() => {
        test(`should has name:${name}`, () => {
            return !NullableUtils.isNullable(getRewardState(state).props.find(p => p.name == name))
        })
    }, getIsDebug(state))

    // let isMarkNotOutLevelBuild = !NullableUtils.getWithDefault(
    //     isMarkNotOutLevelBuild,
    //     false
    // )
    if (isMarkNotOutLevelBuild) {
        state = setRewardState(state, {
            ...getRewardState(state),
            propsNotOutLevelBuild:
                NullableUtils.isNullable(getRewardState(state).propsNotOutLevelBuild.find(p => p.name == name)) ?
                    getRewardState(state).propsNotOutLevelBuild.push({
                        name: name,
                        count: count
                    }) : getRewardState(state).propsNotOutLevelBuild.map(p => {
                        if (p.name == name) {
                            return {
                                ...p,
                                count: p.count + count,
                            }
                        }

                        return p
                    }),
        })
    }

    return setRewardState(state, {
        ...getRewardState(state),
        props: getRewardState(state).props.map(p => {
            if (p.name == name) {
                return {
                    ...p,
                    count: p.count + count,
                    // isOutLevelBuild: NullableUtils.getWithDefault(
                    //     isOutLevelBuild,
                    //     p.isOutLevelBuild
                    // )
                }
            }

            return p
        })
    })
}

export let getPropCountNullable = (state: state, name: propName) => {
    return NullableUtils.map(
        p => p.count,
        getRewardState(state).props.find(p => {
            return p.name == name
        }))
}

export let getPropCount = (state: state, name: propName) => {
    // return NullableUtils.getExn(getPropCountNullable(state, name))
    return NullableUtils.getWithDefault(getPropCountNullable(state, name), 0)
}

export let getAllProps = (state: state) => {
    return getRewardState(state).props
}

export let getAllPropsByType = (state: state, type: propType) => {
    return getRewardState(state).props.filter(p => p.type == type)
}

export let getPropByName = (state: state, name) => {
    return NullableUtils.getExn(getRewardState(state).props.find(p => p.name == name))
}

export let hasPropsByType = (state: state, type: propType) => {
    return getAllPropsByType(state, type).filter(p => p.count > 0).count() > 0
}

// export let isDisable = (state, data: propData) => {
export let isDisable = (state, name) => {
    // return NullableUtils.getWithDefault(
    //     NullableUtils.map(isDisable => {
    //         return isDisable(state, data.name)
    //     }, data.isDisable),
    //     false
    // )

    if (getPropCount(state, name) == 0) {
        return true
    }

    switch (name) {
        // case propName.BiggerBullet:
        // case propName.SmallerToLastBiggerCount:
        case propName.ClearHatred:
            return isBossLevel(state)
        // || (
        //     getSceneChapter(state) == scene.Play
        //     &&
        //     (
        //         !isLevelGiantess(state, usedGirl)
        //         ||
        //         isEnemyGiantess(state, usedGirl)
        //     )
        // )
        case propName.CallGiantess:
            // return !isCanTrigger(state, eventName.CallGiantess)
            return isBossLevel(state)
                // ||
                // isUseGirl(state, usedGirl)
                // (
                //     isGiantessCharacterType(state)
                //     ||
                //     _isNotPlayerGoddessLevelGiantess(api, state)
                // )
                || isMMDCharacterExist(state, getCurrentMMDCharacterNameByUsedGirl(state, getPlayerGiantessBlockService(state).getUsedGirl()))
                || isExceedMaxMMDGiantessCountAfterAdd(state)
        case propName.Revive:
            return isEnterScene(state)
        default:
            return isDisablePropBulletMod(state, name) || isDisablePropOtherMod(state, name)
    }
}

export let getPropTypeTitle = (type: propType) => {
    switch (type) {
        case propType.Artifact:
            return getLanguageTextData(readState(), languageKey.ArtifactPropTypeTitle)
        case propType.Bullet:
            return getLanguageTextData(readState(), languageKey.BulletPropTypeTitle)
        case propType.Assistant:
            return getLanguageTextData(readState(), languageKey.AssistantPropTypeTitle)
        case propType.Water:
            return getLanguageTextData(readState(), languageKey.WaterPropTypeTitle)
        case propType.Other:
            return getLanguageTextData(readState(), languageKey.OtherPropTypeTitle)
        case propType.None:
            return getLanguageTextData(readState(), languageKey.None)
        default:
            throw new Error("err")
    }
}
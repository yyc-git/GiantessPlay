import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { state } from "../type/StateType"
import { getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod"
import { service } from "career-protocol/src/service/ServiceType"
import { state as blockState } from "career-protocol/src/state/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { api } from "type-api/src/Type"
import { modProtocolName } from "./data/ModData"
import { getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod"
import { characterType, girlType, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getAllCareerFeatureData, getCareerData, getIsUseFullHpReplaceCoinCharacterTypes, isUseCareer } from "../script/scene/scene_city/build/Career"
import { careerData, usedGirlEnum } from "../script/scene/scene_city/type/StateType"
import { Scene } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../business_layer/State"
import { isCharacterType, isLittleCharacterType } from "../script/scene/scene_city/CityScene"
import { getFullHp, getHpIncrease, setHpIncrease } from "../script/scene/scene_city/little_man/LittleMan"
import { getFullHp as getFullHpGirl } from "../script/scene/scene_city/girl/Girl"
import { setHp as setHpLittleManBuildUtils } from "../script/scene/scene_city/utils/build/LittleManBuildUtils"
import { setFullHp as setHpGiantessBuildUtils } from "../script/scene/scene_city/utils/build/GiantessBuildUtils"
import { buildFuncData } from "../script/scene/scene_city/data/FuncData"
import { getHpIncrease as getHpIncreaseGirl, setHpIncrease as setHpIncreaseGirl } from "../script/scene/scene_city/girl/player/Girl"
import { careerFeatureName, findCareerFeatureDataByName, getCareerFeatureData } from "../script/scene/scene_city/data/build/CareerFeatureData"
import { getCharacterTypeByName, isPlayerByCharacterType } from "../script/scene/scene_city/utils/PlayerUtils"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"

export let getFoodieBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.CareerProtocol, "career-foodie")
}

export let getDefaultBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.CareerProtocol, "career-default")
}


export let isUseFullHpReplaceCoinCharacterTypes = (state: state) => {
    // return isUseCareer(state, Scene.getCharacterType(getAbstractState(state)), getBlockServiceExn<service>(state, modProtocolName.CareerProtocol, "career-demon").getName())
    return getIsUseFullHpReplaceCoinCharacterTypes(state).includes(
        Scene.getCharacterType(getAbstractState(state))
    )
}

let _getDemoRatio = () => 10

export let getTotalCoinConvertFromHp = (state: state) => {
    if (isLittleCharacterType(state)) {
        return getFullHp(state) * _getDemoRatio()
    }

    return getFullHpGirl(state, usedGirlEnum.PlayerGirl) * _getDemoRatio()
}

export let setHpConvertFromTotalCoin = (state: state, totalCoin) => {
    let funcData = buildFuncData(state)
    let hp = Math.round(totalCoin / _getDemoRatio())

    if (isLittleCharacterType(state)) {
        state = setHpIncrease(state,
            getHpIncrease(state) + (hp - getFullHp(state))
        )

        return setHpLittleManBuildUtils(state, funcData, (_, factor) => hp, false)
    }

    state = setHpIncreaseGirl(state,
        getHpIncreaseGirl(state) + (hp - getFullHpGirl(state, usedGirlEnum.PlayerGirl))
    )

    return setHpGiantessBuildUtils(state, funcData, (_, factor) => hp, false, usedGirlEnum.PlayerGirl)
}

// let _getCareerRandomBlockName = () => "career-random"

let _getAllBlockNames = (state: state) => {
    return getSceneAllBlockNames(state, [
        "career-littleman-random",
        "career-giantess-random",
        "career-default",
        "career-footfetish",
        "career-wetnurse",
        "career-carry",
        "career-absorber",
        "career-vaginalcapturer",
        "career-duelist",
        "career-weaponworkman",
        "career-farmer",
        "career-enterpriser",
        "career-saver",
        "career-littleman-bandit",
        "career-giantess-bandit",
        "career-peace",
        "career-runner",
        "career-giantess-pleaser",
        "career-masochism",
        "career-sadism",
        "career-foodie",
        "career-demon",
    ])
}


let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.CareerProtocol, blockName)
    })
}

let _getAllServices = (state):Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "career")
}


// export let isUseCareer = (state, name) => {
//     let characterType_ = Scene.getCharacterType(getAbstractState(state))

//     // let characterType_ = _getAllServices(state).reduce((result, service) => {
//     //     if (service.getName() == name) {
//     //         return NullableUtils.return_(service.getCharacterType())
//     //     }

//     //     return result
//     // }, NullableUtils.getEmpty())

//     return NullableUtils.getWithDefault(
//         NullableUtils.map(data => data.name == name,
//             getCareerData(state, characterType_)
//         ),
//         false
//     )
// }

export let getUseCareerCharacterType = (state: state, name) => {
    let isUseCareerForLittleMan = isUseCareer(state, characterType.LittleMan, name)
    let isUseCareerForGiantess = isUseCareer(state, characterType.Giantess, name)

    if (isUseCareerForLittleMan && isUseCareerForGiantess) {
        return characterType.Both
    }

    if (isUseCareerForLittleMan) {
        return characterType.LittleMan
    }

    if (isUseCareerForGiantess) {
        return characterType.Giantess
    }

    return characterType.None
}

// let getCareerFeatureData = (state, blockName) => {
//     return NullableUtils.getWithDefault(
//         getBlockStateExn<blockState>(state, modProtocolName.CareerProtocol, blockName).careerFeatureData,
//         []
//     )
// }

export let getAllCareerData = (state: state, characterType_): Array<careerData> => {
    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        let data = service.getCareerData(api, state)

        if (
            // service.getCareerFeatureData(api, state).length > 0
            MutableRecordUtils.getCount(data.getCareerFeatureData(state)) > 0
            && isCharacterType(service.getCharacterType(), characterType_)) {
            return ArrayUtils.push(
                result, data
            )
        }

        return result
    }, [])

}

export let convertToCareerFeatureData = (state, data) => {
    let data2 = getCareerFeatureData(getModAPI(state), state)

    // return data.getCareerFeatureData(state).map(([name, value]) => {
    //     return [findCareerFeatureDataByName(data2, name), value]
    // })

    return MutableRecordUtils.map(data.getCareerFeatureData(state), (value, name) => {
        return [findCareerFeatureDataByName(data2, name), value]
    })
}

let _apply = (state, characterType_, data) => {
    return MutableRecordUtils.reducePromise(
        convertToCareerFeatureData(state, data),
        (state, [data, value]: any) => {
            return data.applyFunc(state, characterType_, value, data.name)
        },
        state
    )
}

let _deapply = (state, characterType_, data) => {
    return MutableRecordUtils.reducePromise(
        convertToCareerFeatureData(state, data),
        (state, [data, value]: any) => {
            return NullableUtils.getWithDefault(
                NullableUtils.map(deapplyFunc => {
                    return deapplyFunc(state, characterType_, data.name)
                }, data.deapplyFunc),
                Promise.resolve(state)
            )
        },
        state
    )
}

let _executeAll = (state: state, executeFunc) => {
    // return NullableUtils.getWithDefault(
    //     NullableUtils.map(data => executeFunc(state, characterType.LittleMan, data),
    //         getCareerData(state, characterType.LittleMan)
    //     ),
    //     Promise.resolve(state)
    // ).then(state => {
    //     return NullableUtils.getWithDefault(
    //         NullableUtils.map(data => executeFunc(state, characterType.Giantess, data),
    //             getCareerData(state, characterType.Giantess)
    //         ),
    //         Promise.resolve(state)
    //     )
    // })
    return ArrayUtils.reducePromise(
        getCareerData(state, characterType.LittleMan),
        (state, data) => {
            return executeFunc(state, characterType.LittleMan, data)
        }, state
    ).then(state => {
        return ArrayUtils.reducePromise(
            getCareerData(state, characterType.Giantess),
            (state, data) => {
                return executeFunc(state, characterType.Giantess, data)
            }, state
        )
    })
}

export let apply = (state: state) => {
    return _executeAll(state, _apply)
}

export let deapply = (state: state) => {
    return _executeAll(state, _deapply)
}

// let _findService = (state: state, name) => {
//     return NullableUtils.getExn(_getAllServices(state).find(service => {
//         return service.getName() == name
//     }))
// }

export let isUseCareerFeature = (state: state, name: name, careerFeatureName: careerFeatureName) => {
    if (!isPlayerByCharacterType(state, name, Scene.getCharacterType(getAbstractState(state)))) {
        return false
    }

    // let api = getModAPI(state)

    return isUseCareerFeatureByCharacterType(state, Scene.getCharacterType(getAbstractState(state)), careerFeatureName)
}

export let isUseCareerFeatureByCharacterType = (state: state, characterType_, careerFeatureName: careerFeatureName) => {
    // return !NullableUtils.isNullable(
    //     getCareerData(state, characterType).getCareerFeatureData(state)
    //         .find(d => d[0] == careerFeatureName)
    // )



    // return MutableRecordUtils.has(getCareerData(state, characterType).getCareerFeatureData(state),
    //     careerFeatureName
    // )
    // return !NullableUtils.isNullable(getCareerData(state, characterType_).find(data => data.name == careerFeatureName))
    return MutableRecordUtils.has(getAllCareerFeatureData(state, characterType_),
        careerFeatureName
    )
}

export let getUseCareerFeatureCharacterType = (state: state, name: name, careerFeatureName: careerFeatureName) => {
    if (isUseCareerFeature(state, name, careerFeatureName)) {
        return getCharacterTypeByName(name)
    }

    return characterType.None
}

export let getCareerFeatureValueByCharacterType = (state: state, characterType_, careerFeatureName: careerFeatureName) => {
    // return NullableUtils.getExn(
    //     getCareerData(state, Scene.getCharacterType(getAbstractState(state))).getCareerFeatureData(state)
    //         .find(d => d[0] == careerFeatureName)
    // )[1]
    // return MutableRecordUtils.getExn(getCareerData(state, characterType_).getCareerFeatureData(state),
    //     careerFeatureName
    // )

    // return NullableUtils.getExn(getCareerData(state, characterType_).find(data => data.name == careerFeatureName))
    return MutableRecordUtils.getExn(getAllCareerFeatureData(state, characterType_),
        careerFeatureName
    )
}

export let getCareerFeatureValue = (state: state, careerFeatureName: careerFeatureName) => {
    return getCareerFeatureValueByCharacterType(state, Scene.getCharacterType(getAbstractState(state)), careerFeatureName)
}

// export let clearRandomCareerCareerFeatureData = (state: state) => {
//     state = setBlockState(state, modProtocolName.CareerProtocol,
//         _getCareerRandomBlockName(),
//         {
//             ...getBlockStateExn<blockState>(state, modProtocolName.CareerProtocol, _getCareerRandomBlockName()),
//             careerFeatureData: []
//         })

//     return state
// }

export let isRandomCareer = (state: state, careerName: string) => {
    return [
        "career-littleman-random",
        "career-giantess-random",
    ].map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.CareerProtocol, blockName).getName()
    }).includes(careerName)
}

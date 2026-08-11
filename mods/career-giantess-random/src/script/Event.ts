import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { getBlockName } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getName } from "../json/Data"
import { setCareerFeatureData, setState, createState } from "./Utils"

let _handleGenerateRandomCareerHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let careerFeatureData = api.ArrayUtils.randomShuffle(api.getCareerFeatureData(api, state).filter(data => api.isCharacterType(userData.characterType, data.characterType)))

    let postiveData = api.NumberUtils.randomSelectMaxCountByRate(
        careerFeatureData.filter(data => data.positive),
        api.NumberUtils.getRandomInteger(3, 9),
        careerFeatureData.filter(data => data.positive).map(data => data.rate),
        1
    )

    let filterNegativeData = careerFeatureData.filter(data => !data.positive
        && api.NullableUtils.getWithDefault(
            api.NullableUtils.map(selectRandomConditionFunc => {
                return selectRandomConditionFunc(state, postiveData)
            }, data.selectRandomConditionFunc),
            true
        )
    )
    let negativeData = api.NumberUtils.randomSelectMaxCountByRate(
        filterNegativeData,
        api.NumberUtils.getRandomInteger(2, 6),
        filterNegativeData.map(data => data.rate),
        1
    )

    // state = setCareerFeatureData(api, state, postiveData.concat(negativeData).map(d => [d.name, d.generateRandomValueFunc(state)]))
    state = setCareerFeatureData(api, state, postiveData.concat(negativeData).reduce(((result, d) => api.MutableRecordUtils.set(result, d.name, d.generateRandomValueFunc(state))), api.MutableRecordUtils.create()))
    // state = setCareerFeatureData(api, state, postiveData.concat(negativeData).map(d => [d, d.generateRandomValueFunc(state)]))

    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state: state, _) => {
    // state = setState(api, state, {
    //     ...createState(api),
    // })

    return Promise.resolve(state)
}


export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)
    state = api.event.on(state, api.event.getGenerateGiantessRandomCareerEventName(), _handleGenerateRandomCareerHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getDisposeEventName())
    state = api.event.offAll(state, api.event.getGenerateGiantessRandomCareerEventName())

    return state
}

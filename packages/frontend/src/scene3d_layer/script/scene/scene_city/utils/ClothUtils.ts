import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType"
import { state } from "../../../../type/StateType"
import { getConfigData, getLevelNumber, getSceneChapter, setConfigData } from "../CityScene"
import { getClothHpData as getClothHpDataBiwuLevel1 } from "../data/biwu/level1/mmd/MMDData"
import { getClothHpData as getClothHpDataBiwuLevel2 } from "../data/biwu/level2/mmd/MMDData"
import { getClothHpData as getClothHpDataBiwuLevel3 } from "../data/biwu/level3/mmd/MMDData"
import { getClothHpData as getClothHpDataPlay } from "../data/mmd/MMDData"

export let initClothHpData = (state: state, getClothHpDataFunc, usedMMDData) => {
    return usedMMDData.reduce((state, d) => {
        return setConfigData(state, {
            ...getConfigData(state),
            clothHpDataMap: getConfigData(state).clothHpDataMap.set(
                d.usedGirl,
                getClothHpDataFunc(state, d.usedGirl).map(d => {
                    return {
                        ...d,
                        data: d.data.map(d => {
                            return {
                                ...d,
                                hp: Math.round(d.hp)
                            }
                        })
                    }
                })
            ),
        })
    }, state)
}

export let getGetClothHpDataFunc = (state: state) => {
    switch (getSceneChapter(state)) {
        // case scene.Play:
        //     return getClothHpDataPlay
        case scene.Biwu:
            switch (getLevelNumber(state)) {
                case 1:
                    return getClothHpDataBiwuLevel1
                case 2:
                    return getClothHpDataBiwuLevel2
                case 3:
                    return getClothHpDataBiwuLevel3
                default:
                    throw new Error("error")
            }
        default:
            // throw new Error("err")
            return getClothHpDataPlay
    }
}
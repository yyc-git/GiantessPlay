import { service } from "mmd-character-protocol/src/service/ServiceType"
import { getAllBlockServiceFuncWithDefault } from "./Mod"
import { modProtocolName } from "./data/ModData"
import { mmdCharacter } from "mmd-character-extend/src/json/Type"
import { mmdCharacter as mmdCharacterDefault } from "mmd-character-default/src/json/Type"
import { getModAPI } from "../script/scene/scene_city/Mod"
import { getCurrentMMDCharacterName } from "../script/scene/scene_city/girl/Girl"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../type/StateType"
import { getLevelNumber, getSceneChapter } from "../script/scene/scene_city/CityScene"
import { scene } from "../../ui_layer/global/store/GlobalStoreType"
import { getBoneNameForLightStressing as getBoneNameForLightStressingBiwuLevel3, getDataForPartialScale as getDataForPartialScaleBiwuLevel3 } from "../script/scene/scene_city/data/biwu/level3/mmd/MMDData"

export let getBaixiName = () => mmdCharacterDefault.Baixi_Maid

export let getCimingName = () => mmdCharacter.Ciming

export let getLipusiName = () => mmdCharacter.Lipusi

export let getSunxiaomeiName = () => mmdCharacter.Sunxiaomei

export let getAllSelectCharacterData = (state) => {
    let api = getModAPI(state)

    return getAllBlockServiceFuncWithDefault<service>(state, service => service.getSelectCharacterData(api, state), modProtocolName.MMDCharacterProtocol, [])
}

export let getMMDName = (state, usedGirl) => {
    // return NullableUtils.getExn(
    //     getAllSelectCharacterData(state).find(
    //         d => d[1] == getCurrentMMDCharacterName(state, usedGirl)
    //     )
    // )[2]
    return NullableUtils.getWithDefault(
        NullableUtils.map(d => d[2],
            getAllSelectCharacterData(state).find(
                d => d[1] == getCurrentMMDCharacterName(state, usedGirl)
            )
        ),
        ""
    )
}

export let getBoneNameForLightStressing = (state: state) => {
    switch (getSceneChapter(state)) {
        case scene.Biwu:
            if (getLevelNumber(state) == 3) {
                return getBoneNameForLightStressingBiwuLevel3()
            }
        default:
            return getAllBlockServiceFuncWithDefault<service>(state, service => service.getBoneNameForLightStressing(), modProtocolName.MMDCharacterProtocol, [])
    }
}

export let getDataForPartialScale = (state: state) => {
    switch (getSceneChapter(state)) {
        case scene.Biwu:
            if (getLevelNumber(state) == 3) {
                return getDataForPartialScaleBiwuLevel3()
            }
        default:
            return getAllBlockServiceFuncWithDefault<service>(state, service => service.getDataForPartialScale(), modProtocolName.MMDCharacterProtocol, [])
    }
}

export let getPickedTransform = (state: state) => {
    switch (getSceneChapter(state)) {
        case scene.Biwu:
        //     throw new Error("error")
        default:
            return getAllBlockServiceFuncWithDefault<service>(state, service => service.getPickedTransform(), modProtocolName.MMDCharacterProtocol, [])
    }
}

export let getUBControlledTransform = (state: state) => {
    switch (getSceneChapter(state)) {
        case scene.Biwu:
            throw new Error("error")
        default:
            return getAllBlockServiceFuncWithDefault<service>(state, service => service.getUBControlledTransform(), modProtocolName.MMDCharacterProtocol, [])
    }
}

export let getPutToBreastTransform = (state: state) => {
    switch (getSceneChapter(state)) {
        case scene.Biwu:
            throw new Error("error")
        default:
            return getAllBlockServiceFuncWithDefault<service>(state, service => service.getPutToBreastTransform(), modProtocolName.MMDCharacterProtocol, [])
    }
}

export let getPutToShoeTransform = (state: state) => {
    switch (getSceneChapter(state)) {
        case scene.Biwu:
            throw new Error("error")
        default:
            return getAllBlockServiceFuncWithDefault<service>(state, service => service.getPutToShoeTransform(), modProtocolName.MMDCharacterProtocol, [])
    }
}
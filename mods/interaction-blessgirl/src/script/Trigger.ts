import { api } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getModalUIData } from "../json/UIData"
import { buffName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getBlessData, getOpenBuffGirlResourceId } from "../json/Data"

let _getRandomBlessBuff = (api: api, state: state): Array<[buffName, number, number, string, string, characterType]> => {
    return api.NumberUtils.randomSelectCount(
        getBlessData(api),
        1
    ).map(({ name, time, count }) => {
        let { imageSrc, getDescriptionFunc, value, characterType } = api.findBuffData(state, name)

        return [
            name, time, count,
            imageSrc,
            api.buildDescriptionWithCharacterType(state, getDescriptionFunc, api.buildFuncData(state), count, value, time, characterType),
            characterType
        ]
    })
}

let _addBlessBuff = (api: api, state: state, data: Array<[buffName, number, number, string, string, characterType]>) => {
    let usedGirl = usedGirlEnum.PlayerGirl

    return api.ArrayUtils.reducePromise(
        data, (state, [buffName, time, count, _i, _d, characterType_]) => {
            switch (characterType_) {
                case characterType.LittleMan:
                    return api.addBuff(state, buffName, api.getLittleManName(), api.NullableUtils.getEmpty(), time, count, characterType.LittleMan)
                case characterType.Giantess:
                    return api.addBuff(state, buffName, api.girl.buildNameByUsedGirl(usedGirl), api.NullableUtils.return_(usedGirl), time, count, characterType.Giantess)
                case characterType.Both:
                    return api.addBuff(state, buffName, api.getLittleManName(), api.NullableUtils.getEmpty(), time, count, characterType.LittleMan).then(state => {
                        return api.addBuff(state, buffName, api.girl.buildNameByUsedGirl(usedGirl), api.NullableUtils.return_(usedGirl), time, count, characterType.Giantess)
                    })
                default:
                    throw new Error("err")
            }
        }, state
    )
}

export let trigger = (api: api, state: state) => {
    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(getOpenBuffGirlResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
    ))

    return api.sceneUI.showModal(state, getModalUIData(api, state,
        _addBlessBuff,
        _getRandomBlessBuff(api, state),
    ))
    // .then(api.writeState)
}
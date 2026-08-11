import { language, state } from "frontend/src/scene3d_layer/type/StateType";
import { api } from "type-api/src/Type";
import { getSoundResourceId } from "../json/Data";
import { resourceLevel } from "mmd-character-protocol/src/service/ServiceType";

export enum languageKey {
    Fail
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Fail]: "捕捉失败",
        },
        [language.English]: {
            [languageKey.Fail]: "Capture Fail",
        },
    }
}


let _isCanCapture = (api: api, state: state, usedGirl, mmdCharacter) => {
    let resourceLevel_ = api.NullableUtils.getExn(api.getAllSelectCharacterData(state).find(d => {
        return d[1] == mmdCharacter
    }))[4]

    let factor
    switch (resourceLevel_) {
        case resourceLevel.White:
            factor = 1
            break
        case resourceLevel.Green:
            factor = 0.7
            break
        case resourceLevel.Blue:
            factor = 0.3
            break
        case resourceLevel.Purple:
            factor = 0.1
            break
        default:
            throw new Error('error')
    }


    return api.NumberUtils.isRandomRate(
        api.NumberUtils.clamp(
            api.girl.getFullHp(state, usedGirl) / api.girl.getBodyHp(state, usedGirl),
            1,
            10
            // 8
        )
        * 0.1
        * factor
    )
}

export let use = (api: api, state: state, name: string) => {
    let usedGirl = api.getNearestUsedGirl(state, api.getPlayerPosition(state))

    state = api.subPropCount(state, name, 1)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
    ))

    let girlPosition = api.getGirlPosition(state, usedGirl)
    let mmdCharacter = api.getCurrentMMDCharacterName(state, usedGirl)

    if (_isCanCapture(api, state, usedGirl, mmdCharacter)) {
        return api.destroyGiantess(state, usedGirl).then(state => {
            /*! defer because to avoid conflict with close prop modal->handleCloseModal
            * 
            */
            return api.setAbstractState(state, api.Flow.addDeferExecFuncData(api.getAbstractState(state), (state) => {
                return api.event.trigger(state, api.getAbstractState, api.getCaptureLevelGiantessEventName(), api.NullableUtils.return_(
                    api.buildCaptureLevelGiantessEventData(girlPosition, mmdCharacter)
                ))
            }, 10))
        })
    }

    api.sceneUI.alert(api.getLanguageDataByData(state, getTextData(), languageKey.Fail))

    return Promise.resolve(state)
}
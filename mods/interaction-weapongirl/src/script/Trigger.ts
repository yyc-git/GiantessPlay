import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getModalUIData, getSelectedWeaponData } from "../json/UIData"
import { getOpenWeaponGirlResourceId } from "../json/Data"

export let trigger = (api: api, state: state) => {
    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(getOpenWeaponGirlResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
    ))

    return api.sceneUI.showModal(state, getModalUIData(api, state, getSelectedWeaponData(api, state)))
}
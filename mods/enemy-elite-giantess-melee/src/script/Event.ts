import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getBlockName, getModelQueue, getShareBlockName, getShareProtocolName, hasModelQueue } from "./Utils"
import { getAnimationData, getMeleeGiantessResourceId, getModelData, getPath, getSoundPath, getStompLightSoundResourceId } from "../json/Data"
import { createAttackState, createInitialState, createMoveState, getWeaponValue } from "./FSMState";
import { service as shareService } from "enemy-elite-giantess-share-protocol/src/service/ServiceType";
import { language } from "frontend/src/scene3d_layer/type/StateType";

export enum languageKey {
    Elite
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Elite]: "精英近战巨大娘",
        },
        [language.English]: {
            [languageKey.Elite]: "Elite Melee Giantess",
        },
    }
}


let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getMeleeGiantessResourceId(),
                path: getPath(getMeleeGiantessResourceId()),
                type: resourceType.ArrayBuffer
            },
            {
                id: getStompLightSoundResourceId(),
                path: [getSoundPath(getStompLightSoundResourceId())],
                type: resourceType.Audio
            },
        ]
    )

    return Promise.resolve(state)
}

// export let getNamePrefixEliteGiantess = (api: api, state) => `${api.blockAPI.getBlockService<shareService>(state, getShareProtocolName(), getShareBlockName()).getNamePrefix()}_melee`
export let getNamePrefixEliteGiantess = (api: api, state) => api.getLanguageDataByData(state, getTextData(), languageKey.Elite)

// export let buildCategoryName = (api: api, state) => api.blockAPI.getBlockService<shareService>(state, getShareProtocolName(), getShareBlockName()).getNamePrefix()
export let buildCategoryName = getNamePrefixEliteGiantess

let _buildSkinLODName = (api: api, state) => () => {
    return `${getNamePrefixEliteGiantess(api, state)}_lod`
}

let _initWhenImportSceneHandler = (api: api, state, _) => {
    let shareService = api.blockAPI.getBlockService<shareService>(state, getShareProtocolName(), getShareBlockName())

    return shareService.initWhenImportScene(api, state,
        [
            buildCategoryName,
            _buildSkinLODName(api, state),
            box => {
                return api.box3.setFromCenterAndSize(
                    api.box3.clone(box),
                    api.box3.getCenter(box, api.vector3.getTempVector1()),
                    api.vector3.multiply(
                        api.box3.getSize(box, api.vector3.getTempVector2()),
                        // api.vector3.create(0.3, 0.7, 0.9)
                        api.vector3.create(0.5, 0.8, 0.9)
                    )
                )
            }
        ],
        getModelData(),
        getAnimationData(api, state)
    )
}

let _updateHandler = (api: api, state, _) => {
    let shareService = api.blockAPI.getBlockService<shareService>(state, getShareProtocolName(), getShareBlockName())

    if (!hasModelQueue(api, state)) {
        return Promise.resolve(state)
    }

    return shareService.updateAI(api, state,
        [
            createAttackState(api, state),
            createInitialState(api, state),
            createMoveState(api, state),
            getWeaponValue(api)
        ],
        getModelQueue(api, state)
    )
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getInitWhenImportSceneEventName(), _initWhenImportSceneHandler)
    state = api.event.on(state, api.event.getUpdateEventName(), _updateHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getInitWhenImportSceneEventName())
    state = api.event.offAll(state, api.event.getUpdateEventName())

    return state
}

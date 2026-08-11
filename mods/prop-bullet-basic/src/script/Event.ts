import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getBasicBulletEmmitSoundResourceId, getBasicBulletHitSoundResourceId, getSoundPath, getWeaponGlbResourceId, getWeaponName } from "../json/Data"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getBasicBulletHitSoundResourceId(),
                path: [getSoundPath(getBasicBulletHitSoundResourceId())],
                type: resourceType.Audio
            },
            {
                id: getBasicBulletEmmitSoundResourceId(),
                path: [getSoundPath(getBasicBulletEmmitSoundResourceId())],
                type: resourceType.Audio
            },

            // {
            //     id: getName(),
            //     path: getPropImageResourceId(),
            //     type: resourceType.Texture
            // },
            // {
            //     id: getWeaponImageResourceId(),
            //     path: getWeaponImageResourceId(),
            //     type: resourceType.Texture
            // },

            {
                id: getWeaponGlbResourceId(),
                path: getWeaponGlbResourceId(),
                type: resourceType.ArrayBuffer
            },
        ]
    )

    return Promise.resolve(state)
}

let _initWhenImportSceneHandler = (api: api, state, _) => {
    return api.ModelLoader.parseGlb(api.getAbstractState(state), api.load.getResource(api.getAbstractState(state), getWeaponGlbResourceId()), getWeaponGlbResourceId()).then(basicGun => {
        return api.addGun(state, basicGun, getWeaponName())
    })
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getInitWhenImportSceneEventName(), _initWhenImportSceneHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getInitWhenImportSceneEventName())

    return state
}

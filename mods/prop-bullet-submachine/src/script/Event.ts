import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getSubMachineBulletEmmitSoundResourceId, getSubMachineBulletHitSoundResourceId, getSoundPath, getWeaponGlbResourceId, getWeaponName } from "../json/Data"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getSubMachineBulletHitSoundResourceId(),
                path: [getSoundPath(getSubMachineBulletHitSoundResourceId())],
                type: resourceType.Audio
            },
            {
                id: getSubMachineBulletEmmitSoundResourceId(),
                path: [getSoundPath(getSubMachineBulletEmmitSoundResourceId())],
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
    return api.ModelLoader.parseGlb(api.getAbstractState(state), api.load.getResource(api.getAbstractState(state), getWeaponGlbResourceId()), getWeaponGlbResourceId()).then(submachineGun => {
        return api.addGun(state, submachineGun, getWeaponName())
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

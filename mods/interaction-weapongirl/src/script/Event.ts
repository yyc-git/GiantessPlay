import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getBuyResourceId, getWeaponGirlResourceId, getWeaponGirlResourcePath, getOpenWeaponGirlResourceId, getSoundPath, getWeaponData } from "../json/Data"
import { weaponValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { getFieldValue, setState, createState, setWeaponData, getWeaponData as getWeaponDataUtils } from "./Utils"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getOpenWeaponGirlResourceId(),
                path: [getSoundPath(getOpenWeaponGirlResourceId())],
                type: resourceType.Audio
            },
            {
                id: getBuyResourceId(),
                path: [getSoundPath(getBuyResourceId())],
                type: resourceType.Audio
            },
            {
                id: getWeaponGirlResourceId(),
                path: getWeaponGirlResourcePath(),
                type: resourceType.ArrayBuffer
            },
        ]
    )

    return Promise.resolve(state)
}

let _initWhenImportSceneHandler = (api: api, state, _) => {
    state = setWeaponData(api, state, getWeaponData(api, state))

    state = api.setUpdateLittleManWeaponFunc(state, (state, weaponName, weaponValue: weaponValue) => {
        return api.NullableUtils.getWithDefault(
            api.NullableUtils.map(
                (d) => {
                    return d.fields.reduce((weaponValue, { name, ratio, isInteger, isSub }) => {
                        let fieldValue = getFieldValue(api, state, weaponName, name)

                        if (fieldValue == 0) {
                            return weaponValue
                        }

                        let r
                        if (isSub) {
                            r = 1 - ratio
                        }
                        else {
                            r = 1 + ratio
                        }

                        let newFieldValue = weaponValue[name] * Math.pow(r, fieldValue)


                        return {
                            ...weaponValue,
                            [name]: isInteger ? Math.round(newFieldValue) : newFieldValue
                        }
                    }, weaponValue)
                },
                getWeaponDataUtils(api, state).find(d => {
                    return d.name == weaponName
                })),
            weaponValue
        )
    })

    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state: state, _) => {
    if (!api.isEnteringNextLevel(state)) {
        state = setState(api, state, {
            ...createState(api),
        })
    }

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getInitWhenImportSceneEventName(), _initWhenImportSceneHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getInitWhenImportSceneEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}

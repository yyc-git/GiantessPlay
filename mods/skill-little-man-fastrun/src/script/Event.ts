import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getLittleManFastRunStartEventName, getLoadData } from "../json/Data"
import { fastRunStartHandler } from "./Action"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { littleManActionState } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            getLoadData(),
        ].map(([animationName, animationPath]) => {
            return {
                id: animationName,
                path: animationPath,
                type: resourceType.ArrayBuffer
            }
        })
    )

    return Promise.resolve(state)
}

let _keydownHandler = (api: api, state: state, { userData }) => {
    let { code } = api.NullableUtils.getExn(userData)

    switch (api.getCharacterType(api.getAbstractState(state))) {
        case characterType.LittleMan:
            switch (code) {
                case "ShiftLeft":
                case "ShiftRight":
                    if (!api.littleMan.isActionState(state, littleManActionState.Run)) {
                        return api.littleMan.triggerAction(state, getActionName())
                    }
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

let _keyupHandler = (api: api, state: state, { userData }) => {
    let { code } = api.NullableUtils.getExn(userData)

    switch (api.getCharacterType(api.getAbstractState(state))) {
        case characterType.LittleMan:
            switch (code) {
                case "ShiftLeft":
                case "ShiftRight":
                    if (api.littleMan.isActionState(state, littleManActionState.Run)) {
                        // state = api.littleMan.resetIsTriggerAction(state, usedGirl)

                        return Promise.resolve(api.littleMan.setActionState(state, littleManActionState.Initial))
                    }
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}


export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, getLittleManFastRunStartEventName(), fastRunStartHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, api.event.getKeyupEventName(), _keyupHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, getLittleManFastRunStartEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, api.event.getKeyupEventName())

    return state
}

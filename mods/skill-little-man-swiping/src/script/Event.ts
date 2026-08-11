import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getLittleManSwipingEmitEventName, getLittleManSwipingStartEventName, getLoadData } from "../json/Data"
import { swipingEmitHandler, swipingStartHandler } from "./Action"
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

let _pointdownHandler = (api: api, state: state, { userData }) => {
    let { button } = api.NullableUtils.getExn(userData)

    switch (api.getCharacterType(api.getAbstractState(state))) {
        case characterType.LittleMan:
            switch (button) {
                case 2:
                    if (!api.Device.isMobileByState(api.getAbstractState(state))) {
                        // return api.littleMan.triggerAction(state, getActionName())
                        if (api.isBurstFire(state)) {
                            return api.triggerDownActionForBurstFire(state, getActionName())
                        }

                        return api.triggerDownActionForContinueFire(state, getActionName())
                    }
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

let _pointupHandler = (api: api, state: state, { userData }) => {
    let { button } = api.NullableUtils.getExn(userData)

    switch (api.getCharacterType(api.getAbstractState(state))) {
        case characterType.LittleMan:
            switch (button) {
                case 2:
                    if (!api.Device.isMobileByState(api.getAbstractState(state))
                        && api.littleMan.isActionState(state, littleManActionState.Swiping)
                    ) {
                        // state = api.littleMan.setActionState(state, littleManActionState.Initial)
                        if (api.isBurstFire(state)) {
                            return api.triggerUpActionForBurstFire(state, getActionName())
                        }

                        return api.triggerUpActionForContinueFire(state, getActionName())
                    }
                    break
            }
            break
    }

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, getLittleManSwipingStartEventName(), swipingStartHandler)
    state = api.event.on(state, getLittleManSwipingEmitEventName(), swipingEmitHandler)
    state = api.event.on(state, api.event.getPointdownEventName(), _pointdownHandler)
    state = api.event.on(state, api.event.getPointupEventName(), _pointupHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, getLittleManSwipingStartEventName())
    state = api.event.offAll(state, getLittleManSwipingEmitEventName())
    state = api.event.offAll(state, api.event.getPointdownEventName())
    state = api.event.offAll(state, api.event.getPointupEventName())

    return state
}

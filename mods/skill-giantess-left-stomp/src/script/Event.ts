import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getForceAnimationName, getStompSoundResourceId, getStompSoundResourcePath } from "../json/Data"
// import { setState, getState, createState } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getStompSoundResourceId(),
                path: [getStompSoundResourcePath()],
                type: resourceType.Audio
            },
        ]
    )

    return Promise.resolve(state)
}

let _keydownHandler = (api: api, state: state, { userData }) => {
    let { code } = api.NullableUtils.getExn(userData)

    switch (api.getCharacterType(api.getAbstractState(state))) {
        case characterType.Giantess:
            switch (code) {
                case "KeyF":
                    return api.triggerGirlAction(state,  usedGirlEnum.PlayerGirl, getActionName()).then(api.TupleUtils.getTuple2First)
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

// let _startKeepStompHandler = (api: api, state: state, { userData }) => {
//     let data = api.girl.getBone(state,usedGirl, api.girl.getGirl(state, usedGirl), "右足ＩＫ")
//     state = data[0]
//     let bone = data[1]


//     let localPosition = bone.position.clone()

//     let worldPosition1 = api.gameObject.getWorldPosition(bone)

//     api.vector3.setZ(bone.position, 0)

//     let worldPosition2 = api.gameObject.getWorldPosition(bone)

//     api.vector3.setZ(bone.position, api.vector3.getZ(localPosition))


//     state = setState(api, state, {
//         ...getState(api, state),
//         positionOffset: api.vector3.setY(
//             api.vector3.sub(
//                 worldPosition1,
//                 worldPosition2,
//             ),
//             0
//         )
//     })

//     return Promise.resolve(state)
// }

// let _updatePositionOffset = (api: api, state: state) => {
//     state = api.girl.setPosition(state,
//         api.vector3.add(
//             api.getGirlPosition(state, usedGirl),
//             getState(api, state).positionOffset
//         )
//     )

//     // state = api.updateDistanceRateOnlyOnceInOneFrame(state)
//     state = api.girl.computeGirlBoxAndSetToState(state, usedGirl)
//     // state = api.updateThirdPersonControlsForChangeScale(state)


//     return state
// }

// let _firstStartKeepLeftStompHandler = (api: api, state: state, { userData }) => {
//     state = _updatePositionOffset(api, state)

//     return Promise.resolve(state)

// }

// // let _changeGiantessAnimationHandler = (api: api, state: state, { userData }) => {
// //     let { currentAnimationName, nextAnimationName } = api.NullableUtils.getExn(userData)

// //     if (currentAnimationName == getForceAnimationName() && nextAnimationName != animationName.KeepLeftStomp) {
// //         state = _updatePositionOffset(api, state)
// //     }

// //     return Promise.resolve(state)

// // }

// let _disposeHandler = (api: api, state: state, _) => {
//     state = setState(api, state, {
//         ...createState(api),
//     })

//     return Promise.resolve(state)
// }


export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    // state = api.event.on(state, api.event.getStartKeepStompEventName(), _startKeepStompHandler)
    // state = api.event.on(state, api.event.getFirstStartKeepLeftStompEventName(), _firstStartKeepLeftStompHandler)
    // // state = api.event.on(state, api.event.getChangeGiantessAnimationEventName(), _changeGiantessAnimationHandler)
    // state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    // state = api.event.offAll(state, api.event.getStartKeepStompEventName())
    // state = api.event.offAll(state, api.event.getFirstStartKeepLeftStompEventName())
    // // state = api.event.offAll(state, api.event.getChangeGiantessAnimationEventName())
    // state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}

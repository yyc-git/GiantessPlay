import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getData, hasData, setData, getState, setState, updateGirlScale, createData, getSumIncreaseScale, isExceedMaxSumIncreaseScale } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"

let _handleDamageGiantessHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let usedGirl = userData.usedGirl

    state = setState(api, state, {
        ...getState(api, state),
        lastDamagedTime: api.NullableUtils.return_(api.getNow(state)),
    })

    if (hasData(api, state, usedGirl)
        && userData.damage > 0
    ) {
        if (isExceedMaxSumIncreaseScale(api, state, usedGirl)) {
            return Promise.resolve([state, userData])
        }


        let factor
        // if (api.isGiantessCharacterType(state)) {
        if (api.isPlayerGirlOrGiantess(state, usedGirl)) {
            factor = 1 + api.getDamageBiggerFactorLevel(state)
        }
        else {
            factor = 1
        }

        // let increasedScale = api.NumberUtils.clamp(userData.damage / forceSize.Middle, 0.1, 5)
        // let increasedScale = api.NumberUtils.clamp(userData.damage / forceSize.Middle * 0.5, 0.1, 5)
        // let increasedScale = api.NumberUtils.clamp(userData.damage / forceSize.Middle, 0.1, 5) * factor
        // let increasedScale = api.NumberUtils.lessThan(userData.damage / forceSize.Middle, 5) * factor
        // let increasedScale = api.NumberUtils.clamp(userData.damage / forceSize.Middle, 0.1, 5) * factor
        // let increasedScale = api.NumberUtils.clamp((userData.damage / api.girl.getFullHp(state, usedGirl)) * 20, 0.1, 5) * factor
        // let increasedScale = api.NumberUtils.clamp((userData.damage / api.girl.getFullHp(state, usedGirl)) * 100, 0.2, 5) * factor

        // let increasedScale = api.NumberUtils.clamp((userData.damage / api.girl.getFullHp(state, usedGirl)) * 0.2 * api.getGirlScale(state, usedGirl), 0.2, api.getGirlScale(state, usedGirl) * 0.1) * factor
        let scale = api.getGirlScale(state, usedGirl)
        // let increasedScale = api.NumberUtils.clamp((userData.damage / api.girl.getFullHp(state, usedGirl)) * 0.2 * scale, api.NumberUtils.greaterThan(scale * 0.01, 0.2), scale * 0.1) * factor
        scale = api.NumberUtils.clamp(scale, 1, 300)
        let increasedScale = api.NumberUtils.clamp((userData.damage / api.girl.getFullHp(state, usedGirl)) * 0.5 * scale, api.NumberUtils.greaterThan(scale * 0.005, 0.2), scale * 0.1) * factor

        state = setData(api, state, usedGirl, {
            ...getData(api, state, usedGirl),
            sumIncreaseScale: getSumIncreaseScale(api, state, usedGirl) + increasedScale
        })

        state = updateGirlScale(api, state, usedGirl, increasedScale, true)

    }

    return Promise.resolve([state, userData])
}

// let _beforeAddGirlHandler = (api: api, state: state, data) => {
//     // let userData = api.NullableUtils.getExn(data.userData)

//     // // if (api.isGiantessCharacterType(state) && hasData(api, state, usedGirl)) {
//     // if (api.isGiantessCharacterType(state)) {
//     //     state = api.NullableUtils.getWithDefaultFunc(
//     //         api.NullableUtils.map(scale => {
//     //             return api.setGirlScale(state, scale)
//     //             // }, getData(api, state, usedGirl).originPlayerGirlScale),
//     //         }, getState(api, state).originPlayerGirlScale),
//     //         () => {
//     //             // return api.changeToInitialScale(state)
//     //             if (hasData(api, state, usedGirl)) {
//     //                 state = updateGirlScale(api, state, getSumIncreaseScale(api, state))
//     //             }

//     //             return state
//     //         }
//     //     )
//     // }

//     return Promise.resolve(state)
// }

// let _afterRemoveGirlHandler = (api: api, state: state, data) => {
// let userData = api.NullableUtils.getExn(data.userData)

// if (api.isGiantessCharacterType(state) && hasData(api, state, usedGirl)) {
// if (api.isGiantessCharacterType(state)) {
//     state = setState(api, state, {
//         ...getState(api, state),
//         originPlayerGirlScale: api.NullableUtils.return_(api.getGirlScale(state, usedGirl))

//     })
// }

// return Promise.resolve(state)
// }

// let _initWhenImportSceneHandler = (api: api, state, _) => {
//     // state = setData(api, state, usedGirl, createData(api), usedGirlEnum.PlayerGirl)

//     return Promise.resolve(state)
// }

let _updateHandler = (api: api, state, _) => {
    let usedGirl = usedGirlEnum.PlayerGirl

    if (api.isGiantessCharacterType(state) && hasData(api, state, usedGirl)) {
        // if (api.getExcitement(state, usedGirl) >= 10) {
        // if (api.getExcitement(state, usedGirl) >= 50) {
        if (api.getExcitement(state, usedGirl) >= 20) {
            return Promise.resolve(state)
        }

        // if (api.getPassTimeFromNow(state, getState(api, state).lastDamagedTime) >= 10000) {
        // if (api.getPassTimeFromNow(state, getState(api, state).lastDamagedTime, Infinity) >= 8000) {
        if (api.getPassTimeFromNow(state, getState(api, state).lastDamagedTime, Infinity) >= 16000) {
            let girlScale = api.getGirlScale(state, usedGirl)
            // let targetScale = api.NumberUtils.greaterThan(
            //     girlScale - api.NumberUtils.greaterThan(girlScale * 0.2, 5),
            //     api.getGirlValue(state, usedGirl).minScale)
            let decreaseScale = api.NumberUtils.lessThan(api.NumberUtils.greaterThan(girlScale * 0.2, 5), getSumIncreaseScale(api, state, usedGirl))

            state = setState(api, state, {
                ...getState(api, state),
                lastDamagedTime: api.NullableUtils.return_(api.getNow(state)),
            })

            // if (girlScale == targetScale) {
            //     return Promise.resolve(state)
            // }

            // state = setData(api, state, usedGirl, {
            //     ...getData(api, state, usedGirl),
            //     sumIncreaseScale: targetScale - api.getGirlValue(state, usedGirl).initialScale
            // })

            if (decreaseScale >= 1) {
                state = setData(api, state, usedGirl, {
                    ...getData(api, state, usedGirl),
                    sumIncreaseScale: getSumIncreaseScale(api, state, usedGirl) - decreaseScale
                })

                state = api.playSmallerAnimation(state, (state) => {
                    return Promise.resolve(state)
                },
                    usedGirl,
                    // targetScale
                    girlScale - decreaseScale
                )
            }

            return Promise.resolve(state)
        }
    }

    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state, _) => {
    let usedGirl = usedGirlEnum.PlayerGirl

    if (api.isEnteringNextLevel(state)
        && hasData(api, state, usedGirl)
    ) {
        let sumIncreaseScale = getData(api, state, usedGirl).sumIncreaseScale

        state = setState(api, state, {
            ...createState(api),
            // originPlayerGirlScale: getState(api, state).originPlayerGirlScale
        })

        state = setData(api, state, usedGirl, {
            ...createData(api),
            sumIncreaseScale: sumIncreaseScale
        })
    }
    else {
        state = setState(api, state, {
            ...createState(api),
        })
    }

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    // state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    // state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _destroyedHanlder)
    // state = api.event.on(state, api.getDestroyedEventName(), _destroyedHanlder)
    // state = api.event.on(state, api.event.getBeforeAddGirlEventName(), _beforeAddGirlHandler)
    // state = api.event.on(state, api.event.getAfterRemoveGirlEventName(), _afterRemoveGirlHandler)
    // state = api.event.on(state, api.event.getInitWhenImportSceneEventName(), _initWhenImportSceneHandler)
    state = api.event.on(state, api.event.getUpdateEventName(), _updateHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageGiantessHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    // state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    // state = api.event.offAll(state, api.event.getHandleDamageArmyEventName())
    // state = api.event.offAll(state, api.getDestroyedEventName())
    // state = api.event.offAll(state, api.event.getBeforeAddGirlEventName())
    // state = api.event.offAll(state, api.event.getAfterRemoveGirlEventName())
    // state = api.event.offAll(state, api.event.getInitWhenImportSceneEventName())
    state = api.event.offAll(state, api.event.getUpdateEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}

import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api, box3 } from "type-api/src/Type"
import { getActionName } from "../json/Data"
import { camp, damageType, littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { service } from "weapon-protocol/src/service/ServiceType"
import { getWeaponBlockName, getWeaponProtocolName } from "./Utils"

export let _handleSwipingAction = (api: api, state: state) => {
    state = api.littleMan.setActionState(state, littleManActionState.Swiping)

    return state
}



export let isActionValid = (api: api, state: state, name: actionName) => {
    if (api.StateMachine.isState(api.littleMan.getStateMachine(state), objectStateName.Climb) && !api.isCanActionWhenClimb(state)) {
        switch (name) {
            case getActionName():
                return false
        }
    }

    // if (api.littleMan.isActionState(state, littleManActionState.Run)) {
    if (!api.littleMan.isActionState(state, littleManActionState.Initial)) {
        return false
    }


    return true
    // return false
}

export let triggerAction = (api: api, state, name: actionName): Promise<state> => {
    switch (name) {
        case getActionName():
            state = _handleSwipingAction(api, state)
            break
    }

    return Promise.resolve(state)
}

export let swipingStartHandler = (api: api, state: state, eventData) => api.littleMan.shootStartHandler(state, eventData)

let _getDamageBox = (api: api, state: state) => {
    let position = api.getPlayerPosition(state)

    let height = api.box3.getSize(
        api.littleMan.getBox(state),
        api.vector3.getTempVector1()
    ).y

    let startPoint = api.vector3.setY(
        api.vector3.clone(position),
        api.vector3.getY(position) + height * 0.8
    )

    let point = api.vector3.add(
        startPoint,
        api.vector3.multiplyScalar(
            api.vector3.applyQuaternion(
                api.vector3.create(0, 0, 1),
                api.littleMan.getLookat(state)
            ),
            height * 1.5
        )

    )

    return api.box3.setFromCenterAndSize(
        api.box3.createEmpty(),
        point,
        api.vector3.setScalar(
            api.vector3.getTempVector2(),
            height * 1.5
        )
    )
}


// export let swipingEmitHandler = (api: api, state: state, { userData }) => {
//     let damageBox = _getDamageBox(api, state)
//     let damagePoint = api.box3.getCenter(damageBox, api.vector3.createEmpty())

//     // let { swipingForce, swipingWeaponType } = getCurrentModelData(state)
//     let weaponValue = api.getSwipingWeaponValue(state)
//     // let [damageType_, force] = computeForce(weaponValue)
//     let force = weaponValue.force
//     let damageType_ = damageType.Global

//     // let forceDirection = api.vector3.create(0, -1, 0)
//     let forceDirection = api.vector3.create(0, 1, 0)

//     return api.handleAllCollisions(
//         state, [
//         (state: state, handleFunc, position,
//             pointBox: box3,
//             direction: [number, number, number]
//         ) => {
//             state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
//                 api.SoundManager.buildNeedToPlaySoundData(getSwipingEmmitOtherSoundResourceId(), api.getIsDebug(state), api.getLittleManVolume(state, damagePoint))
//             ))

//             state = _emitHit(api, state, damagePoint)

//             return handleFunc(state).then(api.TupleUtils.getTuple2First)
//         },
//         (state: state, handleFunc, position,
//             pointBox: box3,
//             direction: [number, number, number]
//         ) => {
//             state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
//                 api.SoundManager.buildNeedToPlaySoundData(getSwipingEmmitGirlSoundResourceId(), api.getIsDebug(state), api.getLittleManVolume(state, damagePoint))
//             ))


//             state = _emitHit(api, state, damagePoint)

//             return handleFunc(state).then(api.TupleUtils.getTuple2First)
//         },
//         api.handleHitArmy(
//             (state: state, handleFunc, position,
//                 pointBox: box3,
//                 direction: [number, number, number]
//             ) => {
//                 state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
//                     api.SoundManager.buildNeedToPlaySoundData(getSwipingEmmitGirlSoundResourceId(), api.getIsDebug(state), api.getLittleManVolume(state, damagePoint))
//                 ))


//                 state = _emitHit(api, state, damagePoint)

//                 return handleFunc(state).then(api.TupleUtils.getTuple2First)
//             },
//         ),
//         (state: state, handleFunc, position,
//             pointBox: box3,
//             direction: [number, number, number]
//         ) => {
//             return handleFunc(state).then(api.TupleUtils.getTuple2First)
//         },
//         (state, particle) => {
//             return state
//         },
//     ],
//         force,
//         weaponValue.type,
//         damageType_,
//         weaponValue,
//         damageBox,
//         damageBox,
//         api.vector3.toArray(damagePoint, []),
//         damagePoint,
//         api.buildFakeBulletParticle(api.vector3.toArray(forceDirection, []), api.getLittleManName(), api.getPlayerCamp()),
//         true,
//         true
//     ).then(api.TupleUtils.getTuple2First)
// }

export let swipingEmitHandler = (api: api, state: state, { userData }) => {
    let damageBox = _getDamageBox(api, state)
    let damagePoint = api.box3.getCenter(damageBox, api.vector3.createEmpty())

    // let { swipingForce, swipingWeaponType } = getCurrentModelData(state)
    let weaponValue = api.getSwipingWeaponValue(state)
    // let [damageType_, force] = computeForce(weaponValue)
    // let force = weaponValue.force
    // let damageType_ = damageType.Global

    let forceDirection = api.buildDownDirection()


    let weaponService = api.blockAPI.getBlockService<service>(state, getWeaponProtocolName(), getWeaponBlockName())

    return api.handleCollision(
        state,
        [
            api.NullableUtils.map(func => func(api), weaponService.handleHitStatic),
            api.NullableUtils.map(func => func(api), weaponService.handleHitGirl),
            api.NullableUtils.map(func => func(api), weaponService.handleHitArmy),
            api.NullableUtils.map(func => func(api), weaponService.handleHitLittleMan),
        ],
        // NullableUtils.return_(targetPart),
        // targetPart,
        api.NullableUtils.getEmpty(),
        damageBox, damagePoint,
        api.getLittleManName(),
        api.getIsAllowFriendDamage(state) ? camp.Other : api.getPlayerCamp(),
        forceDirection,
        true,
        weaponValue,
        weaponService.getWeaponName(),
        // damageType_
        api.NullableUtils.return_(damageType.Direct)
    )
}
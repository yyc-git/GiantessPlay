import { nullable } from "block/src/Type"
import { meleeRange } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { attackTarget, camp, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"

// let _judgeDistance = (api: api, state: state, func, currentAttackTarget, name, position, distanceSquared) => {
//     switch (currentAttackTarget) {
//         case attackTarget.LittleMan:
//         case attackTarget.Giantess:
//             let pos = api.getPlayerPosition(state)
//             return func(api.getPositionParrelToObj(position, api.vector3.getY(pos)), pos, distanceSquared)
//         default:
//             return api.NullableUtils.getWithDefault(
//                 api.NullableUtils.map(data => {
//                     return func(position, data.getPositionFunc(state), distanceSquared)
//                 }, api.getAttackTargetObjectData(state, name)),
//                 false
//             )
//     }
// }

// let _isTooFar = (api: api, state: state, currentAttackTarget, name, position, distanceSquared) => {
//     return _judgeDistance(api, state, (pos1, pos2, distanceSquared) => api.vector3.distanceToSquared(pos1, pos2) > distanceSquared,
//         currentAttackTarget, name, position, distanceSquared)
// }

// let _isBiggerThanAttackTarget = (api: api, state: state, currentAttackTarget, box) => {
//     switch (currentAttackTarget) {
//         case attackTarget.LittleMan:
//             return true
//         case attackTarget.Giantess:
//             return api.getHeightByBox(box) >= api.getActualGirlHeight(state, usedGirl)
//         default:
//             return true
//     }
// }

// let _isTooNear = (api: api, state: state, currentAttackTarget, name, position, meleeRange: nullable<meleeRange>) => {
//     return api.NullableUtils.getWithDefault(
//         api.NullableUtils.map(
//             meleeRange => {
//                 return _judgeDistance(api, state, (pos1, pos2, distanceSquared) => {
//                     if (distanceSquared < 100) {
//                         return false
//                     }

//                     return api.vector3.distanceToSquared(pos1, pos2) < distanceSquared * 0.25
//                 }, currentAttackTarget, name, position, meleeRange * meleeRange)
//             }, meleeRange
//         ),
//         false
//     )
// }

let _isNearPlayerGiantess = (api: api, state, position) => {
    return api.ArrayUtils.reduce(api.girl.getCurrentUsedGirls(state), (result, usedGirl) => {
        if (result != usedGirlEnum.None) {
            return result
        }


        if (api.NumberUtils.isRandomRate(0.6)
            && api.isPlayerGiantess(state, usedGirl)
            // && api.isNearGirl(state, position)
            // && api.isNearObject(position, api.getPivotWorldPosition(state, usedGirl), nearDistance)) {
            && api.isSmallDistanceFromGirl(state, usedGirl, position)) {
            return usedGirl
        }

        return result
    }, usedGirlEnum.None)
}

export let updateAttackTarget = (api: api, state: state, name, position, box, meleeRange, camp_) => {
    // let currentAttackTarget = api.getAttackTarget(state, name)

    // let nearDistance = 100
    // let nearDistance = 20 * Math.sqrt(api.getHeightByBox(box))
    // let nearDistance = 25 * (api.getHeightByBox(box) / 10)
    // let giantessDistance = api.getNearGirlDistance(state, api.getHeightByBox(box))

    const armyDistance = 500

    let data = api.preHandleAttackTarget(api, state, name, position, box, meleeRange, camp_, camp.Giantess, armyDistance)
    state = data[0]
    let isFinish = data[1]

    if (isFinish) {
        return state
    }

    let attackTarget_, visibleData

    attackTarget_ = attackTarget.None
    visibleData = api.NullableUtils.getEmpty()

    let usedGirl

    switch (camp_) {
        case camp.Player:
            // if (api.isLevelGiantessExceptPlayer(state, usedGirl)
            //     && api.NumberUtils.isRandomRate(0.5)
            // ) {
            //     attackTarget_ = attackTarget.Giantess
            // }
            usedGirl = api.isEnemeyGiantessWithRate(api, state, 0.5, camp.Player)
            if (usedGirl != usedGirlEnum.None) {
                attackTarget_ = attackTarget.Giantess
            }
            else {
                api.NullableUtils.forEach(data => {
                    attackTarget_ = attackTarget.Object
                    visibleData = data
                }, api.findNearestData(state, api.getAllAliveEliteGiantessData, position, camp_))
            }
            break
        case camp.Giantess:
            usedGirl = _isNearPlayerGiantess(api, state, position)
            if (usedGirl != usedGirlEnum.None) {
                attackTarget_ = attackTarget.Giantess

                state = api.setAttackTargetUsedGirl(state, name, usedGirl)

                return api.setAttackTarget(state, name, attackTarget_)
            }

            if (
                !api.isNotAttackLittleMan(state)
                &&
                (
                    api.NumberUtils.isRandomRate(0.25) && api.isNearObject(position, api.getPlayerPosition(state), armyDistance)
                )
            ) {
                attackTarget_ = api.getPlayerAttackTarget(state)
                state = api.setAttackTargetUsedGirl(state, name, usedGirlEnum.PlayerGirl)

                return api.setAttackTarget(state, name, attackTarget_)
            }

            // if (api.NumberUtils.isRandomRate(0.5)) {
            //     api.NullableUtils.forEach(data => {
            //         attackTarget_ = attackTarget.Object
            //         visibleData = data
            //     }, api.findRandomNearData(state, api.getAllAliveMilltaryBuildingData, position, nearDistance, camp_))
            // }

            // if (api.NullableUtils.isNullable(visibleData)
            //     && api.NumberUtils.isRandomRate(0.5)) {
            //     api.NullableUtils.forEach(data => {
            //         attackTarget_ = attackTarget.Object
            //         visibleData = data
            //     }, api.findRandomNearData(state, api.getAllAliveSoldierData, position, nearDistance, camp_))
            // }

            // if (api.NullableUtils.isNullable(visibleData)
            //     && api.NumberUtils.isRandomRate(0.5)) {
            //     api.NullableUtils.forEach(data => {
            //         attackTarget_ = attackTarget.Object
            //         visibleData = data
            //     }, api.findRandomNearData(state, api.getAllAliveMilltaryVehicleData, position, nearDistance, camp_))
            // }
            // else {
            //     api.NullableUtils.forEach(data => {
            //         attackTarget_ = attackTarget.Object
            //         visibleData = data
            //     }, api.findRandomNearData(state, api.getAllAliveEliteGiantessData, position, nearDistance, camp_))
            // }

            [attackTarget_, visibleData] = api.selectArmy(api, state, position, armyDistance, camp_)


            if (api.NullableUtils.isNullable(visibleData)) {
                api.NullableUtils.forEach(data => {
                    attackTarget_ = attackTarget.Building
                    visibleData = data
                },
                    // api.findNearestData(state, api.getAllAliveBuildingData, position)
                    // api.findRandomNearData(state, api.getAllAliveBuildingData, position, nearDistance)
                    api.findNearestData(state, api.getAllAliveBuildingData, position, camp_)
                )
            }

            break
    }

    state = api.setAttackTarget(state, name, attackTarget_)
    state = api.setAttackTargetUsedGirl(state, name, usedGirl)

    return api.NullableUtils.getWithDefault(
        api.NullableUtils.map(visibleData => {
            return api.setAttackTargetObjectDataByVisibleData(state, name, visibleData)
        }, visibleData),
        state
    )
}
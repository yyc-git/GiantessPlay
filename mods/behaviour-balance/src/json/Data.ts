import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { actionNode, behaviourTreeData, controlNode } from "frontend/src/scene3d_layer/script/scene/scene_city/data/behaviour_tree_data/BehaviourTreeDataType"
import { attackAction, attackRange, autoDifficulty, camp, personality, pose, targetType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { actionPrior } from "prop-artifact-giantesscontroller/src/script/State"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { api } from "type-api/src/Type"
import { getKeepUBBlockName, getPickToUBBlockName, getSitToStandBlockName, getSkillGiantessProtocolName, getStandToSitBlockName, getUBToPickBlockName } from "../script/Utils"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

// let _isVeryLowHp = (api: api, state) => {
//     return api.girl.getBodyHp(state, usedGirl) < api.girl.getFullHp(state, usedGirl) * 0.1
// }

// let _isLowHp = (api: api, state) => {
//     return api.girl.getBodyHp(state, usedGirl) < api.girl.getFullHp(state, usedGirl) * 0.3
// }
let _isHp = (api: api, state, usedGirl, rate) => {
    return api.girl.getBodyHp(state, usedGirl) < api.girl.getFullHp(state, usedGirl) * rate
}


let _computeHpFactor = (api: api, state, usedGirl, [veryLowHpFactor, lowHpFactor, middleHpFactor, otherHpFactor]) => {
    if (_isHp(api, state, usedGirl, 0.1)) {
        return veryLowHpFactor
    }
    else if (_isHp(api, state, usedGirl, 0.3)) {
        return lowHpFactor
    }
    else if (_isHp(api, state, usedGirl, 0.6)) {
        return middleHpFactor
    }

    return otherHpFactor
}

let _hasManyArmyNear = ([milltaryBuildingCount, soldierCount, milltaryVehicleCount, eliteGiantessCount], baseCount = 5) => {
    return milltaryBuildingCount > baseCount ||
        soldierCount > baseCount * 4 || milltaryVehicleCount > baseCount * 2
        || eliteGiantessCount > baseCount
}

let _computeArmyFactor = (api: api, state, [lowFactor, middleFactor, manyFactor], camp_ = camp.None) => {
    let data = api.getAllAliveArmyData(state, camp_)

    let milltaryBuildingCount = api.getVeryNearestTargetCount(state, data, targetType.MilltaryBuilding)
    let soldierCount = api.getVeryNearestTargetCount(state, data, targetType.Soldier)
    let milltaryVehicleCount = api.getVeryNearestTargetCount(state, data, targetType.MilltaryVehicle)
    let eliteGiantessCount = api.getVeryNearestTargetCount(state, data, targetType.EliteGiantess)


    if (_hasManyArmyNear([milltaryBuildingCount, soldierCount, milltaryVehicleCount, eliteGiantessCount], 6)) {
        return manyFactor
    }
    else if (_hasManyArmyNear([milltaryBuildingCount, soldierCount, milltaryVehicleCount, eliteGiantessCount], 3)) {
        return middleFactor
    }

    return lowFactor
}

// let _judgeRate = (api, state, judgeFunc) => {
//     if (api.isGiantessControlled(state)) {
//         return true
//     }

//     return judgeFunc(api, state)
// }

let _getRestRateFactor = (api: api, state: state, usedGirl) => {
    if (api.isPlayerGiantess(state, usedGirl)) {
        return 2
    }

    switch (api.getAutoDifficulty(state)) {
        case autoDifficulty.VeryEasy:
            return 3
        case autoDifficulty.Easy:
            return 2
        case autoDifficulty.Middle:
            return 1
        default:
            return 0
    }
}

let _isSelectBiggerAction = (api: api, state: state, usedGirl, personality_) => {
    switch (api.getSelectActionPrior(state, usedGirl)) {
        case actionPrior.Bigger:
            return true
        case actionPrior.None:
            let rate
            let baseFactor, armyFactor, hpFactor, scaleFactor, limitFactor

            if (api.isGiantessNotActiveBigger(state, usedGirl)) {
                // rate = 1 / 4
                rate = 1 / 6
            }
            else {
                // rate = 1 / 32
                // rate = 1 / 20
                // rate = 1 / 30
                rate = 0
            }

            if (
                !api.isPlayerGiantess(state, usedGirl)
                && (
                    api.getAutoDifficulty(state) <= autoDifficulty.Easy
                    && api.getBiggerCount(state, usedGirl) >= api.getAutoDifficulty(state) + 1
                )
            ) {
                limitFactor = 0
            }
            else {
                limitFactor = 1
            }

            if (api.isGiantessNotActiveBigger(state, usedGirl)) {
                scaleFactor = 1
            }
            else {
                scaleFactor = 1 / (api.getBiggerCount(state, usedGirl) * 2)
            }

            hpFactor = _computeHpFactor(api, state, usedGirl, [1 / 2, 1 / 4, 1 / 8, 1 / 30])
            armyFactor = _computeArmyFactor(api, state, [1 / 30, 1 / 8, 1 / 4])

            switch (personality_) {
                case personality.Strategic:
                    baseFactor = 1

                    // hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 2, 1 / 4, 1 / 8, 1 / 30])
                    // armyFactor = _computeArmyFactor(api, state, [1 / 30, 1 / 8, 1 / 4])
                    break
                case personality.Defensive:
                    baseFactor = 1.5

                    // hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 2, 1 / 4, 1 / 8, 1 / 30])
                    // armyFactor = _computeArmyFactor(api, state, [1 / 30, 1 / 8, 1 / 4])
                    break
                case personality.Aggressive:
                    baseFactor = 2

                    // hpFactor = 1 / 2.5
                    // armyFactor = 0
                    // hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 2, 1 / 10, 1 / 50, 1 / 100])
                    // armyFactor = _computeArmyFactor(api, state, [1 / 30, 1 / 6, 1 / 2])
                    // hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 2, 1 / 3, 1 / 8, 1 / 30])
                    hpFactor = _computeHpFactor(api, state, usedGirl, [1 / 2, 1 / 3, 1 / 6, 1 / 30])
                    break
                case personality.Playful:
                    baseFactor = 0.5

                    // hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 4, 1 / 10, 1 / 50, 1 / 100])
                    // armyFactor = _computeArmyFactor(api, state, [1 / 60, 1 / 16, 1 / 8])
                    // armyFactor = _computeArmyFactor(api, state, [1 / 30, 1 / 10, 1 / 6])
                    armyFactor = _computeArmyFactor(api, state, [1 / 30, 1 / 10, 1 / 15])
                    break
            }



            // Console.log(
            //     api.getVeryNearestTargetCount(state, targetType.Soldier), api.getVeryNearestTargetCount(state, targetType.MilltaryVehicle)
            // )
            // return api.isRandomRate((hpFactor + armyFactor) * scaleFactor * api.getSettingFactorAffectBiggerRate(state))
            return api.isRandomRate((rate + hpFactor + armyFactor) * scaleFactor * api.getSettingFactorAffectBiggerRate(state)
                * limitFactor
                * baseFactor
                * 1 / 4
            )
        default:
            return false
    }
}

let _isInGirlSitRubAttackRange = (api: api, state, usedGirl) => {
    return api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.SitRubRange, api.NullableUtils.getEmpty())
}

let _isInGirlSitAttackRange = (api: api, state, usedGirl) => {
    return api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.SitRange, api.NullableUtils.getEmpty())
}


let _isCanTightenLegAttack = (api: api, state: state, usedGirl) => {
    // if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.SitRange)) {
    //     return false
    // }

    // if (api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.SitRubRange)) {
    //     return true
    // }

    /*! some case may not hasTarget!
    why?
    * 
    */
    if (!api.hasTarget(state, usedGirl)) {
        return false
    }

    return api.isPointInTriangle(
        api.getTarget(state, usedGirl).getPositionFunc(state),
        api.getCollisionPartCenter(state, usedGirl, collisionPart.TrigoneAndButt),
        api.getCollisionPartCenter(state, usedGirl, collisionPart.LeftFoot),
        api.getCollisionPartCenter(state, usedGirl, collisionPart.RightFoot),
    )
}

let _isCanSitAttack = (api: api, state: state, usedGirl) => {
    if (_isInGirlSitRubAttackRange(api, state, usedGirl)) {
        return true
    }

    return _isCanTightenLegAttack(api, state, usedGirl)
}

let _handleStandToSit = (api: api, state: state, usedGirl) => {
    // if (_isInGirlSitRubAttackRange(api, state)) {
    //     // return state
    //     return api.lookatTarget(state, (state, lookatQuaternion) => {
    //         return api.TransformUtils.rotateOnWorldAxis(
    //             lookatQuaternion, Math.PI / 2, api.vector3.create(0, 1, 0)
    //         )
    //     })
    // }

    // return api.lookatTarget(state, (state, lookatQuaternion)=>lookatQuaternion, usedGirl)
    return api.lookatTarget(state, (state, lookatQuaternion) => {
        return api.TransformUtils.rotateOnWorldAxis(
            lookatQuaternion, Math.PI, api.vector3.create(0, 1, 0)
        )
    }, usedGirl)
}

let _isUBPoseJudgeByAnimation = (api: api, state: state, usedGirl) => {
    return [
        api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getKeepUBBlockName()).getForceAnimationName(),
        api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getPickToUBBlockName()).getForceAnimationName(),
    ].includes(
        api.girl.getCurrentAnimationName(state, usedGirl)
    )
}

let _changePoseByPersonality = (api: api, state: state, usedGirl, personality_) => {
    // let rate = 1 / 4
    // let rate = 1 / 3
    let rate = 1 / 5
    let baseFactor, armyFactor, hpFactor, scaleFactor
    let firstLayerRateArr, switchPoseRate
    let maxChangePoseTime

    hpFactor = _computeHpFactor(api, state, usedGirl, [1 / 50, 1 / 12, 1 / 2, 1])
    armyFactor = _computeArmyFactor(api, state, [1 / 2, 1 / 6, 1 / 15])

    switch (api.getCurrentPose(state, usedGirl)) {
        case pose.Stand:
            let toCrawlRate, toSitRate
            switch (personality_) {
                case personality.Strategic:
                    switchPoseRate = 1
                    baseFactor = 1

                    toCrawlRate = 0.5
                    toSitRate = 0.5

                    // hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 50, 1 / 12, 1 / 2, 1])
                    // armyFactor = _computeArmyFactor(api, state, [1 / 2, 1 / 6, 1 / 15])
                    scaleFactor = api.NumberUtils.clamp(Math.sqrt(api.getGirlScale(state, usedGirl)) / 5, 1 / 3, 8)
                    break
                case personality.Defensive:
                    switchPoseRate = 0.4
                    baseFactor = 0.25

                    toCrawlRate = 0.4
                    toSitRate = 0.6

                    // scaleFactor = api.NumberUtils.clamp(Math.sqrt(api.getGirlScale(state, usedGirl)) / 5, 1 / 3, 8)
                    scaleFactor = api.NumberUtils.clamp(Math.sqrt(api.getGirlScale(state, usedGirl)) / 10, 1 / 3, 8)
                    break
                case personality.Aggressive:
                    switchPoseRate = 0.6
                    baseFactor = 0.5

                    toCrawlRate = 0.5
                    toSitRate = 0.5

                    // hpFactor = 1
                    // armyFactor = 0
                    hpFactor = _computeHpFactor(api, state, usedGirl, [1 / 50, 1 / 20, 1 / 3, 1])
                    scaleFactor = api.NumberUtils.clamp(Math.sqrt(api.getGirlScale(state, usedGirl)) / 10, 1 / 3, 8)
                    break
                case personality.Playful:
                    switchPoseRate = 1.5
                    baseFactor = 2

                    toCrawlRate = 0.6
                    toSitRate = 0.4

                    // hpFactor = 1
                    // armyFactor = 0
                    armyFactor = _computeArmyFactor(api, state, [1 / 5, 1 / 3, 1 / 2])
                    scaleFactor = api.NumberUtils.clamp(Math.sqrt(api.getGirlScale(state, usedGirl)) / 3, 1 / 3, 8)
                    break
            }

            if (api.isRandomRate(rate * switchPoseRate)) {
                let index = api.selectOneIndexByWeight(api, [toCrawlRate, toSitRate])
                // if (true) {
                //     let index = 1
                switch (index) {
                    case 0:
                        if (api.isRandomRate(baseFactor * (armyFactor + hpFactor) * scaleFactor)) {
                            return actionName.StandToCrawl
                        }
                        break
                    case 1:
                        if (_isInGirlSitAttackRange(api, state, usedGirl) && api.isRandomRate(baseFactor * (armyFactor + hpFactor) * scaleFactor)) {
                            // if (_isInGirlSitAttackRange(api, state)) {
                            state = _handleStandToSit(api, state, usedGirl)

                            return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getStandToSitBlockName()).getActionName()
                        }
                        break
                }
            }

            return actionName.None

        case pose.Crawl:
            hpFactor = _computeHpFactor(api, state, usedGirl, [2, 1 / 2, 1 / 5, 1 / 50])
            armyFactor = _computeArmyFactor(api, state, [1 / 10, 1 / 6, 1 / 2])

            switch (personality_) {
                case personality.Strategic:
                    maxChangePoseTime = 30000

                    switchPoseRate = 1
                    baseFactor = 1


                    scaleFactor = api.NumberUtils.clamp(5 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 8, 3)
                    break
                case personality.Defensive:
                    maxChangePoseTime = 22000

                    switchPoseRate = 1.5
                    baseFactor = 3

                    scaleFactor = api.NumberUtils.clamp(10 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 8, 3)
                    break
                case personality.Aggressive:
                    maxChangePoseTime = 25000

                    switchPoseRate = 1.2
                    baseFactor = 2

                    hpFactor = _computeHpFactor(api, state, usedGirl, [4, 1, 1 / 5, 1 / 50])
                    scaleFactor = api.NumberUtils.clamp(10 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 8, 3)
                    break
                case personality.Playful:
                    maxChangePoseTime = 50000

                    switchPoseRate = 0.7
                    baseFactor = 0.5

                    armyFactor = _computeArmyFactor(api, state, [1 / 2, 1 / 6, 1 / 10])
                    scaleFactor = api.NumberUtils.clamp(3 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 8, 3)
                    break
            }

            if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) > maxChangePoseTime * api.girl.computeAnimatonDurationFactor(state, usedGirl)) {
                return actionName.CrawlToStand
            }

            if (api.isRandomRate(rate * switchPoseRate)) {
                if (api.isRandomRate(baseFactor * (armyFactor + hpFactor) * scaleFactor)) {
                    return actionName.CrawlToStand
                }
            }

            return actionName.None

        case pose.Sit:
            hpFactor = _computeHpFactor(api, state, usedGirl, [2, 1 / 2, 1 / 5, 1 / 50])
            armyFactor = _computeArmyFactor(api, state, [1 / 10, 1 / 6, 1 / 2])

            switch (personality_) {
                case personality.Strategic:
                    maxChangePoseTime = 30000

                    switchPoseRate = 1
                    baseFactor = 1


                    scaleFactor = api.NumberUtils.clamp(5 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 8, 3)
                    break
                case personality.Defensive:
                    maxChangePoseTime = 22000

                    switchPoseRate = 1.5
                    baseFactor = 3

                    scaleFactor = api.NumberUtils.clamp(10 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 8, 3)
                    break
                case personality.Aggressive:
                    maxChangePoseTime = 30000

                    switchPoseRate = 1.2
                    baseFactor = 2

                    hpFactor = _computeHpFactor(api, state, usedGirl, [4, 1, 1 / 5, 1 / 50])
                    scaleFactor = api.NumberUtils.clamp(10 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 8, 3)
                    break
                case personality.Playful:
                    maxChangePoseTime = 40000

                    switchPoseRate = 0.7
                    baseFactor = 0.5

                    armyFactor = _computeArmyFactor(api, state, [1 / 2, 1 / 6, 1 / 10])
                    scaleFactor = api.NumberUtils.clamp(3 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 8, 3)
                    break
            }

            if (
                api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) > maxChangePoseTime * api.girl.computeAnimatonDurationFactor(state, usedGirl)
                || !_isCanSitAttack(api, state, usedGirl)
            ) {
                return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getSitToStandBlockName()).getActionName()
            }

            if (api.isRandomRate(rate * switchPoseRate)) {
                if (api.isRandomRate(baseFactor * (armyFactor + hpFactor) * scaleFactor)) {
                    return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getSitToStandBlockName()).getActionName()

                }
            }

            return actionName.None

        case pose.Pick:
            let firstLayerRateArr2, switchUBPoseRate
            switch (personality_) {
                case personality.Strategic:
                    switchPoseRate = 1
                    firstLayerRateArr = [1 / 15, 1]

                    switchUBPoseRate = 1
                    firstLayerRateArr2 = [1]

                    maxChangePoseTime = 20000
                    break
                case personality.Defensive:
                    switchPoseRate = 0.5
                    firstLayerRateArr = [1 / 20, 0.5]

                    switchUBPoseRate = 2
                    firstLayerRateArr2 = [1]

                    maxChangePoseTime = 15000
                    break
                case personality.Aggressive:
                    switchPoseRate = 0.7
                    firstLayerRateArr = [1 / 30, 1]

                    switchUBPoseRate = 1.5
                    firstLayerRateArr2 = [1]

                    maxChangePoseTime = 17000
                    break
                case personality.Playful:
                    switchPoseRate = 1.3
                    firstLayerRateArr = [1 / 15, 2]

                    switchUBPoseRate = 0.5
                    firstLayerRateArr2 = [1]

                    maxChangePoseTime = 40000
                    break
            }

            if (_isUBPoseJudgeByAnimation(api, state, usedGirl)) {
                if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) > maxChangePoseTime * api.girl.computeAnimatonDurationFactor(state, usedGirl)) {
                    return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getUBToPickBlockName()).getForceAnimationName()
                }

                if (api.isRandomRate(rate * switchUBPoseRate)) {
                    return api.selectOneByWeight(api, [
                        api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getUBToPickBlockName()).getForceAnimationName(),
                    ],
                        firstLayerRateArr2,
                    )
                }

                return actionName.None
            }
            else {
                if (api.isRandomRate(rate * switchPoseRate)) {
                    return api.selectOneByWeight(api, [
                        actionName.Pickdown,
                        api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getPickToUBBlockName()).getForceAnimationName(),
                    ],
                        firstLayerRateArr,
                    )
                }

                return actionName.None
            }
    }
}

let _getTargetStateMachine = (api: api, state, usedGirl) => {
    let targetData = api.NullableUtils.getExn(api.getTarget(state, usedGirl))

    return targetData.getStateMachineFunc(state, targetData.name)
}

let _getValidAttackActionsForControlledTarget = (api: api, state, usedGirl, personality_, targetStateMachine) => {
    let firstLayerRateArr

    switch (api.getCurrentPose(state, usedGirl)) {
        case pose.Stand:
            if (api.isUBControlledState(targetStateMachine)) {
                switch (personality_) {
                    case personality.Strategic:
                        firstLayerRateArr = [
                            2, 1
                        ]
                        break
                    case personality.Defensive:
                        firstLayerRateArr = [
                            2, 1.5
                        ]
                        break
                    case personality.Aggressive:
                        firstLayerRateArr = [
                            3, 1
                        ]
                        break
                    case personality.Playful:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                }

                return api.selectOneByWeight(api, [
                    attackAction.JumpStomp,
                    attackAction.FreeUB
                ],
                    firstLayerRateArr,
                )
            }

            if (api.isBreastControlledState(targetStateMachine)) {
                switch (personality_) {
                    case personality.Strategic:
                        firstLayerRateArr = [
                            1, 2, 1
                        ]
                        break
                    case personality.Defensive:
                        firstLayerRateArr = [
                            0.5, 2, 1.5
                        ]
                        break
                    case personality.Aggressive:
                        firstLayerRateArr = [
                            1, 3, 1
                        ]
                        break
                    case personality.Playful:
                        firstLayerRateArr = [
                            1.5, 1, 1
                        ]
                        break
                }
                return api.selectOneByWeight(api, [
                    attackAction.SprayMilk,
                    attackAction.JumpStomp,
                    attackAction.FreeBreast
                ],
                    firstLayerRateArr,
                )
            }

            if (api.isShoeControlledState(targetStateMachine)) {
                switch (personality_) {
                    case personality.Strategic:
                        firstLayerRateArr = [
                            1, 1, 1, 1, 1
                        ]
                        break
                    case personality.Defensive:
                        firstLayerRateArr = [
                            1, 1, 1, 1, 1.5
                        ]
                        break
                    case personality.Aggressive:
                        firstLayerRateArr = [
                            1, 2, 2, 1.5, 1
                        ]
                        break
                    case personality.Playful:
                        firstLayerRateArr = [
                            1, 2, 0.5, 0.5, 1
                        ]
                        break
                }
                return api.selectOneByWeight(api, [
                    attackAction.Stomp,
                    attackAction.StompRub,
                    attackAction.LeftStomp,
                    attackAction.JumpStomp,
                    attackAction.FreeShoe
                ],
                    firstLayerRateArr,
                )
            }

            return api.NullableUtils.getEmpty()

        case pose.Crawl:
            if (api.isUBControlledState(targetStateMachine)) {
                switch (personality_) {
                    case personality.Strategic:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                    case personality.Defensive:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                    case personality.Aggressive:
                        firstLayerRateArr = [
                            2, 1
                        ]
                        break
                    case personality.Playful:
                        firstLayerRateArr = [
                            3, 1
                        ]
                        break
                }

                return api.selectOneByWeight(api, [
                    // attackAction.Rest,
                    attackAction.None,
                    attackAction.FreeUB
                ],
                    firstLayerRateArr,
                )
            }

            if (api.isBreastControlledState(targetStateMachine)) {
                switch (personality_) {
                    case personality.Strategic:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                    case personality.Defensive:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                    case personality.Aggressive:
                        firstLayerRateArr = [
                            1, 2
                        ]
                        break
                    case personality.Playful:
                        firstLayerRateArr = [
                            1, 3
                        ]
                        break
                }
                return api.selectOneByWeight(api, [
                    attackAction.BreastPress,
                    attackAction.BreastPressRub,
                    // attackAction.Rest,
                ],
                    firstLayerRateArr,
                )
            }

            if (api.isShoeControlledState(targetStateMachine)) {
                switch (personality_) {
                    case personality.Strategic:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                    case personality.Defensive:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                    case personality.Aggressive:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                    case personality.Playful:
                        firstLayerRateArr = [
                            1, 2
                        ]
                        break
                }
                return api.selectOneByWeight(api, [
                    attackAction.BreastPress,
                    attackAction.BreastPressRub,
                ],
                    firstLayerRateArr,
                )
            }

            return api.NullableUtils.getEmpty()

        case pose.Sit:
            if (api.isUBControlledState(targetStateMachine)) {
                switch (personality_) {
                    case personality.Strategic:
                        firstLayerRateArr = [
                            1, 1, 1
                        ]
                        break
                    case personality.Defensive:
                        firstLayerRateArr = [
                            1, 1, 1.5
                        ]
                        break
                    case personality.Aggressive:
                        firstLayerRateArr = [
                            1, 2, 0.5
                        ]
                        break
                    case personality.Playful:
                        firstLayerRateArr = [
                            3, 1, 1
                        ]
                        break
                }

                return api.selectOneByWeight(api, [
                    attackAction.SitRub,
                    attackAction.TightenLeg,
                    attackAction.FreeUB
                ],
                    firstLayerRateArr,
                )
            }

            if (api.isBreastControlledState(targetStateMachine)) {
                switch (personality_) {
                    case personality.Strategic:
                        firstLayerRateArr = [
                            1
                        ]
                        break
                    case personality.Defensive:
                        firstLayerRateArr = [
                            1
                        ]
                        break
                    case personality.Aggressive:
                        firstLayerRateArr = [
                            1
                        ]
                        break
                    case personality.Playful:
                        firstLayerRateArr = [
                            1
                        ]
                        break
                }
                return api.selectOneByWeight(api, [
                    attackAction.None,
                ],
                    firstLayerRateArr,
                )
            }

            if (api.isShoeControlledState(targetStateMachine)) {
                switch (personality_) {
                    case personality.Strategic:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                    case personality.Defensive:
                        firstLayerRateArr = [
                            1, 1
                        ]
                        break
                    case personality.Aggressive:
                        firstLayerRateArr = [
                            1, 2
                        ]
                        break
                    case personality.Playful:
                        firstLayerRateArr = [
                            2, 1
                        ]
                        break
                }
                return api.selectOneByWeight(api, [
                    attackAction.SitRub,
                    attackAction.TightenLeg,
                ],
                    firstLayerRateArr,
                )
            }

            return api.NullableUtils.getEmpty()

        case pose.Pick:
            if (api.isUBControlledState(targetStateMachine)) {
                if (_isUBPoseJudgeByAnimation(api, state, usedGirl)) {
                    switch (personality_) {
                        case personality.Strategic:
                            firstLayerRateArr = [
                                1, 1, 1
                            ]
                            break
                        case personality.Defensive:
                            firstLayerRateArr = [
                                1, 1, 1.5
                            ]
                            break
                        case personality.Aggressive:
                            firstLayerRateArr = [
                                1, 2, 0.5
                            ]
                            break
                        case personality.Playful:
                            firstLayerRateArr = [
                                3, 1, 1
                            ]
                            break
                    }

                    return api.selectOneByWeight(api, [
                        attackAction.Thrust,
                        attackAction.Insert,
                        attackAction.FreeUB
                    ],
                        firstLayerRateArr,
                    )
                }

                return attackAction.None
            }

            if (api.isBreastControlledState(targetStateMachine)) {
                return attackAction.None
            }

            if (api.isShoeControlledState(targetStateMachine)) {
                return attackAction.None
            }

            return api.NullableUtils.getEmpty()
        default:
            throw new Error("error")
    }
}


let _selectAttackActionByPersonality = (api: api, state: state, usedGirl, personality_) => {
    let firstLayerRateArr, secondLayerRateArr
    let armyFactor, hpFactor

    let restRate
    switch (personality_) {
        case personality.Strategic:
            restRate = 0.1
            break
        case personality.Defensive:
            restRate = 0.05
            break
        case personality.Aggressive:
            restRate = 0.025
            break
        case personality.Playful:
            restRate = 0.15
            break
        default:
            throw new Error("error")
    }
    if (api.isRandomRate(restRate * _getRestRateFactor(api, state, usedGirl))) {
        return attackAction.Rest
    }

    if (!api.hasTarget(state, usedGirl)) {
        return attackAction.None
    }

    let targetStateMachine = _getTargetStateMachine(api, state, usedGirl)

    let result = _getValidAttackActionsForControlledTarget(api, state, usedGirl, personality_, targetStateMachine)
    if (!api.NullableUtils.isNullable(result)) {
        return api.NullableUtils.getExn(result)
    }




    switch (api.getCurrentPose(state, usedGirl)) {
        case pose.Stand:
            hpFactor = _computeHpFactor(api, state, usedGirl, [2, 1.6, 1.2, 1])
            armyFactor = _computeArmyFactor(api, state, [1, 1.5, 2])

            let hasUBObjectData = api.getUBObjectData(state, usedGirl).size > 0
            let hasBreastObjectData = api.getPutToBreastObjectData(state, usedGirl).size > 0
            let hasShoeObjectData = api.getPutToShoeObjectData(state, usedGirl).size > 0

            switch (personality_) {
                case personality.Strategic:
                    // if (api.isBuildingTarget(state, usedGirl)) {
                    //     return attackAction.Stomp
                    // }

                    // if (api.isRandomRate(_computeHpFactor(api, state, usedGirl,  [2 / 3, 1 / 2, 1 / 4, 0]))) {
                    if (api.isRandomRate(_computeHpFactor(api, state, usedGirl, [1 / 3, 1 / 5, 1 / 10, 0]))) {
                        return attackAction.Pickup
                    }

                    if (api.isRandomRate(0.05 * _computeArmyFactor(api, state, [0, 1, 2], api.girl.getGiantessCamp(state, usedGirl)))) {
                        return attackAction.SprayMilk
                    }

                    if (hasUBObjectData
                        && api.isRandomRate(0.03)
                    ) {
                        return attackAction.FreeUB
                    }
                    if (hasBreastObjectData
                        && api.isRandomRate(0.03)
                    ) {
                        return attackAction.FreeBreast
                    }
                    if (hasShoeObjectData
                        && api.isRandomRate(0.03)
                    ) {
                        return attackAction.FreeShoe
                    }



                    // if (_isHp(api, state, usedGirl, 0.1)) {
                    //     return attackAction.Eat
                    // }

                    // if (api.isRandomRate(3 / 5)) {
                    // if (api.isRandomRate(4 / 5)) {
                    //     if (api.isRandomRate(1 / 3)) {
                    //         return attackAction.StompRub
                    //     }

                    //     if (api.isRandomRate(1 / 3)) {
                    //         return attackAction.LeftStomp
                    //     }

                    //     return attackAction.Stomp
                    // }

                    // return attackAction.Pickup
                    firstLayerRateArr = [4 / 5, 1 / 5]
                    secondLayerRateArr = [
                        [
                            1, 1 * armyFactor * hpFactor, 1 * armyFactor * hpFactor, 1
                        ],
                        [1]
                    ]
                    break
                case personality.Defensive:
                    if (api.isRandomRate(_computeHpFactor(api, state, usedGirl, [1 / 2, 1 / 4, 1 / 8, 0]))) {
                        return attackAction.Pickup
                    }

                    if (hasUBObjectData
                        && api.isRandomRate(0.03)
                    ) {
                        return attackAction.FreeUB
                    }
                    if (hasBreastObjectData
                        && api.isRandomRate(0.03)
                    ) {
                        return attackAction.FreeBreast
                    }
                    if (hasShoeObjectData
                        && api.isRandomRate(0.03)
                    ) {
                        return attackAction.FreeShoe
                    }

                    firstLayerRateArr = [4 / 5, 1 / 5]
                    secondLayerRateArr = [
                        [
                            1, 1 * hpFactor, 1 * hpFactor, 1
                        ],
                        [1]
                    ]
                    break
                case personality.Aggressive:
                    firstLayerRateArr = [6 / 7, 1 / 7]
                    secondLayerRateArr = [
                        [
                            2, 2 * armyFactor, 3 * armyFactor, 1
                        ],
                        [1]
                    ]
                    break
                case personality.Playful:
                    if (api.isRandomRate(0.07 * _computeArmyFactor(api, state, [0, 1, 2]))) {
                        return attackAction.SprayMilk
                    }

                    if (hasUBObjectData
                        && api.isRandomRate(0.02)
                    ) {
                        return attackAction.FreeUB
                    }
                    if (hasBreastObjectData
                        && api.isRandomRate(0.02)
                    ) {
                        return attackAction.FreeBreast
                    }
                    if (hasShoeObjectData
                        && api.isRandomRate(0.04)
                    ) {
                        return attackAction.FreeShoe
                    }



                    firstLayerRateArr = [2 / 5, 3 / 5]
                    secondLayerRateArr = [
                        [
                            4, 2, 1, 2
                        ],
                        [1]
                    ]
                    break
            }

            return api.selectOneByTwoLayerWeights(api, [
                [
                    attackAction.StompRub,
                    attackAction.LeftStomp,
                    attackAction.JumpStomp,
                    attackAction.Stomp
                ],
                [
                    attackAction.Pickup
                ]
            ],
                firstLayerRateArr,
                secondLayerRateArr
            )
        case pose.Crawl:
            switch (personality_) {
                case personality.Strategic:
                    firstLayerRateArr = [
                        1, 1, 1, 1
                    ]
                    break
                case personality.Defensive:
                    firstLayerRateArr = [
                        1, 1, 0.5, 2
                    ]
                    break
                case personality.Aggressive:
                    firstLayerRateArr = [
                        // 1, 2, 0.5, 2
                        1, 1.5, 0.5, 2
                    ]
                    break
                case personality.Playful:
                    firstLayerRateArr = [
                        1, 2.5, 2, 1.5
                    ]
                    break
            }

            return api.selectOneByWeight(api, [
                attackAction.BreastPress,
                attackAction.BreastPressRub,
                attackAction.CrawlLick,
                attackAction.CrawlBeat,
            ],
                firstLayerRateArr,
            )

        case pose.Sit:
            switch (personality_) {
                case personality.Strategic:
                    firstLayerRateArr = [
                        1, 1
                    ]
                    break
                case personality.Defensive:
                    firstLayerRateArr = [
                        1, 1.5
                    ]
                    break
                case personality.Aggressive:
                    firstLayerRateArr = [
                        1, 2
                    ]
                    break
                case personality.Playful:
                    firstLayerRateArr = [
                        2, 1
                    ]
                    break
            }

            return api.selectOneByWeight(api, [
                attackAction.SitRub,
                attackAction.TightenLeg,
            ],
                firstLayerRateArr,
            )

        case pose.Pick:
            let firstLayerRateArr2, isEat
            switch (personality_) {
                case personality.Strategic:
                    // if (_isHp(api, state, usedGirl, 0.1)) {
                    //     return attackAction.Eat
                    // }
                    isEat = _isHp(api, state, usedGirl, 0.1)

                    firstLayerRateArr = [
                        // 3 / 4, 1 / 4
                        3, 1, 0.3, 0.3
                    ]
                    firstLayerRateArr2 = [
                        3, 1
                    ]
                    break
                case personality.Defensive:
                    // if (_isHp(api, state, usedGirl, 0.2)) {
                    //     return attackAction.Eat
                    // }
                    isEat = _isHp(api, state, usedGirl, 0.2)

                    firstLayerRateArr = [
                        // 3 / 4, 1 / 4
                        3, 1, 0.3, 0.3
                    ]
                    firstLayerRateArr2 = [
                        3, 0.5
                    ]
                    break
                case personality.Aggressive:
                    isEat = false

                    firstLayerRateArr = [
                        3, 3, 0.3, 0.3
                    ]
                    firstLayerRateArr2 = [
                        3, 2
                    ]
                    break
                case personality.Playful:
                    isEat = false

                    firstLayerRateArr = [
                        6, 1, 1, 1
                    ]
                    firstLayerRateArr2 = [
                        6, 1
                    ]
                    break
            }

            if (_isUBPoseJudgeByAnimation(api, state, usedGirl)) {
                return api.selectOneByWeight(api, [
                    attackAction.Thrust,
                    attackAction.Insert,
                ],
                    firstLayerRateArr2,
                )
            }

            if (isEat) {
                return attackAction.Eat
            }

            return api.selectOneByWeight(api, [
                attackAction.Pinch,
                attackAction.Eat,
                attackAction.PutToBreast,
                attackAction.PutToShoe,
            ],
                firstLayerRateArr,
            )
    }
}

// let _isTargetControlled = (api: api, state: state) => {
//     return api.NullableUtils.getWithDefault(
//         api.NullableUtils.map(
//             targetData => {
//                 return api.isControlledStateExceptStressing(state, targetData.getStateMachine(state, targetData.name))
//             }, api.getTarget(state, usedGirl)
//         ),
//         false
//     )
// }

let _isClearTargetByPersonality = (api: api, state: state, usedGirl, personality_) => {
    let rate = 1 / 3

    let baseFactor

    let maxTime

    let distanceFactor

    if (api.isMiddleDistanceFromGirl(state, api.getTarget(state, usedGirl).getPositionFunc(state))) {
        distanceFactor = 3
    }
    else if (!api.isNearGirl(state, api.getTarget(state, usedGirl).getPositionFunc(state))) {
        distanceFactor = 2
    }
    else {
        distanceFactor = 1
    }

    switch (personality_) {
        case personality.Strategic:
            baseFactor = 1
            maxTime = 4000
            break
        case personality.Defensive:
            baseFactor = 1
            maxTime = 5000
            break
        case personality.Aggressive:
            baseFactor = 0.6
            maxTime = 3000
            break
        case personality.Playful:
            baseFactor = 1.2
            maxTime = 8000
            break
    }

    if (api.getPassTimeFromNow(state, api.getLastSetTargetTime(state, usedGirl)) < maxTime * api.girl.computeAnimatonDurationFactor(state, usedGirl)) {
        return false
    }

    // if (_isTargetControlled(api, state)) {
    //     return true
    // }

    return api.isRandomRate(rate * baseFactor * distanceFactor)
}

export let getData = (api: api): behaviourTreeData<actionNode> => {
    return {
        conditionReturnFail: (state: state, usedGirl) => true,

        node: controlNode.Selector,
        children: [
            {
                name: "handleCase",
                conditionReturnFail: (state: state, usedGirl) => {
                    return true
                },
                // node: controlNode.Parrel,
                node: controlNode.Selector,
                children: [
                    {
                        name: "handleMoveCollision",
                        // conditionReturnSuccess: (state: state, usedGirl) => {
                        conditionReturnFail: (state: state, usedGirl) => {
                            return api.getNow(state) - api.getUsedGirlData(state, usedGirl).lastMoveCollisionedTime < 1000
                        },
                        // node: controlNode.Sequence,
                        node: controlNode.Selector,
                        children: [
                            // {
                            //     conditionReturnSuccess: (state: state, usedGirl) => {
                            //         return api.isRandomRate(1 / 4)
                            //     },
                            //     node: actionNode.ResetGiantessControllerBlockState,
                            //     children: []
                            // },
                            {
                                conditionReturnFail: (state: state, usedGirl) => api.isPose(state, pose.Stand) && api.hasTarget(state, usedGirl),
                                node: actionNode.Stomp,
                                children: []
                            },
                            {
                                name: "handleMoveCollisionForCrawl",
                                conditionReturnSuccess: (state: state, usedGirl) => {
                                    return api.isPose(state, pose.Crawl)
                                },
                                node: controlNode.Sequence,
                                children: [
                                    {
                                        conditionReturnSuccess: (state: state, usedGirl) => api.hasTarget(state, usedGirl),
                                        node: actionNode.BreastPress,
                                        children: []
                                    },
                                    {
                                        config: (state: state, usedGirl) => {
                                            switch (api.getCurrentPose(state, usedGirl)) {
                                                case pose.Crawl:
                                                    return actionName.CrawlToStand
                                                default:
                                                    return actionName.None
                                            }
                                        },
                                        conditionReturnSuccess: (state: state, usedGirl) => api.isRandomRate(1 / 2),
                                        node: actionNode.ChangePose,
                                        children: []
                                    },
                                ]
                            },
                        ]
                    },
                    // {
                    //     name: "handleHasTarget",
                    //     conditionReturnSuccess: (state: state, usedGirl) => {
                    //         return !api.hasPickData(state, usedGirl) && api.hasTarget(state, usedGirl)
                    //             && !api.isGiantessControlled(state)
                    //         // return api.hasTarget(state, usedGirl)
                    //     },
                    //     node: controlNode.Selector,
                    //     children: [
                    //         {
                    //             conditionReturnSuccess: (state: state, usedGirl) => api.isRandomRate(1 / 3),
                    //             node: actionNode.ClearTarget,
                    //             children: []
                    //         },
                    //     ]
                    // },
                    // {
                    //     // name: "handleHpLow",
                    //     name: "handleBigger",
                    //     conditionReturnSuccess: (state: state, usedGirl) => {
                    //         // return api.isGiantessNotActiveBigger(state, usedGirl)
                    //         return true
                    //     },
                    //     node: controlNode.Selector,
                    //     children: [
                    //         {
                    //             conditionReturnSuccess: (state: state, usedGirl) => {
                    //                 let hpFactor

                    //                 if (_isVeryLowHp(api, state)) {
                    //                     hpFactor = 1 / 3
                    //                 }
                    //                 else if (_isLowHp(api, state)) {
                    //                     hpFactor = 1 / 4
                    //                 }
                    //                 else {
                    //                     hpFactor = 0
                    //                 }
                    //                 let armyFactor
                    //                 if (_hasManyArmyNear(api, state, 3)) {
                    //                     armyFactor = 1 / 4
                    //                 }
                    //                 else {
                    //                     armyFactor = 0
                    //                 }
                    //                 let scaleFactor
                    //                 if (api.isGiantessNotActiveBigger(state, usedGirl)) {
                    //                     scaleFactor = 1
                    //                 }
                    //                 else {
                    //                     scaleFactor = 0.02
                    //                 }
                    //                 // Console.log(
                    //                 //     api.getVeryNearestTargetCount(state, targetType.Soldier), api.getVeryNearestTargetCount(state, targetType.MilltaryVehicle)
                    //                 // )
                    //                 return api.isRandomRate((hpFactor + armyFactor) * scaleFactor * api.getSettingFactorAffectBiggerRate(state))
                    //             },
                    //             node: actionNode.Bigger,
                    //             children: [
                    //             ]
                    //         },
                    //     ]
                    // },
                    // {
                    //     name: "MakeStandMorePriorForArmy",
                    //     conditionReturnSuccess: (state: state, usedGirl) => {
                    //         return api.isPose(state, pose.Crawl)
                    //     },
                    //     node: controlNode.Selector,
                    //     children: [
                    //         {
                    //             conditionReturnSuccess: (state: state, usedGirl) => {
                    //                 if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) < 10000) {
                    //                     return false
                    //                 }

                    //                 let factor
                    //                 if (_hasManyArmyNear(api, state)) {
                    //                     if (api.isGiantessNotActiveBigger(state, usedGirl)) {
                    //                         factor = 1 / 2
                    //                     }
                    //                     else {
                    //                         factor = 1 / 5
                    //                     }
                    //                 }
                    //                 else {
                    //                     factor = 0
                    //                 }

                    //                 return api.isRandomRate(factor)
                    //             },
                    //             node: actionNode.ChangePose,
                    //             children: []
                    //         },
                    //     ]
                    // },

                    // {
                    //     conditionReturnFail: (state: state, usedGirl) => {
                    //         if (api.getPassTimeFromNow(state, api.getLastHardTime(state)) < 60000) {
                    //             return false
                    //         }

                    //         // return api.isRandomRate(0.2)

                    //         if (_isHp(api, state, usedGirl, 0.5)) {
                    //             return api.isRandomRate(0.02)
                    //         }
                    //         if (_isHp(api, state, usedGirl, 0.2)) {
                    //             return api.isRandomRate(0.1)
                    //         }

                    //         return api.isRandomRate(0.005)
                    //     },
                    //     node: actionNode.Hard,
                    //     children: []
                    // },
                ]
            },
            {
                name: "fight",
                // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(3 / 4),
                conditionReturnFail: (state: state, usedGirl) => true,
                // node: controlNode.Selector,
                // node: controlNode.Sequence,
                node: controlNode.Parrel,
                children: [
                    {
                        // name: "selectTarget",
                        conditionReturnSuccess: (state: state, usedGirl) => {
                            // return !api.hasPickData(state, usedGirl) && !api.hasTarget(state, usedGirl)
                            return !api.hasTarget(state, usedGirl)
                        },
                        // node: controlNode.Selector,
                        node: actionNode.SelectTarget,
                        children: [
                            // {
                            //     conditionReturnFail: (state: state, usedGirl) => {
                            //         if (getSelectTargetPrior(state) == targetPrior.LittleMan) {
                            //             return true
                            //         }
                            //         return state.config.littleManConfig.isSelectLittleMan ? true : api.isRandomRate(1 / 4)
                            //     },
                            //     node: actionNode.SelectLittleMan,
                            //     children: []
                            // },
                            // {
                            //     conditionReturnFail: (state: state, usedGirl) => {
                            //         if (getSelectTargetPrior(state) == targetPrior.MilltaryVehicle) {
                            //             return true
                            //         }
                            //         let factor
                            //         if (
                            //             api.getVeryNearestTargetCount(state, targetType.MilltaryVehicle) > 4
                            //         ) {
                            //             factor = 2
                            //         }
                            //         else {
                            //             factor = 1
                            //         }
                            //         return api.isRandomRate(1 / 4 * factor)
                            //     },
                            //     node: actionNode.SelectNearestTank,
                            //     children: []
                            // },
                            // {
                            //     conditionReturnFail: (state: state, usedGirl) => {
                            //         if (getSelectTargetPrior(state) == targetPrior.Soldier) {
                            //             return true
                            //         }
                            //         let factor
                            //         if (api.getVeryNearestTargetCount(state, targetType.Soldier) > 8
                            //         ) {
                            //             factor = 2
                            //         }
                            //         else {
                            //             factor = 1
                            //         }
                            //         return api.isRandomRate(1 / 4 * factor)
                            //     },
                            //     node: actionNode.SelectNearestSoldier,
                            //     children: []
                            // },
                            // {
                            //     // conditionReturnFail: (state: state, usedGirl) => {
                            //     //     return true
                            //     // },
                            //     conditionReturnFail: (state: state, usedGirl) => {
                            //         if (getSelectTargetPrior(state) == targetPrior.Building) {
                            //             return true
                            //         }
                            //         return api.isRandomRate(1 / 2)
                            //     },
                            //     node: actionNode.SelectNearestBuilding,
                            //     children: []
                            // },
                            // {
                            //     // conditionReturnFail: (state: state, usedGirl) => {
                            //     //     return true
                            //     // },
                            //     // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 2),
                            //     // conditionReturnFail: (state: state, usedGirl) => true,
                            //     conditionReturnFail: (state: state, usedGirl) => {
                            //         if (getSelectTargetPrior(state) == targetPrior.Cityzen) {
                            //             return true
                            //         }
                            //         return api.isRandomRate(1 / 2)
                            //     },
                            //     node: actionNode.SelectNearestCityzen,
                            //     children: []
                            // },
                        ]
                    },
                    {
                        config: (state: state, usedGirl) => {
                            switch (api.getCurrentPose(state, usedGirl)) {
                                case pose.Stand:
                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.None:
                                            if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) < 20000 * api.girl.computeAnimatonDurationFactor(state, usedGirl)) {
                                                return actionName.None
                                            }

                                            return _changePoseByPersonality(api, state, usedGirl, api.getPersonality(state, usedGirl))
                                        case actionPrior.StandToCrawl:
                                        case actionPrior.BreastPress:
                                        case actionPrior.BreastPressRub:
                                        case actionPrior.CrawlLick:
                                        case actionPrior.CrawlBeat:
                                            return actionName.StandToCrawl
                                        case actionPrior.StandToSit:
                                        case actionPrior.SitRub:
                                        case actionPrior.TightenLeg:
                                            state = _handleStandToSit(api, state, usedGirl)

                                            return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getStandToSitBlockName()).getActionName()
                                        default:
                                            return actionName.None
                                    }
                                case pose.Crawl:
                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.None:
                                            if (api.isBuildingTarget(state, usedGirl) && !api.isMiddleGiantessOrBiggerByScale(api.getGirlScale(state, usedGirl))) {
                                                return actionName.CrawlToStand
                                            }

                                            if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) < 10000 * api.girl.computeAnimatonDurationFactor(state, usedGirl)) {
                                                // if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) < 15000) {
                                                return actionName.None
                                            }

                                            return _changePoseByPersonality(api, state, usedGirl, api.getPersonality(state, usedGirl))

                                        case actionPrior.StandToCrawl:
                                        case actionPrior.BreastPress:
                                        case actionPrior.BreastPressRub:
                                        case actionPrior.CrawlLick:
                                        case actionPrior.CrawlBeat:
                                            return actionName.None
                                        // case actionPrior.CrawlToStand:
                                        // case actionPrior.Stomp:
                                        // case actionPrior.LeftStomp:
                                        // case actionPrior.JumpStomp:
                                        // case actionPrior.StompRub:
                                        // case actionPrior.Eat:
                                        // case actionPrior.Pinch:
                                        // case actionPrior.PutToBreast:
                                        // case actionPrior.PutToShoe:
                                        //     return actionName.CrawlToStand
                                        default:
                                            return actionName.CrawlToStand
                                    }
                                case pose.Sit:
                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.None:
                                            // if (api.isBuildingTarget(state, usedGirl) && !api.isMiddleGiantessOrBiggerByScale(api.getGirlScale(state, usedGirl))) {
                                            //     return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getSitToStandBlockName()).getActionName()
                                            // }

                                            if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) < 7000 * api.girl.computeAnimatonDurationFactor(state, usedGirl)) {
                                                return actionName.None
                                            }

                                            return _changePoseByPersonality(api, state, usedGirl, api.getPersonality(state, usedGirl))
                                        case actionPrior.StandToSit:
                                        case actionPrior.SitRub:
                                        case actionPrior.TightenLeg:
                                            return actionName.None
                                        default:
                                            return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getSitToStandBlockName()).getActionName()
                                    }
                                case pose.Pick:
                                    if (api.getIsHit(state)) {
                                        return actionName.FallByQTE
                                    }

                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.None:
                                            if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) < 5000 * api.girl.computeAnimatonDurationFactor(state, usedGirl)) {
                                                return actionName.None
                                            }

                                            return _changePoseByPersonality(api, state, usedGirl, api.getPersonality(state, usedGirl))
                                    }

                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.Thrust:
                                        case actionPrior.Insert:
                                        case actionPrior.PickToUB:
                                            return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getPickToUBBlockName()).getForceAnimationName()
                                        default:
                                            if (_isUBPoseJudgeByAnimation(api, state, usedGirl)) {
                                                return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getUBToPickBlockName()).getForceAnimationName()
                                            }
                                            break
                                    }

                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.Eat:
                                        case actionPrior.Pinch:
                                        case actionPrior.PutToBreast:
                                        case actionPrior.PutToShoe:
                                            return actionName.None
                                        // case actionPrior.Thrust:
                                        // case actionPrior.Insert:
                                        // case actionPrior.PickToUB:
                                        //     return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getPickToUBBlockName()).getForceAnimationName()
                                        // case actionPrior.UBToPick:
                                        //     return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getUBToPickBlockName()).getForceAnimationName()
                                        case actionPrior.FreePick:
                                        case actionPrior.FreeBreast:
                                        case actionPrior.FreeShoe:
                                        default:
                                            // if (_isUBPoseJudgeByAnimation(api, state)) {
                                            //     return api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getUBToPickBlockName()).getForceAnimationName()
                                            // }

                                            // return actionName.Pickdown
                                            return actionName.Fall
                                    }
                                default:
                                    return actionName.None
                            }
                        },
                        conditionReturnSuccess: (state: state, usedGirl) => {
                            return api.hasTarget(state, usedGirl)
                        },
                        node: actionNode.ChangePose,
                        children: []
                    },
                    {
                        config: (state: state, usedGirl) => {
                            switch (api.getSelectActionPrior(state, usedGirl)) {
                                case actionPrior.Rest:
                                    return attackAction.Rest
                            }

                            if (_isSelectBiggerAction(api, state, usedGirl, api.getPersonality(state, usedGirl))) {
                                return attackAction.Bigger
                            }

                            switch (api.getCurrentPose(state, usedGirl)) {
                                case pose.Stand:
                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.None:
                                            return _selectAttackActionByPersonality(api, state, usedGirl, api.getPersonality(state, usedGirl))
                                        case actionPrior.Stomp:
                                            // return api.selectOneByWeight(api, [
                                            //     attackAction.StompRub,
                                            //     attackAction.LeftStomp,
                                            //     attackAction.JumpStomp,
                                            //     attackAction.Stomp,
                                            // ], [1, 1, 1, 1])
                                            return attackAction.Stomp
                                        case actionPrior.LeftStomp:
                                            return attackAction.LeftStomp
                                        case actionPrior.JumpStomp:
                                            return attackAction.JumpStomp
                                        case actionPrior.StompRub:
                                            return attackAction.StompRub
                                        case actionPrior.SprayMilk:
                                            return attackAction.SprayMilk
                                        // return attackAction.StompRub
                                        // return attackAction.FreeBreast
                                        // case actionPrior.Pinch:
                                        //     return attackAction.Pinch
                                        // case actionPrior.Eat:
                                        //     return attackAction.Eat
                                        case actionPrior.Pinch:
                                        case actionPrior.Eat:
                                        case actionPrior.PutToBreast:
                                        case actionPrior.PutToShoe:
                                        case actionPrior.PickToUB:
                                        case actionPrior.Thrust:
                                        case actionPrior.Insert:
                                            return attackAction.Pickup
                                        case actionPrior.FreeBreast:
                                            return attackAction.FreeBreast
                                        case actionPrior.FreeShoe:
                                            return attackAction.FreeShoe
                                        case actionPrior.FreeUB:
                                            return attackAction.FreeUB
                                        default:
                                            return attackAction.None
                                    }
                                case pose.Crawl:
                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.None:
                                            return _selectAttackActionByPersonality(api, state, usedGirl, api.getPersonality(state, usedGirl))
                                        case actionPrior.BreastPress:
                                            return attackAction.BreastPress
                                        case actionPrior.BreastPressRub:
                                            return attackAction.BreastPressRub
                                        case actionPrior.CrawlLick:
                                            return attackAction.CrawlLick
                                        case actionPrior.CrawlBeat:
                                            return attackAction.CrawlBeat
                                        default:
                                            return attackAction.None
                                    }

                                case pose.Sit:
                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.None:
                                            return _selectAttackActionByPersonality(api, state, usedGirl, api.getPersonality(state, usedGirl))
                                        case actionPrior.SitRub:
                                            return attackAction.SitRub
                                        case actionPrior.TightenLeg:
                                            return attackAction.TightenLeg
                                        default:
                                            return attackAction.None
                                    }

                                case pose.Pick:
                                    switch (api.getSelectActionPrior(state, usedGirl)) {
                                        case actionPrior.None:
                                            return _selectAttackActionByPersonality(api, state, usedGirl, api.getPersonality(state, usedGirl))
                                        case actionPrior.Pinch:
                                            return attackAction.Pinch
                                        // return attackAction.FreeUB
                                        // return attackAction.PutToShoe
                                        // return attackAction.Insert
                                        // return attackAction.Thrust
                                        case actionPrior.Eat:
                                            return attackAction.Eat
                                        // return attackAction.Insert
                                        // return attackAction.PutToBreast
                                        case actionPrior.PutToBreast:
                                            return attackAction.PutToBreast
                                        case actionPrior.PutToShoe:
                                            return attackAction.PutToShoe
                                        case actionPrior.Thrust:
                                            return attackAction.Thrust
                                        case actionPrior.Insert:
                                            return attackAction.Insert
                                        default:
                                            return attackAction.None
                                    }
                                default:
                                    return attackAction.None
                            }
                        },
                        conditionReturnSuccess: (state: state, usedGirl) => {
                            // return api.hasTarget(state, usedGirl)
                            return true
                        },
                        node: actionNode.SelectAttackAction,
                        children: []
                    },
                    {
                        name: "action",
                        conditionReturnSuccess: (state: state, usedGirl) => true,
                        node: controlNode.Selector,
                        children: [
                            {
                                conditionReturnFail: (state: state, usedGirl) => api.getAttackAction(state, usedGirl) == attackAction.Rest,
                                node: actionNode.Rest,
                                children: []
                            },
                            {
                                conditionReturnFail: (state: state, usedGirl) => api.getAttackAction(state, usedGirl) == attackAction.Bigger,
                                node: actionNode.Bigger,
                                children: []
                            },
                            {
                                name: "moveAndAttack",
                                conditionReturnSuccess: (state: state, usedGirl) => api.hasTarget(state, usedGirl),
                                node: controlNode.Sequence,
                                children: [
                                    {
                                        config: (state: state, usedGirl) => {
                                            // if (api.isRandomRate(1 / 3)) {
                                            //     return attackRange.Middle
                                            // }
                                            // if (api.isRandomRate(1 / 3)) {
                                            //     return attackRange.Small
                                            // }
                                            // return attackRange.Big
                                            // if (api.isRandomRate(1 / 2)) {
                                            //     return attackRange.Middle
                                            // }
                                            // return attackRange.Small

                                            // return api.ArrayUtils.randomShuffle(api.getAllAttackRanges())[0]

                                            // return api.getValidRandomAttackRangeForWalkToTarget(state)
                                            switch (api.getAttackAction(state, usedGirl)) {
                                                case attackAction.FreeUB:
                                                case attackAction.FreeBreast:
                                                case attackAction.FreeShoe:
                                                    return attackRange.InfinityRange
                                                case attackAction.BreastPress:
                                                case attackAction.BreastPressRub:
                                                    return attackRange.BreastPressRange
                                                case attackAction.CrawlLick:
                                                    return attackRange.CrawlLickRange
                                                case attackAction.CrawlBeat:
                                                    return attackRange.CrawlBeatRange
                                                case attackAction.Stomp:
                                                case attackAction.StompRub:
                                                case attackAction.LeftStomp:
                                                    return attackRange.PrecisionStompRange
                                                case attackAction.JumpStomp:
                                                    return attackRange.JumpStompRange
                                                case attackAction.SprayMilk:
                                                    return attackRange.SprayMilkRange
                                                case attackAction.Pickup:
                                                case attackAction.Pinch:
                                                case attackAction.Eat:
                                                case attackAction.Thrust:
                                                case attackAction.Insert:
                                                case attackAction.PutToBreast:
                                                case attackAction.PutToShoe:
                                                    return attackRange.PickRange
                                                case attackAction.SitRub:
                                                case attackAction.TightenLeg:
                                                    return attackRange.InfinityRange
                                                case attackAction.None:
                                                    return attackRange.InfinityRange
                                                default:
                                                    throw new Error("err")
                                            }
                                        },
                                        conditionReturnSuccess: (state: state, usedGirl) => {
                                            return !api.hasPickData(state, usedGirl)
                                        },
                                        conditionReturnFail: (state: state, usedGirl) => {
                                            // switch (api.getAttackAction(state, usedGirl)) {
                                            //     case attackAction.None:
                                            //         return false
                                            //     default:
                                            //         return true
                                            // }

                                            return api.hasTarget(state, usedGirl) && !api.isChangeScaling(state, usedGirl)
                                                && api.getAttackAction(state, usedGirl) != attackAction.None
                                        },
                                        node: actionNode.WalkToTarget,
                                        children: []
                                    },
                                    {
                                        name: "attack",
                                        conditionReturnSuccess: (state: state, usedGirl) => {
                                            // return api.hasPickData(state, usedGirl) || (api.hasTarget(state, usedGirl) && api.isInGirlAttackRange(state, usedGirl, api.getTarget(state, usedGirl).getPositionFunc(state), attackRange.Big, api.NullableUtils.getEmpty()))
                                            // return api.hasTarget(state, usedGirl) && api.isInGirlAttackRange(state, usedGirl, api.getTarget(state, usedGirl).getPositionFunc(state), attackRange.Big, api.NullableUtils.getEmpty())

                                            return api.hasTarget(state, usedGirl)
                                                && api.getAttackAction(state, usedGirl) != attackAction.None
                                        },
                                        node: controlNode.Selector,
                                        children: [
                                            // {
                                            //     name: "pickup_lowhp",
                                            //     conditionReturnFail: (state: state, usedGirl) => {
                                            //         if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.PickRange)) {
                                            //             return false
                                            //         }

                                            //         let hpFactor = _computeHpFactor(api, state, usedGirl,  [2 / 3, 1 / 2, 1 / 4, 0])

                                            //         return api.isRandomRate(hpFactor)
                                            //     },
                                            //     node: actionNode.Pickup,
                                            //     children: []
                                            // },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.BreastPressRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.BreastPress
                                                },
                                                node: actionNode.BreastPress,
                                                children: []
                                            },
                                            {
                                                config: (state: state, usedGirl) => {
                                                    return api.NumberUtils.getRandomInteger(1, 3)
                                                },
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.BreastPressRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.BreastPressRub
                                                },
                                                node: actionNode.BreastPressRub,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.CrawlLickRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.CrawlLick
                                                },
                                                node: actionNode.CrawlLick,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.CrawlBeatRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.CrawlBeat
                                                },
                                                node: actionNode.CrawlBeat,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (
                                                        api.getSelectActionPrior(state, usedGirl) != actionPrior.SitRub
                                                        && !_isInGirlSitRubAttackRange(api, state, usedGirl)
                                                    ) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.SitRub
                                                },
                                                node: actionNode.SitRub,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (
                                                        api.getSelectActionPrior(state, usedGirl) != actionPrior.TightenLeg
                                                        && !_isCanTightenLegAttack(api, state, usedGirl)
                                                    ) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.TightenLeg
                                                },
                                                node: actionNode.TightenLeg,
                                                children: []
                                            },
                                            {
                                                config: (state: state, usedGirl) => {
                                                    return api.NumberUtils.getRandomInteger(1, 3)
                                                },
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.RangeStompRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.StompRub
                                                },
                                                node: actionNode.StompRub,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.RangeStompRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.LeftStomp
                                                },
                                                node: actionNode.LeftStomp,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.RangeStompRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.JumpStomp
                                                },
                                                node: actionNode.JumpStomp,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.RangeStompRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.Stomp
                                                },
                                                node: actionNode.Stomp,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.SprayMilkRange)) {
                                                        return false
                                                    }

                                                    return api.getAttackAction(state, usedGirl) == attackAction.SprayMilk
                                                },
                                                node: actionNode.SprayMilk,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    return api.getAttackAction(state, usedGirl) == attackAction.FreeUB
                                                },
                                                node: actionNode.FreeUB,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    return api.getAttackAction(state, usedGirl) == attackAction.FreeBreast
                                                },
                                                node: actionNode.FreeBreast,
                                                children: []
                                            },
                                            {
                                                conditionReturnFail: (state: state, usedGirl) => {
                                                    return api.getAttackAction(state, usedGirl) == attackAction.FreeShoe
                                                },
                                                node: actionNode.FreeShoe,
                                                children: []
                                            },
                                            {
                                                name: "pick",
                                                // conditionReturnFail: (state: state, usedGirl) => {
                                                //     // return api.isRandomRate(1 / 2)
                                                //     return false
                                                // },
                                                conditionReturnSuccess: (state: state, usedGirl) => {
                                                    // if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.PickRange)) {
                                                    //     return false
                                                    // }

                                                    // return _judgeRate(api, state, (api, state) => true)
                                                    // return api.getAttackAction(state, usedGirl) == attackAction.Pickup
                                                    return true
                                                },
                                                node: controlNode.Selector,
                                                children: [
                                                    {
                                                        conditionReturnFail: (state: state, usedGirl) => {
                                                            if (!api.isInGirlAttackRangeWithTarget(api, state, usedGirl, attackRange.PickRange) || api.isControlled(state, api.getTarget(state, usedGirl).name)) {
                                                                return false
                                                            }

                                                            return api.getAttackAction(state, usedGirl) == attackAction.Pickup
                                                        },
                                                        node: actionNode.Pickup,
                                                        children: []
                                                    },
                                                    {
                                                        conditionReturnFail: (state: state, usedGirl) => {
                                                            return api.getAttackAction(state, usedGirl) == attackAction.Pinch
                                                        },
                                                        node: actionNode.Pinch,
                                                        children: []
                                                    },
                                                    {
                                                        conditionReturnFail: (state: state, usedGirl) => {
                                                            return api.getAttackAction(state, usedGirl) == attackAction.Eat
                                                        },
                                                        node: actionNode.Eat,
                                                        children: []
                                                    },

                                                    {
                                                        conditionReturnFail: (state: state, usedGirl) => {
                                                            return api.getAttackAction(state, usedGirl) == attackAction.PutToBreast
                                                        },
                                                        node: actionNode.PutToBreast,
                                                        children: []
                                                    },
                                                    {
                                                        conditionReturnFail: (state: state, usedGirl) => {
                                                            return api.getAttackAction(state, usedGirl) == attackAction.PutToShoe
                                                        },
                                                        node: actionNode.PutToShoe,
                                                        children: []
                                                    },

                                                    {
                                                        conditionReturnFail: (state: state, usedGirl) => {
                                                            return api.getAttackAction(state, usedGirl) == attackAction.Thrust
                                                        },
                                                        node: actionNode.Thrust,
                                                        children: []
                                                    },
                                                    {
                                                        conditionReturnSuccess: (state: state, usedGirl) => {
                                                            return api.getAttackAction(state, usedGirl) == attackAction.Insert
                                                        },
                                                        node: actionNode.Insert,
                                                        children: []
                                                    },
                                                ]
                                            },
                                        ]
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        name: "handleHasTarget",
                        conditionReturnSuccess: (state: state, usedGirl) => {
                            return !api.hasPickData(state, usedGirl) && api.hasTarget(state, usedGirl)
                                && (!api.isGiantessControlled(state, usedGirl) || api.isGiantessControlledTargetNone(state, usedGirl))
                            // return api.hasTarget(state, usedGirl)
                        },
                        node: controlNode.Selector,
                        children: [
                            {
                                conditionReturnSuccess: (state: state, usedGirl) => _isClearTargetByPersonality(api, state, usedGirl, api.getPersonality(state, usedGirl)),
                                node: actionNode.ClearTarget,
                                children: []
                            },
                        ]
                    },
                    // {
                    //     name: "handleHasTarget",
                    //     conditionReturnFail: (state: state, usedGirl) => {
                    //         return api.hasTarget(state, usedGirl)
                    //     },
                    //     node: controlNode.Selector,
                    //     children: [
                    //         {
                    //             conditionReturnFail: (state: state, usedGirl) => _judgeRate(api, state, (api, state) => api.isRandomRate(0.1 * _getRestRateFactor(api, state))),
                    //             node: actionNode.Rest,
                    //             children: []
                    //         },
                    //         {
                    //             conditionReturnSuccess: (state: state, usedGirl) => api.isRandomRate(1 / 3),
                    //             node: actionNode.ClearTarget,
                    //             children: []
                    //         },
                    //     ]
                    // },

                    // {
                    //     // name: "MakeStandMorePrior",
                    //     name: "Stand",
                    //     conditionReturnSuccess: (state: state, usedGirl) => {
                    //         return api.isPose(state, pose.Crawl)
                    //     },
                    //     node: controlNode.Selector,
                    //     children: [
                    //         {
                    //             conditionReturnSuccess: (state: state, usedGirl) => {
                    //                 return api.isRandomRate(1 / 3)
                    //             },
                    //             // conditionReturnSuccess: (state: state, usedGirl) => true,
                    //             node: actionNode.ChangePose,
                    //             children: []
                    //         },
                    //     ]
                    // },

                ]
            },
            // {
            //     name: "assistant",
            //     conditionReturnFail: (state: state, usedGirl) => api.hasTarget(state, usedGirl),
            //     // conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(5 / 6),
            //     // conditionReturnFail: (state: state, usedGirl) => true,
            //     node: controlNode.Selector,
            //     children: [
            //         {
            //             // conditionReturnFail: (state: state, usedGirl) => {
            //             conditionReturnSuccess: (state: state, usedGirl) => {
            //                 return _judgeRate(api, state, (api, state) => {
            //                     let rate
            //                     if (api.isGiantessNotActiveBigger(state, usedGirl)) {
            //                         // rate = 1 / 4
            //                         rate = 1 / 6
            //                     }
            //                     else {
            //                         // rate = 1 / 32
            //                         // rate = 1 / 20
            //                         // rate = 1 / 30
            //                         rate = 0
            //                     }
            //                     // return api.isRandomRate(rate * api.getSettingFactorAffectBiggerRate(state))

            //                     let hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 2, 1 / 4, 1 / 8, 1 / 30])
            //                     let armyFactor = _computeArmyFactor(api, state, [1 / 30, 1 / 8, 1 / 4])

            //                     let scaleFactor
            //                     if (api.isGiantessNotActiveBigger(state, usedGirl)) {
            //                         scaleFactor = 1
            //                     }
            //                     else {
            //                         // scaleFactor = 0.02
            //                         // scaleFactor = api.NumberUtils.clamp(1 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 30, 1 / 2)
            //                         scaleFactor = 1 / (api.getBiggerCount(state, usedGirl) * 2)

            //                     }


            //                     let limitFactor
            //                     if (api.getAutoDifficulty(state) <= autoDifficulty.Easy
            //                         && api.getBiggerCount(state, usedGirl) >= api.getAutoDifficulty(state) + 1
            //                     ) {
            //                         limitFactor = 0
            //                     }
            //                     else {
            //                         limitFactor = 1
            //                     }

            //                     // Console.log(
            //                     //     api.getVeryNearestTargetCount(state, targetType.Soldier), api.getVeryNearestTargetCount(state, targetType.MilltaryVehicle)
            //                     // )
            //                     // return api.isRandomRate((hpFactor + armyFactor) * scaleFactor * api.getSettingFactorAffectBiggerRate(state))
            //                     return api.isRandomRate((rate + hpFactor + armyFactor) * scaleFactor * api.getSettingFactorAffectBiggerRate(state)
            //                         * limitFactor
            //                     )
            //                 })
            //             },
            //             // conditionReturnFail: (state: state, usedGirl) => true,
            //             node: actionNode.Bigger,
            //             children: [
            //             ]
            //         },
            //         //         {
            //         //             conditionReturnSuccess: (state: state, usedGirl) => {
            //         //                 return _judgeRate(api, state, (api, state) => {
            //         //                     // let rate = 1 / 4
            //         //                     let rate = 1 / 3

            //         //                     let armyFactor, hpFactor, scaleFactor
            //         //                     switch (api.getCurrentPose(state, usedGirl)) {
            //         //                         case pose.Stand:
            //         //                             if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) < 20000) {
            //         //                                 return false
            //         //                             }
            //         //                             // hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 8, 1 / 4, 1])
            //         //                             hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 50, 1 / 12, 1 / 2, 1])
            //         //                             // armyFactor = _computeArmyFactor(api, state, [1, 2 / 3, 1 / 2])
            //         //                             // armyFactor = _computeArmyFactor(api, state, [1 / 2, 1 / 6, 1 / 30])
            //         //                             armyFactor = _computeArmyFactor(api, state, [1 / 2, 1 / 6, 1 / 15])

            //         //                             scaleFactor = api.NumberUtils.clamp(Math.sqrt(api.getGirlScale(state, usedGirl)) / 5, 1 / 3, 8)

            //         //                             break
            //         //                         case pose.Crawl:
            //         //                             if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) < 10000) {
            //         //                                 // if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) < 15000) {
            //         //                                 return false
            //         //                             }

            //         //                             if (api.getPassTimeFromNow(state, api.getLastChangePoseTime(state, usedGirl)) > 30000) {
            //         //                                 return true
            //         //                             }

            //         //                             // if (_hasManyArmyNear(api, state)) {
            //         //                             //     armyFactor = 1
            //         //                             // }
            //         //                             // else {
            //         //                             //     armyFactor = 0.5
            //         //                             // }

            //         //                             // if (_isLowHp(api, state)) {
            //         //                             //     hpFactor = 1
            //         //                             // }
            //         //                             // else {
            //         //                             //     hpFactor = 1 / 4
            //         //                             // }


            //         //                             // hpFactor = _computeHpFactor(api, state, usedGirl,  [1 / 2, 1 / 4, 1 / 30])
            //         //                             hpFactor = _computeHpFactor(api, state, usedGirl,  [4, 1, 1 / 5, 1 / 50])
            //         //                             // armyFactor = _computeArmyFactor(api, state, [1 / 10, 1 / 8, 1 / 4])
            //         //                             armyFactor = _computeArmyFactor(api, state, [1 / 10, 1 / 6, 1 / 2])

            //         //                             scaleFactor = api.NumberUtils.clamp(5 / Math.sqrt(api.getGirlScale(state, usedGirl)), 1 / 8, 3)


            //         //                             break
            //         //                         default:
            //         //                             return false
            //         //                     }

            //         //                     // return api.isRandomRate(1 / 4 * armyFactor * hpFactor)
            //         //                     return api.isRandomRate(rate * (armyFactor + hpFactor) * scaleFactor)
            //         //                 })
            //         //             },
            //         //             node: actionNode.ChangePose,
            //         //             children: [
            //         //             ]
            //         //         },
            //         //     ]
            //         // },
            //         // {
            //         //     conditionReturnSuccess: (state: state, usedGirl) => true,
            //         //     node: actionNode.Rest,
            //         //     children: []
            //         // },
            //     ]


            // node: controlNode.Selector,
            // children: [
            //     {
            //         name: "fight",
            //         conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(3 / 4),
            //         node: controlNode.Selector,
            //         children: [
            //             {
            //                 name: "handlePickData",
            //                 conditionReturnFail: (state: state, usedGirl) => {
            //                     return api.hasPickData(state, usedGirl)
            //                 },
            //                 node: controlNode.Selector,
            //                 children: [
            //                     {
            //                         name: "pickAttack",
            //                         conditionReturnSuccess: (state: state, usedGirl) => {
            //                             // return api.hasPickData(state, usedGirl)
            //                             return true
            //                         },
            //                         node: controlNode.Selector,
            //                         children: [
            //                             {
            //                                 conditionReturnFail: (state: state, usedGirl) => api.getIsHit(state),
            //                                 node: actionNode.FallByQTE,
            //                                 children: []
            //                             },
            //                             // {
            //                             //     conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(2 / 3),
            //                             //     node: actionNode.Pinch,
            //                             //     children: []
            //                             // },
            //                             {
            //                                 // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 2),
            //                                 conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(3 / 4),
            //                                 node: actionNode.Eat,
            //                                 children: []
            //                             },
            //                             // {
            //                             //     conditionReturnSuccess: (state: state, usedGirl) => true,
            //                             //     node: actionNode.Pickdown,
            //                             //     children: []
            //                             // },
            //                         ]
            //                     },
            //                 ]
            //             },
            //             {
            //                 name: "handleOther",
            //                 conditionReturnSuccess: (state: state, usedGirl) => {
            //                     return true
            //                 },
            //                 node: controlNode.Sequence,
            //                 children: [
            //                     {
            //                         // name: "handleFailCase",
            //                         name: "handleCase",
            //                         conditionReturnSuccess: (state: state, usedGirl) => {
            //                             return true
            //                         },
            //                         node: controlNode.Parrel,
            //                         children: [
            //                             {
            //                                 name: "handleMoveCollision",
            //                                 conditionReturnSuccess: (state: state, usedGirl) => {
            //                                     return api.getNow(state) - api.getGirlState(state).lastMoveCollisionedTime < 1000
            //                                 },
            //                                 node: controlNode.Sequence,
            //                                 children: [
            //                                     // {
            //                                     //     conditionReturnSuccess: (state: state, usedGirl) => {
            //                                     //         return api.isRandomRate(1 / 4)
            //                                     //     },
            //                                     //     node: actionNode.ResetGiantessControllerBlockState,
            //                                     //     children: []
            //                                     // },
            //                                     {
            //                                         conditionReturnFail: (state: state, usedGirl) => true,
            //                                         node: actionNode.Stomp,
            //                                         children: []
            //                                     },
            //                                     {
            //                                         name: "handleMoveCollisionForCrawl",
            //                                         conditionReturnSuccess: (state: state, usedGirl) => {
            //                                             return api.isPose(state, pose.Crawl)
            //                                         },
            //                                         node: controlNode.Sequence,
            //                                         children: [
            //                                             {
            //                                                 conditionReturnFail: (state: state, usedGirl) => true,
            //                                                 node: actionNode.BreastPress,
            //                                                 children: []
            //                                             },
            //                                             {
            //                                                 conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 2),
            //                                                 node: actionNode.ChangePose,
            //                                                 children: []
            //                                             },
            //                                         ]
            //                                     },
            //                                 ]
            //                             },
            //                             {
            //                                 name: "handleHasTarget",
            //                                 conditionReturnSuccess: (state: state, usedGirl) => {
            //                                     // return !api.hasPickData(state, usedGirl) && api.hasTarget(state, usedGirl)
            //                                     return api.hasTarget(state, usedGirl)
            //                                 },
            //                                 node: controlNode.Selector,
            //                                 children: [
            //                                     {
            //                                         conditionReturnSuccess: (state: state, usedGirl) => api.isRandomRate(1 / 3),
            //                                         node: actionNode.ClearTarget,
            //                                         children: []
            //                                     },
            //                                 ]
            //                             },
            //                             {
            //                                 // name: "handleHpLow",
            //                                 name: "handleBigger",
            //                                 conditionReturnSuccess: (state: state, usedGirl) => {
            //                                     // return api.isGiantessNotActiveBigger(state, usedGirl)
            //                                     return true
            //                                 },
            //                                 node: controlNode.Selector,
            //                                 children: [
            //                                     {
            //                                         conditionReturnSuccess: (state: state, usedGirl) => {
            //                                             let hpFactor
            //                                             if (api.getGirlState(state).hp < api.getGirlValue(state, usedGirl).hp * 0.1) {
            //                                                 hpFactor = 1 / 3
            //                                             }
            //                                             else if (api.getGirlState(state).hp < api.getGirlValue(state, usedGirl).hp * 0.3) {
            //                                                 hpFactor = 1 / 4
            //                                             }
            //                                             else {
            //                                                 hpFactor = 0
            //                                             }
            //                                             let armyFactor
            //                                             let data = api.getAllAliveArmyData(state)
            //                                             if (
            //                                                 api.getVeryNearestTargetCount(state, data, targetType.MilltaryBuilding) > 3 ||
            //                                                 api.getVeryNearestTargetCount(state, data, targetType.Soldier) > 15 || api.getVeryNearestTargetCount(state, data, targetType.MilltaryVehicle) > 7) {
            //                                                 armyFactor = 1 / 4
            //                                             }
            //                                             else {
            //                                                 armyFactor = 0
            //                                             }
            //                                             let scaleFactor
            //                                             if (!api.isGiantessNotActiveBigger(state, usedGirl)) {
            //                                                 // scaleFactor = 0.04 * getSettingFactorAffectBiggerRate(state)
            //                                                 scaleFactor = 0.02
            //                                             }
            //                                             else {
            //                                                 scaleFactor = 1
            //                                             }
            //                                             // Console.log(
            //                                             //     api.getVeryNearestTargetCount(state, targetType.Soldier), api.getVeryNearestTargetCount(state, targetType.MilltaryVehicle)
            //                                             // )
            //                                             return api.isRandomRate((hpFactor + armyFactor) * scaleFactor * api.getSettingFactorAffectBiggerRate(state))
            //                                         },
            //                                         node: actionNode.Bigger,
            //                                         children: [
            //                                         ]
            //                                     },
            //                                 ]
            //                             },
            //                             {
            //                                 name: "MakeStandMorePriorForArmy",
            //                                 conditionReturnSuccess: (state: state, usedGirl) => {
            //                                     return api.isPose(state, pose.Crawl)
            //                                 },
            //                                 node: controlNode.Selector,
            //                                 children: [
            //                                     {
            //                                         conditionReturnSuccess: (state: state, usedGirl) => {
            //                                             let data = api.getAllAliveArmyData(state)
            //                                             if (
            //                                                 api.isGiantessNotActiveBigger(state, usedGirl)
            //                                                 &&
            //                                                 (
            //                                                     api.getVeryNearestTargetCount(state, data, targetType.MilltaryBuilding) > 5 ||
            //                                                     api.getVeryNearestTargetCount(state, data, targetType.Soldier) > 20 || api.getVeryNearestTargetCount(state, data, targetType.MilltaryVehicle) > 10
            //                                                 )
            //                                             ) {
            //                                                 return api.isRandomRate(1 / 3)
            //                                             }
            //                                             else {
            //                                                 return false
            //                                             }
            //                                         },
            //                                         // conditionReturnSuccess: (state: state, usedGirl) => true,
            //                                         node: actionNode.ChangePose,
            //                                         children: []
            //                                     },
            //                                 ]
            //                             },
            //                         ]
            //                     },
            //                     {
            //                         // name: "selectTarget",
            //                         conditionReturnSuccess: (state: state, usedGirl) => {
            //                             // return !api.hasPickData(state, usedGirl) && !api.hasTarget(state, usedGirl)
            //                             return !api.hasTarget(state, usedGirl)
            //                         },
            //                         // node: controlNode.Selector,
            //                         node: actionNode.SelectTarget,
            //                         children: [
            //                             // {
            //                             //     conditionReturnFail: (state: state, usedGirl) => {
            //                             //         if (getSelectTargetPrior(state) == targetPrior.LittleMan) {
            //                             //             return true
            //                             //         }
            //                             //         return state.config.littleManConfig.isSelectLittleMan ? true : api.isRandomRate(1 / 4)
            //                             //     },
            //                             //     node: actionNode.SelectLittleMan,
            //                             //     children: []
            //                             // },
            //                             // {
            //                             //     conditionReturnFail: (state: state, usedGirl) => {
            //                             //         if (getSelectTargetPrior(state) == targetPrior.MilltaryVehicle) {
            //                             //             return true
            //                             //         }
            //                             //         let factor
            //                             //         if (
            //                             //             api.getVeryNearestTargetCount(state, targetType.MilltaryVehicle) > 4
            //                             //         ) {
            //                             //             factor = 2
            //                             //         }
            //                             //         else {
            //                             //             factor = 1
            //                             //         }
            //                             //         return api.isRandomRate(1 / 4 * factor)
            //                             //     },
            //                             //     node: actionNode.SelectNearestTank,
            //                             //     children: []
            //                             // },
            //                             // {
            //                             //     conditionReturnFail: (state: state, usedGirl) => {
            //                             //         if (getSelectTargetPrior(state) == targetPrior.Soldier) {
            //                             //             return true
            //                             //         }
            //                             //         let factor
            //                             //         if (api.getVeryNearestTargetCount(state, targetType.Soldier) > 8
            //                             //         ) {
            //                             //             factor = 2
            //                             //         }
            //                             //         else {
            //                             //             factor = 1
            //                             //         }
            //                             //         return api.isRandomRate(1 / 4 * factor)
            //                             //     },
            //                             //     node: actionNode.SelectNearestSoldier,
            //                             //     children: []
            //                             // },
            //                             // {
            //                             //     // conditionReturnFail: (state: state, usedGirl) => {
            //                             //     //     return true
            //                             //     // },
            //                             //     conditionReturnFail: (state: state, usedGirl) => {
            //                             //         if (getSelectTargetPrior(state) == targetPrior.Building) {
            //                             //             return true
            //                             //         }
            //                             //         return api.isRandomRate(1 / 2)
            //                             //     },
            //                             //     node: actionNode.SelectNearestBuilding,
            //                             //     children: []
            //                             // },
            //                             // {
            //                             //     // conditionReturnFail: (state: state, usedGirl) => {
            //                             //     //     return true
            //                             //     // },
            //                             //     // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 2),
            //                             //     // conditionReturnFail: (state: state, usedGirl) => true,
            //                             //     conditionReturnFail: (state: state, usedGirl) => {
            //                             //         if (getSelectTargetPrior(state) == targetPrior.Cityzen) {
            //                             //             return true
            //                             //         }
            //                             //         return api.isRandomRate(1 / 2)
            //                             //     },
            //                             //     node: actionNode.SelectNearestCityzen,
            //                             //     children: []
            //                             // },
            //                         ]
            //                     },
            //                     {
            //                         name: "moveToTarget",
            //                         conditionReturnSuccess: (state: state, usedGirl) => {
            //                             // return !api.hasPickData(state, usedGirl)
            //                             return true
            //                         },
            //                         conditionReturnFail: (state: state, usedGirl) => {
            //                             // return api.hasTarget(state, usedGirl) || !api.isChangeScaling(state, usedGirl)
            //                             return api.hasTarget(state, usedGirl) && !api.isChangeScaling(state, usedGirl)
            //                         },
            //                         node: controlNode.Selector,
            //                         children: [
            //                             // {
            //                             //     config: attackRange.Middle,
            //                             //     conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 2),
            //                             //     node: actionNode.WalkToTarget,
            //                             //     children: []
            //                             // },
            //                             {
            //                                 config: (state: state, usedGirl) => {
            //                                     // if (api.isRandomRate(1 / 3)) {
            //                                     //     return attackRange.Middle
            //                                     // }
            //                                     // if (api.isRandomRate(1 / 3)) {
            //                                     //     return attackRange.Small
            //                                     // }
            //                                     // return attackRange.Big
            //                                     if (api.isRandomRate(1 / 2)) {
            //                                         return attackRange.Middle
            //                                     }
            //                                     return attackRange.Small
            //                                 },
            //                                 conditionReturnFail: (state: state, usedGirl) => true,
            //                                 node: actionNode.WalkToTarget,
            //                                 children: []
            //                             },
            //                         ]
            //                     },
            //                     {
            //                         name: "attack",
            //                         conditionReturnFail: (state: state, usedGirl) => {
            //                             // return api.hasPickData(state, usedGirl) || (api.hasTarget(state, usedGirl) && api.isInGirlAttackRange(state, usedGirl, api.getTarget(state, usedGirl).getPositionFunc(state), attackRange.Big, api.NullableUtils.getEmpty()))
            //                             return api.hasTarget(state, usedGirl) && api.isInGirlAttackRange(state, usedGirl, api.getTarget(state, usedGirl).getPositionFunc(state), attackRange.Big, api.NullableUtils.getEmpty())
            //                         },
            //                         node: controlNode.Selector,
            //                         children: [
            //                             {
            //                                 conditionReturnFail: (state: state, usedGirl) => {
            //                                     // return api.isRandomRate(1 / 2)
            //                                     return true
            //                                 },
            //                                 node: actionNode.BreastPress,
            //                                 children: []
            //                             },
            //                             {
            //                                 conditionReturnFail: (state: state, usedGirl) => {
            //                                     // // return !api.hasPickData(state, usedGirl) && api.isRandomRate(1 / 3)
            //                                     // // if (api.hasPickData(state, usedGirl)) {
            //                                     // //     return api.isRandomRate(1 / 4)
            //                                     // // }
            //                                     // // if (state.config.littleManConfig.isOnlyStomp) {
            //                                     // //     return true
            //                                     // // }
            //                                     // if (api.hasPickData(state, usedGirl)) {
            //                                     //     return false
            //                                     // }
            //                                     // return api.isRandomRate(1 / 2)
            //                                     // return api.isRandomRate(3 / 4)
            //                                     return api.isRandomRate(3 / 5)
            //                                 },
            //                                 node: actionNode.Stomp,
            //                                 children: []
            //                             },
            //                             {
            //                                 name: "pick",
            //                                 // conditionReturnFail: (state: state, usedGirl) => {
            //                                 //     // return api.isRandomRate(1 / 2)
            //                                 //     return false
            //                                 // },
            //                                 conditionReturnSuccess: (state: state, usedGirl) => {
            //                                     return true
            //                                 },
            //                                 node: controlNode.Sequence,
            //                                 children: [
            //                                     {
            //                                         conditionReturnSuccess: (state: state, usedGirl) => {
            //                                             return true
            //                                         },
            //                                         node: actionNode.Pickup,
            //                                         children: []
            //                                     },
            //                                 ]
            //                             },
            //                         ]
            //                     },
            //                     {
            //                         // name: "MakeStandMorePrior",
            //                         name: "Stand",
            //                         conditionReturnSuccess: (state: state, usedGirl) => {
            //                             return api.isPose(state, pose.Crawl)
            //                         },
            //                         node: controlNode.Selector,
            //                         children: [
            //                             {
            //                                 conditionReturnSuccess: (state: state, usedGirl) => {
            //                                     return api.isRandomRate(1 / 3)
            //                                 },
            //                                 // conditionReturnSuccess: (state: state, usedGirl) => true,
            //                                 node: actionNode.ChangePose,
            //                                 children: []
            //                             },
            //                         ]
            //                     },
            //                 ]
            //             },
            //         ]
            //     },
            //     {
            //         name: "assistant",
            //         conditionReturnFail: (state: state, usedGirl) => api.hasTarget(state, usedGirl),
            //         // conditionReturnFail: (state: state, usedGirl) => isRandomRateFunc(5 / 6),
            //         // conditionReturnFail: (state: state, usedGirl) => true,
            //         node: controlNode.Selector,
            //         children: [
            //             {
            //                 conditionReturnFail: (state: state, usedGirl) => {
            //                     let rate
            //                     if (api.isGiantessNotActiveBigger(state, usedGirl)) {
            //                         // rate = 1 / 4
            //                         rate = 1 / 6
            //                     }
            //                     else {
            //                         // rate = 1 / 32
            //                         // rate = 1 / 20
            //                         rate = 1 / 30
            //                     }
            //                     return api.isRandomRate(rate * api.getSettingFactorAffectBiggerRate(state))
            //                 },
            //                 // conditionReturnFail: (state: state, usedGirl) => true,
            //                 node: actionNode.Bigger,
            //                 children: [
            //                 ]
            //             },
            //             {
            //                 // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 4),
            //                 conditionReturnSuccess: (state: state, usedGirl) => {
            //                     let factor
            //                     let data = api.getAllAliveArmyData(state)
            //                     if (
            //                         api.getVeryNearestTargetCount(state, data, targetType.MilltaryBuilding) > 3 ||
            //                         api.getVeryNearestTargetCount(state, data, targetType.Soldier) > 15 || api.getVeryNearestTargetCount(state, data, targetType.MilltaryVehicle) > 7
            //                     ) {
            //                         factor = 0.5
            //                     }
            //                     else {
            //                         factor = 1
            //                     }
            //                     // return api.isRandomRate(1 / 6 * factor)
            //                     return api.isRandomRate(1 / 4 * factor)
            //                 },
            //                 node: actionNode.ChangePose,
            //                 children: [
            //                 ]
            //             },
            //         ]
            //     },
            //     {
            //         // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 4),
            //         // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(2 / 3),
            //         // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 5),
            //         // conditionReturnFail: (state: state, usedGirl) => true,
            //         // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 2 * (1 / getSettingFactorAffectFirstBiggerRate(state))),
            //         // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 2),
            //         conditionReturnSuccess: (state: state, usedGirl) => true,
            //         // conditionReturnFail: (state: state, usedGirl) => api.isRandomRate(1 / 2),
            //         // conditionReturnFail: (state: state, usedGirl) => true,
            //         node: actionNode.Rest,
            //         children: []
            //     }
            // ]
            // }
        ]
    }
}
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../type/StateType";
import { buildAPI, getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod";
import { service } from "prop-other-protocol/src/service/ServiceType"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { attackRange, propData, propName } from "../script/scene/scene_city/type/StateType";
import { modProtocolName } from "./data/ModData";
import { actionPrior, targetPrior } from "prop-artifact-giantesscontroller/src/script/State";
import { count, rate, rewardData } from "../script/scene/scene_city/data/reward/RewardDataType";
import { mergeRewardData } from "../script/scene/scene_city/reward/RewardGenerator";
import { getAllBlockNames, getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getCurrentPose } from "../script/scene/scene_city/girl/Pose";
import { pose } from "../script/scene/scene_city/data/biwu/level3/CollisionShapeData";
import { getTarget, hasTarget } from "../script/scene/scene_city/behaviour_tree/BehaviourTreeManager";
import { isInGirlAttackRange } from "../script/scene/scene_city/utils/CollisionUtils";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";

// export let getUseArtifactBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, "prop-other-protocol", "prop-other-use-artifact")
// }

export let getUseGiantessCharacterBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "prop-other-protocol", "prop-other-use-giantesscharacter")
}

export let getCaptureBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "prop-other-protocol", "prop-other-capture")
}

export let getSmallerWaterBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "prop-other-protocol", "prop-other-smallerwater")
}

export let getRunBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, "prop-other-protocol", "prop-other-run")
}

// export let getCallGoddessBlockService = (state: state) => {
//     return getBlockServiceExn<service>(state, "prop-other-protocol", "prop-artifact-callgoddess")
// }

export let getGiantessControllerBlockState = (state: state) => {
    return getBlockStateExn<blockState>(state, modProtocolName.PropOtherProtocol, "prop-artifact-giantesscontroller")
}

export let getSelectActionPrior = (state, usedGirl) => {
    return MutableRecordUtils.getWithDefault(getGiantessControllerBlockState(state).selectActionPriors, usedGirl, actionPrior.None)
}

export let getSelectTargetPrior = (state, usedGirl) => {
    return MutableRecordUtils.getWithDefault(getGiantessControllerBlockState(state).selectTargetPriors, usedGirl, targetPrior.None)
}

// export let isCanStomp = (state: state) => {
//     switch (getGiantessControllerBlockState(state).selectActionPrior) {
//         case actionPrior.None:
//         case actionPrior.Stomp:
//             return true
//         default:
//             return false
//     }
// }

// export let isCanRest = (state: state) => {
//     switch (getGiantessControllerBlockState(state).selectActionPrior) {
//         case actionPrior.None:
//         case actionPrior.Rest:
//             return true
//         default:
//             return false
//     }
// }

// export let isCanPinch = (state: state) => {
//     switch (getGiantessControllerBlockState(state).selectActionPrior) {
//         case actionPrior.None:
//         case actionPrior.Pinch:
//             return true
//         default:
//             return false
//     }
// }
// export let isCanEat = (state: state) => {
//     switch (getGiantessControllerBlockState(state).selectActionPrior) {
//         case actionPrior.None:
//         case actionPrior.Eat:
//             return true
//         default:
//             return false
//     }
// }

// export let isCanPickup = (state: state) => {
//     return isCanPinch(state) || isCanEat(state)
// }

// // let _isInGirlAttackRange = (state, attackRange) => {
// //     return hasTarget(state, usedGirl) && isInGirlAttackRange(state, usedGirl, getTarget(state, usedGirl).getPositionFunc(state), attackRange, NullableUtils.getEmpty())
// // }

// export let isCanBreastPress = (state: state) => {
//     // if (!_isInGirlAttackRange(state, usedGirl, attackRange.BreastPressRange)) {
//     //     return false
//     // }

//     switch (getCurrentPose(state, usedGirl)) {
//         case pose.Stand:
//         case pose.Pick:
//             return false
//         case pose.Crawl:
//             // switch (getGiantessControllerBlockState(state).selectActionPrior) {
//             //     case actionPrior.None:
//             //     case actionPrior.BreastPress:
//             //         return true
//             //     default:
//             //         return false
//             // }
//             // break
//             return true
//     }
// }

// export let isStandToCrawl = (state: state) => {
//     switch (getGiantessControllerBlockState(state).selectActionPrior) {
//         case actionPrior.None:
//         case actionPrior.BreastPress:
//         case actionPrior.StandToCrawl:
//             return true
//         default:
//             return false
//     }
// }

// export let isCrawlToStand = (state: state) => {
//     switch (getGiantessControllerBlockState(state).selectActionPrior) {
//         case actionPrior.None:
//         case actionPrior.Stomp:
//         // case actionPrior.Pickup:
//         case actionPrior.CrawlToStand:
//             return true
//         default:
//             if (isCanPickup(state)) {
//                 return true
//             }

//             return false
//     }
// }

export let isCanBigger = (state: state, usedGirl) => {
    switch (getSelectActionPrior(state, usedGirl)) {
        // case actionPrior.CrawlToStand:
        // case actionPrior.StandToCrawl:
        //     return false
        // default:
        //     return true
        case actionPrior.None:
        case actionPrior.Bigger:
            return true
        default:
            return false
    }
}

export let isGiantessControlled = (state: state, usedGirl) => {
    return getSelectActionPrior(state, usedGirl) != actionPrior.None
}

export let isGiantessControlledTargetNone = (state: state, usedGirl) => {
    return getSelectTargetPrior(state, usedGirl) == targetPrior.None
}


export let isUseGiantessController = (state: state, usedGirl) => {
    return getSelectActionPrior(state, usedGirl) == actionPrior.None
}

// export let resetGiantessControllerBlockState = (state: state) => {
//     return setBlockState<blockState>(state, modProtocolName.PropOtherProtocol, "prop-artifact-giantesscontroller", {
//         ...getGiantessControllerBlockState(state),
//         selectTargetPrior: targetPrior.None,
//         selectActionPrior: actionPrior.None
//     })
// }

export let getInfinityBigBlockState = (state: state) => {
    return getBlockStateExn<blockState>(state, modProtocolName.PropOtherProtocol, "prop-artifact-infinitybig")
}

export let isUseInfinityBig = (state: state) => {
    return getInfinityBigBlockState(state).isWork
}

export let getSpecificWildGiantessBlockState = (state: state) => {
    return getBlockStateExn<blockState>(state, modProtocolName.PropOtherProtocol, "prop-artifact-specificgiantess")
}

// export let resetSpecificWildGiantessBlockState = (state: state) => {
//     return setBlockState(state, modProtocolName.PropOtherProtocol, "prop-artifact-specificgiantess", {
//         mmdCharacter: NullableUtils.getEmpty()
//     })
// }

let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        "prop-artifact-restorecloth",
        "prop-artifact-infinitybig",
        "prop-artifact-callgoddess",
        "prop-artifact-giantessstimulator",
        "prop-artifact-giantesscontroller",
        "prop-artifact-specificgiantess",
        "prop-artifact-missioncomplete",

        "prop-other-strong",
        "prop-other-run",
        "prop-other-holywater",
        "prop-other-capture",
        "prop-other-smallerwater",
        "prop-other-use-giantesscharacter",
    ])
}


let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.PropOtherProtocol, blockName)
    })
}

let _getAllServices = (state): Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "propOther")
}

export let getAllArtifactServices = (state) => {
    return _getAllBlockNames(state).filter(name => name.includes("artifact")).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.PropOtherProtocol, blockName)
    })
}


export let use = (state: state, name: propName) => {
    let api = getModAPI(state)

    return ArrayUtils.reducePromise<[state, boolean], service>(
        _getAllServices(state),
        (result, service) => {
            if (service.getName() != name) {
                return result
            }

            let [state, _] = result

            return service.use(api, state, name).then(state => [state, true])
        },
        [state, false]
    )
}

export let updateUseProp = (state: state, func, name: propName) => {
    return use(state, name).then(([state, isUse]) => {
        if (isUse) {
            return state
        }

        return func(state, name)
    })
}

export let isDisable = (state: state, name: propName) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<boolean, service>(
        _getAllServices(state),
        (result, service) => {
            if (result) {
                return result
            }

            return service.isDisable(api, state, name)
        },
        false
    )
}

export let getAllPropData = (state: state) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<Array<propData>, service>(
        _getAllServices(state),
        (result, service) => {
            return NullableUtils.getWithDefault(
                ArrayUtils.push(
                    result,
                    service.getPropData(api, state)
                ),
                result
            )
        },
        []
    )
}

export let buildAllPropOtherPropData = (state: state) => {
    return ArrayUtils.map(
        _getAllServices(state),
        (service) => {
            return {
                name: service.getName(),

                getCountFunc: state => count.VeryLow,
                getRateFunc: state => rate.Must,
            }
        }
    )
}

export let buildAllArtifactTradeData = (state: state) => {
    return ArrayUtils.map(
        getAllArtifactServices(state),
        (service) => {
            return {
                name: service.getName(),

                // count: 1,
                count: NumberUtils.isRandomRate(0.8) ? 1 : 2,
                // count: 3,
                // coin: 10000,
                // coin: 3000,
                // coin: 6000,
                coin: NullableUtils.getExn(service.getCoin)(state),
            }
        }
    )
}

export let isArtifact = (state, name) => {
    return !NullableUtils.isNullable(getAllArtifactServices(state).find(service => service.getName() == name))
}

export let isReviveOrCapture = (state, name) => {
    if (name == propName.Revive) {
        return true
    }

    return name == getCaptureBlockService(state).getName()
}


// export let buildAllArtifactBossRewardData = (state: state) => {
//     return ArrayUtils.map(
//         getAllArtifactServices(state),
//         (service) => {
//             return {
//                 name: service.getName(),

//                 getCountFunc: state => count.VeryLow,
//                 getRateFunc: state => rate.High,
//             }
//         }
//     )
// }

export let getRewardDataPropOther = (state): rewardData => {
    let api = getModAPI(state)

    return _getAllServices(state).reduce((result, service) => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(getRewardData => {
                return mergeRewardData(result, getRewardData(api, state))
            }, service.getRewardData),
            result
        )
    }, {})
}
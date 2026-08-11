import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../type/StateType";
import { buildAPI, getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod";
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { modProtocolName } from "./data/ModData";
import { getAllBlockNames, getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod";
import { actionData, actionName, animationBlendData, animationName } from "../script/scene/scene_city/data/DataType";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../business_layer/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { SkinAnimation } from "meta3d-jiehuo-abstract";
import { setAbstractState } from "../state/State";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { operateRenderData } from "../script/scene/scene_city/data/PoseData";
// import { getConfigData } from "../script/scene/scene_city/CityScene";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { damageType, result } from "../script/scene/scene_city/type/StateType";
import { buildRandomDirectionInXZ } from "../utils/DirectionUtils";
import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType";
import { nullable } from "block/src/Type";

export let getSprayMilkBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-spray-milk")
}

export let getCrawlLickBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-crawl-lick")
}

export let getCrawlBeatBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-crawl-beat")
}

export let getBreastPressRubBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-breast-press-rub")
}

export let getBreastPressBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-breast-press")
}


export let getUBHeavyStressingBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-ub-heavystressing")
}

export let getFreeShoeBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-free-shoe")
}


export let getFreeBreastBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-free-breast")
}


export let getFreeUBBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-free-ub")
}

export let getPutToShoeBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-put-to-shoe")
}


export let getPutToBreastBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-put-to-breast")
}


export let getInsertBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-insert")
}

export let getThrustBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-thrust")
}

export let getPickToUBBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-pick-to-ub")
}

export let getUBToPickBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-ub-to-pick")
}

export let getKeepUBBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-keep-ub")
}


export let getHeavyStressingBreastBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-sit-heavystressing-breast")
}

export let getHeavyStressingTrigoneAndButtBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-sit-heavystressing-trigoneandbutt")
}

export let getHeavyStressingBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-sit-heavystressing")
}

export let getSitDeathBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-sit-death")
}

export let getSitTightenLegBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-sit-tightenleg")
}

export let getSitRubBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-sit-rub")
}

export let getSitToStandBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-sit-to-stand")
}


export let getStandToSitBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-stand-to-sit")
}

export let getJumpStompBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-jump-stomp")
}

export let getLeftStompBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-left-stomp")
}

export let getStompRubBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-stomp-rub")
}

export let getStompBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-stomp")
}

export let getKeepSitBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, "skill-giantess-keep-sit")
}

export let getSkillGiantessProtocolName = () => "skill-giantess-protocol"

export let getSitHeavyStressingBlockName = () => "skill-giantess-sit-heavystressing"

export let getSitHeavyStressingBreastBlockName = () => "skill-giantess-sit-heavystressing-breast"

export let getSitHeavyStressingTrigoneAndButtBlockName = () => "skill-giantess-sit-heavystressing-trigoneandbutt"


let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        "skill-giantess-stomp",
        "skill-giantess-stomp-rub",
        "skill-giantess-left-stomp",
        "skill-giantess-jump-stomp",
        "skill-giantess-stand-to-sit",
        "skill-giantess-sit-to-stand",
        "skill-giantess-sit-rub",
        "skill-giantess-sit-tightenleg",
        "skill-giantess-keep-sit",
        "skill-giantess-sit-heavystressing",
        "skill-giantess-sit-heavystressing-breast",
        "skill-giantess-sit-heavystressing-trigoneandbutt",
        "skill-giantess-sit-death",
        "skill-giantess-keep-ub",
        "skill-giantess-pick-to-ub",
        "skill-giantess-ub-to-pick",
        "skill-giantess-thrust",
        "skill-giantess-insert",
        "skill-giantess-put-to-breast",
        "skill-giantess-put-to-shoe",
        "skill-giantess-free-ub",
        "skill-giantess-free-breast",
        "skill-giantess-free-shoe",
        "skill-giantess-ub-heavystressing",
        "skill-giantess-breast-press",
        "skill-giantess-breast-press-rub",
        "skill-giantess-crawl-beat",
        "skill-giantess-crawl-lick",
        "skill-giantess-spray-milk",
    ])
}


let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.SkillGiantessProtocol, blockName)
    })
}

let _getAllServices = (state): Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "skillGiantess")
}

export let getOperateRenderData = (state: state, operateRenderData) => {
    // let api = getModAPI(state)

    return ArrayUtils.reduce<operateRenderData, service>(
        _getAllServices(state),
        (result, service) => {
            let { poseData, operateData } = service.getOperateRenderData()

            return {
                poseData: ArrayUtils.map(
                    result.poseData,
                    (data) => {
                        return {
                            ...data,
                            names: ArrayUtils.pushArrs(
                                ArrayUtils.clone(data.names),
                                NullableUtils.getWithDefault(
                                    NullableUtils.map(d => {
                                        return d.names
                                    }, poseData.find(d => {
                                        return data.pose == d.pose
                                    })),
                                    []
                                )
                            )
                        }
                    }
                ),
                operateData: ArrayUtils.pushArrs(
                    ArrayUtils.clone(result.operateData), operateData)
            }
        },
        operateRenderData
    )
}


export let getAnimationBlendData = (state: state,
    funcs
) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<animationBlendData<animationName>, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getAnimationBlendData(api, funcs, state)
            )
        },
        []
    )
}

export let getAnimationCollisionData = (state: state,
    funcs,
) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<animationBlendData<animationName>, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getAnimationCollisionData(api, funcs)
            )
        },
        []
    )
}


export let getAllAnimationNames = (state: state,
): Array<animationName> => {
    return ArrayUtils.reduce<Array<animationName>, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getAllAnimationNames()
            )
        },
        []
    )
}


export let getActionData = (state: state,) => {
    return ArrayUtils.reduce<actionData<animationName>, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getActionData()
            )
        },
        []
    )
}

export let getPhase = (state: state,) => {
    return ArrayUtils.reduce<any, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getPhase()
            )
        },
        []
    )
}

export let getSkillStressingFactor = (state: state,) => {
    return ArrayUtils.reduce<actionData<animationName>, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getSkillStressingFactor()
            )
        },
        []
    )
}

export let getAnimationData = (state: state,) => {
    return ArrayUtils.reduce<actionData<animationName>, service>(
        _getAllServices(state),
        (result, service) => {
            return MutableRecordUtils.concat(
                result,
                service.getAnimationData()
            )
        },
        MutableRecordUtils.create()
    )
}

export let getAllSkillDataForPlayer = (state: state,) => {
    return ArrayUtils.reduce<any, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getAllSkillDataForPlayer()
            )
        },
        []
    )
}

export let getAllSkillDataForLevelOrBoss = (state: state,) => {
    return ArrayUtils.reduce<any, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getAllSkillDataForLevelOrBoss()
            )
        },
        []
    )
}

export let getVMDRawData = (state: state) => {
    return ArrayUtils.reduce<any, service>(
        _getAllServices(state),
        (result, service) => {
            // return ArrayUtils.push(
            return ArrayUtils.pushArrs(
                result,
                service.getVMDRawData()
            )
        },
        []
    )
}

export let getAnimationFrameCount = (state: state,) => {
    return ArrayUtils.reduce<actionData<animationName>, service>(
        _getAllServices(state),
        (result, service) => {
            return MutableRecordUtils.concat(
                result,
                service.getAnimationFrameCount()
            )
        },
        MutableRecordUtils.create()
    )
}

let _isServiceAnimationName = (service, animationName_) => {
    return service.getAllAnimationNames().includes(animationName_)
}

export let isSkillState = (state: state, usedGirl, animationName_: animationName) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<boolean, service>(
        _getAllServices(state),
        (result, service) => {
            if (result) {
                return result
            }

            if (_isServiceAnimationName(service, animationName_)) {
                return service.isSkillState(api, state, usedGirl)
            }

            return result
        },
        false
    )
}


export let computeForceDirectionDefault = (state: state, animationName_: animationName, velocity, phase) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce(
        _getAllServices(state),
        (direction, service) => {
            if (_isServiceAnimationName(service, animationName_)) {
                return service.computeForceDirectionDefault(api, velocity, phase)
            }

            return direction
        },
        buildRandomDirectionInXZ()
    )
}

export let computeDamageTypeDefault = (state: state, animationName_: animationName, phase): damageType => {
    return ArrayUtils.reduce(
        _getAllServices(state),
        (result, service) => {
            if (_isServiceAnimationName(service, animationName_)) {
                return service.computeDamageTypeDefault(phase)
            }

            return result
        },
        damageType.Direct
    )
}

export let triggerAction = (state: state, usedGirl, name: actionName): Promise<[state, result]> => {
    let api = getModAPI(state)

    return ArrayUtils.reducePromise(
        _getAllServices(state),
        ([state, result_], service) => {
            if (service.getActionName() == name) {
                return service.triggerAction(api, state, usedGirl, name)
            }

            return Promise.resolve([state, result_])
        },
        [state, result.Success]
    )
}

export let isKeepPoseAnimation = (state: state, actionName: actionName) => {
    return ArrayUtils.reduce(
        _getAllServices(state),
        (result, service) => {
            if (service.getActionName() == actionName) {
                return service.isKeepPoseAnimation()
            }

            return result
        },
        true
    )
}

export let isActionValid = (state: state, usedGirl, name: actionName) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce(
        _getAllServices(state),
        (result, service) => {
            if (service.getActionName() == name) {
                return service.isActionValid(api, state, usedGirl, name)
            }

            return result
        },
        true
    )
}

export let createFSMStateByChangeAnimationName = (state: state, usedGirl, animationName_: animationName): [state, nullable<fsm_state<state>>] => {
    let api = getModAPI(state)

    return ArrayUtils.reduce(
        _getAllServices(state),
        ([state, fsmState], service) => {
            if (_isServiceAnimationName(service, animationName_)) {
                return NullableUtils.getWithDefault(
                    NullableUtils.map(createFSMStateByChangeAnimationName => {
                        return createFSMStateByChangeAnimationName(api, state, usedGirl, animationName_)
                    }, service.createFSMStateByChangeAnimationName),
                    [state, fsmState]
                )
            }

            return [state, fsmState]
        },
        [state, null]
    )

}

export let handleChangeAnimationName = (state: state, usedGirl, nextBlendingAnimationName: animationName, currentAnimationName) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce(
        _getAllServices(state),
        (state, service) => {
            return NullableUtils.getWithDefault(
                NullableUtils.map(handleChangeAnimationName => {
                    return handleChangeAnimationName(api, state, usedGirl, nextBlendingAnimationName, currentAnimationName)
                }, service.handleChangeAnimationName),
                state
            )
        },
        state
    )

}

export let getAllStompAnimations = (state: state) => {
    return [
        getStompBlockService(state),
        getStompRubBlockService(state),
        getLeftStompBlockService(state),
        getJumpStompBlockService(state)
    ].reduce((result, service) => {
        return ArrayUtils.pushArrs(result, service.getAllAnimationNames(state))
    }, [])
}

export let getAllSitAnimations = (state: state) => {
    return [
        getSitRubBlockService(state),
        getSitTightenLegBlockService(state),
        getKeepSitBlockService(state),
        getStandToSitBlockService(state),
        getSitToStandBlockService(state),
    ].reduce((result, service) => {
        return ArrayUtils.pushArrs(result, service.getAllAnimationNames(state))
    }, [])
}

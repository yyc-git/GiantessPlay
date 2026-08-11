import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../type/StateType";
import { buildAPI, getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod";
import { service } from "skill-little-man-protocol/src/service/ServiceType"
import { modProtocolName } from "./data/ModData";
import { getAllBlockNames, getAllServiceWithCache, getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod";
import { littleManOperateData } from "../script/scene/scene_city/little_man_data/OperateData";
import { animationBlendData } from "../script/scene/scene_city/data/DataType";
import { actionName, animationCollisionData, animationName } from "../script/scene/scene_city/little_man_data/DataType";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../business_layer/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { SkinAnimation } from "meta3d-jiehuo-abstract";
import { getName } from "../script/scene/scene_city/little_man/LittleMan";
import { setAbstractState } from "../state/State";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { getCurrentGunValue } from "../script/scene/scene_city/little_man/Gun";
import { isActionTriggering } from "../script/scene/scene_city/little_man/Action";

export let getSwipBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillLittleManProtocol, "skill-little-man-swiping")
}

export let getFastRunBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.SkillLittleManProtocol, "skill-little-man-fastrun")
}


let _getAllBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        "skill-little-man-swiping",
        "skill-little-man-fastrun",
    ])
}


let _getAllServicesDirectly = (state) => {
    return _getAllBlockNames(state).map(blockName => {
        return getBlockServiceExn<service>(state, modProtocolName.SkillLittleManProtocol, blockName)
    })
}

let _getAllServices = (state):Array<service> => {
    return getAllServiceWithCache(state, _getAllServicesDirectly, "skillLittleMan")
}

export let getOperateData = (state: state) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<littleManOperateData, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getOperateData(api, state)
            )
        },
        []
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
                service.getAnimationBlendData(api, funcs)
            )
        },
        []
    )
}

export let getAllAnimationNamesExceptDeathAnimations = (state: state,
) => {
    return ArrayUtils.reduce<animationBlendData<animationName>, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getAllAnimationNamesExceptDeathAnimations()
            )
        },
        []
    )
}

export let getAnimationCollisionData = (state: state) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<Array<animationCollisionData>, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getAnimationCollisionData(api, state)
            )
        },
        []
    )
}

export let getAnimationFrameCountMap = (state: state) => {
    return ArrayUtils.reduce(
        _getAllServices(state),
        (result, service) => {
            return MutableRecordUtils.concat(
                result,
                service.getAnimationFrameCountMap()
            )
        },
        MutableRecordUtils.create()
    )
}

export let getAllAnimationNames = (state: state) => {
    return ArrayUtils.reduce(
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

export let getSkillData = (state: state) => {
    return ArrayUtils.reduce<Array<animationCollisionData>, service>(
        _getAllServices(state),
        (result, service) => {
            return ArrayUtils.pushArrs(
                result,
                service.getSkillData()
            )
        },
        []
    )
}


export let triggerAction = (state: state, name: actionName) => {
    let api = getModAPI(state)

    return ArrayUtils.reducePromise(
        _getAllServices(state),
        (state, service) => {
            if (service.getActionName() == name) {
                return service.triggerAction(api, state, name)
            }

            return Promise.resolve(state)
        },
        state
    )
}

export let isActionValid = (state: state, name: actionName) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce(
        _getAllServices(state),
        (result, service) => {
            if (service.getActionName() == name) {
                return service.isActionValid(api, state, name)
            }

            return result
        },
        true
    )
}



export let parseAndAddSkill = (state: state) => {
    return ArrayUtils.reducePromise(
        _getAllServices(state),
        (state, service) => {
            let [animationName, path] = service.getLoadData()

            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName), path).then(skill => {
                let abstractState = SkinAnimation.addSkinAnimation(getAbstractState(state), getName(), service.getAnimationName(),
                    skill.animations[0]
                )
                return setAbstractState(state, abstractState)
            })
        },
        state
    )
}

let _getShootService = () => {
    return {
        getActionName: () => actionName.Shoot,
        getAnimationName: () => animationName.Shoot,
        // getValue: (state) => getCurrentGunValue(state),
    }
}

let _getAllAttackServices = (state: state) => {
    return [
        getSwipBlockService(state),
        _getShootService()
    ]
}

// export let getAllAttackActionNames = (state: state) => {
//     return _getAllAttackServices(state).map(service => service.getActionName())
// }

export let getAllAttackAnimationNames = (state: state) => {
    return _getAllAttackServices(state).map(service => service.getAnimationName())
}

// export let isAllAttackActionNamesNotTriggering = (state: state) => {
//     return getAllAttackActionNames(state).reduce((result, actionName) => {
//         if (!result) {
//             return result
//         }

//         return !isActionTriggering(state, actionName)
//     }, true)
// }

export let isAllAttackAnimationNamesAreAnd = (state: state, isFunc) => {
    return getAllAttackAnimationNames(state).reduce((result, name) => {
        if (!result) {
            return result
        }

        return isFunc(state, name)
    }, true)
}

export let isAllAttackAnimationNamesAreOr = (state: state, isFunc) => {
    return getAllAttackAnimationNames(state).reduce((result, name) => {
        if (result) {
            return result
        }

        return isFunc(state, name)
    }, false)
}
import { getUsedGirlByName, isGirl } from "../script/scene/scene_city/girl/Girl"
import { getGirlPosition } from "../script/scene/scene_city/girl/Utils"
import { isLittleMan } from "../script/scene/scene_city/little_man/LittleMan"
import { getPosition } from "../script/scene/scene_city/little_man/Transform"
import { getPositionByName as getPositionByNameUtils } from "../script/scene/scene_city/utils/ArmyUtils"

export let getPositionByName = (state, name) => {
    if (isGirl(name)) {
        return getGirlPosition(state, getUsedGirlByName(name))
    }

    if (isLittleMan(name)) {
        return getPosition(state)
    }

    return getPositionByNameUtils(state, name)
}
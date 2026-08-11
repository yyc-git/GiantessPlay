import { difficultyData } from "../../../difficulty/DifficultyData"
import * as GiantessBuildUtils from "../../../../utils/build/GiantessBuildUtils"
import { usedGirlEnum } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getDifficultyData as getDifficultyDataUtils } from "../../DifficultyData"

export enum name {
    // IncreaseBossHP = "提升Boss生命上限",
}

export let getDifficultyData = (): difficultyData<name> => {
    return [
        ...getDifficultyDataUtils() as any,
    ]
}
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
        // {
        //     name: name.IncreaseBossHP,

        //     ratioOfOneHeat: 0.2,

        //     heat: 0,
        //     minHeat: -4,
        //     maxHeat: 5,

        //     applyFunc: (state, funcData, heat, ratioOfOneHeat) => {
        //         return funcData.GiantessBuildUtils.setFullHp(state, funcData, (state, hp) => {
        //             return hp * (1 + heat * ratioOfOneHeat)
        //         }, usedGirlEnum.BossGiantess)
        //     },
        //     getDescriptionFunc: (state, heat, ratioOfOneHeat) => {
        //         return `提升Boss${Math.round(heat * ratioOfOneHeat * 100)}%生命上限`
        //     },
        // }
    ]
}
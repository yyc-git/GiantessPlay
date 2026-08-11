import { getAllSkillDataForPlayer as getAllSkillDataForPlayerMod, getAllSkillDataForLevelOrBoss as getAllSkillDataForLevelOrBossMod } from "../../../../mod/SkillGiantessMod"
import { state } from "../../../../type/StateType"
import { actionName, skillExcitement } from "./DataType"

export let getAllSkillDataForPlayer = (state: state) => {
    return [
        {
            name: actionName.Reborn,
            excitement: skillExcitement.Zero,
        },

        {
            name: actionName.Bigger,
            excitement: skillExcitement.VeryHigh
        },
        {
            name: actionName.SmallerToLastBiggerCount,
            excitement: skillExcitement.Zero
        },
        {
            name: actionName.Pickup,
            excitement: skillExcitement.Middle
        },
        // {
        //     name: actionName.Stomp,
        //     excitement: skillExcitement.Zero
        // },
        {
            name: actionName.Run,
            excitement: skillExcitement.Zero
        },
        {
            name: actionName.StandToCrawl,
            excitement: skillExcitement.Middle
        },
        {
            name: actionName.Eat,
            excitement: skillExcitement.High
        },
        {
            name: actionName.Pinch,
            excitement: skillExcitement.Middle
        },
        {
            name: actionName.Pickdown,
            excitement: skillExcitement.Zero
        },
        // {
        //     name: actionName.BreastPress,
        //     excitement: skillExcitement.VeryHigh
        // },
        {
            name: actionName.CrawlToStand,
            excitement: skillExcitement.Zero
        },
    ].concat(
        getAllSkillDataForPlayerMod(state)
    )
}

export let getAllSkillDataForLevelOrBoss = (state) => {
    return [
        {
            name: actionName.Bigger,
            excitement: skillExcitement.Zero
        },
        {
            name: actionName.SmallerToLastBiggerCount,
            excitement: skillExcitement.Zero
        },
        {
            name: actionName.Pickup,
            excitement: skillExcitement.Zero
        },
        // {
        //     name: actionName.Stomp,
        //     excitement: skillExcitement.Zero
        // },
        {
            name: actionName.Run,
            excitement: skillExcitement.Zero
        },
        {
            name: actionName.StandToCrawl,
            excitement: skillExcitement.Zero
        },
        {
            name: actionName.Eat,
            excitement: skillExcitement.Zero
        },
        {
            name: actionName.Pinch,
            excitement: skillExcitement.Zero
        },
        {
            name: actionName.Pickdown,
            excitement: skillExcitement.Zero
        },
        // {
        //     name: actionName.BreastPress,
        //     excitement: skillExcitement.Zero
        // },
        {
            name: actionName.CrawlToStand,
            excitement: skillExcitement.Zero
        },
    ].concat(
        getAllSkillDataForLevelOrBossMod(state)
        // .map(data => {
        //     return {
        //         ...data,
        //         excitement: skillExcitement.Zero
        //     }
        // })
    )
}
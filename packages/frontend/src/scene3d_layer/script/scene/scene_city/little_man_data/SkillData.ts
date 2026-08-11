import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getConfigData } from "../CityScene"
import { actionName } from "./DataType"
import { getSkillData } from "../../../../mod/SkillLittleManMod"

export type skillData = Array<{
    name: actionName,
    coolingTime?: number,
}>

export let getData = (state: state): skillData => {
    return [
        {
            name: actionName.Blink,
            coolingTime: 3000,
        },
        {
            name: actionName.Shoot,
        },
        // {
        //     name: actionName.Swiping,
        // },
        {
            name: actionName.Lock,
        },
    ].concat(
        getSkillData(state) as any
    )
}

export let getCurrentData = (state: state, name) => {
    return NullableUtils.getExn(getConfigData(state).littleManSkillData.find(d => d.name == name))
}
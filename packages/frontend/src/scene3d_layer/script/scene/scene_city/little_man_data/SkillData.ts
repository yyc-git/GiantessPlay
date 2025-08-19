import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getConfigData } from "../CityScene"
import { actionName } from "./DataType"

export type skillData = Array<{
    name: actionName,
    coolingTime?: number,
}>

export let getData = (): skillData => {
    return [
        {
            name: actionName.Blink,
            coolingTime: 3000,
        },
        {
            name: actionName.Shoot,
        },
        {
            name: actionName.Swiping,
        },
    ]
}

export let getCurrentData = (state: state, name) => {
    return NullableUtils.getExn(getConfigData(state).littleManSkillData.find(d => d.name == name))
}
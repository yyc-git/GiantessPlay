import { state } from "../../../../type/StateType"
import { getBone } from "../utils/MMDUtils"
import { getGirl } from "./Girl"

export let getPutToBreastBoneName = () => "上半身2"

// export let getPutToShoeBoneName = () => "右足IK親"
export let getPutToShoeBoneName = () => "右足ＩＫ"

export let getGirlPutToBreastBone = (state: state, usedGirl) => {
    return getBone(state, usedGirl, getGirl(state, usedGirl), getPutToBreastBoneName())
}

export let getGirlPutToShoeBone = (state: state, usedGirl) => {
    return getBone(state, usedGirl, getGirl(state, usedGirl), getPutToShoeBoneName())
}
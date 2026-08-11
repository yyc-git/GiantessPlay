import { state } from "../../../../type/StateType"
import { getBone } from "../utils/MMDUtils"
import { getGirl } from "./Girl"

export let getBoneName = () => "下半身"

export let getGirlUBBone = (state: state, usedGirl) => {
    return getBone(state, usedGirl, getGirl(state, usedGirl), getBoneName())
}
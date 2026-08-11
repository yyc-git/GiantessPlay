import { state } from "../../../../type/StateType";
import { pose } from "../type/StateType";
import { changeToStandPosePivot } from "./Crawl";
import { getUsedGirlData, isUseGirl, setUsedGirlData } from "./Girl";
import { computeGirlBoxAndSetToState } from "./Utils";

export let changePose = (state: state, usedGirl, pose) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        currentPose: pose,
    })
}

export let getCurrentPose = (state: state, usedGirl) => {
    return getUsedGirlData(state, usedGirl).currentPose
}

export let isPose = (state: state, usedGirl, pose) => {
    if (!isUseGirl(state, usedGirl)) {
        return false
    }

    return getUsedGirlData(state, usedGirl).currentPose == pose
}

export let resetPose = (state: state, usedGirl) => {
    if (getCurrentPose(state, usedGirl) == pose.Crawl) {
        state = changeToStandPosePivot(state, usedGirl)
    }

    state = changePose(state, usedGirl, pose.Stand)

    state = computeGirlBoxAndSetToState(state, usedGirl)

    return state
}
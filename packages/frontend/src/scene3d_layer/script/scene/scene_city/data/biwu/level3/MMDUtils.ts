import { state } from "../../../../../../type/StateType"
import { usedGirlEnum } from "../../../type/StateType"
import { getCurrentMMDData, getMMDData, getRandomMMDData } from "../../../utils/MMDUtils"
import { mmdCharacter } from "./mmd/MMDData"

export let getAllRandomUsedMMDData = (state: state) => {
    return [
        {
            usedGirl: usedGirlEnum.BossGiantess,
            data: getRandomMMDData(state, [])
            // data: getRandomMMDData(state, [], mmdCharacter.Haku_QP2)
        },
    ]
}
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { usedGirlEnum } from "../../type/StateType"
import { getCurrentMMDData, getMMDData, getRandomMMDData, getSpecificGiantessMMDDataExceptMMDData } from "../../utils/MMDUtils"
import { mmdCharacter } from "../mmd/MMDData"

export let getAllRandomUsedMMDData = (state: state) => {
    return [
        {
            usedGirl: usedGirlEnum.BossGiantess,
            data: getSpecificGiantessMMDDataExceptMMDData(state, [])
        },
    ]
}
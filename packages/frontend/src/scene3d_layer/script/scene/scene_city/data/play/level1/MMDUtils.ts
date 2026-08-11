import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../type/StateType"
import { usedGirlEnum } from "../../../type/StateType"
import { getCurrentMMDData, getCurrentMMDDataByUsedGirl, getMMDData, getRandomMMDData, getRandomMMDDataExceptMMDData, getSpecificGiantessMMDDataExceptMMDData } from "../../../utils/MMDUtils"
import { hasCurrentMMDCharacterByUsedGirl } from "../../../girl/Girl"
// import { getSelectedGameEventData } from "../../../director/GameEventDirector"
// import { eventName } from "../../director/GameEventDirectorData"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getPlayerUsedGirl } from "../../../../../../mod/LevelGiantessMod"

export let getAllUsedMMDDataForPlayerMMD = (state) => {
    let data
    if (hasCurrentMMDCharacterByUsedGirl(state, usedGirlEnum.PlayerGirl)) {
        // data = [
        //     {
        //         usedGirl: usedGirlEnum.PlayerGirl,
        //         data: getCurrentMMDDataByUsedGirl(state, usedGirlEnum.PlayerGirl)
        //     },
        //     {
        //         usedGirl: usedGirlEnum.PlayerGoddess,
        //         data: getCurrentMMDDataByUsedGirl(state, usedGirlEnum.PlayerGirl)
        //     },
        // ]
        data = [
            usedGirlEnum.PlayerGoddess,
            usedGirlEnum.PlayerGirl,
            ...getPlayerUsedGirl(state)
        ].reduce((data, usedGirl_) => {
            return ArrayUtils.push(
                data,
                {
                    usedGirl: usedGirl_,
                    data: getCurrentMMDDataByUsedGirl(state, usedGirlEnum.PlayerGirl)
                }
            )
        }, [])
    }
    else {
        // data = [
        //     {
        //         usedGirl: usedGirlEnum.PlayerGoddess,
        //         data: getRandomMMDData(state, [])
        //     },
        // ]
        let d = getRandomMMDData(state, [])
        data = [
            usedGirlEnum.PlayerGoddess,
            usedGirlEnum.PlayerGirl,
            ...getPlayerUsedGirl(state)
        ].reduce((data, usedGirl_) => {
            return ArrayUtils.push(
                data,
                {
                    usedGirl: usedGirl_,
                    data: d
                }
            )
        }, [])
    }

    return data
}

export let getAllRandomUsedMMDData = (state: state) => {
    let data = getAllUsedMMDDataForPlayerMMD(state)

    // return getSelectedGameEventData(state).reduce((data, selectedGameEventData) => {
    //     let usedGirl_
    //     switch (selectedGameEventData.eventName) {
    //         case eventName.WildGiantessAppear:
    //             usedGirl_ = usedGirlEnum.WildGiantess
    //         case eventName.EnemyGiantessAppear:
    //             usedGirl_ = usedGirlEnum.EnemyGiantess

    //             return ArrayUtils.push(data, {
    //                 usedGirl: usedGirl_,
    //                 data: getRandomMMDDataExceptMMDData(state,
    //                     data.map(d => d.data)
    //                 )
    //             })
    //         default:
    //             return data
    //     }
    // }, data)

    data = ArrayUtils.push(data, {
        usedGirl: usedGirlEnum.WildGiantess,
        data: getSpecificGiantessMMDDataExceptMMDData(state,
            data.map(d => d.data)
        )
    })

    // return data
    return [
        usedGirlEnum.EnemyGiantess,
    ].reduce((data, usedGirl_) => {
        return ArrayUtils.push(data, {
            usedGirl: usedGirl_,
            data: getRandomMMDDataExceptMMDData(state,
                data.map(d => d.data)
            )
        })
    }, data)
}
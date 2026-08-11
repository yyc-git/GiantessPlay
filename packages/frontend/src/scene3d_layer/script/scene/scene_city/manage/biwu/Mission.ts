import { state } from "../../../../../type/StateType"

// let _isAllGameEventsFinish = (state: state) => {
//     return isFinish(state, usedGirl)
// }

// let _isMissionComplete = (state: state) => {
//     return _isAllGameEventsFinish(state)
//         &&
//         // (
//         //     _getGameTime(state).minutes() >= 10
//         //     || (isGenerateComplete(state) && getAllAliveArmyCount(state) == 0)
//         // )

// }

export let update = (state: state) => {
    // let promise
    // if (_isMissionComplete(state) && !getMissionState(state).isMissionFinish) {
    //     promise = handleMissionComplete(state)
    // }
    // else {
    //     promise = Promise.resolve(state)
    // }

    // return promise
    return Promise.resolve(state)
}
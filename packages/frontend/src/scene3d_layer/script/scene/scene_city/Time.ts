import { NullableUtils } from "meta3d-jiehuo-abstract";
import { millisecondUnit, minuteUnit, momentMillisecondUnit, secondUnit, specialTimeKey, time } from "./type/StateType";
import { state } from "../../../type/StateType";
import { getState, setState } from "./CityScene";
import moment from "moment";
import { nullable } from "block/src/Type";
import { getStartNowForLevel } from "./manage/mission/Mission";

export let createState = (): time => {
    return {
        stopLoopTime: NullableUtils.getEmpty(),
        deferTime: 0,

        startSpecialTime: NullableUtils.getEmpty(),
        specialTimeKey: NullableUtils.getEmpty(),
        specialTimeDuration: 0,
    }
}

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).time)
}

let _setState = (state: state, timeState: time) => {
    return setState(state, {
        ...getState(state),
        time: NullableUtils.return_(timeState)
    })
}

export let isStop = (state: state) => {
    return !NullableUtils.isNullable(_getState(state).stopLoopTime)
}

export let stop = (state: state) => {
    if (!NullableUtils.isNullable(_getState(state).stopLoopTime)) {
        return state
    }

    return _setState(state, {
        ..._getState(state),
        stopLoopTime: NullableUtils.return_(performance.now())
    })
}

let _updateDeferTime = (state: state) => {
    return _setState(state, {
        ..._getState(state),
        deferTime: NullableUtils.getWithDefault(
            NullableUtils.map(stopLoopTime => {
                return _getState(state).deferTime + (performance.now() - stopLoopTime)
            }, _getState(state).stopLoopTime),
            _getState(state).deferTime
        ),
        stopLoopTime: NullableUtils.getEmpty()
    })
}

export let start = (state: state) => {
    return _updateDeferTime(state)
}

export let getNow = (state: state): millisecondUnit => {
    // if (isStartSepcialTime(state)) {
    //     return NullableUtils.getExn(_getStartSpecialTime(state))
    // }

    return performance.now() - _getState(state).deferTime
}

export let getNowClockFormat = () => {
    return moment().format('M月D日H时m分s秒')
}

export let updateGameTime = (state: state, gameTime: moment.Duration) => {
    return gameTime.clone().subtract(_getState(state).deferTime + _getState(state).specialTimeDuration * 1000, 'milliseconds')
}

export let updateWholeGameTime = (state: state, gameTime: moment.Duration) => {
    return gameTime.clone().subtract(_getState(state).deferTime, 'milliseconds')
}


// export let updateSpecialTime = (state: state, specialTime: moment.Duration) => {
//     return specialTime.clone().subtract(NullableUtils.getExn(_getStartSpecialTime(state)), 'milliseconds')
// }

export let getStartTime = (state: state): number => {
    return 0
}

export let dispose = (state: state) => {
    return _setState(state, createState())
}

export let convertMinuteToMs = (m: minuteUnit): millisecondUnit => {
    return convertSToMs(m * 60)
}

export let convertSToMinute = (s: secondUnit): minuteUnit => {
    return s / 60
}

export let convertSToMs = (s: secondUnit): millisecondUnit => {
    return s * 1000
}

export let initWhenImportScene = (state: state) => {
    state = _setState(state, {
        ..._getState(state),
        stopLoopTime: NullableUtils.getEmpty(),
        deferTime: 0
    })

    return state
}



let _getStartSpecialTime = (state: state) => {
    return _getState(state).startSpecialTime
}

export let getSepcialTimeDuration = (state: state): secondUnit => {
    return NullableUtils.map(startSpecialTime => {
        return (getNow(state) - startSpecialTime) / 1000
    }, _getStartSpecialTime(state))
}

export let startSepcialTime = (state: state, key: specialTimeKey, time: millisecondUnit) => {
    state = _setState(state, {
        ..._getState(state),
        startSpecialTime: NullableUtils.return_(time),
        specialTimeKey: NullableUtils.return_(key),
    })

    // state = stop(state)

    return state
}

export let endSepcialTime = (state: state) => {
    state = _setState(state, {
        ..._getState(state),
        startSpecialTime: NullableUtils.getEmpty(),
        specialTimeKey: NullableUtils.getEmpty(),
        specialTimeDuration: _getState(state).specialTimeDuration + getSepcialTimeDuration(state)
    })

    // state = start(state)

    return state
}

// export let isStartSepcialTime = (state: state, key: specialTimeKey) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(specialTimeKey => {
//             return specialTimeKey == key
//         }, _getState(state).specialTimeKey),
//         false
//     )
// }
export let isStartSepcialTime = (state: state) => {
    return !NullableUtils.isNullable(
        _getState(state).specialTimeKey
    )
}

export let isStartSepcialTimeByKey = (state: state, key: specialTimeKey) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(specialTimeKey => {
            return specialTimeKey == key
        }, _getState(state).specialTimeKey),
        false
    )
}

export let getPassTimeFromNow = (state: state, targetTime: nullable<millisecondUnit>, defaultValue = Infinity) => {
    // return getNow(state) - NullableUtils.getWithDefault(
    //     targetTime,
    //     getStartNowForLevel(state)
    // )
    return NullableUtils.getWithDefault(
        NullableUtils.map(targetTime => {
            return getNow(state) - targetTime
        }, targetTime),
        defaultValue
    )
}

export let getPassDays = (time: momentMillisecondUnit) => {
    return moment().diff(moment(time), 'days')
}

export let getPassHours = (time: momentMillisecondUnit) => {
    return moment().diff(moment(time), 'hours')
}
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../type/StateType";
import { getState, setState } from "./CityScene";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { activeType, millisecondUnit, role, secondUnit, user } from "./type/StateType";
import * as Backend from "backend/src/Main"
import { getNow, getPassDays, getPassHours, getPassTimeFromNow } from "./Time";
import { readState } from "../../../state/State";
import moment from "moment";
import { mmdCharacter } from "./data/mmd/MMDData";
import { getBaixiName } from "../../../mod/MMDMod";

// type userDataBackend = {
//     // userName: string,
//     registerTime: secondUnit,
//     lastLoginTime: secondUnit,
//     wholeGameTime: secondUnit,
//     role: role,
//     activeType: activeType,
//     activeDuration: month,
// }

type userDataBackend = user

export let createState = (): user => {
    return {
        isLogin: false,
        // userName: NullableUtils.getEmpty(),
        registerTime: NullableUtils.getEmpty(),
        lastGetRewardTime: NullableUtils.getEmpty(),
        // wholeGameTime: NullableUtils.getEmpty(),
        role: role.None,
        activeType: activeType.No,
        activeDuration: 0,
        activeTime: NullableUtils.getEmpty(),
        activeCode: NullableUtils.getEmpty(),
        lastActiveTime: NullableUtils.getEmpty(),
    }
}

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).user)
}

let _setState = (state: state, userState: user) => {
    return setState(state, {
        ...getState(state),
        user: NullableUtils.return_(userState)
    })
}

let _mutableSetState = (state, userData, defaultRegisterTime) => {
    readState().cityScene.user = {
        ..._getState(state),
        ...userData,
        registerTime: NullableUtils.getWithDefault(userData.registerTime, defaultRegisterTime)
    }

    return state
}


export let setRegisterTime = (state: state) => {
    state = _setState(state, {
        ..._getState(state),
        registerTime: NullableUtils.return_(moment.now())
    })

    return updateUserDataBackend(state)
}

export let setLastGetRewardTime = (state: state) => {
    state = _setState(state, {
        ..._getState(state),
        lastGetRewardTime: NullableUtils.return_(moment.now())
    })

    return updateUserDataBackend(state)
}

let _getDefaultTime = () => 1755216368993

export let isCanGetActiveReward = (state: state) => {
    let { isLogin, lastGetRewardTime, activeTime, lastActiveTime } = _getState(state)

    return isLogin
        && isActive(state)
        && NullableUtils.getWithDefault(
            NullableUtils.map(lastGetRewardTime => {
                return getPassHours(lastGetRewardTime) >= 18
            }, lastGetRewardTime),
            true
        )
        && NullableUtils.isNullable(lastActiveTime)
        // && getPassDays(NullableUtils.getWithDefault(activeTime, _getDefaultTime())) <= 11
        && getPassDays(NullableUtils.getWithDefault(activeTime, _getDefaultTime())) <= 5
}

export let isCanGetCommonReward = (state: state) => {
    let { isLogin, lastGetRewardTime, registerTime } = _getState(state)

    if (NullableUtils.isNullable(registerTime)) {
        return false
    }

    return isLogin
        && NullableUtils.getWithDefault(
            NullableUtils.map(lastGetRewardTime => {
                return getPassHours(lastGetRewardTime) >= 18
            }, lastGetRewardTime),
            true
        )
        // && getPassDays(NullableUtils.getWithDefault(registerTime, _getDefaultTime())) <= 7
        && getPassDays(NullableUtils.getWithDefault(registerTime, _getDefaultTime())) <= 5
}

export let isCanGetReward = (state: state) => {
    return isCanGetActiveReward(state) || isCanGetCommonReward(state)
}

export let getRewardGemCount = (state: state) => {
    if (isCanGetActiveReward(state)) {
        // return 150000
        return 60000
    }

    // return 50000
    return 20000
}

export let getRewardArtifactCount = (state: state) => {
    if (isCanGetActiveReward(state)) {
        return 6
    }

    return 2
}

// export let setLastLoginTime = (state: state, value) => {
//     return _setState(state, {
//         ..._getState(state),
//         lastLoginTime: NullableUtils.return_(value)
//     })
// }

// export let getWholeGameTime = (state: state) => {
//     return NullableUtils.getWithDefault(_getState(state).wholeGameTime, 0)
// }

// export let setWholeGameTime = (state: state, value) => {
//     return _setState(state, {
//         ..._getState(state),
//         wholeGameTime: NullableUtils.return_(value)
//     })
// }

// let _convertMonthToMillisecond = (month) => {
//     return month * 31 * 24 * 60 * 60 * 1000
// }

export let isActive = (state: state) => {
    let data = _getState(state)

    if (data.role == role.Vip) {
        return true
    }

    // if (data.activeType == activeType.Full && getPassTimeFromNow(state, data.activeTime) <= _convertMonthToMillisecond(data.activeDuration)) {

    if (data.activeType == activeType.Full && getPassDays(data.activeTime) <= data.activeDuration) {
        return true
    }

    return false
}

export let active = (state: state, activeDuration, activeCode) => {
    state = _setState(state, {
        ..._getState(state),
        role: role.Player,
        activeType: activeType.Full,
        // activeTime: getNow(state),
        activeTime: NullableUtils.return_(moment.now()),
        // activeDuration: _convertMonthToMillisecond(1)
        activeDuration: activeDuration,
        activeCode: NullableUtils.return_(activeCode),
        lastActiveTime: _getState(state).activeTime,
    })

    return updateUserDataBackend(state)
}

export let activeOneMonth = (state: state, activeCode) => {
    return active(state, 31, activeCode)
}

export let activeVip = (state: state, activeCode) => {
    state = _setState(state, {
        ..._getState(state),
        role: role.Vip,
        activeTime: NullableUtils.return_(moment.now()),
        activeCode: NullableUtils.return_(activeCode),
        lastActiveTime: _getState(state).activeTime,
    })

    return updateUserDataBackend(state)
}


export let getUserDataFromBackend = (state: state) => {
    const defaultRegisterTime = _getDefaultTime()

    return Backend.getUserDataData<userDataBackend>().then(userData => {
        if (NullableUtils.isNullable(userData)) {
            return _mutableSetState(state, {}, defaultRegisterTime)
        }

        // userData = {
        //     ...userData,
        //     registerTime: NullableUtils.getWithDefault(userData.registerTime, defaultRegisterTime)
        // }

        return _mutableSetState(state, userData, defaultRegisterTime)
    })
}

export let updateUserDataBackend = (state: state) => {
    return Backend.setUserDataData(
        _getState(state)
    ).then(_ => state)
}

export let dispose = (state: state) => {
    // return _setState(state, createState())
    return state
}

export let clearUserData = (state: state) => {
    return _setState(state, createState())
}

export let isNeedUseGiantessProp = (state: state, character: mmdCharacter) => {
    // return Backend.isVisitor().then(isVisitor => {
    //     return character != getBaixiName()
    //         && !isVisitor
    //         && !isActive(state)
    // })

    return character != getBaixiName()
        && _getState(state).isLogin
        && !isActive(state)
}

export let setIsLogin = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isLogin: value
    })
}
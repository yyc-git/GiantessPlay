import { createInstance, getItem, setItem } from "localforage"
import { deserializeData, serializeData } from "./SerializeUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract";
import * as Backend from "backend-cloudbase"
import { ArrayUtils } from "meta3d-jiehuo-abstract";

let store = createInstance({ name: "store_backend_temp" })

let _deserializeData = (value) => {
    return NullableUtils.map(
        deserializeData,
        value
    )
}

let _getTalentUserId = () => "u23"

let _getCharacterUserId = () => "u21"

let _getRewardUserId = () => "u21"

let _getUserDataUserId = () => "u21"




export let isLocal = () => {
    return globalThis["meta3d_isLocal"]
}

export let markLocal = (value) => {
    globalThis["meta3d_isLocal"] = value
}

let _toPromise = (stream) => {
    let v

    return stream.forEach(value => {
        v = value
    }).then(_ => v)
}

export let init = (isLocal) => {
    if (isLocal) {
        markLocal(true)
        return Promise.resolve()
    }

    markLocal(false)
    return Backend.init("meta3d-local-9gacdhjl439cff76").drain()
}

export let getLoginedUserName = <T>() => {
    return store.getItem<T>("LoginedUserName").then(_deserializeData)
}

export let setLoginedUserName = <T>(data: T) => {
    return store.setItem("LoginedUserName", serializeData(data))
}

export let removeLoginedUserName = () => {
    return store.removeItem("LoginedUserName")
}

export let buildVisitorUserName = () => "visitor"

export let handleVisitor = () => {
    return getLoginedUserName().then(userName => {
        if (
            NullableUtils.getWithDefault(
                NullableUtils.map(userName => {
                    return userName == buildVisitorUserName()
                }, userName),
                false
            )
        ) {
            return removeLoginedUserName()
        }

        return
    })
}

export let isLoginOrLocal = () => {
    return getLoginedUserName().then(userName => {
        return !NullableUtils.isNullable(userName)
            || isLocal()
    })
}

export let isVisitor = () => {
    return getLoginedUserName().then(userName => {
        return NullableUtils.isNullable(userName)
            || isLocal()
    })
}


export let checkUserName = (account) => {
    if (isLocal()) {
        // return store.getItem("user").then(_deserializeData).then(data => {
        //     return data.account != account
        // })
        throw new Error("er")
    }

    return _toPromise(Backend.checkUserName(account))
}

export let checkPassword = (account, password) => {
    if (isLocal()) {
        // return store.getItem("user").then(_deserializeData).then(data => {
        //     return data.password != password
        // })
        throw new Error("er")
    }

    return _toPromise(Backend.checkPassword(account, password))
}

export let registerUser = (account, password) => {
    if (isLocal()) {
        // return store.setItem("user", serializeData({ account, password }))
        throw new Error("er")
    }

    return _toPromise(Backend.registerUser(account, password))
}


export let isLoginSuccess = (account) => {
    if (isLocal()) {
        // return store.getItem("user").then(_deserializeData).then(data => {
        //     return data.account == account
        // })
        throw new Error("er")
    }

    return _toPromise(Backend.isLoginSuccess(account))
}


let _getData = <T>(mapDataFunc, storageKey, collectionName) => {
    if (isLocal()) {
        return store.getItem<T>(storageKey).then(_deserializeData)
    }

    return getLoginedUserName().then(userName => {
        return Backend.getData(collectionName,
            userName
        ).then(d => NullableUtils.map(mapDataFunc, d))
    })
}

let _setData = (buildDataFunc, data, storageKey, collectionName) => {
    if (isLocal()) {
        return store.setItem(storageKey, serializeData(data))
    }

    return getLoginedUserName().then(userName => {
        return Backend.setData(collectionName,
            userName,
            buildDataFunc(data),
            // {
            //     data: data
            // }
        )
    })
}

export let getTalentData = <T>() => {
    return _getData(d => d.data, _getTalentUserId() + "t", "talent")
}

export let setTalentData = <T>(data: T) => {
    return _setData(data => {
        return { data: data }
    }, data, _getTalentUserId() + "t", "talent")
}

export let getCharacterData = <T>() => {
    return _getData(d => {
        return {
            littleManCharacters: d.littleManCharacters,
            giantessCharacters: d.giantessCharacters,
        }
    }, _getCharacterUserId() + "c", "character")
}

export let setCharacterData = <T>(data: T) => {
    return _setData(d => {
        return {
            littleManCharacters: d.littleManCharacters,
            giantessCharacters: d.giantessCharacters,
        }
    }, data, _getCharacterUserId() + "c", "character")
}

export let getRewardData = <T>() => {
    return _getData(d => {
        return {
            gem: d.gem,
            props: d.props,
        }
    }, _getRewardUserId() + "r", "reward")
}

export let setRewardData = <T>(data: T) => {
    return _setData(d => {
        return {
            gem: d.gem,
            props: d.props,
        }
    }, data, _getRewardUserId() + "r", "reward")
}

export let getUserDataData = <T>() => {
    return _getData(d => {
        return {
            registerTime: d.registerTime,
            lastGetRewardTime: d.lastGetRewardTime,
            role: d.role,
            activeType: d.activeType,
            activeDuration: d.activeDuration,
            activeTime: d.activeTime,
            activeCode: d.activeCode,
            lastActiveTime: d.lastActiveTime,
        }
    }, _getUserDataUserId() + "u", "userdata")
}

export let setUserDataData = <T>(data: T) => {
    return _setData(d => {
        return {
            registerTime: d.registerTime,
            lastGetRewardTime: d.lastGetRewardTime,
            role: d.role,
            activeType: d.activeType,
            activeDuration: d.activeDuration,
            activeTime: d.activeTime,
            activeCode: d.activeCode,
            lastActiveTime: d.lastActiveTime,
        }
    }, data, _getUserDataUserId() + "u", "userdata")
}


let _getAllStore = () => {
    return [
        store
    ]
}

export let removeAll = () => {
    return Promise.all(
        _getAllStore().reduce((promises, store) => {
            return ArrayUtils.push(promises, store.clear())
        }, [])
    )
}






// let _getDataForMultiplayerService = <T>(mapDataFunc, key, collectionName) => {
//     // if (isLocal()) {
//     //     return store.getItem<T>(storageKey).then(_deserializeData)
//     // }

//     return Backend.getData(collectionName,
//         key
//     ).then(d => NullableUtils.map(mapDataFunc, d))
// }

// let _setDataForMultiplayerService = (buildDataFunc, data, key, collectionName) => {
//     // if (isLocal()) {
//     //     return store.setItem(storageKey, serializeData(data))
//     // }

//     return Backend.setData(collectionName,
//         key,
//         buildDataFunc(data),
//         // {
//         //     data: data
//         // }
//     )

// }

// let _buildRoomDataKey = () => "roomdata_admin"

// export let getAllRoomData = () => {
//     return _getDataForMultiplayerService(d => {
//         return {
//             data: d.data,
//         }
//     }, _buildRoomDataKey(), "roomdata")
// }

// export let getRoomData = (roomId) => {
//     return getAllRoomData().then(data => {
//         return NullableUtils.getWithDefault(
//             NullableUtils.map(
//                 d => {
//                     return {
//                         allUserNames: d.allUserNames,
//                         isEnterGame: d.isEnterGame
//                     }
//                 },
//                 data.find(d => d.roomId == roomId)
//             ),
//             {
//                 allUserNames: [],
//                 isEnterGame: false
//             }
//         )
//     })
//     // return _getDataForMultiplayerService(d => {
//     //     return {
//     //         allUserNames: d.allUserNames,
//     //         isEnterGame: d.isEnterGame,
//     //     }
//     // }, roomId, "roomdata")
// }

// export let setRoomData = <T>(roomId, roomData: T) => {
//     return getAllRoomData().then(data => {
//         return _setDataForMultiplayerService(d => {
//             return {
//                 data: d.data,
//             }
//         }, data.map(d => {
//             if (d.roomId == roomId) {
//                 return {
//                     ...roomData,
//                     roomId: d.roomId
//                 }
//             }

//             return d
//         }), _buildRoomDataKey(), "roomdata")
//     })
// }

import * as localforage from "localforage"
import { push, range, reduce, reducePromise } from "../utils/ArrayUtils"
import { getIsDebug, getIsProduction, readState } from "../state/State"
import { ArrayUtils, NullableUtils } from "../Main"

let arrayBufferCacheStore = localforage.createInstance({ name: "store_backend_cache_arraybuffer" })
let mmdPMXCacheStore = localforage.createInstance({ name: "store_backend_cache_mmd_pmx" })
let mmdVMDCacheStore = localforage.createInstance({ name: "store_backend_cache_mmd_vmd" })
let soundCacheStore = localforage.createInstance({ name: "store_backend_cache_sound" })

let settingCacheStore = localforage.createInstance({ name: "store_backend_cache_setting" })
let customDifficultyCacheStore = localforage.createInstance({ name: "store_backend_cache_customdifficulty" })
let tipStore = localforage.createInstance({ name: "store_backend_cache_tip" })
let cameraStore = localforage.createInstance({ name: "store_backend_cache_camera" })
let uiStore = localforage.createInstance({ name: "store_backend_cache_ui" })
let operateStore = localforage.createInstance({ name: "store_backend_cache_operate" })
let versionStore = localforage.createInstance({ name: "store_backend_cache_version" })
let careerStore = localforage.createInstance({ name: "store_backend_cache_career" })


let _getCurrentVersion = () => {
    // return "u14"
    return 61
}

let _getUserId = (version) => {
    return `u${version}`
}


let _getCurrentUserId = () => {
    return _getUserId(_getCurrentVersion())
}


let _needRemovedUserIds = () => {
    // // return ["s1", "u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8", "u9", "u10", "u11", "u12", "u13"]
    return range(1, _getCurrentVersion() - 1).map(_getUserId)
}

// export let getItem = <T>(key: string) => {
//     return localforage.getItem<T>(key)
// }

// export let setItem = (key: string, value: any) => {
//     return localforage.setItem(key, value)
// }

// export let removeItem = (key: string) => {
//     return localforage.removeItem(key)
// }


// export let getCacheGlb = <T>(userId: string, id: string) => {
//     // return arrayBufferCacheStore.getItem<T>(userId + "glb").then(_deserializeData)
//     return arrayBufferCacheStore.getItem<T>(`${userId}_glb_${id}`)
// }

// export let setCacheGlb = <T>(userId: string, id, data: ArrayBuffer) => {
//     return arrayBufferCacheStore.setItem(`${userId}_glb_${id}`, data)
// }

let _buildKey = (userId, id) => {
    return `${userId}_${id}`
}

let _getAllStoreForRemove = () => {
    return [
        arrayBufferCacheStore,
        mmdPMXCacheStore,
        mmdVMDCacheStore,
        soundCacheStore,

        // settingCacheStore,
        // customDifficultyCacheStore,
        // tipStore,
        // cameraStore,
        // operateStore,
    ]
}

// export let removeAll = () => {
//     // let needRemovedUserIds
//     // if (!getIsProduction(readState())) {
//     //     needRemovedUserIds = []
//     // }
//     // else {
//     //     needRemovedUserIds = _needRemovedUserIds()
//     // }

//     // return localforage.clear().then(_ => {
//     //     return localforage.dropInstance()
//     // })

//     return Promise.all(
//         _getAllStoreForRemove().reduce((promises, store) => {
//             // return reduce(needRemovedUserIds, (promises, userId) => {
//             //     return push(promises, store.removeItem(_buildKey(userId, id)))
//             // }, promises)
//             return push(promises, store.clear())
//         }, [])
//     )
// }
export let removeAll = () => {
    return Promise.all(
        _getAllStoreForRemove().reduce((promises, store) => {
            return ArrayUtils.push(promises, store.clear())
        }, [])
    )
}

let _getCache = (store: LocalForage, isRemove = true) => <T>(id: string) => {
    let promise
    if (isRemove) {
        let needRemovedUserIds
        if (!getIsProduction(readState())) {
            needRemovedUserIds = []
        }
        else {
            needRemovedUserIds = _needRemovedUserIds()
        }

        promise = Promise.all(
            reduce(needRemovedUserIds, (promises, userId) => {
                return push(promises, store.removeItem(_buildKey(userId, id)))
            }, [])
        )
    }
    else {
        promise = Promise.resolve()
    }

    return promise.then(_ => {
        return store.getItem<T>(_buildKey(_getCurrentUserId(), id))
    })
}

let _setCache = (store: LocalForage) => <T>(id, data: T) => {
    return store.setItem<T>(_buildKey(_getCurrentUserId(), id), data)
}

export let getArrayBufferCache = _getCache(arrayBufferCacheStore)

export let setArrayBufferCache = _setCache(arrayBufferCacheStore)

export let getMMDPMXCache = _getCache(mmdPMXCacheStore)

export let setMMDPMXCache = _setCache(mmdPMXCacheStore)

export let getMMDVMDCache = _getCache(mmdVMDCacheStore)

export let setMMDVMDCache = _setCache(mmdVMDCacheStore)

export let getSoundCache = _getCache(soundCacheStore)

export let setSoundCache = _setCache(soundCacheStore)

export let getSettingCache = _getCache(settingCacheStore)

export let setSettingCache = _setCache(settingCacheStore)

export let getCustomDifficultyCache = _getCache(customDifficultyCacheStore)

export let setCustomDifficultyCache = _setCache(customDifficultyCacheStore)

export let getTipCache = _getCache(tipStore, false)

export let setTipCache = _setCache(tipStore)

// export let isGiveTipOnce = (key) => {
//     return getTipCache(key).then(cache => {
//         return NullableUtils.getWithDefault(
//             cache,
//             false
//         )
//     })
// }

export let getCameraCache = _getCache(cameraStore, false)

export let setCameraCache = _setCache(cameraStore)

export let getUICache = _getCache(uiStore, false)

export let setUICache = _setCache(uiStore)

export let getOperateCache = _getCache(operateStore, false)

export let setOperateCache = _setCache(operateStore)

export let getVersionCache = _getCache(versionStore, false)

export let setVersionCache = _setCache(versionStore)

export let getCareerCache = _getCache(careerStore, false)

export let setCareerCache = _setCache(careerStore)


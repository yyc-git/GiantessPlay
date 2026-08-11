import { getEmpty, getExn, getExnWithMessage, isNullable } from "./utils/NullableUtils"
import { getIsDebug, getIsProduction, getLoaderState, readState, setLoaderState, writeState } from "./state/State"
import { loader, needLoadResourceData, resourceId, resourceType, state } from "./type/StateType"
import { push, reduce, reducePromise } from "./utils/ArrayUtils"
import { TextureLoader, ImageLoader, Texture, ObjectLoader } from "three"
import { ArrayUtils, MMD, NullableUtils, NumberUtils } from "./Main"
import { MMDLoaderAnimationObject2 } from "./three/MMDLoader"
import { loadAudio } from "./audio/Audio"
import { List, Map } from "immutable"
import { getArrayBufferCache, getMMDPMXCache, getMMDVMDCache, getSoundCache, setArrayBufferCache, setMMDPMXCache, setMMDVMDCache, setSoundCache } from "./storage/Storage"
import { requireCheck, test } from "./utils/Contract"

/*! local variable
* 
*/
let _needLoadResourceDataForRetry = []
let _retryTimes = 0

// 新增：超时控制相关变量
let _loadTimeouts = Map<string, number>() // 存储每个加载任务的超时ID
// const DEFAULT_TIMEOUT = 30000 // 默认超时时间30秒
// const MMD_TIMEOUT = 60000 // MMD资源超时时间60秒
// const DEFAULT_TIMEOUT = 20000
const DEFAULT_TIMEOUT = 15000
// const MMD_TIMEOUT = 60000
const MMD_TIMEOUT = 50000

let _onProgressForMMD = (xhr) => {
    if (xhr.lengthComputable) {
        let percentComplete = xhr.loaded / xhr.total * 100;
        // Console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
}

let _buildCacheKeyByIdAndPath = (id, path) => {
    return `${id}_${path}`
}

// 新增：设置超时的辅助函数
let _setLoadTimeout = (id, timeoutMs, reject) => {
    const timeoutId = setTimeout(() => {
        reject(new Error(`Load timeout for resource ${id} after ${timeoutMs}ms`));
    }, timeoutMs);

    _loadTimeouts.set(id, timeoutId);
    return timeoutId;
}

// 新增：清除超时的辅助函数
let _clearLoadTimeout = (id) => {
    const timeoutId = _loadTimeouts.get(id);
    if (timeoutId) {
        clearTimeout(timeoutId);
        _loadTimeouts.delete(id);
    }
}

let _loadMMD = (markLoadedOneVMDFunc, id, [url, allVMDData]) => {
    let loader = MMD.getMMDLoader(readState())

    return getMMDPMXCache<ArrayBuffer>(id).then(cache => {
        return reducePromise(allVMDData, (result, [animationName, vmdPath]) => {
            return getMMDVMDCache(_buildCacheKeyByIdAndPath(id, vmdPath)).then(vmdBuffer => {
                return push(result, [
                    animationName,
                    vmdBuffer
                ])
            })
        }, []).then(allVMDBufferData => [cache, allVMDBufferData])
    }).then(([pmxBuffer, allVMDBufferData]: [ArrayBuffer, any]) => {
        return new Promise<MMDLoaderAnimationObject2>((resolve, reject) => {
            // 设置MMD加载超时
            const timeoutId = _setLoadTimeout(id, MMD_TIMEOUT, reject);
            // const timeoutId = _setLoadTimeout(id, Math.random() < 0.2 ? MMD_TIMEOUT : 50, reject);
            // const timeoutId = _setLoadTimeout(id, 50, reject);

            loader.loadWithAnimation2([url, pmxBuffer],
                (buffer) => {
                    return setMMDPMXCache<ArrayBuffer>(id, buffer)
                },
                (path, buffer) => {
                    return setMMDVMDCache(_buildCacheKeyByIdAndPath(id, path), buffer)
                },
                markLoadedOneVMDFunc,
                [allVMDData, allVMDBufferData],
                (mmd) => {
                    _clearLoadTimeout(id); // 清除超时
                    resolve(mmd)
                }, _onProgressForMMD, (error) => {
                    _clearLoadTimeout(id); // 清除超时
                    // _handleFetchError(error);
                    reject(error)
                })
        })
    })
        .catch(e => {
            _clearLoadTimeout(id); // 确保超时被清除
            // _handleLoadFail([url, allVMDData], id, resourceType.MMD)
        })
}

let _loadAudio = (paths, id, type) => {
    if (paths.length != 1) {
        throw new Error(`paths: ${paths} .length should be 1`)
    }

    let path = ArrayUtils.getExn(paths, 0)

    return getSoundCache(_buildCacheKeyByIdAndPath(id, path)).then(cache => {
        return NullableUtils.getWithDefaultFunc(
            cache,
            () => {
                return _fetch(path, id, type)
                    .then((response: Response) => {
                        return response.blob()
                    })
                    // .catch(e => {
                    //     _handleLoadFail(paths, id, type)
                    // })
                    .then((cache: Blob) => {
                        return setSoundCache(_buildCacheKeyByIdAndPath(id, path), cache)
                    })
            }
        )
    })
        .then((blob: Blob) => {
            return new Promise((resolve, reject) => {
                // 设置音频加载超时
                const timeoutId = _setLoadTimeout(id, DEFAULT_TIMEOUT, reject);

                loadAudio(URL.createObjectURL(blob), "mp3")
                    .then(audio => {
                        _clearLoadTimeout(id);
                        resolve(audio);
                    })
                    .catch(error => {
                        _clearLoadTimeout(id);
                        reject(error);
                    });
            });
        })
        .catch(e => {
            _clearLoadTimeout(id);
            // _handleLoadFail(path, id, type)
        })
}

let _getMessage = (e) => {
    return NullableUtils.getWithDefault(e.message, e)
}

let _handleFetchError = (e) => {
    if (_getMessage(e).includes("network request error") ||
        _getMessage(e).includes("Load timeout")) {
        throw e
    }

    throw new Error(`network request error: ${_getMessage(e)}`)
}


let _addRetryData = (needLoadResourceDataForRetry, path, id, type) => {
    if (NullableUtils.isNullable(needLoadResourceDataForRetry.find(d => d.id == id))) {
        return ArrayUtils.push(
            needLoadResourceDataForRetry, { id, path, type }
        )
    }

    return needLoadResourceDataForRetry
}

let _handleLoadFail = (path, id, type) => {
    _addRetryData(_needLoadResourceDataForRetry, path, id, type)
}

let _fetch = (path, id, type) => {
    try {
        return new Promise((resolve, reject) => {
            // 设置fetch超时
            const timeoutId = _setLoadTimeout(id, DEFAULT_TIMEOUT, reject);

            fetch(path)
                .then(response => {
                    _clearLoadTimeout(id);
                    resolve(response);
                })
                .catch(error => {
                    _clearLoadTimeout(id);
                    reject(error);
                });
        });
    }
    catch (e) {
        // _handleLoadFail(path, id, type)
        _handleFetchError(e)
    }
}

let _computeCount = (needLoadResourceData: needLoadResourceData) => {
    return needLoadResourceData.reduce((result, { id, path, type }) => {
        result += 1

        if (type == resourceType.MMD) {
            let [_, allVMDData] = path
            return result + allVMDData.length
        }

        return result
    }, 0)
}

let _handleLoadedOneResource = (state: state, setPercentFunc, count) => {
    let loadedIndex = getLoaderState(state).loadedIndex

    // setPercentFunc(Math.floor((loadedIndex + 1) / count * 100))
    setPercentFunc(NumberUtils.lessThan(Math.floor((loadedIndex + 1) / count * 100), 100))

    state = setLoaderState(state, {
        ...getLoaderState(state),
        loadedIndex: loadedIndex + 1
    })

    return state
}

let _loadSingle = (setPercentFunc, count, id, path, type) => {
    let promise

    if (type == resourceType.MMD) {
        promise = _loadMMD(
            () => {
                let state = readState()
                state = _handleLoadedOneResource(state, setPercentFunc, count)
                let _ = writeState(state)
            },
            id, path as [string, Array<[string, string]>])
    }
    else if (type == resourceType.Audio) {
        promise = _loadAudio(path as Array<string>, id, type)
    }
    else {
        let path_: string = path as string

        switch (type) {
            case resourceType.ArrayBuffer:
                promise = getArrayBufferCache(id).then(cache => {
                    return NullableUtils.getWithDefaultFunc(
                        cache,
                        () => {
                            let path_: string = path as string

                            return _fetch(path_, id, type)
                                .then((response: Response) => {
                                    return response.arrayBuffer()
                                })
                                .then((cache: ArrayBuffer) => {
                                    return setArrayBufferCache(id, cache)
                                })
                        }
                    )
                })
                // .catch(e => {
                //     _handleLoadFail(path, id, type)
                // })
                break
            case resourceType.Texture:
                promise = new Promise((resolve, reject) => {
                    // 设置纹理加载超时
                    const timeoutId = _setLoadTimeout(id, DEFAULT_TIMEOUT, reject);

                    const textureLoader = new TextureLoader();
                    textureLoader.load(
                        path_,
                        (texture) => {
                            _clearLoadTimeout(id);
                            resolve(texture);
                        },
                        () => { },
                        (error) => {
                            _clearLoadTimeout(id);
                            reject(error);
                        }
                    );
                })
                // .catch(e => {
                //     _handleLoadFail(path, id, type)
                // })
                break
            default:
                throw new Error("err")
        }
    }

    return promise.then(resource => {
        let state = readState()
        state = _handleLoadedOneResource(state, setPercentFunc, count)

        if (!NullableUtils.isNullable(resource)) {
            state = setResource(state, id, resource)
        }
        else {
            _handleLoadFail(path, id, type)
        }

        return writeState(state)
    }).catch(error => {
        _clearLoadTimeout(id); // 确保错误时清除超时
        // throw error;

        _handleLoadFail(path, id, type)
    })
}

let _chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        results.push(array.slice(i, i + chunkSize));
    }
    return results;
}

let _getNeedLoadResourceData = (resourceData, state) => {
    return resourceData.filter(({ id, path, type }) => {
        return !isResourceLoaded(state, id)
    })
}

// // 新增：全局加载超时检测
// let _createGlobalTimeout = (timeoutMs, groupCount) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             reject(new Error(`Global loading timeout after ${timeoutMs}ms for ${groupCount} resource groups`));
//         }, timeoutMs);
//     });
// }

let _handleAllEmptyResource = (state, needLoadResourceData, needLoadResourceDataForRetry) => {
    return _getNeedLoadResourceData(needLoadResourceData, state).reduce((needLoadResourceDataForRetry, { id, path, type }) => {
        return _addRetryData(needLoadResourceDataForRetry, path, id, type)
    }, needLoadResourceDataForRetry)
}

let _load = (state, setPercentFunc, resourceData, retryCount) => {
    _needLoadResourceDataForRetry = []
    setPercentFunc(0)
    state = setLoaderState(state, {
        ...getLoaderState(state),
        loadedIndex: 0
    })

    let needLoadResourceData = _getNeedLoadResourceData(resourceData, state)
    let count = _computeCount(needLoadResourceData)
    let _ = writeState(state)

    // // 计算全局超时时间（基于资源数量）
    // // const estimatedTimePerResource = 10000; // 每个资源预估10秒
    // const estimatedTimePerResource = 5000;
    // // const globalTimeoutMs = Math.max(300000, count * estimatedTimePerResource); // 最少5分钟
    // const globalTimeoutMs = NumberUtils.clamp(count * estimatedTimePerResource, 200000, 600000);

    // 将需要加载的资源分成每组最多5个
    // const groups = _chunkArray(needLoadResourceData, getIsDebug(state) ? 1000 : 5)
    const groups = _chunkArray(needLoadResourceData, getIsProduction(state) ? 5 : 1000)

    //// 使用Promise.race来同时进行分组加载和全局超时检测
    const loadPromise = groups.reduce((promiseChain, group, groupIndex) => {
        return promiseChain.then(chainResults => {
            // 并行加载当前组的所有资源
            return Promise.all(
                group.map(item =>
                    _loadSingle(setPercentFunc, count, item.id, item.path, item.type)
                )
            ).then(currentResult => {
                return [...chainResults, ...currentResult];
            });
        });
    }, Promise.resolve([]));

    // console.log(groups, _needLoadResourceDataForRetry)
    // // 竞争：加载完成 vs 全局超时
    // return Promise.race([
    //     loadPromise,
    //     _createGlobalTimeout(globalTimeoutMs, groups.length)
    // ])

    return loadPromise.then(() => {
        // 清除所有未完成的超时
        _loadTimeouts.forEach((timeoutId, id) => {
            clearTimeout(timeoutId);
        });
        _loadTimeouts.clear();

        let state = readState()

        _needLoadResourceDataForRetry = _handleAllEmptyResource(state, needLoadResourceData, _needLoadResourceDataForRetry)

        if (_needLoadResourceDataForRetry.length > 0) {
            if (_retryTimes > retryCount) {
                // throw new Error("retry loading too many times")
                throw new Error(`加载失败，请刷新后重新进入游戏
retry loading too many times, please refresh page and enter game`)
            }

            _retryTimes += 1
            return _load(state, setPercentFunc, _needLoadResourceDataForRetry, retryCount)
        }

        return state
    })
    // .catch(error => {
    //     // 清除所有未完成的超时
    //     _loadTimeouts.forEach((timeoutId, id) => {
    //         clearTimeout(timeoutId);
    //     });
    //     _loadTimeouts.clear();

    //     _handleFetchError(error);
    // })
}

let _computeRetryCount = (state: state, resourceData) => {
    let count = _computeCount(_getNeedLoadResourceData(resourceData, state))

    if (count <= 10) {
        return 20
    }
    else if (count <= 50) {
        return 15
    }
    else if (count <= 200) {
        return 8
    }
    else {
        return 3
    }
}

export let load = (state: state, resourceData: needLoadResourceData, setPercentFunc) => {
    _retryTimes = 0
    _loadTimeouts.clear(); // 开始新的加载前清除所有超时

    return _load(state, setPercentFunc, resourceData, _computeRetryCount(state, resourceData))
}

export let setResource = (state: state, id, resource) => {
    return setLoaderState(state, {
        ...getLoaderState(state),
        resourceData: getLoaderState(state).resourceData.set(id, resource)
    })
}

export let getResourceNullable = <resource>(state: state, id: resourceId): resource => {
    return getLoaderState(state).resourceData.get(id)
}

export let getResource = <resource>(state: state, id: resourceId): resource => {
    return getExnWithMessage(getResourceNullable(state, id), `加载资源失败：${id}，请刷新页面再试。
    resource load fail: ${id}, please refresh page and try again`)
}

export let removeResource = (state: state, id: resourceId) => {
    return setLoaderState(state, {
        ...getLoaderState(state),
        resourceData: getLoaderState(state).resourceData.remove(id)
    })
}

export let removeResources = (state: state, getResourceIdFunc, levelNumber) => {
    return levelNumber.reduce((state, levelNumber) => {
        return removeResource(state, getResourceIdFunc(levelNumber))
    }, state)
}

export let isResourceLoaded = (state: state, id: resourceId) => {
    // return getLoaderState(state).resourceData.has(id)
    return !NullableUtils.isNullable(getResourceNullable(state, id))
}

export let getNeedLoadResourceData = (state: state) => {
    return getLoaderState(state).needLoadResourceData
}

export let addToNeedLoadResourceData = (state: state, needLoadResourceData: needLoadResourceData) => {
    return setLoaderState(state, {
        ...getLoaderState(state),
        needLoadResourceData: getLoaderState(state).needLoadResourceData.concat(needLoadResourceData),
    })
}

export let clearNeedLoadResourceData = (state: state) => {
    return setLoaderState(state, {
        ...getLoaderState(state),
        needLoadResourceData: ArrayUtils.create()
    })
}

export let getTextureImageBase64 = (state: state, resourceId) => {
    return (getResource<Texture>(state, resourceId).source.toJSON() as any).url
}

export let createState = (): loader => {
    return {
        needLoadResourceData: ArrayUtils.create(),
        loadedIndex: 0,

        resourceData: Map(),

        fbxLoader: NullableUtils.getEmpty(),
        dracoLoader: NullableUtils.getEmpty(),
        ktx2Loader: NullableUtils.getEmpty()
    }
}
import { ArrayUtils } from "../Main";
import { getArticluatedAnimationState, getStatsState, setArticluatedAnimationState } from "../state/State";
// import TWEEN from 'three/examples/jsm/libs/tween.module.min';
import TWEEN, { Group } from "../three/tween.module"
import { state, articluatedAnimation, tweenId, tween, articluatedAnimationStatus } from "../type/StateType";
import { reducePromise } from "../utils/ArrayUtils";
import { getExn, getWithDefault, map } from "../utils/NullableUtils";
import { Map } from "immutable"

let _writePromiseState = (writeStateFunc, statePromise) => {
    return statePromise.then(writeStateFunc)
}

export let createState = (): articluatedAnimation => {
    return {
        group: new TWEEN.Group(),
        // reallocateTweens: ArrayUtils.create(),

        articluatedAnimationTweens: Map(),
        articluatedAnimationStatus: Map()
    }
}

// export let createTween = (
//     [
//         readStateFunc,
//         writeStateFunc,
//     ],
//     object, {
//         onStart = (state: state, object) => Promise.resolve(state),
//         onUpdate = (state, object, elapsed) => Promise.resolve(state),
//         onRepeat = (state, object) => Promise.resolve(state),
//         onComplete = (state, object) => Promise.resolve(state),
//         onStop = (state, object) => Promise.resolve(state),
//     }): TWEEN.Tween => {
//     return new TWEEN.Tween(object).onStart((object) => {
//         return _writePromiseState(writeStateFunc, onStart(readStateFunc(), object))
//     }).onUpdate((object, elapsed) => {
//         return _writePromiseState(writeStateFunc, onUpdate(readStateFunc(), object, elapsed))
//     }).onRepeat((object) => {
//         return _writePromiseState(writeStateFunc, onRepeat(readStateFunc(), object))
//     }).onComplete((object) => {
//         return _writePromiseState(writeStateFunc, onComplete(readStateFunc(), object))
//     }).onStop((object) => {
//         return _writePromiseState(writeStateFunc, onStop(readStateFunc(), object))
//     })
// }


// export let to = (tween, target, duration) => {
//     return tween.to(target, duration)
// }

// export let chain = (tween1, tween2s: Array<tween>) => {
//     return tween1.chain(...tween2s)
// }


// let _setArticluatedAnimationStatus = (state, articluatedAnimationName: string, status: articluatedAnimationStatus) => {
//     return setArticluatedAnimationState(state, {
//         ...getArticluatedAnimationState(state),
//         articluatedAnimationStatus: getArticluatedAnimationState(state).articluatedAnimationStatus.set(articluatedAnimationName, status)
//     })
// }

// // export let addArticluatedAnimation = <specificState>([
// //     readStateFunc,
// //     writeStateFunc,
// //     getAbstractStateFunc,
// //     setAbstractStateFunc
// // ], state: specificState, articluatedAnimationName: string, tweens, { onStart = (state) => Promise.resolve(state),
// //     onComplete = (state) => Promise.resolve(state) }): specificState => {
// //     // tweens[0].onStart = (object) => {
// //     //     tweens[0].onStart(object).then(() => {
// //     //         _writePromiseState(writeStateFunc, onStart(readStateFunc()).then(state => {
// //     //             return _setArticluatedAnimationStatus(state, articluatedAnimationName, articluatedAnimationStatus.Playing)
// //     //         }))
// //     //     })
// //     // }
// //     // tweens[0].onComplete = (object) => {
// //     //     tweens[0].onComplete(object).then(() => {
// //     //         _writePromiseState(writeStateFunc, onComplete(readStateFunc()).then(state => {
// //     //             return _setArticluatedAnimationStatus(state, articluatedAnimationName, articluatedAnimationStatus.NotPlaying)
// //     //         }))
// //     //     })
// //     // }

// //     let _onStartCallback = tweens[0]._onStartCallback
// //     tweens[0].onStart((object) => {
// //         _onStartCallback(object).then(() => {
// //             _writePromiseState(writeStateFunc, onStart(readStateFunc()).then((state: specificState) => {
// //                 return setAbstractStateFunc(state, _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.Playing))
// //             }))
// //         })
// //     })

// //     let _onCompleteCallback = tweens[0]._onCompleteCallback
// //     tweens[0].onComplete((object) => {
// //         _onCompleteCallback(object).then(() => {
// //             _writePromiseState(writeStateFunc, onComplete(readStateFunc()).then((state: specificState) => {
// //                 return setAbstractStateFunc(state, _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.NotPlaying))
// //             }))
// //         })
// //     })


// //     let abstractState = _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.NotPlaying)

// //     return setAbstractStateFunc(state, setArticluatedAnimationState(abstractState, {
// //         ...getArticluatedAnimationState(abstractState),
// //         articluatedAnimationTweens: getArticluatedAnimationState(abstractState).articluatedAnimationTweens.set(articluatedAnimationName, tweens)
// //     }))
// // }

// export let removeArticluatedAnimation = (state: state, articluatedAnimationNames: Array<string>): state => {
//     return articluatedAnimationNames.reduce((state, articluatedAnimationName) => {
//         getExn(getArticluatedAnimationState(state).articluatedAnimationTweens.get(articluatedAnimationName)).forEach(articluatedAnimationTween => {
//             TWEEN.remove(articluatedAnimationTween)
//         })

//         return setArticluatedAnimationState(state, {
//             ...getArticluatedAnimationState(state),
//             articluatedAnimationStatus: getArticluatedAnimationState(state).articluatedAnimationStatus.remove(articluatedAnimationName),
//             articluatedAnimationTweens: getArticluatedAnimationState(state).articluatedAnimationTweens.remove(articluatedAnimationName)
//         })
//     }, state)
// }

// export let removeAllArticluatedAnimations = (state: state): state => {
//     return removeArticluatedAnimation(state, Array.from(getArticluatedAnimationState(state).articluatedAnimationTweens.keys()))
// }

// export let playArticluatedAnimation = <specificState>(state: specificState,
//     [
//         readStateFunc,
//         writeStateFunc,
//         getAbstractStateFunc,
//         setAbstractStateFunc
//     ],
//     articluatedAnimationName: string,
//     tweens,
//     { onStart = (state) => Promise.resolve(state),
//         onComplete = (state) => Promise.resolve(state) },
//     time = undefined): specificState => {
//     let _onStartCallback = tweens[0]._onStartCallback
//     tweens[0].onStart((object) => {
//         return _onStartCallback(object).then(() => {
//             return _writePromiseState(writeStateFunc, onStart(readStateFunc()).then((state: specificState) => {
//                 return setAbstractStateFunc(state, _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.Playing))
//             }))
//         })
//     })

//     let _onCompleteCallback = tweens[0]._onCompleteCallback
//     tweens[0].onComplete((object) => {
//         return _onCompleteCallback(object).then(() => {
//             return _writePromiseState(writeStateFunc, onComplete(readStateFunc()).then((state: specificState) => {
//                 let abstractState = _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.NotPlaying)

//                 abstractState = removeArticluatedAnimation(abstractState, [articluatedAnimationName])

//                 return setAbstractStateFunc(state, abstractState)
//             }))
//         })
//     })

//     let abstractState = _setArticluatedAnimationStatus(getAbstractStateFunc(state), articluatedAnimationName, articluatedAnimationStatus.NotPlaying)


//     tweens.forEach(articluatedAnimationTween => {
//         articluatedAnimationTween.start(time)
//     })

//     return setAbstractStateFunc(state, setArticluatedAnimationState(abstractState, {
//         ...getArticluatedAnimationState(abstractState),
//         articluatedAnimationTweens: getArticluatedAnimationState(abstractState).articluatedAnimationTweens.set(articluatedAnimationName, tweens)
//     }))
// }

// let _updateArticluatedAnimation = <specificState>(state: specificState, [readStateFunc, writeStateFunc, getAbstractStateFunc], articluatedAnimationNames: Array<string>, time = undefined): Promise<specificState> => {
//     return reducePromise(articluatedAnimationNames, (state, articluatedAnimationName) => {
//         return reducePromise(getExn(getArticluatedAnimationState(getAbstractStateFunc(state)).articluatedAnimationTweens.get(articluatedAnimationName)), (state, articluatedAnimationTween) => {
//             writeStateFunc(state)

//             if (articluatedAnimationTween.isPlaying()) {
//                 return articluatedAnimationTween.update(time, false).then(_ => {
//                     return readStateFunc()
//                 })
//             }

//             return Promise.resolve(readStateFunc())
//         }, state)
//     }, state)
// }

// // export let updateAllArticluatedAnimations = <specificState>(state: specificState, [readStateFunc, writeStateFunc, getAbstractStateFunc], time = undefined): Promise<specificState> => {
// //     return _updateArticluatedAnimation(state, [readStateFunc, writeStateFunc, getAbstractStateFunc], Array.from(getArticluatedAnimationState(getAbstractStateFunc(state)).articluatedAnimationTweens.keys()), time)
// // }

// export let isArticluatedAnimationPlaying = (state: state, articluatedAnimationName: string) => {
//     return getWithDefault(
//         map(
//             tweens => {
//                 return tweens.reduce((isPlaying, articluatedAnimationTween) => {
//                     if (isPlaying) {
//                         return true
//                     }

//                     return articluatedAnimationTween.isPlaying()
//                 }, false)
//             },
//             getArticluatedAnimationState(state).articluatedAnimationTweens.get(articluatedAnimationName),
//         ),
//         false
//     )
// }

// export let getArticluatedAnimationStatus = (state, articluatedAnimationName: string) => {
//     return getExn(getArticluatedAnimationState(state).articluatedAnimationStatus.get(articluatedAnimationName))
// }

export let dispose = (state: state) => {
    return setArticluatedAnimationState(state, createState())
}



// export let createTween = (state: state, object): [state, tween] => {
//     let { reallocateTweens } = getArticluatedAnimationState(state)

//     if (reallocateTweens.length > 0) {
//         let result = ArrayUtils.popLastOne(reallocateTweens)

//         return [state, result.reset(object)]
//     }


//     let result = new TWEEN.Tween(object)
//     // Console.log("create:", result.getId())
//     return [state, result]
// }
export let createTween = (state: state, object) => {
    // let { reallocateTweens } = getArticluatedAnimationState(state)

    // if (reallocateTweens.length > 0) {
    //     let result = ArrayUtils.popLastOne(reallocateTweens)

    //     return result.reset(object)
    // }


    let result = new TWEEN.Tween(object)
    return result
}

export let addTween = (state: state, tween) => {
    getArticluatedAnimationState(state).group.add(tween)
}

export let removeTween = (state: state, tween) => {
    // tween.remove()

    getArticluatedAnimationState(state).group.remove(tween)

    // let _ = ArrayUtils.push(getArticluatedAnimationState(state).reallocateTweens, tween)
}

export let stopTweens = (tweens) => {
    tweens.forEach(tween => tween.stop())
}

// export let endTweens = (tweens) => {
//     tweens.forEach(tween => tween.end())
// }

export let pauseTweens = (tweens) => {
    tweens.forEach(tween => tween.pause())
}

export let resumeTweens = (tweens) => {
    tweens.forEach(tween => tween.resume())
}

export let removeTweens = (state: state, tweens: Array<tween>) => {
    // Console.log("remove:", tweens.map(tween => tween.getId()))
    tweens.forEach(tween => {
        return removeTween(state, tween)
    })
}

// let _reallocateTweenData = (group: Group) => {
//     let _tweens = (group as any)._tweens


// }

export let updateAllArticluatedAnimations = <specificState>(state: specificState, [readStateFunc, writeStateFunc, getAbstractStateFunc], time = undefined): Promise<specificState> => {
    writeStateFunc(state)

    return getArticluatedAnimationState(getAbstractStateFunc(state)).group.update(time).then((_) => {
        // return getArticluatedAnimationState(getAbstractStateFunc(state)).group.update(time, false).then((_) => {
        return Promise.resolve(readStateFunc())
    })
}

export let removeAllArticluatedAnimations = (state: state): state => {
    // TWEEN.removeAll()
    getArticluatedAnimationState(state).group.removeAll()

    return state
}
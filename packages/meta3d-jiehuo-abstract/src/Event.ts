import { getEventState, setEventState } from "./state/State"
import { customEvent, event, eventName, gotData, handler, handlerByReadWriteState, handlerForGetData, handlerWithUserData, state, userData } from "./type/StateType"
import { Map, List } from "immutable"
import { getExn, getWithDefault, isNullable, map } from "./utils/NullableUtils"
import { reducePromise } from "./utils/ArrayUtils"
import { nullable } from "./utils/nullable"
import { isMobile } from "./Device"
import { fromEvent, fromPromise, of, since, tap } from "most"
import { getPageX, getPageY } from "meta3d-utils/src/LandscapeUtils"
import { ArrayUtils, MutableMapUtils, NullableUtils } from "./Main"

export let createState = (): event => {
    return {
        handlers: Map(),
        // handlersWithUserData: Map(),
        handlersWithUserData: MutableMapUtils.create(),
        handlerForGetData: Map(),
        handlersByReadWriteState: Map(),
    }
}

export let on = <specficState>(state: state, name: eventName, handler: handler<specficState>) => {
    return setEventState(state, {
        ...getEventState(state),
        handlers: getEventState(state).handlers.set(name,
            getWithDefault(
                map(
                    handlers => {
                        return handlers.push(handler)
                    },
                    getEventState(state).handlers.get(name)
                ),
                List([handler])
            )
        )
    })
}

export let onWithUserData = <specficState>(state: state, name: eventName, handler: handlerWithUserData<specficState>) => {
    return setEventState(state, {
        ...getEventState(state),
        // handlersWithUserData: getEventState(state).handlersWithUserData.set(name,
        //     getWithDefault(
        //         map(
        //             handlers => {
        //                 return handlers.push(handler)
        //             },
        //             getEventState(state).handlersWithUserData.get(name)
        //         ),
        //         List([handler])
        //     )
        // )
        handlersWithUserData: MutableMapUtils.set(getEventState(state).handlersWithUserData, name,
            getWithDefault(
                map(
                    handlers => {
                        return ArrayUtils.push(handlers, handler)
                    },
                    MutableMapUtils.get(getEventState(state).handlersWithUserData, name)
                ),
                [handler]
            )
        )
    })
}

export let onForGetData = <specficState>(state: state, name: eventName, handler: handlerForGetData<specficState>) => {
    return setEventState(state, {
        ...getEventState(state),
        handlerForGetData: getEventState(state).handlerForGetData.set(name, handler)
    })
}

export let onByReadWriteState = <specficState>(state: state, name: eventName, handler: handlerByReadWriteState) => {
    return setEventState(state, {
        ...getEventState(state),
        handlersByReadWriteState: getEventState(state).handlersByReadWriteState.set(name,
            getWithDefault(
                map(
                    handlers => {
                        return handlers.push(handler)
                    },
                    getEventState(state).handlersByReadWriteState.get(name)
                ),
                List([handler])
            )
        )
    })
}

export let off = <specficState>(state: state, name: eventName, handler: handler<specficState>) => {
    return setEventState(state, {
        ...getEventState(state),
        handlers: getEventState(state).handlers.set(name,
            getWithDefault(
                map(
                    handlers => {
                        return handlers.filter(value => value !== handler)
                    },
                    getEventState(state).handlers.get(name)
                ),
                List()
            )
        )
    })
}

export let offAll = <specficState>(state: state, name: eventName) => {
    return setEventState(state, {
        ...getEventState(state),
        handlers: getEventState(state).handlers.set(name, List()),
        // handlersWithUserData: getEventState(state).handlersWithUserData.set(name, List()),
        handlersWithUserData: MutableMapUtils.set(getEventState(state).handlersWithUserData, name, ArrayUtils.create()),
        handlersByReadWriteState: getEventState(state).handlersByReadWriteState.set(name, List()),
    })
}

// export let trigger = <specificState>(state: specificState, getAbstractStateFunc, name: eventName, userData): Promise<specificState> => {
//     return getWithDefault(
//         map(
//             handlers => {
//                 return reducePromise<specificState, handler<specificState>>(handlers.toArray(), (state, handler) => {
//                     return handler(state, {
//                         name,
//                         userData
//                     })
//                 }, state)
//             },
//             getEventState(getAbstractStateFunc(state)).handlers.get(name)
//         ),
//         new Promise<specificState>((resolve, reject) => {
//             resolve(state)
//         })
//     )
// }
export const trigger = async <specificState>(
    state: specificState,
    getAbstractStateFunc,
    eventName: string,
    userData: any
): Promise<specificState> => {
    // 获取事件处理器列表
    const handlers = getEventState(getAbstractStateFunc(state))
        .handlers
        .get(eventName)
        ?.toArray() ?? [];

    // // 如果无处理器，直接返回当前状态
    // if (handlers.length === 0) {
    //     return state;
    // }

    // 顺序执行所有处理器
    let currentState = state;
    for (const handler of handlers) {
        currentState = await handler(currentState, {
            name: eventName,
            userData
        });
    }

    return currentState;
};

// export let triggerWithUserData = <specificState>(state: specificState, getAbstractStateFunc, name: eventName, userData: userData, filterFunc = (state, userData) => true): Promise<[specificState, userData]> => {
//     return getWithDefault(
//         map(
//             handlers => {
//                 return reducePromise<[specificState, userData], handlerWithUserData<specificState>>(handlers.toArray(), ([state, userData], handler) => {
//                     if (!filterFunc(state, userData)) {
//                         return Promise.resolve([state, userData])
//                     }

//                     return handler(state, {
//                         name,
//                         userData
//                     })
//                 }, [state, userData])
//             },
//             getEventState(getAbstractStateFunc(state)).handlersWithUserData.get(name)
//         ),
//         new Promise<[specificState, userData]>((resolve, reject) => {
//             resolve([state, userData])
//         })
//     )
// }


export const triggerWithUserData = async <specificState>(state: specificState, getAbstractStateFunc, name: eventName, userData: userData): Promise<[specificState, userData]> => {
    // 获取事件处理器列表
    // const handlers = getEventState(getAbstractStateFunc(state))
    //     .handlersWithUserData
    //     .get(name)
    //     ?.toArray() ?? [];
    const handlers = MutableMapUtils.getWithDefault(
        getEventState(getAbstractStateFunc(state))
            .handlersWithUserData,
        name,
        []
    )

    // // 如果无处理器，直接返回当前状态
    // if (handlers.length === 0) {
    //     return [state, userData]
    // }

    // 顺序执行所有处理器
    // let currentState = state;
    // let currentUserData = userData
    for (const handler of handlers) {
        [state, userData] = await handler(state, {
            name,
            userData
        });
    }

    return [state, userData];
};

export const triggerWithUserDataWithFilter = async <specificState>(state: specificState, getAbstractStateFunc, name: eventName, userData: userData, filterFunc): Promise<[specificState, userData]> => {
    // 获取事件处理器列表
    const handlers = MutableMapUtils.getWithDefault(
        getEventState(getAbstractStateFunc(state))
            .handlersWithUserData,
        name,
        []
    )

    // // 如果无处理器，直接返回当前状态
    // if (handlers.length === 0) {
    //     return [state, userData]
    // }

    // 顺序执行所有处理器
    // let currentState = state;
    // let currentUserData = userData
    for (const handler of handlers) {
        if (!filterFunc(state, userData)) {
            // return [currentState, currentUserData]
            continue
        }

        [state, userData] = await handler(state, {
            name,
            userData
        });
    }

    return [state, userData];
};

// export const triggerForGetData = <specificState>(state: specificState, getAbstractStateFunc, name: eventName, defaultValue: gotData, userData?: userData): [specificState, gotData] => {
export const triggerForGetData = <specificState>(state: specificState, getAbstractStateFunc, name: eventName, defaultValue: gotData, userData?: userData): gotData => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(handler => {
            return handler(state, {
                name,
                userData
            })
        }, getEventState(getAbstractStateFunc(state))
            .handlerForGetData
            .get(name)
        ),
        defaultValue
    )
};

export let triggerByReadWriteState = <specificState>(state: specificState, getAbstractStateFunc, name: eventName, userData): Promise<void> => {
    return getWithDefault(
        map(
            handlers => {
                return reducePromise<void, handlerByReadWriteState>(handlers.toArray(), (result, handler) => {
                    return handler({
                        name,
                        userData
                    })
                }, null)
            },
            getEventState(getAbstractStateFunc(state)).handlersByReadWriteState.get(name)
        ),
        new Promise<void>((resolve, reject) => {
            resolve()
        })
    )
}

export let getPointerDownEventName = () => "meta3d_pointerdown"

export let getPointerUpEventName = () => "meta3d_pointerup"

export let getPointerTapEventName = () => "meta3d_pointertap"

export let getKeyDownEventName = () => "meta3d_keydown"

export let getKeyUpEventName = () => "meta3d_keyup"

export let getSingleClickEventName = () => "meta3d_singleclick"

export let getSingleClickForTempEventName = () => "meta3d_singleclick_for_temp"

export let getDoubleClickEventName = () => "meta3d_doubleclick"



let _onPointerDown = (event) => {
    globalThis[getPointerDownEventName()] = event
}

let _onPointerUp = (event) => {
    globalThis[getPointerUpEventName()] = event
}


let _onPointerTap = (event) => {
    globalThis[getPointerTapEventName()] = event
}

// let _onDoubleClick = (event) => {
//     globalThis[getDoubleClickEventName()] = event
// }

let _onSingleClick = (event) => {
    globalThis[getSingleClickEventName()] = event
    globalThis[getSingleClickForTempEventName()] = event
}

let _onKeyDown = (event) => {
    globalThis[getKeyDownEventName()] = event
}

let _onKeyUp = (event) => {
    globalThis[getKeyUpEventName()] = event
}

let _buildEventStream = (eventName: string, target: Document | HTMLElement) => {
    if (isMobile()) {
        return fromEvent(eventName, target, { "passive": false } as any)
    }

    return fromEvent(eventName, target, false)
}

let _buildClickStream = (body) => {
    if (isMobile()) {
        return since(_buildEventStream("touchstart", body), _buildEventStream("touchend", body))
    }
    else {
        return _buildEventStream("click", body)
    }
}

let _bindAllDomEventsForConvertDomEventToCustomEvent = (body) => {
    let stream = _buildEventStream("pointerdown", body).tap(_onPointerDown)

    if (isMobile()) {
        stream = stream.merge(
            _buildClickStream(body).tap(_onPointerTap)
        )
    }
    else {
        stream = stream.merge(
            _buildEventStream("pointerup", body).tap(_onPointerUp),
            _buildClickStream(body).tap(_onPointerTap),
            _buildEventStream("keydown", body).tap(_onKeyDown),
            _buildEventStream("keyup", body).tap(_onKeyUp),
        )
    }



    // // stream = stream.merge(
    // //     // clickStream.during(clickStream.debounce(250)).filter()
    // //     // fromPromise(clickStream.until(clickStream.delay(250)).reduce((count, _) => {
    // //     fromPromise(_buildEventStream("click", body).until(_buildEventStream("click", body).delay(250)).reduce((count, _) => {
    // //         return count += 1
    // //     }, 0)).tap((clickCount: number) => {
    // //         if (clickCount == 2) {
    // //             _onDoubleClick(new Event(null))
    // //         }
    // //     }).map(_ => {
    // //         return new Event(null)
    // //     })
    // // )

    // // After the first click, log mouse move events for 1 second.
    // // Note that DOM event handlers will automatically be unregistered.
    // const start = _buildClickStream(body)
    // const end = of(null).delay(250);

    // // Map the first click to a stream containing a 1 second delay
    // // The click represents the window start time, after which
    // // the window will be open for 1 second.
    // const timeWindow = start.constant(end);
    // // const timeWindow = _buildClickStream(body).debounce(250)

    // // fromEvent('mousemove', body)
    // //     .during(timeWindow)
    // //     .forEach(mouseEvent => Console.log(mouseEvent));

    // stream = stream.merge(
    //     // clickStream.during(clickStream.debounce(250)).filter()
    //     // fromPromise(clickStream.until(clickStream.delay(250))


    //     fromPromise(_buildClickStream(body).during(timeWindow)
    //         .reduce((count, _) => {
    //             return count += 1
    //         }, 0)).tap((clickCount: number) => {
    //             if (clickCount == 2) {
    //                 _onDoubleClick(new Event(null))
    //             }
    //         }).map(_ => {
    //             return new Event(null)
    //         })
    // )


    let _ = stream.drain()
}

let _trigger = (state, getAbstractStateFunc, eventName) => {
    if (!isNullable(globalThis[eventName])) {
        return trigger(state, getAbstractStateFunc, eventName, globalThis[eventName]).then(state => {
            globalThis[eventName] = null

            return state
        })
    }

    return Promise.resolve(state)
}

let _triggerForConvertDomEventToCustomEvent = (state, getAbstractStateFunc) => {
    return _trigger(state, getAbstractStateFunc, getPointerDownEventName()).then(state => {
        return _trigger(state, getAbstractStateFunc, getPointerUpEventName())
    }).then(state => {
        return _trigger(state, getAbstractStateFunc, getPointerTapEventName())
    }).then(state => {
        return _trigger(state, getAbstractStateFunc, getSingleClickEventName())
    }).then(state => {
        return _trigger(state, getAbstractStateFunc, getSingleClickForTempEventName())
    }).then(state => {
        return _trigger(state, getAbstractStateFunc, getKeyDownEventName())
    }).then(state => {
        return _trigger(state, getAbstractStateFunc, getKeyUpEventName())
    })
}

let _bindDoubleClickEvent = (state, getAbstractStateFunc) => {
    let clickid = 1;
    let timer, startTime

    return on(state, getPointerTapEventName(), (specficState, customEvent) => {
        let event = getExn(customEvent.userData)

        if (clickid == 1) {
            startTime = new Date().getTime();
            clickid++;
            timer = setTimeout(function () {
                // 单击事件触发

                clickid = 1;

                // return trigger(specficState, getAbstractStateFunc, getSingleClickEventName(), getExn(customEvent.userData))

                _onSingleClick(event)
            }, 200)
        }

        if (clickid == 2) {
            clickid++;
        } else {
            let endTime = new Date().getTime();
            // if ((endTime - startTime) < 300) {
            //     clickid = 1;
            //     clearTimeout(timer);


            //     return trigger(specficState, getAbstractStateFunc, getDoubleClickEventName(), customEvent)
            // }
            clickid = 1;
            clearTimeout(timer);


            return trigger(specficState, getAbstractStateFunc, getDoubleClickEventName(), event)
        }

        return Promise.resolve(specficState)
    })
}

export let init = (state: state) => {
    _bindAllDomEventsForConvertDomEventToCustomEvent(document.body)

    // state = _bindDoubleClickEvent(state, getAbstractStateFunc)

    return Promise.resolve(state)
}

let _clearGlobalThisData = () => {
    delete globalThis[getPointerDownEventName()]
    delete globalThis[getPointerUpEventName()]
    delete globalThis[getPointerTapEventName()]
    delete globalThis[getSingleClickEventName()]
    delete globalThis[getSingleClickForTempEventName()]
    delete globalThis[getKeyDownEventName()]
    delete globalThis[getKeyUpEventName()]
}

export let initWhenImportScene = (state: state, getAbstractStateFunc) => {
    _clearGlobalThisData()

    state = _bindDoubleClickEvent(state, getAbstractStateFunc)

    return Promise.resolve(state)
}

export let update = <specificState>(state: specificState, getAbstractStateFunc): Promise<specificState> => {
    return _triggerForConvertDomEventToCustomEvent(state, getAbstractStateFunc)
}

let _getPageData = (event: Event): { pageX: number, pageY: number } => {
    if (event instanceof PointerEvent) {
        return { pageX: event.pageX, pageY: event.pageY }
    }
    else if (event instanceof TouchEvent) {
        return { pageX: event.changedTouches[0].pageX, pageY: event.changedTouches[0].pageY }
    }

    let mouseEvent = event as MouseEvent

    return { pageX: mouseEvent.pageX, pageY: mouseEvent.pageY }
}

export let getPageData = (event: Event) => {
    let data = _getPageData(event)

    return [
        getPageX(data),
        getPageY(data),
    ]
}

export let getErrorEventName = () => "error"

export let getNetworkErrorEventName = () => "getNetworkErrorEventName"


export let dispose = (state) => {
    // return setEventState(state, createState())

    /*! remain binded events from App.tsx
    * 
    */
    return setEventState(state, {
        ...createState(),
        handlers: getEventState(state).handlers.filter((_, eventName) => {
            switch (eventName) {
                case getErrorEventName():
                case getNetworkErrorEventName():
                    return true
                default:
                    return false
            }
        })
    })
}
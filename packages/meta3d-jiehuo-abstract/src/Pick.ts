// import { getPickState, getRenderState, setPickState } from "./state/State";
// import { pick, state } from "./type/StateType";
// import { bind, getExn, getWithDefault, isNullable, map, return_ } from "./utils/NullableUtils";
// import { Vector2, Raycaster } from "three"
// import { getCurrentCamera } from "./scene/Camera";
// import { findObjectByName, getCurrentScene } from "./scene/Scene";
// import { getDoubleClickEventName, getPageData, getPointerDownEventName, getPointerTapEventName, getSingleClickEventName, on, trigger } from "./Event";
// import { List } from "immutable"
// import { setPickableLayer } from "./Layer";
// import { getHeight, getWidth } from"meta3d-utils/src/View";
// import { Device } from "./Main";

// // let _onPointerDown = (event) => {
// //     // if (event.isPrimary === false) {
// //     //     return
// //     // }

// //     let x = (event.clientX / window.innerWidth) * 2 - 1;
// //     let y = - (event.clientY / window.innerHeight) * 2 + 1;

// //     globalThis["mousePos"] = [x, y]
// // }

// export let getPickEventName = () => "meta3d_pick"

// export let getEnterEventName = () => "meta3d_enter"

// export let createState = (): pick => {
//     let raycaster = new Raycaster()

//     setPickableLayer(raycaster.layers)

//     return {
//         screenCoordniate: null,
//         targets: List(),
//         raycaster: raycaster
//     }
// }

// // let _initState = (state: state) => {
// //     let raycaster = new Raycaster()
// //     // enableVisibleLayer(raycaster.layers)
// //     // enablePickableLayer(raycaster.layers)
// //     setPickableLayer(raycaster.layers)

// //     return setPickState(state, {
// //         // mouse: null,
// //         // lastMouse: null,
// //         screenCoordniate: null,
// //         targets: List(),
// //         raycaster: raycaster
// //     })
// // }

// let _getIntersects = (state: state, mouse) => {
//     let camera = getCurrentCamera(state)
//     let scene = getCurrentScene(state)

//     let { raycaster } = getPickState(state)

//     return getWithDefault(
//         map(mouse => {
//             raycaster.setFromCamera(mouse, camera);

//             return raycaster.intersectObject(scene, true);
//         }, mouse),
//         []
//     )
// }

// let _handlePickEvent = (getAbstractStateFunc, specficState, userData) => {
//     let event = getExn(userData)

//     let [pageX, pageY] = getPageData(event)
//     let x = (pageX / getWidth()) * 2 - 1;
//     let y = - (pageY / getHeight()) * 2 + 1;
//     // let x = (pageX / window.innerWidth) * 2 - 1;
//     // let y = - (pageY / window.innerHeight) * 2 + 1;

//     let state = getAbstractStateFunc(specficState)

//     let targets = List(_getIntersects(state, new Vector2(x, y)))

//     // let topTarget = null
//     if (targets.count() > 0) {
//         Console.log(targets.get(0))
//     }


//     state = setPickState(state, {
//         ...getPickState(state),
//         screenCoordniate: return_(new Vector2(pageX, pageY)),
//         targets: targets
//     })

//     return [state, targets]
// }

// let _bindEvent = (state: state, [getAbstractStateFunc, setAbstractStateFunc]) => {
//     // state = on(state, getPointerTapEventName(), (specficState, { userData }) => {
//     state = on(state, getSingleClickEventName(), (specficState, { userData }) => {
//         let [state, targets] = _handlePickEvent(getAbstractStateFunc, specficState, userData)

//         return trigger(setAbstractStateFunc(specficState, state), getAbstractStateFunc, getPickEventName(), {
//             targets: targets,
//         })
//     })

//     state = on(state, getDoubleClickEventName(), (specficState, { userData }) => {
//         let [state, targets] = _handlePickEvent(getAbstractStateFunc, specficState, userData)

//         return trigger(setAbstractStateFunc(specficState, state), getAbstractStateFunc, getEnterEventName(), {
//             targets: targets,
//         })
//     })

//     return state
// }

// // export let storeEventData = (state: state) => {
// //     if (!isNullable(globalThis["mousePos"])) {
// //         return setPickState(state, {
// //             ...getPickState(state),
// //             lastMouse: getPickState(state).mouse,
// //             mouse: getExn(globalThis["mousePos"]),
// //         })
// //     }

// //     return state
// // }


// // export let isPickTargetChange = (state: state) => {
// //     let { mouse, lastMouse } = getPickState(state)

// //     return getWithDefault(
// //         bind(mouse => {
// //             return map(lastMouse => {
// //                 return !mouse.equals(lastMouse)
// //             }, lastMouse)
// //         }, mouse),
// //         false
// //     )
// // }

// export let getTagets = (state: state) => {
//     return getPickState(state).targets
// }

// export let init = (state: state, [getAbstractStateFunc, setAbstractStateFunc]) => {
//     // state = _initState(state)
//     state = _bindEvent(state, [getAbstractStateFunc, setAbstractStateFunc])

//     return Promise.resolve(state)
// }

// export let dispose = (state: state) => {
//     return setPickState(state, createState())
// }


import { getPickState, getRenderState, setPickState } from "./state/State";
import { pick, pickTarget, state } from "./type/StateType";
import { bind, getEmpty, getExn, getWithDefault, isNullable, isStrictNullable, map, return_ } from "./utils/NullableUtils";
import { Vector2, Raycaster, Ray } from "three"
import { getCurrentCamera } from "./scene/Camera";
import { findObjectByName, getCurrentScene, getPickableOctrees } from "./scene/Scene";
import { getDoubleClickEventName, getPageData, getPointerDownEventName, getPointerTapEventName, getSingleClickEventName, on, trigger } from "./Event";
import { List } from "immutable"
import { setPickableLayer } from "./Layer";
import { getActualHeight, getActualWidth, getHeight, getWidth, isNeedHandleLandscape } from "meta3d-utils/src/View";
import { Device } from "./Main";
import { nullable } from "./utils/nullable";
// import { queryNeareastByRay } from "./StaticLODContainerUtils";

// let _onPointerDown = (event) => {
//     // if (event.isPrimary === false) {
//     //     return
//     // }

//     let x = (event.clientX / window.innerWidth) * 2 - 1;
//     let y = - (event.clientY / window.innerHeight) * 2 + 1;

//     globalThis["mousePos"] = [x, y]
// }

export let getPickEventName = () => "meta3d_pick"

export let getEnterEventName = () => "meta3d_enter"

export let createState = (): pick => {
    let raycaster = new Raycaster()

    setPickableLayer(raycaster.layers)

    return {
        screenCoordniate: null,
        targets: List(),
        raycaster: raycaster
    }
}

// let _initState = (state: state) => {
//     let raycaster = new Raycaster()
//     // enableVisibleLayer(raycaster.layers)
//     // enablePickableLayer(raycaster.layers)
//     setPickableLayer(raycaster.layers)

//     return setPickState(state, {
//         // mouse: null,
//         // lastMouse: null,
//         screenCoordniate: null,
//         targets: List(),
//         raycaster: raycaster
//     })
// }

// let _getIntersect = (state: state, dynamicGroup, mouse): nullable<pickTarget> => {
//     let camera = getCurrentCamera(state)
//     // let scene = getCurrentScene(state)

//     let { raycaster } = getPickState(state)

//     return bind(mouse => {
//         raycaster.setFromCamera(mouse, camera);

//         let ray = raycaster.ray

//         let result = queryNeareastByRay(getPickableOctrees(state), ray)

//         if (isStrictNullable(result[1])) {
//             let result = raycaster.intersectObject(dynamicGroup, true).map<pickTarget>(data => {
//                 return [data.distance, return_(data.object), getEmpty()]
//             })

//             if (result.length == 0) {
//                 return getEmpty()
//             }

//             return return_(result[0])
//         }

//         let [distance, transform, box, name] = result
//         return return_([distance, getEmpty(), return_([transform, box, name])])
//     }, mouse)
// }

// let _handlePickEvent = ([getAbstractStateFunc, getDynamicGroupFunc], specficState, userData) => {
//     let event = getExn(userData)

//     let [pageX, pageY] = getPageData(event)

//     let x = (pageX / getWidth()) * 2 - 1;
//     let y = - (pageY / getHeight()) * 2 + 1;

//     let dynamicGroup = getDynamicGroupFunc(specficState)
//     let state = getAbstractStateFunc(specficState)

//     // let targets = List(_getIntersects(state, new Vector2(x, y)))
//     let targets = getWithDefault(
//         map((target) => {
//             return List([target])
//         }, _getIntersect(state, dynamicGroup, new Vector2(x, y))),
//         List()
//     )

//     // let topTarget = null

//     // if (targets.count() > 0) {
//     // 	Console.log(targets.get(0))
//     // }


//     state = setPickState(state, {
//         ...getPickState(state),
//         screenCoordniate: return_(new Vector2(pageX, pageY)),
//         targets: targets
//     })

//     return [state, targets]
// }

// let _bindEvent = (state: state, [getAbstractStateFunc, setAbstractStateFunc, getDynamicGroupFunc]) => {
//     state = on(state, getSingleClickEventName(), (specficState, { userData }) => {
//         let [state, targets] = _handlePickEvent([getAbstractStateFunc, getDynamicGroupFunc], specficState, userData)

//         return trigger(setAbstractStateFunc(specficState, state), getAbstractStateFunc, getPickEventName(), {
//             targets: targets,
//         })
//     })

//     state = on(state, getDoubleClickEventName(), (specficState, { userData }) => {
//         let [state, targets] = _handlePickEvent([getAbstractStateFunc, getDynamicGroupFunc], specficState, userData)

//         return trigger(setAbstractStateFunc(specficState, state), getAbstractStateFunc, getEnterEventName(), {
//             targets: targets,
//         })
//     })

//     return state
// }

// export let storeEventData = (state: state) => {
//     if (!isNullable(globalThis["mousePos"])) {
//         return setPickState(state, {
//             ...getPickState(state),
//             lastMouse: getPickState(state).mouse,
//             mouse: getExn(globalThis["mousePos"]),
//         })
//     }

//     return state
// }


// export let isPickTargetChange = (state: state) => {
//     let { mouse, lastMouse } = getPickState(state)

//     return getWithDefault(
//         bind(mouse => {
//             return map(lastMouse => {
//                 return !mouse.equals(lastMouse)
//             }, lastMouse)
//         }, mouse),
//         false
//     )
// }

export let getTagets = (state: state) => {
    return getPickState(state).targets
}

export let init = (state: state, [getAbstractStateFunc, setAbstractStateFunc, getDynamicGroupFunc]) => {
    // state = _bindEvent(state, [getAbstractStateFunc, setAbstractStateFunc, getDynamicGroupFunc])

    return Promise.resolve(state)
}

export let dispose = (state: state) => {
    return setPickState(state, createState())
}
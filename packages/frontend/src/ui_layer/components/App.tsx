import "./App.scss"

import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import VConsole from 'vconsole';
import { useSelector, useDispatch } from 'react-redux'
import { getCameraControlsJoystickZoneDomSize } from "../../business_layer/Scene3D";
import Global from '../global/components/Global';
import { AppDispatch, AppState } from '../store/AppStore';
import { page, scene } from '../global/store/GlobalStoreType';
import { createState, readState, setAbstractState, writeState } from '../../business_layer/State';
import * as Scene3D from '../../business_layer/Scene3D';
import { init, isStopLoop, loop, stopLoop } from '../../business_layer/Loop';
import { View, LandscapeUtils } from 'meta3d-jiehuo-abstract';
import { loadWholeResource } from '../../business_layer/Loader';
import { isMobile } from '../../business_layer/Device';
// import { Loading } from '../utils/loading/components/Loading';
// import { Info } from '../utils/info/components/Info';
import Index from '../index/components/Index';
import { language, state } from '../../scene3d_layer/type/StateType';
import { buildCanvasId, getCanvas, hideCanvas, isCanvasShow, restoreCanvasDisplay, showCanvas } from '../utils/CanvasUtils';
import { Loading } from "../index/scene/loading/components/Loading";
import { Info } from "../index/scene/info/components/Info";
import { setIsLoading, setPercent } from "../index/scene/loading/store/LoadingStore";
import { setInfo } from "../index/scene/info/store/InfoStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Version } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../scene3d_layer/state/State";
import { setError } from "../index/error_handle/store/ErrorHandleStore";
import { Console } from "meta3d-jiehuo-abstract";
import { stopIndexSounds } from "../../business_layer/Sound";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { Event } from "meta3d-jiehuo-abstract";
import { buildErrorEventData, getErrorEventName, getNetworkErrorEventName, getPointerLockEventName } from "../../scene3d_layer/utils/EventUtils";
import { Device } from "meta3d-jiehuo-abstract";
import { getIsDebug, getIsProduction, isChinese, isEnglish, setIsShowDemo, setLanguage } from "../../scene3d_layer/script/scene/Scene";
import { isStop, start, stop } from "../../scene3d_layer/script/scene/scene_city/Time";
import * as Mod from "../../scene3d_layer/mod/Mod";
import { getLanguageTextData, languageKey } from "../../scene3d_layer/internation/Data";
import { hasOpenedModal } from "../../scene3d_layer/script/scene/scene_city/UI";
import { Modal } from "antd-mobile";
import { handleOpenModal } from "../utils/ModalUtils";
// import { hasOpenedModal } from "../utils/ModalUtils";
import { getMessage, handleEventHandler } from "../utils/ErrorUtils";
import * as Backend from "backend/src/Main";
import { setCharacter, setPage } from "../global/store/GlobalStore";
import { getBackendData } from "../utils/BackendUtils";
import { getAllNotRelatedToSceneBlockNames, setAllBlockNames } from "../../scene3d_layer/script/scene/scene_city/Mod";
import { off, on } from "../../business_layer/Event";
import { Flow } from "meta3d-jiehuo-abstract";
import ErrorHandle from "../index/error_handle/component/ErrorHandle";
import { exit } from "../utils/MissionUtils";
import { Render } from "meta3d-jiehuo-abstract";
import { read } from "../../scene3d_layer/script/scene/scene_city/difficulty/Difficulty";
import { isCanFullScreenForMobile } from "../utils/ScreenUtils";
import { requestFullScreen } from "../utils/FullScreenUtils";
import { isTestUser } from "../../business_layer/User";
import { getVersionData } from "../../business_layer/VersionData";
import { setIsLogin } from "../../scene3d_layer/script/scene/scene_city/User";
import { getConfig } from "../utils/ConfigUtils";
// import * as Backend from "backend"

export enum fps {
    High = 60,
    Middle = 30,
    Low = 15
}

let _isExit = false

let App = ({ language }) => {
    let _renderJoystickDom = () => {
        if (!isMobile()) {
            return null
        }

        return <div style={{
            "width": `${getCameraControlsJoystickZoneDomSize()}px`,
            "height": `${getCameraControlsJoystickZoneDomSize()}px`,
            "position": "absolute",
            // "top": "30%",
            // "bottom": "0%",
            // "bottom": "5%",
            // "left": "10%",
            // "left": "15%",
            // "left": "12%",
            // "left": "0%",
            // "left": "5%",
            "zIndex": "2",
            "display": "none"
        }} id="meta3d_joystick_zone"></div>
    }

    let _forceLandscape = () => {
        let targetDom = LandscapeUtils.getRootDom() as any
        if (!targetDom) return;

        if (View.isNeedHandleLandscape()) {
            LandscapeUtils.rotateDom(targetDom)
        }
        else {
            LandscapeUtils.restoreDom(targetDom)
        }
    }

    let _getCanvasWidth = () => {
        // let width = View.getWidth()
        // let height = View.getHeight()
        // let targetDom = document.querySelector("#root") as HTMLElement
        // if (!targetDom) return;

        // if (width <= height) {
        //     return height
        // }

        // return width
        return View.getWidth()
    }

    let _getCanvasHeight = () => {
        // let width = View.getWidth()
        // let height = View.getHeight()
        // let targetDom = document.querySelector("#root") as HTMLElement
        // if (!targetDom) return;

        // if (width <= height) {
        //     return width
        // }

        // return height

        return View.getHeight()
    }

    let _renderContent = () => {
        if (isInit) {
            showCanvas()
        }

        return <Layout.Content>
            {
                isInit ?
                    <>
                        <Global />
                        <Index />
                    </>
                    : <>
                        <Loading />
                        <Info />
                    </>
            }
            {
                isShowErrorPage ? <ErrorHandle /> : null
            }
        </Layout.Content >
    }


    let _exitHandle = () => {
        let state = readState()

        // if (isStopLoop(state)) {
        if (_isExit) {
            return Promise.resolve()
        }

        _isExit = true

        return stopIndexSounds(state).then(state => {
            return Scene3D.exit(state).then(writeState)
        })
    }

    let _contextlostHandle = handleEventHandler(event => {
        let state = readState()

        event.preventDefault()

        Modal.confirm({
            content: getLanguageTextData(state, languageKey.ContextLost),
            confirmText: getLanguageTextData(state, languageKey.AutoRestore),
            cancelText: getLanguageTextData(state, languageKey.Ignore),
            onConfirm: handleEventHandler(_ => {
                let extension = NullableUtils.getExn(Render.getWebglcontextlostExtension(getAbstractState(readState())))

                if (extension) {
                    // setTimeout(() => {
                    //     extension.restoreContext()
                    // }, 1000)
                    extension.restoreContext()
                }
                else {
                    throw new Error("not support WEBGL_lose_context extension")
                }

                // return exit(dispatch)
            }),
            // onCancel: handleEventHandler(_ => {
            // }),
        })
    })

    let _contextrestoreHandle = handleEventHandler((event) => {
        event.preventDefault()

        console.log("restore");
    })

    // let currentScene = useSelector<AppState>((state) => state.global.currentScene) as scene
    // let levelNumber = useSelector<AppState>((state) => state.global.levelNumber) as number

    // let [isLoading, setIsLoading] = useState(true)
    // let [percent, setPercent] = useState(0)
    let [isInit, setIsInit] = useState(false)
    let [isShowErrorPage, setIsShowErrorPage] = useState(false)

    let dispatch: AppDispatch = useDispatch()

    let _forbiddenMouseRightClick = () => {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });
    }

    // let _forbiddenDownMoveToExitFullscreen = () => {
    //     document.addEventListener('touchmove', function (event) {
    //         event.preventDefault();
    //     }, { passive: false });
    // }

    let _forbiddenScalePage = () => {
        document.addEventListener(
            "wheel",
            function (e) {
                /* * 无论是ctrl+滚轮，还是在触控板或者触摸屏上双指缩放 都会有如下规律
                 * 1、ctrlKey = true
                 * 2、delteX = 0
                 * 3、delteY != 0
                 * */
                if (e.ctrlKey && Math.abs(e.deltaY) !== 0) {
                    e.preventDefault();
                }
            },
            { passive: false }
        );

        // 阻止双击放大
        let lastTouchEnd = 0;
        document.addEventListener('touchstart', function (event) {
            if (event.touches.length > 1) { event.preventDefault(); }
        });
        document.addEventListener('touchend', function (event) {
            var now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) { event.preventDefault(); }
            lastTouchEnd = now;
        }, false);
        // 阻止双指放大
        document.addEventListener('gesturestart', function (event) {
            event.preventDefault();
        });
    }

    let _checkMemorySize = (state, onConfirmFunc) => {
        // let isFail
        // if (!!((navigator as any).deviceMemory) && (navigator as any).deviceMemory < 4) {
        //     isFail = true
        // }
        // else {
        //     if ((performance as any).memory) {

        //         // alert(`JS Heap Size Limit: ${(performance as any).memory.jsHeapSizeLimit}`);


        //         // alert(`Total JS Heap Size: ${(performance as any).memory.totalJSHeapSize}`);


        //         // alert(`Used JS Heap Size: ${(performance as any).memory.usedJSHeapSize}`);


        //         // alert((navigator as any).deviceMemory)
        //         isFail = (performance as any).memory.jsHeapSizeLimit <= 1000000000

        //         // if ((performance as any).memory.jsHeapSizeLimit <= 1000000000 ||
        //         //     (
        //         //         !!((navigator as any).deviceMemory) && (navigator as any).deviceMemory < 4
        //         //     )
        //         // ) {
        //         // }
        //     } else {


        //         // alert("Performance.memory is not supported.");

        //         isFail = false

        //     }
        // }


        if (
            (!!((navigator as any).deviceMemory) && (navigator as any).deviceMemory < 4)
            || (
                !!((performance as any).memory)
                && (performance as any).memory.jsHeapSizeLimit <= 1000000000
            )
        ) {
            Modal.alert({
                content: getLanguageTextData(state, languageKey.MemoryIsSmall),
                confirmText: getLanguageTextData(state, languageKey.Confirm),
                onConfirm: handleEventHandler(_ => onConfirmFunc(state)),
            })

            return
        }

        onConfirmFunc(state)
    }

    let _requestFullScreen = (state) => {
        if (!getIsDebug(state)
            && isCanFullScreenForMobile()) {
            requestFullScreen(state)
        }
    }

    let _isIPad = () => {
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua);

        // iOS 12及以下：直接通过UA判断
        if (isIOS && /iPad/.test(ua)) return true;

        // iOS 13+：检测桌面模式 + 触摸屏 + 无鼠标
        return (
            /Macintosh/.test(ua) &&  // iPadOS伪装成Mac
            navigator.maxTouchPoints > 0 && // 支持多点触控
            !(navigator as any).pointerEnabled &&   // 排除桌面设备
            !window.MouseEvent              // 兼容性兜底
        );
    }

    let _checkEnvironment = (state) => {
        _checkMemorySize(state, state => {
            let browser = Device.detectBrowser()

            if (Device.isMobile()) {
                if (_isIPad()) {
                    Modal.alert({
                        content: getLanguageTextData(state, languageKey.IPadHasCompatibilityIssue),
                        confirmText: getLanguageTextData(state, languageKey.Confirm),
                        onConfirm: handleEventHandler(_ => {
                            _requestFullScreen(readState())
                        }),
                    })
                }
                // else if (!getIsDebug(state) && !browser.isWeChat && !browser.isAlook && !browser.isChrome && !browser.isAndroidDefault && !browser.isSafari) {
                else if (!getIsDebug(state) && !browser.isWeChat && !browser.isAlook && !browser.isChrome) {
                    Modal.alert({
                        content: getLanguageTextData(state, languageKey.SuggestUseALook),
                        confirmText: getLanguageTextData(state, languageKey.Confirm),
                        onConfirm: handleEventHandler(_ => {
                            _requestFullScreen(readState())
                        }),
                    })
                }
                else if (browser.isInApp) {
                    Modal.alert({
                        content: getLanguageTextData(state, languageKey.TipInApp),
                        confirmText: getLanguageTextData(state, languageKey.Confirm),
                        onConfirm: handleEventHandler(_ => {
                            _requestFullScreen(readState())
                        }),
                    })
                }
                else {
                    _requestFullScreen(state)
                }
            }
            else {
                if (!Device.isChrome()) {
                    Modal.alert({
                        content: getLanguageTextData(state, languageKey.SuggestUseChrome),
                        confirmText: getLanguageTextData(state, languageKey.Confirm),
                        // onConfirm: handleEventHandler(_ => {
                        //     setTimeout(() => {
                        //         _requestFullScreen(readState())
                        //     }, 1000)
                        // }),
                    })
                }
            }
        })
    }



    let _errorHandle = (state, { userData }) => {
        if (getMessage(userData.error).toLowerCase().includes("webgl")) {
            Modal.alert({
                content: getLanguageTextData(state, languageKey.WebGLError),
                confirmText: getLanguageTextData(state, languageKey.Confirm),
                onConfirm: handleEventHandler(_ => {
                    return exit(dispatch)
                }),
            })

            return Promise.resolve(state)
        }



        dispatch(setInfo(null))
        setIsInit(_ => false)

        dispatch(setError(userData.error))
        // dispatch(setPage(page.ErrorHandle))
        setIsShowErrorPage(_ => true)

        return Promise.resolve(state)
    }

    let _networkErrorHandle = (state, { userData }) => {
        let { error, retryFunc } = userData

        // dispatch(setNetworkError(userData.error, userData.retryFunc))
        // dispatch(setPage(page.NetworkErrorHandle))

        // if (Flow.isLoopStart(getAbstractState(state))) {
        //     throw new Error("loop should stop")
        // }

        let handler = Modal.show({
            getContainer: LandscapeUtils.getRootDom(),
            bodyClassName: "network_error_handle_modal_body",
            title: getLanguageTextData(readState(), languageKey.NetworkErrorHandleTitle),
            content: getLanguageTextData(readState(), languageKey.NetworkErrorHandleContent),
            actions: [
                {
                    key: 'retry',
                    text: getLanguageTextData(readState(), languageKey.RetryBackendRequest),
                    primary: true,
                },
                {
                    key: 'relogin',
                    text: getLanguageTextData(readState(), languageKey.Relogin),
                },
            ],
            onAction: handleEventHandler(async (action, index) => {
                handler.close()

                switch (action.key) {
                    case "retry":
                        return retryFunc()
                    case "relogin":
                        // Backend.markLocal(true)
                        // Backend.setLoginedUserName(Backend.buildVisitorUserName()).then(_ => {
                        //     location.reload()
                        // })
                        Backend.removeLoginedUserName().then(_ => {
                            location.reload()
                        })
                        break
                }

                return Promise.resolve()
            }),
        })

        return Promise.resolve(state)
    }

    useEffect(() => {
        let state = createState()

        // if (isMobile()) {
        //     // if (!config.isProduction) {
        //     let _ = new VConsole()
        //     // }
        // }

        document.querySelector("#first_loading_container")?.remove()

        globalThis["startLoadJs"] = false


        state = setLanguage(state, language)

        writeState(state)
    }, []);


    // useEffect(() => {
    //     _decideLanguage()
    // }, []);

    useEffect(() => {
        _forceLandscape()
        restoreCanvasDisplay()

        window.addEventListener('resize', _forceLandscape)

        getCanvas().addEventListener('webglcontextlost', _contextlostHandle)
        getCanvas().addEventListener('webglcontextrestored', _contextrestoreHandle)

        window.addEventListener('beforeunload', _exitHandle)
        window.addEventListener('unload', _exitHandle)

        document.addEventListener("visibilitychange", function () {
            if (Device.isMobile()) {
                return Promise.resolve()
            }

            let state = readState()

            if (document.hidden) {
                state = stop(state)
            } else {
                state = setAbstractState(state, Flow.resetFirstUpdateTime(getAbstractState(state)))

                state = start(state)

                // if (!hasOpenedModal()
                if (!hasOpenedModal(state)
                    // && CameraControls.isEnablePointerLock(getAbstractState(state))
                    && isCanvasShow()
                    // && !Device.isMobileByState(getAbstractState(state))
                    // && !getIsDebug(state)
                    && getIsProduction(state)
                ) {
                    // if (window.confirm("点我恢复pointer lock")) {
                    //     // let state = readState()
                    //     writeState(setAbstractState(state, CameraControls.lock(getAbstractState(state))))
                    // }

                    state = handleOpenModal(state)

                    return Event.trigger(state, getAbstractState, getPointerLockEventName(), null).then(writeState)
                }
            }

            return Promise.resolve(writeState(state))
        });


        _forbiddenMouseRightClick()
        _forbiddenScalePage()
        // _forbiddenDownMoveToExitFullscreen()
    }, []);


    useEffect(() => {
        writeState(on(readState(), getErrorEventName(), _errorHandle))
        writeState(on(readState(), getNetworkErrorEventName(), _networkErrorHandle))

        return () => {
            writeState(off(readState(), getErrorEventName(), _errorHandle))
            writeState(off(readState(), getNetworkErrorEventName(), _networkErrorHandle))
        };
    }, []);

    useEffect(() => {
        // load(createState(), [
        //     {
        //         id: CityScene3D.getResourceId(1),
        //         path: `./${CityScene3D.getResourceId(1)}.glb`
        //     },
        // ], percent => setPercent(_ => percent))

        let state = readState()


        // const config = {
        //     // isDebug: true,
        //     isDebug: false,

        //     isProduction: true,
        //     // isProduction: false,

        //     isNotTestPerf: true,
        //     // isNotTestPerf: false,

        //     // isSkipScenario: true,
        //     isSkipScenario: false,

        //     // isSkipGameEvent: true,
        //     isSkipGameEvent: false,



        //     // isShowDemo: true,
        //     isShowDemo: false,

        // }
        const config = getConfig()
        // const mainVersion = 1
        // const subVersion = 0
        // // const postfix = NullableUtils.return_(`-beta.1`)
        // const postfix = NullableUtils.return_(`-beta.2`)




        state = Scene3D.setIsDebug(state, config.isDebug)
        state = Scene3D.setIsNotTestPerf(state, config.isNotTestPerf)
        state = Scene3D.setIsSkipScenario(state, config.isSkipScenario)
        state = Scene3D.setIsSkipGameEvent(state, config.isSkipGameEvent)

        state = Scene3D.setIsProduction(state, config.isProduction)

        state = setIsShowDemo(state, config.isShowDemo)

        state = setAbstractState(state, Version.setVersion(getAbstractState(state), getVersionData(state)))


        state = setAllBlockNames(state, getAllNotRelatedToSceneBlockNames())



        _checkEnvironment(state)




        if (config.isProduction || !config.isNotTestPerf) {
            Console.markIsProductionToGlobalThis()
        }


        dispatch(setIsLoading(true))
        dispatch(setPercent(0))

        try {
            let _ = Mod.init(state).then(state => {
                return loadWholeResource(state, percent => dispatch(setPercent(percent)))
            })
                .then(state => {
                    dispatch(setIsLoading(false))


                    // return new Promise((resolve, reject) => {
                    //     setTimeout(() => {
                    //         resolve(state)
                    //     }, 100)
                    // })
                    return state
                }).then((state: state) => {
                    dispatch(setInfo(getLanguageTextData(state, languageKey.GetBackendDataInfo)))

                    return state
                })
                .then((state: state) => {
                    setIsInit(_ => false)

                    dispatch(setInfo(NullableUtils.return_(getLanguageTextData(readState(), languageKey.InitingInfo))))

                    return init(state).then(state => {
                        // dispatch(setInfo(null))
                        // setIsInit(_ => true)

                        // state = stopLoop(state)
                        state = Scene3D.stop(state)

                        writeState(state)

                        if (isMobile() && config.isProduction) {
                            loop(fps.Middle)
                        }
                        else {
                            // loop(fps.Middle)
                            loop(fps.High)
                            // loop(fps.Low)
                        }

                    })
                        .then(_ => {
                            let state = readState()

                            Backend.init(
                                isEnglish() ? false : (
                                    getIsDebug(state) || !getIsProduction(state)
                                )
                                // false
                            ).then(_ => {
                                return Backend.handleVisitor().then(_ => {
                                    return Backend.isLoginOrLocal()
                                })
                                    .then(isLoginOrLocal => {
                                        state = setIsLogin(state, isLoginOrLocal && !Backend.isLocal())

                                        if (!isLoginOrLocal) {
                                            writeState(state)

                                            dispatch(setPage(page.Login))
                                            // dispatch(setInfo(null))
                                            setIsInit(_ => true)

                                            return
                                        }

                                        return Backend.getLoginedUserName().then(userName => {
                                            if (isTestUser(userName)) {
                                                state = Scene3D.setIsDebug(state, true)
                                            }

                                            return getBackendData(state, (character) => dispatch(setCharacter(character)))
                                        })
                                            .then(
                                                state => {
                                                    writeState(state)

                                                    dispatch(setInfo(null))
                                                    setIsInit(_ => true)
                                                }
                                            )
                                    })
                            })
                        })
                    // }
                })
                .catch(e => {
                    return Event.trigger(readState(), getAbstractState, getErrorEventName(), buildErrorEventData(e))
                })
        }
        catch (e) {
            return Event.trigger(readState(), getAbstractState, getErrorEventName(), buildErrorEventData(e))
        }
    }, []);

    return <Layout className="app-main">
        {/* {
            !isInit ?
                <>
                    <Loading />
                    <Info />
                </>
                : null
        } */}
        {_renderContent()}
        {_renderJoystickDom()}
        {/* <canvas id="canvas" width={View.getWidth() + "px"} height={View.getHeight() + "px"} style={{ */}
        <canvas id={buildCanvasId()} width={_getCanvasWidth() + "px"} height={_getCanvasHeight() + "px"} style={{
            "display": "none",
            // "opacity": "0",
            // "pointer-events": "auto !important",

            // "width": View.getWidth() + "px",
            // "height": View.getHeight() + "px",
            "width": _getCanvasWidth() + "px",
            "height": _getCanvasHeight() + "px",
            // "opacity": isInit ? "1" : "0"
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            // "zIndex": "1"
            "zIndex": "-1000"
        }}></canvas>
    </Layout >
};

export default App;
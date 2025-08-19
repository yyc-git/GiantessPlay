import "./App.scss"

import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import VConsole from 'vconsole';
import { useSelector, useDispatch } from 'react-redux'
import { getCameraControlsJoystickZoneDomSize } from "../../business_layer/Scene3D";
import Global from '../global/components/Global';
import { AppDispatch, AppState } from '../store/AppStore';
import { scene } from '../global/store/GlobalStoreType';
import { createState, readState, setAbstractState, writeState } from '../../business_layer/State';
import * as Scene3D from '../../business_layer/Scene3D';
import { init, loop, stopLoop } from '../../business_layer/Loop';
import { View, LandscapeUtils } from 'meta3d-jiehuo-abstract';
import { getIndexSoundResourceId, loadWholeResource } from '../../business_layer/Loader';
import { isMobile } from '../../business_layer/Device';
// import { Loading } from '../utils/loading/components/Loading';
// import { Info } from '../utils/info/components/Info';
import Index from '../index/components/Index';
import { state } from '../../scene3d_layer/type/StateType';
import { buildCanvasId, showCanvas } from '../utils/CanvasUtils';
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

export enum fps {
    High = 60,
    Middle = 30,
    Low = 15
}

let App = () => {
    let _renderJoystickDom = () => {
        if (!isMobile()) {
            return null
        }

        return <div style={{
            "width": `${getCameraControlsJoystickZoneDomSize()}px`,
            "height": `${getCameraControlsJoystickZoneDomSize()}px`,
            "position": "absolute",
            // "top": "30%",
            "bottom": "10%",
            // "left": "10%",
            "left": "10%",
            "zIndex": "2",
            "display": "none"
        }} id="meta3d_joystick_zone"></div>
    }

    let _forceLandscape = () => {
        let targetDom = LandscapeUtils.getRootDom() as HTMLElement
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

        return isInit ?
            <Layout.Content>
                <Global />
                <Index />
            </Layout.Content >
            : <>
                <Loading />
                <Info />
            </>
    }


    let _exitHandle = () => {
        let state = readState()

        state = stopIndexSounds(state)

        Scene3D.exit(state).then(writeState)

        // return ""
    }

    // let currentScene = useSelector<AppState>((state) => state.global.currentScene) as scene
    // let levelNumber = useSelector<AppState>((state) => state.global.levelNumber) as number

    // let [isLoading, setIsLoading] = useState(true)
    // let [percent, setPercent] = useState(0)
    let [isInit, setIsInit] = useState(false)

    let dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        writeState(createState())
    }, []);

    useEffect(() => {
        _forceLandscape()

        window.addEventListener('resize', _forceLandscape)

        window.addEventListener('webglcontextlost', _exitHandle)
        window.addEventListener('beforeunload', _exitHandle)
        window.addEventListener('unload', _exitHandle)
    }, []);

    useEffect(() => {
        // load(createState(), [
        //     {
        //         id: CityScene3D.getResourceId(1),
        //         path: `./${CityScene3D.getResourceId(1)}.glb`
        //     },
        // ], percent => setPercent(_ => percent))

        const config = {
            // isDebug: true,
            isDebug: false,

            isProduction: true,
            // isProduction: false,

            isNotTestPerf: true,
            // isNotTestPerf: false,

            // isSkipScenario: true,
            isSkipScenario: false,
            // isSkipGameEvent: true,
            isSkipGameEvent: false
        }
        const mainVersion = 0
        const subVersion = 16



        let state = readState()

        state = Scene3D.setIsDebug(state, config.isDebug)
        state = Scene3D.setIsNotTestPerf(state, config.isNotTestPerf)
        state = Scene3D.setIsSkipScenario(state, config.isSkipScenario)
        state = Scene3D.setIsSkipGameEvent(state, config.isSkipGameEvent)

        state = Scene3D.setIsProduction(state, config.isProduction)

        state = setAbstractState(state, Version.setVersion(getAbstractState(state), mainVersion, subVersion))


        // if (isMobile()) {
        //     if (!config.isProduction) {
        //         let _ = new VConsole()
        //     }
        // }


        if (config.isProduction) {
            Console.markIsProductionToGlobalThis()
        }


        dispatch(setIsLoading(true))
        dispatch(setPercent(0))

        loadWholeResource(state, percent => dispatch(setPercent(percent))).then(state => {
            dispatch(setIsLoading(false))
            dispatch(setInfo(NullableUtils.return_("正在初始化")))

            setIsInit(_ => false)

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(state)
                }, 100)
            })
        }).then((state: state) => {
            init(state).then(state => {
                dispatch(setInfo(null))
                setIsInit(_ => true)

                // state = stopLoop(state)
                state = Scene3D.stop(state)

                writeState(state)

                loop(fps.Middle)
                // loop(fps.Low)
                // if (isMobile() && config.isProduction) {
                //     loop(fps.Middle)
                // }
                // else {
                //     loop(fps.High)
                // }

            })
            // .catch(e => {
            //     // dispatch(setError(e))
            // })
            // }
            // catch (e) {
            //     dispatch(setError(e))
            // }
        })
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

            // "width": View.getWidth() + "px",
            // "height": View.getHeight() + "px",
            "width": _getCanvasWidth() + "px",
            "height": _getCanvasHeight() + "px",
            // "opacity": isInit ? "1" : "0"
            // "position": "absolute",
            // "top": "0px",
            // "left": "0px",
            // "zIndex": 1
        }}></canvas>
    </Layout >
};

export default App;
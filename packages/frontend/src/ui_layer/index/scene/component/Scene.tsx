import "./_base.scss"
import "./Scene.scss"
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Button, Layout } from 'antd';
import { scene } from '../../../global/store/GlobalStoreType';
import City from '../city/components/City';
// import Warehouse from '../warehouse/components/Warehouse';
import { AppDispatch, AppState } from '../../../store/AppStore';
// import { debounce, setFontSize } from "../../../utils/BigScreenUtils";
import { Loading } from "../loading/components/Loading";
import { View } from "meta3d-jiehuo-abstract";
import { isMobile } from "../../../../business_layer/Device";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Tip } from "../tip/components/Tip";
import { Info } from "../info/components/Info";
import { Storage } from "meta3d-jiehuo-abstract";
import { setIsLoading, setPercent } from "../loading/store/LoadingStore";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../business_layer/State";
import { setInfo } from "../info/store/InfoStore";
import { start, stop, switchScene } from "../../../../business_layer/Scene3D";
import { setCurrentScene, setTargetScene } from "../../../global/store/GlobalStore";
import { off, on, trigger } from "../../../../business_layer/Event";
import { buildErrorEventData, getErrorEventName, getIsEnterScenarioEventName, getLevelStatusUpdateEventName, getMissionCompleteEventName, getMissionFailEventName, getOperateUpdateEventName, getShowDialogueEventName, getSkillStatusUpdateEventName, getGiantessStatusUpdateEventName, getLittleManStatusUpdateEventName, getQTEUpdateEventName } from "../../../../scene3d_layer/utils/EventUtils";
import MissionComplete from "../mission_complete/components/MissionComplete";
import { showCanvas } from "../../../utils/CanvasUtils";
import { getIndexSoundResourceId } from "../../../../business_layer/Loader";
import { stopIndexSounds } from "../../../../business_layer/Sound";
import { setDialogue, setIsEnterScenario, setGiantessStatus, setLevelStatus, setOperateRandomValue, setSkillStatus, setLittleManStatus, setQTERandomValue } from "../store/SceneStore";
import { Camera } from "meta3d-jiehuo-abstract";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import MissionFail from "../mission_fail/components/MissionFail";
import { buildGiantessStatus, buildLittleManStatus, buildSkillStatus, getLittleManCharaterTypeGiantessBarWidth, getOtherBarWidth } from "../../../utils/SceneUtils";
import { getIsDebug, getIsProduction } from "meta3d-jiehuo-abstract/src/state/State";
import { actionName, animationName } from "../../../../scene3d_layer/script/scene/scene_city/data/DataType";
import * as LittleManDataType from "../../../../scene3d_layer/script/scene/scene_city/little_man_data/DataType";
import { getKeyDownEventName, getKeyUpEventName, getPointerDownEventName, getPointerUpEventName } from "meta3d-jiehuo-abstract/src/Event";
import { state } from "../../../../scene3d_layer/type/StateType";
import { actionState, littleManActionState } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { isActionTriggering } from "../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { road } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getRoad } from "meta3d-jiehuo-abstract/src/scene/Scene";
import { getSceneChapter, isGiantessRoad } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { Device } from "meta3d-jiehuo-abstract";
import { stopLoop } from "../../../../business_layer/Loop";
import { CameraControls } from "meta3d-jiehuo-abstract";
// import { setIsStart } from "../../../../scene3d_layer/script/scene/scene_city/little_man/QTE";

export enum scenePage {
    None,
    MissionComplete,
    MissionFail
}

let Scene: React.FC = () => {
    let currentSceneData = useSelector<AppState>((state) => state.global.currentSceneData)
    let targetSceneData = useSelector<AppState>((state) => state.global.targetSceneData)

    let [isSwitchScene, setIsSwitchScene] = useState(false)
    // let [isSetFontSize, setIsSetFontSize] = useState(false)
    let [scenePage_, setScenePage_] = useState(scenePage.None)
    // let [tips, setTips] = useState([])
    // let [title, setTitle] = useState("")
    let [isShowDebug, setIsShowDebug] = useState(false)

    let dispatch: AppDispatch = useDispatch()



    // let _isWeChatBrowser = () => {
    //     return /MicroMessenger/i.test(window.navigator.userAgent)
    // }

    // let _buildTipKey = () => "meta3d_is_show_thirdpersoncontrols_tip_once"

    let _renderMain = (currentSceneData, isSwitchScene) => {
        if (isSwitchScene || NullableUtils.isNullable(currentSceneData)) {
            return null
        }

        currentSceneData = NullableUtils.getExn(currentSceneData)

        let scene_
        switch (currentSceneData.scene) {
            case scene.Play:
            case scene.Biwu:
                scene_ = <City isShowDebug={isShowDebug} setIsShowDebug={setIsShowDebug} />

                // let [destroyedRate, setDestroyedRate] = useState(0)
                // let [height, setHeight] = useState(0)
                // let [isShowDebug, setIsShowDebug] = useState(false)

                break
            // case scene.Warehouse:
            // default:
            //     scene_ = <Warehouse />
            //     break
        }

        // return NullableUtils.getWithDefault(NullableUtils.map(tips => {
        //     return <>
        //         <Tip tips={tips} setTipsFunc={setTips} />
        //         {scene_}
        //     </>
        // }, tips),
        //     scene_
        // )

        return scene_
    }

    let _renderPage = () => {
        switch (scenePage_) {
            case scenePage.None:
                return null
            case scenePage.MissionComplete:
                return <MissionComplete />
            case scenePage.MissionFail:
                return <MissionFail />
        }
    }


    let _manageResource = (state, targetSceneData) => {
        let promise

        dispatch(setIsLoading(true))
        dispatch(setPercent(0))

        switch (targetSceneData.scene) {
            case scene.Play:
                promise = CityScene3D.loadCity1Resource(state, percent => dispatch(setPercent(percent)))
                break
            case scene.Biwu:
                switch (targetSceneData.levelNumber) {
                    case 1:
                        promise = CityScene3D.loadBiwuLevel1Resource(state, percent => dispatch(setPercent(percent)))
                        break
                    case 2:
                        promise = CityScene3D.loadBiwuLevel2Resource(state, percent => dispatch(setPercent(percent)))
                        break
                    case 3:
                        promise = CityScene3D.loadBiwuLevel3Resource(state, percent => dispatch(setPercent(percent)))
                        break
                    default:
                        throw new Error("error")
                }
                break
        }

        return promise.then(state => {
            dispatch(setIsLoading(false))

            return state
        })
    }

    let _switchScene = (currentSceneData, targetSceneData) => {
        let state = readState()

        setIsSwitchScene(_ => true)

        state = stop(state)
        state = writeState(state)


        state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))


        targetSceneData = NullableUtils.getExn(targetSceneData)

        _manageResource(state, targetSceneData).then(state => {
            dispatch(setInfo(NullableUtils.return_("正在初始化")))

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(state)
                }, 100)
            })
        })
            .then(state => {
                state = stopIndexSounds(state)

                return switchScene(state, currentSceneData, targetSceneData)
            })
            .then(state => {
                state = start(state)

                let _ = writeState(state)
            })
            .then(() => {
                showCanvas()

                dispatch(setInfo(null))
                setIsSwitchScene(_ => false)

                dispatch(setCurrentScene(targetSceneData))
                dispatch(setTargetScene(null))
            }).catch(e => {
                return trigger(readState(), getErrorEventName(), buildErrorEventData(e))
            })
    }

    let _skillStatusUpdateEventHandler = (state, { userData }) => {
        let isShow = userData

        if (!isShow) {
            dispatch(setSkillStatus(NullableUtils.getEmpty()))
        }
        else {
            dispatch(setSkillStatus(NullableUtils.return_(buildSkillStatus(state))))
        }

        return Promise.resolve(state)
    }

    let _operateUpdateEventHandler = (state, { userData }) => {
        dispatch(setOperateRandomValue(Math.random()))

        return Promise.resolve(state)
    }

    let _missionCompleteEventHandler = (state, { userData }) => {
        setScenePage_(() => scenePage.MissionComplete)

        return Promise.resolve(state)
    }

    let _missionFailEventHandler = (state, { userData }) => {
        state = stopLoop(state)

        setScenePage_(() => scenePage.MissionFail)

        return Promise.resolve(state)
    }

    let _isEnterScenarioHandle = (state, { userData }) => {
        let isEnterScenario = NullableUtils.getExn(userData)

        dispatch(setIsEnterScenario(isEnterScenario))

        return Promise.resolve(state)
    }

    // let _blackScreenStartHandle = (state, { userData }) => {
    //     dispatch(setIsBlackScreenStart(true))

    //     return Promise.resolve(state)
    // }

    // let _blackScreenStopHandle = (state, { userData }) => {
    //     dispatch(setIsBlackScreenStart(false))

    //     return Promise.resolve(state)
    // }

    let _showDialogueEventHandler = (state, { userData }) => {
        let { data } = NullableUtils.getExn(userData)

        dispatch(setDialogue(NullableUtils.return_(data)))

        return Promise.resolve(state)
    }

    let _giantessStatusUpdateEventHandler = (state, { userData }) => {
        let { damageType } = NullableUtils.getExn(userData)

        dispatch(setGiantessStatus(NullableUtils.return_(buildGiantessStatus(state, isGiantessRoad(state) ? getOtherBarWidth() : getLittleManCharaterTypeGiantessBarWidth(), damageType))))

        return Promise.resolve(state)
    }

    let _littleManStatusUpdateEventHandler = (state, { userData }) => {
        dispatch(setLittleManStatus(NullableUtils.return_(buildLittleManStatus(state, getOtherBarWidth()))))

        return Promise.resolve(state)
    }


    // useEffect(() => {
    //     let cancalDebounce = debounce(setFontSize, 100)

    //     window.addEventListener('resize', cancalDebounce)

    //     setFontSize()

    //     /*! make datav-react -> 装饰 auto resize
    //     * 
    //     */
    //     setIsSetFontSize(_ => true)

    //     return () => {
    //         // 移除
    //         window.removeEventListener('resize', cancalDebounce)
    //     }
    // }, [])

    // TODO move tips to Index
    // useEffect(() => {
    //     let tips = []

    //     //         if (isMobile() && !_isNeedHandleLandscape()) {
    //     //             let tipTitle = "请横屏"
    //     //             let tipContent = ""

    //     //             if (_isWeChatBrowser()) {
    //     //                 tipContent = `请将手机横屏，具体操作步骤如下：
    //     // 1、在微信的“我”->“通用”中，开启横屏模式
    //     // 2、开启手机的自动旋转
    //     // 3、将手机横屏`
    //     //             }
    //     //             else {
    //     //                 tipContent = `请将手机横屏，具体操作步骤如下：
    //     // 1、开启手机的自动旋转
    //     // 2、将手机横屏`
    //     //             }

    //     //             // setTips(tips => tips.concat([tipTitle, tipContent]))
    //     //             tips.push([tipTitle, tipContent])
    //     //         }

    //     let promise

    //     if (isMobile()) {
    //         promise = Storage.getItem<number>(_buildTipKey()).then(showedTimes => {
    //             if (!NullableUtils.isNullable(showedTimes) && NullableUtils.getExn(showedTimes) > 3) {
    //                 return tips
    //             }

    //             // setTips(_ => NullableUtils.return_(["第三人称相机使用说明", "请将左手拇指放到屏幕左方透明的操作杆上，右手拇指放到屏幕右方的任意位置。其中，左手控制人物移动，右手旋转屏幕视角"]))
    //             tips.push(["第三人称相机使用说明", "请将左手拇指放到屏幕左方透明的操作杆上，右手拇指放到屏幕右方的任意位置。其中，左手控制人物移动，右手旋转屏幕视角"])

    //             return Storage.setItem(_buildTipKey(), NullableUtils.getWithDefault(NullableUtils.map(showedTimes => showedTimes + 1, showedTimes),
    //                 1
    //             )).then(_ => tips)
    //         })
    //     }
    //     else {
    //         promise = Promise.resolve(tips)
    //     }

    //     promise.then(tips => {
    //         setTips(_ => tips)
    //     })
    // }, [])

    let _keydownHandle = (state: state, { userData }): Promise<state> => {
        let event = NullableUtils.getExn(userData)

        switch (getRoad(getAbstractState(state))) {
            case road.LittleMan:
                switch (event.code) {
                    case "KeyP":
                        if (!getIsProduction(getAbstractState(state))) {
                            setIsShowDebug((isShowDebug) => !isShowDebug)
                        }
                        return Promise.resolve(state)
                    case "KeyF":
                        return CityScene3D.triggerLittleManAction(state, LittleManDataType.actionName.Blink)
                    default:
                        return Promise.resolve(state)
                }
            case road.Giantess:
                switch (event.code) {
                    case "ShiftLeft":
                    case "ShiftRight":
                        return CityScene3D.triggerAction(state, actionName.Run, false)

                    case "KeyP":
                        if (!getIsProduction(getAbstractState(state))) {
                            setIsShowDebug((isShowDebug) => !isShowDebug)
                        }
                        return Promise.resolve(state)
                    case "KeyK":
                        // state = CityScene3D.bigger(state)
                        return CityScene3D.triggerAction(state, actionName.Bigger)
                    // case "KeyL":
                    //     state = CityScene3D.smaller(state)
                    //     break


                    case "KeyE":
                        return CityScene3D.triggerAction(state, actionName.Stomp)




                    case "KeyB":
                        return CityScene3D.triggerAction(state, actionName.StandToCrawl)
                    case "KeyN":
                        return CityScene3D.triggerAction(state, actionName.CrawlToStand)
                    case "KeyM":
                        return CityScene3D.triggerAction(state, actionName.BreastPress)



                    case "KeyY":
                        return CityScene3D.triggerAction(state, actionName.Pickup)
                    case "KeyU":
                        return CityScene3D.triggerAction(state, actionName.Pickdown)
                    case "KeyI":
                        return CityScene3D.triggerAction(state, actionName.Pinch)
                    case "KeyO":
                        return CityScene3D.triggerAction(state, actionName.Eat)




                    case "KeyH":
                        return CityScene3D.triggerAction(state, actionName.Eat)




                    default:
                        return Promise.resolve(state)
                }
            default:
                throw new Error("err")
        }
    }

    let _keyupHandle = (state: state, { userData }): Promise<state> => {
        let event = NullableUtils.getExn(userData)

        switch (getRoad(getAbstractState(state))) {
            // case road.LittleMan:
            //     // switch (event.code) {
            //     //     case "KeyF":
            //     //         Console.log("up");
            //     //         state = CityScene3D.setLittleManActionState(state, littleManActionState.Initial)
            //     //         break
            //     // }
            //     state = CityScene3D.setLittleManActionState(state, littleManActionState.Initial)
            //     break
            case road.Giantess:
                switch (event.code) {
                    case "ShiftLeft":
                    case "ShiftRight":
                        if (isActionTriggering(state, actionName.Run)) {
                            state = CityScene3D.setActionState(state, actionState.Initial)

                            // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
                        }
                        break
                }
                break
        }

        return Promise.resolve(state)
    }

    let _pointdownHandle = (state: state, { userData }): Promise<state> => {
        let event = NullableUtils.getExn(userData)

        // event.stopPropagation()
        // event.preventDefault()


        switch (getRoad(getAbstractState(state))) {
            case road.LittleMan:
                switch (event.button) {
                    case 0:
                        if (!Device.isMobile()) {
                            return CityScene3D.triggerLittleManAction(state, LittleManDataType.actionName.Shoot)
                        }
                        break
                    case 2:
                        if (!Device.isMobile()) {
                            return CityScene3D.triggerLittleManAction(state, LittleManDataType.actionName.Swiping)
                        }
                        break
                }
                break
        }

        return Promise.resolve(state)
    }

    let _pointupHandle = (state: state, { userData }): Promise<state> => {
        let event = NullableUtils.getExn(userData)

        // event.stopPropagation()
        // event.preventDefault()

        switch (getRoad(getAbstractState(state))) {
            case road.LittleMan:
                switch (event.button) {
                    case 0:
                    case 2:
                        if (!Device.isMobile()) {
                            state = CityScene3D.setLittleManActionState(state, littleManActionState.Initial)
                        }
                        break
                }
                break
        }

        return Promise.resolve(state)
    }

    let _levelStatusUpdateEventHandler = (state, { userData }) => {
        dispatch(setLevelStatus(userData))

        return Promise.resolve(state)
    }

    let _qteUpdateHandle = (state: state, { userData }): Promise<state> => {
        dispatch(setQTERandomValue(Math.random()))

        return Promise.resolve(state)
    }

    useEffect(() => {
        writeState(on(readState(), getMissionCompleteEventName(), _missionCompleteEventHandler))
        writeState(on(readState(), getMissionFailEventName(), _missionFailEventHandler))
        writeState(on(readState(), getIsEnterScenarioEventName(), _isEnterScenarioHandle))
        // writeState(on(readState(), getBlackScreenStartEventName(), _blackScreenStartHandle))
        // writeState(on(readState(), getBlackScreenStopEventName(), _blackScreenStopHandle))
        writeState(on(readState(), getShowDialogueEventName(), _showDialogueEventHandler))
        writeState(on(readState(), getGiantessStatusUpdateEventName(), _giantessStatusUpdateEventHandler))
        writeState(on(readState(), getSkillStatusUpdateEventName(), _skillStatusUpdateEventHandler))

        writeState(on(readState(), getLittleManStatusUpdateEventName(), _littleManStatusUpdateEventHandler))

        writeState(on(readState(), getOperateUpdateEventName(), _operateUpdateEventHandler))


        writeState(on(readState(), getLevelStatusUpdateEventName(), _levelStatusUpdateEventHandler))
        writeState(on(readState(), getKeyDownEventName(), _keydownHandle))
        writeState(on(readState(), getKeyUpEventName(), _keyupHandle))
        writeState(on(readState(), getPointerDownEventName(), _pointdownHandle))
        writeState(on(readState(), getPointerUpEventName(), _pointupHandle))


        writeState(on(readState(), getQTEUpdateEventName(), _qteUpdateHandle))

        return () => {
            writeState(off(readState(), getMissionCompleteEventName(), _missionCompleteEventHandler))
            writeState(off(readState(), getMissionFailEventName(), _missionFailEventHandler))
            writeState(off(readState(), getIsEnterScenarioEventName(), _isEnterScenarioHandle))
            // writeState(off(readState(), getBlackScreenStartEventName(), _blackScreenStartHandle))
            // writeState(off(readState(), getBlackScreenStopEventName(), _blackScreenStopHandle))
            writeState(off(readState(), getShowDialogueEventName(), _showDialogueEventHandler))
            writeState(off(readState(), getGiantessStatusUpdateEventName(), _giantessStatusUpdateEventHandler))
            writeState(off(readState(), getSkillStatusUpdateEventName(), _skillStatusUpdateEventHandler))

            writeState(off(readState(), getLittleManStatusUpdateEventName(), _littleManStatusUpdateEventHandler))


            writeState(off(readState(), getOperateUpdateEventName(), _operateUpdateEventHandler))

            writeState(off(readState(), getKeyDownEventName(), _keydownHandle))
            writeState(off(readState(), getKeyUpEventName(), _keyupHandle))
            writeState(off(readState(), getLevelStatusUpdateEventName(), _levelStatusUpdateEventHandler))

            writeState(off(readState(), getPointerDownEventName(), _pointdownHandle))
            writeState(off(readState(), getPointerUpEventName(), _pointupHandle))

            writeState(off(readState(), getQTEUpdateEventName(), _qteUpdateHandle))
        };
    }, []);

    useEffect(() => {
        _switchScene(currentSceneData, targetSceneData)
    }, [])

    return <Layout  >
        <Loading />
        <Info />
        {_renderMain(currentSceneData, isSwitchScene)}
        {_renderPage()}
    </Layout >
};

export default Scene;
import "./_base.scss"
import "./Scene.scss"
import React, { useState, useRef, useEffect } from 'react';
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
import { setIsLoading, setPercent, setTip } from "../loading/store/LoadingStore";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../business_layer/State";
import { setInfo } from "../info/store/InfoStore";
import { start, stop, switchScene } from "../../../../business_layer/Scene3D";
import { setCharacterType, setCurrentScene, setTargetScene } from "../../../global/store/GlobalStore";
import { off, on, trigger } from "../../../../business_layer/Event";
import { buildErrorEventData, getErrorEventName, getIsEnterScenarioEventName, getLevelStatusUpdateEventName, getMissionCompleteEventName, getMissionFailEventName, getOperateUpdateEventName, getShowDialogueEventName, getPlayerSkillStatusUpdateEventName, getGiantessStatusUpdateEventName, getLittleManStatusUpdateEventName, getQTEUpdateEventName, getSwitchCharacterTypeEventName, getBossStatusUpdateEventName, getUpgradeEventName, getLevelBarUpdateEventName, getGetPropEventName, getCaptureLevelGiantessEventName, getPointerLockEventName, getMissionEndEventName, getCharacterStatusUpdateEventName, getGameEventTipEventName, getInteractionEventName, getCloseAllUIEventName, getShowEnterDoorToastEventName, getHideEnterDoorToastEventName, getSceneUIEventName, getManualUIUpdateEventName, getShowUITipEventName, getShowUILightTipEventName, getCanvasNoneEventName, getOpenTradeEventName, getRequestFullScreenEventName, getBossSkillStatusUpdateEventName } from "../../../../scene3d_layer/utils/EventUtils";
import MissionComplete from "../mission_complete/components/MissionComplete";
import { showCanvas } from "../../../utils/CanvasUtils";
import { stopIndexSounds } from "../../../../business_layer/Sound";
import { setDialogue, setIsEnterScenario, setGiantessStatus, setLevelStatus, setOperateRandomValue, setLittleManStatus, setQTERandomValue, setBossStatus, setUpgradeData, setLevelBarRandomValue, setCharacterStatus, setGetProp, setGameEventTip, setTradeData, setMissionComplete, setSceneUIData, setManualUIUpdateRandomValue, setPlayerSkillStatus, setBossSkillStatus } from "../store/SceneStore";
import { Camera } from "meta3d-jiehuo-abstract";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import MissionFail from "../mission_fail/components/MissionFail";
import { buildBossStatus, buildGiantessStatus, buildLittleManStatus, buildMissionComplete, buildSkillStatus, getOtherBarWidth } from "../../../utils/SceneUtils";
import { actionName, animationName } from "../../../../scene3d_layer/script/scene/scene_city/data/DataType";
import * as LittleManDataType from "../../../../scene3d_layer/script/scene/scene_city/little_man_data/DataType";
import { getKeyDownEventName, getKeyUpEventName, getPointerDownEventName, getPointerUpEventName } from "meta3d-jiehuo-abstract/src/Event";
import { state } from "../../../../scene3d_layer/type/StateType";
import { actionState, camp, interactionName, littleManActionState, propType, usedGirlEnum } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { isActionTriggering } from "../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene";
import { getAllValidPropTypeData, getGetRewardResourceId, getOpenChestBoxResourceId, getOpenFateResourceId, getOpenTradeResourceId, getSceneChapter, initBeforeManageResource, isCharacterTypeEqual, isEnterScene, isGiantessCharacterType, setSceneData } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { Device } from "meta3d-jiehuo-abstract";
import { stopLoop } from "../../../../business_layer/Loop";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { Modal, Dialog, Toast, List, Card } from "antd-mobile";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { computePropCountByPropCountFactor, handleGetPropOnGround, markIsHandleGetPropOnGround } from "../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { renderImage, renderImageDom } from "../../../utils/ImageUtils";
import { handleCapture } from "../../../../scene3d_layer/script/scene/scene_city/girl/Capture";
import { handleCloseModal, handleOpenModal, hasOpenedModalDom } from "../../../utils/ModalUtils";
import { deferSwitchPageForGetNewestState } from "../../../utils/SwitchPageUtils";
import MissionEnd from "../mission_end/components/MissionEnd";
import { buildCharacterStatusUpdateEventData } from "../../../../scene3d_layer/script/scene/scene_city/utils/EventUtils";
import { Flow } from "meta3d-jiehuo-abstract";
import { isActionState, isTriggerAction, resetIsTriggerAction } from "../../../../scene3d_layer/script/scene/scene_city/little_man/Action";
import { handleEndShoot, handleStartShoot } from "../../../../scene3d_layer/script/scene/scene_city/little_man/Shoot";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getAllProps, hasPropsByType } from "../../../../scene3d_layer/script/scene/scene_city/reward/Prop";
import { ToastHandler } from "antd-mobile/es/components/toast";
// import { setIsStart } from "../../../../scene3d_layer/script/scene/scene_city/little_man/QTE";
import Text from 'antd/es/typography/Text';
import { finishUse, getChestBoxReward, getCurrentInteractioDataExn, getInteractionName, getRandomChestBoxReward, getRandomFate, getRandomTrade, hasCurrentInteractioData, triggerEvent, updateChestBoxReward } from "../../../../scene3d_layer/script/scene/scene_city/Interaction";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getOriginSystemVolume } from "../../../../scene3d_layer/script/scene/scene_city/utils/SoundUtils";
import { getIsDebug, getIsProduction, getIsShowDemo } from "../../../../scene3d_layer/script/scene/Scene";
import { addBuff } from "../../../../scene3d_layer/script/scene/scene_city/buff/Buff";
import { getLanguageTextData, languageKey } from "../../../../scene3d_layer/internation/Data";
import { getTitle } from "../../../../scene3d_layer/script/scene/scene_city/director/GameEventDirector";
import { getIsShowingUILightTip, getLightUITips, hasOpenedModal, setIsShowingUILightTip, setLightUITips } from "../../../../scene3d_layer/script/scene/scene_city/UI";
import { closeHandler } from "../../../utils/HandlerUtils";
import { handleEventHandler } from "../../../utils/ErrorUtils";
import { getIsShowEnterDoorToast, handleMissionComplete, setIsShowEnterDoorToast } from "../../../../scene3d_layer/script/scene/scene_city/manage/mission/Mission";
import { wrapDescription } from "../../../../scene3d_layer/utils/ToastUtils";
import screenfull from "screenfull";
import { isCanSelectItems, selectItems, setIsWait } from "../../../../scene3d_layer/script/scene/scene_city/build/Upgrade";
import { getNextLevelData, loadSceneResource } from "../../../../scene3d_layer/mod/SceneMod";
import { generateArmyInSpecificPosition } from "../../../../scene3d_layer/script/scene/scene_city/manage/city1/generator/utils/ArmyGeneratorUtils";
import { generateMilltaryBuildings } from "../../../../scene3d_layer/script/scene/scene_city/manage/city1/generator/ArmyGenerator";
import { generateTurrets } from "../../../../scene3d_layer/script/scene/scene_city/manage/city1/milltary_building/ShellTurret";
import { getPlayerPosition } from "../../../../scene3d_layer/script/scene/scene_city/utils/PlayerUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { getModAPI } from "../../../../scene3d_layer/script/scene/scene_city/Mod";
import { triggerInteraction } from "../../../../scene3d_layer/mod/InteractionMod";
import { clickDom, deferClickDomForGetNewestState } from "../../../utils/DomUtils";
import { buildFastPropItemClassName } from "../../../utils/PropUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { getSwipBlockService } from "../../../../scene3d_layer/mod/SkillLittleManMod";
import { getFastPropData } from "../../../../scene3d_layer/script/scene/scene_city/FastProp";
import { exit } from "../../../utils/MissionUtils";
import { getRandomTip } from "../../../../business_layer/Tip";
import { setVersionCache } from "meta3d-jiehuo-abstract/src/storage/Storage";
import { Version } from "meta3d-jiehuo-abstract";
import { requestFullScreen } from "../../../utils/FullScreenUtils";
import { isBurstFire } from "../../../../scene3d_layer/script/scene/scene_city/little_man/LittleMan";
import { triggerDownActionForBurstFire, triggerDownActionForContinueFire, triggerUpActionForBurstFire, triggerUpActionForContinueFire } from "../../../utils/OperateUtils";
import { isCanEnterDoor } from "../../../../scene3d_layer/script/scene/scene_city/manage/city1/Mission";

export enum scenePage {
    None,
    MissionComplete,
    MissionFail,
    MissionEnd
}

export enum menuItem {
    Camera = "Camera",
    // Skill = "Skill",
    UI = "UI",
    Operate = "Operate",
    EndLevel = "EndLevel",

    // Prop = "Prop",
    // ControlGiantess,
    // Debug
}

let Scene: React.FC = () => {
    let currentSceneData = useSelector<AppState>((state) => state.global.currentSceneData)
    let targetSceneData = useSelector<AppState>((state) => state.global.targetSceneData)
    let character = useSelector<AppState>((state) => state.global.character)
    // let fastPropData = useSelector<AppState>((state) => state.scene.fastPropData)

    let [isSwitchScene, setIsSwitchScene] = useState(false)
    // let [isSetFontSize, setIsSetFontSize] = useState(false)
    let [scenePage_, setScenePage_] = useState(scenePage.None)
    // let [tips, setTips] = useState([])
    // let [title, setTitle] = useState("")
    let [isShowDebug, setIsShowDebug] = useState(false)
    let [isShowMainMenu, setIsShowMainMenu] = useState(false)
    let [isShowProp, setIsShowProp] = useState(false)
    let [currentMenuItem, setCurrentMenuItem] = useState(menuItem.Camera)
    let [currentPropItem, setCurrentPropItem] = useState(propType.None)
    // let [currentPropItem, setCurrentPropItem] = useState(propType.None)
    let interactionHandler = useRef<ToastHandler>()
    let enterDoorToastHandler = useRef<ToastHandler>()
    let uiLightTipToastHandler = useRef<ToastHandler>()

    // let [_, setRefresh] = useState(Math.random());

    let dispatch: AppDispatch = useDispatch()



    // let _isWeChatBrowser = () => {
    //     return /MicroMessenger/i.test(window.navigator.userAgent)
    // }

    // let _buildTipKey = () => "meta3d_is_show_thirdpersoncontrols_tip_once"

    let _renderMain = (currentSceneData, isSwitchScene) => {
        if (isSwitchScene || NullableUtils.isNullable(currentSceneData) || !isEnterScene(readState())) {
            return null
        }

        currentSceneData = NullableUtils.getExn(currentSceneData)

        let scene_
        switch (currentSceneData.scene) {
            case scene.Play:
            // case scene.Protect:
            case scene.Biwu:
            default:
                scene_ = <City isShowDebug={isShowDebug} setIsShowDebug={setIsShowDebug}
                    isShowMainMenu={isShowMainMenu} setIsShowMainMenu={setIsShowMainMenu}
                    isShowProp={isShowProp} setIsShowProp={setIsShowProp}

                    currentMenuItem={currentMenuItem}
                    setCurrentMenuItem={setCurrentMenuItem}
                    currentPropItem={currentPropItem}
                    setCurrentPropItem={setCurrentPropItem}

                    openSetting={_openSetting}
                    openProp={_openProp}
                />

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
            case scenePage.MissionEnd:
                return <MissionEnd />
        }
    }


    let _manageResource = (state: state, targetSceneData, character): Promise<state> => {
        let promise

        dispatch(setIsLoading(true))
        dispatch(setPercent(0))
        dispatch(setTip(getRandomTip(state)))

        switch (targetSceneData.scene) {
            case scene.Play:
                promise = CityScene3D.loadCity1Resource(state, percent => dispatch(setPercent(percent)), character)
                break
            // case scene.Protect:
            //     promise = CityScene3D.loadProtectResource(state, percent => dispatch(setPercent(percent)))
            //     break
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
            default:
                promise = loadSceneResource(state, percent => dispatch(setPercent(percent)), targetSceneData.scene, character)
                break
        }

        return promise.then(state => {
            dispatch(setIsLoading(false))

            // return new Promise<state>((resolve, reject) => {
            //     setTimeout(() => {
            //         resolve(state)
            //     }, 100)
            // })
            return state
        })
    }

    let _bindEvents = () => {
        writeState(on(readState(), getMissionCompleteEventName(), _missionCompleteEventHandler))
        writeState(on(readState(), getMissionFailEventName(), _missionFailEventHandler))
        writeState(on(readState(), getMissionEndEventName(), _missionEndEventHandler))
        writeState(on(readState(), getIsEnterScenarioEventName(), _isEnterScenarioHandle))
        // writeState(on(readState(), getBlackScreenStartEventName(), _blackScreenStartHandle))
        // writeState(on(readState(), getBlackScreenStopEventName(), _blackScreenStopHandle))
        writeState(on(readState(), getShowDialogueEventName(), _showDialogueEventHandler))
        writeState(on(readState(), getBossStatusUpdateEventName(), _bossStatusUpdateEventHandler))
        writeState(on(readState(), getGiantessStatusUpdateEventName(), _giantessStatusUpdateEventHandler))
        writeState(on(readState(), getPlayerSkillStatusUpdateEventName(), _playerSkillStatusUpdateEventHandler))
        // writeState(on(readState(), getBossSkillStatusUpdateEventName(), _bossSkillStatusUpdateEventHandler))
        writeState(on(readState(), getCharacterStatusUpdateEventName(), _characterStatusUpdateEventHandler))

        writeState(on(readState(), getLittleManStatusUpdateEventName(), _littleManStatusUpdateEventHandler))

        writeState(on(readState(), getOperateUpdateEventName(), _operateUpdateEventHandler))
        writeState(on(readState(), getManualUIUpdateEventName(), _manualUIUpdateEventHandler))

        // writeState(on(readState(), getLevelBarUpdateEventName(), _levelBarUpdateEventHandler))

        writeState(on(readState(), getUpgradeEventName(), _upgradeEventHandler))


        writeState(on(readState(), getLevelStatusUpdateEventName(), _levelStatusUpdateEventHandler))
        writeState(on(readState(), getKeyDownEventName(), _keydownHandle))
        writeState(on(readState(), getKeyUpEventName(), _keyupHandle))
        writeState(on(readState(), getPointerDownEventName(), _pointdownHandle))
        writeState(on(readState(), getPointerUpEventName(), _pointupHandle))


        writeState(on(readState(), getQTEUpdateEventName(), _qteUpdateHandler))

        writeState(on(readState(), getSwitchCharacterTypeEventName(), _switchHandler))

        writeState(on(readState(), getGetPropEventName(), _getPropHandler))

        writeState(on(readState(), getGameEventTipEventName(), _gameEventTipHandler))

        writeState(on(readState(), getCaptureLevelGiantessEventName(), _captureLevelGiantessHandler))

        writeState(on(readState(), getPointerLockEventName(), _pointerLockHandler))

        writeState(on(readState(), getInteractionEventName(), _interactionHandler))
        writeState(on(readState(), getShowEnterDoorToastEventName(), _showEnterDoorToastHandler))
        writeState(on(readState(), getHideEnterDoorToastEventName(), _hideEnterDoorToastHandler))

        writeState(on(readState(), getCloseAllUIEventName(), _closeAllUIHandler))


        writeState(on(readState(), getSceneUIEventName(), _sceneUIHandler))


        writeState(on(readState(), getShowUITipEventName(), _showUITipHandler))

        writeState(on(readState(), getShowUILightTipEventName(), _showUILightTipHandler))

        writeState(on(readState(), getCanvasNoneEventName(), _canvasNoneHandler))

        writeState(on(readState(), getOpenTradeEventName(), _openTradeHandler))

        writeState(on(readState(), getRequestFullScreenEventName(), _requestFullScreenHandler))

        // writeState(on(readState(), getSetFastPropEventName(), _setFastPropHandler))
    }

    let _switchScene = (currentSceneData, targetSceneData) => {
        // dispatch(setCurrentScene(targetSceneData))
        // dispatch(setTargetScene(null))
        // return 

        let state = readState()

        setIsSwitchScene(_ => true)

        state = stop(state)
        state = writeState(state)


        state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))


        targetSceneData = NullableUtils.getExn(targetSceneData)

        return setSceneData(state, targetSceneData.scene, targetSceneData.levelNumber).then(state => {
            writeState(state)

            _bindEvents()

            return readState()
        }).then(state => {
            dispatch(setInfo(NullableUtils.return_(getLanguageTextData(state, languageKey.InitingInfo))))

            return initBeforeManageResource(state).then(state => {
                dispatch(setInfo(null))

                return _manageResource(state, targetSceneData, character)
            })
                .then(state => {
                    return stopIndexSounds(state).then(state => {
                        dispatch(setInfo(NullableUtils.return_(getLanguageTextData(readState(), languageKey.EnteringScene))))

                        return switchScene(state, currentSceneData, targetSceneData)
                    })
                })
                .then(state => {
                    state = start(state)
                    state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))


                    let _ = writeState(state)

                    return Version.saveVersion(getAbstractState(state))
                })
                .then(() => {
                    // setTimeout(() => {
                    dispatch(setInfo(null))
                    setIsSwitchScene(_ => false)

                    // showCanvas()
                    /*! increase time or remove time can solve "maybe heipin" bug
                    */
                    // }, 100)
                    // }, 300)

                    dispatch(setCurrentScene(targetSceneData))
                    dispatch(setTargetScene(null))
                })
        }).catch(e => {
            return trigger(readState(), getErrorEventName(), buildErrorEventData(e))
        })
    }

    let _playerSkillStatusUpdateEventHandler = (state, { userData }) => {
        let { isShow, usedGirl } = userData

        if (!isShow) {
            dispatch(setPlayerSkillStatus(NullableUtils.getEmpty()))
        }
        else {
            dispatch(setPlayerSkillStatus(NullableUtils.return_(buildSkillStatus(state, usedGirl))))
        }

        return Promise.resolve(state)
    }

    // let _bossSkillStatusUpdateEventHandler = (state, { userData }) => {
    //     let { isShow, usedGirl } = userData

    //     if (!isShow) {
    //         dispatch(setBossSkillStatus(NullableUtils.getEmpty()))
    //     }
    //     else {
    //         dispatch(setBossSkillStatus(NullableUtils.return_(buildSkillStatus(state, usedGirl))))
    //     }

    //     return Promise.resolve(state)
    // }

    let _characterStatusUpdateEventHandler = (state, { userData }) => {
        dispatch(setCharacterStatus(buildCharacterStatusUpdateEventData(state)))

        return Promise.resolve(state)
    }


    let _operateUpdateEventHandler = (state, { userData }) => {
        dispatch(setOperateRandomValue(Math.random()))

        return Promise.resolve(state)
    }

    let _manualUIUpdateEventHandler = (state, { userData }) => {
        // dispatch(setManualUIUpdateRandomValue(Math.random()))
        deferSwitchPageForGetNewestState(dispatch, setManualUIUpdateRandomValue(Math.random()))

        return Promise.resolve(state)
    }


    // let _levelBarUpdateEventHandler = (state, { userData }) => {
    //     dispatch(setLevelBarRandomValue(Math.random()))

    //     return Promise.resolve(state)
    // }


    let _missionCompleteEventHandler = (state, { userData }) => {
        return getNextLevelData(state).then(data => {
            setScenePage_(() => scenePage.MissionComplete)
            dispatch(setMissionComplete(NullableUtils.return_(buildMissionComplete(true,
                data,
            ))))

            return Promise.resolve(state)
        })
    }

    let _missionFailEventHandler = (state, { userData }) => {
        state = stopLoop(state)

        setScenePage_(() => scenePage.MissionFail)

        return Promise.resolve(state)
    }

    let _missionEndEventHandler = (state, { userData }) => {
        state = stopLoop(state)

        setScenePage_(() => scenePage.MissionEnd)

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

    let _bossStatusUpdateEventHandler = (state, { userData }) => {
        // dispatch(setBossStatus(NullableUtils.map(({ dataArr }) => {
        //     return buildBossStatus(state, dataArr)
        // }, userData)))

        // return Promise.resolve(state)

        let { dataArr } = NullableUtils.getExn(userData)

        dispatch(setBossStatus(buildBossStatus(state, dataArr)))

        return Promise.resolve(state)
    }

    let _giantessStatusUpdateEventHandler = (state, { userData }) => {
        // if (NullableUtils.isNullable(userData)) {
        //     dispatch(setGiantessStatus(NullableUtils.getEmpty()))

        //     return Promise.resolve(state)
        // }

        let { damagePart, usedGirl } = NullableUtils.getExn(userData)

        dispatch(setGiantessStatus(NullableUtils.return_(buildGiantessStatus(state, usedGirl, getOtherBarWidth(), damagePart))))

        return Promise.resolve(state)
    }

    let _littleManStatusUpdateEventHandler = (state, { userData }) => {
        dispatch(setLittleManStatus(NullableUtils.return_(buildLittleManStatus(state, getOtherBarWidth()))))

        return Promise.resolve(state)
    }


    let _upgradeEventHandler = (state, { userData }) => {
        let { data } = NullableUtils.getExn(userData)

        if (hasOpenedModal(state)) {
            // throw new Error("shouldn't has opened modal")
            // return state
            return setIsWait(state, false)
        }

        if (Camera.isCanLock(getAbstractState(state))) {
            state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
        }

        state = handleOpenModal(state)

        dispatch(setUpgradeData(data))

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

    let _openSetting = (state) => {
        if (hasOpenedModal(state)) {
            return state
        }

        setIsShowMainMenu(_ => true)
        setCurrentMenuItem(_ => menuItem.Camera)

        state = handleOpenModal(state)

        return state
    }

    let _openProp = (state) => {
        if (hasOpenedModal(state)) {
            return state
        }

        setIsShowProp(_ => true)

        NullableUtils.forEach(([propType, _]) => {
            setCurrentPropItem(_ => propType)
        }, ArrayUtils.get(getAllValidPropTypeData(state), 0))

        state = handleOpenModal(state)

        return state
    }

    let _keydownHandle = (state: state, { userData }): Promise<state> => {
        let event = NullableUtils.getExn(userData)

        return Event.trigger(state, getAbstractState, getModAPI(state).event.getKeydownEventName(), NullableUtils.return_({ code: event.code })).then(state => {
            switch (event.code) {
                case "BracketLeft":
                    // if (!getIsProduction(getAbstractState(state))) {

                    // if (getIsDebug(state)) {

                    if (
                        // getIsDebug(state)
                        // || getIsShowDemo(state)
                        !getIsProduction(state)
                    ) {
                        // if (true) {
                        if (!isShowDebug) {
                            if (Camera.isCanLock(getAbstractState(state))) {
                                state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
                            }
                        }

                        setIsShowDebug((isShowDebug) => !isShowDebug)
                    }
                    return Promise.resolve(state)

                case "Digit1":
                    // // state = setAbstractState(state, ParticleManager.emitIce(getAbstractState(state),
                    // //     {
                    // //         speed: 1,
                    // //         life: 2000,
                    // //         // size: 60,
                    // //         width: 10,
                    // //         height: 10,
                    // //         position: getPlayerPosition(state).toArray(),
                    // //         resourceId: getIceResourceId(),
                    // //     }
                    // // ))
                    // let api = getModAPI(state)
                    // state = api.blockAPI.getBlockService<any>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
                    //     [
                    //         api.blockAPI.getBlockService(state, getParticleProtocolName(), getParticleBillboardIceBlockName()),
                    //         state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBillboardIceBlockName()),
                    //         (state, blockState) => {
                    //             return api.blockAPI.setBlockState(state, getParticleProtocolName(), getParticleBillboardIceBlockName(), blockState)
                    //         }
                    //     ],
                    //     api.blockAPI.getBlockService<any>(state, getParticleProtocolName(), getParticleBillboardIceBlockName()).getParticleType(),
                    //     {
                    //         speed: 1,
                    //         life: 2000,
                    //         width: 10,
                    //         height: 10,
                    //         position: getPlayerPosition(state).toArray(),
                    //         resourceId: api.blockAPI.getBlockService<any>(state, getParticleProtocolName(), getParticleBillboardIceBlockName()).getImageId(),
                    //     })


                    deferClickDomForGetNewestState(`${buildFastPropItemClassName(0)}`)
                    return Promise.resolve(state)
                case "Digit2":
                    deferClickDomForGetNewestState(`${buildFastPropItemClassName(1)}`)
                    return Promise.resolve(state)
                case "Digit3":
                    deferClickDomForGetNewestState(`${buildFastPropItemClassName(2)}`)
                    return Promise.resolve(state)
                case "Digit4":
                    deferClickDomForGetNewestState(`${buildFastPropItemClassName(3)}`)
                    return Promise.resolve(state)
                case "Digit5":
                    deferClickDomForGetNewestState(`${buildFastPropItemClassName(4)}`)
                    return Promise.resolve(state)
                // case "Digit0":
                case "KeyZ":
                    if (CityScene3D.isCanSwitchCharacterType(state)) {
                        return Promise.resolve(CityScene3D.switchCharacterType(state))
                    }
                    break

                case "KeyP":
                    // case "Escape":
                    // throw new Error("E")
                    if (Camera.isCanLock(getAbstractState(state))) {
                        state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
                    }
                    state = _openSetting(state)
                    break
                case "KeyQ":
                    if (Camera.isCanLock(getAbstractState(state))) {
                        state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
                    }
                    state = _openProp(state)
                    break
                case "KeyV":
                    // if (!_isCloseToast(enterDoorToastHandler)) {
                    if (isCanEnterDoor(state)) {
                        if (Camera.isCanLock(getAbstractState(state))) {
                            state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
                        }
                        return handleMissionComplete(state, 0)
                    }
                    // else if (hasCurrentInteractioData(state)) {
                    else if (!_isCloseToast(interactionHandler)) {
                        if (Camera.isCanLock(getAbstractState(state))) {
                            state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
                        }
                        return _handleInteraction(state)
                    }
                    break
                // case "KeyC":
                //     if (hasCurrentInteractioData(state)) {
                //         _closeToast(interactionHandler)
                //     }
                //     break
                case "KeyX":
                    if (isCanSelectItems(state)) {
                        state = selectItems(state)
                    }
                    return Promise.resolve(state)

                default:
                    break
            }

            switch (getCharacterType(getAbstractState(state))) {
                case characterType.LittleMan:
                    switch (event.code) {
                        case "KeyF":
                            return CityScene3D.triggerLittleManAction(state, LittleManDataType.actionName.Blink)
                        case "KeyE":
                            return CityScene3D.triggerLittleManAction(state, LittleManDataType.actionName.Lock)
                        default:
                            return Promise.resolve(state)
                    }
                    break
                case characterType.Giantess:
                    let usedGirl = usedGirlEnum.PlayerGirl

                    switch (event.code) {
                        case "ShiftLeft":
                        case "ShiftRight":
                            if (!isActionTriggering(state, usedGirl, actionName.Run)) {
                                return CityScene3D.triggerAction(state, usedGirl, actionName.Run)
                            }

                            return Promise.resolve(state)
                        case "KeyK":
                            // state = CityScene3D.bigger(state)
                            return CityScene3D.triggerAction(state, usedGirl, actionName.Bigger)
                        // case "KeyL":
                        //     state = CityScene3D.smaller(state)
                        //     break


                        // case "KeyE":
                        //     return CityScene3D.triggerAction(state, usedGirl, actionName.Stomp)




                        case "KeyB":
                            return CityScene3D.triggerAction(state, usedGirl, actionName.StandToCrawl)
                        case "KeyN":
                            return CityScene3D.triggerAction(state, usedGirl, actionName.CrawlToStand)
                        // case "KeyM":
                        //     return CityScene3D.triggerAction(state, usedGirl, actionName.BreastPress)



                        case "KeyY":
                            return CityScene3D.triggerAction(state, usedGirl, actionName.Pickup)
                        case "KeyU":
                            return CityScene3D.triggerAction(state, usedGirl, actionName.Pickdown)
                        case "KeyI":
                            return CityScene3D.triggerAction(state, usedGirl, actionName.Pinch)
                        case "KeyO":
                            return CityScene3D.triggerAction(state, usedGirl, actionName.Eat)





                        default:
                            return Promise.resolve(state)
                    }
                    break
                default:
                    throw new Error("err")
            }


            return state
        })

    }

    let _keyupHandle = (state: state, { userData }): Promise<state> => {
        let event = NullableUtils.getExn(userData)

        return Event.trigger(state, getAbstractState, getModAPI(state).event.getKeyupEventName(), NullableUtils.return_({ code: event.code })).then(state => {
            switch (getCharacterType(getAbstractState(state))) {
                case characterType.LittleMan:
                    switch (event.code) {
                        // case "KeyF":
                        //     Console.log("up");
                        //     state = CityScene3D.setLittleManActionState(state, littleManActionState.Initial)
                        //     break
                        case "KeyE":
                            state = resetIsTriggerAction(state)
                            break
                    }
                    //     state = CityScene3D.setLittleManActionState(state, littleManActionState.Initial)
                    break
                case characterType.Giantess:
                    let usedGirl = usedGirlEnum.PlayerGirl
                    switch (event.code) {
                        case "ShiftLeft":
                        case "ShiftRight":
                            if (isActionTriggering(state, usedGirl, actionName.Run)) {
                                state = CityScene3D.setActionState(state, usedGirl, actionState.Initial)

                                // return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null)
                            }
                            break
                    }
                    break
            }

            return state
        })
    }

    let _pointdownHandle = (state: state, { userData }): Promise<state> => {
        let event = NullableUtils.getExn(userData)

        // event.stopPropagation()
        // event.preventDefault()

        return Event.trigger(state, getAbstractState, getModAPI(state).event.getPointdownEventName(), NullableUtils.return_({ button: event.button })).then(state => {
            switch (getCharacterType(getAbstractState(state))) {
                case characterType.LittleMan:
                    if (Camera.isCanLock(getAbstractState(state)) && !CameraControls.isEnablePointerLock(getAbstractState(state))) {
                        return state
                    }

                    switch (event.button) {
                        case 0:
                            if (
                                !Device.isMobileByState(getAbstractState(state))
                                && !hasOpenedModalDom()
                            ) {
                                // state = handleStartShoot(state)
                                if (isBurstFire(state)) {
                                    return triggerDownActionForBurstFire(state, LittleManDataType.actionName.Shoot)
                                }
                                return triggerDownActionForContinueFire(state, LittleManDataType.actionName.Shoot)

                                // return CityScene3D.triggerLittleManAction(state, LittleManDataType.actionName.Shoot)
                            }
                            break
                        // case 2:
                        //     if (!Device.isMobileByState(getAbstractState(state))) {
                        //         return CityScene3D.triggerLittleManAction(state, LittleManDataType.actionName.Swiping)
                        //     }
                        //     break
                    }
                    break
            }

            return state
        })
    }

    let _pointupHandle = (state: state, { userData }): Promise<state> => {
        let event = NullableUtils.getExn(userData)

        // event.stopPropagation()
        // event.preventDefault()

        return Event.trigger(state, getAbstractState, getModAPI(state).event.getPointupEventName(), NullableUtils.return_({ button: event.button })).then(state => {
            switch (getCharacterType(getAbstractState(state))) {
                case characterType.LittleMan:
                    switch (event.button) {
                        case 0:
                            if (!Device.isMobileByState(getAbstractState(state))
                                && isTriggerAction(state, LittleManDataType.actionName.Shoot)
                            ) {
                                // state = handleEndShoot(state)

                                if (isBurstFire(state)) {
                                    return triggerUpActionForBurstFire(state, LittleManDataType.actionName.Shoot)
                                }
                                return triggerUpActionForContinueFire(state, LittleManDataType.actionName.Shoot)

                            }

                        case 2:
                            if (!Device.isMobileByState(getAbstractState(state))
                                // && isTriggerAction(state, getSwipBlockService(state).getActionName())
                                && isActionState(state, littleManActionState.Shoot)
                            ) {
                                state = CityScene3D.setLittleManActionState(state, littleManActionState.Initial)
                            }
                            break
                    }
                    break
            }

            return state
        })
    }

    let _levelStatusUpdateEventHandler = (state, { userData }) => {
        dispatch(setLevelStatus(userData))

        return Promise.resolve(state)
    }

    let _qteUpdateHandler = (state: state, { userData }): Promise<state> => {
        dispatch(setQTERandomValue(Math.random()))

        return Promise.resolve(state)
    }

    let _switchHandler = (state: state, { userData }): Promise<state> => {
        let { characterType } = NullableUtils.getExn(userData)
        // setRefresh(_ => Math.random())
        dispatch(setCharacterType(characterType))
        // deferSwitchPageForGetNewestState(dispatch, setCharacterType(characterType))

        return Promise.resolve(state)
    }

    let _buildGetPropDeferName = () => "_buildGetPropDeferName"

    let _tip = (state: state, setStoreFunc, data, deferName, deferTime = 3) => {
        state = setAbstractState(state, Flow.directlyRemoveDeferExecFuncData(getAbstractState(state), deferName))

        state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
            dispatch(setStoreFunc(NullableUtils.getEmpty()))

            return Promise.resolve(state)
        }, deferTime, deferName));

        deferSwitchPageForGetNewestState(dispatch, setStoreFunc(NullableUtils.return_(data)))

        return state
    }

    let _getPropHandler = (state: state, { userData }): Promise<state> => {
        let { image, imageSrc, name, title, description, count } = NullableUtils.getExn(userData)

        // count = computePropCountByPropCountFactor(count, state)

        state = handleGetPropOnGround(state, image, name, count)

        state = markIsHandleGetPropOnGround(state, false)

        state = _tip(state, setGetProp, { imageSrc, title, description, count }, _buildGetPropDeferName())

        // if (Camera.isCanLock(getAbstractState(state))) {
        //     state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
        // }


        // state = handleOpenModal(state, true)

        // Modal.confirm({
        //     getContainer: LandscapeUtils.getRootDom(),
        //     title: <>
        //         {renderImage(imageSrc, "prop_image", false)}
        //         <span>{name} 数量：{count}</span>
        //     </>,
        //     content: description,
        //     confirmText: "拾取",
        //     cancelText: "销毁",
        //     onConfirm: async () => {
        //         let state = (handleGetPropOnGround(readState(), image, name, count))

        //         state = markIsHandleGetPropOnGround(state, false)

        //         writeState(state)

        //         handleCloseModal()

        //         return Promise.resolve()
        //     },
        //     onCancel: async () => {
        //         let state = (handleRemovePropOnGround(readState(), image, name))

        //         state = markIsHandleGetPropOnGround(state, false)

        //         writeState(state)

        //         handleCloseModal()

        //         return Promise.resolve()
        //     },
        // })

        return Promise.resolve(state)
    }

    let _buildGameEventTipDeferName = () => "_buildGameEventTipDeferName"

    let _gameEventTipHandler = (state: state, { userData }): Promise<state> => {
        let { description } = NullableUtils.getExn(userData)

        state = _tip(state, setGameEventTip, { description }, _buildGameEventTipDeferName())

        return Promise.resolve(state)
    }

    let _captureLevelGiantessHandler = (state: state, { userData }): Promise<state> => {
        let { girlPosition, mmdCharacter } = NullableUtils.getExn(userData)

        if (Camera.isCanLock(getAbstractState(state))) {
            state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
        }


        state = handleCapture(state, mmdCharacter)


        state = handleOpenModal(state)

        // Dialog.alert({
        Modal.alert({
            // className: buildModalClassName(),
            content: getLanguageTextData(readState(), languageKey.CaptureWildGiantessSuccessInfo),
            confirmText: getLanguageTextData(readState(), languageKey.Confirm),
            onConfirm: () => {
                handleCloseModal()
            },
        })
        // Modal.confirm({
        //     getContainer: LandscapeUtils.getRootDom(),
        //     title: `是否要捕捉野生巨大娘`,
        //     onConfirm: async () => {
        //         let state = readState()

        //         state = handleCapture(state, mmdCharacter)


        //         writeState(state)

        //         handleCloseModal()

        //         return Promise.resolve()
        //     },
        //     onCancel: async () => {
        //         let state = readState()

        //         state = handleNotCapture(state, girlPosition)

        //         writeState(state)

        //         handleCloseModal()

        //         return Promise.resolve()
        //     },
        // })

        return Promise.resolve(state)
    }

    let _pointerLockHandler = (state: state, { userData }): Promise<state> => {
        if (Camera.isCanLock(getAbstractState(state))) {
            state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
        }

        // state = handleOpenModal(state)

        Modal.alert({
            getContainer: LandscapeUtils.getRootDom(),
            // className: buildModalClassName(),
            confirmText: getLanguageTextData(readState(), languageKey.RestorePointerLockInfo),
            onConfirm: handleEventHandler(() => {
                writeState(setAbstractState(state, CameraControls.lock(getAbstractState(state))))

                handleCloseModal()
            }),
        })

        return Promise.resolve(state)
    }


    let _closeToast = closeHandler

    let _isCloseToast = (handler) => {
        return NullableUtils.isNullable(handler.current)
    }

    // let _handleBuffGirl = (state, [getRandomBuffFunc, addBuffFunc], title, [listClassName, imageClassName, textClassName]) => {
    //     let randomBuff = getRandomBuffFunc(state)

    //     let content = <List header='' className={listClassName}>
    //         {
    //             randomBuff.map(d => {
    //                 return <List.Item>
    //                     {
    //                         renderImageDom(d[3], imageClassName)
    //                     }
    //                     {
    //                         <Text className={textClassName}>{d[4]}</Text>
    //                     }
    //                 </List.Item>
    //             })
    //         }
    //     </List>



    //     let getFunc = (state) => {
    //         return addBuffFunc(state, randomBuff)
    //     }

    //     state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
    //         SoundManager.buildNeedToPlaySoundData(getOpenBuffGirlResourceId(), getIsDebug(state), getOriginSystemVolume(state))
    //     ))


    //     Modal.alert({
    //         getContainer: LandscapeUtils.getRootDom(),
    //         // className: buildModalClassName(),
    //         title: title,
    //         content: content,
    //         confirmText: getLanguageTextData(readState(), languageKey.KnowInfo),
    //         onConfirm: handleEventHandler(async () => {
    //             let state = readState()

    //             await getFunc(state).then(state => {
    //                 state = finishUse(state)


    //                 state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
    //                     SoundManager.buildNeedToPlaySoundData(getAddBuffResourceId(), getIsDebug(state), getOriginSystemVolume(state))
    //                 ))



    //                 writeState(state)

    //                 handleCloseModal()
    //             })
    //         }),
    //     })
    // }

    let _openTrade = (state, tradeData) => {
        if (Camera.isCanLock(getAbstractState(state))) {
            state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
        }

        state = handleOpenModal(state)

        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
            SoundManager.buildNeedToPlaySoundData(getOpenTradeResourceId(), getIsDebug(state), getOriginSystemVolume(state))
        ))

        deferSwitchPageForGetNewestState(dispatch, setTradeData(tradeData))

        return state
    }

    let _openTradeHandler = (state: state, { userData }): Promise<state> => {
        let { tradeData } = NullableUtils.getExn(userData)

        state = _openTrade(state, tradeData)

        return Promise.resolve(state)
    }

    let _handleInteraction = (state: state): Promise<state> => {
        if (_isCloseToast(interactionHandler)) {
            return Promise.resolve(state)
        }

        if (hasOpenedModal(state)) {
            // throw new Error("shouldn't has opened modal")
            return Promise.resolve(state)
        }

        if (!hasCurrentInteractioData(state)) {
            return Promise.resolve(state)
        }


        _closeToast(interactionHandler)


        let [queue, index] = getCurrentInteractioDataExn(state)

        let title, content, getFunc,
            promise
        switch (getInteractionName(queue)) {
            case interactionName.ChestBox:
                let randomChestBoxReward = getRandomChestBoxReward(state).map(data => {
                    return updateChestBoxReward(state, data)
                }).filter(data => data[2] > 0)


                title = getLanguageTextData(readState(), languageKey.GetReward)
                content = <List header='' className="interaction">
                    {
                        randomChestBoxReward.map(d => {
                            return <List.Item>
                                {
                                    <Text className="interaction_chestbox_text" >{d[1]}</Text>
                                }
                                {
                                    renderImage(d[3], "interaction_chestbox_image", false)
                                }
                                <Text className="interaction_chestbox_text" >X{d[2]}</Text>
                            </List.Item>
                        })
                    }
                </List>

                getFunc = (state) => {
                    return getChestBoxReward(state, randomChestBoxReward)
                }

                state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                    SoundManager.buildNeedToPlaySoundData(getOpenChestBoxResourceId(), getIsDebug(state), getOriginSystemVolume(state))
                ))

                state = handleOpenModal(state)


                Modal.alert({
                    getContainer: LandscapeUtils.getRootDom(),
                    // className: buildModalClassName(),
                    title: title,
                    content: content,
                    confirmText: getLanguageTextData(readState(), languageKey.GetConfirm),
                    onConfirm: handleEventHandler(() => {
                        let state = readState()

                        state = getFunc(state)

                        state = finishUse(state)


                        state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                            SoundManager.buildNeedToPlaySoundData(getGetRewardResourceId(), getIsDebug(state), getOriginSystemVolume(state))
                        ))



                        // writeState(setAbstractState(state, CameraControls.lock(getAbstractState(state))))
                        writeState(state)

                        handleCloseModal()
                    }),
                })

                promise = Promise.resolve(state)
                break
            // case interactionName.WarGirl:
            //     _handleBuffGirl(state, [getRandomWarBuff, addWarBuff], "加强当前所有敌人", ["interaction_wargirl", "interaction_wargirl_image", "interaction_wargirl_text"])
            //     break
            // case interactionName.BlessGirl:
            //     _handleBuffGirl(state, [getRandomBlessBuff, addBlessBuff], getLanguageTextData(readState(), languageKey.GivePlayerRandomBuff), ["interaction", "interaction_blessgirl_image", "interaction_blessgirl_text"])
            //     break
            case interactionName.FateGirl:
                let randomFate = getRandomFate(state)

                content = randomFate.length > 0 ? <List header='' className={"interaction"}>
                    {
                        randomFate.map(d => {
                            return <List.Item>
                                {
                                    <Text className={"interaction_fategirl_text"}>{
                                        getTitle(state, d.name)
                                    }</Text>
                                }
                            </List.Item>
                        })
                    }
                </List> :
                    <Text className={"interaction_fategirl_text"}>{getLanguageTextData(readState(), languageKey.NothingHappen)}</Text>



                getFunc = (state) => {
                    return triggerEvent(state, randomFate)
                }

                state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                    SoundManager.buildNeedToPlaySoundData(getOpenFateResourceId(), getIsDebug(state), getOriginSystemVolume(state))
                ))

                state = handleOpenModal(state)

                Modal.alert({
                    getContainer: LandscapeUtils.getRootDom(),
                    // className: buildModalClassName(),
                    title: title,
                    content: content,
                    confirmText: getLanguageTextData(readState(), languageKey.KnowInfo),
                    onConfirm: handleEventHandler(async () => {
                        let state = readState()

                        await getFunc(state).then(state => {
                            state = finishUse(state)


                            // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
                            //     SoundManager.buildNeedToPlaySoundData(getAddBuffResourceId(), getIsDebug(state), getOriginSystemVolume(state))
                            // ))



                            writeState(state)

                            handleCloseModal()
                        })
                    }),
                })

                promise = Promise.resolve(state)
                break
            case interactionName.TradeGirl:
                state = _openTrade(state, getRandomTrade(state))

                promise = Promise.resolve(state)
                break
            default:
                promise = triggerInteraction(state, getInteractionName(queue))
                break
        }

        return promise
    }

    let _interactionHandler = (state: state, { userData }): Promise<state> => {
        if (NullableUtils.isNullable(userData)
            ||
            !_isCloseToast(enterDoorToastHandler)
            || getIsShowingUILightTip(state)
        ) {
            _closeToast(interactionHandler)

            return Promise.resolve(state)
        }

        if (!_isCloseToast(interactionHandler)) {
            return Promise.resolve(state)
        }


        let { description, imageSrc } = NullableUtils.getExn(userData)



        interactionHandler.current = Toast.show(
            {
                content: <section
                    onPointerDown={handleEventHandler(() => {
                        _handleInteraction(readState()).then(writeState)
                    })
                    }
                >
                    {
                        renderImage(imageSrc, "interaction_image", false)
                    }
                    {
                        <Text
                            className="interaction_text"
                        >{description}</Text>
                    }
                </section>,
                duration: 0,
                // duration: 2000,
                position: 'center',
                maskClassName: (
                    Device.isMobileByState(getAbstractState(state))
                    // && !screenfull.isFullscreen
                ) ? "interaction_toast_mobile" : "interaction_toast",
            }
        )

        return Promise.resolve(state)
    }


    let _showEnterDoorToastHandler = (state: state, _): Promise<state> => {
        if (getIsShowingUILightTip(state)
            || !_isCloseToast(enterDoorToastHandler)
        ) {
            return Promise.resolve(state)
        }


        _closeAllToasts()

        //         console.log(
        // (
        //                     Device.isMobileByState(getAbstractState(state))
        //                     && !screenfull.isFullscreen
        //                 )
        //         );


        state = setIsShowEnterDoorToast(state, true)

        enterDoorToastHandler.current = Toast.show(
            {
                content: <section
                    onPointerDown={handleEventHandler(() => {
                        return handleMissionComplete(readState(), 0).then(writeState)
                    })
                    }
                >
                    {
                        <Text
                            className="interaction_text"
                        >{wrapDescription(readState(), getLanguageTextData(readState(), languageKey.EnterDoor))}</Text>
                    }
                </section>,
                duration: 0,
                position: 'center',
                maskClassName: (
                    Device.isMobileByState(getAbstractState(state))
                    // && !screenfull.isFullscreen
                ) ? "interaction_toast_mobile" : "interaction_toast",
            }
        )

        return Promise.resolve(state)
    }

    let _hideEnterDoorToastHandler = (state: state, _): Promise<state> => {
        _closeToast(enterDoorToastHandler)

        return Promise.resolve(state)
    }

    let _closeAllToasts = () => {
        _closeToast(interactionHandler)
        _closeToast(enterDoorToastHandler)
        _closeToast(uiLightTipToastHandler)

        document.querySelector(".adm-toast-main")?.remove()
    }

    let _closeAllUIHandler = (state: state, { userData }): Promise<state> => {
        _closeAllToasts()

        return Promise.resolve(state)
    }

    let _sceneUIHandler = (state: state, { userData }): Promise<state> => {
        let { data } = NullableUtils.getExn(userData)

        dispatch(setSceneUIData(data))

        return Promise.resolve(state)
    }

    let _showUITipHandler = (state: state, { userData }): Promise<state> => {
        let { text, closeHandler } = NullableUtils.getExn(userData)

        state = handleOpenModal(state)

        if (Camera.isCanLock(getAbstractState(state))) {
            state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
        }

        // state = setIsShowingUITip(state, true)

        Modal.alert({
            content: text,
            confirmText: getLanguageTextData(state, languageKey.Confirm),
            onConfirm: handleEventHandler(() => {
                // writeState(setAbstractState(state, CameraControls.lock(getAbstractState(state))))

                handleCloseModal()

                // writeState(setIsShowingUITip(readState(), false))

                return closeHandler()
            }),
        })

        return Promise.resolve(state)
    }

    let _showUILightTipHandler = (state: state, { userData }): Promise<state> => {
        let { text } = NullableUtils.getExn(userData)

        // if (Camera.isCanLock(getAbstractState(state))) {
        //     state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
        // }

        if (!_isCloseToast(uiLightTipToastHandler)) {
            return Promise.resolve(state)
        }

        state = setIsShowingUILightTip(state, true)

        _closeAllToasts()

        uiLightTipToastHandler.current = Toast.show(
            {
                content: text,
                duration: 2000,
                position: 'center',
                maskClassName: (
                    Device.isMobileByState(getAbstractState(state))
                    // && !screenfull.isFullscreen
                ) ? "interaction_toast_mobile" : "interaction_toast",
                afterClose: handleEventHandler(() => {
                    writeState(setIsShowingUILightTip(readState(), false))

                    _closeToast(uiLightTipToastHandler)

                    // handleCloseModal()
                }),
            }
        )

        return Promise.resolve(state)
    }

    let _canvasNoneHandler = (state: state, { userData }): Promise<state> => {
        Modal.alert({
            content: getLanguageTextData(state, languageKey.CanvasNone),
            confirmText: getLanguageTextData(state, languageKey.Confirm),
            onConfirm: handleEventHandler(_ => {
                return exit(dispatch)
            }),
        })

        return Promise.resolve(state)
    }


    let _requestFullScreenHandler = (state: state, { userData }): Promise<state> => {
        requestFullScreen(state)

        return Promise.resolve(state)
    }
    // let _setFastPropHandler = (state: state, { userData }): Promise<state> => {
    //     dispatch(setFastPropData(getFastPropData(state)))

    //     return Promise.resolve(state)
    // }

    // useEffect(() => {
    //     try {
    //         writeState(on(readState(), getMissionCompleteEventName(), _missionCompleteEventHandler))
    //         writeState(on(readState(), getMissionFailEventName(), _missionFailEventHandler))
    //         writeState(on(readState(), getMissionEndEventName(), _missionEndEventHandler))
    //         writeState(on(readState(), getIsEnterScenarioEventName(), _isEnterScenarioHandle))
    //         // writeState(on(readState(), getBlackScreenStartEventName(), _blackScreenStartHandle))
    //         // writeState(on(readState(), getBlackScreenStopEventName(), _blackScreenStopHandle))
    //         writeState(on(readState(), getShowDialogueEventName(), _showDialogueEventHandler))
    //         writeState(on(readState(), getBossStatusUpdateEventName(), _bossStatusUpdateEventHandler))
    //         writeState(on(readState(), getGiantessStatusUpdateEventName(), _giantessStatusUpdateEventHandler))
    //         writeState(on(readState(), getPlayerSkillStatusUpdateEventName(), _playerSkillStatusUpdateEventHandler))
    //         writeState(on(readState(), getCharacterStatusUpdateEventName(), _characterStatusUpdateEventHandler))

    //         writeState(on(readState(), getLittleManStatusUpdateEventName(), _littleManStatusUpdateEventHandler))

    //         writeState(on(readState(), getOperateUpdateEventName(), _operateUpdateEventHandler))
    //         writeState(on(readState(), getManualUIUpdateEventName(), _manualUIUpdateEventHandler))

    //         // writeState(on(readState(), getLevelBarUpdateEventName(), _levelBarUpdateEventHandler))

    //         writeState(on(readState(), getUpgradeEventName(), _upgradeEventHandler))


    //         writeState(on(readState(), getLevelStatusUpdateEventName(), _levelStatusUpdateEventHandler))
    //         writeState(on(readState(), getKeyDownEventName(), _keydownHandle))
    //         writeState(on(readState(), getKeyUpEventName(), _keyupHandle))
    //         writeState(on(readState(), getPointerDownEventName(), _pointdownHandle))
    //         writeState(on(readState(), getPointerUpEventName(), _pointupHandle))


    //         writeState(on(readState(), getQTEUpdateEventName(), _qteUpdateHandler))

    //         writeState(on(readState(), getSwitchCharacterTypeEventName(), _switchHandler))

    //         writeState(on(readState(), getGetPropEventName(), _getPropHandler))

    //         writeState(on(readState(), getGameEventTipEventName(), _gameEventTipHandler))

    //         writeState(on(readState(), getCaptureLevelGiantessEventName(), _captureLevelGiantessHandler))

    //         writeState(on(readState(), getPointerLockEventName(), _pointerLockHandler))

    //         writeState(on(readState(), getInteractionEventName(), _interactionHandler))
    //         writeState(on(readState(), getShowEnterDoorToastEventName(), _showEnterDoorToastHandler))
    //         writeState(on(readState(), getHideEnterDoorToastEventName(), _hideEnterDoorToastHandler))

    //         writeState(on(readState(), getCloseAllUIEventName(), _closeAllUIHandler))


    //         writeState(on(readState(), getSceneUIEventName(), _sceneUIHandler))


    //         writeState(on(readState(), getShowUITipEventName(), _showUITipHandler))

    //         writeState(on(readState(), getShowUILightTipEventName(), _showUILightTipHandler))

    //         writeState(on(readState(), getCanvasNoneEventName(), _canvasNoneHandler))

    //         writeState(on(readState(), getOpenTradeEventName(), _openTradeHandler))

    //         writeState(on(readState(), getRequestFullScreenEventName(), _requestFullScreenHandler))

    //         // writeState(on(readState(), getSetFastPropEventName(), _setFastPropHandler))

    //         return () => {
    //             writeState(off(readState(), getMissionCompleteEventName(), _missionCompleteEventHandler))
    //             writeState(off(readState(), getMissionFailEventName(), _missionFailEventHandler))
    //             writeState(off(readState(), getMissionEndEventName(), _missionEndEventHandler))
    //             writeState(off(readState(), getIsEnterScenarioEventName(), _isEnterScenarioHandle))
    //             // writeState(off(readState(), getBlackScreenStartEventName(), _blackScreenStartHandle))
    //             // writeState(off(readState(), getBlackScreenStopEventName(), _blackScreenStopHandle))
    //             writeState(off(readState(), getShowDialogueEventName(), _showDialogueEventHandler))
    //             writeState(off(readState(), getBossStatusUpdateEventName(), _bossStatusUpdateEventHandler))
    //             writeState(off(readState(), getGiantessStatusUpdateEventName(), _giantessStatusUpdateEventHandler))
    //             writeState(off(readState(), getPlayerSkillStatusUpdateEventName(), _playerSkillStatusUpdateEventHandler))
    //             writeState(off(readState(), getCharacterStatusUpdateEventName(), _characterStatusUpdateEventHandler))

    //             writeState(off(readState(), getLittleManStatusUpdateEventName(), _littleManStatusUpdateEventHandler))


    //             writeState(off(readState(), getOperateUpdateEventName(), _operateUpdateEventHandler))
    //             writeState(off(readState(), getManualUIUpdateEventName(), _manualUIUpdateEventHandler))

    //             // writeState(off(readState(), getLevelBarUpdateEventName(), _levelBarUpdateEventHandler))


    //             writeState(off(readState(), getUpgradeEventName(), _upgradeEventHandler))

    //             writeState(off(readState(), getKeyDownEventName(), _keydownHandle))
    //             writeState(off(readState(), getKeyUpEventName(), _keyupHandle))
    //             writeState(off(readState(), getLevelStatusUpdateEventName(), _levelStatusUpdateEventHandler))

    //             writeState(off(readState(), getPointerDownEventName(), _pointdownHandle))
    //             writeState(off(readState(), getPointerUpEventName(), _pointupHandle))

    //             writeState(off(readState(), getQTEUpdateEventName(), _qteUpdateHandler))

    //             writeState(off(readState(), getSwitchCharacterTypeEventName(), _switchHandler))

    //             writeState(off(readState(), getGetPropEventName(), _getPropHandler))

    //             writeState(off(readState(), getGameEventTipEventName(), _gameEventTipHandler))

    //             writeState(off(readState(), getCaptureLevelGiantessEventName(), _captureLevelGiantessHandler))

    //             writeState(off(readState(), getPointerLockEventName(), _pointerLockHandler))


    //             writeState(off(readState(), getInteractionEventName(), _interactionHandler))
    //             writeState(off(readState(), getShowEnterDoorToastEventName(), _showEnterDoorToastHandler))
    //             writeState(off(readState(), getHideEnterDoorToastEventName(), _hideEnterDoorToastHandler))

    //             writeState(off(readState(), getCloseAllUIEventName(), _closeAllUIHandler))


    //             writeState(off(readState(), getSceneUIEventName(), _sceneUIHandler))


    //             writeState(off(readState(), getShowUITipEventName(), _showUITipHandler))

    //             writeState(off(readState(), getShowUILightTipEventName(), _showUILightTipHandler))

    //             writeState(off(readState(), getCanvasNoneEventName(), _canvasNoneHandler))

    //             writeState(off(readState(), getOpenTradeEventName(), _openTradeHandler))

    //             writeState(off(readState(), getRequestFullScreenEventName(), _requestFullScreenHandler))

    //             // writeState(off(readState(), getSetFastPropEventName(), _setFastPropHandler))
    //         };
    //     }
    //     catch (e) {
    //         Event.trigger(readState(), getAbstractState, getErrorEventName(), buildErrorEventData(e))
    //     }
    // }, []);

    useEffect(() => {
        try {
            return () => {
                writeState(off(readState(), getMissionCompleteEventName(), _missionCompleteEventHandler))
                writeState(off(readState(), getMissionFailEventName(), _missionFailEventHandler))
                writeState(off(readState(), getMissionEndEventName(), _missionEndEventHandler))
                writeState(off(readState(), getIsEnterScenarioEventName(), _isEnterScenarioHandle))
                // writeState(off(readState(), getBlackScreenStartEventName(), _blackScreenStartHandle))
                // writeState(off(readState(), getBlackScreenStopEventName(), _blackScreenStopHandle))
                writeState(off(readState(), getShowDialogueEventName(), _showDialogueEventHandler))
                writeState(off(readState(), getBossStatusUpdateEventName(), _bossStatusUpdateEventHandler))
                writeState(off(readState(), getGiantessStatusUpdateEventName(), _giantessStatusUpdateEventHandler))
                writeState(off(readState(), getPlayerSkillStatusUpdateEventName(), _playerSkillStatusUpdateEventHandler))
                // writeState(off(readState(), getBossSkillStatusUpdateEventName(), _bossSkillStatusUpdateEventHandler))
                writeState(off(readState(), getCharacterStatusUpdateEventName(), _characterStatusUpdateEventHandler))

                writeState(off(readState(), getLittleManStatusUpdateEventName(), _littleManStatusUpdateEventHandler))


                writeState(off(readState(), getOperateUpdateEventName(), _operateUpdateEventHandler))
                writeState(off(readState(), getManualUIUpdateEventName(), _manualUIUpdateEventHandler))

                // writeState(off(readState(), getLevelBarUpdateEventName(), _levelBarUpdateEventHandler))


                writeState(off(readState(), getUpgradeEventName(), _upgradeEventHandler))

                writeState(off(readState(), getKeyDownEventName(), _keydownHandle))
                writeState(off(readState(), getKeyUpEventName(), _keyupHandle))
                writeState(off(readState(), getLevelStatusUpdateEventName(), _levelStatusUpdateEventHandler))

                writeState(off(readState(), getPointerDownEventName(), _pointdownHandle))
                writeState(off(readState(), getPointerUpEventName(), _pointupHandle))

                writeState(off(readState(), getQTEUpdateEventName(), _qteUpdateHandler))

                writeState(off(readState(), getSwitchCharacterTypeEventName(), _switchHandler))

                writeState(off(readState(), getGetPropEventName(), _getPropHandler))

                writeState(off(readState(), getGameEventTipEventName(), _gameEventTipHandler))

                writeState(off(readState(), getCaptureLevelGiantessEventName(), _captureLevelGiantessHandler))

                writeState(off(readState(), getPointerLockEventName(), _pointerLockHandler))


                writeState(off(readState(), getInteractionEventName(), _interactionHandler))
                writeState(off(readState(), getShowEnterDoorToastEventName(), _showEnterDoorToastHandler))
                writeState(off(readState(), getHideEnterDoorToastEventName(), _hideEnterDoorToastHandler))

                writeState(off(readState(), getCloseAllUIEventName(), _closeAllUIHandler))


                writeState(off(readState(), getSceneUIEventName(), _sceneUIHandler))


                writeState(off(readState(), getShowUITipEventName(), _showUITipHandler))

                writeState(off(readState(), getShowUILightTipEventName(), _showUILightTipHandler))

                writeState(off(readState(), getCanvasNoneEventName(), _canvasNoneHandler))

                writeState(off(readState(), getOpenTradeEventName(), _openTradeHandler))

                writeState(off(readState(), getRequestFullScreenEventName(), _requestFullScreenHandler))

                // writeState(off(readState(), getSetFastPropEventName(), _setFastPropHandler))
            };
        }
        catch (e) {
            Event.trigger(readState(), getAbstractState, getErrorEventName(), buildErrorEventData(e))
        }
    }, []);

    useEffect(() => {
        try {
            _switchScene(currentSceneData, targetSceneData)
            // .then(_ => {

            // })
        } catch (e) {
            Event.trigger(readState(), getAbstractState, getErrorEventName(), buildErrorEventData(e))
        }
    }, [])

    return <Layout className="scene-main"  >
        <Loading />
        <Info />
        {_renderMain(currentSceneData, isSwitchScene)}
        {_renderPage()}
    </Layout >
};

export default Scene;
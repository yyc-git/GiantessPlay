import "./City.scss"

import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Flex, Card } from 'antd';
import { SideBar, Slider, Selector, Modal, Mask, Toast } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from '../../../../store/AppStore';
// import Operate from '../operate/components/Operate';
import { NullableUtils } from 'meta3d-jiehuo-abstract';
import { page, scene } from '../../../../global/store/GlobalStoreType';
import { LandscapeUtils } from 'meta3d-jiehuo-abstract';
import Text from 'antd/es/typography/Text';
import { getAbstractState, readState, setAbstractState, writeState } from '../../../../../business_layer/State';
import * as  CityScene3D from '../../../../../business_layer/CityScene3D';
import { bulletPropName, thirdPersonCameraTarget, propName, propType, firstPersonCameraTarget, cameraRotateSpeed, fireWay } from '../../../../../scene3d_layer/script/scene/scene_city/type/StateType';
import { getIsProduction } from "../../../../../business_layer/Scene3D";
import { setPage } from "../../../../global/store/GlobalStore";
import { getIsDebug } from "../../../../../scene3d_layer/script/scene/Scene";
import { renderButton, renderImage } from "../../../../utils/ButtonUtils";
import * as ImageUtils from "../../../../utils/ImageUtils";
import Title from "antd/es/typography/Title";
import { off, on, trigger } from "../../../../../business_layer/Event";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getClickLargeSoundResourceId, getClickSmallSoundResourceId } from "../../../../../business_layer/Loader";
import Debug from "../../debug/components/Debug";
import Dialogue from "../dialogue/components/Dialogue";
import { computeCameraToTargetDistance, getAllValidPropTypeData, getCameraType, getSceneChapter, isBossLevel, isCharacterTypeEqual, isEnterScene, isGiantessCharacterType, isLittleCharacterType, isNoneCharacterType, setCameraType, updateCameraDistance, useArtifact, useAssistant, useBullet, useCamera, useOther, useWater } from "../../../../../scene3d_layer/script/scene/scene_city/CityScene";
// import LevelStatus from "../giantess/level_status/component/LevelStatus";
// import Pose from "../giantess/pose/components/Pose";
import * as GiantessOperate from "../giantess/operate/components/Operate";
import Bar from "../giantess/bar/components/Bar";
// import SkillBar from "../giantess/skill_bar/components/SkillBar";
import * as LittleManOperate from "../little_man/operate/components/Operate";
// import * as BossBar from "../bo/bar/components/BossBar";
import * as LittleManBar from "../little_man/bar/components/LittleManBar";
// import * as LittleManLevelStatus from "../little_man/level_status/component/LevelStatus";
import LevelStatus from "../level_status/component/LevelStatus";
import { set } from "../../../../utils/SettingUtils";
import { renderSwitch, renderSwitchPromise } from "../../../../utils/SwitchUtils";
import { getFireWay, getUsedBulletPropName, hasUsedBulletPropName, isBurstFire, setFireWay, switchBulletProp } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/LittleMan";
import { play } from "../../../../../business_layer/Sound";
import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { cameraType } from "../../../../../scene3d_layer/type/StateType";
import * as QTE from "../qte/components/QTE";
import * as BiwuLevelStatus from "../biwu/level_status/component/LevelStatus";
import { exit } from "../../../../utils/MissionUtils";
import { isLockToThirdPersonControls } from "../../../../../scene3d_layer/script/scene/scene_city/LittleManCamera";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getCharacterType, isPlayerCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import Upgrade from "../upgrade/components/Upgrade";
import LevelBar from "../level_bar/components/LevelBar";
import { handleMissionEnd, handleMissionFail } from "../../../../../scene3d_layer/script/scene/scene_city/manage/mission/Mission";
import { getAllProps, getAllPropsByType, getPropCount, hasPropsByType, isDisable } from "../../../../../scene3d_layer/script/scene/scene_city/reward/Prop";
import { Device } from "meta3d-jiehuo-abstract";
// import * as  BossBar from "../boss_bar/components/BossBar";
import * as BossSkillBar from "../boss_skill_bar/components/BossSkillBar";
import { Flow } from "meta3d-jiehuo-abstract";
import { closeModal, handleCloseModal, handleOpenModal } from "../../../../utils/ModalUtils";
import Character from "../character/components/Character";
import GetProp from "../get_prop/components/GetProp";
import GameEventTip from "../gameevent_tip/components/GameEventTip";
import Weapon from "../little_man/weapon/components/Weapon";
import PlayerStatus from "../player_status/components/PlayerStatus";
import BossStatus from "../boss_status/components/BossStatus";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { menuItem } from "../../component/Scene";
import Trade from "../trade/components/Trade";
import PageForSceneUIAPI from "../page_for_uiapi/components/PageForUIAPI"
import { getSoundSetting } from "../../../../../scene3d_layer/mod/SettingMod";
import { getLanguageTextData, languageKey } from "../../../../../scene3d_layer/internation/Data";
import { execLoop, update, updateUIAndSound } from "../../../../../business_layer/Loop";
import { Event } from "meta3d-jiehuo-abstract";
// import { buildErrorEventData, getErrorEventName, getSetFastPropEventName } from "../../../../../scene3d_layer/utils/EventUtils";
import { handleEventHandler } from "../../../../utils/ErrorUtils";
import { buildAPI } from "../../../../../scene3d_layer/mod/Mod";
import PageForUIAPI from "../../../page_for_uiapi/components/PageForUIAPI";
import { buildDispatchFunc } from "../../../../utils/PageForUIAPIUtils";
// import { setFastPropData as setFastPropDataStore } from "../../store/SceneStore";
import { useProp } from "../../../../utils/PropUtils";
import FastProp from "../fast_prop/components/FastProp";
import { getCameraRotateSpeed, getFreeThirdPersonCameraTargetYOffset, getSavedThirdPersonCameraToTargetDistance, getThirdPersonCameraTarget, saveCameraRotateSpeed, saveCameraTarget, saveCameraType, saveFreeThirdPersonCameraTargetYOffset, saveThirdPersonCameraZoom, setCameraRotateSpeed, setFreeThirdPersonCameraTargetYOffset, setSavedCameraTarget, setSavedCameraType, setSavedFreeThirdPersonCameraTargetYOffset, setSavedThirdPersonCameraToTargetDistance, updateCameraTargetFromSavedData } from "../../../../../scene3d_layer/script/scene/scene_city/Camera";
import { deferRefreshPageForGetNewestState, deferSwitchPageForGetNewestState } from "../../../../utils/SwitchPageUtils";
import { getFastPropData, setFastPropData } from "../../../../../scene3d_layer/script/scene/scene_city/FastProp";
import { Render } from "meta3d-jiehuo-abstract";
import { getIsStartDrag, resetOperatePosition, setIsStartDrag } from "../../../../../scene3d_layer/script/scene/scene_city/Operate";
import { Scene } from "meta3d-jiehuo-abstract";
import { exitFullScreen, isCanFullScreenForMobile, isEnabledFullScreen, isFullScreen, requestFullScreen } from "../../../../utils/ScreenUtils";
import { getIsEliteGiantePlayDeathAnimation, getIsShowCoinAnimation, getIsShowGemAnimation, getIsGenerateProp, getIsShowExplosionSmoke, getIsShowUpgradeParticle, isHideUI, saveIsEliteGiantePlayDeathAnimation, saveIsShowCoinAnimation, saveIsShowGemAnimation, saveIsGenerateProp, saveIsHideUI, saveIsShowExplosionSmoke, saveIsShowUpgradeParticle, setIsEliteGiantePlayDeathAnimation, setIsFullScreenFlag, setIsShowCoinAnimation, setIsShowGemAnimation, setIsGenerateProp, setIsHideUI, setIsShowExplosionSmoke, setIsShowUpgradeParticle, setIsShowBuildingSmoke, getIsShowBuildingSmoke, saveIsShowBuildingSmoke } from "../../../../../scene3d_layer/script/scene/scene_city/UI";
// import Bar from "../bar/components/Bar";
// import Pose from "../pose/components/Pose";
// import LevelStatus from "../level_status/component/LevelStatus";
// import SkillBar from "../skill_bar/components/SkillBar";

// enum cameraType {
//     FirstPerson,
//     ThirdPerson
// }

// enum propItem {
//     // None,
//     Bullet = "Bullet",
// }

enum city1ControlItem {
    SelectTarget = "SelectTarget",
    // ChangePose,
    // Rest,
    // Execute
    // Debug
}

enum biwuControlItem {
    None
}



let City: React.FC = (
    {
        isShowDebug, setIsShowDebug,
        isShowMainMenu, setIsShowMainMenu,
        isShowProp, setIsShowProp,
        currentMenuItem, setCurrentMenuItem,
        currentPropItem, setCurrentPropItem,
        openSetting, openProp,
    }
) => {
    // let currentSceneData = useSelector<AppState>((state) => state.scene) as scene

    // let _renderBigScreenUI = () => {
    //     return null
    // }

    // let _getSceneNumber = () => {
    //     return NullableUtils.getExn(currentSceneData).levelNumber
    // }
    // let currentSceneData = useSelector<AppState>((state) => state.global.currentSceneData)
    let isEnterScenario = useSelector<AppState>((state) => state.scene.isEnterScenario)
    let characterType_ = useSelector<AppState>((state) => state.global.characterType)
    // let isBlackScreenStart = useSelector<AppState>((state) => state.scene.isBlackScreenStart)

    // Console.log(isBlackScreenStart, isEnterScenario);



    // let [isShowControl, setIsShowControl] = useState(false)
    // let [currentControlItem, setCurrentControlItem] = useState(city1ControlItem.SelectTarget)
    let [_, setRefresh] = useState(Math.random());
    // let [currentCameraType, setCurrentCameraType] = useState(cameraType.ThirdPerson)

    let dispatch: AppDispatch = useDispatch()

    // let _renderLittleManSettingButton = () => {
    //     let state = readState()

    //     if (!isLittleCharacterType(state)) {
    //         return null
    //     }

    //     return renderButton(state => {
    //         setCurrentMenuItem(_ => menuItem.ControlGiantess)

    //         return Promise.resolve(state)
    //     }, "little_man_setting_button", "控制巨大娘",)
    // }

    // let _renderLittleManPropButton = () => {
    //     let state = readState()

    //     if (!isLittleCharacterType(state)) {
    //         return null
    //     }

    //     return renderButton(state => {
    //         // setCurrentMenuItem(_ => menuItem.ControlGiantess)

    //         return Promise.resolve(state)
    //     }, "little_man_prop_button", "背包",)
    // }

    // let characterType_ = getCharacterType(getAbstractState(readState()))


    let _renderMenuButton = () => {
        return <Col className="menu_button" span={8}>
            <Row justify="start" className="">
                <SideBar
                    activeKey={currentMenuItem}
                    onChange={key => {
                        switch (key) {
                            case menuItem.Camera:
                                _makeMainSettingModalSemiTransparent()

                                setCurrentMenuItem(_ => menuItem.Camera)
                                break
                            case menuItem.UI:
                                _makeMainSettingModalOpacity()

                                setCurrentMenuItem(_ => menuItem.UI)
                                break
                            case menuItem.Operate:
                                _makeMainSettingModalOpacity()

                                setCurrentMenuItem(_ => menuItem.Operate)
                                break
                            case menuItem.EndLevel:
                                _makeMainSettingModalOpacity()

                                setCurrentMenuItem(_ => menuItem.EndLevel)
                                Modal.confirm({
                                    getContainer: LandscapeUtils.getRootDom(),
                                    confirmText: getLanguageTextData(readState(), languageKey.Confirm),
                                    cancelText: getLanguageTextData(readState(), languageKey.Cancel),

                                    // className: buildModalClassName(),
                                    content: getLanguageTextData(readState(), languageKey.EndLevelConfirm),
                                    onConfirm: handleEventHandler(async () => {
                                        setIsShowMainMenu(_ => false)
                                        // handleCloseModal()

                                        // return exit(dispatch)
                                        await handleMissionEnd(readState()).then(writeState)
                                    }),
                                })
                                break
                        }
                    }}
                >
                    <SideBar.Item key={menuItem.Camera} title={getLanguageTextData(readState(), languageKey.Camera)} />
                    {
                        <SideBar.Item key={menuItem.UI} title={getLanguageTextData(readState(), languageKey.UI)} />
                    }
                    {
                        // Device.isMobile() ?
                        <SideBar.Item key={menuItem.Operate} title={getLanguageTextData(readState(), languageKey.Operate)} />
                        // : null
                    }
                    <SideBar.Item key={menuItem.EndLevel} title={getLanguageTextData(readState(), languageKey.EndLevel)} />
                </SideBar>
            </Row>

            {/* <Row justify="start" className="">
                {
                    _renderLittleManPropButton()
                }
            </Row> */}

            {/* <Row justify="start" className="">
                {
                    _renderLittleManSettingButton()
                }
            </Row> */}


        </Col>

    }

    let _renderCameraUI = () => {
        if (getCameraType(readState()) == cameraType.ThirdPerson) {
            return <>
                {
                    renderButton((state) => {
                        state = CityScene3D.zoomIn(state)

                        if (Device.isMobile()) {
                            state = setSavedThirdPersonCameraToTargetDistance(state,
                                getCharacterType(getAbstractState(state)),
                                // getOrbitControlsZoom(state)
                                // getSavedThirdPersonCameraToTargetDistance(state, getCharacterType(getAbstractState(state))) * 0.96
                                computeCameraToTargetDistance(state)
                            )

                            saveThirdPersonCameraZoom(state)
                        }

                        return execLoop(state)
                    }, "zoomIn", getLanguageTextData(readState(), languageKey.ZoomIn))
                }
                {
                    renderButton((state) => {
                        state = CityScene3D.zoomOut(state)

                        if (Device.isMobile()) {
                            state = setSavedThirdPersonCameraToTargetDistance(state,
                                getCharacterType(getAbstractState(state)),
                                // getOrbitControlsZoom(state)
                                // getSavedThirdPersonCameraToTargetDistance(state, getCharacterType(getAbstractState(state))) / 0.96
                                computeCameraToTargetDistance(state)
                            )

                            saveThirdPersonCameraZoom(state)
                        }

                        return execLoop(state)
                    }, "zoomOut", getLanguageTextData(readState(), languageKey.ZoomOut))
                }
                {
                    characterType_ == characterType.Giantess ?
                        <Row justify="start">
                            <Text>{getLanguageTextData(readState(), languageKey.SetTarget)}：</Text>
                            <Selector
                                defaultValue={CityScene3D.getThirdPersonCameraTarget(readState())}
                                onChange={arr => {
                                    let state = readState()

                                    let value = arr.length > 0 ? arr[0] : "chest"

                                    let target
                                    switch (value) {
                                        case "foot":
                                            target = thirdPersonCameraTarget.Foot
                                            break
                                        case "chest":
                                            target = thirdPersonCameraTarget.Chest
                                            break
                                        case "free":
                                            target = thirdPersonCameraTarget.Free
                                            break
                                    }
                                    state = CityScene3D.setThirdPersonCameraTarget(state, target)

                                    state = setSavedCameraTarget(state,
                                        getCharacterType(getAbstractState(readState())),
                                        cameraType.ThirdPerson, target)

                                    saveCameraTarget(state)

                                    state = updateCameraDistance(state)

                                    deferRefreshPageForGetNewestState(setRefresh)

                                    return execLoop(state).then(execLoop)
                                        .then(writeState)
                                }}
                                options={[
                                    { value: "chest", label: getLanguageTextData(readState(), languageKey.Chest) },
                                    { value: "foot", label: getLanguageTextData(readState(), languageKey.Foot) },
                                    { value: "free", label: getLanguageTextData(readState(), languageKey.Free) },
                                ]}
                            />
                            {
                                getThirdPersonCameraTarget(readState()) == thirdPersonCameraTarget.Free ?
                                    // <Slider
                                    //     className="free_slider"
                                    //     step={1}
                                    //     min={0}
                                    //     max={100}
                                    //     defaultValue={getFreeThirdPersonCameraTargetYOffset(readState())}
                                    //     ticks={false}
                                    //     onAfterChange={handleEventHandler(value => {
                                    //         let state = setFreeThirdPersonCameraTargetYOffset(readState(), value)

                                    //         return execLoop(state).then(writeState)
                                    //     })} />
                                    <>
                                        {
                                            renderButton((state) => {
                                                state = setFreeThirdPersonCameraTargetYOffset(state, getFreeThirdPersonCameraTargetYOffset(state) + 1)
                                                state = setSavedFreeThirdPersonCameraTargetYOffset(state, getFreeThirdPersonCameraTargetYOffset(state))
                                                saveFreeThirdPersonCameraTargetYOffset(state)

                                                return execLoop(state)
                                            }, "up", getLanguageTextData(readState(), languageKey.Up))
                                        }
                                        {
                                            renderButton((state) => {
                                                state = setFreeThirdPersonCameraTargetYOffset(state, getFreeThirdPersonCameraTargetYOffset(state) - 1)
                                                state = setSavedFreeThirdPersonCameraTargetYOffset(state, getFreeThirdPersonCameraTargetYOffset(state))
                                                saveFreeThirdPersonCameraTargetYOffset(state)

                                                return execLoop(state)
                                            }, "down", getLanguageTextData(readState(), languageKey.Down))
                                        }
                                    </>
                                    : null
                            }
                        </Row>
                        : null
                }
            </>
        }


        return characterType_ == characterType.Giantess ?
            <Row justify="start">
                <Text>{getLanguageTextData(readState(), languageKey.SetTarget)}：</Text>
                <Selector
                    defaultValue={CityScene3D.getFirstPersonCameraTarget(readState())}
                    onChange={arr => {
                        let state = readState()

                        let value = arr.length > 0 ? arr[0] : "eye"

                        let target
                        switch (value) {
                            case "eye":
                                target = firstPersonCameraTarget.Eye
                                break
                            case "leg":
                                target = firstPersonCameraTarget.Leg
                                break

                        }
                        state = CityScene3D.setFirstPersonCameraTarget(state, target)

                        // writeState(state)
                        // saveCameraTarget(state, cameraType.FirstPerson, target).then(writeState)
                        state = setSavedCameraTarget(state,
                            getCharacterType(getAbstractState(readState())),
                            cameraType.FirstPerson, target)

                        saveCameraTarget(state)

                        // deferRefreshPageForGetNewestState(setRefresh)

                        return execLoop(state).then(writeState)
                    }}
                    options={[
                        { value: "eye", label: getLanguageTextData(readState(), languageKey.Eye) },
                        { value: "leg", label: getLanguageTextData(readState(), languageKey.Leg) },
                    ]}
                />
            </Row>
            : null
    }

    let _renderCurrentMenuItem = () => {
        switch (currentMenuItem) {
            case menuItem.EndLevel:
                return null
            case menuItem.Camera:
                return <>
                    <Row justify="start">
                        {/* <Text>镜头默认距离：</Text> */}
                        {/* <Slider
                            // className="zoom_slider"
                            // step={0.05}
                            step={0.5}
                            defaultValue={CityScene3D.getZoom(readState()) * 10}
                            min={CityScene3D.getMinZoom(readState()) * 10}
                            max={CityScene3D.getMaxZoom(readState()) * 10}
                            ticks={true}
                            onChange={value => {
                                let state = readState()

                                state = CityScene3D.setZoom(state, value / 10)

                                writeState(state)
                            }} /> */}

                        <Row justify="start">
                            <Text>{getLanguageTextData(readState(), languageKey.CameraRotateSpeed)}:</Text>
                            <Selector
                                className="camera_rotate_speed"
                                defaultValue={String(getCameraRotateSpeed(readState(), getCharacterType(getAbstractState(readState()))))}
                                key={Math.random()}
                                onChange={handleEventHandler(arr => {
                                    let state = readState()

                                    let value = arr.length > 0 ? arr[0] : String(getCameraRotateSpeed(state, getCharacterType(getAbstractState(state))))

                                    value = Number(value)

                                    state = setCameraRotateSpeed(state, getCharacterType(getAbstractState(state)), value)

                                    state = useCamera(state, getCameraType(state))

                                    saveCameraRotateSpeed(state)

                                    writeState(state)
                                })}
                                options={[
                                    { value: String(cameraRotateSpeed.VeryLow), label: getLanguageTextData(readState(), languageKey.VeryLow) },
                                    { value: String(cameraRotateSpeed.Low), label: getLanguageTextData(readState(), languageKey.Low) },
                                    { value: String(cameraRotateSpeed.Middle), label: getLanguageTextData(readState(), languageKey.Middle) },
                                    { value: String(cameraRotateSpeed.High), label: getLanguageTextData(readState(), languageKey.High) },
                                    { value: String(cameraRotateSpeed.VeryHigh), label: getLanguageTextData(readState(), languageKey.VeryHigh) },
                                ]}
                            />
                        </Row>
                        <Row justify="start">

                            {
                                // isGiantessCharacterType(readState()) ?
                                characterType_ == characterType.LittleMan && isLockToThirdPersonControls(readState()) ? null :
                                    renderSwitchPromise((state, isUseFirstPerson) => {
                                        let cameraType_
                                        if (isUseFirstPerson) {
                                            cameraType_ = cameraType.FirstPerson
                                        }
                                        else {
                                            cameraType_ = cameraType.ThirdPerson
                                        }

                                        state = updateCameraTargetFromSavedData(state)

                                        state = useCamera(state, cameraType_)
                                        state = setSavedCameraType(state,
                                            getCharacterType(getAbstractState(state)),
                                            cameraType_)


                                        saveCameraType(state)

                                        deferRefreshPageForGetNewestState(setRefresh)

                                        return execLoop(state)
                                    }, getCameraType(readState()) == cameraType.FirstPerson, getLanguageTextData(readState(), languageKey.UseThirdPersonCamera), getLanguageTextData(readState(), languageKey.UseFirstPersonCamera), "use_first_person")
                                // : null
                            }
                            {
                                _renderCameraUI()
                            }
                        </Row>
                    </Row>
                </>
            case menuItem.UI:
                return <>
                    <Row justify="start">
                        <Row justify="start">
                            {
                                isEnabledFullScreen() && !Device.isMobile() ?
                                    renderSwitch((state, value) => {
                                        if (value) {
                                            state = setIsFullScreenFlag(state, true)

                                            requestFullScreen()
                                        }
                                        else {
                                            state = setIsFullScreenFlag(state, false)

                                            exitFullScreen()
                                        }

                                        // saveIsFullScreenFlag(state)

                                        return state
                                    }, isFullScreen(), getLanguageTextData(readState(), languageKey.DisableFullScreen), getLanguageTextData(readState(), languageKey.EnableFullScreen), "enable_fullscreen")
                                    : null
                            }
                            {
                                renderSwitch((state, value) => {
                                    state = setIsHideUI(state, !value)

                                    saveIsHideUI(state)

                                    // return updateUIAndSound(state)
                                    deferRefreshPageForGetNewestState(setRefresh)

                                    return state
                                }, !isHideUI(readState()), getLanguageTextData(readState(), languageKey.HideUI), getLanguageTextData(readState(), languageKey.ShowUI), "is_show")
                            }

                            {
                                renderSwitch((state, value) => {
                                    state = setIsShowGemAnimation(state, value)

                                    saveIsShowGemAnimation(state)

                                    return state
                                }, getIsShowGemAnimation(readState()), getLanguageTextData(readState(), languageKey.NotShowGemAnimation), getLanguageTextData(readState(), languageKey.ShowGemAnimation), "is_generate_gem")
                            }
                            {
                                renderSwitch((state, value) => {
                                    state = setIsShowCoinAnimation(state, value)

                                    saveIsShowCoinAnimation(state)

                                    return state
                                }, getIsShowCoinAnimation(readState()), getLanguageTextData(readState(), languageKey.NotShowCoinAnimation), getLanguageTextData(readState(), languageKey.ShowCoinAnimation), "is_generate_coin")
                            }
                            {/* {
                                renderSwitch((state, value) => {
                                    state = setIsGenerateProp(state, value)

                                    saveIsGenerateProp(state)

                                    return state
                                }, getIsGenerateProp(readState()), getLanguageTextData(readState(), languageKey.NotGenerateProp), getLanguageTextData(readState(), languageKey.GenerateProp), "is_generate_prop")
                            } */}


                            {
                                renderSwitch((state, value) => {
                                    state = setIsShowUpgradeParticle(state, value)

                                    saveIsShowUpgradeParticle(state)

                                    return state
                                }, getIsShowUpgradeParticle(readState()), getLanguageTextData(readState(), languageKey.HideUpgradeParticle), getLanguageTextData(readState(), languageKey.ShowUpgradeParticle), "is_show_upgrade_particle")
                            }
                            {
                                renderSwitch((state, value) => {
                                    state = setIsShowBuildingSmoke(state, value)

                                    saveIsShowBuildingSmoke(state)

                                    return state
                                }, getIsShowBuildingSmoke(readState()), getLanguageTextData(readState(), languageKey.HideBuildingSmoke), getLanguageTextData(readState(), languageKey.ShowBuildingSmoke), "is_show_explosion_smoke")
                            }
                            {
                                renderSwitch((state, value) => {
                                    state = setIsShowExplosionSmoke(state, value)

                                    saveIsShowExplosionSmoke(state)

                                    return state
                                }, getIsShowExplosionSmoke(readState()), getLanguageTextData(readState(), languageKey.HideExplosionSmoke), getLanguageTextData(readState(), languageKey.ShowExplosionSmoke), "is_show_explosion_smoke")
                            }

                            {
                                renderSwitch((state, value) => {
                                    state = setIsEliteGiantePlayDeathAnimation(state, value)

                                    saveIsEliteGiantePlayDeathAnimation(state)

                                    return state
                                }, getIsEliteGiantePlayDeathAnimation(readState()), getLanguageTextData(readState(), languageKey.EliteGianteNotPlayDeathAnimation), getLanguageTextData(readState(), languageKey.EliteGiantePlayDeathAnimation), "is_elite_playdeathanimation")
                            }

                        </Row>
                    </Row>
                </>
            case menuItem.Operate:
                return <>
                    <Row justify="start">
                        {
                            Device.isMobile() ?
                                <>
                                    <Row justify="start">
                                        <Text>{getLanguageTextData(readState(), languageKey.SetSkillButtonTip)}:</Text>
                                        {
                                            renderSwitch((state, value) => {
                                                state = setIsStartDrag(state, value)

                                                deferRefreshPageForGetNewestState(setRefresh)

                                                // if (value) {
                                                // closeModal()
                                                // deferCloseModal(setRefresh, "main_menu")
                                                // }
                                                _onCloseMainSettingModal()

                                                return state
                                            }, getIsStartDrag(readState()), getLanguageTextData(readState(), languageKey.EndSetSkillButton), getLanguageTextData(readState(), languageKey.StartSetSkillButton), "startSetSkillButton")
                                        }
                                        {
                                            renderButton((state) => {
                                                // deferCloseModal(setRefresh, "main_menu")
                                                _onCloseMainSettingModal()

                                                return resetOperatePosition(state, Scene.getCharacterType(getAbstractState(state))).then(_ => readState())
                                            }, "resetOperatePosition", getLanguageTextData(readState(), languageKey.ResetSkillButton))
                                        }
                                    </Row>
                                    <Row justify="start">
                                        <Text>{getLanguageTextData(readState(), languageKey.FireWayTip)}:</Text>
                                        {
                                            renderSwitch((state, value) => {
                                                if (value) {
                                                    state = setFireWay(state, fireWay.Burst)
                                                }
                                                else {
                                                    state = setFireWay(state, fireWay.Continuous)
                                                }


                                                deferRefreshPageForGetNewestState(setRefresh)

                                                return state
                                            }, isBurstFire(readState()), getLanguageTextData(readState(), languageKey.ContinueFire), getLanguageTextData(readState(), languageKey.BurstFire), "burst_fire")
                                        }
                                    </Row>
                                </>
                                :
                                <>
                                    <Row justify="start">
                                        <Text>{getLanguageTextData(readState(), languageKey.FireWayTip)}:</Text>
                                        {
                                            renderSwitch((state, value) => {
                                                if (value) {
                                                    state = setFireWay(state, fireWay.Burst)
                                                }
                                                else {
                                                    state = setFireWay(state, fireWay.Continuous)
                                                }


                                                deferRefreshPageForGetNewestState(setRefresh)

                                                return state
                                            }, isBurstFire(readState()), getLanguageTextData(readState(), languageKey.ContinueFire), getLanguageTextData(readState(), languageKey.BurstFire), "burst_fire")
                                        }
                                    </Row>

                                </>
                        }
                    </Row>
                </>
            // case menuItem.Debug:
            //     return <>
            //         {
            //             renderButton((state) => {
            //                 return CityScene3D.setGirlScale(state, CityScene3D.getGirlScale(state, usedGirl) + 10)
            //             }, "bigger", "变大")
            //         }
            //         {
            //             renderButton((state) => {
            //                 return CityScene3D.setGirlScale(state, Math.max(Math.floor(CityScene3D.getGirlScale(state, usedGirl) / 2), 1))

            //             }, "smaller", "变小")
            //         }
            //         {
            //             renderButton((state) => {
            //                 return {
            //                     ...state,
            //                     config: {
            //                         ...state.config,
            //                         isFastMove: true
            //                     }
            //                 }
            //             }, "fast_move", "开启快速移动")
            //         }
            //         {
            //             renderButton((state) => {
            //                 return {
            //                     ...state,
            //                     config: {
            //                         ...state.config,
            //                         isFastMove: false
            //                     }
            //                 }
            //             }, "close_fast_move", "关闭快速移动")
            //         }
            //     </>
        }
    }

    // let _openSetting = (state) => {
    //     setIsShowMainMenu(_ => true)
    //     setCurrentMenuItem(_ => menuItem.Camera)

    //     state = handleOpenModal(state, false)

    //     return state
    // }

    // let _openProp = (state) => {
    //     setIsShowProp(_ => true)

    //     NullableUtils.forEach(propType_ => {
    //         setCurrentPropItem(_ => propType_)
    //     }, ArrayUtils.get(_getAllValidPropTypes(state), 0))

    //     state = handleOpenModal(state)

    //     return state
    // }

    // let _openControl = () => {
    //     setIsShowControl(_ => true)

    //     switch (getSceneChapter(readState())) {
    //         case scene.Play:
    //             setCurrentControlItem(_ => city1ControlItem.SelectTarget)
    //             break
    //         case scene.Biwu:
    //             setCurrentControlItem(_ => biwuControlItem.None)
    //             break
    //     }
    // }

    let _renderGiantessUI = () => {
        // if (getSceneChapter(readState()) != scene.Play) {
        if (isBossLevel(readState())) {
            return null
        }

        return <>
            {
                characterType_ == characterType.LittleMan ?
                    null :
                    <>

                        {/* {
                            <Pose />
                        } */}

                        {
                            <GiantessOperate.default />
                        }

                        {
                            <Bar />
                        }
                        {/* {
                            <SkillBar />
                        } */}
                    </>
            }
        </>
    }

    let _renderBossLevelUI = () => {
        if (!isBossLevel(readState())) {
            return null
        }

        return <>
            {
                <BiwuLevelStatus.default />
            }
        </>
    }

    let _makeMainSettingModalSemiTransparent = () => {
        document.querySelector<any>(".main_menu .adm-center-popup-wrap").style.opacity = 0.5
    }

    let _makeMainSettingModalOpacity = () => {
        document.querySelector<any>(".main_menu .adm-center-popup-wrap").style.opacity = 1
    }

    let _onCloseMainSettingModal = () => {
        setIsShowMainMenu(_ => false)
        handleCloseModal()
    }

    let _renderMainSetting = () => {
        return <Modal getContainer={LandscapeUtils.getRootDom()}
            // keyboard={false}
            // width={"80%"}
            visible={isShowMainMenu}
            // className={`main_menu ${buildModalClassName()}`}
            className={`main_menu`}
            // maskClosable={false}
            closeOnMaskClick={true}
            showCloseButton={true}

            title={
                <Title className="title">{getLanguageTextData(readState(), languageKey.MainSettingTitle)}</Title>
            }
            // open={isShowMainMenu}
            //  onOk={_handle} onCancel={_handle}
            // closable={false}
            // footer={null}
            content={
                <Row justify="center" className="row"
                // gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
                    {
                        _renderMenuButton()
                    }
                    <Col className="col"
                        span={16}>
                        {
                            _renderCurrentMenuItem()
                        }
                    </Col>
                </Row>
            }
            onClose={handleEventHandler(_ => {
                _onCloseMainSettingModal()
            })}
            afterShow={
                handleEventHandler(_ => {
                    _makeMainSettingModalSemiTransparent()
                })
            }
        // onCancel={_ => {
        //     setIsShowMainMenu(_ => false)
        // }}
        />
    }

    let _renderPropButton = () => {
        let state = readState()

        return <Row justify="start" className="">
            {
                getAllValidPropTypeData(state)
                    .map(([propType_, propTypeTitle]) => {
                        return <SideBar
                            activeKey={currentPropItem}
                            // defaultActiveKey={propType.Bullet}
                            className="side_bar"
                            onChange={handleEventHandler(key => {
                                // switch (key) {
                                //     case propType.Bullet:
                                //         setCurrentPropItem(_ => .Bullet)
                                //         break
                                // }
                                setCurrentPropItem(_ => key)
                            })}
                        >
                            <SideBar.Item key={propType_} title={propTypeTitle} />
                        </SideBar>
                    })

            }
        </Row>
    }

    let _getPropData = (state, isSelectedFunc, propType_) => {
        // let disabledProps = getDisabledProps(state)

        return getAllPropsByType(state, propType_).filter(p => {
            return isCharacterTypeEqual(p.characterType, getCharacterType(getAbstractState(state)))
        }).map<[string, string, string, number, boolean, any, boolean]>(d => {
            let isSelected = isSelectedFunc(state, d.name)

            // return [d.imageSrc, d.name, d.description, d.count, isSelected, d.name, disabledProps.includes(d.name)]
            return [d.imageSrc, d.title, d.description, d.count, isSelected, d.name, isDisable(state, d.name)]
        }).toArray().filter(data => {
            return data[3] > 0
        })
    }

    let _onClosePropModal = () => {
        setIsShowProp(_ => false)

        handleCloseModal()
    }

    let _renderPropItem = (state, [usePropFunc, isSelectedFunc], propType_) => {
        return _getPropData(state, isSelectedFunc, propType_).map((data, index) => {
            return <Col key={index} span={4} justify="center">
                <div className={`prop_container ${_getDisabledClassName(data[6])}`}
                    onClick={
                        handleEventHandler(_ => {
                            if (data[6]) {
                                Toast.show({
                                    // content: `${data[2]}`,
                                    content: `${data[1]}: ${data[2]}`,
                                })

                                return
                            }

                            state = play(state, buildNeedToPlaySoundData(getClickSmallSoundResourceId(), getIsDebug(state), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

                            let handler = Modal.show({
                                getContainer: LandscapeUtils.getRootDom(),
                                bodyClassName: "prop_modal_body",
                                // maskClassName: "prop_modal_mask",
                                title: data[1],
                                content: data[2],
                                actions: [
                                    {
                                        key: 'confirm',
                                        text: getLanguageTextData(readState(), languageKey.Confirm),
                                        primary: true,
                                    },
                                    {
                                        key: 'cancel',
                                        text: getLanguageTextData(readState(), languageKey.Cancel),
                                    },
                                    {
                                        key: 'addToFastProp',
                                        text: <>
                                            <Text className="addToFastProp_text">{getLanguageTextData(readState(), languageKey.AddToFastProp)}:</Text>
                                            <Selector
                                                className="addToFastProp"
                                                // defaultValue={CityScene3D.getFirstPersonCameraTarget(readState())}
                                                onChange={handleEventHandler(arr => {
                                                    let state = readState()

                                                    let value = arr.length > 0 ? arr[0] : "0"

                                                    let index = Number(value)


                                                    state = setFastPropData(state, {
                                                        characterType_: getCharacterType(getAbstractState(state)),
                                                        index: index,
                                                        value: {
                                                            usePropFunc,
                                                            propName: data[5],
                                                            propImageSrc: data[0],
                                                            // count: data[3],
                                                        }
                                                    })

                                                    writeState(state)

                                                    // dispatch(setFastPropDataStore(getFastPropData(state)))
                                                    // return Event.trigger(state, getAbstractState, getSetFastPropEventName(), NullableUtils.getEmpty()).then(writeState)


                                                    // closeModal()
                                                    // setRefresh(_ => Math.random())
                                                })}
                                                options={[
                                                    { value: "0", label: "1" },
                                                    { value: "1", label: "2" },
                                                    { value: "2", label: "3" },
                                                    { value: "3", label: "4" },
                                                    { value: "4", label: "5" },
                                                ]}
                                            />

                                        </>,
                                    },
                                ],
                                onAction: handleEventHandler(async (action, index) => {
                                    handler.close()

                                    switch (action.key) {
                                        case "confirm":
                                            return useProp(
                                                [
                                                    usePropFunc,
                                                    (state, isCloseModal) => {
                                                        if (isCloseModal) {
                                                            return new Promise<void>((resolve, reject) => {
                                                                writeState(state)

                                                                _onClosePropModal()

                                                                resolve()
                                                            })
                                                        }
                                                        else {
                                                            return update(state).then(state => {
                                                                setRefresh(_ => Math.random())

                                                                writeState(state)
                                                            })
                                                        }
                                                    },
                                                    dispatch
                                                ],
                                                data[5]
                                            )
                                        case "cancel":
                                            // setRefresh(_ => Math.random())
                                            break
                                    }

                                    return Promise.resolve()
                                }),
                            })

                            // Modal.confirm({
                            //     getContainer: LandscapeUtils.getRootDom(),
                            //     // className: buildModalClassName(),
                            //     title: data[1],
                            //     confirmText: getLanguageTextData(readState(), languageKey.Confirm),
                            //     cancelText: getLanguageTextData(readState(), languageKey.Cancel),
                            //     content: data[2],
                            //     onConfirm: handleEventHandler(async () => {
                            //         await useProp(
                            //             [
                            //                 usePropFunc,
                            //                 (state, isCloseModal) => {
                            //                     if (isCloseModal) {
                            //                         return new Promise<void>((resolve, reject) => {
                            //                             writeState(state)

                            //                             closeModal()

                            //                             resolve()
                            //                         })
                            //                     }
                            //                     else {
                            //                         return update(state).then(state => {
                            //                             setRefresh(_ => Math.random())

                            //                             writeState(state)
                            //                         })
                            //                     }
                            //                 },
                            //                 dispatch
                            //             ],
                            //             data
                            //         )

                            //         // let state = readState()

                            //         // state = play(state, buildNeedToPlaySoundData(getClickSmallSoundResourceId(), getIsDebug(state), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

                            //         // await usePropFunc(state, data[5])
                            //         //     .then(([state, isCloseModal]) => {
                            //         //         // return SoundManager.update(getAbstractState(state)).then(abstractState => {
                            //         //         //     return setAbstractState(state, abstractState)
                            //         //         // })

                            //         //         let promise
                            //         //         if (isCloseModal) {
                            //         //             promise = new Promise<void>((resolve, reject) => {
                            //         //                 writeState(state)

                            //         //                 closeModal()

                            //         //                 resolve()
                            //         //             })
                            //         //         }
                            //         //         else {
                            //         //             promise = update(state).then(state => {
                            //         //                 setRefresh(_ => Math.random())

                            //         //                 writeState(state)
                            //         //             })
                            //         //         }

                            //         //         return promise.then(_ => {
                            //         //             return Event.trigger(readState(), getAbstractState, getModAPI(state).event.getHandleAfterUsePropEventName(), NullableUtils.return_({
                            //         //                 name: data[5],
                            //         //                 dispatchEvent: buildDispatchFunc(dispatch)
                            //         //             })).then(writeState)
                            //         //         })
                            //         //     })
                            //     }),
                            // })
                        })
                    }
                >
                    <img className="prop_image" src={data[0]} />
                    {
                        isFinite(data[3]) ?
                            <span className="prop_count">{data[3]}</span>
                            : null
                    }
                    {
                        data[4] ?
                            <img className="selected" src="./resource/ui/in_game/selected.png" /> : null
                    }
                </div>
            </Col>
        })
    }

    let _getDisabledClassName = (isDisabled) => {
        return isDisabled ? "disabled" : ""
    }

    let _renderCurrentPropItem = () => {
        let state = readState()

        switch (currentPropItem) {
            case propType.None:
                return null
            case propType.Artifact:
                return <>
                    <Row justify="start">
                        {
                            _renderPropItem(state, [
                                useArtifact,
                                (state, name) => {
                                    return false
                                }
                            ], propType.Artifact)
                        }
                    </Row>
                </>
            case propType.Bullet:
                return <>
                    <Row justify="start">
                        {
                            _renderPropItem(state, [
                                useBullet,
                                (state, name) => {
                                    if (!hasUsedBulletPropName(state)) {
                                        return false
                                    }

                                    return name == getUsedBulletPropName(state)
                                }
                            ], propType.Bullet)
                        }
                    </Row>
                </>
            case propType.Water:
                return <>
                    <Row justify="start">
                        {
                            _renderPropItem(state, [
                                useWater,
                                (state, name) => {
                                    return false
                                }
                            ], propType.Water)
                        }
                    </Row>
                </>
            case propType.Assistant:
                return <>
                    <Row justify="start">
                        {
                            _renderPropItem(state, [
                                useAssistant,
                                (state, name) => {
                                    return false
                                }
                            ], propType.Assistant)
                        }
                    </Row>
                </>
            case propType.Other:
                return <>
                    <Row justify="start">
                        {
                            _renderPropItem(state, [
                                useOther,
                                (state, name) => {
                                    return false
                                }
                            ], propType.Other)
                        }
                    </Row>
                </>
            default:
                return null
        }
    }

    let _renderProp = () => {
        return <Modal getContainer={LandscapeUtils.getRootDom()}
            visible={isShowProp}
            // className={`prop ${buildModalClassName()}`}
            className={`prop`}
            closeOnMaskClick={true}
            showCloseButton={true}

            title={
                <Title className="title">{getLanguageTextData(readState(), languageKey.PackageTitle)}</Title>
            }
            content={
                <Row justify="center" className="row" >
                    <Col className="" span={4} justify="center">
                        {
                            _renderPropButton()
                        }
                    </Col>
                    <Col className="col"
                        span={20} justify="start">
                        {
                            _renderCurrentPropItem()
                        }
                    </Col>
                </Row>
            }
            onClose={handleEventHandler(_ => {
                _onClosePropModal()
            })}
        />
    }

    // let _renderControlButton = () => {
    //     switch (getSceneChapter(readState())) {
    //         case scene.Play:
    //             return <>
    //                 <Row justify="start" className="">
    //                     {/* {
    //                 renderButton(state => {
    //                     setCurrentControlItem(_ => city1ControlItem.SelectTarget)

    //                     return Promise.resolve(state)
    //                 }, "select_target_button", "选择目标",)
    //             } */}
    //                     <SideBar
    //                         activeKey={currentControlItem}
    //                         onChange={key => {
    //                             // switch (key) {
    //                             // case city1ControlItem.SelectTarget:
    //                             //     setCurrentControlItem(_ => city1ControlItem.SelectTarget)
    //                             //     break
    //                             // }
    //                             setCurrentControlItem(_ => key)
    //                         }}
    //                     >
    //                         <SideBar.Item key={city1ControlItem.SelectTarget} title={'选择目标'} />
    //                     </SideBar>

    //                 </Row>
    //                 {/* <Row justify="start" className="">
    //             {
    //                 renderButton(state => {
    //                     setCurrentControlItem(_ => city1ControlItem.Execute)

    //                     return Promise.resolve(state)
    //                 }, "execute_button", "执行动作",)
    //             }
    //         </Row> */}
    //             </>
    //         case scene.Biwu:
    //             return <>
    //                 <Row justify="start" className="">
    //                     <SideBar
    //                         activeKey={currentControlItem}
    //                         onChange={key => {
    //                             // switch (key) {
    //                             //     case city1ControlItem.SelectTarget:
    //                             //         setCurrentControlItem(_ => city1ControlItem.SelectTarget)
    //                             //         break
    //                             // }
    //                             setCurrentControlItem(_ => key)
    //                         }}
    //                     >
    //                         <SideBar.Item key={biwuControlItem.None} title={'无'} />
    //                     </SideBar>

    //                 </Row>
    //             </>
    //     }
    // }

    // let _renderCurrentControlItem = () => {
    //     let state = readState()

    //     switch (currentControlItem) {
    //         case city1ControlItem.SelectTarget:
    //             return <>
    //                 <Row justify="start">
    //                     <Selector
    //                         defaultValue={String(getLittleManSettingInGame(readState()).selectTargetPrior)}
    //                         onChange={arr => {
    //                             set(setLittleManSettingInGameIsSelectLittleManPrior, arr, targetPrior.None)
    //                         }}
    //                         options={
    //                             [
    //                                 { value: String(targetPrior.None), label: "默认" },
    //                                 { value: String(targetPrior.LittleMan), label: "玩家" },
    //                                 { value: String(targetPrior.Building), label: "建筑" },
    //                                 { value: String(targetPrior.Cityzen), label: "市民" },
    //                                 { value: String(targetPrior.Soldier), label: "士兵" },
    //                                 { value: String(targetPrior.MilltaryVehicle), label: "军车" },
    //                                 { value: String(targetPrior.MilltaryBuilding), label: "军事建筑" },
    //                             ]
    //                         }
    //                     />
    //                 </Row>
    //             </>
    //         case biwuControlItem.None:
    //             return <>
    //             </>
    //     }
    // }

    // let _renderControl = () => {
    //     return <Modal getContainer={LandscapeUtils.getRootDom()}
    //         visible={isShowControl}
    //         className="control"
    //         closeOnMaskClick={true}
    //         showCloseButton={true}

    //         title={
    //             <Title className="title">{`控制巨大娘`}</Title>
    //         }
    //         content={
    //             <Row justify="center" className="row" >
    //                 <Col className="control_button" span={4} justify="center">
    //                     {
    //                         _renderControlButton()
    //                     }
    //                 </Col>
    //                 <Col className="col"
    //                     span={20} justify="start">
    //                     {
    //                         _renderCurrentControlItem()
    //                     }
    //                 </Col>
    //             </Row>
    //         }
    //         onClose={_ => {
    //             setIsShowControl(_ => false)
    //             _handleCloseModal()
    //         }}
    //     />
    // }

    /*! shouldn't on/off event here!
    useEffect(() => {
                writeState(on(readState(), getDestroyedRateUpdateEventName(), _destroyedRateUpdateEventHandler))
        writeState(on(readState(), getHeightUpdateEventName(), _heightUpdateEventHandler))
            writeState(on(readState(), getKeyDownEventName(), _keydownHandle))
     
        return () => {
                writeState(off(readState(), getKeyDownEventName(), _keydownHandle))
            writeState(off(readState(), getDestroyedRateUpdateEventName(), _destroyedRateUpdateEventHandler))
            writeState(off(readState(), getHeightUpdateEventName(), _heightUpdateEventHandler))
        };
    }, []);
            */


    // Console.log(isEnterScenario);


    return (
        <Layout className="city"
        >
            {
                isEnterScenario ? <Dialogue />
                    :
                    <>
                        {
                            // !getIsProduction() ?
                            getIsDebug(readState()) ?
                                renderButton(state => {
                                    isShowDebug ?
                                        setIsShowDebug(() => false)
                                        : setIsShowDebug(() => true)
                                    // setIsShowDebug(() => true)

                                    return Promise.resolve(state)
                                }, "debug_button", "调试", "debug_button")
                                : null
                        }
                        <>
                            {
                                <div className="prop_button_div">
                                    {
                                        renderImage(state => {
                                            state = openProp(state)

                                            return Promise.resolve(state)
                                        }, "./resource/ui/in_game/prop.png", "prop_button")
                                    }
                                    {
                                        !Device.isMobile() ? <span className="prop_text">Q</span> : null
                                    }
                                </div>

                            }
                            {
                                // renderButton(state => {
                                //     setIsShowMainMenu(_ => true)
                                //     setCurrentMenuItem(_ => menuItem.None)

                                //     return state
                                // }, "main_menu_button", "主菜单", "main_menu_button")
                                <div className="main_menu_button_div">
                                    {
                                        renderImage(state => {
                                            state = openSetting(state)

                                            return Promise.resolve(state)
                                        }, "./resource/ui/in_game/setting.png", "main_menu_button")
                                    }
                                    {
                                        !Device.isMobile() ? <span className="main_menu_text">P</span> : null
                                        // !Device.isMobile() ? <span className="main_menu_text">Esc</span> : null
                                    }
                                </div>
                            }

                            {
                                isHideUI(readState()) ? <>
                                    {
                                        characterType_ == characterType.LittleMan && Device.isMobile() ?
                                            <>
                                                {
                                                    <LittleManOperate.default />
                                                }
                                            </> :
                                            null
                                    }
                                    {
                                        characterType_ == characterType.Giantess && Device.isMobile() ?
                                            <>

                                                {
                                                    <GiantessOperate.default />
                                                }
                                            </>
                                            : null
                                    }
                                </> : <>

                                    {/* {
                                        <BossBar.default />
                                    } */}

                                    {
                                        <BossSkillBar.default />
                                    }

                                    {
                                        <BossStatus />
                                    }

                                    {
                                        <LevelBar />
                                    }
                                    {
                                        <LevelStatus />
                                    }
                                    {
                                        <Character />
                                    }

                                    {
                                        <PlayerStatus />
                                    }

                                    {
                                        <FastProp />
                                    }

                                    {
                                        characterType_ == characterType.LittleMan ?
                                            <>
                                                {
                                                    <LittleManOperate.default />
                                                }
                                                {
                                                    <LittleManBar.default />
                                                }
                                                {
                                                    <Weapon />
                                                }
                                            </> :
                                            null
                                    }

                                    {
                                        _renderGiantessUI()
                                    }
                                    {
                                        _renderBossLevelUI()
                                    }

                                </>

                            }
                        </>
                        {/* {
                            characterType == characterType.LittleMan ?
                                renderImage(state => {
                                    _openControl()

                                    return Promise.resolve(state)
                                }, "./resource/ui/in_game/control.png", "control_button") : null
                        } */}
                        {/* <Button key={"main_menu_button"} className={"main_menu_button"}
                onClick={_ => {
                    setIsShowMainMenu(_ => true)
                    setCurrentMenuItem(_ => menuItem.None)
                }}
            >
                {"主菜单"}
            </Button > */}

                        {
                            <PageForUIAPI />
                        }

                        {
                            <PageForSceneUIAPI />
                        }


                        {
                            _renderMainSetting()
                        }
                        {
                            _renderProp()
                        }
                        {/* {
                            _renderControl()
                        } */}


                        {
                            isShowDebug ? <Debug setIsShowDebug={setIsShowDebug} /> : null
                        }


                        <QTE.default />

                        <Dialogue />

                        <GetProp />

                        <GameEventTip />

                        <Upgrade />

                        <Trade />
                    </>
            }
        </Layout >
    );
};

export default City;
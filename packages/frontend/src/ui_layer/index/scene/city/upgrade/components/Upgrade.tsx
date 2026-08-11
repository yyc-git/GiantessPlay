import "./Upgrade.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Card, Mask } from "antd-mobile";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { upgradeData } from "../../../store/SceneStoreType";
import { upgradeFuncData, upgradeType } from "../../../../../../scene3d_layer/script/scene/scene_city/data/build/BuildData";
import { renderImage } from "../../../../../utils/ImageUtils";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../business_layer/State";
import { setUpgradeData } from "../../../store/SceneStore";
import { applyItem, setIsWait, addNotWantCurrentUpgradeItems, isNotWant, removeNotWantCurrentUpgradeItem, getNewItems, getChangeNeedCoin, updateChangeNeedCoin, isAutoUpgradeInteractionWay, setUpgradeInteractionWay } from "../../../../../../scene3d_layer/script/scene/scene_city/build/Upgrade";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { Camera } from "meta3d-jiehuo-abstract";
import { play } from "../../../../../../business_layer/Sound";
import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../../../business_layer/Loader";
import { getIsDebug, getLanguage } from "../../../../../../scene3d_layer/script/scene/Scene";
import { buildModalClassName, handleCloseModal, handleOpenModal } from "../../../../../utils/ModalUtils";
import { renderButton } from "../../../../../utils/ButtonUtils";
import { getSoundSetting } from "../../../../../../scene3d_layer/mod/SettingMod";
import { getLanguageTextData, languageKey } from "../../../../../../scene3d_layer/internation/Data";
import { language } from "../../../../../../scene3d_layer/type/StateType";
import { deferSwitchPageForGetNewestState } from "../../../../../utils/SwitchPageUtils";
import { handleEventHandler } from "../../../../../utils/ErrorUtils";
import { isLittleCharacterType } from "../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { upgradeInteractionWay, usedGirlEnum } from "../../../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { renderSwitch } from "../../../../../utils/SwitchUtils";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { Map } from "immutable";
import { getTotalCoin } from "../../../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { getModAPI } from "../../../../../../scene3d_layer/script/scene/scene_city/Mod";
import { setTotalCoin } from "../../../../../../scene3d_layer/script/scene/scene_city/reward/Coin";

let Upgrade: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    let upgradeData = useSelector<AppState>((state) => state.scene.upgradeData) as upgradeData

    let [_, setRefresh] = useState(Math.random())

    // let [isWantMap, setIsWantMap] = useState(Map())

    let _getColor = (type) => {
        switch (type) {
            case upgradeType.Assistant:
                return "black"
            case upgradeType.Attack:
                return "red"
            case upgradeType.Skill:
                return "purple"
            case upgradeType.Defense:
                return "green"
            case upgradeType.Other:
                // return "pink"
                return "blue"
        }
    }

    let _getTitle = (title, level, maxLevel) => {
        if (maxLevel == 1) {
            return title
        }

        switch (getLanguage(readState())) {
            case language.Chinese:
                return `${title} ${level}${getLanguageTextData(readState(), languageKey.LevelUnit)}`
            case language.English:
                return `${title} ${getLanguageTextData(readState(), languageKey.LevelUnit)}${level}`
            default:
                throw new Error("err")
        }
    }

    // useEffect(() => {
    //     let state = readState()
    //     if (Camera.isCanLock(getAbstractState(state))) {
    //         state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
    //     }
    //     writeState(state)
    // }, []);

    return <Layout className="upgrade-main" >
        <Mask
            visible={upgradeData.length > 0}
            /*! here Mask is as Modal, so need add buildModalClassName() class name for _getOpenedModalCount
            */
            className={`${buildModalClassName()}`}
            // opacity={0.3}
            opacity="default"
            // color={"black"}
            stopPropagation={[]}
            // style={_getStyle(dialogue)}
            // afterShow={handleEventHandler(_ => {
            //     writeState(handleOpenModal(readState()))
            // })}
            afterClose={handleEventHandler(_ => {
                writeState(setIsWait(readState(), false))

                handleCloseModal()
            })}
        >
            <Flex justify="center" align="center">
                {/* <Title className="title" level={1} >{`恭喜升到${computeLevel(readState())}级`}</Title> */}
                {
                    renderSwitch((state, isManualPopup) => {
                        if (isManualPopup) {
                            state = setUpgradeInteractionWay(state, upgradeInteractionWay.Manual)
                        }
                        else {
                            state = setUpgradeInteractionWay(state, upgradeInteractionWay.Auto)
                        }

                        setRefresh(_ => Math.random())

                        return state
                    },
                        !isAutoUpgradeInteractionWay(readState()),
                        getLanguageTextData(readState(), languageKey.AutoPopup),
                        getLanguageTextData(readState(), languageKey.ManualPopup),
                        "popup")
                }
                <Title className="title" level={1} >{getLanguageTextData(readState(), languageKey.UpgradeTitle)}</Title>
                {
                    renderButton(state => {
                        dispatch(setUpgradeData([]))

                        return Promise.resolve(state)
                    }, "skip", getLanguageTextData(readState(), languageKey.Skip), "", getClickSmallSoundResourceId())
                }
                {
                    renderButton(state => {
                        if (getTotalCoin(state) < getChangeNeedCoin(state)) {
                            let api = getModAPI(state)

                            api.sceneUI.alert(getLanguageTextData(readState(), languageKey.CoinNotEnough))

                            return Promise.resolve(state)
                        }

                        state = setTotalCoin(state, getTotalCoin(state) - getChangeNeedCoin(state))
                        state = updateChangeNeedCoin(state)

                        deferSwitchPageForGetNewestState(dispatch, setUpgradeData(getNewItems(state)))

                        return Promise.resolve(state)
                    }, "change", `${getLanguageTextData(readState(), languageKey.Change)}(${getLanguageTextData(readState(), languageKey.Take)}${getChangeNeedCoin(readState())}${getLanguageTextData(readState(), languageKey.Coin)}, ${getLanguageTextData(readState(), languageKey.Has)}${getTotalCoin(readState())}${getLanguageTextData(readState(), languageKey.Coin)})`, "change", getClickSmallSoundResourceId())
                }
            </Flex>

            <Row justify="center">
                {
                    upgradeData.map((d) => {
                        return <Col className="col" span={6}>
                            <Row justify="center">
                                <Card
                                    className={isNotWant(readState(), d.name) ? "not_want" : ""}
                                    title={<>
                                        <Title className={_getColor(d.type)} level={4} >{_getTitle(d.title, d.level, d.maxLevel)}</Title>
                                    </>}
                                    onClick={handleEventHandler(_ => {
                                        let state = readState()
                                        if (isNotWant(state, d.name)) {
                                            return Promise.resolve()
                                        }

                                        play(state, buildNeedToPlaySoundData(getClickSmallSoundResourceId(), getIsDebug(state), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

                                        return applyItem(state, d,
                                            isLittleCharacterType(state) ? usedGirlEnum.None : usedGirlEnum.PlayerGirl
                                        ).then(writeState).then(_ => {
                                            dispatch(setUpgradeData([]))
                                        })
                                    })}
                                >
                                    {
                                        renderImage(d.imageSrc, "icon", false)
                                    }
                                    <Text >{d.description}</Text>

                                </Card>
                            </Row>
                            <Row justify="center">
                                {
                                    renderSwitch((state, isWant) => {
                                        if (isWant) {
                                            state = removeNotWantCurrentUpgradeItem(state, d.name)
                                        }
                                        else {
                                            state = addNotWantCurrentUpgradeItems(state, [d.name])
                                        }

                                        setRefresh(_ => Math.random())

                                        return state
                                    },
                                        !isNotWant(readState(), d.name),
                                        getLanguageTextData(readState(), languageKey.NotWant),
                                        getLanguageTextData(readState(), languageKey.Want),
                                        "is_want")
                                    //     renderButton(state => {
                                    //     dispatch(setUpgradeData([]))

                                    //         state = addNotWantCurrentUpgradeItems(state, upgradeData.map(data => data.name))

                                    // return Promise.resolve(state)
                                    //     }, "not_show_again", getLanguageTextData(readState(), languageKey.NotWantCurrentUpgradeItems), "not_show_again", getClickSmallSoundResourceId())
                                }
                            </Row>
                        </Col>
                    })
                }
            </Row>
        </Mask>
    </Layout >
};

export default Upgrade;
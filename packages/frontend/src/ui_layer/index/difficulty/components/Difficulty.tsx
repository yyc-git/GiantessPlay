import "./Difficulty.scss"

import React, { useEffect, useState } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene, sceneData } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { renderButton, renderImage as renderButtonImage } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId, getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage } from "../../../utils/ImageUtils";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import Text from 'antd/es/typography/Text';
import { Selector, Switch, Toast } from "antd-mobile";
// import { getConfigData, getLittleManSetting, setLittleManSettingArmyCount, setLittleManSettingBiggerFrequency, setLittleManSettingGiantessScale, setLittleManSettingGiantessStrength, setLittleManSettingIsBiggerNoLimit, setLittleManSettingLittleManStrength, setLittleManSettingPropCount } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
// import { armyCount, biggerFrequency, giantessScale, giantessStrength, littleManStrength, propCount } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { difficultyData } from "../../../../scene3d_layer/script/scene/scene_city/data/difficulty/DifficultyData";
import * as Difficulty_ from "../../../../scene3d_layer/script/scene/scene_city/difficulty/Difficulty";
import { isEnteringNextLevel } from "../../../../scene3d_layer/script/scene/scene_city/manage/mission/Mission";
import { autoDifficulty } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { deferSwitchPageForGetNewestState } from "../../../utils/SwitchPageUtils";
import { getLanguageTextData, getLanguageTextVariableData, languageKey, languageVariableKey } from "../../../../scene3d_layer/internation/Data";
import { handleEventHandler } from "../../../utils/ErrorUtils";
import { buildFuncData } from "../../../../scene3d_layer/script/scene/scene_city/data/FuncData";
import { getAutoDifficultyClassName } from "../../../utils/DifficultyUtils";
import { setDefaultCareer } from "../../../../scene3d_layer/script/scene/scene_city/build/Career";

let Difficulty: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    let targetSceneData = useSelector<AppState>((state) => NullableUtils.getExn(state.global.targetSceneData)) as sceneData

    let [data, setData] = useState([])

    let _changeHeat = (name, newHeat) => {
        setData(d => {
            return NullableUtils.map((d: difficultyData<any>) => {
                return d.map(v => {
                    if (v.name == name) {
                        return {
                            ...v,
                            heat: newHeat
                        }
                    }

                    return v
                })
            }, d)
        })
    }

    let _getColorClassName = (value) => {
        if (value > 0) {
            return "red"
        }
        else if (value == 0) {
            return "white"
        }

        return "green"
    }

    useEffect(() => {
        let state = readState()

        Difficulty_.read(state, targetSceneData.scene, targetSceneData.levelNumber).then(data => {
            setData(_ => NullableUtils.getWithNullableDefaultFunc(data, () => {
                return NullableUtils.return_(
                    Difficulty_.getData(state, targetSceneData.scene, targetSceneData.levelNumber)
                )
            }))
        })
    }, []);

    return <Layout className="difficulty-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.DifficultTitle)}</Title>
        </Flex>


        <Row justify="center">
            {
                renderButton(state => {
                    state = Difficulty_.setData(state, data, targetSceneData.scene, targetSceneData.levelNumber)

                    return Difficulty_.save(state, data, targetSceneData.scene, targetSceneData.levelNumber).then(state => {
                        if (isEnteringNextLevel(state)) {
                            // if (NullableUtils.getExn(targetSceneData).scene == scene.Biwu) {
                            //     // dispatch(setPage(page.Explain))
                            //     dispatch(setPage(page.Scene))
                            // }
                            // else {
                            //     dispatch(setPage(page.SelectCharacter))
                            // }

                            // dispatch(setPage(page.Scene))

                            // deferSwitchPageForGetNewestState(dispatch, setPage(page.Scene))

                            if (NullableUtils.getExn(targetSceneData).scene == scene.Biwu) {
                                state = setDefaultCareer(state)

                                deferSwitchPageForGetNewestState(dispatch, setPage(page.Scene))
                            }
                            else {
                                deferSwitchPageForGetNewestState(dispatch, setPage(page.SelectLittleManCareer))
                            }
                        }
                        else {
                            // dispatch(setPage(page.SelectLittleMan))
                            deferSwitchPageForGetNewestState(dispatch, setPage(page.SelectLittleMan))
                        }

                        return state
                    })
                }, "enter", getLanguageTextData(readState(), languageKey.Confirm), "", getClickMiddleSoundResourceId())
            }
            {
                renderButton(state => {
                    dispatch(setPage(page.IndexMain))

                    return Promise.resolve(state)
                }, "back", getLanguageTextData(readState(), languageKey.Back), "tab", getClickLargeSoundResourceId(), "default")
            }
        </Row>

        <section className="setting">
            <Row justify="center">
                <span>
                    <Title className="title2" level={5} >{getLanguageTextData(readState(), languageKey.TotalHeat)}:</Title>
                    <Title className={`title2 ${_getColorClassName(Difficulty_.computeTotalHeat(data))}`} level={3}>{Difficulty_.computeTotalHeat(data)}</Title>
                </span>

                <span
                    className="second_span"
                    title={
                        getLanguageTextVariableData(readState(), languageVariableKey.RewardLevelExplain)([Math.round(Difficulty_.computeGemFactor(readState(), data) * 100), Math.round(Difficulty_.computePropRewardFactor(readState(), data) * 100) - 100])
                    }
                    onClick={handleEventHandler(() =>
                        Toast.show({
                            content: getLanguageTextVariableData(readState(), languageVariableKey.RewardLevelExplain)([Math.round(Difficulty_.computeGemFactor(readState(), data) * 100), Math.round(Difficulty_.computePropRewardFactor(readState(), data) * 100) - 100])
                        })
                    )
                    }
                >
                    <Title className="title2" level={5} >{getLanguageTextData(readState(), languageKey.RewardLevel)}:</Title>
                    <Title
                        className={`title2 ${_getColorClassName(Difficulty_.computeRewardLevel(data))}`}
                        level={3}
                    // >{Difficulty_.computeRewardLevel(data)}{getLanguageTextData(readState(), languageKey.LevelUnit)}</Text>
                    >{Difficulty_.computeRewardLevel(data)}</Title>
                </span>
            </Row>

            {
                isEnteringNextLevel(readState()) ?
                    <Row justify="center">
                        <Col className="col" span={6}
                            title={getLanguageTextData(readState(), languageKey.MatchDifficultyExplain)}
                            onClick={handleEventHandler(() =>
                                Toast.show({
                                    content: getLanguageTextData(readState(), languageKey.MatchDifficultyExplain)
                                })
                            )
                            }
                        >
                            {/* <Title className={
                                _getAutoDifficultyClassName(Difficulty_.getAutoDifficulty(readState()))
                            } level={4} >{getLanguageTextData(readState(), languageKey.MatchDifficultyTitle)}</Title> */}
                            <Title level={4} >{getLanguageTextData(readState(), languageKey.MatchDifficultyTitle)}</Title>
                        </Col>
                        <Col className="col" span={8}>
                            <Text
                            >{getLanguageTextData(readState(), languageKey.LittleMan)}:</Text>
                            <Text
                                className={
                                    getAutoDifficultyClassName(Difficulty_.getAutoDifficultyByCharacterType(readState(), characterType.LittleMan))
                                }
                            >{Difficulty_.getAutoDifficultyByCharacterType(readState(), characterType.LittleMan) + 1}</Text>
                            <Text
                            >{getLanguageTextData(readState(), languageKey.Giantess)}:</Text>
                            <Text
                                className={
                                    getAutoDifficultyClassName(Difficulty_.getAutoDifficultyByCharacterType(readState(), characterType.Giantess))
                                }
                            >{Difficulty_.getAutoDifficultyByCharacterType(readState(), characterType.Giantess) + 1}</Text>
                        </Col>
                        {/* <Col className="col" span={2}>
                            <Text
                                className={
                                    _getAutoDifficultyClassName(Difficulty_.getAutoDifficulty(readState()))
                                }
                            >{Difficulty_.getAutoDifficulty(readState())}</Text>
                        </Col> */}
                    </Row>
                    : null
            }


            <Row justify="center">
                <Col className="col" span={6} >
                    <Text >{getLanguageTextData(readState(), languageKey.DifficultyName)}</Text>
                </Col>
                <Col className="col" span={2}>
                    <Text >{getLanguageTextData(readState(), languageKey.DifficultyRatio)}</Text>
                </Col>
                <Col className="col" span={4}>
                    <Text >{getLanguageTextData(readState(), languageKey.DifficultyOperate)}</Text>
                </Col>
                <Col className="col" span={2}>
                    <Text >{getLanguageTextData(readState(), languageKey.DifficultyHeat)}</Text>
                </Col>
            </Row>
            {
                data.map(d => {
                    return <Row justify="center">
                        <Col className="col" span={6}
                            title={
                                d.getDescriptionFunc(readState(), buildFuncData(readState()), d.heat, d.ratioOfOneHeat)
                            }
                            onClick={handleEventHandler(() =>
                                Toast.show({
                                    content: d.getDescriptionFunc(readState(), buildFuncData(readState()), d.heat, d.ratioOfOneHeat),
                                })
                            )
                            }
                        >
                            <Text
                                className={_getColorClassName(d.heat)}
                            >{d.title}</Text>
                        </Col>
                        <Col className="col" span={2}>
                            <Text
                                // className={_getColorClassName(Math.round(d.ratioOfOneHeat * d.heat * 100))}
                                className={_getColorClassName(d.heat)}
                            >{
                                    NullableUtils.getWithDefault(
                                        NullableUtils.map(getTextFunc => {
                                            return getTextFunc(readState(), d)
                                        }, d.getTextFunc),
                                        `${Math.round(d.ratioOfOneHeat * d.heat * 100)}%`
                                    )
                                }</Text>
                        </Col>
                        <Col className="col" span={4}>
                            {
                                renderButton(state => {
                                    if (d.heat - 1 >= d.minHeat) {
                                        _changeHeat(d.name, d.heat - 1)
                                    }

                                    return Promise.resolve(state)
                                }, "sub", "-", "sub", getClickSmallSoundResourceId(), "default")
                            }
                            {
                                renderButton(state => {
                                    if (d.heat + 1 <= d.maxHeat) {
                                        _changeHeat(d.name, d.heat + 1)
                                    }

                                    return Promise.resolve(state)
                                }, "add", "+", "add", getClickSmallSoundResourceId(), "primary")
                            }
                        </Col>
                        <Col className="col" span={2}>
                            <Text
                                className={_getColorClassName(d.heat)}
                            >{d.heat}</Text>
                        </Col>
                    </Row>

                })
            }
        </section>

    </Layout >
};

export default Difficulty;
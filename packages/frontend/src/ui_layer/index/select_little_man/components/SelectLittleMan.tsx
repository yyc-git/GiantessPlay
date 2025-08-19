import "./SelectLittleMan.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setPageData, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene, sceneData } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content } from "antd/es/layout/layout";
import { renderButton, renderImage as renderButtonImage } from "../../../utils/ButtonUtils";
import { getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import { renderImage } from "../../../utils/ImageUtils";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Device } from "meta3d-jiehuo-abstract";
import { get29ActiveCodeOutdateInfo, getActiveInfo, getNoActiveCodeInfo, is29ActiveSuccess } from "../../../../scene3d_layer/script/ActiveCode";
import { Modal, Selector } from "antd-mobile";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { renderSwitch } from "../../../utils/SwitchUtils";
import { set } from "../../../utils/SettingUtils";
import { getIsDebug } from "../../../../scene3d_layer/script/scene/Scene";
import { resourceLevel } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { modelName } from "../../../../scene3d_layer/script/scene/scene_city/little_man_data/ModelData";
import { mmdCharacter } from "../../../../scene3d_layer/script/scene/scene_city/data/mmd/MMDData";

let SelectLittleMan: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    // let [pageMMDCharacters, setPageMMDCharacters] = useState([])
    let [pageIndex, setPageIndex] = useState(0)
    let [activeInfo, setActiveInfo] = useState(NullableUtils.getEmpty())

    let targetSceneData = useSelector<AppState>((state) => state.global.targetSceneData) as any

    let _renderCharacter = (src, modelName, isNeedActive, resourceLevel, key) => {
        return <Col key={key} className="col" span={5}>
            {
                Device.isMobile() ? renderButtonImage(state => {
                    return _judgeAndSelect(state, modelName, isNeedActive)
                }, src, resourceLevel, false, NullableUtils.return_(getClickMiddleSoundResourceId()))
                    : renderImage(src, resourceLevel, true)
            }
            <Row justify="center" className="status">
                {
                    isNeedActive ?
                        (
                            _isShowOutdate(isNeedActive) ? renderImage("./resource/ui/not_in_game/outdate.png", "", false) : renderImage("./resource/ui/not_in_game/not_active.png", "", false)
                        )
                        : null
                }
            </Row>
            <Row justify="center" className="button">
                {
                    renderButtonImage(state => {
                        return _judgeAndSelect(state, modelName, isNeedActive)
                    }, isNeedActive ? "./resource/ui/not_in_game/select-button-need-active.png" : "./resource/ui/not_in_game/select-button.png", "", false, NullableUtils.return_(getClickMiddleSoundResourceId()))
                }
            </Row>
        </Col>
    }

    let _select = (state, modelName) => {
        state = CityScene3D.setCurrentModelName(state, modelName)

        let sceneData = NullableUtils.getExn<sceneData>(targetSceneData)
        if (sceneData.scene == scene.Biwu && sceneData.levelNumber == 3) {
            state = CityScene3D.setCurrentMMDCharacter(state, mmdCharacter.Haku_QP)
            dispatch(setPage(page.Explain))
        }
        else {
            dispatch(setPage(page.SelectCharacter))
        }

        return state
    }

    let _judgeAndSelect = (state, modelName, isNeedActive) => {
        if (isNeedActive) {
            if (NullableUtils.isNullable(activeInfo)) {
                return Promise.resolve(state)
            }

            let info = NullableUtils.getExn(activeInfo)

            // if (!is29ActiveSuccess(info)) {
            //     Modal.confirm({
            //         getContainer: LandscapeUtils.getRootDom(),
            //         content: '现在激活？',
            //         onConfirm: async () => {
            //             dispatch(setPageData(info))
            //             dispatch(setPage(page.ActiveCode))

            //             return Promise.resolve(state)
            //         },
            //     })

            //     return Promise.resolve(state)
            // }

            Modal.confirm({
                getContainer: LandscapeUtils.getRootDom(),
                content: _isShowOutdate(true) ? `激活码已过期，现在重新激活？` : '现在激活？（绿色人物属性更高）',
                onConfirm: async () => {
                    dispatch(setPageData(info))
                    dispatch(setPage(page.ActiveCode))

                    return Promise.resolve(state)
                },
            })

            return Promise.resolve(state)
        }

        return Promise.resolve(_select(state, modelName))
    }

    let _isNeedActive = () => {
        if (NullableUtils.isNullable(activeInfo)) {
            return false
        }

        return NullableUtils.getExn(activeInfo) == getNoActiveCodeInfo() || !is29ActiveSuccess(activeInfo)
    }


    // let _isShowNotActive = (isNeedActive) => {
    //     if (isNeedActive) {
    //         if (NullableUtils.isNullable(activeInfo)) {
    //             return false
    //         }

    //         // return !isActiveSuccess(NullableUtils.getExn(activeInfo))
    //         return NullableUtils.getExn(activeInfo) == getNoActiveCodeInfo()
    //     }

    //     return false
    // }

    let _isShowOutdate = (isNeedActive) => {
        if (isNeedActive) {
            if (NullableUtils.isNullable(activeInfo)) {
                return false
            }

            return NullableUtils.getExn(activeInfo) == get29ActiveCodeOutdateInfo()
        }

        return false
    }

    let _getAllPageLittleManCharacters = () => {
        let isNeedActive = _isNeedActive()

        return [
            [
                [
                    "./resource/ui/not_in_game/little_man/Soldier1.png",
                    modelName.Infantry,
                    false,
                    resourceLevel.White,
                ],
                [
                    "./resource/ui/not_in_game/little_man/Mutant.png",
                    modelName.Mutant,
                    isNeedActive,
                    resourceLevel.Green,
                ],
                [
                    "./resource/ui/not_in_game/little_man/Ely.png",
                    modelName.Ely,
                    isNeedActive,
                    resourceLevel.Green,
                ],
                [
                    "./resource/ui/not_in_game/little_man/Maria.png",
                    modelName.Maria,
                    isNeedActive,
                    resourceLevel.White,
                ],
            ],
            [
                [
                    "./resource/ui/not_in_game/little_man/Dreyar.png",
                    modelName.Dreyar,
                    isNeedActive,
                    resourceLevel.White,
                ],
                [
                    "./resource/ui/not_in_game/little_man/Abe.png",
                    modelName.Abe,
                    isNeedActive,
                    resourceLevel.White,
                ],
                [
                    "./resource/ui/not_in_game/little_man/Mousey.png",
                    modelName.Mousey,
                    isNeedActive,
                    resourceLevel.White,
                ],
                [
                    "./resource/ui/not_in_game/little_man/Ninja.png",
                    modelName.Ninja,
                    isNeedActive,
                    resourceLevel.White,
                ],
            ],
        ]
    }

    let _renderPreviousButton = () => {
        if (pageIndex > 0) {
            return renderButtonImage(state => {
                setPageIndex(pageIndex => pageIndex - 1)

                return Promise.resolve(state)
            }, "./resource/ui/not_in_game/previous.png", "previous", false, NullableUtils.return_(getClickSmallSoundResourceId()))
        }

        return null
    }

    let _renderNextButton = () => {
        if (pageIndex < _getAllPageLittleManCharacters().length - 1) {
            return renderButtonImage(state => {
                setPageIndex(pageIndex => pageIndex + 1)

                return Promise.resolve(state)
            }, "./resource/ui/not_in_game/next.png", "next", false, NullableUtils.return_(getClickSmallSoundResourceId()))
        }

        return null
    }

    let _render = () => {
        return <>
            {_getAllPageLittleManCharacters()[pageIndex].map(([src, modelName, isNeedActive, resourceLevel], i) => {
                return _renderCharacter(src, modelName, isNeedActive, resourceLevel, i)
            })
            }
        </>
    }

    useEffect(() => {
        getActiveInfo().then(info => {
            setActiveInfo(_ => NullableUtils.return_(info))
        })
    }, []);

    return <Layout className="select-little-man-main"  >
        <Flex justify="center" align="center">
            <Title className="title">选择小人</Title>
        </Flex>

        <Row justify="center" className="select">
            {
                _renderPreviousButton()
            }
            {
                _render()
            }
            {
                _renderNextButton()
            }
        </Row>
    </Layout >
};

export default SelectLittleMan;
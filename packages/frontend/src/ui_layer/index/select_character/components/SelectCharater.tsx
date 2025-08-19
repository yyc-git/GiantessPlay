import "./SelectCharater.scss"

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
import { isValid } from "../../../../scene3d_layer/script/scene/scene_city/utils/MMDUtils";
import { Modal, Selector } from "antd-mobile";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { getAllMMDData, mmdCharacter } from "../../../../scene3d_layer/script/scene/scene_city/data/mmd/MMDData";
import { renderSwitch } from "../../../utils/SwitchUtils";
import { set } from "../../../utils/SettingUtils";
import { getIsDebug } from "../../../../scene3d_layer/script/scene/Scene";
import { resourceLevel } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { getLevelNumber, getSceneChapter } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { getAllMMDData as getAllMMDDataBiwuLevel1 } from "../../../../scene3d_layer/script/scene/scene_city/data/biwu/level1/mmd/MMDData";
import { getAllMMDData as getAllMMDDataBiwuLevel2 } from "../../../../scene3d_layer/script/scene/scene_city/data/biwu/level2/mmd/MMDData";
// import { getAllMMDData as getAllMMDDataBiwuLevel3 } from "../../../../scene3d_layer/script/scene/scene_city/data/biwu/level3/mmd/MMDData";

let SelectCharacter: React.FC = () => {
    let targetSceneData = useSelector<AppState>((state) => state.global.targetSceneData) as any

    let dispatch: AppDispatch = useDispatch()

    // let [pageMMDCharacters, setPageMMDCharacters] = useState([])
    let [pageIndex, setPageIndex] = useState(0)
    let [activeInfo, setActiveInfo] = useState(NullableUtils.getEmpty())

    let _isShowOutdate = (isNeedActive) => {
        return false
    }

    let _renderCharacter = (src, mmdCharacter_, isNeedActive, resourceLevel, key) => {
        return <Col key={key} className="col" span={5}>
            {
                Device.isMobile() ? renderButtonImage(state => {
                    return _judgeAndSelect(state, mmdCharacter_, isNeedActive)
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
                        return _judgeAndSelect(state, mmdCharacter_, isNeedActive)
                    }, isNeedActive ? "./resource/ui/not_in_game/select-button-need-active.png" : "./resource/ui/not_in_game/select-button.png", "", false, NullableUtils.return_(getClickMiddleSoundResourceId()))
                }
            </Row>
        </Col>
    }

    let _select = (state, character) => {
        state = CityScene3D.setCurrentMMDCharacter(state, character)

        // dispatch(setPage(page.SelectLevel))
        dispatch(setPage(page.Explain))

        return state
    }

    let _judgeAndSelect = (state, character, isNeedActive) => {
        return Promise.resolve(_select(state, character))
    }

    let _getAllPageMMDCharacters = () => {
        // let isNeed9Active = _isNeed9Active()
        // let isNeed29Active = _isNeed29Active()
        let isNeed9Active = false
        let isNeed29Active = false

        // let state = readState()
        let allMMDData

        let sceneData = NullableUtils.getExn<sceneData>(targetSceneData)
        switch (sceneData.scene) {
            case scene.Play:
                allMMDData = getAllMMDData()
                break
            case scene.Biwu:
                switch (sceneData.levelNumber) {
                    case 1:
                        allMMDData = getAllMMDDataBiwuLevel1()
                        break
                    case 2:
                        allMMDData = getAllMMDDataBiwuLevel2()
                        break
                    // case 3:
                    //     allMMDData = getAllMMDDataBiwuLevel3()
                    //     break
                    default:
                        throw new Error("err")
                }
                break
            default:
                throw new Error("err")
        }

        return [
            [
                // [
                //     "./resource/ui/not_in_game/mmd/Meiko.png",
                //     mmdCharacter.Meiko,
                //     false,
                //     resourceLevel.White,
                // ],
                [
                    "./resource/ui/not_in_game/mmd/Baixi_Maid.png",
                    mmdCharacter.Baixi_Maid,
                    false,
                    resourceLevel.White,
                ],
                [
                    "./resource/ui/not_in_game/mmd/XiaHui.png",
                    mmdCharacter.XiaHui,
                    false,
                    resourceLevel.Green,
                ],
                // [
                //     "./resource/ui/not_in_game/mmd/Haku_QP.png",
                //     mmdCharacter.Haku_QP,
                //     true,
                // ],
                [
                    "./resource/ui/not_in_game/mmd/Nero.png",
                    mmdCharacter.Nero,
                    isNeed29Active,
                    resourceLevel.Green,
                ],
                [
                    "./resource/ui/not_in_game/mmd/Xiaye1.png",
                    mmdCharacter.Xiaye1,
                    isNeed29Active,
                    resourceLevel.Green,
                ],
            ],
            [
                [
                    "./resource/ui/not_in_game/mmd/Xiaye2.png",
                    mmdCharacter.Xiaye2,
                    isNeed29Active,
                    resourceLevel.Green,
                ],
                [
                    "./resource/ui/not_in_game/mmd/Haku_Lady.png",
                    mmdCharacter.Haku_Lady,
                    isNeed29Active,
                    resourceLevel.Green,
                ],
                [
                    "./resource/ui/not_in_game/mmd/Changee.png",
                    mmdCharacter.Changee,
                    isNeed29Active,
                    resourceLevel.Green,
                ],
                [
                    "./resource/ui/not_in_game/mmd/Meibiwusi.png",
                    mmdCharacter.Meibiwusi,
                    isNeed29Active,
                    resourceLevel.Green,
                ],
            ],
            [
                [
                    "./resource/ui/not_in_game/mmd/Miku1.png",
                    mmdCharacter.Miku1,
                    isNeed29Active,
                    resourceLevel.White,
                ],
                [
                    "./resource/ui/not_in_game/mmd/Vanilla.png",
                    mmdCharacter.Vanilla,
                    isNeed29Active,
                    resourceLevel.White,
                ],
                [
                    "./resource/ui/not_in_game/mmd/Moye.png",
                    mmdCharacter.Moye,
                    isNeed29Active,
                    resourceLevel.White,
                ],
            ],
        ].map(data => {
            return data.filter((d: [string, mmdCharacter, boolean, resourceLevel]) => {
                return allMMDData.filter(d2 => {
                    return d2[0] == d[1]
                }).length > 0 && isValid(d[1])
            })
        })
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
        if (pageIndex < _getAllPageMMDCharacters().length - 1) {
            return renderButtonImage(state => {
                setPageIndex(pageIndex => pageIndex + 1)

                return Promise.resolve(state)
            }, "./resource/ui/not_in_game/next.png", "next", false, NullableUtils.return_(getClickSmallSoundResourceId()))
        }

        return null
    }

    let _render = () => {
        return <>
            {_getAllPageMMDCharacters()[pageIndex].map(([src, mmdCharacter_, isNeedActive, resourceLevel], i) => {
                return _renderCharacter(src, mmdCharacter_, isNeedActive, resourceLevel, i)
            })
            }
        </>
    }

    // let _renderDebugButton = () => {
    //     return <Selector
    //         defaultValue={mmdCharacter.XiaHui}
    //         onChange={arr => {
    //             set(_select, arr, mmdCharacter.XiaHui, false)
    //         }}
    //         options={
    //             [
    //                 { value: mmdCharacter.Haku_QP, label: "Haku_QP" },
    //                 { value: mmdCharacter.XiaHui, label: "XiaHui" },
    //                 { value: mmdCharacter.Xiaye1, label: "Xiaye1" },
    //                 { value: mmdCharacter.Xiaye2, label: "Xiaye2" },
    //                 { value: mmdCharacter.Changee, label: "Changee" },
    //                 // { value: mmdCharacter.Luotianyi, label: "Luotianyi" },
    //                 { value: mmdCharacter.Meibiwusi, label: "Meibiwusi" },
    //                 { value: mmdCharacter.Miku1, label: "Miku1" },
    //                 { value: mmdCharacter.Moye, label: "Moye" },
    //                 { value: mmdCharacter.Nero, label: "Nero" },
    //                 { value: mmdCharacter.Vanilla, label: "Vanilla" },
    //             ]
    //         }
    //     />
    // }

    return <Layout className="select-charater-main"  >
        <Flex justify="center" align="center">
            <Title className="title">选择巨大娘</Title>
        </Flex>

        <Row justify="center" className="select">
            {/* {
                getIsDebug(readState()) ?
                    _renderDebugButton() : null
            } */}
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

export default SelectCharacter;
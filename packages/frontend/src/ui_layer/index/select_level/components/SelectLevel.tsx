import "./SelectLevel.scss"

import React, { useState, useEffect } from 'react';
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
import { getClickLargeSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage } from "../../../utils/ImageUtils";
import { getLevelNumber, getSceneChapter, isLittleRoad } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { getFinishDestroyedRate } from "../../../../scene3d_layer/script/scene/scene_city/manage/city1/giantess/Mission";
import { getData, isValid } from "../../../../scene3d_layer/script/LevelComplete";

let SelectLevel: React.FC = () => {
    let targetSceneData = useSelector<AppState>((state) => state.global.targetSceneData) as any

    // let [levelNumber, setLevelNumber] = useState(1)
    let [pageIndex, setPageIndex] = useState(0)
    let [data, setData] = useState(NullableUtils.getEmpty())
    let [isGetData, setIsData] = useState(false)

    let dispatch: AppDispatch = useDispatch()

    let _select = (sceneChapater, levelNumber) => {
        let state = readState()

        switch (sceneChapater) {
            case scene.Play:
                dispatch(setTargetScene({ scene: scene.Play, levelNumber: levelNumber }))

                if (isLittleRoad(state)) {
                    dispatch(setPage(page.SelectLittleMan))
                }
                else {
                    dispatch(setPage(page.SelectCharacter))
                }

                break
            case scene.Biwu:
                dispatch(setTargetScene({ scene: scene.Biwu, levelNumber: levelNumber }))
                dispatch(setPage(page.BiwuSetting))
                break
            default:
                throw new Error("err")
        }
    }

    // let _getTask = () => {
    //     let state = readState()

    //     let sceneData = NullableUtils.getExn<sceneData>(targetSceneData)
    //     switch (sceneData.scene) {
    //         case scene.Play:
    //             if (isLittleRoad(state)) {
    //                 return "推倒巨大娘"
    //             }

    //             return `建筑破坏率达成${getFinishDestroyedRate(state)}%`
    //         case scene.Biwu:
    //             switch (levelNumber) {
    //                 case 1:
    //                     return "击败巨大娘"
    //                 case 2:
    //                     return "击败巨大娘的脚"
    //                 default:
    //                     throw new Error("err")
    //             }
    //         default:
    //             throw new Error("err")
    //     }
    // }

    let _getAllData = (data): Array<[scene, number, string, string, boolean]> => {
        let state = readState()

        let sceneData = NullableUtils.getExn<sceneData>(targetSceneData)

        return ([
            [
                scene.Play,
                1,
                isLittleRoad(state) ? "推倒巨大娘" : `建筑破坏率达成${getFinishDestroyedRate(state)}%`,
                "./resource/ui/not_in_game/chapter/play/level/level1.png",
            ],
            [
                scene.Biwu,
                1,
                "推倒巨大娘",
                "./resource/ui/not_in_game/chapter/biwu/level/level1.png",
            ],
            [
                scene.Biwu,
                2,
                "推倒脚",
                "./resource/ui/not_in_game/chapter/biwu/level/level2.png",
            ],
            [
                scene.Biwu,
                3,
                "推倒胸部",
                "./resource/ui/not_in_game/chapter/biwu/level/level3.png",
            ],
        ] as Array<[scene, number, string, string]>).filter(d => {
            return d[0] == sceneData.scene
        })
            // .filter(d => {
            //     return isValid(data, d[0], d[1])
            // })
            .map(d => {
                return [...d, isValid(data, d[0], d[1])]
            })
    }

    let _renderSingleLevel = ([sceneChapater, levelNumber, title, imageSrc, isValid]) => {
        return <Col className="col" span={12}>
            <Row justify="center" >
                <Row justify="center" className="title_container">
                    <Title className="level1" >关卡{levelNumber}</Title>
                </Row>
                <Row justify="center" className="title_container">
                    <Title className="level2" >目标：{title}</Title>
                </Row>
            </Row>

            {
                Device.isMobile() && isValid ? renderButtonImage(state => {
                    _select(sceneChapater, levelNumber)

                    return Promise.resolve(state)
                }, imageSrc, "", false, NullableUtils.return_(getClickLargeSoundResourceId()))
                    : renderImage(imageSrc)
            }

            <Row justify="center" className="lock">
                {
                    !isValid ? renderImage("./resource/ui/not_in_game/lock.png", "", false) : null
                }
            </Row>

            <Row justify="center" className="button">
                {
                    isValid ? renderButton(state => {
                        _select(sceneChapater, levelNumber)

                        return Promise.resolve(state)
                    }, "enter", "进入", "tab", getClickLargeSoundResourceId())
                        : null
                }
            </Row>
        </Col>
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
        if (pageIndex < _getAllData(data).length - 1) {
            return renderButtonImage(state => {
                setPageIndex(pageIndex => pageIndex + 1)

                return Promise.resolve(state)
            }, "./resource/ui/not_in_game/next.png", "next", false, NullableUtils.return_(getClickSmallSoundResourceId()))
        }

        return null
    }


    let _render = () => {
        return <>
            {_renderSingleLevel(_getAllData(data)[pageIndex])}
        </>
    }

    useEffect(() => {
        getData().then(data => {
            setData(_ => data)
            setIsData(_ => true)
        })
    }, []);

    return <Layout className="select-level-main"  >
        <Flex justify="center" align="center">
            <Title className="title">选择关卡</Title>
        </Flex>

        {
            !isGetData ? null :
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
        }
    </Layout >
};

export default SelectLevel;
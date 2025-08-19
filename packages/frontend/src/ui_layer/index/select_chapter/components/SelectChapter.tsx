import "./SelectChapter.scss"

import React, { useState } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { renderButton, renderImage as renderButtonImage } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId } from "../../../../business_layer/Loader";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage } from "../../../utils/ImageUtils";

let SelectChapter: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    let _selectPlay = (state) => {
        // state = setSceneChapter(state, scene.Play)

        // writeState(state)

        dispatch(setTargetScene({ scene: scene.Play, levelNumber: -1 }))
        dispatch(setPage(page.SelectRoad))

        return state
    }

    let _selectBiwu = (state) => {
        // state = setSceneChapter(state, scene.Biwu)

        // writeState(state)

        dispatch(setTargetScene({ scene: scene.Biwu, levelNumber: -1 }))

        dispatch(setPage(page.SelectLevel))

        return state
    }

    let _back = () => {
        dispatch(setPage(page.IndexMain))
    }


    return <Layout className="select-chapter-main"  >
        <Flex justify="center" align="center">
            <Title className="title">选择章节</Title>
        </Flex>

        <Row justify="center" className="select">
            <Col className="col" span={12}>
                <Row justify="center" >
                    <Row justify="center" className="title_container status">
                        <Col className="col" span={12}>
                            <Title className="level1" >比武</Title>
                        </Col>
                        <Col className="col" span={12}>
                            {
                                renderImage("./resource/ui/not_in_game/new.png", "", false)
                            }
                        </Col>
                    </Row>
                    <Row justify="center" className="title_container">
                        <Title className="level2" >Boss战，战胜巨大娘</Title>
                    </Row>
                </Row>

                {
                    Device.isMobile() ? renderButtonImage(state => {
                        return Promise.resolve(_selectBiwu(state))
                    }, "./resource/ui/not_in_game/chapter/biwu/chapter_biwu.png", "", false, NullableUtils.return_(getClickLargeSoundResourceId()))
                        : renderImage("./resource/ui/not_in_game/chapter/biwu/chapter_biwu.png")
                }

                <Row justify="center" className="button">
                    {
                        renderButton(state => {
                            return Promise.resolve(_selectBiwu(state))
                        }, "enter", "进入", "tab", getClickLargeSoundResourceId())
                    }
                    {/* {
                        renderButton(state => {
                            _back()

                            return Promise.resolve(state)
                        }, "back", "返回", "tab", getClickLargeSoundResourceId(), "default")
                    } */}
                </Row>
            </Col>

            <Col className="col" span={12}>
                <Row justify="center" >
                    <Row justify="center" className="title_container">
                        <Title className="level1" >巨大娘的玩耍</Title>
                    </Row>
                    <Row justify="center" className="title_container">
                        <Title className="level2" >扮演巨大娘或者小人</Title>
                    </Row>
                </Row>

                {
                    Device.isMobile() ? renderButtonImage(state => {
                        return Promise.resolve(_selectPlay(state))
                    }, "./resource/ui/not_in_game/chapter/play/chapter_play.png", "", false, NullableUtils.return_(getClickLargeSoundResourceId()))
                        : renderImage("./resource/ui/not_in_game/chapter/play/chapter_play.png")
                }

                <Row justify="center" className="button">
                    {
                        renderButton(state => {
                            return Promise.resolve(_selectPlay(state))
                        }, "enter", "进入", "tab", getClickLargeSoundResourceId())
                    }
                    {/* {
                        renderButton(state => {
                            _back()

                            return Promise.resolve(state)
                        }, "back", "返回", "tab", getClickLargeSoundResourceId(), "default")
                    } */}
                </Row>
            </Col>

        </Row>
    </Layout >
};

export default SelectChapter;
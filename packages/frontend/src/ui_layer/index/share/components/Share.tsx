import "./Share.scss"

import React, { useState } from 'react';
import { Col, Flex, Layout, Row } from 'antd';
import { Card, Selector, Switch } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content } from "antd/es/layout/layout";
import { renderButton } from "../../../utils/ButtonUtils";
import { getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import Text from 'antd/es/typography/Text';
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage } from "../../../utils/ImageUtils";

let Share: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    return <Layout className="share-main"  >
        <Flex justify="center" align="center">
            <Title className="title">分享给好友</Title>
        </Flex>

        <Row justify="center">
            <Title className="level1">分享给好友，微信扫码进入游戏~</Title>
        </Row>
        <Row justify="center">
            <Col className="col" span={12}>
                {
                    renderImage("./resource/ui/not_in_game/code_text.png", "", false)
                }
            </Col>
        </Row>

        <Row justify="center">
            {
                renderButton(state => {
                    dispatch(setPage(page.IndexMain))

                    return Promise.resolve(state)
                }, "back", "返回", "", getClickSmallSoundResourceId())
            }
        </Row>
    </Layout >
};

export default Share;
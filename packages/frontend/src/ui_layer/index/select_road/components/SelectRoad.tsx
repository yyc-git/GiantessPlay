import "./SelectRoad.scss"

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
import { road } from "meta3d-jiehuo-abstract/src/type/StateType";

let SelectRoad: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    let _selectLittleMan = (state) => {
        state = writeState(CityScene3D.setRoad(state, road.LittleMan))

        dispatch(setPage(page.LittleManSetting))

        return state
    }

    let _selectGiantess = (state) => {
        state = writeState(CityScene3D.setRoad(state, road.Giantess))

        dispatch(setPage(page.GiantessSetting))

        return state
    }

    return <Layout className="select-road-main"  >
        <Flex justify="center" align="center">
            <Title className="title">选择路线</Title>
        </Flex>

        <Row justify="center" className="select">
            <Col className="col" span={12}>
                {
                    renderButton(state => {
                        state = _selectLittleMan(state)

                        return Promise.resolve(state)
                    }, "little_man", "小人路线", "little_man", getClickLargeSoundResourceId(), "default")
                }
            </Col>
            <Col className="col" span={12}>
                {
                    renderButton(state => {
                        state = _selectGiantess(state)

                        return Promise.resolve(state)
                    }, "giantess", "巨大娘路线", "giantess", getClickLargeSoundResourceId(), "primary")
                }
            </Col>
        </Row>


        <Row justify="center" className="select">
            <Col className="col" span={12}>
                {
                    renderButton(state => {
                        dispatch(setPage(page.SelectChapter))

                        return Promise.resolve(state)
                    }, "back", "返回", "tab", getClickLargeSoundResourceId(), "default")
                }
            </Col>
        </Row>
    </Layout >
};

export default SelectRoad;
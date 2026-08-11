import "./SelectLevel.scss"

import React, { useState, useEffect } from 'react';
import { Input, Button, Col, Flex, Image, Layout, Row, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { getAbstractState, readState, writeState } from "../../../../business_layer/State";
import Title from "antd/es/typography/Title";
import Text from 'antd/es/typography/Text';
import { renderButton, renderImage as renderButtonImage } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId } from "../../../../business_layer/Loader";
import { getLanguageTextData, languageKey } from "../../../../scene3d_layer/internation/Data";
// import { Input } from "antd-mobile";
// import { checkPassword, isLoginSuccess } from "backend-cloudbase";
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import { clearAndRegisterSceneAllMods, getSceneData } from "../../../../scene3d_layer/mod/SceneMod";
import { deferSwitchPageForGetNewestState, deferSwitchPageForGetNewestStateMultiple } from "../../../utils/SwitchPageUtils";

let SelectLevel: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    return <Layout className="select-level-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.SelectLevelTitle)}</Title>
        </Flex>

        {
            getSceneData(readState()).map(([scene, name]) => {
                return <Row justify="center" className="row" >
                    {
                        renderButton(state => {
                            return clearAndRegisterSceneAllMods(state, scene).then(state => {
                                deferSwitchPageForGetNewestStateMultiple(dispatch, [
                                    setTargetScene({ scene: scene, levelNumber: 1 }),
                                    setPage(page.Difficulty)
                                ])

                                return state
                            })
                        }, "level", name, "button", getClickLargeSoundResourceId())
                    }
                </Row>
            })
        }
    </Layout >
};

export default SelectLevel;
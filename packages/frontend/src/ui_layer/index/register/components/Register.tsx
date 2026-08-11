import "./Register.scss"

import React, { useState } from 'react';
import { Input, Button, Col, Flex, Image, Layout, Row, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { getAbstractState, readState, writeState } from "../../../../business_layer/State";
import Title from "antd/es/typography/Title";
import Text from 'antd/es/typography/Text';
import { renderButton, renderImage as renderButtonImage } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId } from "../../../../business_layer/Loader";
import { getLanguageTextData, languageKey } from "../../../../scene3d_layer/internation/Data";
import * as Backend from "backend/src/Main";
import { setCharacter, setPage } from "../../../global/store/GlobalStore";
import { page } from "../../../global/store/GlobalStoreType";
import { clearData, getBackendData } from "../../../utils/BackendUtils";
import { deferSwitchPageForGetNewestState } from "../../../utils/SwitchPageUtils";
import { setIsLogin, setRegisterTime } from "../../../../scene3d_layer/script/scene/scene_city/User";

let Register: React.FC = () => {
    let [account, setAccount] = useState("")
    let [password, setPassword] = useState("")
    let [message, setMessage] = useState("")

    let dispatch: AppDispatch = useDispatch()

    return <Layout className="register-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.RegisterTitle)}</Title>
        </Flex>

        <Row justify="center" >
            <Col className="col" span={4}>
                <Text className="text" >{getLanguageTextData(readState(), languageKey.Account)}</Text>
            </Col>
            <Col className="col" span={10}>
                <Input onChange={(e) => {
                    setAccount(_ => e.target.value)
                }} />
            </Col>
            <Col className="col" span={10}>
                <Text className="text" >{message}</Text>
            </Col>
        </Row>
        <Row justify="center" >
            <Col className="col" span={4}>
                <Text className="text" >{getLanguageTextData(readState(), languageKey.Password)}</Text>
            </Col>
            <Col className="col" span={10}>
                <Input type="password" onChange={(e) => {
                    setPassword(_ => e.target.value)
                }} />
            </Col>
            <Col className="col" span={10}>
                {/* <Text className="text" >{message}</Text> */}
            </Col>
        </Row>


        <Row justify="center" className="button">
            {
                renderButton(state => {
                    Backend.markLocal(false)

                    return Backend.checkUserName(account).then(isNotHasData => {
                        if (!isNotHasData) {
                            setMessage(_ => "已存在(Already Exist)")
                            return state
                        }

                        return Backend.registerUser(account, password).then(_ => {
                            return Backend.setLoginedUserName(account).then(_ => {
                                state = clearData(state, (character) => dispatch(setCharacter(character)))

                                return getBackendData(state, (character) => dispatch(setCharacter(character))).then(state => {
                                    // dispatch(setPage(page.IndexMain))

                                    state = setIsLogin(state, true)

                                    return setRegisterTime(state)
                                }).then(state => {
                                    deferSwitchPageForGetNewestState(dispatch, setPage(page.IndexMain))

                                    return state
                                })
                            })
                        })
                    })
                }, "register", getLanguageTextData(readState(), languageKey.Register), "register", getClickLargeSoundResourceId())
            }
        </Row>
    </Layout >
};

export default Register;
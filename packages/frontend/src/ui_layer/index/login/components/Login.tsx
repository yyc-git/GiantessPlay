import "./Login.scss"

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
import { setCharacter, setPage } from "../../../global/store/GlobalStore";
import { page } from "../../../global/store/GlobalStoreType";
import * as Backend from "backend/src/Main";
import { hideCanvas } from "../../../utils/CanvasUtils";
import { clearData, getBackendData } from "../../../utils/BackendUtils";
import { deferSwitchPageForGetNewestState } from "../../../utils/SwitchPageUtils";
import { isTestUser } from "../../../../business_layer/User";
import { setIsDebug } from "../../../../business_layer/Scene3D";
import { setIsLogin } from "../../../../scene3d_layer/script/scene/scene_city/User";

let Login: React.FC = () => {
    let [account, setAccount] = useState("")
    let [password, setPassword] = useState("")
    let [message, setMessage] = useState("")

    let dispatch: AppDispatch = useDispatch()

    let _finish = (state, account) => {
        return Backend.setLoginedUserName(account).then(_ => {
            state = clearData(state, (character) => dispatch(setCharacter(character)))

            return getBackendData(state, (character) => dispatch(setCharacter(character))).then(state => {
                deferSwitchPageForGetNewestState(dispatch, setPage(page.IndexMain))
                // dispatch(setPage(page.IndexMain))

                if (isTestUser(account)) {
                    state = setIsDebug(state, true)
                }

                state = setIsLogin(state, account != Backend.buildVisitorUserName())

                return state
            })
        })
    }

    useEffect(() => {
        hideCanvas()
    }, []);

    return <Layout className="login-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.LoginTitle)}</Title>
        </Flex>

        <Row justify="center" className="button">
            {
                renderButton(state => {
                    Backend.markLocal(true)

                    return _finish(state, Backend.buildVisitorUserName())
                }, "visitor", getLanguageTextData(readState(), languageKey.Visitor), "visitor", getClickLargeSoundResourceId())
            }
        </Row>

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

                    return Backend.isLoginSuccess(account).then(([isSuccess, msg]) => {
                        if (isSuccess) {
                            return Backend.checkPassword(account, password).then(isNotHas => {
                                if (isNotHas) {
                                    setMessage(_ => "密码错误（Password is wrong）")

                                    return state
                                }

                                return _finish(state, account)
                            })
                        }

                        setMessage(_ => msg)

                        return state
                    })
                }, "login", getLanguageTextData(readState(), languageKey.Login), "login", getClickLargeSoundResourceId())
            }
            {
                renderButton(state => {
                    dispatch(setPage(page.Register))

                    return Promise.resolve(state)
                }, "register", getLanguageTextData(readState(), languageKey.Register), "Register", getClickLargeSoundResourceId(), "default")
            }
        </Row>
    </Layout >
};

export default Login;
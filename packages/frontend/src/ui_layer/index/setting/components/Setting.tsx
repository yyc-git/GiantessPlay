import "./Setting.scss"

import React, { useState } from 'react';
import { Col, Flex, Layout, Row } from 'antd';
import { Card, Selector, SideBar, Switch } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { getAbstractState, readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content } from "antd/es/layout/layout";
import { renderButton } from "../../../utils/ButtonUtils";
import { getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import Text from 'antd/es/typography/Text';
import { set } from "../../../utils/SettingUtils";
import { buildAPI, getAllBlockServiceFuncWithDefault } from "../../../../scene3d_layer/mod/Mod";
import { modProtocolName } from "../../../../scene3d_layer/mod/data/ModData";
import { service, uiType } from "setting-protocol/src/service/ServiceType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getLanguageTextData, languageKey } from "../../../../scene3d_layer/internation/Data";
import { updateBackend } from "../../../../scene3d_layer/mod/SettingMod";
import { getModAPI } from "../../../../scene3d_layer/script/scene/scene_city/Mod";

let Setting: React.FC = () => {
    let [currentSettingType, setCurrentSettingType] = useState(getAllBlockServiceFuncWithDefault<service>(readState(), service => service.getSettingType(getModAPI(readState())), modProtocolName.SettingProtocol, [])[0])

    let dispatch: AppDispatch = useDispatch()


    let _renderSettingTypes = () => {
        let state = readState()

        let settingTypes = getAllBlockServiceFuncWithDefault<service>(state, service => service.getSettingType(getModAPI(state)), modProtocolName.SettingProtocol, [])

        return <Row justify="start" className="">
            {
                settingTypes.map((settingType) => {
                    return <SideBar
                        activeKey={currentSettingType}
                        className="side_bar"
                        onChange={key => {
                            setCurrentSettingType(_ => key)
                        }}
                    >
                        <SideBar.Item key={settingType} title={settingType} />
                    </SideBar>

                })
            }
        </Row>
    }

    let _render = (state, [getDefaultSettingFunc, getSettingFunc, setSettingKeyFunc], { options, key, type, uncheckedText, checkedText }) => {
        let api = getModAPI(state)

        switch (type) {
            case uiType.Selector:
                return <Selector
                    key={key}
                    defaultValue={String(getSettingFunc(api, state)[key])}
                    onChange={arr => {
                        set((state, value) => {
                            return setSettingKeyFunc(api, state, key, value)
                        }, arr, getDefaultSettingFunc(api)[key])
                    }}
                    options={options}
                />
            case uiType.Switch:
                return <Switch
                    key={key}
                    defaultChecked={getSettingFunc(api, state)[key]}
                    uncheckedText={uncheckedText} checkedText={checkedText}
                    onChange={value => {
                        writeState(setSettingKeyFunc(api, state, key, value))
                    }}
                />
            default:
                throw new Error("err")
        }
    }

    let _renderSettingItems = () => {
        let state = readState()

        let [allUIData, _, getDefaultSetting, getSetting, setSettingKey] = NullableUtils.getExn(getAllBlockServiceFuncWithDefault<service>(state, service => [[service.getUIData(getModAPI(state)), service.getSettingType(getModAPI(state)), service.getDefaultSetting, service.getSetting, service.setSettingKey]], modProtocolName.SettingProtocol, []).find(([_, settingType]) => settingType == currentSettingType))

        return allUIData.map(uiData => {
            return <Row justify="center">
                <Text>{`${uiData.name}：`}</Text>
                {
                    _render(state, [getDefaultSetting, getSetting, setSettingKey], uiData)
                }
            </Row>
        })
    }

    return <Layout className="setting-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.SettingTitle)}</Title>
        </Flex>


        <Row justify="center" className="row" >
            <Col className="" span={6} justify="center">
                {
                    _renderSettingTypes()
                }
            </Col>
            <Col className="col"
                span={18} justify="start">
                {
                    _renderSettingItems()
                }
            </Col>
        </Row>

        <Row justify="center">
            {
                renderButton(state => {
                    return updateBackend(state).then(state => {
                        dispatch(setPage(page.IndexMain))

                        return state
                    })
                }, "back", getLanguageTextData(readState(), languageKey.BackToIndex), "", getClickSmallSoundResourceId())
            }
        </Row>
    </Layout >
};

export default Setting;
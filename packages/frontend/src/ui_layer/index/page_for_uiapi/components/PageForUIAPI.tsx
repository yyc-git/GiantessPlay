import "./PageForUIAPI.scss"

import React, { useState, useEffect } from 'react';
import { Col, Flex, Layout, Row } from 'antd';
import { Card, Modal, Selector, SideBar, Switch } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../business_layer/State";
import Title from "antd/es/typography/Title";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { uiData } from "../../scene/store/SceneStoreType";
import { handleCloseModal, handleOpenModal } from "../../../utils/ModalUtils";
import { handleEventHandler } from "../../../utils/ErrorUtils";
import { buildAPI } from "../../../../scene3d_layer/mod/Mod";
import Text from 'antd/es/typography/Text';
import { uiDataItem, uiType } from "./Type";
import { setPromise } from "../../../utils/SettingUtils";
import { renderButton } from "../../../utils/ButtonUtils";
import { setUIData } from "../../scene/store/SceneStore";
import { buildDispatchFunc } from "../../../utils/PageForUIAPIUtils";
import { Camera } from "meta3d-jiehuo-abstract";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getModAPI } from "../../../../scene3d_layer/script/scene/scene_city/Mod";

let PageForUIAPI: React.FC = () => {
    let uiData = useSelector<AppState>((state) => state.scene.uiData) as uiData

    let dispatch: AppDispatch = useDispatch()

    let _buildDispatchFunc = () => {
        // return (data) => dispatch(setUIData(data))
        return buildDispatchFunc(dispatch)
    }

    let _renderItem = ({ name, type, text, selector, selectorImage, handlerFunc }: uiDataItem) => {
        let api = getModAPI(readState())

        switch (type) {
            case uiType.Text:
                return <>
                    <Text>{name}</Text>
                    <Text>{text.getTextFunc(api, readState())}</Text>
                </>
            case uiType.Selector:
                return <>
                    <Text>{name}</Text>
                    <Selector
                        key={name}
                        defaultValue={selector.getDefaultValueFunc(api, readState())}
                        onChange={handleEventHandler(arr => {
                            return setPromise(readState(), (value) => {
                                return handlerFunc(api,
                                    _buildDispatchFunc(),
                                    value)
                            }, arr, selector.getDefaultValueFunc, false)
                        })}
                        options={selector.options}
                    />
                </>
            case uiType.SelectorImage:
                return <>
                    <Text>{name}</Text>
                    <Selector
                        key={name}
                        defaultValue={selectorImage.getDefaultValueFunc(api, readState())}
                        onChange={handleEventHandler(arr => {
                            return setPromise(readState(), (value) => {
                                return handlerFunc(api,
                                    _buildDispatchFunc(),
                                    value)
                            }, arr, selectorImage.getDefaultValueFunc, false)
                        })}
                        options={selectorImage.options.map(o => {
                            return {
                                value: o.value,
                                label: o.label ? o.label : <img src={o.imageSrc}
                                    style={{
                                        "width": o.imageWidth,
                                        "height": o.imageHeight,
                                    }}
                                />
                            }
                        })}
                    />
                </>
            case uiType.Button:
                return renderButton(state => {
                    writeState(state)

                    return handlerFunc(api,
                        _buildDispatchFunc(),
                        NullableUtils.getEmpty()).then(_ => {
                            return readState()
                        })
                }, name, name)
            default:
                throw new Error("err")
        }
    }

    let _render = (uiData) => {
        return <Layout className="content">
            {
                uiData.map(item => {
                    return <Row justify="center">
                        {
                            _renderItem(item)
                        }
                    </Row>
                })
            }
        </Layout>
    }

    return <Modal getContainer={LandscapeUtils.getRootDom()}
        visible={uiData.length > 0}
        className={"page-for-uiapi-main"}
        closeOnMaskClick={false}
        showCloseButton={false}

        // title={
        //     // <Title className="title">{getLanguageTextData(readState(), languageKey.PackageTitle)}</Title>
        // }
        content={
            _render(uiData)
        }
    />
};

export default PageForUIAPI;
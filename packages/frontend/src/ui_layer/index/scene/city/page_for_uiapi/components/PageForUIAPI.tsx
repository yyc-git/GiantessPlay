import "./PageForUIAPI.scss"

import React, { useState, useEffect } from 'react';
import { Col, Flex, Layout, Row } from 'antd';
import { Card, Modal, Selector, SideBar, Switch } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../../business_layer/State";
import Title from "antd/es/typography/Title";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { sceneUIData } from "../../../../scene/store/SceneStoreType";
import { closePageModal, handleCloseModal, handleOpenModal } from "../../../../../utils/ModalUtils";
import { handleEventHandler } from "../../../../../utils/ErrorUtils";
import { buildAPI } from "../../../../../../scene3d_layer/mod/Mod";
import Text from 'antd/es/typography/Text';
import { modalUIDataItem, text, uiDataItem, uiType } from "./Type";
import { setPromise } from "../../../../../utils/SettingUtils";
import { renderButton, renderButton5 } from "../../../../../utils/ButtonUtils";
import { buildDispatchFunc } from "../../../../../utils/PageForUIAPIUtils";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getClickLargeSoundResourceId } from "../../../../../../business_layer/Loader";
import { renderImageDom, renderImageDom2 } from "../../../../../utils/ImageUtils";
import { getModAPI } from "../../../../../../scene3d_layer/script/scene/scene_city/Mod";

let PageForUIAPI: React.FC = () => {
    let sceneUIData = useSelector<AppState>((state) => state.scene.sceneUIData) as sceneUIData

    let dispatch: AppDispatch = useDispatch()

    let _buildStyle = (data) => {
        let obj = {} as any

        NullableUtils.forEach(value => {
            obj.top = `${value}rem`
        }, data.top)
        NullableUtils.forEach(value => {
            obj.bottom = `${value}rem`
        }, data.bottom)
        NullableUtils.forEach(value => {
            obj.left = `${value}rem`
        }, data.left)
        NullableUtils.forEach(value => {
            obj.right = `${value}rem`
        }, data.right)

        return obj
    }


    let _renderModalItem = ({ type, name, selector, imageLabel, button, text, handlerFunc, }: modalUIDataItem) => {
        let api = getModAPI(readState())

        switch (type) {
            case uiType.Selector:
                return <>
                    <Text>{name}</Text>
                    <Selector
                        key={name}
                        defaultValue={selector.getDefaultValueFunc(api, readState())}
                        onChange={handleEventHandler(arr => {
                            return setPromise(readState(), (value) => {
                                return handlerFunc(api,
                                    dispatch,
                                    value)
                            }, arr, selector.getDefaultValueFunc, false)
                        })}
                        options={selector.options}
                    />
                </>
            case uiType.ImageLabel:
                return <>
                    {
                        renderImageDom2(imageLabel.image.src, imageLabel.image.style)
                    }
                    {
                        <Text style={imageLabel.text.style}>{imageLabel.text.text}</Text>
                    }
                </>
            case uiType.Button:
                return <>
                    {/* {
                        renderButton5(state => {
                            writeState(state)

                            return handlerFunc(api, dispatch, NullableUtils.getEmpty()).then(_ => {
                                return readState()
                            })
                        }, button.text, button.text,
                            "button",
                            _buildStyle(button), getClickLargeSoundResourceId())
                    } */}
                    {
                        renderButton(state => {
                            writeState(state)

                            return handlerFunc(api, dispatch, NullableUtils.getEmpty()).then(_ => {
                                return readState()
                            })
                        }, button.text, button.text
                        )
                    }
                </>
            case uiType.Text:
                return <>
                    <Text className="text" style={_buildStyle(text)}>{text.getTextFunc(api, readState())}</Text>
                </>
            default:
                throw new Error("err")
        }
    }

    let _renderItem = ({ type, name, text, button, modal, handlerFunc, }: uiDataItem) => {
        let api = getModAPI(readState())

        switch (type) {
            case uiType.Text:
                return <>
                    <Text className="text" style={_buildStyle(text)}>{text.getTextFunc(api, readState())}</Text>
                </>
            case uiType.Button:
                return <>
                    {
                        renderButton5(state => {
                            writeState(state)

                            return handlerFunc(api, dispatch, NullableUtils.getEmpty()).then(_ => {
                                return readState()
                            })
                        }, button.getTextFunc(api, readState()), button.getTextFunc(api, readState()),
                            "button",
                            _buildStyle(button), getClickLargeSoundResourceId())
                    }
                </>
            case uiType.Modal:
                return <>
                    <Modal getContainer={LandscapeUtils.getRootDom()}
                        visible={true}
                        className={"page-for-uiapi-modal-main"}
                        // closeOnMaskClick={true}
                        // showCloseButton={true}
                        closeOnMaskClick={false}
                        showCloseButton={false}
                        // afterShow={handleEventHandler(_ => {
                        //     writeState(handleOpenModal(readState()))
                        // })}
                        onClose={handleEventHandler(_ => {
                            closePageModal(modal.handlerCloseFunc).then(writeState)
                        })}

                        title={
                            <Title className="title">{name}</Title>
                        }
                        content={
                            <Layout className="content">
                                {
                                    modal.children.map(item => {
                                        return <Row justify="center">
                                            {
                                                _renderModalItem(item)
                                            }
                                        </Row>
                                    })
                                }
                            </Layout>
                        }
                    />
                </>
            default:
                throw new Error("err")
        }
    }

    let _render = (sceneUIData) => {
        return <Layout className="content">
            {
                sceneUIData.map(item => {
                    return _renderItem(item)
                })
            }
        </Layout>
    }

    return <Layout className="page-for-uiapi-main">
        {
            _render(sceneUIData)
        }
    </Layout>
};

export default PageForUIAPI;
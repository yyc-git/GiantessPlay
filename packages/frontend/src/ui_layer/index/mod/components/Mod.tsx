import "./Mod.scss"

import React, { useState, useEffect } from 'react';
import { Flex, Layout, Row } from 'antd';
import { Card, Checkbox, List, Selector, Switch } from 'antd-mobile';
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
import { info, getAllModInfo, dispose, registerBlockRemainOldBlockState, initAllBlocks } from "../../../../scene3d_layer/mod/Mod";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { deferSwitchPageForGetNewestState } from "../../../utils/SwitchPageUtils";
import { getLanguageTextData, languageKey } from "../../../../scene3d_layer/internation/Data";
import { NullableUtils } from "meta3d-jiehuo-abstract";
// import { info } from "block/src/BlockManagerType";

let Mod: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    let [selectedInfos, setSelectedInfos] = useState(getAllModInfo(readState()))

    // useEffect(() => {
    //     writeState(dispose(readState()))
    // }, []);

    return <Layout className="mod-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.ModTitle)}</Title>
        </Flex>

        <Row justify="center">
            <Title className="info">{getLanguageTextData(readState(), languageKey.ModInfo)}</Title>
        </Row>

        <Row justify="center">
            <List header='' className="">
                {
                    getAllModInfo(readState()).map(d => {
                        return <List.Item>
                            <Text className="">{`${d.title} ${d.category} ${d.version} by ${d.author}`}</Text>
                            <Checkbox defaultChecked={true} disabled={true}
                                onChange={(val) => {
                                    if (val) {
                                        setSelectedInfos(value => ArrayUtils.push(value, d))
                                    }
                                    else {
                                        setSelectedInfos(value => ArrayUtils.filter(value, data => data.title != d.title))
                                    }
                                }}
                            />
                        </List.Item>
                    })
                }
            </List>
        </Row>
        <Row justify="center">
            {
                renderButton(state => {
                    // return dispose(state, NullableUtils.getEmpty()).then(state => {
                    //     state = selectedInfos.reduce((state, selectedInfo: info) => {
                    //         return registerBlockRemainOldBlockState(state, selectedInfo.protocolName, selectedInfo.blockName, selectedInfo.getBlockService, selectedInfo.blockState)
                    //     }, state)

                    //     deferSwitchPageForGetNewestState(dispatch, setPage(page.IndexMain))

                    //     return initAllBlocks(state, NullableUtils.getEmpty())
                    // })

                    deferSwitchPageForGetNewestState(dispatch, setPage(page.IndexMain))

                    return Promise.resolve(state)
                    // }, "confirm", getLanguageTextData(readState(), languageKey.Confirm), "", getClickSmallSoundResourceId())
                }, "back", getLanguageTextData(readState(), languageKey.Back), "", getClickSmallSoundResourceId())
            }
        </Row>
    </Layout >
};

export default Mod;
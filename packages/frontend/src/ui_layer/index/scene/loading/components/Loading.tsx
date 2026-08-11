import "./Loading.scss"

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { Flex, Layout, Row } from 'antd';
import { AppState } from '../../../../store/AppStore';
import { Loading as Loading_ } from '../../../../utils/loading/components/Loading';
import { View } from 'meta3d-jiehuo-abstract';
import { getLanguageTextData, languageKey } from "../../../../../scene3d_layer/internation/Data";
import { readState } from "../../../../../business_layer/State";
import Text from 'antd/es/typography/Text';
import { getRandomTip } from "../../../../../business_layer/Tip";

export let Loading = () => {
    let isLoading = useSelector<AppState>((state) => state.loading.isLoading)
    let percent = useSelector<AppState>((state) => state.loading.percent)
    let tip = useSelector<AppState>((state) => state.loading.tip)

    return isLoading ? <Layout className="loading-main" >
        <Flex justify="center" align="center" className="div">
            <Loading_ description={getLanguageTextData(readState(), languageKey.SceneDescription)} percent={percent} />
        </Flex>

        <Row justify="center tip-row">
            <Text className={"tip"} >{tip}</Text>
        </Row>
        {/* <section
            style={
                {
                    "position": "absolute",
                    "top": "0px",
                    "left": `${View.getWidth() / 2 - 200}px`,
                    "backgroundColor": "transparent",
                    "zIndex": 10,
                }
            }
        >
            <Loading_ description="场景" percent={percent} />
        </section> */}
    </Layout> : null
};
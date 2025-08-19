import "./Loading.scss"

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { Flex, Layout, Row } from 'antd';
import { AppState } from '../../../../store/AppStore';
import { Loading as Loading_ } from '../../../../utils/loading/components/Loading';
import { View } from 'meta3d-jiehuo-abstract';

export let Loading = () => {
    let isLoading = useSelector<AppState>((state) => state.loading.isLoading)
    let percent = useSelector<AppState>((state) => state.loading.percent)

    return isLoading ? <Layout className="loading-main" >
        <Flex justify="center" align="center" className="div">
            <Loading_ description="场景" percent={percent} />
        </Flex>
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
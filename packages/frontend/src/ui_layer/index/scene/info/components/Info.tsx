import "./Info.scss"

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { Info as Info_ } from '../../../../utils/info/components/Info';
import { AppState } from '../../../../store/AppStore';
import { NullableUtils } from 'meta3d-jiehuo-abstract';
import { Flex, Layout } from "antd";

export let Info = () => {
    let info = useSelector<AppState>((state) => state.info.info)

    return NullableUtils.getWithDefault(NullableUtils.map(info => {
        return <Layout className="info-main" >
            <Flex justify="center" align="center" className="div">
                <Info_ info={info} />
            </Flex>
        </Layout>
    }, info), null)
};
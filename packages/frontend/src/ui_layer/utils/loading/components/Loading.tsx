import "./Loading.scss"

import React, { useState, useEffect } from 'react';
import { Row } from 'antd';
import Title from 'antd/es/typography/Title';

export let Loading = ({ description, percent }) => {
    return <Row width="100%" align="middle" style={{ "margin": "0 auto" }}>
        {/* <img src="./resource/image/png/logo.png" width="64px" height="64px" /> */}
        <img src="./resource/image/gif/loading.gif" width="100rem" height="100rem" />
        <Title className="title" style={{ "margin": "0" }}>{description + "加载中：" + percent.toString() + "%"}</Title>
    </Row >
};
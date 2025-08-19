import "./Info.scss"

import React, { useState, useEffect } from 'react';
import { Row } from 'antd';
import Title from 'antd/es/typography/Title';

export let Info = ({ info }) => {
    // return <Row width="100%" align="middle" style={{ "position": "absolute", "top": "0", "left": "0", "zIndex": "100", "backgroundColor": "white", "width": "100%" }}>
    return <Row width="100%" align="middle" style={{ "margin": "0 auto" }}>
        {/* <div style={{ "margin": "0 auto", "position": "relative" }}> */}
        {/* <img src="./resource/image/png/logo.png" width="64px" height="64px" /> */}
        {/* <img src="./resource/image/gif/loading.gif" width="100px" height="100ps" /> */}
        <img src="./resource/image/gif/loading.gif" width="100rem" height="100rem" />
        <Title className="title" style={{ "margin": "0" }}>{info}</Title>
        {/* </div> */}
    </Row >
};
import "./ActiveCode.scss"

import React, { useState, useEffect } from 'react';
import { Col, Flex, Input, Layout, Row, Space } from 'antd';
import { Card, Selector, Switch } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setPageData, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content } from "antd/es/layout/layout";
import { renderButton } from "../../../utils/ButtonUtils";
import { getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import Text from 'antd/es/typography/Text';
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage } from "../../../utils/ImageUtils";
import Link from "antd/es/typography/Link";
import { active29, active9, getActiveInfo, getGetActiveCodeData, is29Active, is9Active, is9ActiveSuccess, is29ActiveSuccess, handlePageData, get9ActiveCodeOutdateInfo, get29ActiveCodeOutdateInfo } from "../../../../scene3d_layer/script/ActiveCode";
import { NullableUtils } from "meta3d-jiehuo-abstract";

let ActiveCode: React.FC = () => {
    let [activeCode, setActiveCode] = useState("")
    let [isSuccess, setIsSuccess] = useState(false)
    let [activeInfo, setActiveInfo] = useState(NullableUtils.getEmpty())

    let pageData = useSelector<AppState>((state) => state.global.pageData)

    let dispatch: AppDispatch = useDispatch()

    let _getGetActiveCodeLink = () => {
        if (is9ActiveSuccess(activeInfo) || activeInfo == get9ActiveCodeOutdateInfo()) {
            return getGetActiveCodeData().getLink_9
        }
        else if (is29ActiveSuccess(activeInfo) || activeInfo == get29ActiveCodeOutdateInfo()) {
            return getGetActiveCodeData().getLink_29
        }

        // return getGetActiveCodeData().main
        return getGetActiveCodeData().getLink_29
    }

    useEffect(() => {
        getActiveInfo().then(info => {
            setActiveInfo(_ => NullableUtils.return_(info))
        })
    }, []);

    return <Layout className="active-code-main"  >
        <Flex justify="center" align="center">
            <Title className="title">输入激活码</Title>
        </Flex>

        {
            NullableUtils.isNullable(pageData) ? null :
                <Row justify="center">
                    <Title className="info_level1">{handlePageData(pageData)}</Title>
                </Row>
        }

        {
            !isSuccess ?
                <>
                    <Row justify="center">
                        <Space.Compact style={{ width: '100%' }}>
                            <Input placeholder="输入激活码" onChange={(e) => {
                                setActiveCode(_ => e.target.value)
                            }} />
                            {
                                renderButton(state => {
                                    if (activeCode.length > 0
                                        && is9Active(activeCode)
                                    ) {
                                        return active9(activeCode).then(_ => {
                                            setIsSuccess(_ => true)

                                            dispatch(setPageData("激活成功"))

                                            return state
                                        })
                                    }
                                    else if (activeCode.length > 0
                                        && is29Active(activeCode)
                                    ) {
                                        return active29(activeCode).then(_ => {
                                            setIsSuccess(_ => true)

                                            dispatch(setPageData("激活成功"))

                                            return state
                                        })
                                    }

                                    setIsSuccess(_ => false)

                                    dispatch(setPageData("激活码不正确，请重新输入"))

                                    return Promise.resolve(state)
                                }, "confirm", "确定", "", getClickSmallSoundResourceId())
                            }
                        </Space.Compact>
                    </Row>

                    <Row justify="center">
                        <Title className="level1">{`如未发电，请`}</Title>
                        <Link className="link_level1" href={getGetActiveCodeData().chargeLink_29} target="_blank">点我为作者发电</Link>
                    </Row>
                    <Row justify="center">
                        <Title className="level1">{`如已发电，请`}</Title>
                        <Link className="link_level1" href={_getGetActiveCodeLink()} target="_blank">点我获得最新激活码</Link>
                    </Row>
                </>
                : null
        }

        <Row justify="center">
            {
                renderButton(state => {
                    dispatch(setPage(page.IndexMain))

                    return Promise.resolve(state)
                }, "back", "返回", "", getClickSmallSoundResourceId())
            }
        </Row>
    </Layout >
};

export default ActiveCode;
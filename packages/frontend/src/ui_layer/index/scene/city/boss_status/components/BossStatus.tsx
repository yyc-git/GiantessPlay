import "./BossStatus.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import Text from "antd/es/typography/Text";
import { renderImage, renderImage2, renderImageDom } from "../../../../../utils/ImageUtils";
import { readState } from "../../../../../../scene3d_layer/state/State";
import { bossStateStatusData, bossStateStatusName } from "../../../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { getStatus } from "../../../../../../scene3d_layer/script/scene/scene_city/BossStateStatus";
import { Grid, Toast } from "antd-mobile";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { List } from "immutable";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { bossStatus } from "../../../store/SceneStoreType";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { isCloth } from "../../../../../../scene3d_layer/script/scene/scene_city/girl/Cloth";
import Title from "antd/es/typography/Title";
import { getLanguageTextData, languageKey } from "../../../../../../scene3d_layer/internation/Data";
import { getAimTarget } from "../../../../../../scene3d_layer/script/scene/scene_city/little_man/Shoot";
import { TupleUtils } from "meta3d-jiehuo-abstract";

let BossStatus: React.FC = () => {
    let _ = useSelector<AppState>((state) => state.scene.operateRandomValue)
    let bossStatus = useSelector<AppState>((state) => state.scene.bossStatus) as bossStatus

    // let _getImageSrc = (name: bossStateStatusName) => {
    //     switch (name) {
    //         case bossStateStatusName.ActiveBiggerNumber:
    //             return `./resource/ui/in_game/status/active.png`
    //         case bossStateStatusName.Hard:
    //             return `./resource/ui/in_game/status/hard.png`
    //         case bossStateStatusName.UnDamage:
    //             return `./resource/ui/in_game/status/undamage.png`
    //         default:
    //             throw new Error("err")
    //     }
    // }

    let _getItemClassName = (data: bossStateStatusData) => {
        if (data.isPositive) {
            return "positive"
        }

        return "negative"
    }

    let _getHpBarImageSrc = (bossStatus) => {
        return isCloth(bossStatus.target) ? "./resource/ui/in_game/bar_cloth.png" : "./resource/ui/in_game/bar_hp.png"
    }

    let _renderSingleBossStatus = (singleBossStatus) => {
        let state = readState()

        return <>
            <section className="boss-hp">
                <Row justify="center" className="row title_row">
                    <Col className="col" >
                        <Title className="title">{`${singleBossStatus.name.slice(0, 25)}`}</Title>
                        <Title className="title2">{`${singleBossStatus.target} ${singleBossStatus.height}${getLanguageTextData(readState(), languageKey.Meter)}`}</Title>
                    </Col>
                </Row>
                <Row justify="center" className="row hp_background_row">
                    <Col className="col" >
                        {
                            renderImage("./resource/ui/in_game/bar_background.png",
                                "bar_hp_background",
                                false
                            )
                        }

                    </Col>
                </Row>
                <Row justify="center" className="row hp_row">
                    <Col className="col" >
                        {
                            renderImage2(_getHpBarImageSrc(singleBossStatus),
                                "bar_hp",
                                singleBossStatus.hpStyle
                            )
                        }
                    </Col>
                </Row>

                <Row justify="center" className="row row_hp_number">
                    <Col className="col" >
                        <Title className="hp_number" >{`${singleBossStatus.hp}/${singleBossStatus.fullHp}`}</Title>
                    </Col>
                </Row>

            </section>

            <Grid className="boss-status" columns={10}>
                {
                    getStatus(state, singleBossStatus.usedGirl)
                        // List([
                        //     {
                        //         name: bossStateStatusName.ActiveBiggerNumber,
                        //         number: 999,
                        //         isPositive: true,
                        //         imageSrc: "",
                        //         description: "",
                        //     },
                        // ])
                        // .slice(0, 16).map(d => {
                        .slice(0, 10).map(d => {
                            return <Grid.Item>
                                <div className="item">
                                    {
                                        renderImageDom(d.imageSrc, `image ${_getItemClassName(d)}`, state => {
                                            Toast.show({
                                                content: d.description
                                            })

                                            return Promise.resolve(state)
                                        })
                                    }
                                    {
                                        NullableUtils.isNullable(d.number) ? null :
                                            <Text className="number" >
                                                {NullableUtils.getExn(d.number)}
                                            </Text>
                                    }
                                </div>
                            </Grid.Item>

                        })
                }
            </Grid>

        </>
    }

    let _renderMultipleBossStatus = (multipleBossStatus) => {
        let state = readState()

        let aimTargetUsedGirl = NullableUtils.bind((t) => {
            return NullableUtils.map(TupleUtils.getTuple2Last, t[3])
        }, getAimTarget(state))

        return <>
            {
                multipleBossStatus.map(singleBossStatus => {
                    let currentUsedGirlStyle = NullableUtils.getWithDefault(
                        NullableUtils.map(aimTargetUsedGirl => {
                            return aimTargetUsedGirl == singleBossStatus.usedGirl
                        }, aimTargetUsedGirl),
                        false) ? "highlight" : ""


                    return <>
                        <section className="boss-hp2">
                            <Row justify="center" className="row">
                                <Col className="col" span={9} >
                                {/* <Col className="col" span={8} > */}
                                    {/* <Title className="title">{`${singleBossStatus.name.slice(0, 25)}`}</Title> */}
                                    <Title className={`title2 ${currentUsedGirlStyle}`}>{`${singleBossStatus.name.slice(0, 12)}`}</Title>
                                </Col>
                                <Col className="col" span={6}>
                                    <Title className={`title2 ${currentUsedGirlStyle}`}>{`${singleBossStatus.target.slice(0, 4)} ${singleBossStatus.height}${getLanguageTextData(readState(), languageKey.Meter)}`}</Title>
                                </Col>

                                <Col className="col bar" span={9}>
                                    <div className="bar_hp_background_wraper">
                                        {
                                            renderImage("./resource/ui/in_game/bar_background.png",
                                                "bar_hp_background",
                                                false
                                            )
                                        }
                                    </div>
                                    <div className="bar_hp_wraper">
                                        {
                                            renderImage2(_getHpBarImageSrc(singleBossStatus),
                                                "bar_hp",
                                                singleBossStatus.hpStyle
                                            )
                                        }
                                    </div>
                                    <div className="hp_number_wraper">
                                        <Title className="hp_number" >{`${singleBossStatus.hp}/${singleBossStatus.fullHp}`}</Title>
                                    </div>
                                </Col>
                            </Row>

                        </section>

                        <Grid className="boss-status2" columns={12}>
                            {
                                getStatus(state, singleBossStatus.usedGirl)
                                    // List([
                                    //     {
                                    //         name: bossStateStatusName.ActiveBiggerNumber,
                                    //         number: 999,
                                    //         isPositive: true,
                                    //         imageSrc: "",
                                    //         description: "",
                                    //     },
                                    // ])
                                    // .slice(0, 16).map(d => {
                                    .slice(0, 12).map(d => {
                                        return <Grid.Item>
                                            <div className="item">
                                                {
                                                    renderImageDom(d.imageSrc, `image ${_getItemClassName(d)}`, state => {
                                                        Toast.show({
                                                            content: d.description
                                                        })

                                                        return Promise.resolve(state)
                                                    })
                                                }
                                                {
                                                    NullableUtils.isNullable(d.number) ? null :
                                                        <Text className="number" >
                                                            {NullableUtils.getExn(d.number)}
                                                        </Text>
                                                }
                                            </div>
                                        </Grid.Item>

                                    })
                            }
                        </Grid>

                    </>
                })
            }
        </>
    }

    let _render = () => {
        return <>
            {
                bossStatus.length == 0 ? null : (
                    bossStatus.length == 1 ? _renderSingleBossStatus(bossStatus[0]) : _renderMultipleBossStatus(bossStatus)
                )
            }
        </>

    }

    return <Layout className="boss-status-main">
        {_render()}
    </Layout >

};

export default BossStatus;
import "./PlayerStatus.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
// import { Button, Selector } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import Text from "antd/es/typography/Text";
import { renderImage, renderImage2, renderImageDom } from "../../../../../utils/ImageUtils";
import { readState } from "../../../../../../scene3d_layer/state/State";
import { playerStateStatusData, playerStateStatusName } from "../../../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { getStatus } from "../../../../../../scene3d_layer/script/scene/scene_city/PlayerStateStatus";
import { Grid, Toast } from "antd-mobile";
import { List } from "immutable";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";

let PlayerStatus: React.FC = () => {
    let _ = useSelector<AppState>((state) => state.scene.operateRandomValue)

    // let _getImageSrc = (name: playerStateStatusName) => {
    //     switch (name) {
    //         case playerStateStatusName.ActiveBiggerNumber:
    //             return `./resource/ui/in_game/status/active.png`
    //         case playerStateStatusName.PassiveBiggerAddedScaleNumber:
    //             return `./resource/ui/in_game/status/passive.png`
    //         case playerStateStatusName.OldSoldierNumber:
    //             return `./resource/ui/in_game/status/oldsoldier.png`
    //         case playerStateStatusName.ComboStormNumber:
    //             return `./resource/ui/in_game/status/combo.png`
    //         default:
    //             throw new Error("err")
    //     }
    // }

    let _getItemClassName = (data: playerStateStatusData) => {
        // let className = "item "
        // if (data.isPositive) {
        //     return className +"positive"
        // }

        // return className +"negative"

        if (data.isPositive) {
            return "positive"
        }

        return "negative"
    }

    let _render = () => {
        let state = readState()

        return <>
            {
                <Grid columns={6}>
                    {
                        getStatus(state)
                            // List([
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: true,
                            //         characterType: characterType.Both,
                            //     },
                            //     {
                            //         name: playerStateStatusName.ActiveBiggerNumber,
                            //         number: 999,
                            //         isPositive: false,
                            //         characterType: characterType.Both,
                            //     },
                            // ])
                            .slice(0, 18).map(d => {
                                return <Grid.Item>
                                    <div className="item">
                                        {
                                            renderImageDom(d.imageSrc, `image ${_getItemClassName(d)}`, state => {
                                                Toast.show({
                                                    content: d.description,
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
            }
        </>

    }

    return <Layout className="player-status-main">
        {_render()}
    </Layout >

};

export default PlayerStatus;
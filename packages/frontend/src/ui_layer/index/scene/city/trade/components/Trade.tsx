import "./Trade.scss"

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Button, Row, Col } from 'antd';
import { Card, Modal, Toast } from 'antd-mobile';
import { AppDispatch, AppState } from "../../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, writeState } from "../../../../../../business_layer/State";
import { setPage, setTargetScene } from "../../../../../global/store/GlobalStore";
import { page, scene } from "../../../../../global/store/GlobalStoreType";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { Camera } from "meta3d-jiehuo-abstract";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { setAbstractState } from "../../../../../../scene3d_layer/state/State";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { renderButton, renderButton2, renderButton3 } from "../../../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId, getClickSmallSoundResourceId } from "../../../../../../business_layer/Loader";
import { tradeData } from "../../../store/SceneStoreType";
import { renderImage, renderImageDom } from "../../../../../utils/ImageUtils";
import { getTotalCoin } from "../../../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getLevelCoin, setCoin, setTotalCoin } from "../../../../../../scene3d_layer/script/scene/scene_city/reward/Coin";
import { buyTrade, finishUse, getFreeBuyCount } from "../../../../../../scene3d_layer/script/scene/scene_city/Interaction";
import { tradeName } from "../../../../../../scene3d_layer/script/scene/scene_city/data/interaction/InteractionData";
import { handleCloseModal, handleOpenModal } from "../../../../../utils/ModalUtils";
import { setTradeData } from "../../../store/SceneStore";
import { deferSwitchPageForGetNewestState } from "../../../../../utils/SwitchPageUtils";
import { getBuyResourceId } from "../../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { getLanguageTextData, getLanguageTextVariableData, languageKey, languageVariableKey } from "../../../../../../scene3d_layer/internation/Data";

type data = {
    coin: number,
    selectedData: Record<tradeName, [number, boolean]>
}

let Trade: React.FC = () => {
    // let [isShowModal, setIsShowModal] = useState(false)
    // let [data, setData]: [data, (func: (data: data) => data) => void] = useState(
    //     {
    //         coin: getTotalCoin(readState()),
    //         selectedData: MutableRecordUtils.create()
    //     }
    // )
    let [data, setData]: [data, (func: (data: data) => data) => void] = useState(
        {
            coin: getTotalCoin(readState()),
            selectedData: MutableRecordUtils.create()
        }
    )
    // let [selectedData, setSelectedData] = useState(MutableRecordUtils.create())
    // let [freeBuyCount, setFreeBuyCount] = useState(getFreeBuyCount(readState()))

    let tradeData = useSelector<AppState>((state) => state.scene.tradeData) as tradeData

    let dispatch: AppDispatch = useDispatch()


    let _computeTotalTakeCoin = (state, selectedData) => {
        return getTotalCoin(state) - MutableRecordUtils.reduce(selectedData, (sum, [count, _], name) => {
            return sum + NullableUtils.getExn(tradeData.find(d => d[0] == name))[1] * count
        }, 0)
    }

    // let _updateTotalCoin = () => {
    //     setTotalCoin(_ => _computeTotalTakeCoin(readState()))
    // }

    let _getSelectedDataCount = (selectedData, tradeName) => {
        return NullableUtils.getWithDefault(
            NullableUtils.map(d => d[0], MutableRecordUtils.get(selectedData, tradeName)),
            0
        )
    }

    let _buy = (state, trade) => {
        state = setTotalCoin(state, data.coin)

        return buyTrade(state, trade)
    }

    let _handleClose = (state) => {
        // deferSwitchPageForGetNewestState(dispatch, setTradeData([]))
        dispatch(setTradeData([]))

        // setSelectedData(_ => MutableRecordUtils.create())
        // setData(_ => {
        //     return {
        //         coin: getTotalCoin(readState()),
        //         selectedData: MutableRecordUtils.create() as any
        //     }
        // })

        // let state = readState()
        state = finishUse(state)
        writeState(state)

        handleCloseModal()

        return readState()
    }


    useEffect(() => {
        setData(_ => {
            return {
                coin: getTotalCoin(readState()),
                selectedData: MutableRecordUtils.create() as any
            }
        })
    }, [tradeData]);

    return <Modal getContainer={LandscapeUtils.getRootDom()}
        visible={tradeData.length > 0}
        // visible={true}
        closeOnMaskClick={false}
        showCloseButton={false}
        // className={`trade-main ${buildModalClassName()}`}
        className={`trade-main`}
        title={
            // <Title level={1}>{"货物清单"}</Title>
            <Title className="title">{getLanguageTextData(readState(), languageKey.TradeTitle)}</Title>
        }
        content={
            <Layout className="content">
                <Row justify="center" className="button">
                    {/* <Col className="col" span={16}> */}
                    {
                        renderButton(state => {
                            let trade = (MutableRecordUtils.entries(data.selectedData) as Array<[tradeName, [number, boolean]]>).filter(d => d[1][0] > 0)

                            if (data.coin == getTotalCoin(state)) {
                                if (trade.length > getFreeBuyCount(state)) {
                                    // if (Camera.isCanLock(getAbstractState(state))) {
                                    //     state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
                                    // }

                                    // state = handleOpenModal(state)

                                    Modal.alert({
                                        content: getLanguageTextVariableData(readState(), languageVariableKey.ExceedBuyCount)(getFreeBuyCount(state)),
                                        confirmText: getLanguageTextData(readState(), languageKey.Confirm),
                                        onConfirm: () => {
                                            // handleCloseModal()

                                            // if (Camera.isCanLock(getAbstractState(state))) {
                                            //     state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
                                            // }

                                        },
                                    })

                                    return Promise.resolve(state)
                                }
                            }

                            return _buy(state, trade).then(_handleClose)
                        }, "buy", getLanguageTextData(readState(), languageKey.Buy), "buy", getBuyResourceId(), "primary")
                    }
                    {
                        renderButton(state => {
                            state = _handleClose(state)

                            return Promise.resolve(state)
                        }, "close", getLanguageTextData(readState(), languageKey.Close), "close", getClickSmallSoundResourceId(), "default")
                    }
                    {/* </Col>
                    <Col className="col" span={8}> */}
                    {renderImageDom("meta3d-jiehuo-abstract/particle/coin.png", "coin")}
                    <Text>{data.coin}</Text>
                    {/* </Col> */}
                </Row>

                <Row justify="center" className="row">
                    {
                        tradeData.map((d) => {
                            // [
                            //     [
                            //         tradeName.AddHp1,
                            //         10,
                            //         2,
                            //         "./resource/ui/in_game/little_man/package/water/ex1.png"
                            //     ],
                            //     [
                            //         tradeName.RocketBullet,
                            //         10,
                            //         2,
                            //         "./resource/ui/in_game/little_man/package/bullet/RocketBullet.png"
                            //     ],
                            //     [
                            //         tradeName.AddHp1,
                            //         10,
                            //         2,
                            //         "./resource/ui/in_game/little_man/package/water/ex1.png"
                            //     ],
                            //     [
                            //         tradeName.RocketBullet,
                            //         10,
                            //         2,
                            //         "./resource/ui/in_game/little_man/package/bullet/RocketBullet.png"
                            //     ],


                            //     [
                            //         tradeName.AddHp1,
                            //         10,
                            //         2,
                            //         "./resource/ui/in_game/little_man/package/water/ex1.png"
                            //     ],
                            // ].map((d) => {
                            return <Card
                                title={
                                    renderImageDom(d[3], "icon", state => {
                                        Toast.show({
                                            content: `${d[4]}：${d[5]}`
                                        })

                                        return Promise.resolve(state)
                                    })
                                }
                            >
                                <Row justify="center" className="row">
                                    <Col className="col" span={12}>
                                        {renderImageDom("meta3d-jiehuo-abstract/particle/coin.png", "coin")}
                                        <Text className="number">{d[1]}</Text>
                                    </Col>

                                    <Col className="col" span={12}>
                                        <Text
                                            className="selected_number"
                                        >{
                                                _getSelectedDataCount(
                                                    data.selectedData,
                                                    d[0])
                                            } / {
                                                d[2]
                                            }</Text>
                                    </Col>
                                </Row>

                                <Row justify="center" className="row">
                                    {/* <Col className="col" span={4}> */}
                                    {
                                        renderButton(state => {
                                            let selectedData =
                                                MutableRecordUtils.set(data.selectedData, d[0],
                                                    [
                                                        NumberUtils.greaterThan(
                                                            _getSelectedDataCount(
                                                                data.selectedData,
                                                                d[0]) - 1,
                                                            0
                                                        ),
                                                        d[6]
                                                    ]
                                                )

                                            setData(_ => {
                                                return {
                                                    selectedData: selectedData,
                                                    coin: _computeTotalTakeCoin(state, selectedData)
                                                }
                                            })

                                            return Promise.resolve(state)
                                        }, "sub", "-", "sub", getClickSmallSoundResourceId(), "default")
                                    }
                                    {
                                        renderButton3(state => {
                                            // if (data.coin < d[1] * 1
                                            //     || _getSelectedDataCount(
                                            //         data.selectedData,
                                            //         d[0]) + 1 > d[2]
                                            // ) {
                                            //     return Promise.resolve(state)
                                            // }

                                            let selectedData =
                                                MutableRecordUtils.set(data.selectedData, d[0],
                                                    [
                                                        NumberUtils.greaterThan(
                                                            _getSelectedDataCount(
                                                                data.selectedData,
                                                                d[0]) + 1,
                                                            0
                                                        ),
                                                        d[6]
                                                    ]
                                                )

                                            setData(_ => {
                                                return {
                                                    selectedData: selectedData,
                                                    coin: _computeTotalTakeCoin(state, selectedData)
                                                }
                                            })

                                            return Promise.resolve(state)
                                        },

                                            state => data.coin < d[1] * 1
                                                || _getSelectedDataCount(
                                                    data.selectedData,
                                                    d[0]) + 1 > d[2],
                                            "add", "+", "add", getClickSmallSoundResourceId(), "primary")
                                    }
                                    {
                                        renderButton3(state => {
                                            // if (data.coin < d[1] * d[2]
                                            //     // || _getSelectedDataCount(
                                            //     //     data.selectedData,
                                            //     //     d[0]) + d[2] > d[2]
                                            // ) {
                                            //     return Promise.resolve(state)
                                            // }

                                            let selectedData =
                                                MutableRecordUtils.set(data.selectedData, d[0],
                                                    // NumberUtils.greaterThan(
                                                    //     _getSelectedDataCount(
                                                    //         data.selectedData,
                                                    //         d[0]) + 1,
                                                    //     0
                                                    // )
                                                    [
                                                        d[2],
                                                        d[6]
                                                    ]
                                                )

                                            setData(_ => {
                                                return {
                                                    selectedData: selectedData,
                                                    coin: _computeTotalTakeCoin(state, selectedData)
                                                }
                                            })

                                            return Promise.resolve(state)
                                        },
                                            state => data.coin < d[1] * d[2],
                                            "all", getLanguageTextData(readState(), languageKey.All), "all", getClickSmallSoundResourceId(), "default")
                                    }
                                    {/* </Col> */}
                                    {/* 
                                    <Col className="col" span={16}>
                                        <Text
                                            className="number"
                                        >{
                                                _getSelectedDataCount(d[0])
                                            } / {
                                                d[2]
                                            }</Text>
                                    </Col> */}

                                </Row>
                            </Card>
                        })
                    }
                </Row>
            </Layout>
        }
    // onClose={_ => {
    //     let state = readState()
    //     state = finishUse(state)
    //     writeState(state)

    //     handleCloseModal()
    // }}
    >
    </Modal>
};

export default Trade;
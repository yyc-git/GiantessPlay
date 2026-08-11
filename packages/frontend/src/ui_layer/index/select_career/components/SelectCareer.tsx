import "./SelectCareer.scss"

import React, { useEffect, useState } from 'react';
import { Col, Flex, Layout, Row } from 'antd';
import { Card, Cascader, Modal, Selector, Switch, Tabs, Toast } from "antd-mobile";
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { getAbstractState, readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content } from "antd/es/layout/layout";
import { renderButton, renderButton3 } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId, getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import Text from 'antd/es/typography/Text';
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage, renderImageDom } from "../../../utils/ImageUtils";
import { getLanguageImageData, getLanguageTextData, getLanguageTextVariableData, languageImageKey, languageKey, languageVariableKey } from "../../../../scene3d_layer/internation/Data";
import * as Career from "../../../../scene3d_layer/script/scene/scene_city/build/Career";
import { convertToCareerFeatureData, getAllCareerData, isRandomCareer } from "../../../../scene3d_layer/mod/CareerMod";
import { handleEventHandler } from "../../../utils/ErrorUtils";
import { deferSwitchPageForGetNewestState } from "../../../utils/SwitchPageUtils";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { play } from "../../../../business_layer/Sound";
import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { getIsDebug } from "../../../../scene3d_layer/script/scene/Scene";
import { getSoundSetting } from "../../../../scene3d_layer/mod/SettingMod";
import { renderCard } from "../../../utils/CardUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { buildGenerateRandomCareerEventData, getGenerateGiantessRandomCareerEventName, getGenerateLittleManRandomCareerEventName } from "../../../../scene3d_layer/utils/EventUtils";
import { Scene } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { findCareerFeatureDataByName, getCareerFeatureData } from "../../../../scene3d_layer/script/scene/scene_city/data/build/CareerFeatureData";
import { getModAPI } from "../../../../scene3d_layer/script/scene/scene_city/Mod";
import { isCharacterType, isLittleCharacterType } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { List } from "immutable";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getTotalGem } from "../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { setGem } from "../../../../scene3d_layer/script/scene/scene_city/reward/Gem";
import { careerData } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";

let SelectCareer: React.FC = ({ characterType_, page }) => {
    // let [selectedCareerData, setSelectedCareerData] = useState([])
    let [selectedCareerData, setSelectedCareerData] = useState(List())
    let [allCareerData, setAllCareerData] = useState([])
    // let [allCareerData, setAllCareerData] = useState(getAllCareerData(readState(), characterType_))

    let dispatch: AppDispatch = useDispatch()

    let _isRandomCareer = (data: careerData) => {
        return data.name.toLocaleLowerCase().includes("random")
    }

    let _isDefaultCareer = (data: careerData) => {
        return data.name.toLocaleLowerCase().includes("default")
    }


    let _computeNeedGemBySelectedCareerCount = (data: careerData, count) => {
        if (_isDefaultCareer(data)) {
            return 0
        }

        switch (count) {
            case 0:
                // return data.needGem * 0.2
                if (_isRandomCareer(data)) {
                    return data.needGem
                }

                return 0
            case 1:
                // return data.needGem * 0.6 + 1000
                return data.needGem
            case 2:
            case 3:
                // return data.needGem * 1.5
                // return data.needGem * 0.6 + 5000
                return data.needGem + 3000
            default:
                throw new Error("err")
        }

    }

    let _computeNeedGem = (data: careerData) => {
        if (_isRandomCareer(data)) {
            return _computeNeedGemBySelectedCareerCount(data, 0)
        }

        return _computeNeedGemBySelectedCareerCount(data, selectedCareerData.count())
    }

    let _computeRemainGem = (state) => {
        let needGem = selectedCareerData.reduce((totalNeedGem, data, i) => {
            // return totalNeedGem + needGem * NumberUtils.greaterThan(i * 2, 1)
            // return totalNeedGem + needGem
            return totalNeedGem + _computeNeedGemBySelectedCareerCount(data, i)
        }, 0)


        // let count = selectedCareerData.count()

        // // if (count <= 1) {
        // //     // needGem *= 0.25
        // //     needGem *= 0.2
        // // }
        // // else {
        // //     // needGem *= 1 + 0.5 * (count - 1)
        // //     needGem *= 1 + 0.5 * (count - 1)
        // // }
        // switch (count) {
        //     case 0:
        //         needGem = 0
        //         break
        //     case 1:
        //         needGem *= 0.2
        //         break
        //     case 2:
        //         // needGem *= 0.5
        //         needGem *= 0.4
        //         break
        //     case 3:
        //         // needGem *= 1
        //         needGem *= 0.8
        //         break
        //     default:
        //         throw new Error("err")
        // }
        return getTotalGem(state) - Math.round(needGem)
    }

    let _renderTitle = () => {
        return <>
            <Row justify="center" align="middle">
                {
                    renderButton3(state => {
                        let remainGem = _computeRemainGem(state)

                        if (remainGem < 0) {
                            Modal.alert({
                                getContainer: LandscapeUtils.getRootDom(),
                                content: getLanguageTextData(readState(), languageKey.GemNotEnough),
                                confirmText: getLanguageTextData(readState(), languageKey.Confirm),
                            })

                            return Promise.resolve(state)
                        }

                        let needGem = getTotalGem(state) - remainGem

                        state = Career.setNeedGem(state, characterType_, needGem)

                        state = setGem(state, remainGem)

                        state = Career.setSelectedCareerData(state, characterType_, selectedCareerData.toArray())

                        return Career.saveAddedCareerNeedTotalGem(needGem).then(_ => {
                            deferSwitchPageForGetNewestState(
                                dispatch,
                                setPage(page)
                            )

                            return Promise.resolve(state)
                        })
                    },
                        state => {
                            return selectedCareerData.count() == 0
                        },
                        "confirm", getLanguageTextData(readState(), languageKey.Confirm), "button", getClickLargeSoundResourceId())
                }
                {
                    renderButton(state => {
                        setSelectedCareerData(_ => List())

                        return Promise.resolve(state)
                    }, "reset", getLanguageTextData(readState(), languageKey.Reset), "button", getClickSmallSoundResourceId())
                }
                {
                    renderButton(state => {
                        let eventName
                        if (isCharacterType(characterType_, characterType.LittleMan)) {
                            eventName = getGenerateLittleManRandomCareerEventName()
                        }
                        else {
                            eventName = getGenerateGiantessRandomCareerEventName()
                        }

                        return Event.trigger(state, getAbstractState, eventName, buildGenerateRandomCareerEventData(characterType_)).then(state => {
                            setAllCareerData(_ => getAllCareerData(state, characterType_))

                            return state
                        })
                    }, "generate_random", getLanguageTextData(readState(), languageKey.GenerateRandomCareer), "button", getClickSmallSoundResourceId())
                }
                <Text > {getLanguageTextData(readState(), languageKey.GemRemain)}:</Text>
                {renderImage("meta3d-jiehuo-abstract/particle/gem.png", "gem", false)}
                <Text>{_computeRemainGem(readState())}</Text>
            </Row>

            <Row justify="center" align="middle">
                <Text className="selected" >{
                    getLanguageTextVariableData(readState(), languageVariableKey.SelectedCareers)(selectedCareerData.reduce((str, data) => {
                        str += data.title
                        str += "+"
                        return str
                    }, "").slice(0, -1)
                    )
                }</Text>
            </Row>
        </>
    }

    let _renderBody = () => {
        let state = readState()

        return allCareerData.map(data => {
            // return <Col className="col card-col" span={6}>
            // return <Col className="col card-col" span={8}>
            return <Col className="col card-col" span={12}>
                {
                    renderCard(state => {
                        // setSelectedCareerData(d => ArrayUtils.push(d, data))
                        // setSelectedCareerData(d => [data])

                        if (isRandomCareer(state, data.name)) {
                            setSelectedCareerData(_ => List([data]))
                        }
                        else if (selectedCareerData.count() < 3
                            && NullableUtils.isNullable(selectedCareerData.find(d => d.name == data.name))
                            && NullableUtils.isNullable(selectedCareerData.find(d => isRandomCareer(state, d.name)))
                        ) {
                            setSelectedCareerData(d => d.push(data))
                        }
                        // state = setCareerData(state, characterType_, data)

                        // deferSwitchPageForGetNewestState(
                        //     dispatch,
                        //     setPage(page)
                        // )

                        return Promise.resolve(state)
                    },
                        <>
                            <Row justify="center">
                                {/* <Col className="col" span={6}>
                                    {
                                        renderImage(data.imageSrc, "icon", false)
                                    }
                                </Col> */}
                                {/* <Col className="col" span={18}> */}
                                <Col className="col" span={18}>
                                    <Title level={4} >{data.title}</Title>
                                </Col>
                                <Col className="col" span={6}>
                                    {renderImage("meta3d-jiehuo-abstract/particle/gem.png", "gem", false)}
                                    <Text>{_computeNeedGem(data)}</Text>
                                </Col>
                            </Row>
                        </>,
                        <>
                            {

                                // convertToCareerFeatureData(readState(), data).filter(([data, _]) => data.positive).reduce((result, [data, value]) => {
                                MutableRecordUtils.reduce(
                                    MutableRecordUtils.filter(
                                        convertToCareerFeatureData(readState(), data),
                                        ([data, _]) => data.positive
                                    ),
                                    (result, [data, value]) => {
                                        return ArrayUtils.push(
                                            result, data.getDescriptionFunc(state, value)
                                        )
                                    }, []
                                )
                                    // data.getPositiveDescriptionFunc(state)
                                    .map(str => {
                                        return <Row justify="center">
                                            <Text className="positive" >{str}</Text>
                                        </Row>
                                    })
                            }
                            {
                                // convertToCareerFeatureData(readState(), data).filter(([data, _]) => !data.positive).reduce((result, [data, value]) => {
                                //     return ArrayUtils.push(
                                //         result, data.getDescriptionFunc(state, value)
                                //     )
                                // }, [])
                                MutableRecordUtils.reduce(
                                    MutableRecordUtils.filter(
                                        convertToCareerFeatureData(readState(), data),
                                        ([data, _]) => !data.positive
                                    ),
                                    (result, [data, value]) => {
                                        return ArrayUtils.push(
                                            result, data.getDescriptionFunc(state, value)
                                        )
                                    }, []
                                )
                                    // data.getNegativeDescriptionFunc(state)
                                    .map(str => {
                                        return <Row justify="center">
                                            <Text className="negative" >{str}</Text>
                                        </Row>
                                    })
                            }
                        </>,
                        "card",
                        getClickMiddleSoundResourceId()
                    )
                }
                {/* <Card
                    className={"card"}
                    title={<>
                        <Row justify="center">
                            <Col className="col" span={6}>
                                {
                                    renderImage(data.imageSrc, "icon", false)
                                }
                            </Col>
                            <Col className="col" span={18}>
                                <Title level={4} >{data.title}</Title>
                            </Col>
                        </Row>
                    </>}
                    onClick={handleEventHandler(_ => {
                        let state = readState()

                        state = setCareerData(state, characterType_, data)

                        play(state, buildNeedToPlaySoundData(getClickMiddleSoundResourceId(), getIsDebug(state), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

                        writeState(state)

                        deferSwitchPageForGetNewestState(
                            dispatch,
                            setPage(page)
                        )
                    })}
                >
                    {
                        data.getPositiveDescriptionFunc(state).map(str => {
                            return <Row justify="center">
                                <Text className="positive" >{str}</Text>
                            </Row>
                        })
                    }
                    {
                        data.getNegativeDescriptionFunc(state).map(str => {
                            return <Row justify="center">
                                <Text className="negative" >{str}</Text>
                            </Row>
                        })
                    }
                </Card> */}
            </Col>
        })
    }

    useEffect(() => {

        let state = readState()
        let needGem, promise
        switch (characterType_) {
            case characterType.LittleMan:
                needGem = Career.getNeedGem(state, characterType.LittleMan) + Career.getNeedGem(state, characterType.Giantess)

                state = Career.setNeedGem(state, characterType.LittleMan, 0)
                state = Career.setNeedGem(state, characterType.Giantess, 0)

                promise = Career.saveCareerNeedTotalGem(0)
                break
            case characterType.Giantess:
                needGem = Career.getNeedGem(state, characterType.Giantess)

                state = Career.setNeedGem(state, characterType.Giantess, 0)

                promise = Career.saveCareerNeedTotalGem(Career.getNeedGem(state, characterType.LittleMan))
                break
        }

        promise.then(_ => {
            state = setGem(state, getTotalGem(state) + needGem)

            setAllCareerData(_ => getAllCareerData(state, characterType_))
            setSelectedCareerData(_ => List())

            writeState(state)
        })
    }, [characterType_]);


    return <Layout className="select-career-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{characterType_ == characterType.LittleMan ? getLanguageTextData(readState(), languageKey.SelectLittleManCareerTitle) : getLanguageTextData(readState(), languageKey.SelectGiantessCareerTitle)}</Title>
        </Flex>

        {/* <Row justify="center" className="title"> */}
        <section className="title">
            {_renderTitle()}
        </section>
        <Row justify="center" className="body">
            {_renderBody()}
        </Row>
    </Layout >
};

export default SelectCareer;
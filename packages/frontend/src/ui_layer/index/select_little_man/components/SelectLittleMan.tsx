import "./SelectLittleMan.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setCharacter, setPage } from "../../../global/store/GlobalStore";
import { page, scene, sceneData } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content } from "antd/es/layout/layout";
import { renderButton, renderImage as renderButtonImage } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId, getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import { renderImage } from "../../../utils/ImageUtils";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Device } from "meta3d-jiehuo-abstract";
// import { get29ActiveCodeOutdateInfo, getActiveInfo, getNoActiveCodeInfo, is29ActiveSuccess } from "../../../../scene3d_layer/script/ActiveCode";
import { Modal, Selector } from "antd-mobile";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { renderSwitch } from "../../../utils/SwitchUtils";
import { set } from "../../../utils/SettingUtils";
import { getIsDebug } from "../../../../scene3d_layer/script/scene/Scene";
import { resourceLevel } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { getModelData, getTextData, modelName } from "../../../../scene3d_layer/script/scene/scene_city/little_man_data/ModelData";
import { mmdCharacter } from "../../../../scene3d_layer/script/scene/scene_city/data/mmd/MMDData";
import { getCharacterDataFromBackend, getLittleManCharacters, markAliveAndUpdateBackend } from "../../../../scene3d_layer/script/scene/scene_city/character/Character";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { group } from "../../../utils/CharacterUtils";
import { resetTalentAndUpdateBackend } from "../../../../scene3d_layer/script/scene/scene_city/build/Talent";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { deferSwitchPageForGetNewestState } from "../../../utils/SwitchPageUtils";
import { renderCharacter } from "../../../utils/SelectCharacterUtils";
import { getLanguageDataByData, getLanguageTextData, languageKey } from "../../../../scene3d_layer/internation/Data";

let SelectLittleMan: React.FC = () => {
    let dispatch: AppDispatch = useDispatch()

    // let [pageMMDCharacters, setPageMMDCharacters] = useState([])
    let [pageIndex, setPageIndex] = useState(0)
    // let [activeInfo, setActiveInfo] = useState(NullableUtils.getEmpty())

    // let _renderCharacter = (isAlive, src, modelName, isNeedActive, resourceLevel, key) => {
    //     return <Col key={key} className="col" span={5}>
    //         {
    //             Device.isMobileByState(getAbstractState(state)) ? renderButtonImage(state => {
    //                 if (!isAlive) {
    //                     return Promise.resolve(state)
    //                 }

    //                 return _judgeAndSelect(state, modelName, isNeedActive)
    //             }, src, resourceLevel, false, NullableUtils.return_(getClickMiddleSoundResourceId()))
    //                 : renderImage(src, resourceLevel, true)
    //         }
    //         <Row justify="center" className="status">
    //             {
    //                 isNeedActive ?
    //                     (
    //                         _isShowOutdate(isNeedActive) ? renderImage("./resource/ui/not_in_game/outdate.png", "", false) : renderImage("./resource/ui/not_in_game/not_active.png", "", false)
    //                     )
    //                     : null
    //             }
    //         </Row>
    //         <Row justify="center" className="status">
    //             {
    //                 !isAlive ?
    //                     (
    //                         renderImage("./resource/ui/not_in_game/dead.png", "dead", false)
    //                     )
    //                     : null
    //             }
    //         </Row>
    //         <Row justify="center" className="button">
    //             {
    //                 isAlive ? renderButtonImage(state => {
    //                     return _judgeAndSelect(state, modelName, isNeedActive)
    //                 }, isNeedActive ? "./resource/ui/not_in_game/select-button-need-active.png" : "./resource/ui/not_in_game/select-button.png", "", false, NullableUtils.return_(getClickMiddleSoundResourceId())) :
    //                     renderButton(state => {
    //                         Modal.confirm({
    //                             getContainer: LandscapeUtils.getRootDom(),
    //                             content: '复活会清零角色天赋，是否复活？',
    //                             onConfirm: async () => {
    //                                 let state = readState()

    //                                 return resetTalentAndUpdateBackend(state, modelName).then(state => {
    //                                     return markAliveAndUpdateBackend(state, modelName, characterType.LittleMan)
    //                                 }).then(state => {
    //                                     return _judgeAndSelect(state, modelName, isNeedActive)
    //                                 }).then(writeState)
    //                             },
    //                         })

    //                         return Promise.resolve(state)
    //                     }, "revice", "复活", "revice", getClickMiddleSoundResourceId(), "primary")

    //             }
    //         </Row>
    //     </Col>
    // }

    let _select = (state, modelName) => {
        state = CityScene3D.setCurrentModelName(state, modelName)


        // let sceneData = NullableUtils.getExn<sceneData>(targetSceneData)
        // if (sceneData.scene == scene.Biwu && sceneData.levelNumber == 3) {
        //     state = CityScene3D.setCurrentMMDCharacter(state, mmdCharacter.Haku_QP)
        //     dispatch(setPage(page.Explain))
        // }
        // else {
        //     dispatch(setPage(page.SelectCharacter))
        // }
        // dispatch(setPage(page.SelectCharacter))


        dispatch(setCharacter(modelName))

        // deferSwitchPageForGetNewestState(dispatch, setPage(page.LittleManTalent))
        deferSwitchPageForGetNewestState(dispatch, setPage(page.SelectLittleManCareer))


        return state
    }

    let _judgeAndSelect = (state, modelName, isNeedActive) => {
        // if (isNeedActive) {
        //     if (NullableUtils.isNullable(activeInfo)) {
        //         return Promise.resolve(state)
        //     }

        //     let info = NullableUtils.getExn(activeInfo)

        //     // if (!is29ActiveSuccess(info)) {
        //     //     Modal.confirm({
        //     //         getContainer: LandscapeUtils.getRootDom(),
        //     //         content: '现在激活？',
        //     //         onConfirm: async () => {
        //     //             dispatch(setPageData(info))
        //     //             dispatch(setPage(page.ActiveCode))

        //     //             return Promise.resolve(state)
        //     //         },
        //     //     })

        //     //     return Promise.resolve(state)
        //     // }

        //     Modal.confirm({
        //         getContainer: LandscapeUtils.getRootDom(),
        //         content: _isShowOutdate(true) ? `激活码已过期，现在重新激活？` : '现在激活？（绿色人物属性更高）',
        //         onConfirm: async () => {
        //             dispatch(setPageData(info))
        //             dispatch(setPage(page.ActiveCode))

        //             return Promise.resolve()
        //         },
        //     })

        //     return Promise.resolve(state)
        // }

        return Promise.resolve(_select(state, modelName))
    }

    // let _isNeedActive = () => {
    //     if (NullableUtils.isNullable(activeInfo)) {
    //         return false
    //     }

    //     return NullableUtils.getExn(activeInfo) == getNoActiveCodeInfo() || !is29ActiveSuccess(activeInfo)
    // }


    // let _isShowNotActive = (isNeedActive) => {
    //     if (isNeedActive) {
    //         if (NullableUtils.isNullable(activeInfo)) {
    //             return false
    //         }

    //         // return !isActiveSuccess(NullableUtils.getExn(activeInfo))
    //         return NullableUtils.getExn(activeInfo) == getNoActiveCodeInfo()
    //     }

    //     return false
    // }

    // let _isShowOutdate = (isNeedActive) => {
    //     if (isNeedActive) {
    //         if (NullableUtils.isNullable(activeInfo)) {
    //             return false
    //         }

    //         return NullableUtils.getExn(activeInfo) == get29ActiveCodeOutdateInfo()
    //     }

    //     return false
    // }

    let _getAllPageLittleManCharacters = () => {
        // let isNeedActive = _isNeedActive()


        let isNeedActive = false

        let state = readState()

        let littleManCharacters = getLittleManCharacters(state)


        return group([
            [
                "./resource/ui/not_in_game/little_man/Infantry.png",
                modelName.Infantry,
                getLanguageDataByData(state, getTextData(), modelName.Infantry),
                false,
                resourceLevel.White,
            ],
            [
                "./resource/ui/not_in_game/little_man/Mutant.png",
                modelName.Mutant,
                getLanguageDataByData(state, getTextData(), modelName.Mutant),
                isNeedActive,
                resourceLevel.Green,
            ],
            [
                "./resource/ui/not_in_game/little_man/Ely.png",
                modelName.Ely,
                getLanguageDataByData(state, getTextData(), modelName.Ely),
                isNeedActive,
                resourceLevel.Green,
            ],
            [
                "./resource/ui/not_in_game/little_man/Maria.png",
                modelName.Maria,
                getLanguageDataByData(state, getTextData(), modelName.Maria),
                isNeedActive,
                resourceLevel.White,
            ],
            [
                "./resource/ui/not_in_game/little_man/Dreyar.png",
                modelName.Dreyar,
                getLanguageDataByData(state, getTextData(), modelName.Dreyar),
                isNeedActive,
                resourceLevel.White,
            ],
            [
                "./resource/ui/not_in_game/little_man/Abe.png",
                modelName.Abe,
                getLanguageDataByData(state, getTextData(), modelName.Abe),
                isNeedActive,
                resourceLevel.White,
            ],
            [
                "./resource/ui/not_in_game/little_man/Mousey.png",
                modelName.Mousey,
                getLanguageDataByData(state, getTextData(), modelName.Mousey),
                isNeedActive,
                resourceLevel.White,
            ],
            [
                "./resource/ui/not_in_game/little_man/Ninja.png",
                modelName.Ninja,
                getLanguageDataByData(state, getTextData(), modelName.Ninja),
                isNeedActive,
                resourceLevel.White,
            ],
        ].filter(d => {
            return littleManCharacters.map(c => c.modelName).includes(d[1] as modelName)
        }).map(d => {
            return [
                d,
                NullableUtils.getExn(littleManCharacters.find(c => c.modelName == d[1])).isAlive,
            ]
        }).sort((a, b) => {
            if (a[1] && !b[1]) {
                return -1
            }

            return 1
        }), 4)
    }

    let _renderPreviousButton = () => {
        if (pageIndex > 0) {
            return renderButtonImage(state => {
                setPageIndex(pageIndex => pageIndex - 1)

                return Promise.resolve(state)
            }, "./resource/ui/not_in_game/previous.png", "previous", false, NullableUtils.return_(getClickSmallSoundResourceId()))
        }

        return null
    }

    let _renderNextButton = () => {
        if (pageIndex < _getAllPageLittleManCharacters().length - 1) {
            return renderButtonImage(state => {
                setPageIndex(pageIndex => pageIndex + 1)

                return Promise.resolve(state)
            }, "./resource/ui/not_in_game/next.png", "next", false, NullableUtils.return_(getClickSmallSoundResourceId()))
        }

        return null
    }

    let _render = () => {
        return <>
            {_getAllPageLittleManCharacters()[pageIndex].map(([[src, modelName, name, isNeedActive, resourceLevel], isAlive, textName], i) => {
                return renderCharacter(_judgeAndSelect, isAlive, src, modelName, name, isNeedActive, resourceLevel, i, characterType.LittleMan)
            })
            }
        </>
    }

    // useEffect(() => {
    //     getActiveInfo().then(info => {
    //         setActiveInfo(_ => NullableUtils.return_(info))
    //     })
    // }, []);

    return <Layout className="select-little-man-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.SelectLittleManTitle)}</Title>
        </Flex>

        <Row justify="center">
            {
                renderButton(state => {
                    dispatch(setPage(page.Difficulty))

                    return Promise.resolve(state)
                }, "back", getLanguageTextData(readState(), languageKey.Back), "tab", getClickLargeSoundResourceId(), "default")
            }
        </Row>
        <Row justify="center" className="select">
            {
                _renderPreviousButton()
            }
            {
                _render()
            }
            {
                _renderNextButton()
            }
        </Row>
    </Layout >
};

export default SelectLittleMan;
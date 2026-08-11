import "./SelectCharater.scss"

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
// import { get29ActiveCodeOutdateInfo, getActiveInfo, getNoActiveCodeInfo, is29ActiveSuccess, is9ActiveSuccess } from "../../../../scene3d_layer/script/ActiveCode";
import { isValid } from "../../../../scene3d_layer/script/scene/scene_city/utils/MMDUtils";
import { Modal, Selector, Toast } from "antd-mobile";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { getAllMMDData } from "../../../../scene3d_layer/script/scene/scene_city/data/mmd/MMDData";
import { renderSwitch } from "../../../utils/SwitchUtils";
import { set } from "../../../utils/SettingUtils";
import { getIsDebug } from "../../../../scene3d_layer/script/scene/Scene";
import { resourceLevel, usedGirlEnum } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { getLevelNumber, getName, getSceneChapter } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { getAllMMDData as getAllMMDDataBiwuLevel1 } from "../../../../scene3d_layer/script/scene/scene_city/data/biwu/level1/mmd/MMDData";
import { getAllMMDData as getAllMMDDataBiwuLevel2 } from "../../../../scene3d_layer/script/scene/scene_city/data/biwu/level2/mmd/MMDData";
import { getGiantessCharacters } from "../../../../scene3d_layer/script/scene/scene_city/character/Character";
import { group } from "../../../utils/CharacterUtils";
import { deferSwitchPageForGetNewestState } from "../../../utils/SwitchPageUtils";
import { renderCharacter, renderReviveButtons } from "../../../utils/SelectCharacterUtils";
import { isEnteringNextLevel } from "../../../../scene3d_layer/script/scene/scene_city/manage/mission/Mission";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getAllBlockServiceFuncWithDefault } from "../../../../scene3d_layer/mod/Mod";
import { service } from "mmd-character-protocol/src/service/ServiceType";
import { modProtocolName } from "../../../../scene3d_layer/mod/data/ModData";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getLanguageTextData, languageKey } from "../../../../scene3d_layer/internation/Data";
// import { getSelectCharacterData } from "../../../../mod/mmd/json/MMDData";
// import { getAllMMDData as getAllMMDDataBiwuLevel3 } from "../../../../scene3d_layer/script/scene/scene_city/data/biwu/level3/mmd/MMDData";
import Text from 'antd/es/typography/Text';
import { handleEventHandler } from "../../../utils/ErrorUtils";
import { handleNetworkRequest } from "../../../utils/BackendUtils";
import { updateRewardBackend } from "../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { mmdCharacter } from "mmd-character-default/src/json/Type";
import { addPropCount, getPropCount, subPropCount } from "../../../../scene3d_layer/script/scene/scene_city/reward/Prop";
import { getUseGiantessCharacterBlockService } from "../../../../scene3d_layer/mod/PropOtherMod";
import { isActive, isNeedUseGiantessProp } from "../../../../scene3d_layer/script/scene/scene_city/User";
import * as Backend from "backend/src/Main";
import { getAllSelectCharacterData } from "../../../../scene3d_layer/mod/MMDMod";

let SelectCharacter: React.FC = () => {
    let targetSceneData = useSelector<AppState>((state) => state.global.targetSceneData) as any

    let dispatch: AppDispatch = useDispatch()

    // let [pageMMDCharacters, setPageMMDCharacters] = useState([])
    let [pageIndex, setPageIndex] = useState(0)
    // let [activeInfo, setActiveInfo] = useState(NullableUtils.getEmpty())

    // let _renderCharacter = (isAlive, src, mmdCharacter_, isNeedActive, resourceLevel, key) => {
    //     return <Col key={key} className="col" span={5}>
    //         {
    //             Device.isMobileByState(getAbstractState(state)) ? renderButtonImage(state => {
    //                 if (!isAlive) {
    //                     return Promise.resolve(state)
    //                 }

    //                 return _judgeAndSelect(state, mmdCharacter_, isNeedActive)
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
    //                     return _judgeAndSelect(state, mmdCharacter_, isNeedActive)
    //                 }, isNeedActive ? "./resource/ui/not_in_game/select-button-need-active.png" : "./resource/ui/not_in_game/select-button.png", "", false, NullableUtils.return_(getClickMiddleSoundResourceId())) : null
    //             }
    //         </Row>
    //         <Row justify="center" className="button">
    //             {
    //                 isAlive ? renderButtonImage(state => {
    //                     return _judgeAndSelect(state, mmdCharacter_, isNeedActive)
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

    let _select = (state, character) => {
        // state = CityScene3D.setCurrentMMDCharacterByUsedGirl(state, character, usedGirlEnum.PlayerGirl)

        dispatch(setCharacter(character))

        // if (isEnteringNextLevel(state)) {
        //     deferSwitchPageForGetNewestState(dispatch, setPage(page.Scene))
        // }
        // else {
        //     deferSwitchPageForGetNewestState(dispatch, setPage(page.GiantessTalent))
        // }

        deferSwitchPageForGetNewestState(dispatch, setPage(page.SelectGiantessCareer))

        return state
    }

    let _judgeAndSelect = (state, character, isNeedActive) => {
        // if (isNeedActive) {
        //     if (NullableUtils.isNullable(activeInfo)) {
        //         return Promise.resolve(state)
        //     }

        //     let info = NullableUtils.getExn(activeInfo)

        //     // if (!isActiveSuccess(info)) {
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
        //         content: _isShowOutdate(true) ? `激活码已过期，现在重新激活？` : '现在激活？（绿色人物可爆衣）',
        //         onConfirm: async () => {
        //             dispatch(setPageData(info))
        //             dispatch(setPage(page.ActiveCode))

        //             return Promise.resolve()
        //         },
        //     })

        //     return Promise.resolve(state)
        // }

        // if (character != mmdCharacter.Baixi_Maid) {

        if (isNeedUseGiantessProp(state, character)) {
            if (getPropCount(state, getUseGiantessCharacterBlockService(state).getName()) <= 0) {
                Modal.confirm({
                    content: getLanguageTextData(state, languageKey.UseGiantessCharacterNotEnough),
                    confirmText: getLanguageTextData(state, languageKey.GoToActive),
                    cancelText: getLanguageTextData(state, languageKey.Cancel),
                    onConfirm: handleEventHandler(_ => {
                        deferSwitchPageForGetNewestState(dispatch, setPage(page.ActiveCode))
                    }),
                })

                return Promise.resolve(state)
            }

            Modal.confirm({
                content: getLanguageTextData(state, languageKey.UseGiantessCharacter),
                confirmText: getLanguageTextData(state, languageKey.Confirm),
                cancelText: getLanguageTextData(state, languageKey.Cancel),
                onConfirm: handleEventHandler(_ => {
                    let state = readState()

                    // state = subPropCount(state, getUseGiantessCharacterBlockService(state).getName(), 1)

                    // writeState(state)

                    // return handleNetworkRequest(state => {
                    //     return updateRewardBackend(state).then(writeState)
                    // }, (state) => {
                    //     state = _select(state, character)

                    //     writeState(state)
                    // }, state => {
                    //     state = addPropCount(state, getUseGiantessCharacterBlockService(state).getName(), 1)

                    //     return Promise.resolve(state)
                    // })

                    state = _select(state, character)

                    writeState(state)
                }),
            })

            return Promise.resolve(state)
        }

        state = _select(state, character)

        return Promise.resolve(state)
    }

    // let _isNeed9Active = () => {
    //     if (NullableUtils.isNullable(activeInfo)) {
    //         return false
    //     }

    //     return NullableUtils.getExn(activeInfo) == getNoActiveCodeInfo()
    // }

    // let _isNeed29Active = () => {
    //     if (NullableUtils.isNullable(activeInfo)) {
    //         return false
    //     }

    //     return NullableUtils.getExn(activeInfo) == getNoActiveCodeInfo() || !is29ActiveSuccess(activeInfo)
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

    let _getAllPageMMDCharacters = () => {
        // let isNeed9Active = _isNeed9Active()
        // let isNeed29Active = _isNeed29Active()

        // let state = readState()
        let allMMDData


        let state = readState()

        let sceneData = NullableUtils.getExn<sceneData>(targetSceneData)
        switch (sceneData.scene) {
            // case scene.Play:
            // case scene.Protect:
            //     allMMDData = getAllMMDData(state)
            //     break
            // case scene.Biwu:
            //     switch (sceneData.levelNumber) {
            //         case 1:
            //             allMMDData = getAllMMDDataBiwuLevel1(state)
            //             break
            //         case 2:
            //             allMMDData = getAllMMDDataBiwuLevel2(state)
            //             break
            //         // case 3:
            //         //     allMMDData = getAllMMDDataBiwuLevel3()
            //         //     break
            //         default:
            //             throw new Error("err")
            //     }
            //     break
            default:
                // throw new Error("err")
                allMMDData = getAllMMDData(state)
                break
        }

        // // TODO restore
        // isNeed9Active = false
        // isNeed29Active = false

        let giantessCharacters = getGiantessCharacters(state)

        return group(
            getAllSelectCharacterData(state)
                .filter((d: [string, mmdCharacter, string, boolean, resourceLevel]) => {
                    return allMMDData.filter(d2 => {
                        return d2[0] == d[1]
                    }).length > 0 && isValid(d[1])
                })
                // .filter(d => {
                //     return giantessCharacters.map(c => c.mmdCharacter).includes(d[1] as mmdCharacter)
                // })
                .map(d => {
                    return [
                        d,
                        NullableUtils.getWithDefault(
                            NullableUtils.map(d => d.isAlive, giantessCharacters.find(c => c.mmdCharacter == d[1])),
                            false
                        ),
                        giantessCharacters.map(c => c.mmdCharacter).includes(d[1] as mmdCharacter)
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
        if (pageIndex < _getAllPageMMDCharacters().length - 1) {
            return renderButtonImage(state => {
                setPageIndex(pageIndex => pageIndex + 1)

                return Promise.resolve(state)
            }, "./resource/ui/not_in_game/next.png", "next", false, NullableUtils.return_(getClickSmallSoundResourceId()))
        }

        return null
    }

    let _renderCharacter = (
        judgeAndSelectFunc,
        isAlive, isCaptured, src, character, name, isNeedActive, resourceLevel, key, characterType_) => {
        return <Col key={key} className="col" span={5}>
            {
                Device.isMobile() ? renderButtonImage(state => {
                    if (!isAlive) {
                        return Promise.resolve(state)
                    }

                    return judgeAndSelectFunc(state, character, isNeedActive)
                }, src, resourceLevel, false, NullableUtils.return_(getClickMiddleSoundResourceId()))
                    : renderImage(src, resourceLevel, true)
            }
            {/* <Row justify="center" className="status">
            {
                isNeedActive ?
                    (
                        _isShowOutdate(isNeedActive) ? renderImage("./resource/ui/not_in_game/outdate.png", "", false) : renderImage("./resource/ui/not_in_game/not_active.png", "", false)
                    )
                    : null
            }
        </Row> */}
            <Row justify="center" className="status">
                {
                    (!isAlive && isCaptured) ?
                        (
                            renderImage("./resource/ui/not_in_game/dead.png", "dead", false)
                        )
                        : null
                }
            </Row>
            <Row justify="center" className="name">
                <Text className="name">{name}</Text>
            </Row>
            {
                isCaptured ? null
                    : <Row justify="center" className="name">
                        <Text className="name_supply">{`(${getLanguageTextData(readState(), languageKey.NeedCapture)})`}</Text>
                    </Row>
            }
            <Row justify="center" className="button">
                {
                    isAlive ? renderButtonImage(state => {
                        return judgeAndSelectFunc(state, character, isNeedActive)
                    }, isNeedActive ? "./resource/ui/not_in_game/select-button-need-active.png" : "./resource/ui/not_in_game/select-button.png", "", false, NullableUtils.return_(getClickMiddleSoundResourceId())) :
                        (isCaptured ? renderReviveButtons(readState(), judgeAndSelectFunc, isNeedActive, character, characterType_) : null)
                }
            </Row>
        </Col>
    }

    let _render = () => {
        return <>
            {_getAllPageMMDCharacters()[pageIndex].map(([[src, mmdCharacter_, name, isNeedActive, resourceLevel], isAlive, isCaptured], i) => {
                return _renderCharacter(_judgeAndSelect, isAlive, isCaptured, src, mmdCharacter_, name, isNeedActive, resourceLevel, i, characterType.Giantess)
            })
            }
        </>
    }

    // let _renderDebugButton = () => {
    //     return <Selector
    //         defaultValue={mmdCharacter.XiaHui}
    //         onChange={arr => {
    //             set(_select, arr, mmdCharacter.XiaHui, false)
    //         }}
    //         options={
    //             [
    //                 { value: mmdCharacter.Haku_QP, label: "Haku_QP" },
    //                 { value: mmdCharacter.XiaHui, label: "XiaHui" },
    //                 { value: mmdCharacter.Xiaye1, label: "Xiaye1" },
    //                 { value: mmdCharacter.Xiaye2, label: "Xiaye2" },
    //                 { value: mmdCharacter.Changee, label: "Changee" },
    //                 // { value: mmdCharacter.Luotianyi, label: "Luotianyi" },
    //                 { value: mmdCharacter.Meibiwusi, label: "Meibiwusi" },
    //                 { value: mmdCharacter.Miku1, label: "Miku1" },
    //                 { value: mmdCharacter.Moye, label: "Moye" },
    //                 { value: mmdCharacter.Nero, label: "Nero" },
    //                 { value: mmdCharacter.Vanilla, label: "Vanilla" },
    //             ]
    //         }
    //     />
    // }

    // useEffect(() => {
    //     getActiveInfo().then(info => {
    //         setActiveInfo(_ => NullableUtils.return_(info))
    //     })
    // }, []);

    return <Layout className="select-character-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.SelectCharacterTitle)}</Title>
        </Flex>

        <Row justify="center">
            {
                renderButton(state => {
                    dispatch(setPage(page.LittleManTalent))

                    return Promise.resolve(state)
                }, "back", getLanguageTextData(readState(), languageKey.Back), "tab", getClickLargeSoundResourceId(), "default")
            }
        </Row>
        <Row justify="center" className="select">
            {/* {
                getIsDebug(readState()) ?
                    _renderDebugButton() : null
            } */}
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

        <section className="fixed-button">
            <Text className="note"
                onClick={handleEventHandler(() =>
                    Toast.show({
                        content: getLanguageTextData(readState(), languageKey.HowToGetGiantessCharacterA),
                        duration: 5000
                    })
                )
                }
            >{getLanguageTextData(readState(), languageKey.HowToGetGiantessCharacterQ)}</Text>
        </section>

    </Layout >
};

export default SelectCharacter;
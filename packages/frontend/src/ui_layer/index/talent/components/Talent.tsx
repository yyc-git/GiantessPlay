import "./Talent.scss"

import React, { useEffect, useState } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { getAbstractState, readState, writeState } from "../../../../business_layer/State";
import * as  CityScene3D from '../../../../business_layer/CityScene3D';
import { setCharacter, setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { renderButton, renderImage as renderButtonImage } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId, getClickMiddleSoundResourceId, getClickSmallSoundResourceId } from "../../../../business_layer/Loader";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Device } from "meta3d-jiehuo-abstract";
import { renderImage } from "../../../utils/ImageUtils";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import Text from 'antd/es/typography/Text';
import { Card, Cascader, Modal, Selector, Switch, Tabs, Toast } from "antd-mobile";
import { modelName } from "../../../../scene3d_layer/script/scene/scene_city/little_man_data/ModelData";
// import * as Build from "../../../../scene3d_layer/script/scene/scene_city/build/Build";
import * as Talent_ from "../../../../scene3d_layer/script/scene/scene_city/build/Talent";
import { getGiantessCharacters, getLittleManCharacters } from "../../../../scene3d_layer/script/scene/scene_city/character/Character";
import { getTalentData, singleTalentData, talentData } from "../../../../scene3d_layer/script/scene/scene_city/data/build/TalentData";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getCurrentModelData } from "../../../../scene3d_layer/script/scene/scene_city/little_man/LittleMan";
import { getCurrentMMDCharacterName } from "../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import { setGem } from "../../../../scene3d_layer/script/scene/scene_city/reward/Gem";
import { getTotalGem, updateRewardBackend } from "../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { play } from "../../../../business_layer/Sound";
import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { getIsDebug } from "../../../../scene3d_layer/script/scene/Scene";
import { getSceneChapter } from "../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { buildFuncData } from "../../../../scene3d_layer/script/scene/scene_city/data/FuncData";
import { mmdCharacter } from "type-default/src/Type";
import { getSoundSetting } from "../../../../scene3d_layer/mod/SettingMod";
import { getLanguageTextData, getLanguageTextVariableData, languageKey, languageVariableKey } from "../../../../scene3d_layer/internation/Data";
import { handleEventHandler } from "../../../utils/ErrorUtils";
import { handleNetworkRequest } from "../../../utils/BackendUtils";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { usedGirlEnum } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType";

let Talent: React.FC = ({ characterType_ }) => {
    // let _getCharacter = (character, characterType) => {
    //     if (characterType == characterType.LittleMan) {
    //         return getCurrentModelData(state).name
    //     }

    //     return getCurrentMMDCharacterName(state, usedGirl)
    // }

    let _getTalentData = (character) => {
        let data = Talent_.getTalentData(readState(), character)

        return getTalentData(readState())
            .filter(d => {
                return d.characterType == characterType_
            })
            .map(d => {
                return {
                    ...d,
                    character: character
                }
            }).map(d => {
                return NullableUtils.getWithDefault(
                    data.find(d2 => {
                        return d2.name == d.name
                    }),
                    d
                )
            })
    }

    let character = useSelector<AppState>((state) => NullableUtils.getExn(state.global.character)) as any
    let targetSceneData = useSelector<AppState>((state) => state.global.targetSceneData) as any

    let dispatch: AppDispatch = useDispatch()

    // let [visible, setVisible] = useState(false)
    let [currentPhase, setCurrentPhase] = useState(1)
    // let [takeGem, setTakeGem] = useState(0)
    // let [data, setData] = useState(_getTalentData(character))
    // let [totalGem, setTotalGem] = useState(getTotalGem(readState()))
    let [data, setData] = useState({
        talentData: _getTalentData(character),
        gem: getTotalGem(readState())
    })
    // let [totalGem, setTotalGem] = useState(getTotalGem(readState()))
    // let [selectedTalentName, setSelectedTalentName] = useState(NullableUtils.getEmpty())
    // let [characterType, setCharacterType] = useState(characterType.LittleMan)
    // let [modelName_, setModelName_] = useState(modelName.Infantry)
    // let [mmdCharacter_, setMMDCharacter_] = useState(mmdCharacter.Baixi_Maid)

    // let _changeHeat = (name, newHeat) => {
    //     setData(d => {
    //         return NullableUtils.map((d: difficultyData) => {
    //             return d.map(v => {
    //                 if (v.name == name) {
    //                     return {
    //                         ...v,
    //                         heat: newHeat
    //                     }
    //                 }

    //                 return v
    //             })
    //         }, d)
    //     })
    // }

    // let _getColorClassName = (value) => {
    //     if (value > 0) {
    //         return "red"
    //     }
    //     else if (value == 0) {
    //         return "white"
    //     }

    //     return "green"
    // }

    // useEffect(() => {
    //     setData(_ => NullableUtils.return_(
    //         getTalentData<talentData>()
    //     ))
    // }, []);

    //     let _getSelectCharacterOptions = () => {
    //         let state = readState()


    //         return [
    //             {
    //                 label: '小人',
    //                 value: '小人',
    //                 children: getLittleManCharacters(state).toArray().map(modelName_ =>{
    // return {
    //     lb
    //     value:modelName_
    // }
    //                 }),

    //             },
    //             {
    //                 label: '巨大娘',
    //                 value: '巨大娘',
    //                 children: [
    //                     {
    //                         label: '小人',
    //                         value: '小人',
    //                     },
    //                     {
    //                         label: '巨大娘',
    //                         value: '巨大娘',
    //                     },
    //                 ],
    //             }]
    //      ]
    //     }

    let _renderTabs = () => {
        let d = Talent_.getEnablePhaseData(data.talentData)

        return <Tabs defaultActiveKey="1"
            activeKey={String(currentPhase)}
            onChange={key => {
                if (!d.includes(Number(key))) {
                    Toast.show({
                        content: getLanguageTextData(readState(), languageKey.UnlockTalentPhaseDescription)
                    })

                    return
                }

                setCurrentPhase(_ => Number(key))
            }}
        >
            {
                ArrayUtils.range(1, Talent_.getMaxPhase(data.talentData)).map(phase => {
                    return <Tabs.Tab title={getLanguageTextVariableData(readState(), languageVariableKey.PhaseTitle)(phase)} key={String(phase)}
                    // disabled={getIsDebug(readState()) ? false : !d.includes(phase)}
                    />
                })
            }
        </Tabs>
    }

    let _select = (state) => {
        state = setGem(state, data.gem)
        writeState(state)

        return handleNetworkRequest(state => {
            return updateRewardBackend(state).then(state => {
                return Talent_.addOrUpdateCharacterTalentDataAndUpdateBackend(state, data.talentData, character)
            })
                .then(writeState)
        }, state => {
            // if (characterType_ == characterType.LittleMan && NullableUtils.getExn(targetSceneData).scene == scene.Play
            if (characterType_ == characterType.LittleMan
            ) {
                if (getGiantessCharacters(state).count() == 0) {
                    state = CityScene3D.setCurrentMMDCharacterByUsedGirl(state, mmdCharacter.None, usedGirlEnum.PlayerGirl)

                    dispatch(setCharacter(mmdCharacter.None))

                    dispatch(setPage(page.Explain))

                    return state
                }
                else {
                    dispatch(setPage(page.SelectCharacter))

                    return state
                }
            }

            dispatch(setPage(page.Explain))

            return state

        })
    }

    let _isGemEnough = (needGem) => {
        return data.gem >= needGem
    }

    return <Layout className="talent-main"  >
        <Flex justify="center" align="center">
            <Title className="title">{getLanguageTextData(readState(), languageKey.TalentTitle)}</Title>
        </Flex>



        <Row justify="center">
            {
                _renderTabs()
            }
        </Row>

        <Row justify="center">
            {
                renderButton(state => {
                    return _select(state)
                }, "confirm", getLanguageTextData(readState(), languageKey.Confirm), "confirm", getClickLargeSoundResourceId(), "primary")
            }
            {
                renderButton(state => {
                    if (characterType_ == characterType.LittleMan) {
                        dispatch(setPage(page.SelectLittleMan))
                    }
                    else {
                        dispatch(setPage(page.SelectCharacter))
                    }

                    return Promise.resolve(state)
                }, "back", getLanguageTextData(readState(), languageKey.Back), "back", getClickLargeSoundResourceId(), "default")
            }
            <Title level={3}>{getLanguageTextVariableData(readState(), languageVariableKey.TalentLevel)(Talent_.computeTalentTotalLevel(data.talentData))}</Title>
            <Text > {getLanguageTextData(readState(), languageKey.GemRemain)}:</Text>
            {renderImage("meta3d-jiehuo-abstract/particle/gem.png", "gem", false)}
            <Text>{data.gem}</Text>
        </Row>

        <Row justify="center">
            {
                data.talentData.filter(d => d.phase == currentPhase).map((d: singleTalentData) => {
                    return <Card
                        // icon={renderImage(d.imageSrc, "icon", false)}
                        title={<>
                            <Text >{d.title}</Text>
                            <Text >{` ${d.level}/${d.maxLevel}`}</Text>
                            {
                                d.level >= d.maxLevel ? null :
                                    <>
                                        <Text > {getLanguageTextData(readState(), languageKey.Take)}:</Text>
                                        {renderImage("meta3d-jiehuo-abstract/particle/gem.png", "gem", false)}
                                        <Text className={_isGemEnough(d.getGemFunc(d.level + 1, d.maxLevel, d.base, d.characterType)) ? "black" : "red"} >{d.getGemFunc(d.level + 1, d.maxLevel, d.base, d.characterType)}</Text>
                                    </>
                            }
                            {
                                (d.level >= d.maxLevel || !_isGemEnough(d.getGemFunc(d.level + 1, d.maxLevel, d.base, d.characterType))) ? null :
                                    renderButton((state, event) => {
                                        event.preventDefault()
                                        event.stopPropagation()

                                        let [totalGem, level] = ArrayUtils.range(d.level, d.maxLevel - 1).reduce(([totalGem, level], _) => {
                                            let gem = d.getGemFunc(level + 1, d.maxLevel, d.base, d.characterType)

                                            if (!_isGemEnough(totalGem + gem)) {
                                                return [totalGem, level]
                                            }

                                            return [totalGem + gem, level + 1]
                                        }, [0, d.level])

                                        level -= d.level


                                        setData(data => {
                                            return {
                                                talentData: data.talentData.map((d2: singleTalentData) => {
                                                    if (d2.name == d.name) {
                                                        return {
                                                            ...d2,
                                                            // level: d2.level + level - 1
                                                            level: d2.level + level
                                                        }
                                                    }

                                                    return d2
                                                }),
                                                gem: data.gem - totalGem
                                            }
                                        })

                                        return Promise.resolve(state)
                                    }, "max", getLanguageTextData(readState(), languageKey.UpgradeMax), "max", getClickSmallSoundResourceId(), "default")
                            }
                        </>}
                        onClick={handleEventHandler(_ => {
                            if (d.level >= d.maxLevel) {
                                return
                            }

                            if (
                                !_isGemEnough(d.getGemFunc(d.level + 1, d.maxLevel, d.base, d.characterType))
                            ) {
                                Modal.alert({
                                    getContainer: LandscapeUtils.getRootDom(),
                                    content: getLanguageTextData(readState(), languageKey.GemNotEnough),
                                    confirmText: getLanguageTextData(readState(), languageKey.Confirm),
                                })

                                return
                            }

                            // setSelectedTalentName(_ => NullableUtils.return_(d.name))


                            let state = readState()
                            play(state, buildNeedToPlaySoundData(getClickSmallSoundResourceId(), getIsDebug(state), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

                            // Modal.confirm({
                            //     getContainer: LandscapeUtils.getRootDom(),
                            //     title: d.title,
                            //     content: d.getDescriptionFunc(readState(), buildFuncData(readState()), d.level + 1),
                            //     onConfirm: async () => {
                            //         if (d.level >= d.maxLevel) {
                            //             return
                            //         }

                            //         play(state, buildNeedToPlaySoundData(getClickMiddleSoundResourceId(), getIsDebug(state), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

                            //         setData(data => {
                            //             return {
                            //                 talentData: data.talentData.map((d2: singleTalentData) => {
                            //                     if (d2.name == d.name) {
                            //                         return {
                            //                             ...d2,
                            //                             level: d2.level + 1
                            //                         }
                            //                     }

                            //                     return d2
                            //                 }),
                            //                 gem: data.gem - d.getGemFunc(d.level + 1, d.maxLevel, d.base)
                            //             }
                            //         })

                            //         return Promise.resolve()
                            //     },
                            // })
                            if (d.level >= d.maxLevel) {
                                return
                            }

                            play(state, buildNeedToPlaySoundData(getClickMiddleSoundResourceId(), getIsDebug(state), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

                            setData(data => {
                                return {
                                    talentData: data.talentData.map((d2: singleTalentData) => {
                                        if (d2.name == d.name) {
                                            return {
                                                ...d2,
                                                level: d2.level + 1
                                            }
                                        }

                                        return d2
                                    }),
                                    gem: data.gem - d.getGemFunc(d.level + 1, d.maxLevel, d.base, d.characterType)
                                }
                            })

                            // return Promise.resolve()


                        })}
                    >
                        {
                            renderImage(d.imageSrc, "icon", false)
                        }
                        <Text >{d.getDescriptionFunc(readState(), buildFuncData(readState()), d.level >= d.maxLevel ? d.maxLevel : d.level + 1)}</Text>
                    </Card>
                })
            }
        </Row>


    </Layout >
};

export default Talent;
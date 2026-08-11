import "./IndexMain.scss"

import React, { useEffect, useState } from 'react';
import { Button, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../../../store/AppStore";
import { setPage, setTargetScene } from "../../../global/store/GlobalStore";
import { page, scene } from "../../../global/store/GlobalStoreType";
import Title from "antd/es/typography/Title";
import { Content, Header } from "antd/es/layout/layout";
import { renderButton, renderButton4, renderImage } from "../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId, getClickMiddleSoundResourceId, getClickSmallSoundResourceId, getRewardSoundResourceId } from "../../../../business_layer/Loader";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../business_layer/State";
// import { getVersion } from "meta3d-jiehuo-abstract/src/version/Version";
// import { getActiveInfo, isActiveSuccess } from "../../../../scene3d_layer/script/ActiveCode";
import { getLanguageImageData, getLanguageTextData, getLanguageTextVariableData, languageImageKey, languageKey, languageVariableKey } from "../../../../scene3d_layer/internation/Data";
import { CapsuleTabs, Selector, Modal } from "antd-mobile";
import { getIsDebug, getLanguage, isChinese, setLanguage } from "../../../../scene3d_layer/script/scene/Scene";
import { language } from "../../../../scene3d_layer/type/StateType";
import * as Backend from "backend/src/Main"
import { getVersionCache } from "meta3d-jiehuo-abstract/src/storage/Storage";
import { Version } from "meta3d-jiehuo-abstract";
import { renderImageDom } from "../../../utils/ImageUtils";
import { getNewContent } from "meta3d-jiehuo-abstract/src/version/Version";
import Text from 'antd/es/typography/Text';
import { handleEventHandler } from "../../../utils/ErrorUtils";
import { getVersionData } from "../../../../business_layer/VersionData";
import { getRewardArtifactCount, getRewardGemCount, isCanGetReward, setLastGetRewardTime } from "../../../../scene3d_layer/script/scene/scene_city/User";
import { setGem } from "../../../../scene3d_layer/script/scene/scene_city/reward/Gem";
import { getTotalGem, updateRewardBackend } from "../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { getAllArtifactServices } from "../../../../scene3d_layer/mod/PropOtherMod";
import { addPropCount } from "../../../../scene3d_layer/script/scene/scene_city/reward/Prop";
import { handleNetworkRequest } from "../../../utils/BackendUtils";
import { play } from "../../../../business_layer/Sound";
import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { getSoundSetting } from "../../../../scene3d_layer/mod/SettingMod";
import { Device } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getModAPI } from "../../../../scene3d_layer/script/scene/scene_city/Mod";

let IndexMain: React.FC = () => {
    // let [isRenderActiveCode, setIsRenderActiveCode] = useState(false)
    let [language_, setLanguage_] = useState(getLanguage(readState()))
    let [isGetReward, setIsGetReward] = useState(true)
    let [artifactRewardServices, setArtifactRewardServices] = useState([])

    let dispatch: AppDispatch = useDispatch()

    let _getVersion = () => {
        let [mainVersion, subVersion, postfix] = Version.getVersion(getAbstractState(readState()))

        return `v${mainVersion}.${subVersion}` + NullableUtils.getWithDefault(
            `${postfix}${getLanguageTextData(readState(), languageKey.VersionExplain)}`,
            ""
        )
    }

    // let _buildVersionUpdateKey = () => "_buildVersionUpdateKey"

    // let _isVersionUpdate = () => {
    //     return getVersionCache(_buildVersionUpdateKey()).then(version => {
    //         return NullableUtils.getWithDefault(NullableUtils.map(version => {
    //             return version != _getVersion()
    //         }, version), false)
    //     })
    // }

    useEffect(() => {
        setArtifactRewardServices(_ => ArrayUtils.randomShuffle(getAllArtifactServices(readState())).slice(0, getRewardArtifactCount(readState()))
        )
    }, []);

    return <Layout className="index-main-main"  >
        {/* <Header  >
            <Title>111</Title>
        </Header> */}
        <Row justify="center" align="middle">
            {/* <Title className="title">巨大娘的玩耍</Title> */}
            {/* @ts-ignore */}
            <Image className="title" preview={false} src={getLanguageImageData(readState(), languageImageKey.Title)}></Image>
        </Row>
        {/* <Content>
        </Content> */}
        <Layout className="body">
            {
                // isChinese() ?
                <Row justify="center" align="top">
                    <Title className="version">{_getVersion()}</Title>
                    {
                        Version.isVersionUpdate(getAbstractState(readState())) ?
                            renderImageDom("./resource/ui/not_in_game/new.png", "version-update")
                            : null
                    }


                    {/* {
                            renderButton(state => {
                                globalThis.location.href = "https://meta3d-local-9gacdhjl439cff76-1302358347.tcloudbaseapp.com/gts_old_play_pro/dist/index.html"

                                return Promise.resolve(state)
                            }, "enter_old", getLanguageTextData(readState(), languageKey.EnterOldVersion, language_), "", getClickSmallSoundResourceId(), "default")
                        } */}

                    {/* {
                        renderButton(state => {
                            globalThis.location.href = "https://meta3d-local-9gacdhjl439cff76-1302358347.tcloudbaseapp.com/multiplayer_demo/dist/index.html"

                            return Promise.resolve(state)
                        }, "enter_2.0", getLanguageTextData(readState(), languageKey.Enter2Version, language_), "", getClickSmallSoundResourceId(), "default")
                    } */}
                </Row>
                // :
                // <Row justify="center" align="top">
                //     <Title className="version">{_getVersion()}</Title>
                // </Row>

            }
            {/* <Row justify="center" align="top">
                <Title className="version">{_getVersion()}</Title>
            </Row> */}



            <Row justify="center" align="middle">
                {
                    renderButton4(state => {
                        dispatch(setPage(page.SelectLevel))

                        return Promise.resolve(state)
                    }, "cyan", "button", getLanguageTextData(readState(), languageKey.EnterGame, language_), getClickSmallSoundResourceId())
                }
                {/* {
                    renderImage(state => {
                        dispatch(setTargetScene({ scene: scene.Play, levelNumber: 1 }))

                        // dispatch(setPage(page.SelectChapter))
                        dispatch(setPage(page.Difficulty))

                        return Promise.resolve(state)
                    }, "./resource/ui/not_in_game/enter-game-button.png", false, NullableUtils.return_(getClickSmallSoundResourceId()))
                } */}
            </Row>
            <Row justify="center" align="middle">
                {
                    renderButton4(state => {
                        dispatch(setPage(page.Mod))

                        return Promise.resolve(state)
                    }, "cyan", "button", getLanguageTextData(readState(), languageKey.Mod, language_), getClickSmallSoundResourceId())
                }
                {/* {
                    renderImage(state => {
                        dispatch(setPage(page.Mod))

                        return Promise.resolve(state)
                    }, "./resource/ui/not_in_game/mod-button.png", false, NullableUtils.return_(getClickSmallSoundResourceId()))
                } */}
            </Row>
            <Row justify="center" align="middle">
                {
                    renderButton4(state => {
                        dispatch(setPage(page.Setting))

                        return Promise.resolve(state)
                    }, "cyan", "button", getLanguageTextData(readState(), languageKey.Setting, language_), getClickSmallSoundResourceId())
                }
                {/* {
                    // renderButton(state => {
                    //     dispatch(setPage(page.Setting))

                    //     return state
                    // }, "setting", "画面设置", getClickSmallSoundResourceId())

                    renderImage(state => {
                        dispatch(setPage(page.Setting))

                        return Promise.resolve(state)
                    }, "./resource/ui/not_in_game/setting-button.png", false, NullableUtils.return_(getClickSmallSoundResourceId()))
                } */}
            </Row>
            <Row justify="center" align="middle">
                {
                    renderButton4(state => {
                        dispatch(setPage(page.Website))

                        return Promise.resolve(state)
                    }, "cyan", "button", getLanguageTextData(readState(), languageKey.Website, language_), getClickSmallSoundResourceId())
                }
                {/* {
                    // renderButton(state => {
                    //     dispatch(setPage(page.Donate))

                    //     return state
                    // }, "donate", "赞助作者", getClickMiddleSoundResourceId())
                    renderImage(state => {
                        dispatch(setPage(page.Website))

                        return Promise.resolve(state)
                    }, "./resource/ui/not_in_game/enter-website-button.png", false, NullableUtils.return_(getClickSmallSoundResourceId()))
                } */}
            </Row>

            <section className="fixed-button">
                {
                    renderImage(state => {
                        dispatch(setPage(page.IndexActiveCode))

                        return Promise.resolve(state)
                    }, getLanguageImageData(readState(), languageImageKey.ActiveButton), "active", false, NullableUtils.return_(getClickMiddleSoundResourceId()))
                }


                {/* {
                    isChinese() ?
                        renderImage(state => {
                            globalThis.location.href = "https://www.yuque.com/u1408899/mkub70/egvnnbkcdb38pody"


                            return Promise.resolve(state)
                        }, getLanguageImageData(readState(), languageImageKey.FAQButton), "faq", false, NullableUtils.return_(getClickLargeSoundResourceId()))
                        : null
                } */}


                {
                    // isChinese() ?
                    renderButton(state => {
                        Modal.confirm({
                            content: <>
                                <Text >{getLanguageTextData(state, languageKey.IsLogout)}</Text>
                            </>,
                            confirmText: getLanguageTextData(state, languageKey.Confirm),
                            cancelText: getLanguageTextData(state, languageKey.Cancel),
                            onConfirm: handleEventHandler(_ => {
                                return Backend.removeLoginedUserName().then(_ => {
                                    dispatch(setPage(page.Login))
                                })
                            }),
                        })

                        return Promise.resolve(state)
                    }, "log-out", getLanguageTextData(readState(), languageKey.Logout, language_), "log-out", getClickSmallSoundResourceId(), "default")
                    // : null
                }

                {
                    renderImage(state => {
                        dispatch(setPage(page.Share))

                        return Promise.resolve(state)
                    }, getLanguageImageData(readState(), languageImageKey.ShareButton), "share", false, NullableUtils.return_(getClickMiddleSoundResourceId()))
                }

                <Selector
                    className="internation"
                    options={[
                        {
                            label: '中文',
                            value: language.Chinese,
                        },
                        {
                            label: 'English',
                            value: language.English,
                        },
                    ]}
                    defaultValue={[language_]}
                    multiple={false}
                    onChange={(arr) => {
                        if (arr.length == 0) {
                            return
                        }


                        let state = setLanguage(readState(), arr[0])

                        state = setAbstractState(state, Version.setVersion(getAbstractState(state), getVersionData(state)))

                        writeState(state)

                        setLanguage_(_ => arr[0])
                    }}
                />

                {
                    Version.isVersionUpdate(getAbstractState(readState())) ?
                        renderImage(state => {
                            let [newContentChi, newContentEng] = getNewContent(getAbstractState(state))

                            if (Device.isMobile()) {
                                Modal.alert({
                                    content: <>
                                        <Text className="update-notice-content">{isChinese() ? newContentChi : newContentEng}</Text>
                                    </>,
                                    cancelText: getLanguageTextData(state, languageKey.KnowInfo),
                                })
                            }
                            else {
                                Modal.confirm({
                                    content: <>
                                        <Text className="update-notice-content">{isChinese() ? newContentChi : newContentEng}</Text>
                                    </>,
                                    confirmText: getLanguageTextData(state, languageKey.More),
                                    cancelText: getLanguageTextData(state, languageKey.KnowInfo),
                                    onConfirm: handleEventHandler(_ => {
                                        globalThis.open(isChinese() ? "https://tieba.baidu.com/f?kw=%E5%B7%A8%E5%A4%A7%E5%A8%98%E7%9A%84%E7%8E%A9%E8%80%8D&ie=utf-8" : "https://discord.com/invite/JbhkqUJKFF", "_blank")
                                    }),
                                })
                            }

                            return Promise.resolve(state)
                        }, getLanguageImageData(readState(), languageImageKey.UpdateNotice), "update-notice", false, NullableUtils.return_(getClickMiddleSoundResourceId()))
                        : null
                }

                {
                    isGetReward && isCanGetReward(readState()) ?
                        renderImage(state => {
                            Modal.alert({
                                content: <>
                                    <Row justify="center" align="middle">
                                        <Text className="reward-content">{
                                            getLanguageTextVariableData(state, languageVariableKey.GetReward)(
                                                [
                                                    getRewardGemCount(state),
                                                    getRewardArtifactCount(state),
                                                    artifactRewardServices.map(service => service.getPropData(
                                                        getModAPI(readState()),
                                                        readState()
                                                    ).title)
                                                ]
                                            )
                                        }</Text>
                                    </Row>
                                </>,
                                confirmText: getLanguageTextData(state, languageKey.GetReward),
                                onConfirm: handleEventHandler(_ => {
                                    let state = readState()

                                    state = setGem(state, getTotalGem(state) + getRewardGemCount(state))

                                    state = artifactRewardServices.reduce((state, service) => {
                                        return addPropCount(state, service.getName(), 1)
                                    }, state)

                                    writeState(state)

                                    return handleNetworkRequest(state => {
                                        return setLastGetRewardTime(state)
                                            .then(updateRewardBackend)
                                            .then(writeState)
                                    }, (state) => {
                                        play(state, buildNeedToPlaySoundData(getRewardSoundResourceId(), getIsDebug(state), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

                                        setIsGetReward(_ => false)
                                    })
                                }),
                            })

                            return Promise.resolve(state)
                        }, getLanguageImageData(readState(), languageImageKey.GetRewardButton), "getreward", false, NullableUtils.return_(getClickMiddleSoundResourceId()))
                        : null
                }



                {/* {
                    isChinese() ?
                        renderImage(state => {
                            // globalThis.location.href = "https://www.yuque.com/u1408899/mkub70/svbonq0qgd5kol1g"
                            globalThis.location.href = "https://gts-play.cn/website/chinese/docs/%E4%BC%97%E7%AD%B9%E9%A1%BB%E7%9F%A5"


                            return Promise.resolve(state)
                        }, getLanguageImageData(readState(), languageImageKey.JoinCrowdFunding), "crowdfunding", false, NullableUtils.return_(getClickLargeSoundResourceId()))
                        : null
                } */}

            </section>
        </Layout>
    </Layout >
};

export default IndexMain;
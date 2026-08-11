import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from "../store/AppStore";
import { readState, writeState } from "../../business_layer/State";
import { Device } from 'meta3d-jiehuo-abstract';
import { renderButton, renderImage as renderButtonImage } from "./ButtonUtils";
import { NullableUtils } from 'meta3d-jiehuo-abstract';
import { getClickMiddleSoundResourceId } from '../../business_layer/Loader';
import { renderImage } from "./ImageUtils";
import { Modal } from 'antd-mobile';
import { LandscapeUtils } from 'meta3d-jiehuo-abstract';
import { resetTalentAndUpdateBackend } from '../../scene3d_layer/script/scene/scene_city/build/Talent';
import { markAliveAndUpdateBackend } from '../../scene3d_layer/script/scene/scene_city/character/Character';
import { addPropCount, getPropByName, getPropCount, subPropCount } from '../../scene3d_layer/script/scene/scene_city/reward/Prop';
import { propName } from '../../scene3d_layer/script/scene/scene_city/type/StateType';
import { updateRewardBackend } from '../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator';
import { getLanguageTextData, languageKey } from '../../scene3d_layer/internation/Data';
import { handleEventHandler } from './ErrorUtils';
import { handleNetworkRequest } from './BackendUtils';
import Text from 'antd/es/typography/Text';
import { getCaptureBlockService } from '../../scene3d_layer/mod/PropOtherMod';

export let renderReviveButtons = (state, judgeAndSelectFunc, isNeedActive, character, characterType_) => {
    let renderForceReviveButton = renderButton(state => {
        Modal.confirm({
            getContainer: LandscapeUtils.getRootDom(),
            content: getLanguageTextData(readState(), languageKey.ForceReviveContent),
            confirmText: getLanguageTextData(readState(), languageKey.Confirm),
            cancelText: getLanguageTextData(readState(), languageKey.Cancel),
            onConfirm: handleEventHandler(async () => {
                // let state = readState()

                if (isNeedActive) {
                    if (getPropCount(state, getCaptureBlockService(state).getName()) <= 0) {
                        Modal.alert({
                            content: getLanguageTextData(state, languageKey.CaptureNotEnough),
                            confirm: getLanguageTextData(state, languageKey.Confirm),
                        })

                        return Promise.resolve(state)
                    }

                    state = subPropCount(state, getCaptureBlockService(state).getName(), 1)

                    writeState(state)
                }

                await handleNetworkRequest(state => {
                    return updateRewardBackend(state).then(
                        state => resetTalentAndUpdateBackend(state, character)
                    ).then(state => {
                        return markAliveAndUpdateBackend(state, character, characterType_)
                    }).then(writeState)
                }, state => {
                    return judgeAndSelectFunc(state, character, isNeedActive)
                        .then(writeState)
                }, state => {
                    state = addPropCount(state, getCaptureBlockService(state).getName(), 1)

                    return Promise.resolve(state)
                })
            }),
        })

        return Promise.resolve(state)
    }, "revive_force", getLanguageTextData(readState(), languageKey.ForceRevive), "revive_force", getClickMiddleSoundResourceId(), "default")

    if (getPropCount(state, propName.Revive) > 0) {
        return <>
            {
                renderButton(state => {
                    Modal.confirm({
                        getContainer: LandscapeUtils.getRootDom(),
                        content: getLanguageTextData(readState(), languageKey.RemainTalentContent),
                        confirmText: getLanguageTextData(readState(), languageKey.Confirm),
                        cancelText: getLanguageTextData(readState(), languageKey.Cancel),
                        onConfirm: handleEventHandler(async () => {
                            let state = readState()

                            state = subPropCount(state, propName.Revive, 1)

                            writeState(state)

                            await handleNetworkRequest(state => {
                                return updateRewardBackend(state).then(state => {
                                    return markAliveAndUpdateBackend(state, character, characterType_)
                                }).then(writeState)
                            }, (state) => {
                                return judgeAndSelectFunc(state, character, isNeedActive)
                                    .then(writeState)
                            })
                        }),
                    })

                    return Promise.resolve(state)
                }, "revive_direct", getLanguageTextData(readState(), languageKey.DirectRevive), "revive_direct", getClickMiddleSoundResourceId(), "primary")
            }
            {
                renderForceReviveButton
            }
        </>
    }

    return renderForceReviveButton
}

export let renderCharacter = (
    judgeAndSelectFunc,
    isAlive, src, character, name, isNeedActive, resourceLevel, key, characterType_) => {
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
                !isAlive ?
                    (
                        renderImage("./resource/ui/not_in_game/dead.png", "dead", false)
                    )
                    : null
            }
        </Row>
        <Row justify="center" className="name">
            <Text className="name">{name}</Text>
        </Row>
        <Row justify="center" className="button">
            {
                isAlive ? renderButtonImage(state => {
                    return judgeAndSelectFunc(state, character, isNeedActive)
                }, isNeedActive ? "./resource/ui/not_in_game/select-button-need-active.png" : "./resource/ui/not_in_game/select-button.png", "", false, NullableUtils.return_(getClickMiddleSoundResourceId())) : renderReviveButtons(readState(), judgeAndSelectFunc, isNeedActive, character, characterType_)
            }
        </Row>
    </Col>
}
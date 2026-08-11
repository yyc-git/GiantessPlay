import "./MissionComplete.scss"

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Button, Row, Col } from 'antd';
import { List, Modal, Selector } from 'antd-mobile';
import { AppDispatch, AppState } from "../../../../store/AppStore";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, writeState } from "../../../../../business_layer/State";
import { setPage, setTargetScene } from "../../../../global/store/GlobalStore";
import { page, scene } from "../../../../global/store/GlobalStoreType";
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import Text from 'antd/es/typography/Text';
import * as  CityScene3D from '../../../../../business_layer/CityScene3D';
import { Camera } from "meta3d-jiehuo-abstract";
import { getOrbitControls } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { getLevelNumber, getSceneChapter, isGiantessCharacterType } from "../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { setAbstractState } from "../../../../../scene3d_layer/state/State";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { renderButton, renderButton2 } from "../../../../utils/ButtonUtils";
import { getClickLargeSoundResourceId, getClickSmallSoundResourceId } from "../../../../../business_layer/Loader";
import { enterNextLevel, exit } from "../../../../utils/MissionUtils";
import { Flow } from "meta3d-jiehuo-abstract";
import { checkEnterDoorAfterWait, findPreviousBossLevelNumber, handleMissionCompleteAfterWait, isCanEnterBossLevel, restoreToWait } from "../../../../../scene3d_layer/script/scene/scene_city/manage/mission/Mission";
import { getLanguageTextData, languageKey } from "../../../../../scene3d_layer/internation/Data";
import { setMissionComplete } from "../../store/SceneStore";
import { buildMissionComplete } from "../../../../utils/SceneUtils";
import { nullable } from "block/src/Type";
import { missionComplete } from "../../store/SceneStoreType";
import { handleEventHandler } from "../../../../utils/ErrorUtils";
import { getNextLevelData } from "../../../../../scene3d_layer/mod/SceneMod";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getActualLevelGem, getLevelGem } from "../../../../../scene3d_layer/script/scene/scene_city/reward/Gem";
import { getLevelCoin } from "../../../../../scene3d_layer/script/scene/scene_city/reward/Coin";
import { getGiantessDestroyUnitCountMap, getGiantessTotalDamageForce, getLittleManDestroyUnitCount, getLittleManDestroyUnitCountMap, getLittleManTotalDamageForce } from "../../../../../scene3d_layer/script/scene/scene_city/Statistic";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { computeActiveGemFactor, computeGemFactor, getCurrentDifficultyData } from "../../../../../scene3d_layer/script/scene/scene_city/difficulty/Difficulty";
import { renderImage } from "../../../../utils/ImageUtils";
import { getSnapshot as getSnapshotOctreeObjectUtils, isStatic } from "../../../../../scene3d_layer/script/scene/scene_city/utils/OctreeObjectUtils";
import { getSnapshot as getSnapshotLODQueueObjectUtils } from "../../../../../scene3d_layer/script/scene/scene_city/utils/LODQueueObjectUtils";
// import { isCars } from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/Cars";
import { isArmy } from "../../../../../scene3d_layer/script/scene/scene_city/utils/ArmyUtils";
import { getAllBlockServiceFuncWithDefault } from "../../../../../scene3d_layer/mod/Mod";
import { service } from "mmd-character-protocol/src/service/ServiceType";
import { modProtocolName } from "../../../../../scene3d_layer/mod/data/ModData";
import { getAllSelectCharacterData } from "../../../../../scene3d_layer/mod/MMDMod";
import { getRenderer } from "meta3d-jiehuo-abstract/src/Render";
// import { computeCoinByCoinFactor } from "../../../../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";

let MissionComplete: React.FC = () => {
    let [characterType_, setCharacterType] = useState(characterType.LittleMan)
    let [levelGameTime, setLevelGameTime] = useState("")

    // let currentSceneData = useSelector<AppState>((state) => state.global.currentSceneData)
    let missionComplete = useSelector<AppState>((state) => state.scene.missionComplete) as nullable<missionComplete>

    let dispatch: AppDispatch = useDispatch()

    let _getTitle = () => {
        // return isGiantessCharacterType(readState()) ? "巨大娘胜利了" : "小人胜利了"
        return getLanguageTextData(readState(), languageKey.MissionCompleteTitle)
    }

    // let _isContinue = (state) => {
    //     switch (getSceneChapter(state)) {
    //         case scene.Biwu:
    //             return false
    //         default:
    //             return true
    //     }
    // }

    let _renderNextLevel = (state) => {
        switch (getSceneChapter(state)) {
            case scene.Biwu:
            // if (getLevelNumber(state) < 3) {
            //     return renderButton2(state => {
            //         return enterNextLevel(state, [
            //             setIsShowModal,
            //             dispatch
            //         ], [getSceneChapter(state), getLevelNumber(state) + 1], page.Difficulty)
            //     }, "next", "下一关", "next", getClickLargeSoundResourceId())
            // }
            // else {
            //     return renderButton2(state => {
            //         return enterNextLevel(state, [
            //             setIsShowModal,
            //             dispatch
            //         ], [scene.Play, 1], page.Difficulty)
            //     }, "next", "下一关", "next", getClickLargeSoundResourceId())
            // }

            // return renderButton2(state => {
            //     return enterNextLevel(state,
            //         dispatch, [scene.Play, 1], page.Difficulty)
            // }, "next", getLanguageTextData(readState(), languageKey.EnterNextCityLevel), "next", getClickLargeSoundResourceId())
            default:
                return <>
                    {
                        missionComplete.nextLevelData.map(({ name, scene, levelNumber }) => {
                            return renderButton2(state => {
                                return enterNextLevel(state,
                                    dispatch, [scene, levelNumber], page.Difficulty)
                            }, "next", name, "next", getClickLargeSoundResourceId())
                        })
                    }
                </>
        }
    }

    let _renderWaitButton = (state) => {
        switch (getSceneChapter(state)) {
            case scene.Biwu:
                return renderButton(state => {
                    return getNextLevelData(state).then(data => {
                        dispatch(setMissionComplete(NullableUtils.return_(buildMissionComplete(false, data))))

                        state = restoreToWait(state)

                        state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))

                        state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                            dispatch(setMissionComplete(NullableUtils.return_(buildMissionComplete(true, data))))

                            return handleMissionCompleteAfterWait(state)
                            // }, 60))
                        }, 20))
                        // }, 2))

                        return Promise.resolve(state)
                    })
                }, "wait", getLanguageTextData(readState(), languageKey.Wait20S), "wait", getClickLargeSoundResourceId())
            default:
                //     return renderButton(state => {
                //         dispatch(setMissionComplete(NullableUtils.return_(buildMissionComplete(false))))

                //         state = restoreToWait(state)

                //         state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))

                //         state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
                //             // setIsShowModal(() => true)

                //             return Promise.resolve(checkEnterDoorAfterWait(state))
                //         }, 5))

                //         return Promise.resolve(state)
                //     }, "wait", getLanguageTextData(readState(), languageKey.Wait5S), "wait", getClickLargeSoundResourceId())
                return null
        }
    }

    let _renderSnapshot = (state, namePrefix) => {
        let snapshot, className = "destroy_unit_snapshot"
        if (isStatic(state, namePrefix)) {
            snapshot = getSnapshotOctreeObjectUtils(state, namePrefix)
        }
        else if (isArmy(state, namePrefix)) {
            snapshot = getSnapshotLODQueueObjectUtils(state, namePrefix)
        }
        else {
            let mmdCharacter = namePrefix

            let result = getAllSelectCharacterData(state).find(d => {
                return d[1] == mmdCharacter
            })

            if (NullableUtils.isNullable(result)) {
                return null
            }

            snapshot = NullableUtils.getExn(result)[0]
            className = "destroy_unit_snapshot_mmd"

        }

        return renderImage(snapshot, className, false)
    }

    let _renderDestroyUnitCount = () => {
        let state = readState()

        let map
        switch (characterType_) {
            case characterType.LittleMan:
                map = getLittleManDestroyUnitCountMap(state)
                break
            case characterType.Giantess:
                map = getGiantessDestroyUnitCountMap(state)
                break
        }

        if (MutableRecordUtils.getCount(map) == 0) {
            return <Text className="">{getLanguageTextData(readState(), languageKey.None)}</Text>
        }

        return <List>
            {
                ArrayUtils.groupByStep(
                    MutableRecordUtils.entries(map).sort((a, b) => {
                        return a[0].charCodeAt(0) - b[0].charCodeAt(0)
                    }),
                    2
                )
                    .map((arr) => {
                        return <List.Item>
                            <Row justify="center" className="row">
                                {
                                    arr.map(([namePrefix, count]) => {
                                        return <>
                                            <Col className="col" span={12}>
                                                <Row justify="center" className="row">
                                                    {
                                                        _renderSnapshot(state, namePrefix)
                                                    }
                                                </Row>
                                                <Row justify="center" className="row">
                                                    {/* <Col className="col destroy_unit_count" span={2}> */}
                                                    <Text className="">{`${count}`}</Text>
                                                    {/* </Col> */}
                                                </Row>
                                            </Col>
                                        </>
                                    })
                                }
                            </Row>
                        </List.Item>
                    })
            }
        </List>
    }

    let _getRewardClassName = (rewardFactor) => {
        if (rewardFactor > 1) {
            return "red"
        }
        else if (rewardFactor == 1) {
            return "black"
        }
        else {
            return "green"
        }
    }


    useEffect(() => {
        setLevelGameTime(_ => CityScene3D.getGameTimeString(readState()))
    }, []);

    return NullableUtils.getWithDefault(
        NullableUtils.map(missionComplete => {
            return <Modal getContainer={LandscapeUtils.getRootDom()}
                visible={missionComplete.isShowModal}
                closeOnMaskClick={false}
                showCloseButton={false}
                className="mission_complete"
                title={
                    <Title className="title">{_getTitle()}</Title>
                }
                content={
                    <>
                        {/* <Row justify="center" className="row">
                    <Title className="destroyed_rate">{`破坏程度：${CityScene3D.getDestroyedRate(readState())}%`}</Title>
                </Row> */}
                        <Row justify="center" className="button">
                            {
                                _renderNextLevel(readState())
                            }
                            {/* {
                        _isContinue(readState()) ?
                            <Button key={"continue"} className="continue" onClick={_ => {
                                let state = readState()

                                state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))

                                setIsShowModal(() => false)
                            }}>
                                {`继续游戏`}
                            </Button >
                            : null
                    } */}
                            {
                                isCanEnterBossLevel(readState()) ?
                                    renderButton2(state => {
                                        return enterNextLevel(state,
                                            dispatch,
                                            [scene.Biwu, NullableUtils.getWithDefault(
                                                NullableUtils.map(previousBossLevelNumber => {
                                                    if (previousBossLevelNumber >= 3) {
                                                        return 1
                                                    }

                                                    return previousBossLevelNumber + 1
                                                }, findPreviousBossLevelNumber(state)),
                                                1
                                            )], page.Difficulty)
                                    }, "next_boss", getLanguageTextData(readState(), languageKey.EnterBossLevel), "next_boss", getClickLargeSoundResourceId())
                                    : null
                            }
                            {
                                _renderWaitButton(readState())
                            }
                            <Button key={"index"} className="index" type="primary" onClick={handleEventHandler(_ => {
                                return exit(dispatch)
                            })}>
                                {getLanguageTextData(readState(), languageKey.BackToIndex)}
                            </Button >
                        </Row>

                        <Row justify="center" className="row">
                            <Col className="col" span={14}>
                                <Row justify="center" className="row">
                                    <Selector
                                        defaultValue={String(characterType_)}
                                        onChange={arr => {
                                            let state = readState()

                                            let value = arr.length > 0 ? arr[0] : String(characterType_)

                                            setCharacterType(_ => Number(value))

                                            writeState(state)
                                        }}
                                        options={[
                                            { value: String(characterType.LittleMan), label: getLanguageTextData(readState(), languageKey.LittleMan) },
                                            { value: String(characterType.Giantess), label: getLanguageTextData(readState(), languageKey.Giantess) },
                                        ]}
                                    />
                                </Row>

                                <Row justify="center" className="row">
                                    <Title className="title">{`${getLanguageTextData(readState(), languageKey.TotalDamage)}：${Math.round(
                                        characterType_ == characterType.LittleMan ? getLittleManTotalDamageForce(readState()) : getGiantessTotalDamageForce(readState())
                                    )
                                        }`}</Title>
                                </Row>

                                <Row justify="center" className="row">
                                    <Title className="title">{`${getLanguageTextData(readState(), languageKey.DestroyUnitCount)}`}</Title>
                                </Row>
                                <Row justify="center" className="row">
                                    {
                                        _renderDestroyUnitCount()
                                    }
                                </Row>


                            </Col>

                            <Col className="col" span={10}>
                                <Row justify="center" className="row">
                                    <Title className="title">{`${getLanguageTextData(readState(), languageKey.LevelGameTime)}：${levelGameTime}`}</Title>
                                </Row>

                                <Row justify="center" className="row">
                                    {/* <Title className="title">{`${getLanguageTextData(readState(), languageKey.LevelGem)}：${getActualLevelGem(readState())}(${Math.round(computeGemFactor(readState(), getCurrentDifficultyData(readState())) * 100)}%` + (computeActiveGemFactor(readState()) > 1 ? ` * ${Math.round(computeActiveGemFactor(readState()) * 100)}%)` : ")")}</Title> */}
                                    <Title className="title-inline">{`${getLanguageTextData(readState(), languageKey.LevelGem)}`}</Title>
                                    {renderImage("meta3d-jiehuo-abstract/particle/gem.png", "gem", false)}
                                    <Title className="title-inline">{`：${getActualLevelGem(readState())}`}</Title>
                                </Row>
                                <Row justify="center" className="row">
                                    <Text className="title2 black">{getLevelGem(readState())}</Text>
                                    <Text className={`title2 ${_getRewardClassName(computeGemFactor(readState(), getCurrentDifficultyData(readState())))}`}>{`* ${Math.round(computeGemFactor(readState(), getCurrentDifficultyData(readState())) * 100)}%(${getLanguageTextData(readState(), languageKey.RewardLevel)})`}</Text>
                                    <Text className={`title2 ${_getRewardClassName(computeActiveGemFactor(readState()))}`}>{computeActiveGemFactor(readState()) > 1 ? `* ${Math.round(computeActiveGemFactor(readState()) * 100)}%(${getLanguageTextData(readState(), languageKey.ActiveReward)})` : ""}</Text>
                                </Row>

                                <Row justify="center" className="row">
                                    {/* <Title className="title">{`${getLanguageTextData(readState(), languageKey.LevelCoin)}：${computeCoinByCoinFactor(getLevelCoin(readState()), readState())}`}</Title> */}
                                    <Title className="title-inline">{`${getLanguageTextData(readState(), languageKey.LevelCoin)}`}</Title>
                                    {renderImage("meta3d-jiehuo-abstract/particle/coin.png", "coin", false)}
                                    <Title className="title-inline">{`：${getLevelCoin(readState())}`}</Title>
                                </Row>
                            </Col>
                        </Row>


                    </>
                }
            >
            </Modal>
        }, missionComplete),
        null
    )
};

export default MissionComplete;
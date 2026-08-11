import "./Debug.scss"

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Select, Layout, Button, Row, Menu, Input, InputNumber } from 'antd';
import { Modal, Selector } from 'antd-mobile';
import { LandscapeUtils } from "meta3d-jiehuo-abstract";
import Title from "antd/es/typography/Title";
import * as  CityScene3D from '../../../../../business_layer/CityScene3D';
import { renderButton } from "../../../../utils/ButtonUtils";
import { renderSwitch, renderSwitchPromise } from "../../../../utils/SwitchUtils";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../../../business_layer/State";
import { Matrix4, Vector3 } from "three";
import { PathFind } from "meta3d-jiehuo-abstract";
import { setIsDebug } from "../../../../../business_layer/Scene3D";
import { getIsDebug } from "../../../../../scene3d_layer/script/scene/Scene";
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { setExcitement } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Excitement";
import { getCustomDuration, playSmallerAnimation, removeCustomDuration, setCustomDuration } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Animation";
import { getCurrentMMDCharacterName, isGirl, isUseGirl, triggerAction, getCurrentUsedGirls, getFirstUsedGirl, hasUsedGirl, buildNameByUsedGirl, getSpecificUsedGirl } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
// import { setNeedShowSkillBar } from "../../../../../scene3d_layer/script/scene/scene_city/UI";
import { getBreastTransformPrefix, getLittleHandTransformPrefix, getPickTransformPrefix, getPutToBreastTransformPrefix, getPutToShoeTransformPrefix, getUBControlledTransformPrefix } from "../../../../../scene3d_layer/script/scene/scene_city/utils/SkeletonUtils";
import { getGrid, getGridForGirl } from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/PathFind";
import { actionName } from "../../../../../scene3d_layer/script/scene/scene_city/data/DataType";
import { actionName as littleManActionName } from "../../../../../scene3d_layer/script/scene/scene_city/little_man_data/DataType"
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { generateCommanders, generateFlameVehicles, generateInfantrys, generateLaserers, generateMelees, generateMissileVehicles, generateRocketeers, generateTanks } from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/ArmyManager";
import { getConfigData, getSceneChapter, isGiantessCharacterType, isLittleCharacterType, setConfigData } from "../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { getHpData } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Cloth";
import { genImageMaskStyle } from "antd/es/image/style";
import * as ShellTurret from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/milltary_building/ShellTurret";
import * as MissileTurret from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/milltary_building/MissileTurret";
import { scene, sceneData } from "../../../../global/store/GlobalStoreType";
import { attackTarget, autoDifficulty, camp, collisionPart, damageType, missionFinishStatus, pose } from "../../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import * as BehaviourUtils from "./../../../../../scene3d_layer/script/scene/scene_city/behaviour_tree/action_node/Utils"
import { getTuple2First } from "meta3d-jiehuo-abstract/src/utils/TupleUtils";
import { isPose } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Pose";
import { getAllCollisionParts, getNearestUsedGirl } from "../../../../../scene3d_layer/script/scene/scene_city/utils/CollisionUtils";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { getPosition, getWorldMatrix, getWorldPosition, setPositionAndComputeBox } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/Transform";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { getStateMachine, setHp, getHp, setStateMachine, getName as getLittleManName, getBox, handleExitControlled } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/LittleMan";
import { createClimbState } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/FSMState";
import { getClimbState, setClimbState } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/climb/ClimbManager";
import { climbPlane } from "../../../../../scene3d_layer/script/scene/scene_city/manage/biwu/level3/ManageScene";
import { triggerMainEvent } from "../../../../../scene3d_layer/script/scene/scene_city/game_event/GameEvent";
import { eventName } from "../../../../../scene3d_layer/script/scene/scene_city/data/GameEventData";
import { generateMilltaryBuildings, generateMilltaryVehicles, generateSoldiers } from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/generator/ArmyGenerator";
import { handleMissionComplete, handleMissionFail, setIsMissionFinish } from "../../../../../scene3d_layer/script/scene/scene_city/manage/mission/Mission";
import { addGemInLevel } from "../../../../../scene3d_layer/script/scene/scene_city/reward/Gem";
import { applyUpgradeFuncs, applyUpgradeFuncsByRandomLevel, getGiantessExperienceValue, getLittleManExperienceValue, getOneLevelExperienceValue, setExperienceValue } from "../../../../../scene3d_layer/script/scene/scene_city/build/Upgrade";
import { List } from "immutable";
import { getSavedStudyActions, setCurrentStudyActions, setMaxBiggerCount, setSavedStudyActions } from "../../../../../scene3d_layer/script/scene/scene_city/girl/player/Girl";
import { getNow } from "../../../../../scene3d_layer/script/scene/scene_city/Time";
import { computeArmyCount } from "../../../../../scene3d_layer/script/scene/scene_city/difficulty/HeatImplementer";
import { set } from "../../../../utils/SettingUtils";
import { Device } from "meta3d-jiehuo-abstract";
import { damageGiantess, destroyGiantess, getMaxForce } from "../../../../../scene3d_layer/script/scene/scene_city/utils/DamageUtils";
import { weaponType } from "../../../../../scene3d_layer/script/scene/scene_city/data/ValueType";
import { hideAim } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/AimUtils";
import { AppState } from "../../../../store/AppStore";
import { buildFakeGirlWeaponValue, getGirlWeaponType, getPivotWorldPosition } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Utils";
import { getPlayerPosition } from "../../../../../scene3d_layer/script/scene/scene_city/utils/PlayerUtils";
import { generateArmyInSpecificPosition } from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/generator/utils/ArmyGeneratorUtils";
import { getSizeFactor, multiplyScalar } from "../../../../../scene3d_layer/mod/Mod";
// import { off, on } from "../../../../../business_layer/Event";
// import { Event } from "meta3d-jiehuo-abstract";
// import { NullableUtils } from "meta3d-jiehuo-abstract";
// import { markEnter } from "../../../../../scene3d_layer/script/scene/scene_city/scenario/ScenarioManager";
import { generateEliteGiantesses, generateMagicGiantesses, generateMeleeGiantesses } from "../../../../../scene3d_layer/mod/EliteGiantessMod";
import { showDoor } from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/Mission";
import { setAttribute } from "../../../../../scene3d_layer/script/scene/scene_city/utils/build/GiantessBuildUtils";
import { buildFuncData } from "../../../../../scene3d_layer/script/scene/scene_city/data/FuncData";
import { usedGirlEnum } from "meta3d-jiehuo-abstract/src/type/StateType";
import { studyActions } from "../../../../../scene3d_layer/script/scene/scene_city/utils/build/LittleManBuildUtils";
import { getFastRunBlockService, getSwipBlockService } from "../../../../../scene3d_layer/mod/SkillLittleManMod";
import { getUpgradeFuncsByName } from "../../../../../scene3d_layer/mod/UpgradeMod";
import { getBody } from "../../../../../scene3d_layer/script/scene/scene_city/data/mmd/MMDData";
import { partialScaleBreast, partialScaleTorsor } from "../../../../../scene3d_layer/script/scene/scene_city/utils/PartialScaleGiantessUtils";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getStompBlockService, getStompRubBlockService, getLeftStompBlockService, getJumpStompBlockService, getStandToSitBlockService, getSitToStandBlockService, getSitRubBlockService, getSitTightenLegBlockService, getPickToUBBlockService, getUBToPickBlockService, getThrustBlockService, getInsertBlockService, getFreeUBBlockService, getPutToBreastBlockService, getPutToShoeBlockService, getFreeBreastBlockService, getFreeShoeBlockService, getBreastPressBlockService, getBreastPressRubBlockService, getCrawlBeatBlockService, getCrawlLickBlockService, getSprayMilkBlockService } from "../../../../../scene3d_layer/mod/SkillGiantessMod";
import { destoryAllUnits } from "../../../../../scene3d_layer/script/scene/scene_city/Debug";
import { insertUBHandler, pickupHandler, putToBreastHandler, putToShoeHandler } from "../../../../../scene3d_layer/script/scene/scene_city/girl/PickPose";
import { getAllFlattenAliveArmyData } from "../../../../../scene3d_layer/script/scene/scene_city/utils/ArmyUtils";
import { getCollisionPartOBB } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Collision";
import { apply, getAllCareerData } from "../../../../../scene3d_layer/mod/CareerMod";
import { getCharacterType } from "meta3d-jiehuo-abstract/src/scene/Scene";
import { Scene } from "meta3d-jiehuo-abstract";
import { setSelectedCareerData } from "../../../../../scene3d_layer/script/scene/scene_city/build/Career";
import { setAutoDifficulty } from "../../../../../scene3d_layer/script/scene/scene_city/difficulty/Difficulty";

enum zone {
    Instruction,
    LittleManInstruction,
    GiantessInstruction,
    AttackCityInstruction,
    BiwuInstruction,
    ProtectInstruction,
    Transform,
    CollisionShape,
}

enum armyCategory {
    Infantry,
    Rocketeer,
    Laser,
    Commander,
    Melee,

    Tank,
    MissileVehicle,
    FlameVehicle,

    ShellTurret,
    MissileTurret,


    MeleeGiantess,
    MagicGiantess,
}

let Debug: React.FC = ({ setIsShowDebug }) => {
    let currentSceneData: any = useSelector<AppState>((state) => state.global.currentSceneData)

    // let [zone_, setZone] = useState(zone.Instruction)
    // let [current, setCurrent] = useState(zone.Instruction)

    let [_, setRefresh] = useState(Math.random())


    let _getDefaultValue = () => -100

    let [pose_, setPose] = useState(_ => pose.All)
    let [collisionPart_, setCollisionPart] = useState(_ => collisionPart.Head)
    let [isTwoBone, setIsTwoBone] = useState(_ => true)
    let [centerFactor, setCenterFactor] = useState(_ => _getDefaultValue())
    let [frontDirectionScalar, setFrontDirectionScalar] = useState(_ => _getDefaultValue())
    let [rightDirectionScalar, setRightDirectionScalar] = useState(_ => _getDefaultValue())
    let [upDirectionScalar, setUpDirectionScalar] = useState(_ => _getDefaultValue())
    let [size, setSize] = useState(_ => [_getDefaultValue(), _getDefaultValue(), _getDefaultValue()])
    let [isUseGirlRotation, setIsUseGirlRotation] = useState(_ => false)
    let [rotation, setRotation] = useState(_ => [_getDefaultValue(), _getDefaultValue(), _getDefaultValue()])
    let [upgradeBlockName, setUpgradeBlockName] = useState(_ => "")
    let [careerName, setCareerName] = useState(_ => "")
    let [usedGirlIndex, setUsedGirlIndex] = useState(0)

    let _getPoseData = (arr) => {
        return _getValue(
            NullableUtils.map(arr => {
                return NullableUtils.getWithDefault(
                    NullableUtils.map(d => {
                        return d.value
                    }, arr.find(d => d.pose == pose_)),
                    _getDefaultValue()
                )
            }, arr)
        )
    }

    let _getValue = (value, defaultValue = _getDefaultValue() as any) => {
        return NullableUtils.getWithDefault(
            value,
            defaultValue
        )
    }

    let _renderCollisionShape = (className) => {
        return hasUsedGirl(readState()) ?
            <section key={className} className={className}>
                {/* <span>{title}</span> */}
                {
                    renderButton((state) => {
                        state = setConfigData(state, {
                            ...getConfigData(state),
                            collisionShapeData: getConfigData(state).collisionShapeData.map(d => {
                                if (d.mmds.includes(getCurrentMMDCharacterName(state, getSpecificUsedGirl(state, usedGirlIndex)))
                                    && d.collisionPart == collisionPart_
                                ) {
                                    // if (isTwoBone) {
                                    if (!NullableUtils.isNullable(
                                        d.twoBones
                                    )) {
                                        return {
                                            ...d,
                                            twoBones: {
                                                ...d.twoBones,
                                                centerFactor: centerFactor == _getDefaultValue() ? d.twoBones.centerFactor : centerFactor,
                                                frontDirectionScalar: frontDirectionScalar == _getDefaultValue() ? d.twoBones.frontDirectionScalar : [
                                                    {
                                                        pose: pose.All,
                                                        value: frontDirectionScalar
                                                    },
                                                    {
                                                        pose: pose_,
                                                        value: frontDirectionScalar
                                                    }
                                                ],
                                                upDirectionScalar: upDirectionScalar == _getDefaultValue() ? d.twoBones.upDirectionScalar : [
                                                    {
                                                        pose: pose.All,
                                                        value: upDirectionScalar
                                                    },
                                                    {
                                                        pose: pose_,
                                                        value: upDirectionScalar
                                                    }
                                                ],
                                                rightDirectionScalar: rightDirectionScalar == _getDefaultValue() ? d.twoBones.rightDirectionScalar : [
                                                    {
                                                        pose: pose.All,
                                                        value: rightDirectionScalar
                                                    },
                                                    {
                                                        pose: pose_,
                                                        value: rightDirectionScalar
                                                    }
                                                ],
                                                size: ArrayUtils.isArraysEqual(size, [_getDefaultValue(), _getDefaultValue(), _getDefaultValue()]) ? d.twoBones.size : [
                                                    {
                                                        pose: pose.All,
                                                        value: multiplyScalar(size, getSizeFactor(state))
                                                    },
                                                    {
                                                        pose: pose_,
                                                        value: multiplyScalar(size, getSizeFactor(state))
                                                    }
                                                ],
                                                rotation: ArrayUtils.isArraysEqual(rotation, [_getDefaultValue(), _getDefaultValue(), _getDefaultValue()]) ? d.twoBones.rotation : rotation,

                                                isUseGirlRotation,
                                            }
                                        }
                                    }

                                    return {
                                        ...d,
                                        oneBone: {
                                            ...d.oneBone,
                                            frontDirectionScalar: frontDirectionScalar == _getDefaultValue() ? d.oneBone.frontDirectionScalar : [
                                                {
                                                    pose: pose.All,
                                                    value: frontDirectionScalar
                                                },
                                                {
                                                    pose: pose_,
                                                    value: frontDirectionScalar
                                                }
                                            ],
                                            upDirectionScalar: upDirectionScalar == _getDefaultValue() ? d.oneBone.upDirectionScalar : [
                                                {
                                                    pose: pose.All,
                                                    value: upDirectionScalar
                                                },
                                                {
                                                    pose: pose_,
                                                    value: upDirectionScalar
                                                }
                                            ],
                                            rightDirectionScalar: rightDirectionScalar == _getDefaultValue() ? d.oneBone.rightDirectionScalar : [
                                                {
                                                    pose: pose.All,
                                                    value: rightDirectionScalar
                                                },
                                                {
                                                    pose: pose_,
                                                    value: rightDirectionScalar
                                                }
                                            ],
                                            size: ArrayUtils.isArraysEqual(size, [_getDefaultValue(), _getDefaultValue(), _getDefaultValue()]) ? d.oneBone.size : [
                                                {
                                                    pose: pose.All,
                                                    value: multiplyScalar(size, getSizeFactor(state))
                                                },
                                                {
                                                    pose: pose_,
                                                    value: multiplyScalar(size, getSizeFactor(state))
                                                }
                                            ],

                                            rotation: ArrayUtils.isArraysEqual(rotation, [_getDefaultValue(), _getDefaultValue(), _getDefaultValue()]) ? d.oneBone.rotation : rotation,

                                            isUseGirlRotation,
                                        }
                                    }
                                }

                                return d
                            })
                        })

                        return Promise.resolve(state)
                    }, "commit_collision_shape", "提交")

                }

                <Select
                    style={{ width: 160 }}
                    defaultValue={String(pose_)}
                    onChange={value => {
                        setPose(_ => value)
                    }}
                    options={
                        [
                            { value: String(pose.All), label: String(pose.All) },
                            { value: String(pose.Stand), label: String(pose.Stand) },
                            { value: String(pose.Pick), label: String(pose.Pick) },
                            { value: String(pose.Crawl), label: String(pose.Crawl) },
                            { value: String(pose.Sit), label: String(pose.Sit) },

                            { value: String("HeavyStressingLie"), label: String("HeavyStressingLie") }
                        ]
                    }
                />
                <Select
                    style={{ width: 160 }}
                    defaultValue={String(collisionPart_)}
                    onChange={value => {
                        setCollisionPart(_ => value)

                        let state = readState()

                        let data = NullableUtils.getExn(getConfigData(state).collisionShapeData.find(d => {
                            return d.mmds.includes(getCurrentMMDCharacterName(state, getSpecificUsedGirl(state, usedGirlIndex))) && d.collisionPart == value
                        }))

                        setIsTwoBone(_ => !NullableUtils.isNullable(data.twoBones))

                        NullableUtils.forEach(oneBone => {
                            setFrontDirectionScalar(_ => _getPoseData(oneBone.frontDirectionScalar))
                            setUpDirectionScalar(_ => _getPoseData(oneBone.upDirectionScalar))
                            setRightDirectionScalar(_ => _getPoseData(oneBone.rightDirectionScalar))

                            setSize(_ => _getPoseData(oneBone.size))

                            setRotation(_ => _getValue(oneBone.rotation, [_getDefaultValue(), _getDefaultValue(), _getDefaultValue()]))
                            setIsUseGirlRotation(_ => _getValue(oneBone.isUseGirlRotation, false))
                        }, data.oneBone)

                        NullableUtils.forEach(twoBones => {
                            setCenterFactor(_ => _getValue(twoBones.centerFactor))
                            setFrontDirectionScalar(_ => _getPoseData(twoBones.frontDirectionScalar))
                            setUpDirectionScalar(_ => _getPoseData(twoBones.upDirectionScalar))
                            setRightDirectionScalar(_ => _getPoseData(twoBones.rightDirectionScalar))

                            setSize(_ => _getPoseData(twoBones.size))

                            setRotation(_ => _getValue(twoBones.rotation, [_getDefaultValue(), _getDefaultValue(), _getDefaultValue()]))
                            setIsUseGirlRotation(_ => _getValue(twoBones.isUseGirlRotation, false))
                        }, data.twoBones)
                    }}
                    options={
                        getAllCollisionParts(readState(), getFirstUsedGirl(readState())).map(collisionPart_ => {
                            return { value: String(collisionPart_), label: String(collisionPart_) }
                        })
                    }
                />
                {
                    renderSwitch((state, isTwoBone) => {
                        setIsTwoBone(_ => isTwoBone)

                        return state
                    }, isTwoBone, "单骨骼", "双骨骼", "two_bone")
                }
                {
                    isTwoBone ? <>
                        <span>c</span>
                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="centerFactor" onChange={(value) => {
                                setCenterFactor(_ => value)
                            }} value={centerFactor}
                        />
                        <span>f-r-u</span>
                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="frontDirectionScalar" onChange={(value) => {
                                setFrontDirectionScalar(_ => value)
                            }} value={frontDirectionScalar}
                        />
                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="rightDirectionScalar" onChange={(value) => {
                                setRightDirectionScalar(_ => value)
                            }} value={rightDirectionScalar}
                        />
                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="upDirectionScalar" onChange={(value) => {
                                setUpDirectionScalar(_ => value)
                            }} value={upDirectionScalar}
                        />
                        <span>size</span>
                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="" onChange={(value) => {
                                setSize(_ => [value, size[1], size[2]])
                            }} value={size[0]}
                        />
                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="" onChange={(value) => {
                                setSize(_ => [size[0], value, size[2]])
                            }} value={size[1]}
                        />
                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="" onChange={(value) => {
                                setSize(_ => [size[0], size[1], value])
                            }} value={size[2]}
                        />

                        <span>r</span>
                        {
                            renderSwitch((state, isUseGirlRotation) => {
                                setIsUseGirlRotation(_ => isUseGirlRotation)

                                return state
                            }, isUseGirlRotation, "not use", "use", "isUseGirlRotation")
                        }
                        {/* <InputNumber
                        defaultValue={_getDefaultValue()}
                        step="0.01"
                        placeholder="" onChange={(value) => {
                            setRotation(_ => value)
                        }} value={rotation}
                    /> */}

                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="" onChange={(value) => {
                                setRotation(_ => [value, rotation[1], rotation[2]])
                            }} value={rotation[0]}
                        />
                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="" onChange={(value) => {
                                setRotation(_ => [rotation[0], value, rotation[2]])
                            }} value={rotation[1]}
                        />
                        <InputNumber
                            defaultValue={_getDefaultValue()}
                            step="0.01"
                            placeholder="" onChange={(value) => {
                                setRotation(_ => [rotation[0], rotation[1], value])
                            }} value={rotation[2]}
                        />
                    </>
                        :
                        <>
                            <span>f-r-u</span>
                            <InputNumber
                                defaultValue={_getDefaultValue()}
                                step="0.01"
                                placeholder="frontDirectionScalar" onChange={(value) => {
                                    setFrontDirectionScalar(_ => value)
                                }} value={frontDirectionScalar}
                            />
                            <InputNumber
                                defaultValue={_getDefaultValue()}
                                step="0.01"
                                placeholder="rightDirectionScalar" onChange={(value) => {
                                    setRightDirectionScalar(_ => value)
                                }} value={rightDirectionScalar}
                            />
                            <InputNumber
                                defaultValue={_getDefaultValue()}
                                step="0.01"
                                placeholder="upDirectionScalar" onChange={(value) => {
                                    setUpDirectionScalar(_ => value)
                                }} value={upDirectionScalar}
                            />
                            <span>size</span>
                            <InputNumber
                                defaultValue={_getDefaultValue()}
                                step="0.01"
                                placeholder="" onChange={(value) => {
                                    setSize(_ => [value, size[1], size[2]])
                                }} value={size[0]}
                            />
                            <InputNumber
                                defaultValue={_getDefaultValue()}
                                step="0.01"
                                placeholder="" onChange={(value) => {
                                    setSize(_ => [size[0], value, size[2]])
                                }} value={size[1]}
                            />
                            <InputNumber
                                defaultValue={_getDefaultValue()}
                                step="0.01"
                                placeholder="" onChange={(value) => {
                                    setSize(_ => [size[0], size[1], value])
                                }} value={size[2]}
                            />


                            <span>r</span>
                            {
                                renderSwitch((state, isUseGirlRotation) => {
                                    setIsUseGirlRotation(_ => isUseGirlRotation)

                                    return state
                                }, isUseGirlRotation, "not use", "use", "isUseGirlRotation")
                            }
                            {/* <InputNumber
                        defaultValue={_getDefaultValue()}
                        step="0.01"
                        placeholder="" onChange={(value) => {
                            setRotation(_ => value)
                        }} value={rotation}
                    /> */}

                            <InputNumber
                                defaultValue={_getDefaultValue()}
                                step="0.01"
                                placeholder="" onChange={(value) => {
                                    setRotation(_ => [value, rotation[1], rotation[2]])
                                }} value={rotation[0]}
                            />
                            <InputNumber
                                defaultValue={_getDefaultValue()}
                                step="0.01"
                                placeholder="" onChange={(value) => {
                                    setRotation(_ => [rotation[0], value, rotation[2]])
                                }} value={rotation[1]}
                            />
                            <InputNumber
                                defaultValue={_getDefaultValue()}
                                step="0.01"
                                placeholder="" onChange={(value) => {
                                    setRotation(_ => [rotation[0], rotation[1], value])
                                }} value={rotation[2]}
                            />
                        </>
                }

                {
                    renderButton((state) => {
                        return Promise.resolve(partialScaleTorsor(state, getSpecificUsedGirl(state, usedGirlIndex), NumberUtils.getRandomFloat(0, 1)))
                    }, "", "躯干变大")
                }
                {
                    renderButton((state) => {
                        return Promise.resolve(partialScaleBreast(state, getSpecificUsedGirl(state, usedGirlIndex), NumberUtils.getRandomFloat(0, 2)))
                    }, "", "胸部变大")
                }
            </section>
            : null
    }

    let _renderTransform = (className, title, prefix, key) => {
        return <section key={key} className={className}>
            <span>{title}</span>
            <InputNumber
                defaultValue="0"
                step="0.1"
                placeholder="posx" onChange={(value) => {
                    globalThis[prefix + "tx"] = value
                    setRefresh(_ => Math.random())
                }} value={globalThis[prefix + "tx"]}
            />
            <InputNumber
                defaultValue="0"
                step="0.1"
                placeholder="posy" onChange={(value) => {
                    globalThis[prefix + "ty"] = value
                    setRefresh(_ => Math.random())
                }} value={globalThis[prefix + "ty"]}
            />
            <InputNumber
                defaultValue="0"
                step="0.1"
                placeholder="posz" onChange={(value) => {
                    globalThis[prefix + "tz"] = value
                    setRefresh(_ => Math.random())
                }} value={globalThis[prefix + "tz"]}
            />



            {/* <Input placeholder="angle" onChange={(e) => {
                        globalThis[prefix + "angle"] = e.target.value
                    }} value={globalThis[prefix + "angle"]} /> */}

            <InputNumber
                defaultValue="0"
                min="-3.17"
                max="3.17"
                step="0.1"
                placeholder="angle" onChange={(value) => {
                    globalThis[prefix + "angle"] = value
                    setRefresh(_ => Math.random())
                }} value={globalThis[prefix + "angle"]}
            />


            {/* <Selector
                        defaultValue={"x"}
                        onChange={arr => {
                            let value = arr.length > 0 ? Number(arr[0]) : "x"

                            let axis
                            switch (value) {
                                case "x":
                                    axis = new Vector3(1, 0, 0)
                                    break
                                case "y":
                                    axis = new Vector3(0, 1, 0)
                                    break
                                case "z":
                                    axis = new Vector3(0, 0, 1)
                                    break
                            }

                            globalThis[prefix + "a1"] = axis
                        }}
                        options={
                            [
                                { value: "x", label: "x" },
                                { value: "y", label: "y" },
                                { value: "z", label: "z" },
                            ]
                        }
                    /> */}

            {/* <Input placeholder="ax" onChange={(e) => {
                        globalThis[prefix + "ax"] = e.target.value
                    }} value={globalThis[prefix + "ax"]} />
                    <Input placeholder="ay" onChange={(e) => {
                        globalThis[prefix + "ay"] = e.target.value
                    }} value={globalThis[prefix + "ay"]} />
                    <Input placeholder="az" onChange={(e) => {
                        globalThis[prefix + "az"] = e.target.value
                    }} value={globalThis[prefix + "az"]} /> */}


            {/* <Input placeholder="angle2" onChange={(e) => {
                        globalThis[prefix + "angle2"] = e.target.value
                    }} value={globalThis[prefix + "angle2"]} /> */}
            <InputNumber
                defaultValue="0"
                min="-3.17"
                max="3.17"
                step="0.1"
                placeholder="angle" onChange={(value) => {
                    globalThis[prefix + "angle2"] = value
                    setRefresh(_ => Math.random())
                }} value={globalThis[prefix + "angle2"]}
            />


            {/* <Selector
                        defaultValue={"y"}
                        onChange={arr => {
                            let value = arr.length > 0 ? Number(arr[0]) : "y"

                            let axis
                            switch (value) {
                                case "x":
                                    axis = new Vector3(1, 0, 0)
                                    break
                                case "y":
                                    axis = new Vector3(0, 1, 0)
                                    break
                                case "z":
                                    axis = new Vector3(0, 0, 1)
                                    break
                            }

                            globalThis[prefix + "a2"] = axis
                        }}
                        options={
                            [
                                { value: "x", label: "x" },
                                { value: "y", label: "y" },
                                { value: "z", label: "z" },
                            ]
                        }
                    /> */}

            {/* <Input placeholder="ax2" onChange={(e) => {
                        globalThis[prefix + "ax2"] = e.target.value
                    }} value={globalThis[prefix + "ax2"]} />
                    <Input placeholder="ay2" onChange={(e) => {
                        globalThis[prefix + "ay2"] = e.target.value
                    }} value={globalThis[prefix + "ay2"]} />
                    <Input placeholder="az2" onChange={(e) => {
                        globalThis[prefix + "az2"] = e.target.value
                    }} value={globalThis[prefix + "az2"]} /> */}



            <InputNumber
                defaultValue="0"
                min="-3.17"
                max="3.17"
                step="0.1"
                placeholder="angle" onChange={(value) => {
                    globalThis[prefix + "angle3"] = value
                    setRefresh(_ => Math.random())
                }} value={globalThis[prefix + "angle3"]}
            />


            {/* <Selector
                        defaultValue={"z"}
                        onChange={arr => {
                            let value = arr.length > 0 ? Number(arr[0]) : "z"

                            let axis
                            switch (value) {
                                case "x":
                                    axis = new Vector3(1, 0, 0)
                                    break
                                case "y":
                                    axis = new Vector3(0, 1, 0)
                                    break
                                case "z":
                                    axis = new Vector3(0, 0, 1)
                                    break
                            }

                            globalThis[prefix + "a3"] = axis
                        }}
                        options={
                            [
                                { value: "x", label: "x" },
                                { value: "y", label: "y" },
                                { value: "z", label: "z" },
                            ]
                        }
                    /> */}


        </section>
    }

    // let _getPickTransformPrefix = () => "PickedTransform_"

    // let _getLittleHandTransformPrefix = () => "LittleHandTransform_"

    let _render = (zone_) => {
        switch (zone_) {
            case zone.CollisionShape:
                return <>
                    {
                        _renderCollisionShape("collision_shape")
                    }
                </>
            case zone.Transform:
                return <>
                    {
                        _renderTransform("pick", "Pick", getPickTransformPrefix(), "1")
                    }
                    {
                        _renderTransform("ubControlled", "UBControlled", getUBControlledTransformPrefix(), "2")
                    }
                    {
                        _renderTransform("putToBreasst", "PutToBreasst", getPutToBreastTransformPrefix(), "3")
                    }
                    {
                        _renderTransform("putToShoe", "PutToShoe", getPutToShoeTransformPrefix(), "4")
                    }
                    {
                        _renderTransform("breast", "Breast", getBreastTransformPrefix(), "5")
                    }
                    {
                        _renderTransform("little_hand", "Little_hand", getLittleHandTransformPrefix(), "6")
                    }
                </>
            case zone.Instruction:
                return <>
                    {
                        renderSwitch((state, isFastMove) => {
                            if (isFastMove) {
                                return {
                                    ...state,
                                    config: {
                                        ...state.config,
                                        isFastMove: true
                                    }
                                }
                            }

                            return {
                                ...state,
                                config: {
                                    ...state.config,
                                    isFastMove: false
                                }
                            }
                        }, readState().config.isFastMove, "关闭快速移动", "开启快速移动", "fast_move")
                    }
                    {
                        renderSwitch((state, isHPMax) => {
                            if (isHPMax) {
                                return CityScene3D.setHp(state, 100000)
                            }

                            return CityScene3D.restoreHp(state)
                        }, CityScene3D.isHPMax(readState()), "物体HP正常", "物体HP最大", "object_hp_max")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(CityScene3D.setHp(state, 1))
                        }, "object_hp_min", "物体HP最小")
                    }
                    {
                        renderButton((state) => {
                            return destoryAllUnits(state)
                        }, "object_destory", "干掉物体")
                    }

                    {
                        renderButton((state) => {
                            if (isUseGirl(state, getSpecificUsedGirl(state, usedGirlIndex))) {
                                state = getHpData(state, getSpecificUsedGirl(state, usedGirlIndex)).reduce((state, d) => {
                                    return CityScene3D.setGirlHp(state, getSpecificUsedGirl(state, usedGirlIndex), d.damagePart, 1)
                                    // return CityScene3D.setGirlHp(state, d.damagePart, 10000)
                                }, state)
                            }

                            return Promise.resolve(state)
                        }, "girl_hp_min", "巨大娘HP最小")
                    }
                    {
                        renderButton((state) => {
                            state = getHpData(state, getSpecificUsedGirl(state, usedGirlIndex)).reduce((state, d) => {
                                if (d.damagePart != getBody()) {
                                    return CityScene3D.setGirlHp(state, getSpecificUsedGirl(state, usedGirlIndex), d.damagePart, 1)
                                }

                                return state
                            }, state)

                            return Promise.resolve(state)
                        }, "girl_cloth_hp_min", "巨大娘衣服HP最小")
                    }
                    {
                        renderButton((state) => {
                            // state = getHpData(state, usedGirl).reduce((state, d) => {
                            //     return CityScene3D.setGirlHp(state, d.damagePart, 1)
                            // }, state)
                            // return damageGiantess(state, [getMaxForce(), damageType.Direct, weaponType.Heavy], getLittleManName(), collisionPart.RightHand, NullableUtils.getEmpty(), buildFakeGirlWeaponValue())
                            // return damageGiantess(state, [getMaxForce(), damageType.Direct, weaponType.Heavy], getLittleManName(), collisionPart.RightHand, NullableUtils.return_(getPivotWorldPosition(state, getSpecificUsedGirl(state, usedGirlIndex))), buildFakeGirlWeaponValue())
                            return destroyGiantess(state, getSpecificUsedGirl(state, usedGirlIndex))
                        }, "girl_destroy", "干掉巨大娘")
                    }
                    {
                        renderButton((state) => {
                            return CityScene3D.triggerAction(state, getSpecificUsedGirl(state, usedGirlIndex), actionName.SmallerToLastBiggerCount)
                            // state = playSmallerAnimation(state, (state) => {
                            //     state = setLastScaleChangeTime(state, scaleState.Normal)
                            //     state = setNeedShowSkillBar(state, getSpecificUsedGirl(state, usedGirlIndex), false)

                            //     return Promise.resolve(state)
                            // })

                            // return Promise.resolve(state)
                        }, "smaller", "变小")
                    }
                    {
                        renderButton((state) => {
                            return CityScene3D.triggerAction(state, getSpecificUsedGirl(state, usedGirlIndex), actionName.Bigger)
                        }, "bigger", "变大")
                    }

                    {
                        renderSwitch((state, isPickRangeMax) => {
                            if (isPickRangeMax) {
                                return {
                                    ...state,
                                    config: {
                                        ...state.config,
                                        isPickRangeMax: true
                                    }
                                }
                            }

                            return {
                                ...state,
                                config: {
                                    ...state.config,
                                    isPickRangeMax: false
                                }
                            }
                        }, readState().config.isPickRangeMax, "pick范围最大", "pick范围正常", "pick_range_max")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(CityScene3D.showDynamicName(state))
                        }, "show_dynamic_name", "显示dynamic name")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(CityScene3D.showStaticName(state))
                        }, "show_static_name", "显示static name")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(setAbstractState(state, PathFind.showGrid(getAbstractState(state), getGrid(state, getSpecificUsedGirl(state, usedGirlIndex), isUseGirl(state, getSpecificUsedGirl(state, usedGirlIndex)) ? attackTarget.Giantess : attackTarget.LittleMan, getPlayerPosition(state), getPlayerPosition(state)))))
                        }, "show_pathfind_grid", "显示PathFind->Grid")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(setAbstractState(state, PathFind.showGrid(getAbstractState(state), getGrid(state, getSpecificUsedGirl(state, usedGirlIndex), isUseGirl(state, getSpecificUsedGirl(state, usedGirlIndex)) ? attackTarget.Giantess : attackTarget.LittleMan, new Vector3(-100, -100, -100), new Vector3(1000, 1000, 1000)))))
                        }, "show_pathfind_big_grid", "显示PathFind->Big Grid")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(setAbstractState(state, PathFind.showGrid(getAbstractState(state), getGridForGirl(state, getSpecificUsedGirl(state, usedGirlIndex)))))
                        }, "show_pathfind_grid_forgirl", "显示PathFind->GridForGirl")
                    }
                    {
                        renderSwitch((state, isNotMoveCollision) => {
                            if (isNotMoveCollision) {
                                return {
                                    ...state,
                                    config: {
                                        ...state.config,
                                        isNotMoveCollision: true
                                    }
                                }
                            }

                            return {
                                ...state,
                                config: {
                                    ...state.config,
                                    isNotMoveCollision: false
                                }
                            }
                        }, readState().config.isNotMoveCollision, "开启移动碰撞", "关闭移动碰撞", "move_collision")
                    }
                    {
                        renderSwitch((state, isNotDamage) => {
                            if (isNotDamage) {
                                return {
                                    ...state,
                                    config: {
                                        ...state.config,
                                        isNotDamage: true
                                    }
                                }
                            }

                            return {
                                ...state,
                                config: {
                                    ...state.config,
                                    isNotDamage: false
                                }
                            }
                        }, readState().config.isNotDamage, "关闭无敌", "开启无敌", "not_damage")
                    }
                    {
                        renderSwitch((state, isKeepBig) => {
                            if (isKeepBig) {
                                return {
                                    ...state,
                                    config: {
                                        ...state.config,
                                        isKeepBig: true
                                    }
                                }
                            }

                            return {
                                ...state,
                                config: {
                                    ...state.config,
                                    isKeepBig: false
                                }
                            }
                        }, readState().config.isKeepBig, "关闭保持", "保持变大", "keep_big")
                    }
                    {
                        renderSwitch((state, isShowBox) => {
                            return CityScene3D.showBox(state, isShowBox)
                        }, readState().config.isShowBox, "不显示Box", "显示Box", "show_box")
                    }
                    {
                        renderButton((state) => {
                            let count
                            switch (NullableUtils.getWithDefault(
                                globalThis["army_count"],
                                0.1
                            )) {
                                case 0.1:
                                    count = 1
                                    break
                                default:
                                    count = 20
                                    break
                            }
                            count = computeArmyCount(state, count)

                            let camp_ = globalThis["army_camp"]
                            // let attackTarget_
                            // switch (camp_) {
                            //     case camp.Enemy:
                            //         attackTarget_ = attackTarget.LittleMan
                            //         break
                            //     case camp.LittleMan:
                            //         attackTarget_ = attackTarget.Giantess
                            //         break
                            // }

                            let minRange = 10
                            let maxRange = 1000
                            let maxCountOfOneCrowd = 5
                            let offset = 10
                            // let offset = 0

                            switch (globalThis["army_category"]) {
                                case armyCategory.Rocketeer:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateSoldiers,
                                            funcs: [
                                                generateRocketeers
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                                case armyCategory.Commander:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateSoldiers,
                                            funcs: [
                                                generateCommanders
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                                case armyCategory.Laser:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateSoldiers,
                                            funcs: [
                                                generateLaserers
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                                case armyCategory.Melee:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateSoldiers,
                                            funcs: [
                                                generateMelees
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                                case armyCategory.ShellTurret:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateMilltaryBuildings,
                                            funcs: [
                                                ShellTurret.generateTurrets
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                                case armyCategory.MissileTurret:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateMilltaryBuildings,
                                            funcs: [
                                                MissileTurret.generateTurrets
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                                case armyCategory.Tank:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateMilltaryVehicles,
                                            funcs: [
                                                generateTanks
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                                case armyCategory.MissileVehicle:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateMilltaryVehicles,
                                            funcs: [
                                                generateMissileVehicles
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                                case armyCategory.FlameVehicle:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateMilltaryVehicles,
                                            funcs: [
                                                generateFlameVehicles
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))


                                case armyCategory.MeleeGiantess:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateEliteGiantesses,
                                            funcs: [
                                                generateMeleeGiantesses(state)
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                                case armyCategory.MagicGiantess:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateEliteGiantesses,
                                            funcs: [
                                                generateMagicGiantesses(state)
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))


                                case armyCategory.Infantry:
                                default:
                                    return generateArmyInSpecificPosition(state, [
                                        {
                                            generateFunc: generateSoldiers,
                                            funcs: [
                                                generateInfantrys
                                            ],
                                            count,
                                            offset: offset, camp_: camp_
                                        },
                                    ], getPlayerPosition(state))
                            }
                        }, "generate_army", "创建军队")
                    }
                    <Selector
                        defaultValue={String(NullableUtils.getWithDefault(
                            globalThis["army_count"],
                            0.1
                        ))}
                        onChange={arr => {
                            let value = arr.length > 0 ? Number(arr[0]) : 0.1

                            globalThis["army_count"] = value
                        }}
                        options={
                            [
                                { value: "0.1", label: "1" },
                                { value: "1", label: "最大" },
                            ]
                        }
                    />
                    <Selector
                        defaultValue={String(NullableUtils.getWithDefault(
                            globalThis["army_camp"],
                            camp.Player
                        ))}
                        onChange={arr => {
                            let value = arr.length > 0 ? Number(arr[0]) : camp.Player

                            globalThis["army_camp"] = value
                        }}
                        options={
                            [
                                { value: camp.Player, label: "玩家" },
                                { value: camp.Enemy, label: "敌人" },
                                { value: camp.Giantess, label: "巨大娘" },
                            ]
                        }
                    />

                    <Selector
                        defaultValue={String(NullableUtils.getWithDefault(
                            globalThis["army_category"],
                            armyCategory.Infantry
                        ))}
                        onChange={arr => {
                            let value = arr.length > 0 ? Number(arr[0]) : armyCategory.Infantry

                            globalThis["army_category"] = value
                        }}
                        options={
                            [
                                { value: armyCategory.Infantry, label: "步兵" },
                                { value: armyCategory.Rocketeer, label: "火箭兵" },
                                { value: armyCategory.Commander, label: "指挥官" },
                                { value: armyCategory.Laser, label: "激光兵" },
                                { value: armyCategory.Melee, label: "近战兵" },
                                { value: armyCategory.Tank, label: "坦克" },
                                { value: armyCategory.MissileVehicle, label: "导弹车" },
                                { value: armyCategory.FlameVehicle, label: "喷火车" },
                                { value: armyCategory.ShellTurret, label: "炮塔" },
                                { value: armyCategory.MissileTurret, label: "导弹塔" },



                                { value: armyCategory.MeleeGiantess, label: "精英近战巨大娘" },
                                { value: armyCategory.MagicGiantess, label: "精英魔法巨大娘" },
                            ]
                        }
                    />


                    {/* {
                        renderButton((state) => {
                            return generateRocketeers(state, 1)
                        }, "generate_rocketeers", "创建火箭兵")
                    }
                    {
                        renderButton((state) => {
                            return generateCommanders(state, 1)
                        }, "generate_commanders", "创建指挥官")
                    }
                    {
                        renderButton((state) => {
                            return generateLaserers(state, 1)
                        }, "generate_laserers", "创建激光兵")
                    }
                    {
                        renderButton((state) => {
                            return generateMelees(state, 0.1)
                        }, "generate_melees", "创建近战兵")
                    }
                    {
                        renderButton((state) => {
                            return generateTanks(state, 0.1)
                        }, "generate_tank", "创建坦克")
                    }
                    {
                        renderButton((state) => {
                            return generateMissileVehicles(state, 0.1)
                        }, "generate_missileVehicle", "创建导弹车")
                    }
                    {
                        renderButton((state) => {
                            return generateFlameVehicles(state, 0.1)
                        }, "generate_flameVehicle", "创建喷火车")
                    } */}

                    {
                        renderSwitch((state, isMaxArmySpeed) => {
                            if (isMaxArmySpeed) {
                                globalThis["isMaxArmySpeed"] = true

                                return state
                                // return {
                                //     ...state,
                                //     config: {
                                //         ...state.config,
                                //         isMaxArmySpeed: true
                                //     }
                                // }
                            }

                            globalThis["isMaxArmySpeed"] = false

                            return state
                            // return {
                            //     ...state,
                            //     config: {
                            //         ...state.config,
                            //         isMaxArmySpeed: false
                            //     }
                            // }

                        }, NullableUtils.getWithDefault(globalThis["isMaxArmySpeed"], false), "正常军队速度", "最大军队速度", "max_army_speed")
                    }
                    {
                        renderSwitch((state, isOpenSound) => {
                            if (isOpenSound) {
                                return {
                                    ...state,
                                    config: {
                                        ...state.config,
                                        isOpenSound: true
                                    }
                                }
                            }

                            return {
                                ...state,
                                config: {
                                    ...state.config,
                                    isOpenSound: false
                                }
                            }

                        }, readState().config.isOpenSound, "关闭声音", "开启声音", "open_sound")
                    }
                    {
                        renderButton((state) => {
                            console.log(
                                getWorldPosition(state)
                            )

                            return Promise.resolve(state)
                        }, "log_position", "打印位置")
                    }

                    {/* {
                        renderButton((state) => {
                            return triggerMainEvent(state, eventName.CallGiantess)
                        }, "trigger_call_giantess", "触发召唤巨大娘事件")
                    } */}
                    {/* {
                        renderButton((state) => {
                            return triggerMainEvent(state, eventName.EnemyAddRandomBuff)
                        }, "trigger_addrandombuff", "触发敌人加随机Buff事件")
                    } */}



                    {
                        renderButton((state) => {
                            return handleMissionComplete(state, 0)
                        }, "mission_complete", "胜利")
                    }
                    {
                        renderButton((state) => {
                            return handleMissionFail(state, missionFinishStatus.Fail)
                        }, "mission_fail", "失败")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(addGemInLevel(state, 100))
                        }, "get_gem", "获得宝石")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(setExcitement(state, getSpecificUsedGirl(state, usedGirlIndex), 100))
                        }, "max_excitement", "最大兴奋")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(setExcitement(state, getSpecificUsedGirl(state, usedGirlIndex), 0))
                        }, "zero_excitement", "0兴奋")
                    }
                    {
                        renderButton((state) => {
                            state = setAttribute(state, buildFuncData(state), (value) => {
                                return {
                                    ...value,
                                    // maxScale: Infinity,
                                    initialScale: 8
                                }
                            }, usedGirlEnum.PlayerGirl)

                            state = CityScene3D.setGirlScale(state, getSpecificUsedGirl(state, usedGirlIndex), 8)

                            return Promise.resolve(state)
                        }, "super_big", "十米大")
                    }
                    {
                        renderButton((state) => {
                            state = setAttribute(state, buildFuncData(state), (value) => {
                                return {
                                    ...value,
                                    maxScale: Infinity,
                                    initialScale: 170
                                }
                            }, usedGirlEnum.PlayerGirl)

                            state = CityScene3D.setGirlScale(state, getSpecificUsedGirl(state, usedGirlIndex), 170)

                            return Promise.resolve(state)
                        }, "super_big", "百米大")
                    }
                    {
                        renderButton((state) => {
                            state = setAttribute(state, buildFuncData(state), (value) => {
                                return {
                                    ...value,
                                    maxScale: Infinity,
                                    initialScale: 1000
                                }
                            }, usedGirlEnum.PlayerGirl)

                            state = CityScene3D.setGirlScale(state, getSpecificUsedGirl(state, usedGirlIndex), 1000)

                            return Promise.resolve(state)
                        }, "super_big", "超大")
                    }
                    {
                        renderButton((state) => {
                            state = setAttribute(state, buildFuncData(state), (value) => {
                                return {
                                    ...value,
                                    maxScale: Infinity,
                                    initialScale: 10000
                                }
                            }, usedGirlEnum.PlayerGirl)

                            state = CityScene3D.setGirlScale(state, getSpecificUsedGirl(state, usedGirlIndex), 10000)

                            return Promise.resolve(state)
                        }, "super_big", "超大2")
                    }



                    <Selector
                        defaultValue={String(autoDifficulty.VeryEasy)}
                        onChange={arr => {
                            let value = arr.length > 0 ? Number(arr[0]) : autoDifficulty.VeryEasy

                            // globalThis["debug_autoDifficulty"] = value
                            let state = readState()
                            state = setAutoDifficulty(state, value)
                            writeState(state)
                        }}
                        options={
                            [
                                { value: autoDifficulty.VeryEasy, label: "VeryEasy" },
                                { value: autoDifficulty.Middle, label: "Middle" },
                                { value: autoDifficulty.VeryHard, label: "VeryHard" },
                                { value: autoDifficulty.VeryHard1, label: "VeryHard1" },
                                { value: autoDifficulty.VeryHard2, label: "VeryHard2" },
                                { value: autoDifficulty.VeryHard3, label: "VeryHard3" },
                                { value: autoDifficulty.VeryHard4, label: "VeryHard4" },
                                { value: autoDifficulty.VeryHard5, label: "VeryHard5" },
                            ]
                        }
                    />

                    <Input placeholder="选择升级" onChange={(e) => {
                        setUpgradeBlockName(_ => e.target.value)

                        e.preventDefault()
                        e.stopPropagation()
                    }} value={upgradeBlockName} size={"small"} />
                    {
                        renderButton((state) => {
                            return applyUpgradeFuncs(state, getUpgradeFuncsByName(state, upgradeBlockName), isGiantessCharacterType(state) ? usedGirlEnum.PlayerGirl : usedGirlEnum.None)
                        }, "选择升级", "确定")
                    }

                    <Input placeholder="选择职业" onChange={(e) => {
                        setCareerName(_ => e.target.value)

                        e.preventDefault()
                        e.stopPropagation()
                    }} value={careerName} size={"small"} />
                    {
                        renderButton((state) => {
                            return NullableUtils.getWithDefault(
                                NullableUtils.map(data => {
                                    state = setSelectedCareerData(state, Scene.getCharacterType(getAbstractState(state)), [data])
                                    return apply(state)
                                }, getAllCareerData(state, Scene.getCharacterType(getAbstractState(state))).find(d => d.name.toLocaleLowerCase().includes(careerName.toLocaleLowerCase()))),
                                Promise.resolve(state)
                            )
                        }, "选择职业", "确定")
                    }

                    {
                        renderSwitch((state, isDebug) => {
                            return setIsDebug(state, isDebug)
                        }, getIsDebug(readState()), "关闭Debug", "开启Debug", "debug")
                    }

                </>
            case zone.LittleManInstruction:
                return <>
                    <InputNumber
                        key={Math.random()}
                        defaultValue={0}
                        step="1"
                        placeholder="usedGirl Index" onChange={(value) => {
                            setUsedGirlIndex(_ => Number(value))
                        }} value={usedGirlIndex}
                    />
                    {
                        renderButton((state) => {
                            state = handleExitControlled(state, getPosition(state))
                            return pickupHandler(state, {
                                userData: {
                                    usedGirl: getNearestUsedGirl(state, getPlayerPosition(state)),
                                    box: getCollisionPartOBB(state, getSpecificUsedGirl(state, usedGirlIndex), collisionPart.RightHand).toBox3().expandByScalar(1000)
                                }
                            })
                        }, "pickup", "Pick")
                    }
                    {
                        renderButton((state) => {
                            state = handleExitControlled(state, getPosition(state))
                            return insertUBHandler(state, {
                                userData: {
                                    usedGirl: getNearestUsedGirl(state, getPlayerPosition(state)),
                                    data: [
                                        [
                                            NullableUtils.getEmpty(),
                                            -1,
                                            getLittleManName(),
                                            getWorldMatrix(state),
                                            getBox(state)
                                        ]
                                    ].concat(
                                        getAllFlattenAliveArmyData(state).map(data => {
                                            return [
                                                data.queue,
                                                data.index,
                                                data.name,
                                                data.queue.getTransform(data.index),
                                                data.queue.getBox(data.index)
                                            ]
                                        })
                                    )
                                }
                            })
                        }, "ub_controlled", "UB Controlled")
                    }
                    {
                        renderButton((state) => {
                            state = handleExitControlled(state, getPosition(state))

                            return putToBreastHandler(state, {
                                userData: {
                                    usedGirl: getNearestUsedGirl(state, getPlayerPosition(state)),
                                    data: [
                                        [
                                            NullableUtils.getEmpty(),
                                            -1,
                                            getLittleManName(),
                                            getWorldMatrix(state),
                                            getBox(state)
                                        ]
                                    ].concat(
                                        getAllFlattenAliveArmyData(state).map(data => {
                                            return [
                                                data.queue,
                                                data.index,
                                                data.name,
                                                data.queue.getTransform(data.index),
                                                data.queue.getBox(data.index)
                                            ]
                                        })
                                    )
                                }
                            })
                        }, "put_to_breast", "put_to_breast")
                    }
                    {
                        renderButton((state) => {
                            state = handleExitControlled(state, getPosition(state))
                            return putToShoeHandler(state, {
                                userData: {
                                    usedGirl: getNearestUsedGirl(state, getPlayerPosition(state)),
                                    data: [
                                        [
                                            NullableUtils.getEmpty(),
                                            -1,
                                            getLittleManName(),
                                            getWorldMatrix(state),
                                            getBox(state)
                                        ]
                                    ].concat(
                                        getAllFlattenAliveArmyData(state).map(data => {
                                            return [
                                                data.queue,
                                                data.index,
                                                data.name,
                                                data.queue.getTransform(data.index),
                                                data.queue.getBox(data.index)
                                            ]
                                        })
                                    )
                                }
                            })
                        }, "put_to_shoe", "put_to_shoe")
                    }
                    {
                        // renderSwitch((state, isSelectLittleMan) => {
                        //     if (isSelectLittleMan) {
                        //         return {
                        //             ...state,
                        //             config: {
                        //                 ...state.config,
                        //                 littleManConfig: {
                        //                     ...state.config.littleManConfig,
                        //                     isSelectLittleMan: true
                        //                 }
                        //             }
                        //         }
                        //     }

                        //     return {
                        //         ...state,
                        //         config: {
                        //             ...state.config,
                        //             littleManConfig: {
                        //                 ...state.config.littleManConfig,
                        //                 isSelectLittleMan: false
                        //             }
                        //         }
                        //     }
                        // }, readState().config.littleManConfig.isSelectLittleMan, "开启选择小人", "关闭选择小人", "select_little_man")
                    }
                    {/* {
                        renderSwitch((state, isOnlyStomp) => {
                            if (isOnlyStomp) {
                                return {
                                    ...state,
                                    config: {
                                        ...state.config,
                                        littleManConfig: {
                                            ...state.config.littleManConfig,
                                            isOnlyStomp: true
                                        }
                                    }
                                }
                            }

                            return {
                                ...state,
                                config: {
                                    ...state.config,
                                    littleManConfig: {
                                        ...state.config.littleManConfig,
                                        isOnlyStomp: false
                                    }
                                }
                            }
                        }, readState().config.littleManConfig.isOnlyStomp, "开启只踩踏", "关闭只踩踏", "only_stomp")
                    }
                    {
                        renderSwitch((state, isOnlyPickup) => {
                            if (isOnlyPickup) {
                                return {
                                    ...state,
                                    config: {
                                        ...state.config,
                                        littleManConfig: {
                                            ...state.config.littleManConfig,
                                            isOnlyPickup: true
                                        }
                                    }
                                }
                            }

                            return {
                                ...state,
                                config: {
                                    ...state.config,
                                    littleManConfig: {
                                        ...state.config.littleManConfig,
                                        isOnlyPickup: false
                                    }
                                }
                            }
                        }, readState().config.littleManConfig.isOnlyPickup, "开启只抓", "关闭只抓", "only_pickup")
                    } */}
                    {/* {
                        renderSwitchPromise((state, changeToCrawl) => {
                            if (changeToCrawl) {
                                return triggerAction(state, getSpecificUsedGirl(state, usedGirlIndex), actionName.StandToCrawl).then(getTuple2First)
                            }

                            return triggerAction(state, getSpecificUsedGirl(state, usedGirlIndex), actionName.CrawlToStand).then(getTuple2First)
                        }, isPose(readState(), pose.Crawl), "切换到爬行", "切换到站立", "changeToPose")
                    } */}
                    {
                        renderButton((state) => {
                            state = studyActions(state, buildFuncData(state), [
                                getSwipBlockService(state).getActionName(),
                                getFastRunBlockService(state).getActionName(),
                                littleManActionName.Blink
                            ])

                            return Promise.resolve(state)
                        }, "learn_all", "所有技能")
                    }
                    {
                        renderSwitch((state, isNotExecuteGiantessAI) => {
                            if (isNotExecuteGiantessAI) {
                                return {
                                    ...state,
                                    config: {
                                        ...state.config,
                                        littleManConfig: {
                                            ...state.config.littleManConfig,
                                            isNotExecuteGiantessAI: true
                                        }
                                    }
                                }
                            }

                            return {
                                ...state,
                                config: {
                                    ...state.config,
                                    littleManConfig: {
                                        ...state.config.littleManConfig,
                                        isNotExecuteGiantessAI: false
                                    }
                                }
                            }
                        }, readState().config.littleManConfig.isNotExecuteGiantessAI, "开启巨大娘AI", "关闭巨大娘AI", "close_ai")
                    }
                    {
                        renderButton((state) => {
                            state = hideAim(state)

                            return Promise.resolve(state)
                        }, "hide_aim", "隐藏准心")
                    }
                    {
                        renderButton((state) => {
                            if (getHp(state) > 1) {
                                state = setHp(state, 1)
                            }

                            return Promise.resolve(state)
                        }, "littleMan_hp_min", "小人HP最小")
                    }
                    {
                        renderButton((state) => {
                            state = setHp(state, 0)

                            return Promise.resolve(state)
                        }, "destory_littleman", "干掉小人")
                    }
                    {
                        renderButton((state) => {
                            // state = setExperienceValue(state, getLittleManName(), getLittleManExperienceValue(state) + getOneLevelExperienceValue(state) * 100)
                            state = setExperienceValue(state, getSpecificUsedGirl(state, usedGirlIndex), getLittleManName(), getOneLevelExperienceValue(state) * 3)

                            return Promise.resolve(state)
                        }, "upgrade_little", "升级")
                    }
                    {/* {
                        renderButton((state) => {
                            state = setExperienceValue(state, getLittleManName(), getOneLevelExperienceValue(state))

                            return Promise.resolve(state)
                        }, "upgrade_little_one", "升1级")
                    } */}
                    {/* <Selector
                        defaultValue={String(getLittleManSettingInGame(readState()).selectTargetPrior)}
                        onChange={arr => {
                            set(setLittleManSettingInGameIsSelectLittleManPrior, arr, targetPrior.None)
                        }}
                        options={
                            [
                                { value: String(targetPrior.None), label: "默认" },
                                { value: String(targetPrior.LittleMan), label: "玩家" },
                                { value: String(targetPrior.Building), label: "建筑" },
                                { value: String(targetPrior.Cityzen), label: "市民" },
                                { value: String(targetPrior.Soldier), label: "士兵" },
                                { value: String(targetPrior.MilltaryVehicle), label: "军车" },
                                { value: String(targetPrior.MilltaryBuilding), label: "军事建筑" },
                            ]
                        }
                    /> */}
                </>

            case zone.GiantessInstruction:
                return <>
                    {
                        renderButton((state) => {
                            state = handleExitControlled(state, getPosition(state))
                            return insertUBHandler(state, {
                                userData: {
                                    usedGirl: getNearestUsedGirl(state, getPlayerPosition(state)),
                                    data: [
                                        [
                                            NullableUtils.getEmpty(),
                                            -1,
                                            getLittleManName(),
                                            getWorldMatrix(state),
                                            getBox(state)
                                        ]
                                    ].concat(
                                        getAllFlattenAliveArmyData(state).map(data => {
                                            return [
                                                data.queue,
                                                data.index,
                                                data.name,
                                                data.queue.getTransform(data.index),
                                                data.queue.getBox(data.index)
                                            ]
                                        })
                                    )
                                }
                            })
                        }, "ub_controlled", "UB Controlled")
                    }
                    {
                        renderButton((state) => {
                            state = handleExitControlled(state, getPosition(state))

                            return putToBreastHandler(state, {
                                userData: {
                                    usedGirl: getNearestUsedGirl(state, getPlayerPosition(state)),
                                    data: [
                                        [
                                            NullableUtils.getEmpty(),
                                            -1,
                                            getLittleManName(),
                                            getWorldMatrix(state),
                                            getBox(state)
                                        ]
                                    ].concat(
                                        getAllFlattenAliveArmyData(state).map(data => {
                                            return [
                                                data.queue,
                                                data.index,
                                                data.name,
                                                data.queue.getTransform(data.index),
                                                data.queue.getBox(data.index)
                                            ]
                                        })
                                    )
                                }
                            })
                        }, "put_to_breast", "put_to_breast")
                    }
                    {
                        renderButton((state) => {
                            // state = setCurrentStudyActions(state, List([
                            state = setSavedStudyActions(state, [
                                {
                                    name: actionName.Run,
                                    time: getNow(state)
                                },
                                {
                                    // name: actionName.Stomp,
                                    name: getStompBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: actionName.StandToCrawl,
                                    time: getNow(state)
                                },
                                // {
                                //     name: actionName.BreastPress,
                                //     time: getNow(state)
                                // },
                                {
                                    name: actionName.CrawlToStand,
                                    time: getNow(state)
                                },
                                {
                                    name: actionName.Pickup,
                                    time: getNow(state)
                                },
                                {
                                    name: actionName.Eat,
                                    time: getNow(state)
                                },
                                {
                                    name: actionName.Pinch,
                                    time: getNow(state)
                                },
                                {
                                    name: actionName.Pickdown,
                                    time: getNow(state)
                                },
                                {
                                    name: actionName.Bigger,
                                    time: getNow(state)
                                },
                                {
                                    name: actionName.SmallerToLastBiggerCount,
                                    time: getNow(state)
                                },
                                {
                                    name: actionName.Reborn,
                                    time: getNow(state)
                                },

                                {
                                    name: getStompRubBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getLeftStompBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getJumpStompBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getStandToSitBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getSitToStandBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getSitRubBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getSitTightenLegBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getPickToUBBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getUBToPickBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getThrustBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getInsertBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getPutToBreastBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getPutToShoeBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getFreeUBBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getFreeBreastBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getFreeShoeBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getBreastPressBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getBreastPressRubBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getCrawlBeatBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getCrawlLickBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                                {
                                    name: getSprayMilkBlockService(state).getActionName(),
                                    time: getNow(state)
                                },
                            ])

                            state = setCurrentStudyActions(state, getSavedStudyActions(state))


                            state = setMaxBiggerCount(state, 10)

                            // state = setBiggerWay(state, biggerWay.Active)
                            state = studyActions(state, buildFuncData(state), [actionName.Bigger])

                            return Promise.resolve(state)
                        }, "learn_all", "所有技能")
                    }

                    {/* {
                        renderButton((state) => {
                            return Promise.resolve(CityScene3D.transportGirl(state, new Vector3(50, 0, 50)))
                        }, "move_zone1", "传送到区域1")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(CityScene3D.transportGirl(state, new Vector3(1065, 0, -755)))
                        }, "move_zone2", "传送到区域2")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(CityScene3D.transportGirl(state, new Vector3(1500, 0, 620)))
                        }, "move_zone3", "传送到区域3")
                    } */}
                    {
                        renderButton((state) => {
                            // state = setExperienceValue(state, getGirlName(), getGiantessExperienceValue(state) + getOneLevelExperienceValue(state) * 100)
                            state = setExperienceValue(state, getSpecificUsedGirl(state, usedGirlIndex), buildNameByUsedGirl(getSpecificUsedGirl(state, usedGirlIndex)), getOneLevelExperienceValue(state) * 3)

                            return Promise.resolve(state)
                        }, "upgrade_giantess", "升级")
                    }

                </>
            case zone.AttackCityInstruction:
                return <>
                    {
                        renderButton((state) => {
                            return triggerMainEvent(state, eventName.WildGiantessAppear)
                        }, "trigger_wild_giantess_appear", "触发野生巨大娘出现事件")
                    }
                    {
                        renderButton((state) => {
                            return triggerMainEvent(state, eventName.EnemyGiantessAppear)
                        }, "trigger_enemy_giantess_appear", "触发敌人巨大娘出现事件")
                    }
                    {
                        renderButton((state) => {
                            return triggerMainEvent(state, eventName.EnemyReinforceReach)
                        }, "EnemyReinforceReach", "触发敌人增援事件")
                    }
                    {
                        renderButton((state) => {
                            return triggerMainEvent(state, eventName.EnemyFireSupport)
                        }, "trigger_firesupport", "触发敌人火力支援事件")
                    }
                    {
                        renderButton((state) => {
                            switch (getSceneChapter(state)) {
                                case scene.Biwu:
                                    return handleMissionComplete(state, 0)
                                default:
                                    state = setIsMissionFinish(state, true)
                                    return Promise.resolve(showDoor(state))
                            }
                        }, "show_door", "门")
                    }
                </>
            case zone.BiwuInstruction:
                return <>
                    {/* {
                        renderButton((state) => {
                            return ShellTurret.generateTurrets(state, [
                                new Vector3(
                                    -140, 0, 30
                                )
                            ], camp.Enemy).then(TupleUtils.getTuple2First)
                        }, "generate_shellturret", "创建炮塔")
                    }
                    {
                        renderButton((state) => {
                            return MissileTurret.generateTurrets(state, [
                                new Vector3(
                                    // -180, 0, 40
                                    -140, 0, 40
                                )
                                // ], camp.LittleMan, attackTarget.Giantess)
                            ], camp.Enemy).then(TupleUtils.getTuple2First)
                        }, "generate_missileturret", "创建导弹塔")
                    } */}
                    {
                        renderSwitch((state, isFastDuration) => {
                            if (isFastDuration) {
                                return ArrayUtils.reduce(getCurrentUsedGirls(state), (state, usedGirl) => {
                                    return setCustomDuration(state, usedGirl, 0.5)
                                }, state)
                            }

                            return ArrayUtils.reduce(getCurrentUsedGirls(state), (state, usedGirl) => {
                                return removeCustomDuration(state, usedGirl)
                            }, state)
                        }, !NullableUtils.isNullable(
                            getCustomDuration(readState(), getFirstUsedGirl(readState()))
                        ), "常速动画", "快速动画", "fast_duration")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve({
                                ...state,
                                config: {
                                    ...state.config,
                                    isTriggerSpecificGameEvent: true
                                }
                            })
                        }, "trigger_specific_game_event", "触发指定事件")
                    }
                    {
                        renderButton((state) => {
                            return StateMachine.changeAndExecuteStateWithoutName(state, setStateMachine, getStateMachine(state), createClimbState(), NullableUtils.getEmpty())
                                .then(state => {
                                    state = setClimbState(state, {
                                        ...getClimbState(state),
                                        climbPlane: climbPlane.Horrizon
                                    })

                                    state = setPositionAndComputeBox(state,
                                        new Vector3(
                                            -140, 38, 66
                                        )
                                    )

                                    return state
                                })
                        }, "transportToTorsor", "传送到肚子")
                    }
                </>
            case zone.ProtectInstruction:
                return <>
                    {
                        renderButton((state) => {
                            return triggerMainEvent(state, "Event_Game_Protect_Level_Giantess1")
                        }, "trigger_boss1_appear", "触发boss1出现事件")
                    }
                    {
                        renderButton((state) => {
                            return triggerMainEvent(state, "Event_Game_Protect_Level_Giantess2")
                        }, "trigger_boss2_appear", "触发boss2出现事件")
                    }
                </>
        }
    }

    let _getZone = () => {
        return NullableUtils.getWithDefault(
            globalThis["debug_zone"],
            zone.Instruction
        )
    }

    let _setZone = (zone) => {
        globalThis["debug_zone"] = zone
    }

    let _getStyle = () => {
        return Device.isMobile() ? {
            "overflow-y": "auto",
            "height": "50%"
        } : {
            "height": "0"
        }
    }

    // let _keydownEventHandler = (state, { userData }) => {
    //     let event = NullableUtils.getExn(userData)

    //     switch (event.code) {
    //         case "KeyK":
    //             return markEnter(state, false)
    //         default:
    //             return Promise.resolve(state)
    //     }

    // }

    // useEffect(() => {
    //     writeState(on(readState(), Event.getKeyDownEventName(), _keydownEventHandler))

    //     return () => {
    //         writeState(off(readState(), Event.getKeyDownEventName(), _keydownEventHandler))
    //     };
    // }, []);

    return <Layout className="debug" style={_getStyle()}>
        <Menu onClick={e => {
            let key = Number(e.key)

            _setZone(key)
            setRefresh(_ => Math.random())

            // setCurrent(() => key)
            // setZone(() => key)
        }} selectedKeys={[_getZone()]} mode="horizontal" items={[
            {
                label: '指令',
                key: zone.Instruction,
            },
            isLittleCharacterType(readState()) ?
                {
                    label: '小人指令',
                    key: zone.LittleManInstruction,
                } : null,
            isGiantessCharacterType(readState()) ?
                {
                    label: '巨大娘指令',
                    key: zone.GiantessInstruction,
                } : null,
            NullableUtils.getExn(currentSceneData).scene == scene.Play ?
                {
                    label: '进攻城市指令',
                    key: zone.AttackCityInstruction,
                } : null,
            NullableUtils.getExn(currentSceneData).scene == scene.Biwu ?
                {
                    label: '比武指令',
                    key: zone.BiwuInstruction,
                } : null,
            NullableUtils.getExn(currentSceneData).scene == "Scene_Protect" ?
                {
                    label: '防御城市指令',
                    key: zone.ProtectInstruction,
                } : null,
            {
                label: '位移',
                key: zone.Transform,
            },
            {
                label: '碰撞OBB',
                key: zone.CollisionShape,
            },
        ]}
        />
        <section key={_getZone()}>
            {
                _render(_getZone())
            }
        </section>
    </Layout>
};

export default Debug;
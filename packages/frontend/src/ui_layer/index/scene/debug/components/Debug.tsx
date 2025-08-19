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
import { Vector3 } from "three";
import { PathFind } from "meta3d-jiehuo-abstract";
import { setIsDebug } from "../../../../../business_layer/Scene3D";
import { getIsDebug } from "../../../../../scene3d_layer/script/scene/Scene";
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { setExcitement } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Excitement";
import { getCustomDuration, playSmallerToHalfSizeAnimation, removeCustomDuration, setCustomDuration } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Animation";
import { getCurrentMMDCharacterName, triggerAction } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Girl";
import { setNeedUpdateSkillBar } from "../../../../../scene3d_layer/script/scene/scene_city/UI";
import { getBreastTransformPrefix, getLittleHandTransformPrefix, getPickTransformPrefix } from "../../../../../scene3d_layer/script/scene/scene_city/utils/SkeletonUtils";
import { getGrid, getGridForGirl } from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/PathFind";
import { actionName } from "../../../../../scene3d_layer/script/scene/scene_city/data/DataType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { generateCommanders, generateFlameVehicles, generateInfantrys, generateLaserers, generateMelees, generateMissileVehicles, generateRocketeers, generateSoldiers, generateTanks, getCrowdPositions } from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/ArmyManager";
import { getConfigData, getSceneChapter, isGiantessRoad, isLittleRoad, setConfigData } from "../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import { getHpData } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Cloth";
import { genImageMaskStyle } from "antd/es/image/style";
import * as ShellTurret from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/milltary_building/ShellTurret";
import * as MissileTurret from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/milltary_building/MissileTurret";
import { scene } from "../../../../global/store/GlobalStoreType";
import { attackTarget, camp, collisionPart, pose } from "../../../../../scene3d_layer/script/scene/scene_city/type/StateType";
import { getMaxVisibleCount, getCrowdCount, getOffsetFactor } from "../../../../../scene3d_layer/script/scene/scene_city/manage/city1/ArmyManager";
import * as BehaviourUtils from "./../../../../../scene3d_layer/script/scene/scene_city/behaviour_tree/action_node/Utils"
import { getTuple2First } from "meta3d-jiehuo-abstract/src/utils/TupleUtils";
import { isPose } from "../../../../../scene3d_layer/script/scene/scene_city/girl/Pose";
import { getAllCollisionParts } from "../../../../../scene3d_layer/script/scene/scene_city/utils/CollisionUtils";
import { axis, getSizeFactor, multiplyScalar } from "../../../../../scene3d_layer/script/scene/scene_city/data/CollisionShapeData";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { getWorldPosition, setPositionAndComputeBox } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/Transform";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { getStateMachine, setHp, setStateMachine } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/LittleMan";
import { createClimbState } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/FSMState";
import { getClimbState, setClimbState } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/climb/ClimbManager";
import { climbPlane } from "../../../../../scene3d_layer/script/scene/scene_city/manage/biwu/level3/ManageScene";
import { hideAim } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/Shoot";
// import { off, on } from "../../../../../business_layer/Event";
// import { Event } from "meta3d-jiehuo-abstract";
// import { NullableUtils } from "meta3d-jiehuo-abstract";
// import { markEnter } from "../../../../../scene3d_layer/script/scene/scene_city/scenario/ScenarioManager";

enum zone {
    Instruction,
    LittleManInstruction,
    GiantessInstruction,
    BiwuInstruction,
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
}

let Debug: React.FC = ({ setIsShowDebug }) => {
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
        return <section key={className} className={className}>
            {/* <span>{title}</span> */}
            {
                renderButton((state) => {
                    state = setConfigData(state, {
                        ...getConfigData(state),
                        collisionShapeData: getConfigData(state).collisionShapeData.map(d => {
                            if (d.mmds.includes(getCurrentMMDCharacterName(state))
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
                        return d.mmds.includes(getCurrentMMDCharacterName(state)) && d.collisionPart == value
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
                    getAllCollisionParts(readState()).map(collisionPart_ => {
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
        </section>
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
                        _renderTransform("breast", "Breast", getBreastTransformPrefix(), "2")
                    }
                    {
                        _renderTransform("little_hand", "Little_hand", getLittleHandTransformPrefix(), "3")
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
                            // return Promise.resolve(CityScene3D.setGirlHp(state, getBody(), 1))

                            state = getHpData(state).reduce((state, d) => {
                                return CityScene3D.setGirlHp(state, d.damagePart, 1)
                            }, state)

                            return Promise.resolve(state)
                        }, "girl_hp_min", "巨大娘HP最小")
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
                            return Promise.resolve(setAbstractState(state, PathFind.showGrid(getAbstractState(state), getGrid(state))))
                        }, "show_pathfind_grid", "显示PathFind->Grid")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(setAbstractState(state, PathFind.showGrid(getAbstractState(state), getGridForGirl(state))))
                        }, "show_pathfind_grid_forgirl", "显示PathFind->GridForGirl")
                    }
                    {
                        renderSwitch((state, isDebug) => {
                            return setIsDebug(state, isDebug)
                        }, getIsDebug(readState()), "关闭Debug", "开启Debug", "debug")
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
                            return CityScene3D.triggerAction(state, actionName.Smaller)
                            // state = playSmallerToHalfSizeAnimation(state, (state) => {
                            //     state = setScaleState(state, scaleState.Normal)
                            //     state = setNeedUpdateSkillBar(state, false)

                            //     return Promise.resolve(state)
                            // })

                            // return Promise.resolve(state)
                        }, "smaller", "变小")
                    }
                    {
                        renderButton((state) => {
                            return CityScene3D.triggerAction(state, actionName.Bigger, false, false)
                        }, "bigger", "变大")
                    }
                    {
                        renderButton((state) => {
                            let count = NullableUtils.getWithDefault(
                                globalThis["army_count"],
                                0.1
                            )

                            let camp_ = globalThis["army_camp"]
                            let attackTarget_
                            switch (camp_) {
                                case camp.Giantess:
                                    attackTarget_ = attackTarget.LittleMan
                                    break
                                case camp.LittleMan:
                                    attackTarget_ = attackTarget.Giantess
                                    break
                            }

                            switch (globalThis["army_category"]) {
                                case armyCategory.Rocketeer:
                                    return generateRocketeers(state,
                                        [
                                            getMaxVisibleCount,
                                            getCrowdCount,
                                            getOffsetFactor
                                        ],
                                        getCrowdPositions(state),
                                        count, camp_, attackTarget_)
                                case armyCategory.Commander:
                                    return generateCommanders(state,
                                        [
                                            getMaxVisibleCount,
                                            getCrowdCount,
                                            getOffsetFactor
                                        ],
                                        getCrowdPositions(state),
                                        count, camp_, attackTarget_)
                                case armyCategory.Laser:
                                    return generateLaserers(state,
                                        [
                                            getMaxVisibleCount,
                                            getCrowdCount,
                                            getOffsetFactor
                                        ],
                                        getCrowdPositions(state),
                                        count, camp_, attackTarget_)
                                case armyCategory.Melee:
                                    return generateMelees(state,
                                        [
                                            getMaxVisibleCount,
                                            getCrowdCount,
                                            getOffsetFactor
                                        ],
                                        getCrowdPositions(state),
                                        count, camp_, attackTarget_)
                                case armyCategory.Tank:
                                    return generateTanks(state,
                                        [
                                            getMaxVisibleCount,
                                            getCrowdCount,
                                            getOffsetFactor
                                        ],
                                        getCrowdPositions(state),
                                        count, camp_, attackTarget_)
                                case armyCategory.MissileVehicle:
                                    return generateMissileVehicles(state,
                                        [
                                            getMaxVisibleCount,
                                            getCrowdCount,
                                            getOffsetFactor
                                        ],
                                        getCrowdPositions(state),
                                        count, camp_, attackTarget_)
                                case armyCategory.FlameVehicle:
                                    return generateFlameVehicles(state,
                                        [
                                            getMaxVisibleCount,
                                            getCrowdCount,
                                            getOffsetFactor
                                        ],
                                        getCrowdPositions(state),
                                        count, camp_, attackTarget_)
                                case armyCategory.Infantry:
                                default:
                                    return generateInfantrys(state,
                                        [
                                            getMaxVisibleCount,
                                            getCrowdCount,
                                            getOffsetFactor
                                        ],
                                        getCrowdPositions(state),
                                        count, camp_, attackTarget_)
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
                            camp.LittleMan
                        ))}
                        onChange={arr => {
                            let value = arr.length > 0 ? Number(arr[0]) : camp.LittleMan

                            globalThis["army_camp"] = value
                        }}
                        options={
                            [
                                { value: camp.LittleMan, label: "小人" },
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
                </>
            case zone.LittleManInstruction:
                return <>
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
                    {
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
                        renderSwitchPromise((state, changeToCrawl) => {
                            if (changeToCrawl) {
                                return triggerAction(state, actionName.StandToCrawl).then(getTuple2First)
                            }

                            return triggerAction(state, actionName.CrawlToStand).then(getTuple2First)
                        }, isPose(readState(), pose.Crawl), "切换到爬行", "切换到站立", "changeToPose")
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
                            state = setHp(state, 1)

                            return Promise.resolve(state)
                        }, "littleMan_hp_min", "小人HP最小")
                    }
                </>

            case zone.GiantessInstruction:
                return <>
                    {
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
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(setExcitement(state, 100))
                        }, "max_excitement", "最大兴奋")
                    }
                    {
                        renderButton((state) => {
                            return Promise.resolve(setExcitement(state, 0))
                        }, "zero_excitement", "0兴奋")
                    }
                </>
            case zone.BiwuInstruction:
                return <>
                    {
                        renderButton((state) => {
                            return ShellTurret.generateTurrets(state, [
                                new Vector3(
                                    -140, 0, 30
                                )
                            ], camp.Giantess, attackTarget.LittleMan).then(TupleUtils.getTuple2First)
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
                            ], camp.Giantess, attackTarget.LittleMan).then(TupleUtils.getTuple2First)
                        }, "generate_missileturret", "创建导弹塔")
                    }
                    {
                        renderSwitch((state, isFastDuration) => {
                            if (isFastDuration) {
                                return setCustomDuration(state, 0.5)
                            }

                            return removeCustomDuration(state)
                        }, !NullableUtils.isNullable(
                            getCustomDuration(readState())
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

    return <Layout className="debug">
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
            isLittleRoad(readState()) ?
                {
                    label: '小人指令',
                    key: zone.LittleManInstruction,
                } : null,
            isGiantessRoad(readState()) ?
                {
                    label: '巨大娘指令',
                    key: zone.GiantessInstruction,
                } : null,
            getSceneChapter(readState()) == scene.Biwu ?
                {
                    label: '比武指令',
                    key: zone.BiwuInstruction,
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
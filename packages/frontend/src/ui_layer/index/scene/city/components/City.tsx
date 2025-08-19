import "./City.scss"

import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Flex, Card } from 'antd';
import { SideBar, Slider, Selector, Modal, Mask } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, AppState } from '../../../../store/AppStore';
// import Operate from '../operate/components/Operate';
import { NullableUtils } from 'meta3d-jiehuo-abstract';
import { page, scene } from '../../../../global/store/GlobalStoreType';
import { LandscapeUtils } from 'meta3d-jiehuo-abstract';
import Text from 'antd/es/typography/Text';
import { getAbstractState, readState, setAbstractState, writeState } from '../../../../../business_layer/State';
import * as  CityScene3D from '../../../../../business_layer/CityScene3D';
import { bulletPropName, thirdPersonCameraTarget, propName, propType, targetPrior, firstPersonCameraTarget } from '../../../../../scene3d_layer/script/scene/scene_city/type/StateType';
import { getIsProduction } from "../../../../../business_layer/Scene3D";
import { setPage } from "../../../../global/store/GlobalStore";
import { getIsDebug } from "../../../../../scene3d_layer/script/scene/Scene";
import { renderButton, renderImage } from "../../../../utils/ButtonUtils";
import * as ImageUtils from "../../../../utils/ImageUtils";
import Title from "antd/es/typography/Title";
import { off, on } from "../../../../../business_layer/Event";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getClickLargeSoundResourceId, getClickSmallSoundResourceId } from "../../../../../business_layer/Loader";
import Debug from "../../debug/components/Debug";
import Dialogue from "../Dialogue/components/Dialogue";
import { getCameraType, getLittleManSettingInGame, getSceneChapter, isGiantessRoad, isLittleRoad, setCameraType, setLittleManSettingInGameIsSelectLittleManPrior, useCamera } from "../../../../../scene3d_layer/script/scene/scene_city/CityScene";
import LevelStatus from "../giantess/level_status/component/LevelStatus";
import Pose from "../giantess/pose/components/Pose";
import * as GiantessOperate from "../giantess/operate/components/Operate";
import Bar from "../giantess/bar/components/Bar";
import SkillBar from "../giantess/skill_bar/components/SkillBar";
import * as LittleManOperate from "../little_man/operate/components/Operate";
import * as LittleManGiantessBar from "../little_man/bar/components/GiantessBar";
import * as LittleManBar from "../little_man/bar/components/LittleManBar";
import * as LittleManLevelStatus from "../little_man/level_status/component/LevelStatus";
import * as LittleManSkillBar from "../little_man/skill_bar/components/SkillBar";
import { set } from "../../../../utils/SettingUtils";
import { renderSwitch } from "../../../../utils/SwitchUtils";
import { getAllProps, getUsedBulletPropName, switchBulletProp } from "../../../../../scene3d_layer/script/scene/scene_city/little_man/LittleMan";
import { play } from "../../../../../business_layer/Sound";
import { buildNeedToPlaySoundData } from "meta3d-jiehuo-abstract/src/audio/SoundManager";
import { cameraType } from "../../../../../scene3d_layer/type/StateType";
import * as QTE from "../biwu/qte/components/QTE";
import * as BiwuLevelStatus from "../biwu/level_status/component/LevelStatus";
import { exit } from "../../../../utils/MissionUtils";
import { isLockToThirdPersonControls } from "../../../../../scene3d_layer/script/scene/scene_city/LittleManCamera";
import { CameraControls } from "meta3d-jiehuo-abstract";
// import Bar from "../bar/components/Bar";
// import Pose from "../pose/components/Pose";
// import LevelStatus from "../level_status/component/LevelStatus";
// import SkillBar from "../skill_bar/components/SkillBar";

enum menuItem {
    Camera = "Camera",
    EndLevel = "EndLevel",

    LittleManPackage = "LittleManPackage",
    // ControlGiantess,
    // Debug
}

// enum cameraType {
//     FirstPerson,
//     ThirdPerson
// }

enum packageItem {
    // None,
    Bullet = "Bullet",
}

enum city1ControlItem {
    SelectTarget = "SelectTarget",
    // ChangePose,
    // Rest,
    // Execute
    // Debug
}

enum biwuControlItem {
    None
}



let City: React.FC = (
    {
        destroyedRate, height,
        isShowDebug, setIsShowDebug,
    }
) => {
    // let currentSceneData = useSelector<AppState>((state) => state.scene) as scene

    // let _renderBigScreenUI = () => {
    //     return null
    // }

    // let _getSceneNumber = () => {
    //     return NullableUtils.getExn(currentSceneData).levelNumber
    // }
    let currentSceneData = useSelector<AppState>((state) => state.global.currentSceneData)
    let isEnterScenario = useSelector<AppState>((state) => state.scene.isEnterScenario)
    // let isBlackScreenStart = useSelector<AppState>((state) => state.scene.isBlackScreenStart)

    // Console.log(isBlackScreenStart, isEnterScenario);



    let [isShowMainMenu, setIsShowMainMenu] = useState(false)
    let [isShowPackage, setIsPackage] = useState(false)
    let [isShowControl, setIsControl] = useState(false)
    let [currentMenuItem, setCurrentMenuItem] = useState(menuItem.Camera)
    let [currentPackageItem, setCurrentPackageItem] = useState(menuItem.LittleManPackage)
    let [currentControlItem, setCurrentControlItem] = useState(city1ControlItem.SelectTarget)
    let [_, setRefresh] = useState(Math.random());
    // let [currentCameraType, setCurrentCameraType] = useState(cameraType.ThirdPerson)

    let dispatch: AppDispatch = useDispatch()

    // let _renderLittleManSettingButton = () => {
    //     let state = readState()

    //     if (!isLittleRoad(state)) {
    //         return null
    //     }

    //     return renderButton(state => {
    //         setCurrentMenuItem(_ => menuItem.ControlGiantess)

    //         return Promise.resolve(state)
    //     }, "little_man_setting_button", "控制巨大娘",)
    // }

    // let _renderLittleManPackageButton = () => {
    //     let state = readState()

    //     if (!isLittleRoad(state)) {
    //         return null
    //     }

    //     return renderButton(state => {
    //         // setCurrentMenuItem(_ => menuItem.ControlGiantess)

    //         return Promise.resolve(state)
    //     }, "little_man_package_button", "背包",)
    // }

    let _handleCloseModal = () => {
        let state = readState()
        state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))
        writeState(state)
    }

    let _renderMenuButton = () => {
        return <Col className="menu_button" span={8}>
            <Row justify="start" className="">
                <SideBar
                    activeKey={currentMenuItem}
                    onChange={key => {
                        switch (key) {
                            case menuItem.Camera:
                                setCurrentMenuItem(_ => menuItem.Camera)
                                break
                            case menuItem.EndLevel:
                                setCurrentMenuItem(_ => menuItem.EndLevel)
                                Modal.confirm({
                                    getContainer: LandscapeUtils.getRootDom(),
                                    content: '是否结束关卡？',
                                    onConfirm: async () => {
                                        return exit(dispatch)
                                    },
                                })
                                break
                        }
                    }}
                >
                    <SideBar.Item key={menuItem.Camera} title={'相机'} />
                    <SideBar.Item key={menuItem.EndLevel} title={'结束关卡'} />
                </SideBar>
            </Row>

            {/* <Row justify="start" className="">
                {
                    _renderLittleManPackageButton()
                }
            </Row> */}

            {/* <Row justify="start" className="">
                {
                    _renderLittleManSettingButton()
                }
            </Row> */}


        </Col>

    }

    let _renderCameraUI = () => {
        if (getCameraType(readState()) == cameraType.ThirdPerson) {
            return <>
                {
                    renderButton((state) => {
                        return Promise.resolve(CityScene3D.zoomIn(state))
                    }, "zoomIn", "拉近")
                }
                {
                    renderButton((state) => {
                        return Promise.resolve(CityScene3D.zoomOut(state))
                    }, "zoomOut", "拉远")
                }
                {
                    isGiantessRoad(readState()) ?
                        <Row justify="start">
                            <Text>设置target：</Text>
                            <Selector
                                defaultValue={CityScene3D.getThirdPersonCameraTarget(readState())}
                                onChange={arr => {
                                    let state = readState()

                                    let value = arr.length > 0 ? arr[0] : "chest"

                                    let target
                                    switch (value) {
                                        case "foot":
                                            target = thirdPersonCameraTarget.Foot
                                            break
                                        case "chest":
                                            target = thirdPersonCameraTarget.Chest
                                            break

                                    }
                                    state = CityScene3D.setThirdPersonCameraTarget(state, target)

                                    writeState(state)
                                }}
                                options={[
                                    { value: "chest", label: "胸" },
                                    { value: "foot", label: "足" },
                                ]}
                            />
                        </Row>
                        : null
                }
            </>
        }


        return isGiantessRoad(readState()) ?
            <Row justify="start">
                <Text>设置target：</Text>
                <Selector
                    defaultValue={CityScene3D.getFirstPersonCameraTarget(readState())}
                    onChange={arr => {
                        let state = readState()

                        let value = arr.length > 0 ? arr[0] : "eye"

                        let target
                        switch (value) {
                            case "eye":
                                target = firstPersonCameraTarget.Eye
                                break
                            case "leg":
                                target = firstPersonCameraTarget.Leg
                                break

                        }
                        state = CityScene3D.setFirstPersonCameraTarget(state, target)

                        writeState(state)
                    }}
                    options={[
                        { value: "eye", label: "眼" },
                        { value: "leg", label: "腿" },
                    ]}
                />
            </Row>
            : null
    }

    let _renderCurrentMenuItem = () => {
        switch (currentMenuItem) {
            case menuItem.EndLevel:
                return null
            case menuItem.Camera:
                return <>
                    <Row justify="start">
                        {/* <Text>镜头默认距离：</Text> */}
                        {/* <Slider
                            // className="zoom_slider"
                            // step={0.05}
                            step={0.5}
                            defaultValue={CityScene3D.getZoom(readState()) * 10}
                            min={CityScene3D.getMinZoom(readState()) * 10}
                            max={CityScene3D.getMaxZoom(readState()) * 10}
                            ticks={true}
                            onChange={value => {
                                let state = readState()

                                state = CityScene3D.setZoom(state, value / 10)

                                writeState(state)
                            }} /> */}


                        {
                            // isGiantessRoad(readState()) ?
                            isLittleRoad(readState()) && isLockToThirdPersonControls(readState()) ? null :
                                renderSwitch((state, isUseFirstPerson) => {
                                    if (isUseFirstPerson) {
                                        // setCurrentCameraType(_ => cameraType.FirstPerson)

                                        state = useCamera(state, cameraType.FirstPerson)
                                    }
                                    else {
                                        // setCurrentCameraType(_ => cameraType.ThirdPerson)

                                        state = useCamera(state, cameraType.ThirdPerson)
                                    }

                                    setRefresh(_ => Math.random())

                                    return state
                                }, getCameraType(readState()) == cameraType.FirstPerson, "使用第三人称相机", "使用第一人称相机", "use_first_person")
                            // : null
                        }
                        {
                            _renderCameraUI()
                        }
                    </Row>
                </>
            // case menuItem.Debug:
            //     return <>
            //         {
            //             renderButton((state) => {
            //                 return CityScene3D.setGirlScale(state, CityScene3D.getGirlScale(state) + 10)
            //             }, "bigger", "变大")
            //         }
            //         {
            //             renderButton((state) => {
            //                 return CityScene3D.setGirlScale(state, Math.max(Math.floor(CityScene3D.getGirlScale(state) / 2), 1))

            //             }, "smaller", "变小")
            //         }
            //         {
            //             renderButton((state) => {
            //                 return {
            //                     ...state,
            //                     config: {
            //                         ...state.config,
            //                         isFastMove: true
            //                     }
            //                 }
            //             }, "fast_move", "开启快速移动")
            //         }
            //         {
            //             renderButton((state) => {
            //                 return {
            //                     ...state,
            //                     config: {
            //                         ...state.config,
            //                         isFastMove: false
            //                     }
            //                 }
            //             }, "close_fast_move", "关闭快速移动")
            //         }
            //     </>
        }
    }

    let _openSetting = () => {
        setIsShowMainMenu(_ => true)
        setCurrentMenuItem(_ => menuItem.Camera)
    }

    let _openPackage = () => {
        setIsPackage(_ => true)
        setCurrentPackageItem(_ => packageItem.Bullet)
    }

    let _openControl = () => {
        setIsControl(_ => true)

        switch (getSceneChapter(readState())) {
            case scene.Play:
                setCurrentControlItem(_ => city1ControlItem.SelectTarget)
                break
            case scene.Biwu:
                setCurrentControlItem(_ => biwuControlItem.None)
                break
        }
    }

    let _renderPlayGiantessUI = () => {
        if (getSceneChapter(readState()) != scene.Play || !isGiantessRoad(readState())) {
            return null
        }

        return <>
            {
                <LevelStatus />
            }

            {
                <Pose />
            }

            {
                <GiantessOperate.default />
            }

            {
                <Bar />
            }
            {
                <SkillBar />
            }
        </>
    }

    let _renderPlayLittleManUI = () => {
        if (getSceneChapter(readState()) != scene.Play || !isLittleRoad(readState())) {
            return null
        }

        return <>
            {
                <LittleManOperate.default />
            }
            {
                <LittleManGiantessBar.default />
            }
            {
                <LittleManBar.default />
            }
            {
                <LittleManLevelStatus.default />
            }
            {
                <LittleManSkillBar.default />
            }
        </>
    }

    let _renderBiwuUI = () => {
        if (getSceneChapter(readState()) != scene.Biwu) {
            return null
        }

        return <>
            {
                <LittleManOperate.default />
            }
            {
                <LittleManGiantessBar.default />
            }
            {
                <LittleManBar.default />
            }
            {
                <BiwuLevelStatus.default />
            }
            {
                <LittleManSkillBar.default />
            }
            {
                <QTE.default />
            }
        </>
    }

    let _renderMainSetting = () => {
        return <Modal getContainer={LandscapeUtils.getRootDom()}
            // keyboard={false}
            // width={"80%"}
            visible={isShowMainMenu}
            className="main_menu"
            // maskClosable={false}
            closeOnMaskClick={true}
            showCloseButton={true}

            title={
                <Title className="title">{`主菜单`}</Title>
            }
            // open={isShowMainMenu}
            //  onOk={_handle} onCancel={_handle}
            // closable={false}
            // footer={null}
            content={
                <Row justify="center" className="row"
                // gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
                    {
                        _renderMenuButton()
                    }
                    <Col className="col"
                        span={16}>
                        {
                            _renderCurrentMenuItem()
                        }
                    </Col>
                </Row>
            }
            onClose={_ => {
                setIsShowMainMenu(_ => false)
                _handleCloseModal()
            }}
        // onCancel={_ => {
        //     setIsShowMainMenu(_ => false)
        // }}
        />
    }

    let _renderPackageButton = () => {
        return <Row justify="start" className="">
            {/* {
                renderButton(state => {
                    setCurrentPackageItem(_ => packageItem.Bullet)

                    return Promise.resolve(state)
                }, "bullet_button", "子弹",)
            } */}
            <SideBar
                activeKey={currentPackageItem}
                onChange={key => {
                    switch (key) {
                        case packageItem.Bullet:
                            setCurrentPackageItem(_ => packageItem.Bullet)
                            break
                    }
                }}
            >
                <SideBar.Item key={packageItem.Bullet} title={'子弹'} />
            </SideBar>
        </Row>
    }

    let _getBulletData = (state) => {
        let usedBulletPropName = getUsedBulletPropName(state)

        return getAllProps(state, propType.Bullet).map<[string, string, string, number, boolean, bulletPropName]>(d => {
            let imageSrc, title, description
            switch (d.name) {
                case propName.BasicBullet:
                    imageSrc = "./resource/ui/in_game/little_man/package/bullet/BasicBullet.png"
                    title = "普通子弹"
                    description = ""
                    break
                case propName.LaserBullet:
                    imageSrc = "./resource/ui/in_game/little_man/package/bullet/LaserBullet.png"
                    title = "激光子弹"
                    description = ""
                    break
                case propName.RocketBullet:
                    imageSrc = "./resource/ui/in_game/little_man/package/bullet/RocketBullet.png"
                    title = "火箭弹"
                    description = ""
                    break
                case propName.BiggerBullet:
                    imageSrc = "./resource/ui/in_game/little_man/package/bullet/BiggerBullet.png"
                    title = "变大子弹"
                    description = "击中巨大娘，可让其变大一级"
                    break
                case propName.SmallestBullet:
                    imageSrc = "./resource/ui/in_game/little_man/package/bullet/SmallestBullet.png"
                    title = "缩小子弹"
                    description = "击中巨大娘，可让其缩小到最小"
                    break
            }

            let isSelected = d.name == usedBulletPropName

            return [imageSrc, title, description, d.count, isSelected, d.name]
        }).toArray()
    }

    let _renderCurrentPackageItem = () => {
        let state = readState()

        switch (currentPackageItem) {
            case packageItem.Bullet:
                return <>
                    <Row justify="start">
                        {
                            _getBulletData(state).filter(data => {
                                return data[3] > 0
                            }).map((data, index) => {
                                return <Col key={index} span={6} justify="center">
                                    <div className="prop_container"
                                        onClick={_ => {
                                            play(state, buildNeedToPlaySoundData(getClickSmallSoundResourceId(), getIsDebug(state), 1, false))

                                            Modal.confirm({
                                                getContainer: LandscapeUtils.getRootDom(),
                                                title: data[1],
                                                content: data[2],
                                                onConfirm: async () => {
                                                    let state = readState()

                                                    play(state, buildNeedToPlaySoundData(getClickSmallSoundResourceId(), getIsDebug(state), 1, false))

                                                    state = switchBulletProp(state, data[5])

                                                    setRefresh(_ => Math.random())

                                                    writeState(state)
                                                },
                                            })
                                        }}
                                    >
                                        <img className="prop_image" src={data[0]} />
                                        {
                                            isFinite(data[3]) ?
                                                <span className="prop_count">{data[3]}</span>
                                                : null
                                        }
                                        {
                                            data[4] ?
                                                <img className="selected" src="./resource/ui/in_game/selected.png" /> : null
                                        }
                                    </div>
                                </Col>
                                // // @ts-ignore
                                // return <Card key={index}
                                //     className="prop_card"
                                //     cover={
                                //         <div className="prop_container">
                                //             <img src={data[0]} />
                                //             {
                                //                 isFinite(data[3]) ?
                                //                     <span className="prop_count">{data[3]}</span>
                                //                     : null
                                //             }
                                //             {
                                //                 data[4] ?
                                //                     <img className="selected" src="./resource/ui/in_game/selected.png" /> : null
                                //             }
                                //         </div>
                                //     }
                                //     span={3}
                                //     onClick={event => {
                                //         Modal.confirm({
                                //             getContainer: LandscapeUtils.getRootDom(),
                                //             // title: <Title className="title">{data[1]}</Title>,
                                //             // content: <Text className="description">{data[2]}</Text>,
                                //             title: data[1],
                                //             content: data[2],
                                //             onConfirm: async () => {
                                //                 // dispatch(setPageData(info))
                                //                 // dispatch(setPage(page.ActiveCode))

                                //                 // return Promise.resolve(state)
                                //             },
                                //         })
                                //     }}
                                // >
                                // </Card>

                            })
                        }
                    </Row>
                </>
        }
    }

    let _renderPackage = () => {
        return <Modal getContainer={LandscapeUtils.getRootDom()}
            visible={isShowPackage}
            className="package"
            closeOnMaskClick={true}
            showCloseButton={true}

            title={
                <Title className="title">{`背包`}</Title>
            }
            content={
                <Row justify="center" className="row" >
                    <Col className="package_button" span={4} justify="center">
                        {
                            _renderPackageButton()
                        }
                    </Col>
                    <Col className="col"
                        span={20} justify="start">
                        {
                            _renderCurrentPackageItem()
                        }
                    </Col>
                </Row>
            }
            onClose={_ => {
                setIsPackage(_ => false)
                _handleCloseModal()
            }}
        />
    }

    let _renderControlButton = () => {
        switch (getSceneChapter(readState())) {
            case scene.Play:
                return <>
                    <Row justify="start" className="">
                        {/* {
                    renderButton(state => {
                        setCurrentControlItem(_ => city1ControlItem.SelectTarget)

                        return Promise.resolve(state)
                    }, "select_target_button", "选择目标",)
                } */}
                        <SideBar
                            activeKey={currentControlItem}
                            onChange={key => {
                                // switch (key) {
                                // case city1ControlItem.SelectTarget:
                                //     setCurrentControlItem(_ => city1ControlItem.SelectTarget)
                                //     break
                                // }
                                setCurrentControlItem(_ => key)
                            }}
                        >
                            <SideBar.Item key={city1ControlItem.SelectTarget} title={'选择目标'} />
                        </SideBar>

                    </Row>
                    {/* <Row justify="start" className="">
                {
                    renderButton(state => {
                        setCurrentControlItem(_ => city1ControlItem.Execute)

                        return Promise.resolve(state)
                    }, "execute_button", "执行动作",)
                }
            </Row> */}
                </>
            case scene.Biwu:
                return <>
                    <Row justify="start" className="">
                        <SideBar
                            activeKey={currentControlItem}
                            onChange={key => {
                                // switch (key) {
                                //     case city1ControlItem.SelectTarget:
                                //         setCurrentControlItem(_ => city1ControlItem.SelectTarget)
                                //         break
                                // }
                                setCurrentControlItem(_ => key)
                            }}
                        >
                            <SideBar.Item key={biwuControlItem.None} title={'无'} />
                        </SideBar>

                    </Row>
                </>
        }
    }

    let _renderCurrentControlItem = () => {
        let state = readState()

        switch (currentControlItem) {
            case city1ControlItem.SelectTarget:
                return <>
                    <Row justify="start">
                        <Selector
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
                        />
                    </Row>
                </>
            case biwuControlItem.None:
                return <>
                </>
        }
    }

    let _renderControl = () => {
        return <Modal getContainer={LandscapeUtils.getRootDom()}
            visible={isShowControl}
            className="control"
            closeOnMaskClick={true}
            showCloseButton={true}

            title={
                <Title className="title">{`控制巨大娘`}</Title>
            }
            content={
                <Row justify="center" className="row" >
                    <Col className="control_button" span={4} justify="center">
                        {
                            _renderControlButton()
                        }
                    </Col>
                    <Col className="col"
                        span={20} justify="start">
                        {
                            _renderCurrentControlItem()
                        }
                    </Col>
                </Row>
            }
            onClose={_ => {
                setIsControl(_ => false)
                _handleCloseModal()
            }}
        />
    }

    /*! shouldn't on/off event here!
    useEffect(() => {
                writeState(on(readState(), getDestroyedRateUpdateEventName(), _destroyedRateUpdateEventHandler))
        writeState(on(readState(), getHeightUpdateEventName(), _heightUpdateEventHandler))
            writeState(on(readState(), getKeyDownEventName(), _keydownHandle))
     
        return () => {
                writeState(off(readState(), getKeyDownEventName(), _keydownHandle))
            writeState(off(readState(), getDestroyedRateUpdateEventName(), _destroyedRateUpdateEventHandler))
            writeState(off(readState(), getHeightUpdateEventName(), _heightUpdateEventHandler))
        };
    }, []);
            */


    // Console.log(isEnterScenario);


    return (
        <Layout className="city"
        >
            {
                isEnterScenario ? <Dialogue />
                    :
                    <>
                        {
                            !getIsProduction() ?
                                renderButton(state => {
                                    isShowDebug ?
                                        setIsShowDebug(() => false)
                                        : setIsShowDebug(() => true)

                                    return Promise.resolve(state)
                                }, "debug_button", "调试", "debug_button")
                                : null
                        }
                        {
                            // renderButton(state => {
                            //     setIsShowMainMenu(_ => true)
                            //     setCurrentMenuItem(_ => menuItem.None)

                            //     return state
                            // }, "main_menu_button", "主菜单", "main_menu_button")
                            renderImage(state => {
                                _openSetting()

                                return Promise.resolve(state)
                            }, "./resource/ui/in_game/setting.png", "main_menu_button")
                        }
                        {
                            isLittleRoad(readState()) ?
                                renderImage(state => {
                                    _openPackage()

                                    return Promise.resolve(state)
                                }, "./resource/ui/in_game/package.png", "package_button") : null
                        }
                        {
                            isLittleRoad(readState()) ?
                                renderImage(state => {
                                    _openControl()

                                    return Promise.resolve(state)
                                }, "./resource/ui/in_game/control.png", "control_button") : null
                        }
                        {/* <Button key={"main_menu_button"} className={"main_menu_button"}
                onClick={_ => {
                    setIsShowMainMenu(_ => true)
                    setCurrentMenuItem(_ => menuItem.None)
                }}
            >
                {"主菜单"}
            </Button > */}

                        {
                            _renderPlayGiantessUI()
                        }
                        {
                            _renderPlayLittleManUI()
                        }
                        {
                            _renderBiwuUI()
                        }

                        {
                            _renderMainSetting()
                        }
                        {
                            _renderPackage()
                        }
                        {
                            _renderControl()
                        }


                        {
                            isShowDebug ? <Debug setIsShowDebug={setIsShowDebug} /> : null
                        }

                        <Dialogue />
                    </>
            }
        </Layout >
    );
};

export default City;
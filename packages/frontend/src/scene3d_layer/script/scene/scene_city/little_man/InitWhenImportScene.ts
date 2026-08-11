import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler, Color, Bone, FrontSide, BackSide, DoubleSide } from "three";
import { state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleCharacterType, getOrbitControlsTarget, getSceneChapter, getAimResourceId, getCrossWhenDestroyResourceId, getCrossWhenDamageResourceId, getHeadShotResourceId } from "../CityScene";
import { actionState, attackTarget, camp, fireWay, gunName, littleMan, littleManActionState, littleManStrength, objectStateName, propName, propType, usedGirlEnum } from "../type/StateType";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { getControlledAnimationResourcePath, getIdleAnimationResourcePath, getRunningAnimationResourcePath, getShakeAnimationResourcePath, getShootingAnimationResourcePath, getLaserGunResourceId, getRocketGunResourceId, getLieAnimationResourcePath, getStandupAnimationResourcePath, getDeathAnimationResourcePath, getClimbToTopAnimationResourcePath, getClimbToDownAnimationResourcePath } from "../little_man_data/Const";
import { actionName, animationName } from "../little_man_data/DataType";
import { SkinAnimation } from "meta3d-jiehuo-abstract";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getIsDebug } from "../../Scene";
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract";
import { changeToPhongMaterial } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils";
import { addBox3Helper } from "../utils/ConfigUtils";
import { getAnimationBlendDuration } from "../little_man_data/Data";
import { getAnimationFrameCount } from "../little_man_data/Const";
import { littleManValue } from "../little_man_data/ValueType";
import { Device } from "meta3d-jiehuo-abstract";
import { NewThreeInstance } from "meta3d-jiehuo-abstract";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { move } from "./Move";
import { ThirdPersonControls } from "meta3d-jiehuo-abstract";
import { Shadow } from "meta3d-jiehuo-abstract";
import { Render } from "meta3d-jiehuo-abstract";
import { getLittleHandTransform, getLittleHandTransformForDebug, getLittleHandTransformPrefix } from "../utils/SkeletonUtils";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { Billboard } from "meta3d-jiehuo-abstract";
import { ScreenUtils } from "meta3d-jiehuo-abstract";
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { getHeight, getWidth } from "meta3d-utils/src/View";
import { getLittleManShootEmitEventName, getLittleManShootStartEventName, getLittleManStandupEndEventName, getLittleManStatusUpdateEventName } from "../../../../utils/EventUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { isControlledState, isDestoryRelatedStates, isNotDamageState, isPickedControlledState } from "../utils/FSMStateUtils"
import { getRandomCollisionPart } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitterLife, emitterSize, emitterSpeed } from "../data/ValueType";
import { updateAnimationCollision } from "./Collision";
import { List, Map } from "immutable";
import * as DamageUtils from "../utils/DamageUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { hp } from "../data/DataType";
import { addHp, computeBox, getBox, getCurrentModelData, getCurrentStudyActionNames, getCurrentStudyActions, getFullHp, getHp, getHpIncrease, getLittleMan, getLittleManState, getName, getSkinMeshs, getStateMachine, getValue, setCurrentStudyActions, setFireWay, setGunInititalTransform, setHp, setInitialTransform, setLittleManState, setStateMachine, setUsedBulletPropName } from "./LittleMan";
import { getPosition, initTransform, setPosition, setPositionAndComputeBox, setRotation } from "./Transform";
import { getAllAnimationNames, initWeights, resetAnimation } from "./Animation";
import { getAimTarget, setAimTarget, shootEmitHandler, shootStartHandler } from "./Shoot";
import { buildBloodDecalQueue } from "../utils/CharacterUtils";
import { getPointerDownEventName } from "meta3d-jiehuo-abstract/src/Event";
// import { swipingEmitHandler, swipingStartHandler } from "./Swiping";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { addGunToHand, initWhenImportScene as initWhenImportSceneGun } from "./Gun";
import { buildAnimationResourceId, modelName } from "../little_man_data/ModelData";
import { getClothHpData } from "../data/mmd/MMDData";
import { addBoneGroup } from "../utils/BoneUtils";
import { Scene } from "meta3d-jiehuo-abstract";
import { clearAttackTargetObjectOrBuilding, resetAttackUnits, setCamp } from "../manage/city1/Army";
import { createInitialState, standupEndHandler } from "./FSMState";
import { isActionState, resetIsTriggerAction } from "./Action";
import { getPlayerCamp } from "../utils/PlayerUtils";
import { getCurrentMMDCharacterNameByUsedGirl, hasCurrentMMDCharacterByUsedGirl, hasGirlByUsedGirl, isMMDCharacterExist, isUseGirl } from "../girl/Girl";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { restoreHp } from "../utils/HpUtils";
import { getStartTime } from "../Time";
import { scene } from "../../../../../ui_layer/global/store/GlobalStoreType";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { clearLockTarget } from "./Lock";
import { removeStatusFromShootTarget } from "../utils/StatusUtils";
import { hideAimCrossWhenDamage, hideAimCrossWhenDestroy, hideHeadShot, showAim } from "./AimUtils";
import { getWeaponBasicBulletBlockService } from "../../../../mod/PropBulletMod";
import { parseAndAddSkill } from "../../../../mod/SkillLittleManMod";
import { setHp as setHpAsLittleManBuildUtils } from "../utils/build/LittleManBuildUtils";
import { buildFuncData } from "../data/FuncData";
import { removePlayerFiniteTimeBuffs } from "../buff/Buff";
import { isExceedMaxMMDGiantessCountAfterAdd } from "../difficulty/HeatImplementer";

export let addGun = (state: state, gun: GLTF, gunName: gunName) => {
    let gunObj = gun.scene

    Shadow.setShadow(gunObj, true, true)

    state = setLittleManState(state, {
        ...getLittleManState(state),
        gunMap: getLittleManState(state).gunMap.set(gunName, gunObj)
    })

    gunObj.traverse((obj: any) => {
        if (obj.isMesh) {
            let _ = changeToPhongMaterial(obj)
        }
    })

    gunObj.name = gunName


    setGunInititalTransform(state, gunObj, getIsDebug(state))

    return state
}

let _createAim = (state: state) => {
    let aim = Billboard.createImage(getAbstractState(state),
        getAimResourceId(),
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        {
            isSizeAttenuation: false,
            isAlwaysShow: true,
            width: 0.1,
            height: 0.1,
        }
    )

    let aimCrossWhenDamage = Billboard.createImage(getAbstractState(state),
        getCrossWhenDamageResourceId(),
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        {
            isSizeAttenuation: false,
            isAlwaysShow: true,
            width: 0.1,
            height: 0.1,
        }
    )

    let aimCrossWhenDestroy = Billboard.createImage(getAbstractState(state),
        getCrossWhenDestroyResourceId(),
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        {
            isSizeAttenuation: false,
            isAlwaysShow: true,
            width: 0.2,
            height: 0.2,
        }
    )

    let headShot = Billboard.createImage(getAbstractState(state),
        getHeadShotResourceId(),
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        {
            isSizeAttenuation: false,
            isAlwaysShow: true,
            width: 0.08,
            height: 0.08,
        }
    )


    state = setLittleManState(state, {
        ...getLittleManState(state),
        aim: NullableUtils.return_(aim),
        aimCrossWhenDamage: NullableUtils.return_(aimCrossWhenDamage),
        aimCrossWhenDestroy: NullableUtils.return_(aimCrossWhenDestroy),
        headShot: NullableUtils.return_(headShot),
    })

    aim.renderOrder = 1
    aimCrossWhenDamage.renderOrder = 2
    aimCrossWhenDestroy.renderOrder = 3
    headShot.renderOrder = 4

    state = showAim(state)
    state = hideAimCrossWhenDamage(state)
    state = hideAimCrossWhenDestroy(state)
    state = hideHeadShot(state)

    return state
}

let _getRestoreHpKey = () => "littleMan_restoreHp"

export let afterInitWhenImportScene = (state: state) => {
    state = setHpAsLittleManBuildUtils(state, buildFuncData(state), (state, hp) => {
        return hp + getHpIncrease(state)
    }, true)

    state = setLittleManState(state, {
        ...getLittleManState(state),
        isStatusChange: true
    })

    return Promise.resolve(state)
}

export let initWhenImportScene = (state: state) => {
    // if (!isLittleCharacterType(state)) {
    //     return Promise.resolve(state)
    // }
    state = setUsedBulletPropName(state, getWeaponBasicBulletBlockService(state).getWeaponName())

    let { resourceId, resourcePath, name } = getCurrentModelData(state)

    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), resourceId), resourcePath).then(littleMan => {
        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Idle), getIdleAnimationResourcePath(getCitySceneName())).then(idle => {
            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Run), getRunningAnimationResourcePath(getCitySceneName())).then(run => {
                return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Shoot), getShootingAnimationResourcePath(getCitySceneName())).then(shoot => {
                    // return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Swiping), getSwipingAnimationResourcePath(getCitySceneName())).then(swiping => {
                    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Shake), getShakeAnimationResourcePath(getCitySceneName())).then(shake => {
                        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), buildAnimationResourceId(animationName.Death, resourceId)), getDeathAnimationResourcePath(getCitySceneName(), name)).then(death => {
                            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.PickedControlled), getControlledAnimationResourcePath(getCitySceneName())).then(pickedControlled => {
                                return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), buildAnimationResourceId(animationName.Lie, resourceId)), getLieAnimationResourcePath(getCitySceneName(), name)).then(lie => {
                                    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), buildAnimationResourceId(animationName.Standup, resourceId)), getStandupAnimationResourcePath(getCitySceneName(), name)).then(standup => {
                                        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), buildAnimationResourceId(animationName.ClimbToTop, resourceId)), getClimbToTopAnimationResourcePath(getCitySceneName(), name)).then(climbToTop => {
                                            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), buildAnimationResourceId(animationName.ClimbToDown, resourceId)), getClimbToDownAnimationResourcePath(getCitySceneName(), name)).then(climbToDown => {

                                                littleMan = addBoneGroup(littleMan)

                                                let abstractState = SkinAnimation.addSkinAnimationMixer(getAbstractState(state), littleMan, getName())

                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Idle,
                                                    idle.animations[0]
                                                )
                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Run,
                                                    run.animations[0]
                                                )
                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Shoot,
                                                    shoot.animations[0]
                                                )
                                                // abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Swiping,
                                                //     swiping.animations[0]
                                                // )
                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Shake,
                                                    shake.animations[0]
                                                )

                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Death,
                                                    death.animations[0]
                                                )

                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.PickedControlled,
                                                    pickedControlled.animations[0]
                                                )


                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Lie,
                                                    lie.animations[0]
                                                )
                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Standup,
                                                    standup.animations[0]
                                                )

                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.ClimbToTop,
                                                    climbToTop.animations[0]
                                                )
                                                abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.ClimbToDown,
                                                    climbToDown.animations[0]
                                                )


                                                state = setAbstractState(state, abstractState)

                                                return parseAndAddSkill(state).then(state => {
                                                    littleMan.name = getName()

                                                    Shadow.setShadow(littleMan, true, true)



                                                    getSkinMeshs(littleMan).forEach(mesh => {
                                                        let _ = changeToPhongMaterial(mesh)

                                                        mesh.material.side = FrontSide
                                                    })



                                                    // Object3DUtils.markNotFrustumCulled(littleMan)



                                                    state = setLittleManState(state, {
                                                        ...getLittleManState(state),
                                                        littleMan: NullableUtils.return_(littleMan)
                                                    })



                                                    // let scene = getScene(state)

                                                    // scene.add(littleMan)


                                                    return state
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
                )
            })
        })
    })
        .then(state => {
            // state = initTransform(state)



            // state = setHp(state, getFullHp(state))


            // state = initProps(state)





            let abstractState = initWeights(getAbstractState(state), state)

            state = setAbstractState(state, abstractState)


            // state = setAbstractState(state, SkinBlendAnimation.activateAllActionsForNotMMD(getAbstractState(state), getName(),
            //     getAllAnimationNames()
            // ))



            return StateMachine.execute(state, getStateMachine(state), null)
        })
        .then(state => {
            // return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getBasicGunResourceId()), Render.getRenderer(getAbstractState(state))).then(basicGun => {
            return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getLaserGunResourceId()), Render.getRenderer(getAbstractState(state))).then(laserGun => {
                return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getRocketGunResourceId()), Render.getRenderer(getAbstractState(state))).then(rocketGun => {
                    // return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getPropGunResourceId()), Render.getRenderer(getAbstractState(state))).then(propGun => {
                    // state = addGun(state, basicGun, gunName.BasicGun)
                    state = addGun(state, laserGun, gunName.LaserGun)
                    state = addGun(state, rocketGun, gunName.RocketGun)
                    // state = addGun(state, propGun, gunName.PropGun)
                    // state = addGun(state, submachineGun, gunName.SubMachineGun)

                    return addGunToHand(state, NullableUtils.getEmpty()).then(state => {
                        state = _createAim(state)


                        // getScene(state).add(aim)


                        state = initWhenImportSceneGun(state)


                        return state
                    })
                    // })
                })
            })
        })
        .then(state => {
            // let scene = getScene(state)


            let box = new Box3()
            state = setLittleManState(state, {
                ...getLittleManState(state),
                box
            })

            // if (getIsDebug(state)) {
            //     addBox3Helper(getAbstractState(state), scene, box, 0x3fff00)

            //     let axesHelper = new AxesHelper(5)

            //     axesHelper.position.copy(getPosition(state))

            //     scene.add(axesHelper)
            // }


            // state = computeBox(state)

            // state = setAbstractState(state, SkinAnimation.playSkinAnimation(getAbstractState(state), animationName.Idle, getName(), true))


            // let action = SkinAnimation.getAction(getAbstractState(state), getName(), animationName.Idle)

            // action.enabled = true;
            // action.setEffectiveTimeScale(1);
            // action.setEffectiveWeight(1);

            // action.time = 0

            // action.setLoop(
            //     LoopRepeat,
            //     Infinity,
            // )
            // action.play()



            state = buildBloodDecalQueue(state, [getLittleManState, setLittleManState])


            return state
        })
        // .then(state => {
        //     state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManShootStartEventName(), shootStartHandler))
        //     state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManShootEmitEventName(), shootEmitHandler))
        //     state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManSwipingStartEventName(), swipingStartHandler))
        //     state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManSwipingEmitEventName(), swipingEmitHandler))
        //     state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManStandupEndEventName(), standupEndHandler))

        //     // state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManDeathNeedFixPositionYOffsetEventName(), deathHandler))
        //     // state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManStandupNeedFixPositionYOffset1EventName(), standupNeedFixHandler))

        //     return state
        // })
        .then(state => {
            state = setHp(state, getFullHp(state))


            state = setCurrentStudyActions(state, [
                {
                    name: actionName.Shoot,

                    time: getStartTime(state)
                },
                {
                    name: actionName.Run,
                    time: getStartTime(state)
                },
                {
                    name: actionName.Idle,
                    time: getStartTime(state)
                },
                {
                    name: actionName.PickedControlled,
                    time: getStartTime(state)
                },
                {
                    name: actionName.Lie,
                    time: getStartTime(state)
                },
                {
                    name: actionName.Standup,
                    time: getStartTime(state)
                },
                {
                    name: actionName.Reborn,
                    time: getStartTime(state)
                },
                {
                    name: actionName.ClimbToTop,
                    time: getStartTime(state)
                },
                {
                    name: actionName.ClimbToDown,
                    time: getStartTime(state)
                },
            ])

            return state
        })
    // .then(state => {
    //     if (getIsDebug(state)) {
    //         state = setLittleManSettingLittleManStrength(state, littleManStrength.High)
    //     }

    //     return state
    // })
    // .then(state => {
    //     return setClothHpData(state)
    // })
    // .then(state => {
    //     return setCamp(state, getName(), camp.LittleMan)
    // })
}


export let addLittleMan = (state: state, worldPosition, worldQuaternion) => {
    let scene = getScene(state)

    scene.add(getLittleMan(state))


    SkinBlendAnimation.activateAllActionsForNotMMD(getAbstractState(state), getName(), getAllAnimationNames(state))

    state = setCamp(state, getName(), getPlayerCamp())


    state = setInitialTransform(state, worldPosition, worldQuaternion)
    state = initTransform(state)
    state = setPosition(state, worldPosition)
    state = setRotation(state, worldQuaternion)

    state = computeBox(state)

    if (getIsDebug(state)) {
        addBox3Helper(getAbstractState(state), scene, getBox(state), 0x3fff00)

        let axesHelper = new AxesHelper(5)

        axesHelper.position.copy(getPosition(state))

        scene.add(axesHelper)
    }



    state = restoreHp(state,
        [
            state => {
                let { restoreHpTime, restoreHpSpeedRate } = getValue(state)

                return [restoreHpTime, restoreHpSpeedRate]
            },
            state => getLittleManState(state).lastDamageTime,
            addHp,
            getHp,
            getFullHp,
            getStateMachine
        ],
        _getRestoreHpKey(),
        characterType.LittleMan
    )



    scene.add(NullableUtils.getExn(getLittleManState(state).aim))
    scene.add(NullableUtils.getExn(getLittleManState(state).aimCrossWhenDamage))
    scene.add(NullableUtils.getExn(getLittleManState(state).aimCrossWhenDestroy))
    scene.add(NullableUtils.getExn(getLittleManState(state).headShot))




    state = setAbstractState(state, CameraControls.resetLittleManDirectionData(getAbstractState(state)))


    // state = resumePlayerData(state, getName(), NullableUtils.getEmpty())



    state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManShootStartEventName(), shootStartHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManShootEmitEventName(), shootEmitHandler))
    // state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManSwipingStartEventName(), swipingStartHandler))
    // state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManSwipingEmitEventName(), swipingEmitHandler))
    state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManStandupEndEventName(), standupEndHandler))


    return StateMachine.changeAndExecuteState(state, (state, name, stateMachine) => {
        return setStateMachine(state, stateMachine)
    }, getStateMachine(state), createInitialState(), getName(), NullableUtils.getEmpty()).then(
        state => {
            return Event.trigger(state, getAbstractState, getLittleManStatusUpdateEventName(), null)
        }
    )
}

let _clearShootStatus = (state: state) => {
    let aimTarget = getAimTarget(state)

    state = setAimTarget(state, NullableUtils.getEmpty())
    state = clearLockTarget(state)
    state = removeStatusFromShootTarget(state, aimTarget)

    return state
}

export let removeLittleMan = (state: state) => {
    let abstactState = Flow.removeDeferExecFuncData(getAbstractState(state), _getRestoreHpKey())
    state = setAbstractState(state, abstactState)

    state = resetIsTriggerAction(state)
    state = resetAnimation(state, animationName.Idle)

    SkinBlendAnimation.deactivateAllActionsForNotMMD(getAbstractState(state), getName(), getAllAnimationNames(state))


    state = _clearShootStatus(state)

    return removePlayerFiniteTimeBuffs(state, getName(), NullableUtils.getEmpty()).then(state => {
        let scene = getScene(state)

        scene.remove(getLittleMan(state))

        scene.remove(NullableUtils.getExn(getLittleManState(state).aim))
        scene.remove(NullableUtils.getExn(getLittleManState(state).aimCrossWhenDamage))
        scene.remove(NullableUtils.getExn(getLittleManState(state).aimCrossWhenDestroy))
        scene.remove(NullableUtils.getExn(getLittleManState(state).headShot))


        state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManShootStartEventName(), shootStartHandler))
        state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManShootEmitEventName(), shootEmitHandler))
        // state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManSwipingStartEventName(), swipingStartHandler))
        // state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManSwipingEmitEventName(), swipingEmitHandler))
        state = setAbstractState(state, Event.off(getAbstractState(state), getLittleManStandupEndEventName(), standupEndHandler))


        return resetAttackUnits(state, attackTarget.LittleMan)
    })
}

export let isCanSwitchToGiantess = (state: state) => {
    if (
        !hasCurrentMMDCharacterByUsedGirl(state, usedGirlEnum.PlayerGirl)
        || !hasGirlByUsedGirl(state, usedGirlEnum.PlayerGirl)
        || !isActionState(state, actionState.Initial)
        || isDestoryRelatedStates(getStateMachine(state))
        // || isUseGirl(state, usedGirl)
        || isControlledState(state, getStateMachine(state))
        || isMMDCharacterExist(state, getCurrentMMDCharacterNameByUsedGirl(state, usedGirlEnum.PlayerGirl))
        || isExceedMaxMMDGiantessCountAfterAdd(state)
    ) {
        return false
    }

    return true

}
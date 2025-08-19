import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler, Color, Bone } from "three";
import { state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleRoad, getOrbitControlsTarget, setLittleManSettingLittleManStrength, setClothHpData } from "../CityScene";
import { camp, gunName, littleMan, littleManActionState, littleManStrength, objectStateName, propName, propType } from "../type/StateType";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { getAimResourceId, getControlledAnimationResourcePath, getBasicGunResourceId, getIdleAnimationResourcePath, getPropGunResourceId, getRunningAnimationResourcePath, getShakeAnimationResourcePath, getShootingAnimationResourcePath, getSwipingAnimationResourcePath, getLaserGunResourceId, getRocketGunResourceId, getLieAnimationResourcePath, getStandupAnimationResourcePath, getDeathAnimationResourcePath, getClimbToTopAnimationResourcePath, getClimbToDownAnimationResourcePath, } from "../little_man_data/Const";
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
import { getLittleManShootEmitEventName, getLittleManShootStartEventName, getLittleManStandupEndEventName, getLittleManSwipingEmitEventName, getLittleManSwipingStartEventName, getMissionFailEventName } from "../../../../utils/EventUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { getGirlPositionParrelToArmy, getParticleNeedCollisionCheckLoopCount, } from "../utils/ArmyUtils";
import { isNotDamageState } from "../utils/FSMStateUtils"
import { getRandomCollisionPart } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitterLife, emitterSize, emitterSpeed } from "../data/ValueType";
import { updateAnimationCollision } from "./Collision";
import { List, Map } from "immutable";
import * as DamageUtils from "../utils/DamageUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { hp } from "../data/DataType";
import { computeBox, getCurrentModelData, getFullHp, getLittleMan, getLittleManState, getName, getSkinMeshs, getStateMachine, setGunInititalTransform, setHp, setLittleManState } from "./LittleMan";
import { getPosition, initTransform } from "./Transform";
import { getAllAnimationNames, initWeights } from "./Animation";
import { shootEmitHandler, shootStartHandler } from "./Shoot";
import { buildBloodDecalQueue } from "../utils/CharacterUtils";
import { getPointerDownEventName } from "meta3d-jiehuo-abstract/src/Event";
import { swipingEmitHandler, swipingStartHandler } from "./Swiping";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { addGunToHand } from "./Gun";
import { initPropsWhenImportScene } from "./Prop";
import { buildAnimationResourceId, modelName } from "../little_man_data/ModelData";
import { getClothHpData } from "../data/mmd/MMDData";
import { addBoneGroup } from "../utils/BoneUtils";
import { Scene } from "meta3d-jiehuo-abstract";
import { setCamp } from "../manage/city1/Army";
import { standupEndHandler } from "./FSMState";

let _addGun = (state: state, gun: GLTF, gunName: gunName) => {
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

export let initWhenImportScene = (state: state) => {
    if (!isLittleRoad(state)) {
        return Promise.resolve(state)
    }

    let { resourceId, resourcePath, name } = getCurrentModelData(state)

    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), resourceId), resourcePath).then(littleMan => {
        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Idle), getIdleAnimationResourcePath(getCitySceneName())).then(idle => {
            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Run), getRunningAnimationResourcePath(getCitySceneName())).then(run => {
                return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Shoot), getShootingAnimationResourcePath(getCitySceneName())).then(shoot => {
                    return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Swiping), getSwipingAnimationResourcePath(getCitySceneName())).then(swiping => {
                        return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Shake), getShakeAnimationResourcePath(getCitySceneName())).then(shake => {
                            return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), buildAnimationResourceId(animationName.Death, resourceId)), getDeathAnimationResourcePath(getCitySceneName(), name)).then(death => {
                                return ModelLoader.parseFbx(getAbstractState(state), Loader.getResource(getAbstractState(state), animationName.Controlled), getControlledAnimationResourcePath(getCitySceneName())).then(controlled => {
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
                                                    abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Swiping,
                                                        swiping.animations[0]
                                                    )
                                                    abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Shake,
                                                        shake.animations[0]
                                                    )

                                                    abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Death,
                                                        death.animations[0]
                                                    )

                                                    abstractState = SkinAnimation.addSkinAnimation(abstractState, getName(), animationName.Controlled,
                                                        controlled.animations[0]
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

                                                    littleMan.name = getName()

                                                    Shadow.setShadow(littleMan, true, true)



                                                    getSkinMeshs(littleMan).forEach(mesh => {
                                                        let _ = changeToPhongMaterial(mesh)
                                                    })



                                                    // Object3DUtils.markNotFrustumCulled(littleMan)



                                                    state = setLittleManState(state, {
                                                        ...getLittleManState(state),
                                                        littleMan: NullableUtils.return_(littleMan)
                                                    })



                                                    let scene = getScene(state)

                                                    scene.add(littleMan)


                                                    return state
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
    })
        .then(state => {
            state = initTransform(state)



            state = setHp(state, getFullHp(state))


            state = initPropsWhenImportScene(state)





            let abstractState = initWeights(getAbstractState(state))

            state = setAbstractState(state, abstractState)


            state = setAbstractState(state, SkinBlendAnimation.activateAllActionsForNotMMD(getAbstractState(state), getName(),
                getAllAnimationNames()
            ))



            return StateMachine.execute(state, getStateMachine(state), null)
        })
        .then(state => {
            return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getBasicGunResourceId()), Render.getRenderer(getAbstractState(state))).then(basicGun => {
                return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getLaserGunResourceId()), Render.getRenderer(getAbstractState(state))).then(laserGun => {
                    return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getRocketGunResourceId()), Render.getRenderer(getAbstractState(state))).then(rocketGun => {
                        return ModelLoader.parseGlb(getAbstractState(state), Loader.getResource(getAbstractState(state), getPropGunResourceId()), Render.getRenderer(getAbstractState(state))).then(propGun => {
                            state = _addGun(state, basicGun, gunName.BasicGun)
                            state = _addGun(state, laserGun, gunName.LaserGun)
                            state = _addGun(state, rocketGun, gunName.RocketGun)
                            state = _addGun(state, propGun, gunName.PropGun)

                            state = addGunToHand(state, NullableUtils.getEmpty())



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

                            state = setLittleManState(state, {
                                ...getLittleManState(state),
                                aim: NullableUtils.return_(aim)
                            })

                            getScene(state).add(aim)




                            return state
                        })
                    })
                })
            })
        })
        .then(state => {
            let scene = getScene(state)


            let box = new Box3()
            state = setLittleManState(state, {
                ...getLittleManState(state),
                box
            })

            if (getIsDebug(state)) {
                addBox3Helper(getAbstractState(state), scene, box, 0x3fff00)

                let axesHelper = new AxesHelper(5)

                axesHelper.position.copy(getPosition(state))

                scene.add(axesHelper)
            }


            state = computeBox(state)

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
        .then(state => {
            state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManShootStartEventName(), shootStartHandler))
            state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManShootEmitEventName(), shootEmitHandler))
            state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManSwipingStartEventName(), swipingStartHandler))
            state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManSwipingEmitEventName(), swipingEmitHandler))
            state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManStandupEndEventName(), standupEndHandler))

            // state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManDeathNeedFixPositionYOffsetEventName(), deathHandler))
            // state = setAbstractState(state, Event.on(getAbstractState(state), getLittleManStandupNeedFixPositionYOffset1EventName(), standupNeedFixHandler))

            return state
        })
        .then(state => {
            if (getIsDebug(state)) {
                state = setLittleManSettingLittleManStrength(state, littleManStrength.High)
            }

            return state
        })
        // .then(state => {
        //     return setClothHpData(state)
        // })
        .then(state => {
            return setCamp(state, getName(), camp.LittleMan)
        })
}
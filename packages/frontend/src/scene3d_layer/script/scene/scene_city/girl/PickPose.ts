import { NullableUtils } from "meta3d-jiehuo-abstract"
import { cameraType, state } from "../../../../type/StateType"
// import * as DynamicCars from "../manage/city1/DynamicCars"
import * as Citiyzen from "../manage/city1/Citiyzen"
import * as Soldier from "../manage/city1/soldier/Soldier"
import * as Infantry from "../manage/city1/soldier/Infantry"
import * as Rocketeer from "../manage/city1/soldier/Rocketeer"
import * as Laserer from "../manage/city1/soldier/Laserer"
import * as Commander from "../manage/city1/soldier/Commander"
import * as Melee from "../manage/city1/soldier/Melee"
import * as Tank from "../manage/city1/milltary_vehicle/Tank"
import * as MissileVehicle from "../manage/city1/milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "../manage/city1/milltary_vehicle/FlameVehicle"
import * as ShellTurret from "../manage/city1/milltary_building/ShellTurret"
import * as MissileTurret from "../manage/city1/milltary_building/MissileTurret"
import * as LittleMan from "../little_man/LittleMan"
import { getAbstractState, getConfigState } from "../../../../state/State"
import { Box3, Matrix4, Vector2, Vector3 } from "three"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { addHp, getGirl, getValue, hasCurrentMMDCharacterByUsedGirl, hasGirl, isUseGirl, isPlayerGirl, setGirlScale, setGirlScaleAndKeepCamera, isLevelGiantess, isLevelGiantessExceptPlayer, setUsedGirlData, getUsedGirlData, buildNameByUsedGirl, } from "./Girl"
import { getBone } from "../utils/MMDUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { collisionPart, pose, usedGirlEnum } from "../type/StateType"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { characterType, lodQueueIndex, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getGrid } from "../manage/city1/PathFind"
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue"
import { getIsDebug } from "../../Scene"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { IPickObject } from "../type/IPickObject"
import { getCollisionResultWithLittleMan, simplyCollisionResultWithLittleMan } from "../little_man/Collision"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { getScale, updateAllCollisionShapesAndGirlBox } from "./Utils"
import { Console } from "meta3d-jiehuo-abstract"
import { getBody } from "../data/mmd/MMDData"
import { getCollisionPartOBB } from "./Collision"
import { getGiantessParentTransform, updateGiantessAddToHandSkeletonData, updateGiantessAddToPutToBreastSkeletonData, updateGiantessAddToPutToShoeSkeletonData, updateGiantessAddToUBSkeletonData } from "../utils/SkeletonUtils"
import { getCampExn } from "../manage/city1/Army"
import { isGiantessCharacterType, isGiantessCharacterTypeByUsedGirl, isLittleCharacterType } from "../CityScene"
import { getIsControlledData, getPickObjectData, getPutToBreastObjectData, getPutToShoeObjectData, getUBObjectData, isControlledExceptBy, removePickData, removePutToBreastData, removePutToShoeData, removeUBData } from "./PickPoseUtils"
import { getPlayerCamp, isCanDamageLittleMan } from "../utils/PlayerUtils"
import { excitement } from "../data/DataType"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getGiantessExperienceValue, setExperienceValue } from "../build/Upgrade"
import { experienceValue } from "../data/reward/RewardDataType"
import { buildFuncData } from "../data/FuncData"
import { handleForPick as handleForPickMod, getAllModelQueues as getAllModelQueuesaEliteGiantess } from "../../../../mod/EliteGiantessMod"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getCameraType, updateDistanceRateOnlyOnceInOneFrame, updateThirdPersonControlsForChangeScale } from "../Camera"
import { isNotInMovableRanges } from "../little_man/Utils"
import { isUseCareer } from "../build/Career"
import { getFoodieBlockService } from "../../../../mod/CareerMod"
import { setFullHp } from "../utils/build/GiantessBuildUtils"
import { getHpIncrease, getScaleIncrease, setHpIncrease, setScaleIncrease } from "./player/Girl"
import { addBuff } from "../buff/Buff"
import { getBuffCrippledBlockName, getBuffProtocolName, getEatBlockService } from "../../../../mod/BuffMod"
import { getModAPI } from "../Mod"
import { Event } from "meta3d-jiehuo-abstract"
import { buildTriggerEatHandlerEventData, getTriggerPlayerGirlEatHandlerEventName } from "../../../../utils/EventUtils"
import { getEnhenceLevelGiantessLevel } from "../difficulty/HeatImplementer"
import { getBoxVolumn } from "../utils/Box3Utils"
import { changePose } from "./Pose"
import { service } from "buff-protocol/src/service/ServiceType"
import { updateCrawlPosePivot } from "./Crawl"
import { isStatic } from "../utils/OctreeObjectUtils"
import { getTorsorPartialScaleRatio, isFullTorsor, limitTorsorRatio, partialScaleTorsor } from "../utils/PartialScaleGiantessUtils"

const _v1 = /*@__PURE__*/ new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();
// const _v3 = /*@__PURE__*/ new Vector3();
// const _v4 = /*@__PURE__*/ new Vector3();
const _m1 = /*@__PURE__*/ new Matrix4();


export let handleForPick = <T>(state, func: (module_: IPickObject) => T, name) => {
    // if (Citiyzen.isCityzen(name)) {
    //     return func(Citiyzen)
    // }
    if (Infantry.isInfantry(name)) {
        return func(Infantry)
    }
    else if (Rocketeer.isRocketeer(name)) {
        return func(Rocketeer)
    }
    else if (Laserer.isLaserer(name)) {
        return func(Laserer)
    }
    else if (Commander.isCommander(name)) {
        return func(Commander)
    }
    else if (Melee.isMelee(name)) {
        return func(Melee)
    }
    else if (Tank.isTank(name)) {
        return func(Tank)
    }
    else if (MissileVehicle.isMissileVehicle(name)) {
        return func(MissileVehicle)
    }
    else if (FlameVehicle.isFlameVehicle(name)) {
        return func(FlameVehicle)
    }
    else if (ShellTurret.isShellTurret(name)) {
        return func(ShellTurret)
    }
    else if (MissileTurret.isMissileTurret(name)) {
        return func(MissileTurret)
    }
    // else if (MeleeGiantess.isMeleeGiantess(name)) {
    //     return func(MeleeGiantess)
    // }
    else if (LittleMan.isLittleMan(name)) {
        return func(LittleMan)
    }
    else {
        let result = handleForPickMod(state, func, name)
        if (result !== false) {
            return result
        }

        throw new Error("err")
    }
}

// let _getMaxCount = (boxVolumn) => {
//     return NumberUtils.clamp(Math.round(Math.pow(boxVolumn, 1 / 2.5)), 1, 50)
// }

// let _addRandomOffset = (state, allPickedUnits) => {
//     return ArrayUtils.map(allPickedUnits, ([name, box, transform, queue]) => {
//         // let getModelQueueIndexFunc

//         // handleForPick((module_) => {
//         //     getModelQueueIndexFunc = module_.getModelQueueIndex
//         //     // handlePickupFunc = module_.handlePickup
//         //     // getTransformFunc = module_.getPickedTransform
//         //     // updateTransformFunc = module_.updateTransform
//         //     // getLocalTransformFunc = module_.getLocalTransform
//         //     // getBoxFunc = module_.getBoxForPick
//         // }, name)

//         // let index = getModelQueueIndexFunc(state, name)



//         TransformUtils.setPositionToMatrix4(
//             // queue.getTransform(index),
//             transform,
//             // TransformUtils.getPositionFromMatrix4(queue.getTransform(index), _v1)

//             // TransformUtils.getPositionFromMatrix4(queue.getTransform(index), _v1).add(
//             TransformUtils.getPositionFromMatrix4(transform, _v1).add(
//                 _v2.set(
//                     NumberUtils.getRandomFloat(-10, 10),
//                     NumberUtils.getRandomFloat(-10, 10),
//                     NumberUtils.getRandomFloat(-10, 10),
//                     // NumberUtils.getRandomFloat(-2, 2),
//                     // NumberUtils.getRandomFloat(-2, 2),
//                     // NumberUtils.getRandomFloat(-2, 2),
//                 )
//             )
//         )

//         return [name, box, transform, queue]
//     })
// }

let _selectPickedOnesByVolumn = (allPickedUnits, boxVolumn) => {
    return TupleUtils.getTuple2First(allPickedUnits.reduce((
        [result, selectedVolumn],
        [
            name,
            box,
            transform,
            queue
        ]) => {
        selectedVolumn = selectedVolumn + getBoxVolumn(box)

        if (selectedVolumn >= boxVolumn) {
            return [result, selectedVolumn]
        }

        return [ArrayUtils.push(result, [
            name,
            box,
            transform,
            queue
        ]), selectedVolumn]
    }, [[], 0]))
}

export let queryDataByBox = (state, usedGirl, box) => {
    // let camp = getCampExn(state, getName())

    let abstractState = getAbstractState(state)
    let transforms, boxes, names, queues
    switch (usedGirl) {
        case usedGirlEnum.BossGiantess:
        case usedGirlEnum.None:
            [transforms, boxes, names, queues] = [[], [], [], []]
            break
        // case usedGirlEnum.PlayerGirl:
        default:
            [transforms, boxes, names, queues] = Citiyzen.getAllModelQueues(state).concat(
                Soldier.getAllModelQueues(state)
            ).concat(
                Tank.getAllModelQueues(state)
            ).concat(
                MissileVehicle.getAllModelQueues(state)
            ).concat(
                FlameVehicle.getAllModelQueues(state)
            ).concat(
                ShellTurret.getAllModelQueues(state)
            ).concat(
                MissileTurret.getAllModelQueues(state)
            )
                .concat(
                    // EliteGiantess.getAllModelQueues(state)
                    getAllModelQueuesaEliteGiantess(state)
                )
                // .concat(
                //     DynamicCars.getAllModelQueues(state)
                // )
                .reduce((result, queue) => {
                    // let [transforms, boxes, names] = queue.queryRangeByBoxAndCamp(abstractState, getCampExn, state, box, camp)
                    let [transforms, boxes, names] = queue.queryRangeByBox(abstractState, box)

                    return [
                        result[0].concat(transforms),
                        result[1].concat(boxes),
                        result[2].concat(names),
                        result[3].concat(names.map(_ => NullableUtils.return_(queue))),
                        // ArrayUtils.push(result[3], queue)
                    ]
                }, [[], [], [], []])

            break
    }


    // if (isLittleCharacterType(state) && camp != getPlayerCamp()) {
    // if (isLittleCharacterType(state) && isCanDamageLittleMan(state, getCampExn(state, buildNameByUsedGirl(usedGirl)))) {
    if (isLittleCharacterType(state)) {
        NullableUtils.forEach(([transform, box, name]) => {
            transforms.push(transform)
            boxes.push(box)
            names.push(name)
            queues.push(NullableUtils.getEmpty())
        }, simplyCollisionResultWithLittleMan(getCollisionResultWithLittleMan(state, box))
        )
    }

    return [transforms, boxes, names, queues]
}

export let pickupHandler = (state: state, { userData }) => {
    let { box, usedGirl } = NullableUtils.getExn(userData)

    let boxVolumn
    if (getConfigState(state).isPickRangeMax) {
        box.expandByScalar(1000)
        boxVolumn = getBoxVolumn(box)
    }
    else {
        // box.expandByScalar( 0.1 * getScale(state, usedGirl))

        // box.expandByScalar(0.12 * getScale(state, usedGirl))
        // box.expandByScalar(0.16 * getScale(state, usedGirl))
        box.expandByScalar(0.2 * getScale(state, usedGirl))

        boxVolumn = getBoxVolumn(box) / 5
    }

    let boxCenter = box.getCenter(new Vector3())

    let [transforms, boxes, names, queues] = queryDataByBox(state, usedGirl, box)

    let allPickedUnits = _selectPickedOnesByVolumn(names.reduce((result, name, i) => {
        let box = boxes[i]

        if (
            getBoxVolumn(box) <= boxVolumn
            &&
            handleForPick<boolean>(state, (module_) => {
                return NullableUtils.getWithDefault(
                    module_.isCanPickup,
                    (state, name) => true,
                )(state, name)
            }, name)
            && !isControlledExceptBy(state, usedGirl, name)
        ) {
            return ArrayUtils.push(result,
                [
                    name,
                    box,
                    transforms[i],
                    queues[i]
                ]
            )
        }

        return result
    }, []).sort((a, b) => {
        return a[1].getCenter(_v1).distanceTo(boxCenter) - b[1].getCenter(_v2).distanceTo(boxCenter)
    }), boxVolumn)

    // Console.log(
    //     names,
    // pickedOne
    // )

    // let girlScaleWhenPickup = getScale(state, usedGirl)




    // allPickedUnits = _addRandomOffset(state, allPickedUnits)




    return ArrayUtils.reducePromise(allPickedUnits, (state, [name, box, transform, queue]) => {
        let getModelQueueIndexFunc, handlePickupFunc, getTransformFunc, updateTransformFunc, getLocalTransformFunc, getBoxFunc

        handleForPick(state, (module_) => {
            getModelQueueIndexFunc = module_.getModelQueueIndex
            handlePickupFunc = module_.handlePickup
            getTransformFunc = module_.getPickedTransform
            updateTransformFunc = module_.updateTransform
            getLocalTransformFunc = module_.getLocalTransform
            getBoxFunc = module_.getBoxForPick
        }, name)

        return handlePickupFunc(state, usedGirl, name).then(state => {
            return removePutToBreastData(state, name).then(state => {
                return removePutToShoeData(state, name)
            })
                .then(state => {
                    let index = getModelQueueIndexFunc(state, name)

                    state = setUsedGirlData(state, usedGirl, {
                        ...getUsedGirlData(state, usedGirl),
                        giantessAddToHandSkeletonData: getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.push(
                            {
                                getTransformFunc,
                                updateTransformFunc,
                                getLocalTransformFunc,
                                getBoxFunc,

                                usedGirl,
                                queue,
                                index: index,
                                name: name,
                                // transform: transform.clone(),
                                // box: box.clone(),
                                originTransform: transform.clone(),
                                originBox: box.clone(),

                                // girlScaleWhenPickup: girlScaleWhenPickup
                                // handBox: originBox,
                            }
                        )
                    })

                    return state
                })
        })
    }, state)
}

export let pinchJudgeDamageHandler = (state: state, { userData }) => {
    let { usedGirl } = NullableUtils.getExn(userData)

    return ArrayUtils.reducePromise(
        getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.toArray(),
        (state, { queue, name, index, getBoxFunc }) => {
            let getHpFunc
            handleForPick(state, module_ => {
                getHpFunc = module_.getHp
            }, name)

            if (
                NullableUtils.getWithDefault(
                    NullableUtils.map(queue => {
                        return queue.isAlive(index)
                    }, queue),
                    true
                )
                && getHpFunc(state, name) > 0) {
                let api = getModAPI(state)

                let level = api.getGiantessLevel(api, state, usedGirl, "upgrade-skill-enhence-pinch-crippled")
                if (level > 0) {
                    return api.NullableUtils.getWithDefault(
                        api.NullableUtils.map(box => {
                            return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffCrippledBlockName()).addBuff(api, state, name, api.NullableUtils.getEmpty(), level, 20, api.box3.getBoxTopPoint(box, 0.2, api.vector3.createEmpty()))
                        }, getBoxFunc(state, queue, index, name)),
                        Promise.resolve(state)
                    )
                }

                return Promise.resolve(state)
            }

            return removePickData(state, name)

        },
        state
    )
}

export let getUnitFullHpAndExcitement = (state, name) => {
    let hp, excitement_
    handleForPick(state, module_ => {
        let value = module_.getValue(state)
        hp = value.hp
        excitement_ = value.excitement
    }, name)

    return [hp, excitement_]
}

export let eat = (state: state, usedGirl, names: Array<string>, boxes: Array<Box3>) => {
    let count = names.length
    if (count == 0) {
        return Promise.resolve(state)
    }


    let torsorVolumn = getBoxVolumn(getCollisionPartOBB(state, usedGirl, collisionPart.Torso).toBox3())

    let newTorsorPartialScaleRatio = limitTorsorRatio(state, usedGirl, getTorsorPartialScaleRatio(state, usedGirl)
        + NumberUtils.clamp(boxes.reduce((result, box) => {
            return result + getBoxVolumn(box)
        }, 0) / torsorVolumn, 0.01, 1))

    if (isFullTorsor(state, usedGirl, newTorsorPartialScaleRatio)) {
        // state = names.reduce(removePickData, state)
        // return Promise.resolve(state)
        return ArrayUtils.reducePromise(names, (state, name) => {
            return removePickData(state, name)
        }, state)
    }

    state = partialScaleTorsor(state, usedGirl, newTorsorPartialScaleRatio)



    state = updateDistanceRateOnlyOnceInOneFrame(state)

    let funcData = buildFuncData(state)

    return getEatBlockService(state).addBuff(getModAPI(state), state, usedGirl, count).then(state => {
        return ArrayUtils.reducePromise(
            // getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.toArray(),
            names,
            (state, name) => {
                // if (isStatic(state, name)) {
                //     return Promise.resolve(state)
                // }
                let [hp, excitement_] = getUnitFullHpAndExcitement(state, name)

                // let factor = NumberUtils.clamp(excitement_ / excitement.Middle, 0.5, 5)
                // let factor = NumberUtils.clamp(excitement_ / excitement.Middle, 0.5, 5) * 0.3
                let countFactor = count <= 2 ? 1 : NumberUtils.clamp(
                    6 / count, 0.3, 1
                )

                // let factor = NumberUtils.clamp(excitement_ / excitement.Middle, 0.5, 5) * 0.3 * countFactor
                // let factor = NumberUtils.clamp(excitement_ / excitement.Middle, 0.5, 5) * 0.5
                let factor = NumberUtils.clamp(excitement_ / excitement.Middle, 0.5, 5) * 0.25
                let scaleIncrease = 1 * factor

                let addedHp = Math.round(hp * getValue(state, usedGirl).abstorbHpRate)

                // state = addHp(state, getBody(), Math.round(hp * factor * getValue(state).abstorbHpRate))
                state = addHp(state, usedGirl, getBody(), addedHp)


                // let funcData = buildFuncData(state)
                // state = funcData.GiantessBuildUtils.setAttribute(state, funcData, (girlValue) => {
                //     return {
                //         ...girlValue,
                //         initialScale: girlValue.initialScale + scaleIncrease,
                //     }
                // }, usedGirl)
                state = setGirlScale(state, usedGirl, getScale(state, usedGirl) + scaleIncrease)


                return removePickData(state, name).then(state => {
                    if (isLevelGiantessExceptPlayer(state, usedGirl)
                        && getEnhenceLevelGiantessLevel(state) > 5
                    ) {
                        state = setFullHp(state, funcData, (state, hp) => {
                            return hp + Math.round(addedHp / 2 * getEnhenceLevelGiantessLevel(state) / 2)
                        }, false, usedGirl)
                    }

                    if (isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
                        // if (
                        //     isUseCareer(state, characterType.Giantess, getFoodieBlockService(state).getName())
                        // ) {
                        //     state = setScaleIncrease(state, getScaleIncrease(state) + scaleIncrease)

                        //     let oldHpIncrease = getHpIncrease(state)
                        //     let newHpIncrease = oldHpIncrease + 5

                        //     state = setHpIncrease(state, newHpIncrease)
                        //     state = setFullHp(state, funcData, (state, hp) => {
                        //         return hp - oldHpIncrease + newHpIncrease
                        //     }, false, usedGirlEnum.PlayerGirl)
                        // }


                        // state = setGiantessExperienceValue(state, Math.round(getGiantessExperienceValue(state) + experienceValue.High * factor * countFactor))
                        // state = setExperienceValue(state, getName(), Math.round(getGiantessExperienceValue(state) + experienceValue.High * factor * countFactor))

                        return Event.trigger(state, getAbstractState, getTriggerPlayerGirlEatHandlerEventName(), buildTriggerEatHandlerEventData(scaleIncrease))
                    }


                    return state
                })
            },
            state
        ).then(state => updateAllCollisionShapesAndGirlBox(state, usedGirl))
            .then(state => updateCrawlPosePivot(state, usedGirl))
    })
}

export let eatHandler = (state: state, { userData }) => {
    let { usedGirl } = userData

    return eat(state, usedGirl, getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.toArray().map(data => data.name),
        getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.toArray().map(data => data.originBox)
    )
}

export let pickdownHandler = (state: state, { userData }) => {
    let { usedGirl } = userData

    return ArrayUtils.reducePromise(
        getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData.toArray(),
        (state, { queue, name, index, originTransform }) => {
            let { point } = NullableUtils.getExn(userData)

            if (LittleMan.isLittleMan(name)
                && isNotInMovableRanges(point, LittleMan.getMovableRanges(state))) {
                point = new Vector3(0, 0, 0)
            }

            let targetPoint = point.clone().setY(0)

            let promise

            if (
                NullableUtils.getWithDefault(
                    NullableUtils.map(queue => {
                        return queue.isAlive(index)
                    }, queue),
                    true
                )
            ) {
                handleForPick(state, module_ => {
                    promise = module_.handlePickdown(state, name, index, targetPoint, queue, originTransform)
                }, name)
            }
            else {
                promise = Promise.resolve([state, false])
            }

            return promise.then(([state, isSuccess]) => {
                if (isSuccess) {
                    state = removePickData(state, name)
                }

                return state
            })

        },
        state
    )
}

let _handleFall = (state, removeFunc, data) => {
    return ArrayUtils.reducePromise(
        data.toArray(),
        (state, { queue, name, index, originTransform }) => {
            // let { point } = NullableUtils.getExn(userData)

            // if (LittleMan.isLittleMan(name)
            //     && isNotInMovableRanges(point, LittleMan.getMovableRanges(state))) {
            //     point = new Vector3(0, 0, 0)
            // }

            // let targetPoint = point.clone().setY(0)

            let promise

            if (
                NullableUtils.getWithDefault(
                    NullableUtils.map(queue => {
                        return queue.isAlive(index)
                    }, queue),
                    true
                )
            ) {
                handleForPick(state, module_ => {
                    promise = module_.handleFall(state, name, index, queue, originTransform)
                }, name)
            }
            else {
                promise = Promise.resolve([state, false])
            }

            return promise.then(([state, isSuccess]) => {
                // if (!isSuccess) {
                //     throw new Error("error");
                // }

                return removeFunc(state, name)
            })

        },
        state
    )
}

export let handleHandFall = (state: state, usedGirl) => {
    return _handleFall(state, removePickData, getPickObjectData(state, usedGirl))
}

export let handleUBFall = (state: state, usedGirl) => {
    return _handleFall(state, removeUBData, getUBObjectData(state, usedGirl))
}

export let handleBreastFall = (state: state, usedGirl) => {
    return _handleFall(state, removePutToBreastData, getPutToBreastObjectData(state, usedGirl))
}

export let handleShoeFall = (state: state, usedGirl) => {
    return _handleFall(state, removePutToShoeData, getPutToShoeObjectData(state, usedGirl))
}


export let insertUBHandler = (state: state, { userData }) => {
    let { data, usedGirl } = NullableUtils.getExn(userData)

    return ArrayUtils.reducePromise(data, (state, [queue, index, name, originTransform, originBox]) => {
        // let getModelQueueIndexFunc,
        let handleUBControlFunc, getTransformFunc, updateTransformFunc, getLocalTransformFunc, getBoxFunc

        handleForPick(state, (module_) => {
            // getModelQueueIndexFunc = module_.getModelQueueIndex
            handleUBControlFunc = module_.handleUBControl
            getTransformFunc = module_.getUBControlledTransform
            updateTransformFunc = module_.updateUBControlledTransform
            getLocalTransformFunc = module_.getLocalTransform
            getBoxFunc = module_.getBoxForPick
        }, name)

        return handleUBControlFunc(state, usedGirl, name).then(state => {
            // let index = getModelQueueIndexFunc(state, name)

            state = setUsedGirlData(state, usedGirl, {
                ...getUsedGirlData(state, usedGirl),
                giantessAddToUBSkeletonData: getUsedGirlData(state, usedGirl).giantessAddToUBSkeletonData.push(
                    {
                        getTransformFunc,
                        updateTransformFunc,
                        getLocalTransformFunc,
                        getBoxFunc,


                        usedGirl,
                        queue,
                        index: index,
                        name: name,

                        originTransform: originTransform.clone(),
                        originBox: originBox.clone(),
                    }
                )
            })

            return state
        })
    }, state)
}

export let putToBreastHandler = (state: state, { userData }) => {
    let { data, usedGirl } = NullableUtils.getExn(userData)

    return ArrayUtils.reducePromise(data, (state, [queue, index, name, originTransform, originBox]) => {
        // let getModelQueueIndexFunc,
        let handlePutToBreastFunc, getTransformFunc, updateTransformFunc, getLocalTransformFunc, getBoxFunc

        handleForPick(state, (module_) => {
            // getModelQueueIndexFunc = module_.getModelQueueIndex
            handlePutToBreastFunc = module_.handlePutToBreast
            getTransformFunc = module_.getPutToBreastTransform
            updateTransformFunc = module_.updatePutToBreastTransform
            getLocalTransformFunc = module_.getLocalTransform
            getBoxFunc = module_.getBoxForPick
        }, name)

        return handlePutToBreastFunc(state, usedGirl, name).then(state => {
            // let index = getModelQueueIndexFunc(state, name)

            state = setUsedGirlData(state, usedGirl, {
                ...getUsedGirlData(state, usedGirl),
                giantessAddToBreastSkeletonData: getUsedGirlData(state, usedGirl).giantessAddToBreastSkeletonData.push(
                    {
                        getTransformFunc,
                        updateTransformFunc,
                        getLocalTransformFunc,
                        getBoxFunc,

                        usedGirl,
                        queue,
                        index: index,
                        name: name,

                        originTransform: originTransform.clone(),
                        originBox: originBox.clone(),
                    }
                )
            })

            return state
        })
    }, state)
}

export let putToShoeHandler = (state: state, { userData }) => {
    let { data, usedGirl } = NullableUtils.getExn(userData)

    return ArrayUtils.reducePromise(data, (state, [queue, index, name, originTransform, originBox]) => {
        // let getModelQueueIndexFunc,
        let handlePutToShoeFunc, getTransformFunc, updateTransformFunc, getLocalTransformFunc, getBoxFunc

        handleForPick(state, (module_) => {
            // getModelQueueIndexFunc = module_.getModelQueueIndex
            handlePutToShoeFunc = module_.handlePutToShoe
            getTransformFunc = module_.getPutToShoeTransform
            updateTransformFunc = module_.updatePutToShoeTransform
            getLocalTransformFunc = module_.getLocalTransform
            getBoxFunc = module_.getBoxForPick
        }, name)

        return handlePutToShoeFunc(state, usedGirl, name).then(state => {
            // let index = getModelQueueIndexFunc(state, name)

            state = setUsedGirlData(state, usedGirl, {
                ...getUsedGirlData(state, usedGirl),
                giantessAddToShoeSkeletonData: getUsedGirlData(state, usedGirl).giantessAddToShoeSkeletonData.push(
                    {
                        getTransformFunc,
                        updateTransformFunc,
                        getLocalTransformFunc,
                        getBoxFunc,

                        usedGirl,
                        queue,
                        index: index,
                        name: name,

                        originTransform: originTransform.clone(),
                        originBox: originBox.clone(),
                    }
                )
            })

            return state
        })
    }, state)
}

export let getGirlPickBone = (state: state, usedGirl) => {
    return getBone(state, usedGirl, getGirl(state, usedGirl), "右手首")
}

// export let getPickData = (state: state) => {
//     return NullableUtils.getExn(getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData)
// }

// export let getPickObjectGirlScaleWhenPickup = (state: state) => {
//     let { girlScaleWhenPickup } = NullableUtils.getExn(getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData)

//     return girlScaleWhenPickup
// }


// export let isPickData = (state, name: name) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(({ queue, index }) => {
//             return queue.getName(index) == name
//         }, getUsedGirlData(state, usedGirl).giantessAddToHandSkeletonData), false)
// }


// export let isPickdownValid = hasPickData

export let update = (state: state, usedGirl) => {
    return updateGiantessAddToHandSkeletonData(state, getPickObjectData(state, usedGirl)).then(state => {
        return updateGiantessAddToUBSkeletonData(state, getUBObjectData(state, usedGirl))
    }).then(state => {
        return updateGiantessAddToPutToBreastSkeletonData(state, getPutToBreastObjectData(state, usedGirl))
    }).then(state => {
        return updateGiantessAddToPutToShoeSkeletonData(state, getPutToShoeObjectData(state, usedGirl))
    })
}
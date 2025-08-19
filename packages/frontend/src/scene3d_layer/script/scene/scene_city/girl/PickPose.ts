import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
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
import { addHp, getGirl, getGirlState, getName, getValue, setGirlState } from "./Girl"
import { getBone } from "../utils/MMDUtils"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { collisionPart } from "../type/StateType"
import { LODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/LODQueue"
import { lodQueueIndex, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getGrid } from "../manage/city1/PathFind"
import { HierachyLODQueue } from "meta3d-jiehuo-abstract/src/lod/lod2/HierachyLODQueue"
import { getIsDebug } from "../../Scene"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { IPickObject } from "../type/IPickObject"
import { getCollisionResultWithLittleMan, simplyCollisionResultWithLittleMan } from "../little_man/Collision"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { getScale } from "./Utils"
import { Console } from "meta3d-jiehuo-abstract"
import { getBody } from "../data/mmd/MMDData"
import { getCollisionPartOBB } from "./Collision"
import { getGiantessParentTransform, updateGiantessAddToSkeletonData } from "../utils/SkeletonUtils"

const _v1 = /*@__PURE__*/ new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();
// const _v3 = /*@__PURE__*/ new Vector3();
// const _v4 = /*@__PURE__*/ new Vector3();
const _m1 = /*@__PURE__*/ new Matrix4();


let _getBoxVolumn = (box: Box3) => {
    let s = box.getSize(_v1)

    return s.x * s.y * s.z
}

let _handle = <T>(func: (module_: IPickObject) => T, name) => {
    if (Citiyzen.isCityzen(name)) {
        return func(Citiyzen)
    }
    else if (Infantry.isInfantry(name)) {
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
    else if (LittleMan.isLittleMan(name)) {
        return func(LittleMan)
    }
    else {
        throw new Error("err")
    }
}

export let pickupHandler = (state: state, { userData }) => {
    let { box } = NullableUtils.getExn(userData)

    let boxVolumn
    if (getConfigState(state).isPickRangeMax) {
        box.expandByScalar(1000)
        boxVolumn = _getBoxVolumn(box)
    }
    else {
        // box.expandByScalar( 0.1 * getScale(state))
        box.expandByScalar(0.12 * getScale(state))
        boxVolumn = _getBoxVolumn(box) / 5
    }


    let boxCenter = box.getCenter(new Vector3())



    let abstractState = getAbstractState(state)

    let [transforms, boxes, names, queues] = Citiyzen.getAllModelQueues(state).concat(
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
        // .concat(
        //     DynamicCars.getAllModelQueues(state)
        // )
        .reduce((result, queue) => {
            let [transforms, boxes, names] = queue.queryRangeByBox(abstractState, box)

            return [
                result[0].concat(transforms),
                result[1].concat(boxes),
                result[2].concat(names),
                result[3].concat(names.map(_ => NullableUtils.return_(queue))),
                // ArrayUtils.push(result[3], queue)
            ]
        }, [[], [], [], []])

    let collisionResultWithLittleMan = simplyCollisionResultWithLittleMan(getCollisionResultWithLittleMan(state, box))
    NullableUtils.forEach(([transform, box, name]) => {
        transforms.push(transform)
        boxes.push(box)
        names.push(name)
        queues.push(NullableUtils.getEmpty())
    },
        collisionResultWithLittleMan
    )


    let pickedOne = names.reduce((result, name, i) => {
        let box = boxes[i]

        if (
            _getBoxVolumn(box) <= boxVolumn
            &&
            _handle<boolean>((module_) => {
                return NullableUtils.getWithDefault(
                    module_.isCanPickup,
                    (state, name) => true,
                )(state, name)
            }, name)
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
    })[0]

    // Console.log(
    //     names,
    // pickedOne
    // )

    // let girlScaleWhenPickup = getScale(state)

    return NullableUtils.getWithDefault(
        NullableUtils.map(([name, box, transform, queue]) => {
            let getModelQueueIndexFunc, handlePickupFunc, getTransformFunc, updateTransformFunc, getLocalTransformFunc, getBoxFunc

            _handle((module_) => {
                getModelQueueIndexFunc = module_.getModelQueueIndex
                handlePickupFunc = module_.handlePickup
                getTransformFunc = module_.getPickedTransform
                updateTransformFunc = module_.updateTransform
                getLocalTransformFunc = module_.getLocalTransform
                getBoxFunc = module_.getBoxForPick
            }, name)

            return handlePickupFunc(state, name).then(state => {
                let index = getModelQueueIndexFunc(state, name)

                state = setGirlState(state, {
                    ...getGirlState(state),
                    giantessAddToSkeletonData: NullableUtils.return_(
                        {
                            getTransformFunc,
                            updateTransformFunc,
                            getLocalTransformFunc,
                            getBoxFunc,

                            queue,
                            index: index,
                            name: name,
                            // transform: transform.clone(),
                            // box: box.clone(),
                            originTransform: transform.clone(),

                            // girlScaleWhenPickup: girlScaleWhenPickup
                            // handBox: originBox,
                        }
                    )
                })

                return state
            })

        }, pickedOne),
        Promise.resolve(state)
    )
}

export let pinchJudgeDamageHandler = (state: state, { userData }) => {
    let { name, index } = NullableUtils.getExn(getGirlState(state).giantessAddToSkeletonData)

    // let name = queue.names[index]

    let getHpFunc
    _handle(module_ => {
        getHpFunc = module_.getHp
    }, name)

    // Console.log(
    //     "pinch judge:",
    //     getHpFunc(state, name)
    // )

    if (getHpFunc(state, name) <= 0) {
        state = removePickData(state)
    }

    return Promise.resolve(state)
}

export let eatHandler = (state: state, { userData }) => {
    let { name, index } = NullableUtils.getExn(getGirlState(state).giantessAddToSkeletonData)

    // let name = queue.names[index]

    let hp
    _handle(module_ => {
        hp = module_.getValue(state).hp
    }, name)

    state = addHp(state, getBody(), hp * getValue(state).abstorbHpRate)


    state = removePickData(state)


    return Promise.resolve(state)
}

export let pickdownHandler = (state: state, { userData }) => {
    let { point } = NullableUtils.getExn(userData)

    let { queue, name, index, originTransform } = NullableUtils.getExn(getGirlState(state).giantessAddToSkeletonData)

    let targetPoint = point.clone().setY(0)

    let promise
    // let name = queue.names[index]
    _handle(module_ => {
        promise = module_.handlePickdown(state, name, index, targetPoint, queue, originTransform)
    }, name)


    return promise.then(([state, isSuccess]) => {
        if (isSuccess) {
            state = removePickData(state)
        }

        return state
    })
}

export let getGirlPickBone = (state: state) => {
    return getBone(state, getGirl(state), "右手首")
}

export let update = (state: state) => {
    return updateGiantessAddToSkeletonData(state, getGirlState(state).giantessAddToSkeletonData, collisionPart.RightHand, "右手首")
}

// export let getPickData = (state: state) => {
//     return NullableUtils.getExn(getGirlState(state).giantessAddToSkeletonData)
// }

// export let getPickObjectGirlScaleWhenPickup = (state: state) => {
//     let { girlScaleWhenPickup } = NullableUtils.getExn(getGirlState(state).giantessAddToSkeletonData)

//     return girlScaleWhenPickup
// }


export let getPickObjectBox = (state: state) => {
    let { getBoxFunc, queue, index, name } = NullableUtils.getExn(getGirlState(state).giantessAddToSkeletonData)

    return getBoxFunc(state, queue, index, name)
}

export let getPickObjectQueueName = (state: state) => {
    let { queue } = NullableUtils.getExn(getGirlState(state).giantessAddToSkeletonData)

    return NullableUtils.map(queue => queue.name, queue)
}

export let getPickObjectName = (state) => {
    let { name } = NullableUtils.getExn(getGirlState(state).giantessAddToSkeletonData)

    return name
}


export let hasPickData = (state: state) => {
    return !NullableUtils.isNullable(getGirlState(state).giantessAddToSkeletonData)
}

// export let isPickData = (state, name: name) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(({ queue, index }) => {
//             return queue.names[index] == name
//         }, getGirlState(state).giantessAddToSkeletonData), false)
// }


export let removePickData = (state: state) => {
    return setGirlState(state, {
        ...getGirlState(state),
        giantessAddToSkeletonData: NullableUtils.getEmpty()
    })
}

// export let isPickdownValid = hasPickData

export let getPickupWorkFrameIndex = () => 41

export let getPinchWorkFrameIndex = () => 10

export let getEatWorkFrameIndex = () => 20

export let getEatRemovePickDataFrameIndex = () => 25

export let getPickdownWorkFrameIndex = () => 45

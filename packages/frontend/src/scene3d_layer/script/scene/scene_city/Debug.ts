import { Map } from "immutable"
import { state } from "../../../type/StateType"
import { getState, setState } from "./CityScene"
import { damageType, debug } from "./type/StateType"
import * as Girl from "./girl/Girl"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { hp } from "./data/DataType"
import { Vector3 } from "three"
import { getAbstractState, setAbstractState } from "../../../state/State"
import { LabelManager } from "meta3d-jiehuo-abstract"
import { fontType, labelAnimation } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as Citiyzen from "./manage/city1/Citiyzen"
import * as Soldier from "./manage/city1/soldier/Soldier"
import * as Tank from "./manage/city1/milltary_vehicle/Tank"
import * as MissileVehicle from "./manage/city1/milltary_vehicle/MissileVehicle"
import * as FlameVehicle from "./manage/city1/milltary_vehicle/FlameVehicle"
import * as ShellTurret from "./manage/city1/milltary_building/ShellTurret"
import * as MissileTurret from "./manage/city1/milltary_building/MissileTurret"
import { LOD } from "meta3d-jiehuo-abstract"
import { getHpMap, setHpMap } from "../../../mod/EliteGiantessMod"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { getAllAliveArmyData, getAllFlattenAliveArmyData } from "./utils/ArmyUtils"
import { damageWithMultipleData, getMaxForce } from "./utils/DamageUtils"
import { buildRandomDirection } from "../../../utils/DirectionUtils"
import { armorPiercingForceRatio, critRatio, weaponType } from "./data/ValueType"
import { buildEffectWeaponValue } from "./utils/WeaponUtils"
import { getGirlPosition } from "./girl/Utils"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { getPlayerName, getPlayerPosition } from "./utils/PlayerUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"

let _getState = (state: state) => {
    return getState(state).debug
}

let _setState = (state: state, value: debug) => {
    return setState(state, {
        ...getState(state),
        debug: value
    })
}

let _setHp = (hpMap, hpMapForRestore, hp) => {
    return hpMap.reduce(([newHpMap, hpMapForRestore], value, name) => {
        // if (hpMapForRestore.has(name)) {
        //     throw new Error(`name:${name} exist`)
        // }

        return [
            newHpMap.set(name, hp),
            hpMapForRestore.set(name, value)
        ]
    }, [Map(), hpMapForRestore])

    // return MutableMapUtils.reduce(hpMap, ([newHpMap, hpMapForRestore], value, name) => {
    //     // if (hpMapForRestore.has(name)) {
    //     //     throw new Error(`name:${name} exist`)
    //     // }

    //     return [
    //         newHpMap.set(name, hp),
    //         hpMapForRestore.set(name, value)
    //     ]
    // }, [Map(), hpMapForRestore])
}

export let setHp = (state: state, hp) => {
    let { hpMap } = _getState(state)
    let { cityzen, car, dynamicCar, building, treeAndProp, soldier, milltaryVehicle, milltaryBuilding } = getState(state)

    let d = _setHp(
        cityzen.hpMap,
        hpMap,
        hp
    )
    cityzen.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        car.hpMap,
        hpMap,
        hp
    )
    car.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        dynamicCar.hpMap,
        hpMap,
        hp
    )
    dynamicCar.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        building.hpMap,
        hpMap,
        hp
    )
    building.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        treeAndProp.hpMap,
        hpMap,
        hp
    )
    treeAndProp.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        soldier.hpMap,
        hpMap,
        hp
    )
    soldier.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        milltaryVehicle.hpMap,
        hpMap,
        hp
    )
    milltaryVehicle.hpMap = d[0]
    hpMap = d[1]

    d = _setHp(
        milltaryBuilding.hpMap,
        hpMap,
        hp
    )
    milltaryBuilding.hpMap = d[0]
    hpMap = d[1]



    d = _setHp(
        getHpMap(state),
        // eliteGiantess.hpMap,
        hpMap,
        hp
    )
    // eliteGiantess.hpMap = d[0]
    state = setHpMap(state, d[0])
    hpMap = d[1]


    return _setState(state, {
        ..._getState(state),
        hpMap: hpMap
    })
}

export let setGirlHp = Girl.setHp

let _restoreHp = (hpMap, hpMapForRestore) => {
    return hpMap.map((value, name) => {
        return NullableUtils.getWithDefault(hpMapForRestore.get(name), value)
    })
}

export let restoreHp = (state: state) => {
    let { hpMap } = _getState(state)
    let { cityzen, car, dynamicCar, building, treeAndProp, soldier, milltaryVehicle, milltaryBuilding } = getState(state)


    cityzen.hpMap = _restoreHp(
        cityzen.hpMap,
        hpMap
    )
    car.hpMap = _restoreHp(
        car.hpMap,
        hpMap
    )
    dynamicCar.hpMap = _restoreHp(
        dynamicCar.hpMap,
        hpMap
    )
    building.hpMap = _restoreHp(
        building.hpMap,
        hpMap
    )
    treeAndProp.hpMap = _restoreHp(
        treeAndProp.hpMap,
        hpMap
    )
    soldier.hpMap = _restoreHp(
        soldier.hpMap,
        hpMap
    )
    milltaryVehicle.hpMap = _restoreHp(
        milltaryVehicle.hpMap,
        hpMap
    )
    milltaryBuilding.hpMap = _restoreHp(
        milltaryBuilding.hpMap,
        hpMap
    )
    state = setHpMap(state, _restoreHp(
        getHpMap(state),
        hpMap
    ))


    return _setState(state, {
        ..._getState(state),
        hpMap: Map()
    })
}

export let isHPMax = (state: state) => {
    return _getState(state).hpMap.count() > 0
}

let _addNameLabel = (state, box, name, isVisible) => {
    let center = box.getCenter(new Vector3())
    let height = box.getSize(new Vector3()).y

    return setAbstractState(state, LabelManager.addLabel(getAbstractState(state), {
        targetName: name,

        text: `${name.slice(-8, name.length)}`,
        position: center.setY(center.y + height),
        time: 1000000,
        fontType: isVisible ? fontType.NormalAttack : fontType.HeavyAttack,
        animation: labelAnimation.Normal,
        sizeFactor: 1,
        isSizeAttenuation: false,

        isAddToSpecifyPosition: false,

        height: NullableUtils.return_(10),
    }, false))
}

export let showDynamicName = (state: state) => {
    state = setAbstractState(state, LabelManager.clearLabel(getAbstractState(state)))

    return Citiyzen.getAllModelQueues(state).concat(Soldier.getAllModelQueues(state)).concat([
        Tank.getTankBodyQueue(state)
    ]).concat([
        MissileVehicle.getMissileVehicleBodyQueue(state)
    ]).concat([
        FlameVehicle.getFlameVehicleBodyQueue(state)
    ]).concat([
        ShellTurret.getShellTurretBodyQueue(state)
    ]).concat([
        MissileTurret.getMissileTurretBodyQueue(state)
    ])
        .reduce((state, queue) => {
            return queue.reduce(state, (state, transform, index) => {
                // let name = queue.getName(index)
                // let box = queue.getBox(index)
                let name = queue.getName(index)
                let box = queue.getBox(index)
                // let status = queue.getStatus(index)


                return _addNameLabel(state, box, name, queue.getIsVisible(index))
            })
        }, state)
}

export let showStaticName = (state: state) => {
    state = setAbstractState(state, LabelManager.clearLabel(getAbstractState(state)))

    return LOD.getAllStaticLODContainerIndices(getAbstractState(state)).reduce((state, index) => {
        let abstactState = getAbstractState(state)

        let name = LOD.getName(abstactState, index)
        let box = LOD.getBox(abstactState, index)
        let isVisible = LOD.getIsVisible(abstactState, index)

        return _addNameLabel(state, box, name, isVisible)
    }, state)
}

export let destoryAllUnits = (state: state) => {
    return damageWithMultipleData(state, [
        [getMaxForce(), buildRandomDirection()],
        [
            damageType.Normal, weaponType.Power
        ]
    ],
        buildEffectWeaponValue(getMaxForce(), armorPiercingForceRatio.High, weaponType.Power, critRatio.Big),
        getPlayerName(state),
        getPlayerPosition(state),
        ArrayUtils.unzip(getAllFlattenAliveArmyData(state).map(d => {
            return [
                d.queue.getTransform(d.index),
                d.queue.getBox(d.index),
                d.queue.getName(d.index)
            ]
        }))
    ).then(TupleUtils.getTuple2First)
}

export let createState = (): debug => {
    return {
        hpMap: Map()
    }
}

export let dispose = (state: state) => {
    return _setState(state, createState())
}
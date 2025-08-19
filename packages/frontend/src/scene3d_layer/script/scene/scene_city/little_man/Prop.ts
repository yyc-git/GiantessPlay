import { List } from "immutable"
import { state } from "../../../../type/StateType"
import { getLittleManState, setLittleManState } from "./LittleMan"
import { propCount, propName, propType } from "../type/StateType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getLittleManSetting } from "../CityScene";
import { getIsDebug } from "../../Scene";

export let initPropsWhenImportScene = (state: state) => {
    let bulletCount
    switch (getLittleManSetting(state).propCount) {
        case propCount.Low:
            bulletCount = 5
            break
        case propCount.Middle:
            bulletCount = 10
            break
        case propCount.High:
            bulletCount = 99
            break
        case propCount.Infinity:
            bulletCount = Infinity
            break
        default:
            throw new Error("err")
    }

    if (getIsDebug(state)) {
        bulletCount = Infinity
    }

    return setLittleManState(state, {
        ...getLittleManState(state),
        props: List([
            {
                name: propName.BasicBullet,
                count: Infinity,
                type: propType.Bullet
            },
            {
                name: propName.LaserBullet,
                count: bulletCount,
                type: propType.Bullet
            },
            {
                name: propName.RocketBullet,
                count: bulletCount,
                type: propType.Bullet
            },
            {
                name: propName.BiggerBullet,
                count: bulletCount,
                type: propType.Bullet
            },
            {
                name: propName.SmallestBullet,
                count: bulletCount,
                type: propType.Bullet
            },
        ])
    })
}

export let subPropCount = (state: state, name: propName, count: number) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        props: getLittleManState(state).props.map(p => {
            if (p.name == name) {
                return {
                    ...p,
                    count: Math.max(p.count - count, 0)
                }
            }

            return p
        })
    })
}

export let getPropCount = (state: state, name: propName) => {
    return NullableUtils.getExn(getLittleManState(state).props.find(p => {
        return p.name == name
    })).count
}
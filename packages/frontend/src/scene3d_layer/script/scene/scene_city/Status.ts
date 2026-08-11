import { List, Map } from "immutable";
import { state } from "../../../type/StateType";
import { damageType, shootTarget, status, usedGirlEnum } from "./type/StateType";
import { getDeathResourceId, getGirlScale, getHeadShotSoundResourceId, getScene, getSceneChapter, getState, isGiantessCharacterType, setState } from "./CityScene";
import { Billboard } from "meta3d-jiehuo-abstract";
import { getAbstractState, readState, setAbstractState, writeState } from "../../../state/State";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Vector3, Box3 } from "three";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { DisposeUtils } from "meta3d-jiehuo-abstract";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { getBoxMaxXZSize, getBoxTopPoint } from "./utils/Box3Utils";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getIsDebug } from "../Scene";
import { name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { getLockTarget } from "./little_man/Lock";
import { getAimTarget } from "./little_man/Shoot";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { LOD } from "meta3d-jiehuo-abstract";
import { Flow } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract";
import { isPlayerGirl } from "./girl/Girl";
import { getFactorByScale } from "./girl/Utils";
import { getHeadShotExn, getIsShowingHeadShot, hideHeadShot, setIsShowingHeadShot, showHeadShot } from "./little_man/AimUtils";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getOriginSystemVolume, getVolume } from "./utils/SoundUtils";
import { createData as createDataPlayerStateStatus, dispose as dispsoePlayerStateStatus } from "./PlayerStateStatus";
import { createData as createDataBossStateStatus, dispose as dispsoeBossStateStatus } from "./BossStateStatus";
import { handlePositionRecur } from "meta3d-jiehuo-abstract/src/utils/ScreenUtils";
import { Camera } from "meta3d-jiehuo-abstract";
import { emitterVolume } from "./data/ValueType";
import { Render } from "meta3d-jiehuo-abstract";
import { setMaterialVisible, setMaterialVisibleByName } from "./utils/MMDUtils";
import { isHideUI } from "./UI";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

export let createState = (): status => {
    return {
        showStatusData: Map(),
        markStatusData: Map(),
        // dataPool: List()

        isNotDamage: Map(),

        playerStateStatus: createDataPlayerStateStatus(),
        bossStateStatus: createDataBossStateStatus(),
    }
}

let _getState = (state: state) => {
    return getState(state).status
}

let _setState = (state: state, statusState: status) => {
    return setState(state, {
        ...getState(state),
        status: statusState
    })
}

export let has = (state: state, key) => {
    return _getState(state).showStatusData.has(key)
}

export let hasMark = (state: state, key) => {
    return _getState(state).markStatusData.has(key)
}

export let add = (state: state, key, getBoxFunc, getHpRatioFunc, name) => {
    requireCheck(() => {
        test("shouldn't has", () => {
            return !has(state, key)
        })
    }, getIsDebug(state))

    // let abstractState = getAbstractState(state)
    let scene = getScene(state)

    let box = getBoxFunc(state)

    let xzSize = NumberUtils.clamp(getBoxMaxXZSize(box), 4, 12)

    // let nameLabel = Billboard.createLabal(
    //     name,
    //     new Vector3(),
    //     {
    //         // isSizeAttenuation: false,
    //         isSizeAttenuation: true,
    //         isAlwaysShow: true,
    //         width: 500 * xzSize,
    //         size: 500 * xzSize,
    //         scaleFactor: 0.05,
    //         backgroundColor: NullableUtils.getEmpty(),
    //         textColor: "white"
    //     }
    // )

    let progressValue = { value: 0 }
    let barHp = Billboard.createHpBar(
        progressValue,
        NullableUtils.getEmpty(),
        {
            isSizeAttenuation: false,
            // isSizeAttenuation: true,
            isAlwaysShow: true,
            // width: 0.2,
            // height: 0.01
            width: 0.01 * xzSize,
            height: 0.0005 * xzSize

            // width: 0.4 * xzSize,
            // height: 0.04 * xzSize
        }
    )


    scene.add(barHp)
    // scene.add(nameLabel)

    return _setState(state, {
        ..._getState(state),
        // showStatusData: _getState(state).showStatusData.set(key, [getBoxFunc, getHpRatioFunc, progressValue, [barHp, nameLabel]])
        showStatusData: _getState(state).showStatusData.set(key, [getBoxFunc, getHpRatioFunc, progressValue, barHp])
    })
}

export let addMark = (state: state, key, resourceId, getBoxFunc) => {
    requireCheck(() => {
        test("shouldn't has", () => {
            return !hasMark(state, key)
        })
    }, getIsDebug(state))

    let scene = getScene(state)

    // let box = getBoxFunc(state)

    // let xzSize = NumberUtils.clamp(getBoxMaxXZSize(box), 4, 12)

    let image = Billboard.createImage(
        getAbstractState(state),
        resourceId,
        NullableUtils.getEmpty(),
        NullableUtils.getEmpty(),
        {
            isSizeAttenuation: false,
            isAlwaysShow: true,
            // width: 0.01 * xzSize,
            // height: 0.0005 * xzSize
            width: 0.05,
            height: 0.05,
        }
    )

    scene.add(image)

    return _setState(state, {
        ..._getState(state),
        markStatusData: _getState(state).markStatusData.set(key, [getBoxFunc, image])
    })
}

export let getStatusKey = (state: state, staticLODContainerIndex, lodQueueData): nullable<name> => {
    if (!NullableUtils.isNullable(staticLODContainerIndex)) {
        return LOD.getName(getAbstractState(state), staticLODContainerIndex)
    }
    else if (!NullableUtils.isNullable(lodQueueData)) {
        let [box, name, index] = NullableUtils.getExn(lodQueueData)

        // return NullableUtils.return_(index)
        return NullableUtils.return_(name)
    }

    return NullableUtils.getEmpty()
}

export let getStatusKeyByName = (name: name) => name

export let remove = (state: state, key: name) => {
    let sprite = TupleUtils.getTuple4Last(_getState(state).showStatusData.get(key))
    DisposeUtils.removeAndDispose(
        getScene(state),
        sprite
    )

    return _setState(state, {
        ..._getState(state),
        showStatusData: _getState(state).showStatusData.remove(key)
    })
}

export let removeMark = (state: state, key: name) => {
    let sprite = TupleUtils.getTuple2Last(_getState(state).markStatusData.get(key))
    DisposeUtils.removeAndDispose(
        getScene(state),
        sprite
    )

    return _setState(state, {
        ..._getState(state),
        markStatusData: _getState(state).markStatusData.remove(key)
    })
}

// export let update = (state: state) => {
//     let abstractState = getAbstractState(state)
//     let scene = getScene(state)

//     let dataPool = _getState(state).showStatusData.reduce((dataPool, [getBoxFunc, getHpRatioFunc, nameLabel], i) => {
//         let [barBackgroundImage, barHpImage] = NullableUtils.getWithDefaultFunc(
//             dataPool.get(i),
//             () => {
//                 let barBackgroundImage = Billboard.createImage(abstractState,
//                     getBarHpBackgroundResourceId(),
//                     NullableUtils.getEmpty(),
//                     NullableUtils.getEmpty(),
//                     {
//                         isSizeAttenuation: false,
//                         isAlwaysShow: true,
//                         width: 0.2,
//                         height: 0.05
//                     }
//                 )
//                 let barHpImage = Billboard.createImage(abstractState,
//                     getBarHpResourceId(),
//                     NullableUtils.getEmpty(),
//                     NullableUtils.getEmpty(),
//                     {
//                         isSizeAttenuation: false,
//                         isAlwaysShow: true,
//                         width: 0.2,
//                         height: 0.05
//                     }
//                 )

//                 scene.add(barBackgroundImage)
//                 scene.add(barHpImage)

//                 return [barBackgroundImage, barHpImage]
//             }
//         )


//         barBackgroundImage.visible = true
//         barHpImage.visible = true

//         let position = getBoxFunc(state)

//         barBackgroundImage.position.copy(position)
//         barHpImage.position.copy(position)

//         barHpImage.scale.setX(barBackgroundImage.scale.x * getHpRatioFunc(state))

//         nameLabel.position.copy(_v1.copy(position).setY(position.y + 3))

//         return dataPool.set(i, [barBackgroundImage, barHpImage])
//     }, _getState(state).dataPool)

// _getState(state).showStatusData.count()


//     return _setState(state, {
//         ..._getState(state),
//         dataPool
//     })
// }

let _getFactorByScale = (state: state): [number, number] => {
    if (!isGiantessCharacterType(state)) {
        return [1, 1]
    }

    return getFactorByScale(state, usedGirlEnum.PlayerGirl, [
        {
            scale: 19,
            factor: [1, 1]
        },
        {
            scale: 39,
            factor: [4, 2]
        },
        {
            factor: [8, 4]
        },
    ])
}

let _addHeadShotUI = (state: state, box) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getHeadShotSoundResourceId(), getIsDebug(state), getVolume(state, emitterVolume.VeryBig, box.getCenter(_v1), 0))
    ))

    if (getIsShowingHeadShot(state)) {
        return state
    }

    let headShot = getHeadShotExn(state)
    let scale = headShot.scale.clone()

    let object = {
        size: 1
    }
    let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
        .to({
            size: 0.5
        }, 500)
        .onUpdate(() => {
            headShot.scale.copy(_v1.copy(scale).multiplyScalar(object.size))
        })
        .onComplete(() => {
            headShot.scale.copy(scale)

            let state = readState()
            state = setIsShowingHeadShot(state, false)
            state = hideHeadShot(state)


            ArticluatedAnimation.removeTween(getAbstractState(state), tween)

            writeState(state)
        })

    tween.start()

    ArticluatedAnimation.addTween(getAbstractState(state), tween)

    state = setIsShowingHeadShot(state, true)
    state = showHeadShot(state)

    return state
}

export let addDeathUI = (state: state, box: Box3, damageType_: damageType) => {
    if (damageType_ == damageType.Weakness) {
        return _addHeadShotUI(state, box)
    }

    if (isHideUI(state)) {
        return state
    }

    let [boxTopFactor, heightFactor] = _getFactorByScale(state)

    let position = getBoxTopPoint(box, 0.4 * boxTopFactor, new Vector3())

    let image = Billboard.createImage(
        getAbstractState(state),
        getDeathResourceId(),
        NullableUtils.return_(position),
        NullableUtils.getEmpty(),
        {
            isSizeAttenuation: false,
            isAlwaysShow: true,
            width: 0.05,
            height: 0.05,
        }
    )

    let scene = getScene(state)
    scene.add(image)


    let object = {
        y: 0
    }
    let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
        .to({
            y: 4 * heightFactor
        }, 1500)
        .onUpdate(() => {
            image.position.setY(position.y + object.y)
        })
        .onComplete(() => {
            ArticluatedAnimation.removeTween(getAbstractState(readState()), tween)

            DisposeUtils.removeAndDispose(scene, image)
        })

    tween.start()
    ArticluatedAnimation.addTween(getAbstractState(state), tween)

    return state
}

export let update = (state: state) => {
    // let abstractState = getAbstractState(state)
    // let scene = getScene(state)

    // _getState(state).showStatusData.forEach(([getBoxFunc, getHpRatioFunc, progressValue, [barHp, nameLabel]]) => {

    _getState(state).showStatusData.forEach(([getBoxFunc, getHpRatioFunc, progressValue, barHp]) => {
        // let barBackgroundImage = Billboard.createImage(abstractState,
        //     getBarHpBackgroundResourceId(),
        //     NullableUtils.getEmpty(),
        //     NullableUtils.getEmpty(),
        //     {
        //         isSizeAttenuation: false,
        //         isAlwaysShow: true,
        //         width: 0.2,
        //         height: 0.05
        //     }
        // )
        // let barHpImage = Billboard.createImage(abstractState,
        //     getBarHpResourceId(),
        //     NullableUtils.getEmpty(),
        //     NullableUtils.getEmpty(),
        //     {
        //         isSizeAttenuation: false,
        //         isAlwaysShow: true,
        //         width: 0.2,
        //         height: 0.05
        //     }
        // )

        // scene.add(barBackgroundImage)
        // scene.add(barHpImage)

        let box = getBoxFunc(state)

        let camera = Camera.getCurrentCamera(getAbstractState(state))

        barHp.position.copy(
            handlePositionRecur(
                getBoxTopPoint(box, 0.2, _v1),
                camera,
                camera.position.y
            )
        )

        // barHpImage.position.copy(position)
        // barHpImage.position.setX(barHpImage.position.x + 10)

        // barHpImage.scale.setX(barBackgroundImage.scale.x * getHpRatioFunc(state))
        progressValue.value = getHpRatioFunc(state)


        if (isHideUI(state)) {
            setMaterialVisible(barHp.material, false)
        }
        else {
            setMaterialVisible(barHp.material, true)
        }

        // nameLabel.position.copy(getBoxTopPoint(box, 0.4, _v2))
    })

    _getState(state).markStatusData.forEach(([getBoxFunc, mark], name) => {
        let box = getBoxFunc(state)

        let camera = Camera.getCurrentCamera(getAbstractState(state))

        mark.position.copy(
            handlePositionRecur(
                // getBoxTopPoint(box, 0.2, _v1),
                getBoxTopPoint(box, 1.2, _v1),
                camera,
                camera.position.y
            )
        )

        if (isHideUI(state)) {
            setMaterialVisible(mark.material, false)
        }
        else {
            setMaterialVisible(mark.material, true)
        }
    })

    return state
}

export let getIsNotDamage = (state: state, name) => {
    return NullableUtils.getWithDefault(
        _getState(state).isNotDamage.get(name),
        false
    )
}

export let setIsNotDamage = (state: state, name, value) => {
    return _setState(state, {
        ..._getState(state),
        isNotDamage: _getState(state).isNotDamage.set(name, value)
    })
}



export let buildDeferRemoveStatusByDamageName = (name) => `buildDeferRemoveStatusByDamageName_${name}`

export let disposeData = (state: state, key) => {
    if (has(state, key)) {
        state = remove(state, key)
    }

    if (hasMark(state, key)) {
        state = removeMark(state, key)
    }

    state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), buildDeferRemoveStatusByDamageName(key)))

    return state
}

export let dispose = (state: state) => {
    return _setState(state, {
        ...createState(),
        playerStateStatus: dispsoePlayerStateStatus(),
        bossStateStatus: dispsoeBossStateStatus(),
    })
}


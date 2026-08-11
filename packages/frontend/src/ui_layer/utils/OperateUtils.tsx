import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getIsStartDrag, getSavedOperatePosition, saveOperatePosition, setSavedOperatePosition } from "../../scene3d_layer/script/scene/scene_city/Operate"
import { Scene } from "meta3d-jiehuo-abstract"
import { getAbstractState, readState, writeState } from "../../business_layer/State"
import { convertPxToRem, getRemValue } from "./DomUtils"
import { getPageX, getPageY } from "meta3d-utils/src/LandscapeUtils"
import { getFastRunBlockService, getSwipBlockService } from "../../scene3d_layer/mod/SkillLittleManMod"
import * as LittleManAction from "../../scene3d_layer/script/scene/scene_city/little_man/Action"
import * as LittleManDataType from "../../scene3d_layer/script/scene/scene_city/little_man_data/DataType";
import { littleManActionState } from "../../scene3d_layer/script/scene/scene_city/type/StateType"
// import { setLittleManActionState, triggerLittleManAction } from "../../business_layer/CityScene3D"
import { handleEndShoot } from "../../scene3d_layer/script/scene/scene_city/little_man/Shoot"
import { setLittleManActionState, triggerLittleManAction } from "../../scene3d_layer/script/scene/scene_city/CityScene"
import { state } from "../../scene3d_layer/type/StateType"
import { getModAPI } from "../../scene3d_layer/script/scene/scene_city/Mod"


// export let getStyleData = (state, name) => {
//     // return NullableUtils.map(({ left, top }) => {
//     //     return {
//     //         "left": `${left}`,
//     //         "top": `${top}`,
//     //     }
//     // }, getSavedOperatePosition(state, Scene.getCharacterType(getAbstractState(state)), name))
//     getSavedOperatePosition(state, Scene.getCharacterType(getAbstractState(state)), name)
// }

let _computeBottom = (rowIndex, startBottom) => {
    // return startBottom + (rowIndex - 1) * 5
    return startBottom + (rowIndex - 1) * 2.5 * 1.5
}

export let buildSectionStyle = (state, value, index, startBottom) => {
    // let s = NullableUtils.getWithDefault<any>(
    //     NullableUtils.map(({ left, top }) => {
    //         return {
    //             "left": `${left}`,
    //             "top": `${top}`,
    //         }
    //     }, getStyleData(state, value.name)),
    //     {
    //         "bottom": `${bottom}`,
    //         "right": `${1 + index * 5}rem`,
    //     }
    // )

    // let s = NullableUtils.getWithDefault<any>(
    //     NullableUtils.map(({ left, top }) => {
    //         // return {
    //         //     "left": `${left}`,
    //         //     "top": `${top}`,
    //         // }

    //         return {
    //             "bottom": `${bottom - convertPxToRem(top)}rem`,
    //             "right": `${1 + index * 5 - convertPxToRem(left)}rem`,
    //         }
    //     }, getStyleData(state, value.name)),
    //     {
    //         "bottom": `${bottom}rem`,
    //         "right": `${1 + index * 5}rem`,
    //     }
    // )


    let s = NullableUtils.getWithDefault<any>(
        NullableUtils.map(({ right, bottom }) => {
            return {
                "bottom": `${bottom}rem`,
                "right": `${right}rem`,
            }
        }, getSavedOperatePosition(state, Scene.getCharacterType(getAbstractState(state)), value.name)),
        {
            "bottom": `${_computeBottom(value.rowIndex, startBottom)}rem`,
            // "right": `${1 + index * 5}rem`,
            "right": `${1 + index * 2.5 * 1.5}rem`,
        }
    )


    return {
        ...s,
        // "bottom": `${bottom}rem`,
        // "right": `${1 + index * 5}rem`,

        /*! fix "right finger point down operate ui->right finger move->left finger move camera not work" bug
        */
        "touch-action": "none",
        "ms-touch-action": "none",
    }
}

export let onTouchStart = (event, [
    getSectionDomFunc,
    setStartXFunc,
    setStartYFunc,
    setRightFunc,
    setBottomFunc,
    // setXFunc,
    // setYFunc
    // setLeftFunc,
    // setTopFunc
]) => {
    if (!getIsStartDrag(readState())) {
        return
    }

    let startX = getPageX(event.targetTouches[0])
    let startY = getPageY(event.targetTouches[0])

    //同时获取盒子的位置
    // let x = getSectionDomFunc(event).offsetLeft; //得到盒子的边距
    // let y = getSectionDomFunc(event).offsetTop;

    setStartXFunc(_ => startX)
    setStartYFunc(_ => startY)
    // setXFunc(_ => x)
    // setYFunc(_ => y)
    setRightFunc(_ => getRemValue(getSectionDomFunc(event).style.right))
    setBottomFunc(_ => getRemValue(getSectionDomFunc(event).style.bottom))
}

export let onTouchMove = (event, [getSectionDomFunc,
    // setLeftFunc,
    // setTopFunc
],
    startX, startY,
    //  x, y
    // bottom, index
    right, bottom,
) => {
    if (!getIsStartDrag(readState())) {
        return
    }

    //  计算手指的移动距离： 手指移动之后的坐标减去手指初始的坐标
    let moveX = getPageX(event.targetTouches[0]) - startX;
    let moveY = getPageY(event.targetTouches[0]) - startY;
    // 移动我们的盒子 盒子原来的位置 + 手指移动的距离
    // _getDom(event).style.left = x + moveX + 'px';
    // _getDom(event).style.top = y + moveY + 'px';

    // setLeftFunc(_ => moveX + 'px')
    // setTopFunc(_ => moveY + 'px')
    // getSectionDomFunc(event).style.bottom = ""
    // getSectionDomFunc(event).style.right = ""
    // getSectionDomFunc(event).style.left = x + moveX + 'px';
    // getSectionDomFunc(event).style.top = y + moveY + 'px';
    // getSectionDomFunc(event).style.left = moveX + 'px';
    // getSectionDomFunc(event).style.top = moveY + 'px';


    // "bottom": `${bottom - convertPxToRem(top)}rem`,
    // "right": `${1 + index * 5 - convertPxToRem(left)}rem`,

    getSectionDomFunc(event).style.right = `${right - convertPxToRem(moveX + 'px')}rem`
    getSectionDomFunc(event).style.bottom = `${bottom - convertPxToRem(moveY + 'px')}rem`

    // event.preventDefault(); // 阻止屏幕滚动的默认行为
}

export let onTouchEnd = (
    event, getSectionDomFunc,
    // left, top,
    // right, bottom,
    value
) => {
    let state = readState()

    if (!getIsStartDrag(state)) {
        return
    }


    state = setSavedOperatePosition(state, Scene.getCharacterType(getAbstractState(state)), value.name, {
        // left: getSectionDomFunc(event).style.left,
        // top: getSectionDomFunc(event).style.top,
        // left,
        // top
        right: getRemValue(getSectionDomFunc(event).style.right),
        bottom: getRemValue(getSectionDomFunc(event).style.bottom),
    })

    writeState(state)

    return saveOperatePosition(state)
}


export let triggerDownActionForBurstFire = (state, name) => {
    switch (name) {
        case getFastRunBlockService(state).getActionName():
            if (LittleManAction.isActionState(state, littleManActionState.Run)) {
                state = LittleManAction.setActionState(state, littleManActionState.Initial)
                // state = LittleManAction.resetIsTriggerAction(state, usedGirl)

                return Promise.resolve(state)
            }

            return triggerLittleManAction(state, name)
        default:
            return triggerLittleManAction(state, name)
    }
}

export let triggerDownActionForContinueFire = (state, name) => {
    switch (name) {
        case getFastRunBlockService(state).getActionName():
            if (LittleManAction.isActionState(state, littleManActionState.Run)) {
                state = LittleManAction.setActionState(state, littleManActionState.Initial)
                // state = LittleManAction.resetIsTriggerAction(state, usedGirl)

                return Promise.resolve(state)
            }

            return triggerLittleManAction(state, name)
        case LittleManDataType.actionName.Shoot:
            if (LittleManAction.isActionState(state, littleManActionState.Shoot)) {
                state = handleEndShoot(state)
                state = setLittleManActionState(state, littleManActionState.Initial)

                return Promise.resolve(state)
            }
            return triggerLittleManAction(state, name)
        case getSwipBlockService(state).getActionName():
            if (LittleManAction.isActionState(state, littleManActionState.Swiping)) {
                state = setLittleManActionState(state, littleManActionState.Initial)

                return Promise.resolve(state)
            }
            return triggerLittleManAction(state, name)
        case LittleManDataType.actionName.Lock:
        case LittleManDataType.actionName.Blink:
            if (!LittleManAction.isActionState(state, littleManActionState.Run)) {
                state = NullableUtils.getWithDefault(
                    NullableUtils.map(triggeredAction => {
                        return LittleManAction.setTriggerActionBeforeLock(state, triggeredAction)
                    }, LittleManAction.getTriggerAction(state)),
                    state
                )
            }
            return triggerLittleManAction(state, name)
        default:
            return triggerLittleManAction(state, name)
    }

}

export let triggerUpActionForBurstFire = (state, name) => {
    switch (name) {
        case LittleManDataType.actionName.Lock:
            state = LittleManAction.resetIsTriggerAction(state)
            state = setLittleManActionState(state, littleManActionState.Initial)
            break
        case LittleManDataType.actionName.Shoot:
            if (LittleManAction.isTriggerAction(state, LittleManDataType.actionName.Shoot)) {
                state = handleEndShoot(state)
            }
            state = setLittleManActionState(state, littleManActionState.Initial)
            break
        case getSwipBlockService(state).getActionName():
            state = setLittleManActionState(state, littleManActionState.Initial)
            break
    }


    return Promise.resolve(state)
}

export let triggerUpActionForContinueFire = (state, name) => {
    switch (name) {
        case LittleManDataType.actionName.Lock:
        case LittleManDataType.actionName.Blink:
            state = LittleManAction.resetIsTriggerAction(state)

            state = NullableUtils.getWithDefault(
                NullableUtils.map(triggerActionBeforeLock => {
                    state = LittleManAction.setTriggerAction(state, triggerActionBeforeLock)
                    return LittleManAction.resetriggerActionBeforeLock(state)
                }, LittleManAction.getTriggerActionBeforeLock(state)),
                state
            )
            break
    }

    return Promise.resolve(state)
}

export let filterOperateData = (state: state, usedGirl, operateRenderData, names, currentStudyActions) => {
    let api = getModAPI(state)

    return operateRenderData.filter(d => {
        return names.includes(d.name)
            && NullableUtils.getWithDefault(
                NullableUtils.map(conditionFunc => {
                    return conditionFunc(api, state, usedGirl)
                }, d.conditionFunc),
                true
            )
    }).map(d => {
        return [
            d,
            NullableUtils.getExn(currentStudyActions.find(a => {
                return a.name == d.name
            })).time
        ]
    })

}
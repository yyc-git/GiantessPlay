import { createSlice } from '@reduxjs/toolkit'
import { mode, store } from './SceneStoreType'
import { MutableRecordUtils } from 'meta3d-jiehuo-abstract'
import { characterType } from 'meta3d-jiehuo-abstract/src/type/StateType'
import { List, Map } from 'immutable'

let _createInitialState = () => {
    return {
        mode: mode.Default,
        isEnterScenario: false,
        // isBlackScreenStart: false,
        dialogue: null,
        getProp: null,
        gameEventTip: null,
        bossStatus: [],
        giantessStatus: null,
        playerSkillStatus: null,
        bossSkillStatus: null,
        levelStatus: null,
        characterStatus: null,

        littleManStatus: null,

        // qte: null,

        qteRandomValue: -1,

        operateRandomValue: -1,
        manualUIUpdateRandomValue: -1,

        levelBarRandomValue: -1,

        upgradeData: [],
        tradeData: [],

        missionComplete: null,

        uiData: [],
        sceneUIData: [],

        // fastPropData: MutableRecordUtils.create(),
        // fastPropData: {
        //     littleMan: Map<number, any>(),
        //     giantess: Map<number, any>(),
        // }
    }
}

let SceneSlice = createSlice<store, any, any, any, any>({
    name: 'Scene',
    initialState: _createInitialState(),
    reducers: {
        setMode: (state: store, data) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes.
            // Also, no return statement is required from these functions.

            let mode = data.payload

            state.mode = mode
        },
        setIsEnterScenario: (state: store, data) => {
            state.isEnterScenario = data.payload
        },
        // setIsBlackScreenStart: (state: store, data) => {
        //     state.isBlackScreenStart = data.payload
        // },
        setDialogue: (state: store, data) => {
            state.dialogue = data.payload
        },
        setGetProp: (state: store, data) => {
            state.getProp = data.payload
        },
        setGameEventTip: (state: store, data) => {
            state.gameEventTip = data.payload
        },
        setBossStatus: (state: store, data) => {
            state.bossStatus = data.payload
        },
        setGiantessStatus: (state: store, data) => {
            state.giantessStatus = data.payload
        },
        setPlayerSkillStatus: (state: store, data) => {
            state.playerSkillStatus = data.payload
        },
        setBossSkillStatus: (state: store, data) => {
            state.bossSkillStatus = data.payload
        },
        setLevelStatus: (state: store, data) => {
            state.levelStatus = data.payload
        },
        setCharacterStatus: (state: store, data) => {
            state.characterStatus = data.payload
        },


        setLittleManStatus: (state: store, data) => {
            state.littleManStatus = data.payload
        },

        setQTERandomValue: (state: store, data) => {
            state.qteRandomValue = data.payload
        },
        setOperateRandomValue: (state: store, data) => {
            state.operateRandomValue = data.payload
        },
        setManualUIUpdateRandomValue: (state: store, data) => {
            state.manualUIUpdateRandomValue = data.payload
        },
        setLevelBarRandomValue: (state: store, data) => {
            state.levelBarRandomValue = data.payload
        },
        setUpgradeData: (state: store, data) => {
            state.upgradeData = data.payload
        },
        setTradeData: (state: store, data) => {
            state.tradeData = data.payload
        },
        setMissionComplete: (state: store, data) => {
            state.missionComplete = data.payload
        },
        setUIData: (state: store, data) => {
            state.uiData = data.payload
        },
        setSceneUIData: (state: store, data) => {
            state.sceneUIData = data.payload
        },
        // setFastPropData: (state: store, data) => {
        //     // let { characterType_, index, value } = data.payload

        //     // let d
        //     // switch (characterType_) {
        //     //     case characterType.LittleMan:
        //     //         d = state.fastPropData.littleMan
        //     //         break
        //     //     case characterType.Giantess:
        //     //         d = state.fastPropData.giantess
        //     //         break
        //     //     default:
        //     //         throw new Error("err")
        //     // }


        //     // d = d.filter((oldValue) => {
        //     //     return oldValue.propName != value.propName
        //     // })

        //     // d = d.set(
        //     //     // d,
        //     //     index, value
        //     // )


        //     // switch (characterType_) {
        //     //     case characterType.LittleMan:
        //     //         state.fastPropData = {
        //     //             ...state.fastPropData,
        //     //             littleMan: d
        //     //         }
        //     //         break
        //     //     case characterType.Giantess:
        //     //         state.fastPropData = {
        //     //             ...state.fastPropData,
        //     //             giantess: d
        //     //         }
        //     //         break
        //     //     default:
        //     //         throw new Error("err")
        //     // }

        //     state.fastPropData = data.payload
        // },
        disposeStore: (state: store, data) => {
            let d = _createInitialState()

            for (let key in d) {
                state[key] = d[key]
            }
        },
    },
    selectors: {
    }
})

// Action creators are generated for each case reducer function
export let { setMode, setIsEnterScenario,
    setDialogue,
    setGetProp,
    setGameEventTip,
    setBossStatus,
    setGiantessStatus,
    setPlayerSkillStatus,
    setBossSkillStatus,
    setLevelStatus,
    setCharacterStatus,

    setLittleManStatus,
    setQTERandomValue,
    setOperateRandomValue,
    setManualUIUpdateRandomValue,
    setLevelBarRandomValue,
    setUpgradeData,
    setTradeData,
    setMissionComplete,
    setUIData,
    setSceneUIData,
    // setFastPropData,
    disposeStore
}: any = SceneSlice.actions

export default SceneSlice.reducer
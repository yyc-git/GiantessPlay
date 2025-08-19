import { createSlice } from '@reduxjs/toolkit'
import { mode, store } from './SceneStoreType'

let _createInitialState = () => {
    return {
        mode: mode.Default,
        isEnterScenario: false,
        // isBlackScreenStart: false,
        dialogue: null,
        giantessStatus: null,
        skillStatus: null,
        levelStatus: null,

        littleManStatus: null,

        // qte: null,

        qteRandomValue: -1,
        operateRandomValue: -1,
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
        setGiantessStatus: (state: store, data) => {
            state.giantessStatus = data.payload
        },
        setSkillStatus: (state: store, data) => {
            state.skillStatus = data.payload
        },
        setLevelStatus: (state: store, data) => {
            state.levelStatus = data.payload
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
export let { setMode, setIsEnterScenario, setDialogue, setGiantessStatus, setSkillStatus, setLevelStatus,
    setLittleManStatus,
    setQTERandomValue,
    setOperateRandomValue,
    disposeStore
}: any = SceneSlice.actions

export default SceneSlice.reducer
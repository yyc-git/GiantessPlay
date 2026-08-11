import { createSlice } from '@reduxjs/toolkit'
import { page, store } from './GlobalStoreType'
import { characterType } from 'meta3d-jiehuo-abstract/src/type/StateType'

let GlobalSlice = createSlice<store, any, any, any, any>({
  name: 'Global',
  initialState: {
    currentSceneData: null,
    targetSceneData: null,
    page: page.IndexMain,
    // pageData: null,
    characterType: characterType.LittleMan,
    character: null,
  },
  reducers: {
    setCurrentScene: (state: store, data) => {
      state.currentSceneData = data.payload
    },
    setTargetScene: (state: store, data) => {
      state.targetSceneData = data.payload
    },
    setPage: (state: store, data) => {
      let page = data.payload

      state.page = page
    },
    // setPageData: (state: store, data) => {
    //   let pageData = data.payload

    //   state.pageData = pageData
    // },
    setCharacterType: (state: store, data) => {
      let value = data.payload

      state.characterType = value
    },
    setCharacter: (state: store, data) => {
      let value = data.payload

      state.character = value
    },
  },
  selectors: {

  }
})

// Action creators are generated for each case reducer function
export let { setCurrentScene, setTargetScene, setPage,
  setCharacterType,
  setCharacter }: any = GlobalSlice.actions

export default GlobalSlice.reducer

// export type GlobalState = ReturnType<typeof GlobalSlice.getInitialState>
// export type GlobalDispatch = typeof GlobalSlice.
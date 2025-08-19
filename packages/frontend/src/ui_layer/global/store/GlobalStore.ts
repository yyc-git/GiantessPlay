import { createSlice } from '@reduxjs/toolkit'
import { page, store } from './GlobalStoreType'

let GlobalSlice = createSlice<store, any, any, any, any>({
  name: 'Global',
  initialState: {
    currentSceneData: null,
    targetSceneData: null,
    page: page.IndexMain,
    pageData: null,
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
    setPageData: (state: store, data) => {
      let pageData = data.payload

      state.pageData = pageData
    },
  },
  selectors: {

  }
})

// Action creators are generated for each case reducer function
export let { setCurrentScene, setTargetScene, setPage, setPageData }: any = GlobalSlice.actions

export default GlobalSlice.reducer

// export type GlobalState = ReturnType<typeof GlobalSlice.getInitialState>
// export type GlobalDispatch = typeof GlobalSlice.
import { createSlice } from '@reduxjs/toolkit'
import { store } from './CityStoreType'

let CitySlice = createSlice<store, any, any, any, any>({
  // let CitySlice = createSlice({
  name: 'City',
  initialState: {
    currentSceneIndex: 1
  },
  reducers: {
    setCurrentSceneIndex: (state: store, data) => {
      let currentSceneIndex = data.payload

      state.currentSceneIndex = currentSceneIndex
    },
  },
  selectors: {

  }
})

// Action creators are generated for each case reducer function
export let { setCurrentSceneIndex }: any = CitySlice.actions

export default CitySlice.reducer

// export type CityState = ReturnType<typeof CitySlice.getInitialState>
// export type CityDispatch = typeof CitySlice.
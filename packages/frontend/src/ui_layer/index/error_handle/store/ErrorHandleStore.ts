import { createSlice } from '@reduxjs/toolkit'
import { store } from './ErrorHandleStoreType'

let ErrorHandleSlice = createSlice<store, any, any, any, any>({
  name: 'ErrorHandle',
  initialState: {
    error: null
  },
  reducers: {
    setError: (state: store, data) => {
      state.error = data.payload
    },
  },
  selectors: {

  }
})

// Action creators are generated for each case reducer function
export let { setError }: any = ErrorHandleSlice.actions

export default ErrorHandleSlice.reducer
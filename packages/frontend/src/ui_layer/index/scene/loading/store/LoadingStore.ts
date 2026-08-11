import { createSlice } from '@reduxjs/toolkit'
import { store } from './LoadingStoreType'

let LoadingSlice = createSlice<store, any, any, any, any>({
    name: 'Loading',
    initialState: {
        isLoading: false,
        percent: 0,
        tip:"",
    },
    reducers: {
        setIsLoading: (state: store, data) => {
            let isLoading = data.payload

            state.isLoading = isLoading
        },
        setPercent: (state: store, data) => {
            let percent = data.payload

            state.percent = percent
        },
        setTip: (state: store, data) => {
            let tip = data.payload

            state.tip = tip
        },
    },
    selectors: {
    }
})

// Action creators are generated for each case reducer function
export let { setIsLoading, setPercent, setTip }: any = LoadingSlice.actions

export default LoadingSlice.reducer
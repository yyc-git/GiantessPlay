import { configureStore } from '@reduxjs/toolkit'
import GlobalReducer from '../global/store/GlobalStore'
import SceneReducer from '../index/scene/store/SceneStore'
import LoadingReducer from '../index/scene/loading/store/LoadingStore'
import InfoReducer from '../index/scene/info/store/InfoStore'
import ErrorHandleReducer from '../index/error_handle/store/ErrorHandleStore'

// TODO refactor: extract index store

const store = configureStore({
  reducer: {
    global: GlobalReducer,
    scene: SceneReducer,
    loading: LoadingReducer,
    info: InfoReducer,
    errorHandle: ErrorHandleReducer,
  },
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import {configureStore} from '@reduxjs/toolkit'
import authSliceReducer from './Slices/Authslices.js'
export const store = configureStore({
    reducer: {
        auth: authSliceReducer
    }
})
export default store
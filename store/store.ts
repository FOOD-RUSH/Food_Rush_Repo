import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'

const store = configureStore({
    reducer: {
        auth: authSlice

    },
    // middleware: (getDefaultMiddleware) => {
    //     return getDefaultMiddleware({
    //         serializableCheck: {
    //             ignoreActions: ['persist/PERSIST']
    //         }
    //     });
    // }
})

export default store;
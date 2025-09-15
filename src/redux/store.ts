import UserSlice from './user/user.slice'
import CommonSlice from './common/common.slice'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

const allReducers = combineReducers({
    Common: CommonSlice,
    User: UserSlice
})

//@ts-ignore
const rootReducer = (state, action) => {
    if (action.type === 'Reset/resetState') {
        return allReducers(undefined, action)
    }

    return allReducers(state, action)
}

const store = configureStore({
    reducer: rootReducer,
    //@ts-ignore
    devTools: import.meta.env.VITE_MODE === 'development',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat()
})

export { store }

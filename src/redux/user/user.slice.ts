import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'User',
    initialState: {
        user: {}
    },
    reducers: {
        // User
        userRequest: (state) => {
            return {
                ...state
            }
        },
        userSuccess: (state, action) => {
            return {
                ...state,
                user: action.payload.user
            }
        },
        userFailure: (state) => {
            return {
                ...state,
                user: {}
            }
        }
    }
})

// Actions
export const { userRequest, userSuccess, userFailure } = userSlice.actions

// Reducer
export default userSlice.reducer

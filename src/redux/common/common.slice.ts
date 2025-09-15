import { createSlice } from '@reduxjs/toolkit'

export const commonSlice = createSlice({
    name: 'Common',
    initialState: {
        loading: false,
        error: null,
        message: null,
        isRefreshTokenError: false,
        isDataRefreshed: false,
        currentPath: 'profile',
        accessToken: null
    },
    reducers: {
        // Login

        responseRequest: (state) => {
            return {
                ...state,
                loading: true
            }
        },
        refreshTokenSuccess: (state) => {
            return {
                ...state,
                loading: false,
                isRefreshTokenError: false
            }
        },
        refreshTokenFail: (state) => {
            return {
                ...state,
                loading: false,
                isRefreshTokenError: true
            }
        },
        responseSuccess: (state, action) => {
            return {
                ...state,
                loading: false,
                message: action.payload.message
            }
        },
        responseFail: (state, action) => {
            return {
                ...state,
                loading: false,
                error: action.payload.message
            }
        },
        startLoading: (state) => {
            return {
                ...state,
                loading: true
            }
        },
        createError: (state, action) => {
            return {
                ...state,
                error: action.payload.message
            }
        },
        createMessage: (state, action) => {
            return {
                ...state,
                message: action.payload.message
            }
        },
        clearLoading: (state) => {
            return {
                ...state,
                loading: false
            }
        },
        clearError: (state) => {
            return {
                ...state,
                error: null
            }
        },
        clearMessage: (state) => {
            return {
                ...state,
                message: null
            }
        },
        setCurrentPath: (state, action) => {
            return {
                ...state,
                currentPath: action.payload.path
            }
        },
        setIsDataRefreshed: (state, action) => {
            return {
                ...state,
                isDataRefreshed: action.payload
            }
        },
        setAccessToken: (state, action) => {
            return {
                ...state,
                accessToken: action.payload
            }
        }
    }
})

// Actions
export const {
    clearError,
    clearLoading,
    clearMessage,
    createError,
    createMessage,
    setCurrentPath,
    responseFail,
    responseRequest,
    responseSuccess,
    startLoading,
    refreshTokenSuccess,
    refreshTokenFail,
    setIsDataRefreshed,
    setAccessToken
} = commonSlice.actions

// Reducer
export default commonSlice.reducer

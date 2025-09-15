import { createSlice } from '@reduxjs/toolkit'

export const resetSlice = createSlice({
    name: 'Reset',
    initialState: null,
    reducers: {
        resetState: () => null
    }
})

// Actions
export const { resetState } = resetSlice.actions

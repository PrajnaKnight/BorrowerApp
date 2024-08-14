import { createSlice } from '@reduxjs/toolkit'

const initialState = { currentStack: [], screens : [] }

const navigationSlice = createSlice({
  name: 'currentNavigationStack',
  initialState,
  reducers: {
    updateStack(state, payload) {
      
      state.currentStack = payload.payload
    },
    
  },
})

export const { updateStack } = navigationSlice.actions
export default navigationSlice.reducer
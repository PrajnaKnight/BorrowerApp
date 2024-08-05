import { createSlice } from '@reduxjs/toolkit'

const initialState = { isBreDone : false}

const ExtraStageSlice = createSlice({
  name: 'ExtraStageSlice',
  initialState,
  reducers: {

    updateBreStatus(state, payload) {
      state.isBreDone = payload.payload
    },
    
  },
})

export const {updateBreStatus} = ExtraStageSlice.actions
export default ExtraStageSlice.reducer
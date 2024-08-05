import { createSlice } from '@reduxjs/toolkit'
import { ALL_SCREEN } from '../Constants'

const initialState = { jumpTo : 0}

const LeadStageSlice = createSlice({
  name: 'LeadStage',
  initialState,
  reducers: {

    updateJumpTo(state, payload) {
      state.jumpTo = payload.payload
    },
    
  },
})

export const {updateJumpTo} = LeadStageSlice.actions
export default LeadStageSlice.reducer
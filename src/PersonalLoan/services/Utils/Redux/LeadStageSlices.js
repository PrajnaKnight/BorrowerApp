import { createSlice } from '@reduxjs/toolkit'

const initialState = { jumpTo : 0, screenName : null, thingsToRemove : []}

const LeadStageSlice = createSlice({
  name: 'LeadStage',
  initialState,
  reducers: {

    updateJumpTo(state, payload) {
      state.jumpTo = payload.payload.jumpTo
      state.screenName = payload.payload.screenName
    },

    updateThingsToRemove(state, payload){
      const {name , option} = payload.payload
      if(option == OPTION.ADD){
        state.thingsToRemove.push(name)
      }
      else{
        state.thingsToRemove = state.thingsToRemove.filter(item => item !== name);
      }
    }
    
  },
})

export const OPTION = Object.freeze({
  ADD: 'ADD',
  REMOVE: 'REMOVE',
});


export const {updateJumpTo, updateThingsToRemove} = LeadStageSlice.actions
export default LeadStageSlice.reducer
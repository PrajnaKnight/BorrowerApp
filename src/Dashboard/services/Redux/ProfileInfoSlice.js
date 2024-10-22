import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetProfileInfo from '../API/ProfileInfo'
import { API_STATE, STATUS } from '../../../Common/Utils/Constant'


export const fetchProfileInfo = createAsyncThunk(
    'ProfileInfoSlice/GetProfileInfo',
    async () => {
        return GetProfileInfo()
    }
)

const ProfileInfoSlice = createSlice({
    name: 'ProfileInfoSlice',
    initialState: {
        data : null,
        state : API_STATE.IDLE,
        message : null
    },
    reducers: {
        
    },
    extraReducers: (builder) => {

        
        builder.addCase(fetchProfileInfo.fulfilled, (state, action) => {
            const response = action.payload
            state.state = API_STATE.STOP
            state.message = null

            if(response.status == STATUS.ERROR){
                state.message = response.message
                return
            }
            

            if(response.data == null){
                return
            }

            
            state.data = response.data.Value

            console.log("=============profile info================")
            console.log(state.data)

        })
        builder.addCase(fetchProfileInfo.pending, (state, action) => {

            state.state = API_STATE.LOADING
            state.message = null


        })
        builder.addCase(fetchProfileInfo.rejected, (state, action) => {
            state.message = action.error.message
            state.state = API_STATE.STOP
        })
    }
})





export default ProfileInfoSlice.reducer
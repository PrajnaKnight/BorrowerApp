import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetButtonConfig from '../API/ButtonConfig'
import { STATUS } from '../../../Common/Utils/Constant'

const initialState = { 

    LoanSection : {
        loading : false,
        data : null,
        message : null,
    },

    ButtonConfig : {
        loading : false,
        data : null,
        message : null,
    },

    PromotionalContent : {
        loading : false,
        data : null,
        message : null,
    }

}

export const fetchButtonConfig = createAsyncThunk(
    'HomeScreenSlice/fetchButtonConfig',
    async () => {
        return GetButtonConfig()
    }
)

// export const fetchGetBorrowerAddress = createAsyncThunk(
//     'content/GetBorrowerAddress',
//     async () => {
//         return GetBorrowerAddress()
//     }
// )

// export const fetchGetBorrowerAddress = createAsyncThunk(
//     'content/GetBorrowerAddress',
//     async () => {
//         return GetBorrowerAddress()
//     }
// )


const HomeScreenSlice = createSlice({
    name: 'HomeScreenSlice',
    initialState,
    reducers: {
        updatePromotionalContent(state, payload){
            const {type , value} = payload.payload
            

            if(type == "loading"){
                state.PromotionalContent.loading = value
                return
            }
        
            switch(type){
                
                case "data":
                    state.PromotionalContent.data = value
                    break;
                case "message":
                    state.PromotionalContent.message = value
                    break;
            }

            state.PromotionalContent.loading = false
        },
        
        updateLoanSection(state, payload){
            const {type , value} = payload.payload
           
            if(type == "loading"){
                state.LoanSection.loading = value
                return
            }
            
            switch(type){
                
                case "data":
                    state.LoanSection.data = value
                    break;
                case "message":
                    state.LoanSection.message = value
                    break;
            }

            state.LoanSection.loading = false
        },
        
        updateButtonConfig(state, payload){
            const {type , value} = payload.payload

            if(type == "loading"){
                state.ButtonConfig.loading = value
                return
            }

            switch(type){
                
                case "data":
                    state.ButtonConfig.data = value
                    break;
                case "message":
                    state.ButtonConfig.message = value
                    break;
            }

            state.ButtonConfig.loading = false
        }
    },
    extraReducers: (builder) => {

        
        builder.addCase(fetchButtonConfig.fulfilled, (state, action) => {
            const response = action.payload
            state.ButtonConfig.loading = false
            state.ButtonConfig.message = null

            if(response.status == STATUS.ERROR){
                state.ButtonConfig.message = response.message
                return
            }
            

            if(response.data == null){
                return
            }

            state.ButtonConfig.data = response.data

        })
        builder.addCase(fetchButtonConfig.pending, (state, action) => {

            state.ButtonConfig.loading = true
            state.ButtonConfig.message = null


        })
        builder.addCase(fetchButtonConfig.rejected, (state, action) => {
            state.ButtonConfig.message = action.error.message
            state.ButtonConfig.loading = false
        })
    }
})



export const {updatePromotionalContent,updateLoanSection, updateButtonConfig} = HomeScreenSlice.actions
export default HomeScreenSlice.reducer
import { createSlice } from '@reduxjs/toolkit'
import { GetBorrowerAddress, sampleAddress } from '../../API/AddressDetails'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { STATUS } from '../../API/Constants'



const requestModel = [
    sampleAddress,
    sampleAddress,
    sampleAddress
]

const initialState = {
    data: requestModel,
    error: null,
    loading: false
}

export const fetchGetBorrowerAddress = createAsyncThunk(
    'content/GetBorrowerAddress',
    async () => {
        return GetBorrowerAddress()
    }
)

export const BorrowerAddressSlice = createSlice({
    name: 'BorrowerAddressSlice',
    initialState,
    reducers: {
        updatePermanentAddress(state, payload) {
            state.data[0] = payload.payload
        },
        updateCurrentAddress(state, payload) {
            state.data[1] = payload.payload
        },
        updateMailingAddress(state, payload) {
            state.data[2] = payload.payload
        },

    },
    extraReducers: (builder) => {

        builder.addCase(fetchGetBorrowerAddress.fulfilled, (state, action) => {
            const response = action.payload
            state.loading = false
            state.error = null

            if(response.status == STATUS.ERROR){
                console.log("================================ fetchGetBorrowerAddress.fulfilled ===================================")
                state.error = response.message
                console.log(response.message)
                console.log("================================ fetchGetBorrowerAddress.fulfilled ===================================")

                return
            }
            

            if(response.data == null){
                return
            }

            
            let newResponse = []
            response.data.forEach(element => {
                newResponse.push({...element,  ApplicationId: sampleAddress.ApplicationId, AddressType: sampleAddress.AddressType,})
            });

            for(let i = newResponse.length ; i < 3 ; i++){
                newResponse.push(sampleAddress)
            }

            console.log("================================ address detail slice ===================================")
            console.log(newResponse)
            console.log("================================ address detail slice ===================================")

            state.data = newResponse

        })
        builder.addCase(fetchGetBorrowerAddress.pending, (state, action) => {

            state.loading = true
            state.error = null


        })
        builder.addCase(fetchGetBorrowerAddress.rejected, (state, action) => {
            console.log("================================ fetchGetBorrowerAddress.rejected ===================================")
            state.error = action.error.message
            console.log(action.error.message)
            console.log("================================ fetchGetBorrowerAddress.rejected ===================================")

            state.loading = false

        })
    },
})

export const { updatePermanentAddress, updateCurrentAddress, updateMailingAddress } = BorrowerAddressSlice.actions
export default BorrowerAddressSlice.reducer
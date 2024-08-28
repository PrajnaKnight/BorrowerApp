import { createSlice } from '@reduxjs/toolkit'
import { GetLoanAskDetails } from '../../API/LoanAskDetails'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { STATUS } from '../../API/Constants'


const requestModel = {
  LeadId: null,         //"valid LeadId"
  LoanAmount: 0,     //"LoanAmount greater than 0",
  AskRate: 14,        //"Rate greater than 0",
  AskTenure: 0,      //"Tenure greater than 0",
  ApplicationId:null,   //"If Application Is Created then provide value defalut pass empty",
  PurposeOfLoan: null,  //"Any other business purpose|For home purchase/ renovation and refurnishing|For undertaking a professional course|Purchase of plant  machinery and equipment|To consolidate ongoing loans|To provide for childs education|Working capital requirement|purchase of asset|Business expansion|working capital|Purchase of Plant and Machinery/Equipment/ Capex for any income generating MSME activity"
  Leadstage : null
}

const initialState = {
  data : requestModel,
  error : null,
  loading : false
}

export const fetchLoanAskDetails = createAsyncThunk(
  'content/GetLoanAsk',
  async () => {
    return GetLoanAskDetails()
  }
)

export const LoanAskSlice = createSlice({
name: 'LoanAskSlice',
initialState,
reducers: {
  updateCurrentLoanAsk(state, payload){
      state.data = payload.payload
  },
  
},
extraReducers: (builder) => {

    builder.addCase(fetchLoanAskDetails.fulfilled, (state, action) => {

      state.loading = false
      state.error = null

      const response = action.payload

      if(response.status == STATUS.ERROR){
        state.error = response.message
        return
      }


      if(response.data == null){
          return
      }

      let newResponse = {...response.data, AskRate: requestModel.AskRate, AskTenure : response.data.AskTenure || 6 , LoanAmount : response.data.LoanAmount || 5000}
      state.data = newResponse

    })
    builder.addCase(fetchLoanAskDetails.pending, (state, action) => {

      state.loading = true
      state.error = null
    })
    builder.addCase(fetchLoanAskDetails.rejected, (state, action) => {
      state.error = action.error.message
      state.loading = false

    })
},
})

export const { updateCurrentLoanAsk} = LoanAskSlice.actions
export default LoanAskSlice.reducer
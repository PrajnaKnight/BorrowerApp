import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { STATUS } from '../../API/Constants'
import { GetPeronsalFinanceDetails } from '../../API/SaveEmploymentDetails'



const PeronsalFinanceBody = {
    LeadId: 0,
    NetSalaryMonthWise: 0,
    GrossMonthlyIncome: 0,
    AnyExistingLoan: null,
    Investments: 0,
    FixedAssets: 0,
    LeadStage: 0,
    BorrowerExistingLoanDetails: [],
    IsLoanAvailable : false,
    

    GrossMonthlyIncomeError: null,
    InvestmentsError: null,
    FixedAssetsError : null
}


const initialState = {
    data: PeronsalFinanceBody,
    error: null,
    loading: false
}


export const fetchPersonalLoanDetails = createAsyncThunk(
    'content/GetPersonalLoanDetails',
    async () => {
        return GetPeronsalFinanceDetails()
    }
)

export const PersonalLoanDetailSlice = createSlice({
    name: 'PersonalLoanDetail',
    initialState,
    reducers: {
        updatePersonaLoanDetails(state, payload) {
            state.data = payload.payload
            if(state.data.IsLoanAvailable && state.data.BorrowerExistingLoanDetails.length == 0){
                state.data.BorrowerExistingLoanDetails = [LoanDetails]
            }
        },

    },
    extraReducers: (builder) => {

        builder.addCase(fetchPersonalLoanDetails.fulfilled, (state, action) => {

            state.loading = false
            state.error = null

            const response = action.payload

            if (response.status == STATUS.ERROR) {
                state.error = response.message
                return
            }


            if (response.data == null) {
                return
            }

            state.data = {...response.data, IsLoanAvailable : response.data.BorrowerExistingLoanDetails.length > 0}


        })
        builder.addCase(fetchPersonalLoanDetails.pending, (state, action) => {

            state.loading = true
            state.error = null
        })
        builder.addCase(fetchPersonalLoanDetails.rejected, (state, action) => {
            state.error = action.error.message
            state.loading = false

        })
    },
})

export const { updatePersonaLoanDetails } = PersonalLoanDetailSlice.actions
export default PersonalLoanDetailSlice.reducer


const LoanDetails = {
    ELDetailId: 0,
    LeadId: 0,
    LoanFromBank: null,
    LoanType: null,
    LoanAmount: 0,
    EMI: 0,
    IsBalanceTransfer: null,
    DisbursedLoanAmount: 0,
    DisbursementDate: null,
    OutstandingBalance: 0,
    EMIPaid: 0,
    EMIBounced: 0,
    CurrentRateOfInterest: 0,
    BalanceTenure: 0,
    Overdues: 0,
    DPDs: 0,

    LoanFromBankError : null,
    LoanTypeError : null,
    LoanAmountError : null,
    EmiError : null
}
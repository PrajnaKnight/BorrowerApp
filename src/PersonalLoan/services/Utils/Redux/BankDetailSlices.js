import { createSlice } from '@reduxjs/toolkit'
import { GetBankAccountDetails } from '../../API/SaveBankAccountDetail'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { STATUS } from '../../API/Constants'

const bankModel = {
    LeadId: null,// "LeadId"
    BankName: null,
    BankCode: null,// "Valid bank code.", 
    AccountHolderName: null,// "Name",
    AccountType: "Current",// "Current|Savings|OverDraft|CashCredit",
    ODCCLimit: null,// "Valid Amount",
    IFSC: null,// "Must be at least 11 characters long.",
    AccountNumber: null,// "Accept only integers",
    ReAccountNumber: null,// "Accept only integers",
    Password : null,// "File Password",
    BankBrachName: null, //"string",
    AccountHolderNameError: null,
    IFSCError: null,
    AccountNumberError : null,
    ReAccountNumberError : null,
    BankBracnchNameError : null,
    BankNameError : null,
    isAccountNumberMatching : false,
    LeadStage : null,
    isAccountNameVaid : null,
    GlobalErrorMessage : null
}

const requestModel = [bankModel]

const initialState = {
    data: {
        LeadName : null,
        BankList : requestModel
    },
    error: null,
    loading: false
}

export const fetchGetBankAccountDetails = createAsyncThunk(
    'content/GetBankAccountDetails',
    async () => {
        return GetBankAccountDetails()
    }
)

export const BankAccountDetailSlice = createSlice({
    name: 'BankAccountDetailSlice',
    initialState,
    reducers: {
        updateBankDetails(state, payload) {
            const index = payload.payload.index
            state.data.BankList[index] = payload.payload.data
        },
        addBankAccount(state){
            state.data.BankList.push(bankModel)
        },
        deleteBankAccount(state, payload){
            const newAccounts = [...state.data.BankList];
            newAccounts.splice(payload.payload,1);
            state.data.BankList = newAccounts
        }
    },
    extraReducers: (builder) => {

        builder.addCase(fetchGetBankAccountDetails.fulfilled, (state, action) => {
            const response = action.payload
            state.loading = false
            state.error = null


            if(response.status == STATUS.ERROR){
                state.error = response.message
                return
            }


            if(response.data==null){
                return
            }

            state.data.LeadName = response.data.LeadName

            // Add standard constant value
            let newResponse = []
            response.data.BankList?.forEach(element => {
                newResponse.push({...element, AccountType: bankModel.AccountType})
            });

            if(newResponse.length == 0){
                newResponse = [bankModel]
            }
            state.data.BankList = newResponse

        })
        builder.addCase(fetchGetBankAccountDetails.pending, (state, action) => {

            state.loading = true
            state.error = null
        })
        builder.addCase(fetchGetBankAccountDetails.rejected, (state, action) => {
            state.error = action.error.message
            state.loading = false

        })
    },
})

export const { updateBankDetails, addBankAccount, deleteBankAccount } = BankAccountDetailSlice.actions
export default BankAccountDetailSlice.reducer
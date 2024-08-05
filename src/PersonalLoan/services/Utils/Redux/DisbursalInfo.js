import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    LoanAmount: 0,
    NetDisbursalAmount: 0,
    ProcessingFee: 0,
    FirstEmiDate: null,
    EmiAmount: 0,
    Insurance: 0,
    TransactionDate : null,
    BankAcc : null,
    TransactionId : null,
    TransactionUtr : null
}


export const DisbursalInfoSlices = createSlice({
    name: 'DisbursalInfoSlice',
    initialState,
    reducers: {
        updateDisbursalInfoFromGetDisbursalData(state, payload) {

            // {
            //     "ApplicationID": 671007101,
            //         "BankAccount": [
            //             "12312312"
            //         ],
            //      "ProcessingFeeAmount": 0,
            //      "IsAutoDisbursement": true,
            //      "FirstEMIDate": "2024-07-05T09:00:47.4839735+00:00",
            //      "LoanAmount": 4001000,
            //      "Insurance": "1000"
            // }

            const data = payload.payload
            state.LoanAmount = data.LoanAmount || 0
            state.ProcessingFee = data.ProcessingFeeAmount || 0
            state.Insurance = data.Insurance || 0
            state.EmiAmount = data.EmiAmount[0] || 0

        },
        updateDisbursalInfoFromGetBankFundOut(state, payload) {
            

            // {
            //     "UTRNumber": "EI2SBBHQAM4GGE51",
            //     "EMIDate": "2024-06-05T05:28:41.2385014+00:00",
            //     "DisbursementAmount": 4001000,
            //     "TransactionDate": "2024-06-05T05:28:41.2385014+00:00",
            //     "TransactionID": "c0cd05b9e5cc44d6bfc37ddd016b50c320240605052841222"
            // }
            const data = payload.payload
            state.FirstEmiDate = data.EMIDate
            state.NetDisbursalAmount = data.DisbursementAmount || 0
            state.EmiAmount = data.EMIAmount || 0
            state.TransactionDate = data.TransactionDate
            state.BankAcc = data.BankAcc
            state.TransactionId = data.TransactionID
            state.TransactionUtr = data.UTRNumber

        },
    },

})


export const { updateDisbursalInfoFromGetDisbursalData, updateDisbursalInfoFromGetBankFundOut } = DisbursalInfoSlices.actions
export default DisbursalInfoSlices.reducer
import axios from 'axios';
import { API_RESPONSE_STATUS, STATUS, SAVE_BANK_ACC_DEATILS, SUBMIT_BORROWER_LOAN_APPLICATION_ASYNC, GET_BRANCH_NAME_BY_ISFC_CODE, GetHeader, GET_BANK_ACC_DEATILS, VERIFY_BANK} from "./Constants";
import { GetLeadId, StoreApplicantId } from '../LOCAL/AsyncStroage';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';

const SaveBankAccountDetails = async (requestModel) => {

    let status, data, message;

    try {

        const header = await GetHeader()
    
        let response = await axios.post(SAVE_BANK_ACC_DEATILS, requestModel, {headers  : header})
        
        data = response.data
        
        console.log(data.Message)
        status = response.status == 200 && data.StatusCode == "2000" ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){
            message = data.Message

        }
        else{
            message = data?.Message ||"Error : Facing Problem While Submitting Bank Account Details";
        }
         
    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SaveBankAccountDetails  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Submitting Bank Account Details"
        }

        message = errorMessage
        data = null
    
        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if(errorMessage != Network_Error){
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    return API_RESPONSE_STATUS(status, data, message)

}



export const SubmitBorrowerLoanApplicationAsyncSubmit = async () => {

    let status, data, message;

    try {

        const header = await GetHeader()
        const LeadId = await GetLeadId()
        console.log("================== Loan Submit ==========================")
        console.log(SUBMIT_BORROWER_LOAN_APPLICATION_ASYNC)
        console.log({ LeadId: LeadId })
        console.log( {headers  : header})
        console.log("================== Loan Submit ==========================")

        
        
        let response = await axios.post(SUBMIT_BORROWER_LOAN_APPLICATION_ASYNC, { LeadId: LeadId },  {headers  : header})
        
        data = response.data

      
        // || data.Message == "Application already created."
        status = response.status == 200 && (data.StatusCode == "2000" || (data.ApplicationId != null && data.ApplicationId > 0))  ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){
            message = response.data.Message
            await StoreApplicantId(data.ApplicationId)
        }
        else{
            message = data?.Message || "Error : Facing Problem While Submitting Loan Application";
        }
         
    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SubmitBorrowerLoanApplicationAsyncSubmit  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Submitting Loan Application"
        }

        message = errorMessage
        data = null
    
        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if(errorMessage != Network_Error){
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    return API_RESPONSE_STATUS(status, data, message)

}


export const GetBranchNameWithIFSC = async (ifsc) => {

    let status, data, message;

    try {


        const header = await GetHeader()

    
        let response = await axios.get(`${GET_BRANCH_NAME_BY_ISFC_CODE}?IFSCCode=${ifsc}`,  {headers  : header})
        data = response.data
        
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status != STATUS.SUCCESS){
            message = data?.Message || "Error : Facing Problem While Getting Branch Name With Ifsc";
        }
         
    } catch (error) {
    

        
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetBranchNameWithIFSC  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Getting Branch Name With Ifsc"
        }

        message = errorMessage
        data = null

        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if(errorMessage != Network_Error){
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    return API_RESPONSE_STATUS(status, data, message)

    
}


export const GetBankAccountDetails = async () => {

    let status, data, message;

    try {
    
        const header = await GetHeader()
        const LeadId = await GetLeadId()
        const url = `${GET_BANK_ACC_DEATILS}?LeadID=${LeadId}`

        console.log("bank details get url : ",url)
        console.log("bank details header", header)
        let response = await axios.get(url, {headers : header})
        
        data = response.data
        
        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){

            message = response.data.Message

        }
        else{
            message = data?.Message || "Error : Facing Problem While Fetching Bank Account Deatils !"
            // if(data.Message != null && data.Message != ""){
            //     message = data.Message
            // }
            // else if(response.message != null && response.message != "") {
            //     message = response.message;
            // } 
            // else{
            //     message = "Something went wrong";
            // }
        }
         
    } catch (error) {
    

             
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetBankAccountDetails  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Fetching Bank Account Deatils !"
        }

        message = errorMessage
        data = null


        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if(errorMessage != Network_Error){
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    return API_RESPONSE_STATUS(status, data, message)

    
}


export const BankAccountDetailsModel = () => {
    return {
        LeadId: null,// "LeadId"
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
        isAccountNumberMatching : false,

        LeadStage : null


    }
}


export const VerifyBankAccount = async (AccountNO, IFSCCode) => {

    let status, data, message;

    try {
    
        const header = await GetHeader()
        const url = `${VERIFY_BANK}?AccountNO=${AccountNO}&IFSCCode=${IFSCCode}`

 
        let response = await axios.get(url, {headers : header})
        
        data = response.data
        
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){

            message = response.data.Message

        }
        else{

            // if(data.Message != null && data.Message != ""){
            //     message = data.Message
            // }
           
            // else{
            //     message = "Something went wrong";
            // }
            message = data?.Message || "Error : Facing Problem While Verifying Bank Account Deatils !"
        }
         
    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - VerifyBankAccount  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Verifying Bank Account Deatils !"
        }

        message = errorMessage
        data = null


        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if(errorMessage != Network_Error){
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    return API_RESPONSE_STATUS(status, data, message)

    
}
export default SaveBankAccountDetails
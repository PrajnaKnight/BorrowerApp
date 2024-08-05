import axios from "axios";
import { GetApplicantId, GetLeadId } from "../LOCAL/AsyncStroage";
import { API_RESPONSE_STATUS, BANK_FUND_OUT, CREATE_LA, GET_DISBURSAL_DATA, GET_FUND_OUT_DATA, GetHeader, STATUS } from "./Constants";
import { Network_Error } from "../Utils/Constants";
import { SendGeoLocation } from './LocationApi';
import SaveLeadStage from "./SaveLeadStage";


export const GetDisbursalData = async () => {

    let status, data, message;

    try {

        console.log("==================== Get Disbursal Data =======================")

        const header = await GetHeader()
        console.log(header)
        const ApplicationId = await GetApplicantId()

        const url = `${GET_DISBURSAL_DATA}?ApplicationID=${ApplicationId}`
        console.log(url)

        let response = await axios.get(url, { headers: header })

        console.log(response.data)
        data = response.data



        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            message = data?.Message || "Error : Facing Problem While Fetching Disbursal Data";
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        // console.error('Error - SendSaveBREEligibilityInfo  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Disbursal Data";
        }

        message = errorMessage
        data = null


    }
    
    return API_RESPONSE_STATUS(status, data, message)


}


export const CreateLA = async () => {

    let status, data, message;

    try {

        console.log("==================== Create LA =======================")

        const header = await GetHeader()
        console.log(header)
        const ApplicationId = await GetApplicantId()


        const url = `${CREATE_LA}?ApplicationID=${ApplicationId}`
        console.log(url)

        let response = await axios.post(url, null, { headers: header })

        console.log(response.data)
        data = response.data



        status = response.status == 200 && data.StatusCode === "2000" ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            message = data?.Message || "Error : Facing Problem While Creating LA";
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        // console.error('Error - SendSaveBREEligibilityInfo  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Creating LA";
        }

        message = errorMessage
        data = null


    }
    if (status == STATUS.SUCCESS) {

 
        console.log("========== fetching location =================")
        await SendGeoLocation(12)
        console.log("========== fetching location =================")
    }
    return API_RESPONSE_STATUS(status, data, message)


}


export const BankFundOut = async (UTRNo ,NetPayAmount ) => {

    let status, data, message;

    try {

        console.log("==================== Bank Fund Out =======================")

        const header = await GetHeader()
        console.log(header)
        const leadId = await GetLeadId()


        let requestModel = BankFundOutPost(leadId, UTRNo, NetPayAmount )

        console.log(requestModel)


        let response = await axios.post(BANK_FUND_OUT, requestModel, { headers: header })

        data = response.data

        status = response.status == 200 && data.StatusCode === "2000" ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            message = data?.Message || "Error : Facing Problem While Doing Bank Fund Out";
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        // console.error('Error - SendSaveBREEligibilityInfo  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Doing Bank Fund Out";
        }

        message = errorMessage
        data = null


    }

    if (status == STATUS.SUCCESS) {

  
        console.log("========== fetching location =================")
        await SendGeoLocation(14)
        console.log("========== fetching location =================")
    
    }
    // if (status == STATUS.SUCCESS) {
    //     console.log("========== fetching location =================")
    //     await SendGeoLocation(11)
    //     console.log("========== fetching location =================")
    // }
    console.log("==================== Bank Fund Out =======================")

    return API_RESPONSE_STATUS(status, data, message)


}

export const GetBankFundOutData = async ()=>{
    let status, data, message;

    try {

        console.log("==================== Get Bank Fund Out Data =======================")

        const header = await GetHeader()
        console.log(header)
        const ApplicationId = await GetApplicantId()


        const url = `${GET_FUND_OUT_DATA}?ApplicationID=${ApplicationId}`
        console.log(url)

        let response = await axios.get(url, { headers: header })

        console.log(response.data)
        data = response.data



        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            message = data?.Message || "Error : Facing Problem While Fetching Fund Out Data";
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        // console.error('Error - SendSaveBREEligibilityInfo  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Fund Out Data";
        }

        message = errorMessage
        data = null


    }
   

    
    if (status == STATUS.SUCCESS) {
     
        console.log("========== fetching location =================")
        await SendGeoLocation(13)
        console.log("========== fetching location =================")
    
    }
 
    return API_RESPONSE_STATUS(status, data, message)

}


export const GetDisbursalModel = (data) => {
    return {
        EmandateUMRN : data?.EmandateUMRN,
        ApplicationID: data?.ApplicationID,
        BankAccount: data?.BankAccount,
        IsAutoDisbursement: data?.IsAutoDisbursement,
        FirstEMIDate: data?.FirstEMIDate,
        LoanAmount: data?.LoanAmount,
        ProcessingFeeAmount: data?.ProcessingFeeAmount,
        Insurance: data?.Insurance,

        EmiAmount : data?.EMIAmount,
        NetDisbursmentAmount : null
    }
}


export const BankFundOutPost = (leadId, UTRNo, NetPayAmount ) =>{
    return {
        LeadId: leadId,
        LenderType:"Bank",
        UTRNo: UTRNo,
        PayoutDate: new Date(),
        NetPayAmount:NetPayAmount
    }
}

export const GetBankFundOutDataModel = (data) =>{
    return {
        UTRNumber: data.UTRNumber,
        EMIDate: data.EMIDate,
        DisbursementAmount: data.DisbursementAmount,
        TransactionDate: data.TransactionDate,
        TransactionID: data.TransactionID,
        BankAcc : data.BankAcc,
        EMIAmount : data.EMIAmount,
        IsFundOutComplete : data.IsFundOutComplete
      }
}
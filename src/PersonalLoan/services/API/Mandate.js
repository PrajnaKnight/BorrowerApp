import axios from "axios";
import { GetLeadId } from "../LOCAL/AsyncStroage";
import { API_RESPONSE_STATUS, CREATE_PHYSICAL_MANDATE, DOWNLOAD_PHYSICAL_MANDATE_FORM, GetHeader, MANDATE_INFO, STATUS } from "./Constants";
import { Network_Error } from "../Utils/Constants";

export const GetMandateInfo = async() =>{
    let status, data, message;
    try {
        const header = await GetHeader()
        const leadID = await GetLeadId();

        console.log(header)
        console.log(leadID)
        const response = await axios.post(`${MANDATE_INFO}?LeadID=${leadID}`,null, { headers: header })

        data = response.data
        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR
    
    }
    catch(error){
        
        const errorresponseData = error?.response?.data?.Message;

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
        //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Mandate Info"
        }
       

        message = errorMessage
        data = null

    }

    return API_RESPONSE_STATUS(status, data, message)
    
    
}





export const CreatePhysicalMandate = async(requestModel) =>{
    let status, data, message;
    try {

        const response = await axios.post(`${CREATE_PHYSICAL_MANDATE}`,requestModel)

        data = response.data
        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR
    
    }
    catch(error){
        
        const errorresponseData = error?.response?.data?.Message;

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
        //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Mandate Info"
        }
       

        message = errorMessage
        data = null

    }

    return API_RESPONSE_STATUS(status, data, message)
    
    
}



export const DownloadPhysicalMandateForm = async(requestModel) =>{
    let status, data, message;
    try {
        const authToken = await GetHeader()
        console.log(authToken)
        console.log(requestModel)
        const response = await axios.post(`${DOWNLOAD_PHYSICAL_MANDATE_FORM}`,requestModel,  { headers: authToken })
        data = response.data
        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR
    
    }
    catch(error){
        
        const errorresponseData = error?.response?.data?.Message;

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
        //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Mandate Info"
        }
       

        message = errorMessage
        data = null

    }

    return API_RESPONSE_STATUS(status, data, message)
    
    
}

export const CreateMandateModel = (mandateInfo, leadID) =>{
    const mandateDetails = {
        "MandateDetails": {
          "ReferenceCode": "string",
          "SponsorBankCode": "string",
          "CorporateUtilityCode": "string",
          "CorporateName": "string",
          "MandateAmount": "string",
          "MandateCreateDate": "string",
          "CustomerMobileNumber": mandateInfo?.mandate_data?.customer_mobile,
          "CustomerEmailAddress": mandateInfo?.mandate_data?.customer_email,
          "CustomerName": mandateInfo?.mandate_data?.customer_name,
          "MandateStartDate": mandateInfo?.mandate_data?.first_collection_date,
          "MandateEndDate": "",
          "CustomerAccountNumber": mandateInfo?.mandate_data?.customer_account_number,
          "AccountType": mandateInfo?.mandate_data?.customer_account_type,
          "DestinationBankCode": "",
          "MandateAmountType": "string",
          "FrequencyCode": "string",
          "FrequencyType": mandateInfo?.mandate_data?.frequency,
          "MandateDebitCategory": "string",
          "MandatePaymentType": "string",
          "ConsumerReferenceNumber": "string",
          "SchemePlanReferenceNumber": "string",
          "MandateType": mandateInfo?.mandate_type,
          "CustomerPAN": "string",
          "CustomerLandlineNumber": "string",
          "CallbackResponseUrl": "string",
          "CorporateCode": "string",
          "CycleDate": "string",
          "MandateAuthMode": mandateInfo?.auth_mode,
          "DestinationBankId": null,
          "DestinationBankName": null,
          "InstrumentType": mandateInfo?.mandate_data?.instrument_type || "debit",
          "IsRecurring": mandateInfo?.mandate_data?.is_recurring,
          "ManagementCategory":  mandateInfo?.mandate_data?.management_category,
          "MaximumAmount": mandateInfo?.mandate_data?.maximum_amount,
          "CustomerIdentifier": mandateInfo?.mandate_data?.customer_mobile,
          "CustomerVpa": "",
          "ExpireInDays": 0,
          "GenerateAccessToken": mandateInfo?.generate_access_token
        },
        "LeadId": leadID
      }

    return mandateDetails
    
}
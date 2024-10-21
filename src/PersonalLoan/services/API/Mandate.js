import axios from "axios";
import { GetLeadId } from "../LOCAL/AsyncStroage";
import { API_RESPONSE_STATUS, CREATE_PHYSICAL_MANDATE, CREATE_UPI_MANDATE, DOWNLOAD_PHYSICAL_MANDATE_FORM, GetHeader, MANDATE_INFO,SUBMIT_SCANNED_PHYSICAL_MANDATE, STATUS } from "./Constants";
import { Network_Error } from "../Utils/Constants";

export const GetMandateInfo = async () => {
    let status, data, message;
    try {
        const header = await GetHeader()
        const leadID = await GetLeadId();

        console.log(header)
        console.log(leadID)
        const response = await axios.post(`${MANDATE_INFO}?LeadID=${leadID}`, null, { headers: header })

        data = response.data
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

    }
    catch (error) {

        const errorresponseData = error?.response?.data?.Message;

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Mandate Info"
        }


        message = errorMessage
        data = null

    }

    return API_RESPONSE_STATUS(status, data, message)


}





export const CreatePhysicalMandate = async (requestModel) => {
    let status, data, message;
    try {

        const response = await axios.post(`${CREATE_PHYSICAL_MANDATE}`, requestModel)

        data = response.data
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

    }
    catch (error) {

        const errorresponseData = error?.response?.data?.Message;

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Mandate Info"
        }


        message = errorMessage
        data = null

    }

    return API_RESPONSE_STATUS(status, data, message)


}


export const CreateUPIMandate = async (requestModel) => {
    let status, data, message;
    try {

        const response = await axios.post(`${CREATE_UPI_MANDATE}`, requestModel)

        data = response.data
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

    }
    catch (error) {

        const errorresponseData = error?.response?.data?.Message;

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Mandate Info"
        }


        message = errorMessage
        data = null

    }

    return API_RESPONSE_STATUS(status, data, message)


}

export const DownloadPhysicalMandateForm = async (requestModel) => {
    let status, data, message;
    try {
        const authToken = await GetHeader()
        console.log(authToken)
        console.log(requestModel)
        const response = await axios.post(`${DOWNLOAD_PHYSICAL_MANDATE_FORM}`, requestModel, { headers: authToken })
        data = response.data
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

    }
    catch (error) {

        const errorresponseData = error?.response?.data?.Message;

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Mandate Info"
        }


        message = errorMessage
        data = null

    }

    return API_RESPONSE_STATUS(status, data, message)


}


export const UploadPhysicalMandateForm = async (mandate, document) => {
    let status, data, message;
    try {

        const header = await GetHeader()
        const LeadId = await GetLeadId()
        
        const formData = new FormData();
        formData.append('leadId', LeadId);
        formData.append('UploadFile', document);
        formData.append('MandateId', mandate)

        const response = await axios.post(`${SUBMIT_SCANNED_PHYSICAL_MANDATE}`, formData, {
            headers: {
                ...header,
                'Content-Type': 'multipart/form-data',
            },
        })
        data = response.data
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

    }
    catch (error) {

        const errorresponseData = error?.response?.data?.Message;

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Mandate Info"
        }


        message = errorMessage
        data = null

    }

    return API_RESPONSE_STATUS(status, data, message)


}

export const CreateMandateModel = (mandateInfo, leadID) => {
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
            "MandateEndDate": mandateInfo?.mandate_data?.Last_collection_date,
            "CustomerAccountNumber": null,
            "AccountType": null,
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
            "ManagementCategory": mandateInfo?.mandate_data?.management_category,
            "MaximumAmount": mandateInfo?.mandate_data?.maximum_amount,
            "CustomerIdentifier": mandateInfo?.mandate_data?.customer_mobile,
            "CustomerVpa": "",
            "ExpireInDays": 0,
            "GenerateAccessToken": mandateInfo?.generate_access_token,

            "CustomerAccountNumberError": null,
            "DestinationBankIdError": null,
            "CustomerVpaError": null
        },
        "LeadId": leadID
    }

    return mandateDetails

}


export const CreateUpiMandateModel = (createMandateModel, leadID, customerVpa) => {


    let createUpiMandateModel = {
        ...createMandateModel,
        MandateDetails:
        {
            ...createMandateModel.MandateDetails, ExpireInDays: 15,
            AutoDebitAmountInPaise: 150, CustomerVpa: customerVpa
        }, LeadId: leadID
    }


    return createUpiMandateModel


}



export const CreatePhysicalFormMandate = (createMandateModel, leadID) => {


    let createUpiMandateModel = {
        ...createMandateModel,
        MandateDetails:
        {
            ...createMandateModel.MandateDetails,
            MandateMode : "physical",

        }, LeadId: leadID
    }

    return createUpiMandateModel


}
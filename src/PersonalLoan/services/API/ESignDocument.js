import axios from 'axios';
import { E_SIGN_EXTERNAL, STATUS, API_RESPONSE_STATUS, GetHeader, DOWNLOAD_E_SIGNED_DOCUMENT, GET_LOAN_AGREEMENT_LETTER, UploadDocument, RedirectUrl, GET_LOAN_AGREEMENT_LETTER_HTML, GET_E_SIGN_LOAN_AGREEMENT } from "./Constants";
import { GetApplicantId, GetLeadId } from '../LOCAL/AsyncStroage';

import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { SendGeoLocation } from './LocationApi';
import { DownloadMyFile, generatePdf } from '../Utils/FieldVerifier';
import SaveLeadStage from './SaveLeadStage';


const getFileNameAndExtensionFromURI = (uri) => {
    const lastIndex = uri.lastIndexOf('/');
    if (lastIndex !== -1) {
        const filenameWithExtension = uri.substring(lastIndex + 1);
        const [filename, extension] = filenameWithExtension.split('.');
        return { filename, extension };
    }
    return null;
};



export const ESignExternal = async () => {
    let status, data, message;



    try {



        console.log("================================ Upload Files =============================")


        const header = await GetHeader()
        const ApplicationID = await GetApplicantId()

        const response = await axios.post(`${E_SIGN_EXTERNAL}?ApplicationID=${ApplicationID}&RedirectUrl=${RedirectUrl}`, null, {
            headers: header
        });


        data = response.data
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {

            message = data.Message || "Error : Facing Problem While E-Sign !";

        }


    }
    catch (error) {
        console.error('Upload error:', error);

        const errorresponseData = error?.response?.data?.Message;

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While E-Sign !"
        }

        message = errorMessage
        data = null

    }

    if (status == STATUS.SUCCESS) {
        console.log("========== fetching location =================")
        await SendGeoLocation(10)
        console.log("========== fetching location =================")
    }

    return API_RESPONSE_STATUS(status, data, message)
}


export const GetLoanAgreementFile = async () => {

    let status, data, message;


    try {


        const header = {
            ...await GetHeader(),
            'Content-Type': 'application/pdf',
            // Add any necessary headers (e.g., authorization tokens)
        }

        const applicationId = await GetApplicantId()

        const path = `${GET_LOAN_AGREEMENT_LETTER}?ApplicationID=${applicationId}`
        data = await generatePdf(path, header, "POST")
        status = STATUS.SUCCESS
    } catch (error) {

        status = STATUS.ERROR
        let errorMessage = error.message
        if (errorMessage != Network_Error) {
            errorMessage = "Error : Facing Problem While Fetching Sanction Document !"
        }

    }
    return API_RESPONSE_STATUS(status, data, message)


}


export const CheckEsignLoanAgreement = async () => {


    let status, data, message;

    try {

        const leadId = await GetLeadId()
        const header = await GetHeader()
        const applicationId = await GetApplicantId()
        const path = `${GET_E_SIGN_LOAN_AGREEMENT}?LeadID=${leadId}`
        const checkIsFileAvailabe = await axios.get(path, { headers: header })



        if (checkIsFileAvailabe?.data?.Message != null) {
            status = STATUS.ERROR
            message = checkIsFileAvailabe?.data?.Message 
        }
        else {
            let response = await DownloadMyFile(header, path, `LoanAgreementLetter_${applicationId}.pdf`)
            status = response.status == STATUS.SUCCESS ? STATUS.SUCCESS : STATUS.ERROR
        }




    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - DownloadESigningDocument - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Downloading E-Sign Document!"
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

    if (status == STATUS.SUCCESS) {
        console.log("========== fetching location =================")
        await SendGeoLocation(10)
        console.log("========== fetching location =================")
    }


    return API_RESPONSE_STATUS(status, data, message)


}



export const DownloadESigningDocument = async (transactionId) => {

    let status, data, message;

    try {

        const leadId = await GetLeadId()
        const header = await GetHeader()
        let response = await axios.post(`${DOWNLOAD_E_SIGNED_DOCUMENT}?LeadId=${leadId}&transactionId=${transactionId}`, null, { headers: header })
        console.log(`${DOWNLOAD_E_SIGNED_DOCUMENT}?LeadId=${leadId}&transactionId=${transactionId}`)
        data = response.data


        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR


        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {


            message = data.Message || "Error : Facing Problem While Downloading E-Sign Document!";

        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - DownloadESigningDocument - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Downloading E-Sign Document!"
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

    if (status == STATUS.SUCCESS) {

        // const saveLeadStageResponse = await SaveLeadStage("loanAgreement")
        // if(saveLeadStageResponse == STATUS.ERROR){
        //     status = STATUS.ERROR
        //     message = saveLeadStageResponse.message
        //     data = null
        //     return API_RESPONSE_STATUS(status, data, message)
        // }

        console.log("========== fetching location =================")
        await SendGeoLocation(11)
        console.log("========== fetching location =================")

    }


    return API_RESPONSE_STATUS(status, data, message)


}



export const GetLoanAgreementLetter = async () => {

    let status, data, message;

    try {

        const ApplicationID = await GetApplicantId()
        const header = await GetHeader()
        console.log(header)
        console.log(`${GET_LOAN_AGREEMENT_LETTER_HTML}?ApplicationID=${ApplicationID}`)
        let response = await axios.post(`${GET_LOAN_AGREEMENT_LETTER_HTML}?ApplicationID=${ApplicationID}`, null, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR


        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            message = data?.Message || "Error : Facing Problem While Fetching Loan Agreement Letter";
        }


    } catch (error) {

        status = STATUS.ERROR
        let errorMessage = error.message
        if (errorMessage != Network_Error) {
            errorMessage = "Error : Facing Problem While Fetching Loan Agreement Letter"
        }
        message = errorMessage
        data = null
    }


    return API_RESPONSE_STATUS(status, data, message)


}


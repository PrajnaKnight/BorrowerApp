import { GetApplicantId } from "../LOCAL/AsyncStroage";
import { BORROWER_SACTION, GET_SANCTION_LETTER_DATA, GetHeader, STATUS, API_RESPONSE_STATUS, SENCTION_HTML_PAGE } from "./Constants";
import axios from 'axios';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { SendGeoLocation } from "./LocationApi";
import { DownloadMyFile } from "../Utils/FieldVerifier";
import SaveLeadStage from "./SaveLeadStage";


export const GetBorrowerSectionData = async () => {

    let status, data, message;

    try {

        const header = await GetHeader()
        const applicationId = await GetApplicantId()
        const url = `${GET_SANCTION_LETTER_DATA}?ApplicationId=${applicationId}`

        let response = await axios.get(url, { headers: header })

        
        data = response.data

        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            // if (data.Message != null && data.Message != "") {
            //     message = data.Message
            // }
           
            // else {
            //     message = Something_Went_Wrong;
            // }
            message = data?.Message ||  "Error : Facing Problem While Fetching Borrower Sanction Data !"
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetBorrowerSectionData - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Borrower Sanction Data !"
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



export const SendBorrowerSectionData = async () => {

    let status, data, message;

    try {

        const header = await GetHeader()
        const applicationId = await GetApplicantId()
        const url = `${BORROWER_SACTION}?ApplicationId=${applicationId}`

        let response = await axios.post(url, null, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            // if (data.Message != null && data.Message != "") {
            //     message = data.Message
            // }

            // else {
            //     message = Something_Went_Wrong;
            // }
            message = data?.Message || "Error : Facing Problem While Sending Borrower Sanction Data !"
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SendBorrowerSectionData - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Sending Borrower Sanction Data !"
        }

        message = errorMessage
        data = null

        // status = STATUS.ERROR
        // let errorMessage = error.message
        // console.log(errorMessage)
        // if(errorMessage != Network_Error){
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    if (status == STATUS.SUCCESS) {

        console.log("========== fetching location =================")
        await SendGeoLocation(8)
        console.log("========== fetching location =================")
    }

    return API_RESPONSE_STATUS(status, data, message)


}


export const GetSectionHtmlPage = async () => {

    let status, data, message;

    try {


        const header = await GetHeader()
        const applicationId = await GetApplicantId()

        const path = `${SENCTION_HTML_PAGE}?ApplicationID=${applicationId}`
        await DownloadMyFile(header, path, `SanctionLetter_${applicationId}.pdf`)

    } catch (error) {

        status = STATUS.ERROR
        let errorMessage = error.message
        if (errorMessage != Network_Error) {
            errorMessage = "Error : Facing Problem While Fetching Sanction Document !"
        }

    }
    return API_RESPONSE_STATUS(status, data, message)


}
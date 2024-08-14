import { GetLeadId } from "../LOCAL/AsyncStroage";
import { OCR_AADHAAR_REQUEST, GetHeader, STATUS, API_RESPONSE_STATUS } from "./Constants";
import axios from "axios";

import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';



const OcrAadhaarRequest = async () => {

    let status, data, message;

    try {
        const header = await GetHeader()

        const LeadId = await GetLeadId()

        const url = `${OCR_AADHAAR_REQUEST}?Leadid=${LeadId}`

        let response = await axios.post(url, null, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data?.Message
        }
        else {


            message = data?.Message || "Error : Facing Problem While Requesting Aadhaar Ocr";

        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - OcrAadhaarRequest  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Requesting Aadhaar Ocr"
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




export default OcrAadhaarRequest
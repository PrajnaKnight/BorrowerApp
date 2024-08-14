import { GetLeadId } from "../LOCAL/AsyncStroage";
import { SUBMIT_AADHAAR_OTP_REQUEST, GetHeader, STATUS, API_RESPONSE_STATUS } from "./Constants";
import axios from "axios";

import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';



const SubmitAadhaarOtpRequest = async (aadhaarNumber, otp, transactionID) => {

    let status, data, message;

    try {
        const header = await GetHeader()

        const LeadId = await GetLeadId()
        const ApplicantId = null
        const url = `${SUBMIT_AADHAAR_OTP_REQUEST}?leadid=${LeadId}&Otp=${otp}&transactionID=${transactionID}&AadhaarNumber=${aadhaarNumber}&ApplicantId=${ApplicantId}`
        console.log(url)

        let response = await axios.post(url, null, {headers:header})
        
        data = response.data
        
        status = response.status == 200 && data.Status == "200" ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){
            message = data.Message
        }
        else{

            // if(data.Message != null && data.Message != ""){
            //     message = data.Message
            // }
          
            // else{
            //     message = "Something went wrong";
            // }
            message = data?.Message || "Error : Facing Problem While Submitting Aadhaar Otp !"
        }
         
    } catch (error) {
    

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SubmitAadhaarOtpRequest  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Submitting Aadhaar Otp !"
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




export default SubmitAadhaarOtpRequest
import { SEND_AADHAAR_OTP_REQUEST, GetHeader, STATUS, API_RESPONSE_STATUS } from "./Constants";
import axios from "axios";
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';




const SendAadhaarOtpRequest = async (aadhaarNumber) => {

    let status, data, message;

    try {
        const header = await GetHeader()

        const url = `${SEND_AADHAAR_OTP_REQUEST}?Aadharno=${aadhaarNumber}`

        let response = await axios.post(url, null, {headers:header})
        
        data = response.data
        
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        
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
            message = data?.Message || "Error : Facing Problem While Requesting Aadhaar Otp !"
        }
         
    } catch (error) {
    

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SendAadhaarOtpRequest  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Requesting Aadhaar Otp !"
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



export default SendAadhaarOtpRequest
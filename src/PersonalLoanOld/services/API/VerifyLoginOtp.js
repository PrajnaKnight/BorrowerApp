import axios from 'axios';
import { API_RESPONSE_STATUS, GetHeader, STATUS , VERIFY_LOGIN_OTP} from "./Constants";
import { StoreAuthToken, StoreTokenValidity } from '../LOCAL/AsyncStroage';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';

const VerifyLoginOtp = async (requestModel) => {

    let status, data, message;

    try {
    
        const url = `${VERIFY_LOGIN_OTP}?otp=${requestModel.OTP}&mobileNo=${requestModel.mobileNo}`
        console.log(url)

        let header = await GetHeader()

        let response = await axios.post(url, null, {headers:header})

       
        data = response.data

        console.log(data)
        
        status = response.status == 200 && data.otp_details.OTP_verified ? STATUS.SUCCESS : STATUS.ERROR

        if(status == STATUS.SUCCESS){
           
            message = data.otp_details.Message
            await StoreAuthToken(data.responce.Token)
            await StoreTokenValidity(data.responce.TokenValidTill)
        }
        else{

            // if(data.otp_details.Message != null && data.otp_details.Message != ""){
            //     message = data.otp_details.Message

            // }
           
            // else{
            //     message = "Something went wrong";
            // }
            message = data?.otp_details?.Message || "Error : Facing Problem While Verifying Otp !"
        }
         
    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - VerifyLoginOtp  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Verifying Otp !"
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


export const GetVerifyLoginOtpRequestModel = () => {
    return {
        OTP : null, //OTP,
        mobileNo : null
     }
}


export default VerifyLoginOtp
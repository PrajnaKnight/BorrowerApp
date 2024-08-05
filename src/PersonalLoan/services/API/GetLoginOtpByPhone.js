import axios from 'axios';
import { API_RESPONSE_STATUS, STATUS, GET_LOGIN_OTP_BY_PHONE_NUMBER, GetHeader } from "./Constants";
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';

const GetLoginOtpByPhone = async (requestModel) => {

    let status, data, message;
    console.log("=========================== /GetOTPByPhoneNumber =============================")
    
    try {
    
        let header = await GetHeader()

        let response = await axios.post(`${GET_LOGIN_OTP_BY_PHONE_NUMBER}?LeadPhone=${requestModel.LeadPhone}`, null, {headers: header})
        data = response.data
        
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){
            message = data?.Message
        }
        else{
            message = data?.Message || "Error : Facing Problem While Requesting For Otp";
        }
         
    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetLoginOtpByPhone  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Requesting For Otp"
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


export const GetLoginTopByPhoneRequestModel = () => {
    return {
        LeadPhone : null, //Phone Number
     }
}

export const GetLoginTopByPhoneResponseModel = () => {
    return [
        {
          otp_generated: null,
          OTP: null
        }
      ]
}


export default GetLoginOtpByPhone
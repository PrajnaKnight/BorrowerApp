import axios from "axios";
import { API_RESPONSE_STATUS, GetHeader, STATUS } from "../../../Common/Utils/Constant";
import { PROFILE_INFO } from "./Constant";
import { GetBorrowerPhoneNumber } from "../../../PersonalLoan/services/LOCAL/AsyncStroage";


const GetProfileInfo = async() => {

    let status, message, data
    try{
        const header = await GetHeader()
        const mobileNo = await GetBorrowerPhoneNumber()

        const response = await axios.get(`${PROFILE_INFO}?mobileNo=${mobileNo}`, {headers : header})
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        if(status == STATUS.SUCCESS){
            data = response.data
        }
    }
    catch(error){
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetProfileInfo  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
        //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching User Profile"
        }
       

        message = errorMessage
        data = null
    }

    return API_RESPONSE_STATUS(status, data, message)
}


export default GetProfileInfo
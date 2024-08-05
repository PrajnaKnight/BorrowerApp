import axios from 'axios';
import { API_RESPONSE_STATUS, STATUS , GET_LOOK_UP, GetHeader} from "./Constants";
import { GetBorrowerPhoneNumber } from '../LOCAL/AsyncStroage';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';

const GetLookUp = async (requestModel) => {

    let status, data, message;
    console.log("------------------- GetLookUp -------------------------")

    try {
    
        const header = await GetHeader()
        const mobileNo = await GetBorrowerPhoneNumber()

        const url = `${GET_LOOK_UP}?mobileNo=${mobileNo}`

        console.log(mobileNo)
        console.log(header)
        
        let response = await axios.post(url, requestModel, {headers  : header})

       
        data = response.data

        console.log(data)
        
        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR

        if(status == STATUS.SUCCESS){
            message = data.Message
        }
        else{

            if(data.Message != null && data.Message != ""){
                message = data.Message
            }
            else{
                message = "Something went wrong";
            }
        }
         
    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetLookUp  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData
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
    console.log("------------------- GetLookUp -------------------------")

    return API_RESPONSE_STATUS(status, data, message)

    
}


export const GetLookUpRequest = () => {
    return {
        OTP : null, //OTP,
        mobileNo : null
     }
}


export default GetLookUp
import axios from 'axios';
import { API_RESPONSE_STATUS, STATUS , SAVE_PROCEED_STAGE, GetHeader} from "./Constants";
import { GetLeadId, GetUserAadhaar, GetUserPan } from '../LOCAL/AsyncStroage';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { SendGeoLocation } from './LocationApi';

const PostSaveProceedtage = async (stage) => {

    console.log("======================== PostSaveProceedTage ===========================")
    let status, data, message;

    try {


        const leadid = await GetLeadId()
        const header = await GetHeader()
        const aadhar = await GetUserAadhaar() || "null"
        const pan = await GetUserPan() || "null"
        const url = `${SAVE_PROCEED_STAGE}?leadid=${leadid}&Leadstage=${stage}&Pan=${pan}&Aadhar=${aadhar}`
        console.log(url)

        let response = await axios.post(url, null, {headers: header})

       
        data = response.data

        console.log(data)
        
        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR

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
            message = data.Message || Something_Went_Wrong
        }
         
    } catch (error) {
    
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - PostSaveProceedtage  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || Something_Went_Wrong
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

    if(status == STATUS.SUCCESS){
        console.log("========== fetching location =================")
        await SendGeoLocation(2)
        console.log("========== fetching location =================")
    }
    return API_RESPONSE_STATUS(status, data, message)

    
}


export default PostSaveProceedtage
import axios from "axios";
import { API_RESPONSE_STATUS, STATUS } from "../../../Common/Utils/Constant";
import { BUTTON_CONFIG } from "./Constant";


const GetButtonConfig = async() => {

    let status, message, data
    try{
        const response = await axios.get(BUTTON_CONFIG)
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        if(status == STATUS.SUCCESS){
            data = response.data
        }
    }
    catch(error){
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetButtonConfig  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
        //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Button Config"
        }
       

        message = errorMessage
        data = null
    }

    return API_RESPONSE_STATUS(status, data, message)
}


export default GetButtonConfig
import axios from "axios";

import { API_RESPONSE_STATUS, STATUS } from "../../../Common/Utils/Constant";
import { ORG_INFO } from "./Constant";


export const GetOrganization = async() => {

    let status, message, data
    try{
        const response = await axios.get(`${ORG_INFO}`)
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if(status == STATUS.SUCCESS){
            data = response.data
        }
    }
    catch(e){
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - Organization Info  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
        //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Organization Info"
        }
       

        message = errorMessage
        data = null
    }   

    return API_RESPONSE_STATUS(status, data, message)
}
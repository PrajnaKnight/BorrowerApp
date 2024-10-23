import axios from "axios";
import { DOCUMENT_DOWNLOAD } from "./Constant";
import { GetLeadId } from "../../../PersonalLoan/services/LOCAL/AsyncStroage";
import { API_RESPONSE_STATUS, STATUS } from "../../../Common/Utils/Constant";

const GetDocumentDownload = async() =>{

    let status, message, data
    try{
        const leadId = await GetLeadId()
        const response = await axios.get(`${DOCUMENT_DOWNLOAD}?leadId=55472677`)

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        if(status == STATUS.SUCCESS){
            data = response.data
        }
    }
    catch(error){
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetDocumentDownload  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
        //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Fetching Documents"
        }
       

        message = errorMessage
        data = null
    }

    return API_RESPONSE_STATUS(status, data, message)
}


export default GetDocumentDownload
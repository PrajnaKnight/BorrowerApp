import axios from 'axios';
import { SAVED_LEAD_STAGE, API_RESPONSE_STATUS, STATUS, GetHeader } from "./Constants";
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { GetLeadId } from '../LOCAL/AsyncStroage';
import { useDispatch, useSelector } from 'react-redux';


const SaveLeadStage = async (Leadstage) => {


    let status, data, message;

    try{
        const leadId = await GetLeadId()
        const header = await GetHeader()


        let response = await axios.post(`${SAVED_LEAD_STAGE}?leadid=${leadId}&Leadstage=${Leadstage}`, null, { headers: header })
        data = response.data

        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR

        if(status == STATUS.SUCCESS){
            message = data.Message
        }
        else{
            message = data.Message || Something_Went_Wrong
        }
    }
    catch (error) {
    

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SaveLeadStage  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || Something_Went_Wrong
        }

        message = errorMessage
        data = null
    }

    return API_RESPONSE_STATUS(status, data, message)

}

export default SaveLeadStage
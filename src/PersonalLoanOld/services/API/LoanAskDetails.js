import axios from 'axios';
import { API_RESPONSE_STATUS, STATUS, LOAD_ASK_DETAILS, LOAD_PURPOSE, GetHeader, GET_LOAD_ASK_DETAILS} from "./Constants";

import { GetLeadId, StoreLoanAskAmmount } from '../LOCAL/AsyncStroage';
import { da } from 'date-fns/locale';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { SendGeoLocation } from './LocationApi';

const LoanAskDetails = async (requestModel) => {

    let status, data, message;

    try {
    
        const header = await GetHeader()
        let response = await axios.post(LOAD_ASK_DETAILS, requestModel, {headers : header})
        // let response = await axios.post(LOAD_ASK_DETAILS, '{', {headers : header})
        
        data = response.data
        
        status = response.status == 200 && data.StatusCode == "2000" ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){

            await StoreLoanAskAmmount(requestModel.LoanAmount)
            message = data?.Message

        }
        else{

            // if(data.Message != null && data.Message != ""){
            //     message = data.Message
            // }
           
            // else{
            //     message = "Something went wrong";
            // }

            message = data?.Message || "Error : Facing Problem While Submitting Loan Ask Details"
        }
         
    } catch (error) {
    
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - LoanAskDetails  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Submitting Loan Ask Details"
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
        await SendGeoLocation(1)
        console.log("========== fetching location =================")
    }
    return API_RESPONSE_STATUS(status, data, message)

    
}


export const GetLoanAskDetails = async () => {

    let status, data, message;

    try {
    
        const header = await GetHeader()
        const LeadId = await GetLeadId()
        const url = `${GET_LOAD_ASK_DETAILS}?LeadID=${LeadId}`
        // const url = `${GET_LOAD_ASK_DETAILS}?LeadID=a`

        let response = await axios.get(url, {headers : header})
        
        data = response.data
        
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

            message = data?.Message || "Error : Facing Problem While Fetching Loan Ask Details"
        }
         
    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetLoanAskDetails  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Fetching Loan Ask Details"
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


export const LoanPurpose = async () => {

    let status, data, message;

    try {
    
        let response = await axios.get(LOAD_PURPOSE)
        
        data = response.data
        
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){
            message = data?.Message
        }
        else{

            message = data?.Message || "Error : Facing Problem While Fetching Loan Purpose";
            
        }
         
    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - LoanPurpose  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Fetching Loan Purpose"
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




export default LoanAskDetails



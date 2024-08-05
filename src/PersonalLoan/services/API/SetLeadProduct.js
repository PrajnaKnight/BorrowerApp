import axios from 'axios';
import { API_RESPONSE_STATUS, SET_LEAD_PRODUCT, STATUS, GetHeader } from "./Constants";

import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';

const SetLeadProduct = async (requestModel) => {

    let status, data, message;

    try {
        const header = await GetHeader()

        let response = await axios.post(`${SET_LEAD_PRODUCT}?LeadID=${requestModel.LeadId}&ProductID=${requestModel.ProductID}`, null, { headers: header })

        // let response = await axios.post(SET_LEAD_PRODUCT, requestModel, {headers:header})
        
        console.log(`${SET_LEAD_PRODUCT}?LeadID=${requestModel.LeadId}&ProductID=${requestModel.ProductID}`)

        data = response.data
        
        status = response.status == 200 && data.StatusCode == "2000" ? STATUS.SUCCESS : STATUS.ERROR
        
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
            message = data?.Message || "Error : Facing Problem While Submitting Product !"
        }
         
    } catch (error) {
    

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SetLeadProduct  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Submitting Product !"
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




export const CreateSetLeadProductModel = () => {
    return {
        LeadId: null, //"valid Lead Id",
        IsColending: false, //true|false,
        ColendingMode: "Mode1",// "Mode1|Mode2",
        IsBalanceTransfer: null,// "Yes | No"     
        ProductID:"312700"// "Valid Product Code",        
     }
}


export default SetLeadProduct

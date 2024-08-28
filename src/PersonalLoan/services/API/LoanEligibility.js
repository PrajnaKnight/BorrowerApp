import { GET_Quick_Eligibility_Detail_info, GetHeader, STATUS, API_RESPONSE_STATUS, GetBREEligibility, SaveBREEligibility } from "./Constants";
import { GetApplicantId, GetLeadId } from "../LOCAL/AsyncStroage";
import axios from "axios";

import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { SendGeoLocation } from "./LocationApi";


const GetQuickEligibilityDetailInfo = async () => {

    let status, data, message;

    try {


        const header = await GetHeader()
        console.log(header)

        const ApplicationId = await GetApplicantId()
        const url = `${GET_Quick_Eligibility_Detail_info}?ApplicationId=${ApplicationId}&ProductId=312700`     
        console.log(url)

        let response = await axios.post(url, null, {headers : header})

        console.log(response.data)
        data = response.data[0]

     
        
        status = response.status == 200 && (data.StatusCode == "200" || data.StatusCode == "201") ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){
            message = data.Message
        }
        else{

            if(data.StatusCode == "202" || data.StatusCode == "203"){
                message = "NOT ELIGIBLE"
            }
            
            else{
                message = data?.Message || "Error : Facing Problem While Getting Quick Eligibility";
            }
        }
         
    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetQuickEligibilityDetailInfo  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Getting Quick Eligibility"
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



export const GetBreEligibility = async () => {

    let status, data, message;

    try {

        console.log("==================== Loan Eligibility Detail Info =======================")

        const ApplicationId = await GetApplicantId()
        const LeadId = await GetLeadId()
        const header = await GetHeader()

        let response = await axios.get(`${GetBREEligibility}?LeadID=${LeadId}&ApplicationID=${ApplicationId}`, {headers : header})
        
        data = response.data

        console.log(data)
        
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){
            message = data.Message
        }
        else{

            message = data?.Message || "Error : Facing Problem While Getting Bre Eligibility";
            
        }
         
    } catch (error) {
    

        if(error?.response?.status == 404){
            status = STATUS.SUCCESS
            data = null
        }
        else{
            const errorresponseData = error?.response?.data?.Message;
            console.error('Error - GetBreEligibility  - response data : ', errorresponseData);
    
            status = STATUS.ERROR
            let errorMessage = error.message
    
            if(errorMessage != Network_Error){
               errorMessage = errorresponseData || "Error : Facing Problem While Getting Bre Eligibility"
            }
    
            message = errorMessage
            data = null
        }
        


    }

    return API_RESPONSE_STATUS(status, data, message)

    
}



export const SendSaveBREEligibilityInfo = async (requestModel) => {

    let status, data, message;

    try {

        console.log("==================== Loan Eligibility =======================")
        console.log(requestModel)
        const header = await GetHeader()
        console.log(header)
        const leadId = await GetLeadId()
        const ApplicationId = await GetApplicantId()

        const url = `${SaveBREEligibility}?leadid=${leadId}&application=${ApplicationId}&Tenure=${requestModel.Tenure}&RateOfInterest=${requestModel.RateOfInterest}&Amount=${requestModel.Amount}&EMI=${requestModel.EMI}&Leadstage=${requestModel.Leadstage}`     
        console.log(url)

        let response = await axios.post(url, null, {headers : header})

        console.log(response.data)
        data = response.data

     
        
        status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR
        
        if(status == STATUS.SUCCESS){
            message = data.Message
        }
        else{
            message =  data?.Message || "Error : Facing Problem While Saving Bre Eligibility Info";
        }
         
    } catch (error) {

        
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SendSaveBREEligibilityInfo  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Saving Bre Eligibility Info";
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
        await SendGeoLocation(7)
        console.log("========== fetching location =================")
    }
    return API_RESPONSE_STATUS(status, data, message)

    
}



export const LoanModule = () => {
    return {
        "Leadid": null,
        "ApplicationID": null,
        "Tenure": null,
        "InterestRate": null,
        "EMIAmount": null,
        "LoanAmount": null
      }
}

export default GetQuickEligibilityDetailInfo;
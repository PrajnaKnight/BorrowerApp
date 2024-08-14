import axios from 'axios';
import { API_RESPONSE_STATUS, STATUS, CREATE_BORROWER_LEAD, GET_MARITAL_STATUS, GetHeader, GET_LEADS_DATA } from "./Constants";
import { GetBorrowerPhoneNumber, GetLeadId } from '../LOCAL/AsyncStroage';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { SendGeoLocation } from './LocationApi';


const CreateBorrowerLead = async (requestModel, fromDocument = false, stage = 0) => {

    let status, data, message;

    try {

        const header = await GetHeader()
        let response = await axios.post(CREATE_BORROWER_LEAD, requestModel, { headers: header })
        // let response = await axios.post(CREATE_BORROWER_LEAD, '{', { headers: header })

        data = response.data

        if(fromDocument){
            status = response.status == 200  ? STATUS.SUCCESS : STATUS.ERROR

        }
        else{
            status = response.status == 200 && data.StatusCode == "2000" ? STATUS.SUCCESS : STATUS.ERROR

        }
        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            // if (data.Message != null && data.Message != "") {
            //     message = data.Message
            // }
           
            // else {
            //     message = "Something went wrong";
            // }
            message = data?.Message || "Error : Facing Problem While Creating Borrower Lead Data !"
        }

    } catch (error) {

         const errorresponseData = error?.response?.data?.Message;
         console.error('Error - CreateBorrowerLead - response data : ', errorresponseData);

         status = STATUS.ERROR
         let errorMessage = error.message

         if(errorMessage != Network_Error){
            // errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Creating Borrower Lead Data !"
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
        await SendGeoLocation(stage)
        console.log("========== fetching location =================")
    }
    return API_RESPONSE_STATUS(status, data, message)


}



export const GetPersonalData = async () => {

    let status, data, message;

    try {

        const header = await GetHeader()
        const LeadId = await GetLeadId()
        const url = `${GET_LEADS_DATA}?LeadID=${LeadId}`

        let response = await axios.get(url, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {

            message = response.data.Message

        }
        else {

            // if (data.Message != null && data.Message != "") {
            //     message = data.Message
            // }
           
            // else {
            //     message = "Something went wrong";
            // }
            message = data.Message || "Error : Facing Problem While Fetching Personal Data !"
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
         console.error('Error - GetPersonalData - response data : ', errorresponseData);

         status = STATUS.ERROR
         let errorMessage = error.message

         if(errorMessage != Network_Error){
            // errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Personal Data !"

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




export const GetMaritalStatus = async () => {

    let status, data, message;

    try {

        let response = await axios.get(GET_MARITAL_STATUS)

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            // if (data.Message != null && data.Message != "") {
            //     message = data.Message
            // }
            
            // else {
            //     message = "Something went wrong";
            // }
            message = data.Message || "Error : Facing Problem While Fetching Marital Status Data !"

        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
         console.error('Error - GetMaritalStatus - response data : ', errorresponseData);

         status = STATUS.ERROR
         let errorMessage = error.message

         if(errorMessage != Network_Error){
            // errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Marital Status Data !"
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


export const PrimaryInfoRequestModel = () => {
    return {
        LeadPhone: null,
        LeadName: null, //Data
        LeadEmail: null, //abc@gmail.com"
        FatherName: null, //string",
        LeadMaritalStatus: null, //Divorced|Married|Undisclosed|UnMarried|Unmarried and residing with family |Married and residing with family | Widow and residing without family | Widow and residing with family | Single|Widow ",
        LeadDOB: new Date(), //dd/mm/yyyy",
        LeadGender: null, //Male|Female|TransGender",


        LeadNameError: null,
        LeadEmailError: null,
        FatherNameError: null,
        LeadMaritalStatusError: null,
        LeadDOBError: null,
        LeadGenderError: null,
        LeadStage: null
    }
}



export const CreateBorrowerLeadFromDocuments = async (model) => {

    let status, data, message;



    const mobileNo = await GetBorrowerPhoneNumber()

    let requestModel = {
        LeadDOB: null,
        LeadName: null,
        FatherName: null,
        LeadEmail: null,
        LeadGender: null,
        LeadPhone: mobileNo,
    }


    for (const key in model) {
        const data = model[key]
        if (data == null) {
            continue
        }

        if (requestModel.LeadDOB == null || requestModel.LeadDOB == "") {
            requestModel = { ...requestModel, LeadDOB: data.LeadDOB }
        }
        if (requestModel.LeadName == null || requestModel.LeadName == "") {
            requestModel = { ...requestModel, LeadName: data.LeadName }
        }
        if (requestModel.FatherName == null || requestModel.FatherName == "") {
            requestModel = { ...requestModel, FatherName: data.FatherName }
        }
        if (requestModel.LeadEmail == null || requestModel.LeadEmail == "") {
            requestModel = { ...requestModel, LeadEmail: data.LeadEmail }
        }
        if (requestModel.LeadGender == null || requestModel.LeadGender == "") {
            requestModel = { ...requestModel, LeadGender: data.LeadGender }
        }

    }



    return await CreateBorrowerLead(requestModel, true)


}




export default CreateBorrowerLead

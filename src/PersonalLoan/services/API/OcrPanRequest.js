import { GetLeadId } from "../LOCAL/AsyncStroage";
import { OCR_PAN_REQUEST, GetHeader, STATUS, API_RESPONSE_STATUS, GET_PAN_COMPERHENSIVE_DATA, GET_CKYC_ID, GET_CKYC_Data } from "./Constants";
import axios from "axios";

import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';



const OcrPanRequest = async () => {

    let status, data, message;

    try {
        const header = await GetHeader()

        const LeadId = await GetLeadId()

        const url = `${OCR_PAN_REQUEST}?Leadid=${LeadId}`

        let response = await axios.post(url, null, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data?.Message
        }
        else {

            // if (data?.Message != null && data?.Message != "") {
            //     message = data?.Message
            // }
            
            // else {
            //     message = "Something went wrong";
            // }
            message = data?.Message || "Error : Facing Problem While Requesting Pan Ocr !"
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - OcrPanRequest  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Requesting Pan Ocr !"
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


export const GetPanComprehensiveData = async (PanNumber) => {

    let status, data, message;

    try {
        const header = await GetHeader()

        const LeadId = await GetLeadId()

        const url = `${GET_PAN_COMPERHENSIVE_DATA}?LeadID=${LeadId}&PanNumber=${PanNumber}`

        let response = await axios.post(url, null, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR


       
        if (status == STATUS.SUCCESS) {
            message = data?.message
        }
        else{
    
            // if (data?.message != null && data?.message != "") {
            //     message = data?.message;
            // }
           
            // else {
            //     message = "Something went wrong";
            // }
            message = data?.Message || "Error : Facing Problem While Fetching Pan Comprehensive Data !"
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetPanComprehensiveData  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Fetching Pan Comprehensive Data !"
        }

        message = errorMessage
        data = null

        // console.log("============== GetPanComprehensiveData ===============")

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



export const GetCKYCID = async (LeadPan) => {

    let status, data, message;

    try {
        const header = await GetHeader()

        const LeadId = await GetLeadId()

        const url = `${GET_CKYC_ID}?LeadId=${LeadId}&LeadPan=${LeadPan}`

        let response = await axios.post(url, null, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        

        if (status == STATUS.SUCCESS) {
            message = data?.Message

        }
        
        else {
            // if (data?.Message != null && data?.Message != "") {
            //     message = data?.Message;
            // }
           
            // else {
            //     message = "Something went wrong";
            // }
            message = data?.Message || "Error : Facing Problem While Fetching CKYC ID !"
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetCKYCID  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Fetching CKYC ID !"
        }

        message = errorMessage
        data = null

        // console.log("============== GetCKYCID ===============")

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
export const GetCKYCData = async (CKYCId, LeadDOB) => {

    let status, data, message;

    try {
        const header = await GetHeader()

        const LeadId = await GetLeadId()

        const url = `${GET_CKYC_Data}?LeadId=${LeadId}&CKYCId=${CKYCId}&LeadDOB=${LeadDOB}`
        console.log("ckyc data url", url)
        let response = await axios.post(url, null, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        

        if (status == STATUS.SUCCESS) {
            message = data?.Message || data?.message
        }
        
        else {

            // if ((data?.Message != null && data?.Message != "") || (data?.message != null && data?.message != "") ) {
            //     message = data?.Message || data?.message
            // }
           
            // else {
            //     message = "Something went wrong";
            // }
            message = data?.Message || "Error : Facing Problem While Fetching CKYC DATA !" 
        }


    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetCKYCData  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Fetching CKYC DATA !"
        }

        message = errorMessage
        data = null

        // console.log("============== GetCKYCData ===============")

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





export const SaveAadhaarKycResult = (kycResult) => {

    const aadhaarKyc = kycResult.ResidentDetails

    const dob = aadhaarKyc.DateOfBirth
    const name = aadhaarKyc.ResidentName
    const father = null
    let gender = null

    if (aadhaarKyc.Gender == "M") {
        gender = "Male"
    }
    else if (aadhaar.Gender == "F") {
        gender = "Female"
    }

    const emailId = null
   


    return {
        "LeadName": name,
        "FatherName": father,
        "LeadDOB": dob,
        "LeadGender": gender,
        "LeadEmail": emailId,
    }


}


export const SavePanKycResult = (kycResult) => {
    const panKyc = kycResult

    const dob = panKyc.DOB
    const name = panKyc.FullName
    const father = panKyc.FatherFirstName
    let gender = null

    if (panKyc.Gender == "MALE") {
        gender = "Male"
    }
    else if (panKyc.Gender == "FEMALE") {
        gender = "Female"
    }

    const emailId = panKyc.Email



    return {
        "LeadName": name,
        "FatherName": father,
        "LeadDOB": dob,
        "LeadGender": gender,
        "LeadEmail": emailId,
    }


}





export default OcrPanRequest
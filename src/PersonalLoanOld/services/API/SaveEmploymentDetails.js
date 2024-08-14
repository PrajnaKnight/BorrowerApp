
import axios from 'axios';
import { API_RESPONSE_STATUS, STATUS, SAVE_EMPLOYEMENT_DETAILS, GET_EMPLOYEMENT_TYPE, GET_OCCUPATION_TYPE, GET_EMPLOYEMENT_DETAILS, GetHeader, GET_COMPANY_DETAILS } from "./Constants";
import { GetLeadId } from '../LOCAL/AsyncStroage';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { SendGeoLocation } from './LocationApi';


const SubmitEmploymentDetails = async (requestModel) => {

    let status, data, message;

    try {

        const header = await GetHeader()

        let response = await axios.post(SAVE_EMPLOYEMENT_DETAILS, requestModel, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = response.data.Message
        }
        else {
            message = data?.Message || "Error : Facing Problem While Submitting Employment Details !";
        }

    } catch (error) {

        
        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SubmitEmploymentDetails  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Submitting Employment Details !"
        }

        message = errorMessage
        data = null

        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if (errorMessage != Network_Error) {
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }
    if(status == STATUS.SUCCESS){
        console.log("========== fetching location =================")
        await SendGeoLocation(5)
        console.log("========== fetching location =================")
    }
    return API_RESPONSE_STATUS(status, data, message)

}



export const GetEmploymentType = async () => {

    let status, data, message;

    try {

        let response = await axios.get(GET_EMPLOYEMENT_TYPE)

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = response.data.Message
        }
        else {
            message = data?.Message || "Error : Facing Problem While Fetching Employment Types !";
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetEmploymentType  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData ||  "Error : Facing Problem While Fetching Employment Types !"
        }

        message = errorMessage
        data = null

        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if (errorMessage != Network_Error) {
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    return API_RESPONSE_STATUS(status, data, message)


}


export const GetOccupationType = async (employmentId) => {

    let status, data, message;

    try {

        let response = await axios.get(`${GET_OCCUPATION_TYPE}?EmploymentTypeID=${employmentId}`)

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = response.data.Message
        }
        else {
            message = data?.Message ||  "Error : Facing Problem While Fetching Occupation Types !";
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetOccupationType  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Fetching Occupation Types !"
        }

        message = errorMessage
        data = null

        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if (errorMessage != Network_Error) {
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    return API_RESPONSE_STATUS(status, data, message)

}


export const GetCompanyList = async (query) => {
    let status, data, message;

    try {

        const header = await GetHeader()

       
        let response = await axios.get(`${GET_COMPANY_DETAILS}?searchQuery=${query}`, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = response.data.Message
        }
        else {
            message = data?.Message || "Error : Facing Problem While Fetching Company List !";
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetCompanyList  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData ||  "Error : Facing Problem While Fetching Company List !"
        }

        message = errorMessage
        data = null

        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if (errorMessage != Network_Error) {
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    return API_RESPONSE_STATUS(status, data, message)

}



export const GetEmploymentDetails = async () => {

    let status, data, message;
    console.log("============ employment data  1 ===============")

    try {

        const header = await GetHeader()
        console.log("header", header)

        const LeadId = await GetLeadId()
        console.log(LeadId)
        const url = `${GET_EMPLOYEMENT_DETAILS}?LeadID=${LeadId}`

        let response = await axios.get(url, { headers: header })


        data = response.data
        console.log(data)
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
            message = data?.Message ||  "Error : Facing Problem While Fetching Employment Details !"
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetEmploymentDetails  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
           errorMessage = errorresponseData || "Error : Facing Problem While Fetching Employment Details !"
        }

        message = errorMessage
        data = null

        // console.log(error)
        // status = STATUS.ERROR
        // let errorMessage = error.message
        // if (errorMessage != Network_Error) {
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    return API_RESPONSE_STATUS(status, data, message)


}


export const EmploymentDetailsModel = () => {
    return {
        LeadId: null,
        ApplicantId: 0, // "Mandatory When Applicant is CoApplicant",
        EmploymentCategory: null, // "Salaried|Self Employed Professional|Self Employed",
        EmploymentType: null, // "Permanent|Business",

        EmploymentCategoryError: null,
        EmploymentTypeError: null,
        LeadStage: null,
        ...EmploymentData
    }
}

export const EmploymentData = () => {
    return {
        EmployerType: "102", // "100|101|102|103|104|105|106|107|108|109",
        CompanyName: null, // "string",
        Designation: null, // "string",
        EmpAddress: null, // "string",
        EmpCity: null, // "Valid CityCode",
        EmpState: null, // "DL|BR|AR|AP|JK|KA|MH|NL|PY|RJ|AN|AS|CH|CT|DN|DD|GA|GJ|HR|HP|JH|KL|LD|MP|MN|ML|MZ|OR|PB|SK|TN|TG|TR|UP|UT|WB",
        EmpCountry: null, // "IN|OTR",
        EmpZipCode: null, // "string",
        JoiningDate: new Date(), //"MM/dd/yyyy"

        Experience: null,
        OfficePhoneNo: null,
        WorkEmail: null,
        AnnualCTC: 0,
        OfficeLandmark: null,

        ExperienceError: null,
        CompanyNameError: null,
        DesignationError: null,
        JoiningDateError: null,
        OfficePhoneNoError: null,
        WorkEmailError: null,
        AnnualCTCError: null,
        ZipCodeError: null,
        CityError: null,
        StateError: null,
        AddressLine1Error: null,
    }
}

export default SubmitEmploymentDetails;
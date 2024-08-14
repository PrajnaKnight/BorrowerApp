
import axios from 'axios';
import { API_RESPONSE_STATUS, STATUS, BORROWER_ADDRESS, GET_CITY_AND_STATE, GetHeader, GET_BORROWER_ADDRESS } from "./Constants";
import { GetLeadId } from '../LOCAL/AsyncStroage';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { SendGeoLocation } from './LocationApi';


const SubmitAddress = async (requestModel, fromDocument = false) => {

    let status, data, message;

    try {


        let data = [
            ...requestModel
        ]
        
        let newData = data.map(obj => {
            // Create a new object without the "Address" key
            const { Address, ...rest } = obj;
            return rest;
        });
        
        console.log("====================== final address request ==================================")
        console.log(newData);

        const header = await GetHeader()
        let response = await axios.post(BORROWER_ADDRESS, newData, { headers: header })
        // let response = await axios.post(BORROWER_ADDRESS, [], { headers: header })

        data = response.data
        console.log(data)

        if(fromDocument){
            status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR
        }
        else{
            status = response.status == 200 && data.StatusCode == "2000" ? STATUS.SUCCESS : STATUS.ERROR
        }

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            // message = data.Message ||  "Something went wrong";
            message = data.Message || "Error : Facing Problem While Posting Address Data !"
        }
        console.log("====================== final address request ==================================")


    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SubmitAddress  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
        //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Posting Address Data !"
        }
       

        message = errorMessage
        data = null

        // console.log("=============== SubmitAddress {inside catch block} ====================")
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
        await SendGeoLocation(4)
        console.log("========== fetching location =================")
    }
    return API_RESPONSE_STATUS(status, data, message)


}



export const GetCityAndState = async (pincode) => {

    let status, data, message;

    try {

        const header = await GetHeader()

        let response = await axios.get(`${GET_CITY_AND_STATE}?PINcode=${pincode}`, { headers: header })

        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {
            message = data.Message
        }
        else {
            // message = "Error : Facing Problem While Fetching City And State data !";
            message = data.Message ||  "Error : Facing Problem While Fetching City And State data !";
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetCityAndState  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching City And State data !"
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




export const GetBorrowerAddress = async () => {

    let status, data, message;

    console.log("====================== Fetch Address Details ===========================")
    try {

        

        const header = await GetHeader()
        const LeadId = await GetLeadId()
        const url = `${GET_BORROWER_ADDRESS}?LeadID=${LeadId}`
        // const url = `${GET_BORROWER_ADDRESS}?LeadID=a`

        let response = await axios.get(url, { headers: header })

        data = response.data
        console.log("Response status ",response.status)
        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status == STATUS.SUCCESS) {

            message = response.data.Message

        }
        else {


            message = data.Message || "Error : Facing Problem While Fetching Borrower Address !";
            
        }

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetBorrowerAddress  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
            // errorMessage = errorresponseData
           errorMessage = errorresponseData || "Error : Facing Problem While Fetching Borrower Address !"
        }

        message = errorMessage
        data = null

        // console.log("=============== GetBorrowerAddress {inside catch block} ====================")

        // status = STATUS.ERROR

        // let errorMessage = error.message
        // if(errorMessage != Network_Error){
        //     errorMessage = Something_Went_Wrong
        // }
        // message = errorMessage
        // data = null
    }

    console.log("====================== Fetch Address Details ===========================")

    return API_RESPONSE_STATUS(status, data, message)


}


export const SubmitAddressFromDocuments = async (model, id) => {

    const leadId = await GetLeadId()

    let allAddress = []
    let requestModel = {
        Id: id,
        LeadId: leadId,
        ApplicationId: 0,
        AddressType: "Mailing|Registered",
        AddressLine1: null,
        AddressLine2: null,
        PostalCode: null,
        City: null,
        State: null,
        Leadstage: 0
    }

    for (const key in model) {
        const data = model[key]
        if (data == null) {
            continue
        }

        if (requestModel.AddressLine1 == null || requestModel.AddressLine1 == "") {
            requestModel = { ...requestModel, AddressLine1: data.LeadAddressLine1 }
        }
        if (requestModel.AddressLine2 == null || requestModel.AddressLine2 == "") {
            requestModel = { ...requestModel, AddressLine2: data.LeadAddressLine2 }
        }
        if (requestModel.PostalCode == null || requestModel.PostalCode == "") {
            requestModel = { ...requestModel, PostalCode: data.LeadPostalCode }
        }
        if (requestModel.City == null || requestModel.City == "") {
            requestModel = { ...requestModel, City: data.LeadCity }
        }
        if (requestModel.State == null || requestModel.State == "") {
            requestModel = { ...requestModel, State: data.LeadState }
        }

    }


    if(requestModel.AddressLine1 == null || requestModel.AddressLine1 == ""){
        return API_RESPONSE_STATUS(STATUS.SUCCESS)
    }


    allAddress.push(requestModel)

    

    return await SubmitAddress(allAddress, true)

}



export const sampleAddress = {
    Id: 0,
    LeadId: null,
    ApplicationId: 0,
    AddressType: "Mailing|Registered",
    AddressLine1: null,
    AddressLine2: null,
    PostalCode: null,
    City: null,
    State: null,
    District: null,
    Country: null,
    ResidingSinceDate: null,
    PreferredFlag: null,
    PostalCodeError: null,
    CityError: null,
    StateError: null,
    AddressLine1Error: null,
    Leadstage: null,
    landmark : null
}


export default SubmitAddress;

import axios from 'axios';
import { UploadDocument, STATUS, API_RESPONSE_STATUS, GetHeader, GetUploadDocument, GET_DOC_TYPE, GET_DOC_SUB_SET_TYPE, GetUploadOtherDocument, GetDocTypeMaster, DELETE_UPLOAD_FILES } from "./Constants";
import { GetLeadId } from '../LOCAL/AsyncStroage';
import { Network_Error, Something_Went_Wrong } from '../Utils/Constants';
import { Platform } from 'react-native';



const UploadFile = async (document, DocCode,  Password = null, ApplicantType = "Applicant",) => {
    let status, data, message;

 

    

    const LeadId =  await GetLeadId()


    try {
        console.log("================================ Upload Files =============================")
        console.log("docCode : "+DocCode)
        console.log(document)
        console.log("leadId : "+LeadId)
        console.log("ApplicantType : "+ApplicantType)

        const formData = new FormData();
        formData.append('DocCode', DocCode);
        formData.append('leadId', LeadId);
        formData.append('contentType', document.name.split('.').pop())
        formData.append('ApplicantType', ApplicantType); // or 'CoApplicant' as needed
        formData.append('Upload', document);
        formData.append('Password', Password || '')

        const header = await GetHeader()
            console.log(header)
            const response = await axios.post(UploadDocument, formData, {
                headers: {
                    ...header,
                    'Content-Type': 'multipart/form-data',
                },
            });


            data = response.data
            status = response.status == 200 && data.files[0].StatusCode == "2000" ? STATUS.SUCCESS : STATUS.ERROR

        if(status == STATUS.SUCCESS){
                message = data.files[0].Message
            }
        else{
                // if(data.files[0].Message != null && data.files[0].Message != ""){
                //     message = data.files[0].Message
                // }

                // else{
                //     message = Something_Went_Wrong;
                // }
                message = data?.files[0].Message || "Error : Facing Problem While Uploading File !"
            }


    }
    catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - UploadFiles  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Uploading File !"
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




export const GetUploadFiles = async () => {

    let status, data, message;

    try {


        const header = await GetHeader()

        const LeadId = await GetLeadId()

        let response = await axios.get(`${GetUploadDocument}?LeadID=${LeadId}`,  {headers  : header})
        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if(status != STATUS.SUCCESS){
            // message = data.Message || Something_Went_Wrong;
            message = data?.Message || "Error : Facing Problem While Fetching Uploaded File !";
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetUploadFiles  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Uploaded File !"
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


export const GetUploadOtherFiles = async () => {

    let status, data, message;

    try {


        const header =  await GetHeader()

        const LeadId =  await GetLeadId()



        let response = await axios.get(`${GetUploadOtherDocument}?LeadID=${LeadId}`,  {headers  : header})
        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if(status != STATUS.SUCCESS){
            // message = data.Message || Something_Went_Wrong;
            message = data?.Message || "Error : Facing Problem While Fetching Uploaded File !";
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetUploadFiles  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Uploaded File !"
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

export const DeleteUploadFiles = async (docType) => {

    let status, data, message;

    try {


        const header =  await GetHeader()

        const LeadId =  await GetLeadId()



        let response = await axios.post(`${DELETE_UPLOAD_FILES}?LeadID=${LeadId}&DocType=${docType}`,  null, {headers  : header})
        data = response.data

        status = response.status == 200 && data.StatusCode == "2000" ? STATUS.SUCCESS : STATUS.ERROR

        if(status != STATUS.SUCCESS){
            // message = data.Message || Something_Went_Wrong;
            message = data?.Message || "Error : Facing Problem While Deleting File !";
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - DeleteUploadFiles  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Deleting File !"
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


export const GetDocType = async () => {

    let status, data, message;

    try {



        let response = await axios.get(`${GET_DOC_TYPE}`)
        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if(status != STATUS.SUCCESS){
            // message = data.Message || Something_Went_Wrong;
            message = data?.Message || "Error : Facing Problem While Fetching Doc Type !";
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetDocType  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Doc Type !"
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


export const GetDocTypeMasterOption = async () => {
    


    let status, data, message;

    try {


        const header =  await GetHeader()

        const LeadId =  await GetLeadId()

        let response = await axios.get(`${GetDocTypeMaster}?LeadID=${LeadId}`,  {headers  : header})
        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if(status != STATUS.SUCCESS){
            // message = data.Message || Something_Went_Wrong;
            message = data?.Message || "Error : Facing Problem While Fetching Required Docs List!";
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetUploadFiles  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if(errorMessage != Network_Error){
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching Required Docs List!"
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


export const GetDocSubType = async (DocType) => {

    let status, data, message;

    try {


        const header = await GetHeader()


        let response = await axios.get(`${GET_DOC_SUB_SET_TYPE}?DocType=${DocType}`, { headers: header })
        data = response.data

        status = response.status == 200 ? STATUS.SUCCESS : STATUS.ERROR

        if (status != STATUS.SUCCESS) {
            // message = data.Message || Something_Went_Wrong;
            message = data?.Message || "Error : Facing Problem While Fetching DocSub Type !"
        }

    } catch (error) {


        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - GetDocSubType  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            //    errorMessage = errorresponseData
            errorMessage = errorresponseData || "Error : Facing Problem While Fetching DocSub Type !"
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



export const documentModel = {
    DocTypes: [],
    DocSubType: [],
    SelectedDocType: null,
    SelectedDocSubType: null,
    ShowPassword: false,
    Password: null,
    UploadedFile: null,
    EnablePassword: false,
}

export default UploadFile;
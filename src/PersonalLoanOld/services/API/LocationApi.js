
import Geolocation from 'react-native-geolocation-service';
import { API_RESPONSE_STATUS, GetHeader, STATUS, SUBMIT_LOCATION } from "./Constants";
import { GetLeadId } from "../LOCAL/AsyncStroage";
import { Network_Error } from "../Utils/Constants";
import axios from "axios";
import publicIP from 'react-native-public-ip';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';


let PermissionsAndroid;
if (Platform.OS === 'android') {
    PermissionsAndroid = require('react-native').PermissionsAndroid;
}

const GetLocationModel = async (leadStage) => {
    const LeadId = await GetLeadId()

    let locationInfo = null
    try {
        locationInfo = await GetLocation()
    }
    catch {
        return null
    }

    let ipAdderess = null
    try {
        ipAdderess = await publicIP()
    }
    catch {
        return null
    }

    const deviceId = await DeviceInfo.getUniqueId();
    console.log(deviceId)

    return {
        LeadId: LeadId,
        IP: `${ipAdderess}`,
        Latitude: locationInfo?.coords?.latitude,
        Longitude: locationInfo?.coords?.longitude,
        CreateDate: null,
        DeviceId: deviceId,
        Altitude: locationInfo?.coords?.altitude,
        Accuracy: locationInfo?.coords?.accuracy,
        Speed: locationInfo?.coords?.speed,
        LeadStage: leadStage
    }
}

export const SendGeoLocation = async (leadStage) => {
    let status, data, message;
    console.log("============= Location Submitted =======================")

    try {

        const header = await GetHeader()
        const requestModel = await GetLocationModel(leadStage)

        console.log(header)
        console.log(requestModel)
        let response = await axios.post(SUBMIT_LOCATION, requestModel, { headers: header })


        console.log(response.data)

    } catch (error) {

        const errorresponseData = error?.response?.data?.Message;
        console.error('Error - SubmitGeoLocation  - response data : ', errorresponseData);

        status = STATUS.ERROR
        let errorMessage = error.message

        if (errorMessage != Network_Error) {
            errorMessage = errorresponseData || "Error : Facing Problem While Saving GeoLocation Info";
        }

        message = errorMessage
        data = null

    }
    console.log("============= Location Submitted =======================")

    return API_RESPONSE_STATUS(status, data, message)

}


const fetchLocationFromWeb = () =>{
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
}

export const fetchCameraFromWeb = () =>{
    return new Promise((resolve, reject) => {

        navigator.mediaDevices.getUserMedia({ video: true })
        .then((permissionObj) => {
            console.log(permissionObj)

            resolve(permissionObj);
        })
        .catch((error) => {
            console.error(error)
            reject('Got error :', error);
        })

        
      });
}
export const RequestLocationPermission = async () => {

    try {

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid?.request(
                PermissionsAndroid?.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'Please Provide Location Permission ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );

            if (granted === PermissionsAndroid?.RESULTS.GRANTED) {


            }
        }
        else if (Platform.OS === 'web') {

            if ('geolocation' in navigator) {
                try{
                    await fetchLocationFromWeb()
                    const location = await getCurrentPosition()
                    console.log(location)
                }
                catch(e){
                    console.log(e)
                }
            } else {
                setError('Geolocation is not supported by this browser.');
            }

        }

    } catch (err) {
      console.log(err);    
    }
};


function getCurrentPosition(options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }) {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            resolve,
            reject,
            options
        )
    });
}

const GetLocation = async () => {
    try {

        const position = await getCurrentPosition();
        return position
    } catch (error) {
        console.log(error.code, error.message);
    }
    return null
}
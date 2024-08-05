import { Platform } from 'react-native';
import { API_RESPONSE_STATUS, STATUS } from '../API/Constants';
import * as FileSystem from 'expo-file-system';


export const isValidEmail = (value, title = "Email") => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value == null || value == '') {
        return `Please Provide ${title}`
    }

    return !regex.test(value) ? `Please Provide Valid ${title}` : null
}



export const isValidPhoneNumber = (value, title = "Phone Number") => {
    const regex = /^[6-9]\d{9}$/;
    if (value == null || value == '') {
        return `Please Provide ${title}`
    }
    return !regex.test(value) ? `Please Provide Valid ${title}` : null
}

export const isValidOtp = (value, title = "OTP") => {
    let otp = value.join("")
    const regex = /^\d{6}$/;
    if (otp == '') {
        return `Please Provide ${title}`
    }
    return !regex.test(otp) ? `Please Provide Valid ${title}` : null
}

export const isValidPostalCodeNumber = (value, title = "Postal Code") => {
    const regex = /^\d{6}$/;
    if (value == null || value == '') {
        return `Please Provide ${title}`
    }
    return !regex.test(value) ? `Please Provide Valid ${title}` : null
}

export const isValidField = (value, title = "Value") => {
    if (value == null || value == '') {
        return `Please Provide ${title}`
    }
    return null
}


export const isValidNumberOnlyField = (value, title = "Value") => {
    if (value == null || value == 0) {
        return `Please Provide ${title}`;
    }
    return !(/^\d+$/.test(value)) ? `Please Provide Valid ${title}` : null;
}

export const isValidNumberOnlyFieldWithZero = (value, title = "Value") => {
    if (value == null) {
        return `Please Provide ${title}`;
    }
    return !(/^\d+$/.test(value)) ? `Please Provide Valid ${title}` : null;
}
export const isValidPan = (value, title = "Pan") => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (value == null || value == '') {
        return `Please Provide ${title}`;
    }
    return !(regex.test(value)) ? `Please Provide Valid ${title}` : null;
}

export const isValidAadhaar = (value, title) => {

    const regex = /^\d{12}$/;
    if (value == null || value == '') {
        return `Please Provide ${title}`;
    }
    return !regex.test(value) ? "Please Enter Valid Aadhaar Number" : null
}

export const isValidIfsc = (value, title = "IFSC") => {
    if (value == null || value == '') {
        return `Please Provide ${title}`;
    }
    let ifsc = value.toUpperCase()
    let regex = new RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/);
    return !regex.test(ifsc) ? `Please Enter Valid ${title}` : null
};


export const isThisIsFutureTime = (providedTimeString) => {
    if (providedTimeString == null) {
        return false
    }

    console.log("Provided Time String ", providedTimeString)
    console.log("Todays Date", new Date())
    // Convert the provided time string to a Date object
    const providedTime = new Date(providedTimeString);

    // Get the current time
    const currentTime = new Date();
    console.log("Provided Time String ", providedTime)
    console.log("Todays Date", currentTime)
    return providedTime > currentTime
}


export function formatDate(dateString) {
    if (dateString.includes("T")) {
        return dateString;
    }

    // Check if the date string contains a "/" character
    if (dateString.includes("/")) {
        // If "/" is found, replace it with "-"
        dateString = dateString.replace(/\//g, "-");
    }

    const dateTimeParts = dateString.split(" ");
    const dateParts = dateTimeParts[0].split("-");

    if (dateParts.length === 1) {
        const year = dateParts[0];
        if (year.length !== 4) {
            return dateString;
        }
        return `${year}-01-01`;
    } else if (dateParts.length === 2) {
        const [month, year] = dateParts;
        if (year.length !== 4) {
            return dateString;
        }
        return `${year}-${month.padStart(2, '0')}-01`;
    } else if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        if (day.length === 4 && year.length === 2) {
            // Checks if day is actually a year and year is actually a day
            return `${day}-${month.padStart(2, '0')}-${year.padStart(2, '0')}`;
        }
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else {
        return dateString;
    }
}












function addCommaAtIndex(str, index) {
    return str.substring(0, index) + "," + str.substring(index);
}

function canWeAddMoreCommas(str) {
    const firstOccur = str.indexOf(",")
    return firstOccur > 2 ? firstOccur : -1
}

function addingCommas(numStr) {
    let isNotEnd = true
    while (isNotEnd) {
        const firstIndexOfComma = canWeAddMoreCommas(numStr)
        if (firstIndexOfComma === -1) {
            isNotEnd = false
            continue
        }

        numStr = addCommaAtIndex(numStr, firstIndexOfComma - 2)
    }
    return numStr
}
export function formateAmmountValue(num) {
    if (num == null) {
        return null
    }

    let numStr = String(num);
    numStr = numStr.replace(/,/g, '');

    if (numStr.length <= 3) {
        return numStr;
    }
    else {

        numStr = addCommaAtIndex(numStr, numStr.length - 3)
        numStr = addingCommas(numStr)
        return numStr;
    }
}


export function properAmmount(num) {
    try {
        if (num == null) {
            return null
        }

        let newAmmount = num.replace(/,/g, '');
        return parseInt(newAmmount)
    }
    catch (e) {

    }

    return num

}




export function generateUniqueAddress(append, fileName, extension) {
    // You can implement your own logic to generate a unique address
    // For simplicity, let's use a timestamp
    const timestamp = Date.now();

    if (fileName != null) {
        return `${append.toUpperCase()}_${timestamp}.${getFileExtension(fileName)}`;
    }
    else {
        return `${append.toUpperCase()}_${timestamp}.${extension}`;
    }
}

function getFileExtension(uri) {
    // Extracting the file extension from the URI
    const extension = uri.split('.').pop();
    return extension;
}


export function isValidJoiningDate(dob, joining) {
    if (!(joining > dob && joining <= new Date())) {
        return "Please Provide Valid Joining "
    }
    return null
}

export function calculatePastDate(years) {

    if (years == null || years < 1) {
        return null
    }
    // Create a new date object to avoid modifying the original date
    const pastDate = new Date();

    // Subtract the specified number of years, months, and days
    pastDate.setFullYear(pastDate.getFullYear() - years);

    // Format the date to dd/mm/yyyy
    const day = String(pastDate.getDate()).padStart(2, '0');
    const month = String(pastDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = pastDate.getFullYear();

    return `${day}/${month}/${year}`;
}

export function createDateFromDMY(dateString) {
    // Split the date string into day, month, and year
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months in Date object are 0-based
    const year = parseInt(parts[2], 10);

    // Create the Date object
    const date = new Date(year, month, day);

    return date;
}

export function createDateFromDMYToDash(dateString) {

    const dateParts = dateString.split("/");

    return dateParts.reverse().join("-");



}



function base64toBlob(base64, mimeType) {
    // Convert base64 to binary
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create Blob from binary data
    return new Blob([byteArray], { type: mimeType });
}

export function base64ToFile(base64, mimeType, name) {
    const [, base64WithoutPrefix] = base64.split(';base64,');
    const blob = base64toBlob(base64WithoutPrefix, mimeType);
    const file = new File([blob], name, { type: mimeType });
    return file;
}











function getFileNameFromPath(url) {
    // Split the URL by "/"
    const parts = url.split('/');
    // Return the last element in the array
    return parts[parts.length - 1];
}


export const DownloadMyFile = async (header, path, name) => {

    let apiResponse = API_RESPONSE_STATUS()
    try {

        if (Platform.OS === "web") {
            const response = await fetch(path, {
                method: 'GET',
                headers: header
            });

            if (!response.ok) {
                apiResponse.status = STATUS.ERROR
                apiResponse.message = 'Failed to download file'

                return apiResponse
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }

        else {
            let RNFetchBlob = require('rn-fetch-blob').default;


            const { dirs } = RNFetchBlob.fs;
            const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
            const configfb = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    mediaScannable: true,
                    title: name,
                    path: `${dirs.DownloadDir}/${name}`,
                },
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                title: name,
                path: `${dirToSave}/${name}`,
            };
            const configOptions = Platform.select({
                ios: configfb,
                android: configfb,
            });

            const res = await RNFetchBlob.config(configOptions || {}).fetch('GET', path, header);

            // Check if the platform is iOS
            if (Platform.OS === 'ios') {
                // Write the file to disk
                await RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                // Preview the document
                RNFetchBlob.ios.previewDocument(configfb.path);
            }

            console.log("file downloaded");
        }


    }
    catch (e) {
        console.error(e)
        apiResponse.status = STATUS.ERROR
        apiResponse.message = 'Failed to download file'
    }

    apiResponse.status = STATUS.SUCCESS

    return apiResponse
};


export const DownloadMyFileWithBase64 = async (base64, name) => {

    if (Platform.OS === "web") {
        let parts = name.split('.');
        let extension = parts[parts.length - 1];
        let mimeType = getBase64MimeType(extension)

        try {
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.log(e);
        }
    }
    else {
        try {
            var RNFS = require('react-native-fs');

            const filePath = FileSystem.documentDirectory + name;

            // Save the binary data to a file
            await FileSystem.writeAsStringAsync(filePath, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });
            // Set the PDF URI for the PDF viewer component
            const finalPath = `${RNFS.DownloadDirectoryPath}/${name}`
            await RNFS.copyFile(filePath, `${finalPath}`);
            console.log(finalPath)
            return finalPath;
        }
        catch (e) {
            console.error(e)
        }
    }

    return null
}






export const generatePdf = async (url, header, method) => {


    const response = await fetch(url, {
        method: method,
        headers: header,
        // You can add more options like mode, cache, credentials, etc.
    });

    // Check for HTTP errors
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Read the response as an array buffer
    const arrayBuffer = await response.arrayBuffer();

    // Convert the array buffer to a Base64 string
    const base64String = arrayBufferToBase64(arrayBuffer);

    return base64String;
}



function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}


export function getBase64MimeType(extension) {

    if (extension == "jpeg" || extension == "jpg" || extension == "png" || extension == "svg") {
        return `image/${extension}`
    }
    else {
        return `application/${extension}`
    }

} 
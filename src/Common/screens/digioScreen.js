import { Digio, DigioConfig, Environment, GatewayEvent } from '@digiotech/react-native';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Button } from 'react-native';
import WebView from 'react-native-webview';
import { STATUS } from '../Utils/Constant';
import { Something_Went_Wrong } from '../../PersonalLoan/services/Utils/Constants';


const DigioScreen = ({ startWebHook, payload, setStartDigioWebHook }) => {

    const config = { environment: Environment.SANDBOX };
    const digio = new Digio(config);
    const [mandateState, setMandateState] = useState(null)


    const startDigioWebHook = async () => {
        const documentId = payload.mandateId;
        const identifier = payload.phoneNumber;
        const tokenId = payload.token;
        await digio.start(documentId, identifier, tokenId)
    }

    useEffect(() => {

        const gatewayEventListener = digio.addGatewayEventListener((event) => {
            if (!ignoreWhileMandate.includes(event.event)) {

                let status = STATUS.ERROR, message = Something_Went_Wrong
                if(successWhileMandate.includes(event.event)){
                    status = STATUS.SUCCESS
                    message = "Mandate Successfull"
                }
                else if(errorWhileMandate.includes(event.event)){
                    status = STATUS.ERROR
                    message = event?.payload?.error?.message || "Mandate Failed"
                }
                 
                setMandateState({status, message})
            }
            setStartDigioWebHook(false)
        });

        return () => {
            gatewayEventListener.remove();
        };
    }, []);


    useEffect(() => {
        if (!startWebHook) {
            return
        }

        console.log("=============== restart again =============")
        startDigioWebHook().then(() => { })
    }, [startWebHook])


    return { mandateState, setMandateState }

}


const ignoreWhileMandate = [
    "nach.initiated"
]

const successWhileMandate = [
    "nach.physical_mandate.already_signed",
    "nach.physical_mandate.signed",
    "nach.api_mandate.authenticated",
    "nach.api_mandate.already_authenticated",
    "nach.upi_mandate.vpa_verified",
    "nach.upi_mandate.authenticated",
    "nach.upi_mandate.already_authenticated"
]

const errorWhileMandate = [    
    "nach.physical_mandate.failed",
    "nach.api_mandate.cancelled_by_user",
    "nach.api_mandate.failed",
    "nach.upi_mandate.rejected",
    "nach.upi_mandate.failed",
    "nach.upi_mandate.cancelled_by_user"
]


export const DigioStatusScreen = ({ mandateState, onTryAgain }) => {

  
    return (
        <View style={screenStyles.overlay}>
            {mandateState.status == STATUS.SUCCESS ?

                <View style={screenStyles.overLayChild}>
                    <Image
                        source={require("../../assets/images/Done.gif")}
                        resizeMode="contain"
                        style={{ width: 200, height: 200 }}
                    />
                    <View style={{ height: 40 }} />
                    <Text style={{ width: "100%", textAlign: "center" }}>Mandate Successfull</Text>
                </View> :


                <View style={screenStyles.overLayChild}>
                    <Image
                        source={require("../../assets/images/Error.gif")}
                        resizeMode="contain"
                        style={{ width: 200, height: 200 }}
                    />
                    <View style={{ height: 40 }} />
                    <Text style={{ width: "100%", textAlign: "center" }}>{mandateState?.message || "Mandate Failed"}</Text>
                    <View style={{ height: 40 }} />
                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Button onPress={() => { if (onTryAgain) { onTryAgain() } }} title='Retry'></Button>

                    </View>
                </View>

            }

        </View>

    )

}



const screenStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        backgroundColor: 'white', // semi-transparent background
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },

    overLayChild: { alignItems: 'center', justifyContent: "center", flex: 1, width: "100%" }
})

export default DigioScreen
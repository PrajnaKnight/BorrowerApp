import { Digio, DigioConfig, Environment, GatewayEvent } from '@digiotech/react-native';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Button } from 'react-native';
import WebView from 'react-native-webview';


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
            console.log(event)
            if(event.event != "nach.initiated"){
                setMandateState(event)
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



export const DigioStatusScreen = ({ mandateState, onTryAgain }) => {

    return (
        <View style={screenStyles.overlay}>
            {mandateState.event == "nach.api_mandate.authenticated" ||  mandateState.event == "nach.upi_mandate.authenticated"?

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
                    <Text style={{ width: "100%", textAlign: "center" }}>{mandateState?.payload?.error?.message || "Mandate Failed"}</Text>
                    <View style={{ height: 40 }} />
                    <View style={{width:"100%", justifyContent:"center", alignItems:"center"}}>
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
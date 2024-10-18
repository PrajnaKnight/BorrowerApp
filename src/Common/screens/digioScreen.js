import { Digio, DigioConfig, Environment, GatewayEvent } from '@digiotech/react-native';
import { useEffect, useState } from 'react';
import WebView from 'react-native-webview';


const DigioScreen = ({startWebHook, payload}) => {

    const config = { environment: Environment.SANDBOX };
    const digio = new Digio(config);
    const [mandateState, setMandateState] = useState(null)


    const startDigioWebHook = async() =>{
        const documentId = payload.mandateId;
        const identifier = payload.phoneNumber;
        const tokenId = payload.token;
        await digio.start(documentId, identifier, tokenId)
    }
    
    useEffect(() => {
        
       
        const gatewayEventListener = digio.addGatewayEventListener((event) => {
            console.log(event)
            setMandateState(event)
        });

        return () => {
            gatewayEventListener.remove();
        };
    }, []);


    useEffect(()=>{
        if(!startWebHook){
            return
        }
        startDigioWebHook().then(()=>{})
    },[startWebHook])

    
    return {mandateState, setMandateState}

}


export default DigioScreen
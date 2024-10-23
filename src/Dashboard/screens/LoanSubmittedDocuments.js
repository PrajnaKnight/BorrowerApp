import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { styles } from '../../assets/style/globalStyle';
import TabsComponent from '../components/TabsComponent';
import { useTab } from '../components/TabContext';
import Layout from '../components/Layout';
import { ActivityIndicator } from 'react-native';
import GetDocumentDownload from '../services/API/DownloadDocuments';
import { STATUS } from '../../Common/Utils/Constant';
import { DownloadMyFile, DownloadMyFileWithBase64 } from '../../PersonalLoan/services/Utils/FieldVerifier';
import { checkImagePermission } from '../../Common/screens/PermissionScreen';

const LoanSubmiitedDocumentsScreen = ({ navigation }) => {
  const [downloadMessage, setDownloadMessage] = useState({
    message : null,
    success : false
  });
  const [listOfFiles, setListOfFiles] = useState([])

  const [reload, setReload] = useState(true)

  useEffect(() => {
    if (!reload) {
      return
    }

    async function FetchDocumentDownload() {
      const response = await GetDocumentDownload()
      setReload(false)
      if (response.status == STATUS.ERROR) {
        showDownloadMessage(response.message)
        return
      }


      let documentList = {}

      response.data?.Value?.forEach(element => {
        if (element.DocSetTypeDisplayName == "Proof of Income" || element.DocSetTypeDisplayName == "Proof of Identity" || element.DocSetTypeDisplayName == "Proof Of Address") {

          let tillNowList = documentList[element.DisplayName] ? [...documentList[element.DisplayName]] : []

          let currentElement = { ...element }
          tillNowList.push(currentElement)
          documentList[element.DisplayName] = tillNowList
        }
      });


      console.log(documentList)

      setListOfFiles(documentList)
    }

    FetchDocumentDownload()
  }, [reload])
  const showDownloadMessage = (title, positive) => {
    // Simulate a download success or failure
    const isSuccess = Math.random() > 0.5;
    setDownloadMessage(title);
    setTimeout(() => setDownloadMessage(null), 2000); // Hide message after 2 seconds
  };



  const DocumentItem = ({ title, onPress }) => (
    <TouchableOpacity style={styles.documentItem} onPress={onPress}>
      <Text style={styles.documentItemText}>{title}</Text>
      <AntDesign name="download" size={24} color="#ff8500" />
    </TouchableOpacity>
  );


  const HandleDownload = async(key) =>{

    if ((await checkImagePermission()) == false) {

      navigation.navigate("PermissionsScreen", {
        permissionStatus: "denied",
        permissionType: "files",
      },)
      return;
    }


    listOfFiles[key].forEach((item)=>{
      const currentTimeInMillis = new Date().getTime();
      DownloadMyFileWithBase64(item.OriginalFile, `${key}_${currentTimeInMillis}.pdf`).then((response)=>{
        if(response){
          showDownloadMessage( {success : true, message : `${key} Downloaded Successfully`})
        }
        else{
          showDownloadMessage( {success : false, message : `${key} Downloaded Failed`})
        }
      })  
    })
  }

  return (
    <Layout>
      <View style={styles.container}>
        <TabsComponent />

        {reload ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

          <ActivityIndicator size={"large"} />

        </View> :
          <ScrollView>
            {/* Download Message */}
            {downloadMessage?.message && (
              <View
                style={[
                  styles.downloadMessage,
                  {
                    backgroundColor:
                      downloadMessage.success
                        ? "#2FC603"
                        : "#DD0000",
                  },
                ]}>
                <Text style={styles.downloadMessageText}>{downloadMessage.message}</Text>
              </View>
            )}
            <View style={styles.content}>
              <Text style={styles.sectionTitle}>Submitted Documents</Text>
              <View style={styles.DownloadDocWrapper}>

                {/* 
              <DocumentItem
                    key={"key 1"}
                    title={"key 1"}
                    onPress={() => showDownloadMessage(doc.title)}
                  />

<DocumentItem
                    key={"key 2"}
                    title={"key 2"}
                    onPress={() => showDownloadMessage(doc.title)}
                  /> */}
                {Object.keys(listOfFiles).map(key => (
                  <DocumentItem
                    key={key}
                    title={key}
                    onPress={() => { HandleDownload(key) }}
                  />
                ))}

              </View>
            </View>
          </ScrollView>
        }

      </View>
    </Layout>
  );
};

export default LoanSubmiitedDocumentsScreen;

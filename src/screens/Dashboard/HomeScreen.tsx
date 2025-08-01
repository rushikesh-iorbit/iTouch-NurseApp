import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import DynamicSvg from '../../components/DynamicSvg';
import { getBedPatientInfo, getWardSVG, getCurrentShift, getAssignedBeds } from '../../services/nurseService';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../../components/Header';
import { Notification } from '../../components/Notification';
import { handleApiError } from '../../utils/errorHandler';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import CalloutModal from '../../components/CallOutModal/CalloutModal';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { GlobalNotifications } from '../../components/GlobalNotifications';


const Menu = require('../../../assets/icons/menu-line.png');
const NotificationIcon = require('../../../assets/icons/notification-2-line.png');
const zoomIcon = require('../../../assets/icons/zoom.png');
const transferIcon = require('../../../assets/icons/transfer_icon.png');
const lockIcon = require('../../../assets/icons/lock_screen_icon.png');
const emergencyIcon = require('../../../assets/icons/emergency_call_icon.png');

type RootStackParamList = {
  BedPatientInfo: { bedCode: string };
};

const HomeScreen = () => {
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCallout, setShowCallout] = useState(false); 
  const [bedPatientInfo, setBedPatientInfo] = useState<any>(null);
  const [assignedBedCodes, setAssignedBedCodes] = useState<string[]>([]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchBedPatientInfo = async (bedCode: string) => {
    try {
      const bedPatientResponse = await getBedPatientInfo(bedCode);
      if (bedPatientResponse && bedPatientResponse.bedCode) {
        setSelectedElement(bedPatientResponse.bedCode);
        //navigation.navigate('BedPatientInfo', bedPatientResponse);
        setBedPatientInfo(bedPatientResponse); 
        setShowCallout(true); 
      }
    } catch (error: any) {
      //console.error('getBedPatientInfo API error: ', error?.response || error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Bed Patient Info Not Found.',
      });
    }
  };

  useEffect(() => {
  const fetchSvg = async () => { 
    try {
      setLoading(true);

      // Fetch SVG first
      const response = await getWardSVG();
      await getCurrentShift(); // Always wait for this

      // Handle getAssignedBeds separately
      try {
        const response1 = await getAssignedBeds();
        console.log('getAssignedBeds API response:', response1);
        const codes = response1.map((bed: any) => bed.bedCode);
        setAssignedBedCodes(codes);
      } catch (bedError) {
        console.warn('getAssignedBeds failed:', bedError);
        Toast.show({
          type: 'info',
          text1: 'Warning',
          text2: 'Some bed assignments could not be loaded.',
        });
      }


      // Continue processing SVG even if getAssignedBeds failed
      if (response && response.svgFile) {
        setSvgXml(response.svgFile);
      } else {
        const errorMsg = response?.message || '';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMsg || 'SVG data not found.',
        });
      }

    } catch (error: any) {
      handleApiError(error, 'Failed to fetch SVG');
    } finally {
      setLoading(false);
    }
  };

  fetchSvg();
}, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header/>

      {/* Main Body */}
      <View style={styles.body}>
        <View>
          <GlobalNotifications />
        </View>
        <View style={styles.leftPanel}>
          <Notification/>
        </View>
      
        <View style={styles.zoomIconWrapper}>
          <TouchableOpacity >
            <Image source={zoomIcon} style={styles.zoomIconStyle} />
          </TouchableOpacity>
        </View>
        {/* Right Panel - SVG */}
        <View style={styles.rightPanel}>
          <ReactNativeZoomableView
            zoomEnabled={true}
            maxZoom={3}
            minZoom={0.5}
            initialZoom={1}
            bindToBorders={true}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : svgXml ? (
            <DynamicSvg
              svgXml={svgXml}
              width={Dimensions.get('window').width}
              height={Dimensions.get('window').height-50}
              initialColor={currentColor}
              onElementSelected={fetchBedPatientInfo}
            />
          ) : (
            <Text>No Shift Found</Text>
          )}
          </ReactNativeZoomableView>
        </View>
      </View>
       <CalloutModal
        visible={showCallout}
        onClose={() => setShowCallout(false)}
        bedPatientInfo={bedPatientInfo}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFF5F1',
    marginLeft: 10,
  },
  leftPanel:{
    width: 'auto',
  },
   rightPanel: {
    width: 'auto',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',

  },
  zoomIconWrapper: {
    zIndex: 30,
  },

zoomIconStyle: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  borderRadius: 5,
  padding: 5,
  elevation: 4,
},

});

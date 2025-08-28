import React, { useState, useEffect, useRef } from 'react';
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
import { getBedPatientInfo, getWardSVG, getCurrentShift, getAssignedBeds, getEmptyBeds , getGlobalRaisedAlarm, assignedDevices} from '../../services/nurseService';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../../components/Header';
import { Notification } from '../Notifications/Notification';
import { handleApiError } from '../../utils/errorHandler';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import CalloutModal from '../../components/CallOutModal/CalloutModal';
import AdmitPatientModal from '../../components/CallOutModal/AdmitPatientModal';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { GlobalNotifications } from '../Notifications/GlobalNotifications';
import { LogBox } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Menu = require('../../../assets/icons/menu-line.png');
const NotificationIcon = require('../../../assets/icons/notification-2-line.png');
const zoomIcon = require('../../../assets/icons/zoom.png');
const transferIcon = require('../../../assets/icons/transfer_icon.png');
const lockIcon = require('../../../assets/icons/lock_screen_icon.png');
const emergencyIcon = require('../../../assets/icons/emergency_call_icon.png');

type RootStackParamList = {
  BedPatientInfo: { bedCode: string };
};
LogBox.ignoreLogs(['Encountered two children with the same key']);
LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);
LogBox.ignoreLogs(['Text strings must be rendered within a <Text> component.']);

const HomeScreen = () => {
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef<any>(null);

  const [showCallout, setShowCallout] = useState(false); 
  const [modalVisible, setModalVisible] = useState(true);
  const [activeModal, setActiveModal] = useState<"assignDevices" | "callout" | null>(null);
  const [bedPatientInfo, setBedPatientInfo] = useState<any>(null);
  const [assignedBedCodes, setAssignedBedCodes] = useState<string[]>([]);
  const zoomRef = useRef<any>(null); // ref for ZoomableView
  const [isZoomedIn, setIsZoomedIn] = useState(false); // toggle state
  const dynamicSvgRef = useRef<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [emptyBeds, setEmptyBeds] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [admitPatientBed, setAdmitPatientBed] = useState<string | null>(null);
  const [assignedDevicesList, setAssignedDevicesList] = useState<any[]>([]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchBedPatientInfo = async (bedCode: string) => {
    try {
      const bedPatientResponse = await getBedPatientInfo(bedCode);
      if (bedPatientResponse && bedPatientResponse.bedCode) {
        setSelectedElement(bedPatientResponse.bedCode);
        //navigation.navigate('BedPatientInfo', bedPatientResponse);
        setBedPatientInfo(bedPatientResponse); 
        //setShowCallout(true); 
        if (bedPatientResponse.bedCode === admitPatientBed) {
        setActiveModal("assignDevices");
      } else {
        setActiveModal("callout");
      }
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

  // const handleZoomToggle = () => {
  //   if (zoomRef.current) {
  //     const newZoom = isZoomedIn ? 1 : 1.5; // adjust zoom scale as needed
  //     zoomRef.current.zoomTo(newZoom);
  //     setIsZoomedIn(!isZoomedIn);
  //   }
  // };

 const handleZoomToggle = () => {
  if (isZoomedIn) {
    zoomRef.current?.zoomTo(1, { x: 0, y: 0 }, 300);
    setIsZoomedIn(false);
  } else {
    zoomToAssignedBeds();
  }
};

const zoomToAssignedBeds = () => {
  if (!dynamicSvgRef.current || !zoomRef.current) return;

  const positions = dynamicSvgRef.current.getElementPositions?.();
  if (!positions) return;

  const selectedBeds = assignedBedCodes.map(id => positions[id]).filter(Boolean);
  if (selectedBeds.length === 0) return;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  selectedBeds.forEach(({ x, y, width, height }) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height+150);
  });

  const padding = 20;
  const paddedMinX = minX - padding;
  const paddedMinY = minY - padding;
  const paddedMaxX = maxX + padding;
  const paddedMaxY = maxY + padding;

  const paddedWidth = paddedMaxX - paddedMinX;
  const paddedHeight = paddedMaxY - paddedMinY;

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height - 50;

  const maxZoom = 3;
  const zoomScale = Math.min(
    screenWidth / paddedWidth,
    screenHeight / paddedHeight,
    maxZoom
  );

  const contentCenterX = paddedMinX + paddedWidth / 2;
  const contentCenterY = paddedMinY + paddedHeight / 2;

  const screenCenterX = screenWidth / 2;
  const screenCenterY = screenHeight / 2;

  const offsetX = screenCenterX - contentCenterX * zoomScale;
  const offsetY = screenCenterY - contentCenterY * zoomScale;

  zoomRef.current.zoomTo(zoomScale, { x: offsetX, y: offsetY }, 300);
  setIsZoomedIn(true);
};

const loadData = async () => {
  try {
    setLoading(true);

    const response = await getWardSVG();
    await getCurrentShift();

    try {
      const response1 = await getAssignedBeds();
      const codes = response1.map((bed: any) => bed.bedCode);
      setAssignedBedCodes([...codes]);
      // console.log('Assigned Bed Codes:', codes);  

    } catch (bedError) {
      console.warn('getAssignedBeds failed:', bedError);
      Toast.show({
        type: 'info',
        text1: 'Warning',
        text2: 'Some bed assignments could not be loaded.',
      });
    }

    if (response && response.svgFile) {
      setSvgXml(response.svgFile);
      setRefreshKey(prev => prev + 1);
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

const fetchEmptyBeds = async () => {
  try {
    const response = await getEmptyBeds();
    if (response && Array.isArray(response)) {
      const codes = response.map((bed: any) => bed.bedCode);
      setEmptyBeds(codes);
    }
  } catch (error: any) {
    console.log('getEmptyBeds API error: ', error?.response || error);
  }
};

const fetchAssignedDevices = async (bedCode: string) => {
  try {
    const response = await assignedDevices(bedCode);
    if (response) {
      setAssignedDevicesList(response);
    }
    console.log('Assigned Devices:', response);
  } catch (error: any) {
    console.log('assignedDevices API error: ', error?.response || error);
  }
}
useEffect(() => {
  loadData();
}, []);


useEffect(() => {
  if (svgXml && assignedBedCodes.length > 0) {
    // Wait a tick for SVG to render
    setTimeout(() => {
      zoomToAssignedBeds();
    }, 300);
  }
}, [svgXml, assignedBedCodes]);

useEffect(() => {
  let intervalId: NodeJS.Timeout;

  const fetchAlarms = async () => {
    try {
      const data = await getGlobalRaisedAlarm();
      if (Array.isArray(data)) {
        setAlerts(data);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      //console.error('Error fetching global alarms:', err);
      setAlerts([]);
    }
  };

  fetchAlarms();
  fetchEmptyBeds();
  intervalId = setInterval(() => {
    fetchAlarms();
    fetchEmptyBeds();
  }, 5000);

  return () => clearInterval(intervalId);
}, []);
const insets = useSafeAreaInsets()

  return (
    <View style={styles.container}>
      {/* Header */}
      /<Header/>
      

      {/* Main Body */}
      <View style={styles.body}>
        <View>
          <GlobalNotifications
            alerts={alerts}
            onNotificationClick={() => {
              notificationRef.current?.expandPanel();
            }}
          />
        </View>
        <View style={styles.leftPanel}>
          <Notification ref={notificationRef}/>
        </View>
      
        <View style={styles.zoomContainer}>
          <View style={styles.zoomIconWrapper}>
            <TouchableOpacity onPress={handleZoomToggle}>
              <Image source={zoomIcon} style={styles.zoomIconStyle} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Panel - SVG */}
        <View style={styles.rightPanel}>
          <ReactNativeZoomableView
            ref={zoomRef}
            zoomEnabled={true}
            maxZoom={3}
            minZoom={0.5}
            initialZoom={1}
            bindToBorders={true}>
            contentWidth={Dimensions.get('window').width}
            contentHeight={Dimensions.get('window').height - 60}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : svgXml ? (
            <DynamicSvg
              key={refreshKey}
              ref={dynamicSvgRef}
              svgXml={svgXml}
              width={Dimensions.get('window').width}
              height={Dimensions.get('window').height-80}
              initialColor={currentColor}
              onElementSelected={(bedCode: string) => {
                fetchBedPatientInfo(bedCode);
                fetchAssignedDevices(bedCode);
              }}
              highlightedIds={assignedBedCodes}
              emptybedsIds={emptyBeds}
              alerts={alerts}
              admitPatientBed={admitPatientBed ? [admitPatientBed] : []}
            />
          ) : (
            <Text>No Shift Found</Text>
          )}
          </ReactNativeZoomableView>
        </View>
      </View>
       {activeModal === "callout" && (
          <CalloutModal
            visible={true}
            onClose={() => {
              setActiveModal(null);
              loadData();
            }}
            bedPatientInfo={bedPatientInfo}
          />
        )}

        {activeModal === "assignDevices" && (
          <AdmitPatientModal
            visible={true}
            onClose={() => setActiveModal(null)}
            patientInfo={bedPatientInfo}
            assignedDevices={assignedDevicesList}
          />
        )}

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
  zoomContainer: {
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginHorizontal: 3,
},

zoomIconWrapper: {
  padding: 5,
  zIndex:30
},


zoomIconStyle: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  borderRadius: 5,
  padding: 5,
  elevation: 8,
},

});

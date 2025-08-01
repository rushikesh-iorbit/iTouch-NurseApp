import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PanResponder,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationCallOutModal from './CallOutModal/NotificationCallOutModal';
import { getBedPatientInfo } from '../services/nurseService';;
import Toast from 'react-native-toast-message';

const heart= require('../../assets/vectors/heart.png');
const drop= require('../../assets/vectors/drop.png');
const lungs= require('../../assets/vectors/lungs.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
const MIN_WIDTH = 100;
const MAX_WIDTH = SCREEN_WIDTH * 0.5;

export const Notification = () => {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const DEFAULT_WIDTH = SCREEN_WIDTH * 0.25; // 20% of screen width
  const [panelWidth, setPanelWidth] = useState(new Animated.Value(DEFAULT_WIDTH));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentPanelWidth, setCurrentPanelWidth] = useState(DEFAULT_WIDTH);
  const [showCallout, setShowCallout] = useState(false); 
  const [bedPatientInfo, setBedPatientInfo] = useState<any>(null);
  
  const fetchBedPatientInfo = async (bedCode: string) => {
      try {
        setShowCallout(true);
        const bedPatientResponse = await getBedPatientInfo(bedCode);
        if (bedPatientResponse && bedPatientResponse.bedCode) {
          //navigation.navigate('BedPatientInfo', bedPatientResponse);
          setBedPatientInfo(bedPatientResponse); 
          setShowCallout(true); 
        }
      } catch (error: any) {
         setShowCallout(false); 
        //console.error('getBedPatientInfo API error: ', error?.response || error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Notification Information Not Found.',
        });
      }
    };
  
  useEffect(() => {
    
    const fetchNurseName = async () => {
      try {
        const fName = await AsyncStorage.getItem('firstName');
        const lName = await AsyncStorage.getItem('lastName');
        setFirstName(fName || '');
        setLastName(lName || '');
      } catch (error) {
        console.error('Error fetching nurse name from storage:', error);
      }
    };

    fetchNurseName();
  }, []);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        let newWidth = gestureState.moveX;
        
        if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
        if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
        panelWidth.setValue(newWidth);
        setCurrentPanelWidth(newWidth);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <Animated.View style={[styles.leftPanel, { width: panelWidth }]}>
    {currentPanelWidth > SCREEN_WIDTH * 0.2 && (
      <Text style={styles.sectionTitle}>
        Nurse : <Text style={styles.nurseName}>{firstName} {lastName}</Text>
      </Text>
    )}       
    <ScrollView style={styles.notificationScroll} contentContainerStyle={styles.notificationList}>
    {[
      { bed: 'APOLLOORG1H1B3', msg: 'HR is high', time: '15:45:00', icon: 'heart', color: '#ff0000' },
      { bed: 'APOLLOORG1H1B2', msg: 'SpO2 is low', time: '14:35:00', icon: 'drop', color: '#ffaa00' },
      { bed: 'APOLLOORG1H1B4', msg: 'Temp abnormal', time: '14:05:00', icon: 'lungs', color: '#00aaff' },
    ].map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.notificationItem}
        onPress={() => fetchBedPatientInfo(item.bed)}
      >
        <View style={styles.notificationContent}>
          {/* Vector Icon */}
          <Image
            source={
              item.icon === 'heart'
                ? heart
                : item.icon === 'drop'
                ? drop
                : lungs
            }
            style={styles.iconStyle}
          />
          {/* Bed & Message */}
          <View style={styles.textSection}>
            <View style={styles.headerRow}>
              <Text style={styles.bedCode}>{item.bed?.match(/B\d+$/)?.[0] || item?.bed || '-'}</Text>
              {currentPanelWidth > SCREEN_WIDTH * 0.2 && (
                  <Text style={styles.notificationTime}>{item.time}</Text>
              )}  
              </View>
              {currentPanelWidth > SCREEN_WIDTH * 0.2 && (
                <Text style={styles.notificationText}>{item.msg}</Text>
              )}
          </View>
        </View>
        <NotificationCallOutModal
        visible={showCallout}
        onClose={() => setShowCallout(false)}
        bedPatientInfo={bedPatientInfo}
      />  
      </TouchableOpacity>
    ))}
  </ScrollView>
      {/* Drag Handle */}
      <View {...panResponder.panHandlers} style={styles.resizer}>
        <View style={styles.homeButtonIndicator} />
      </View> 
      </Animated.View>
      
    );
  };

const styles = StyleSheet.create({
  leftPanel: {
    backgroundColor: '#fffefe',
    borderRightWidth: 1,
    borderColor: '#ddd',
    height: '100%',
    position: 'relative',
    zIndex: 10,
    borderTopRightRadius: 36,   
    borderBottomRightRadius: 36, 
    overflow: 'hidden', 
    paddingRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    margin: 10,
  },
  notificationContent: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},
iconStyle: {
  width: 24,
  height: 24,
  marginRight: 10,
  marginTop: 2,
  resizeMode: 'contain',
},


textSection: {
  flex: 1,
  justifyContent: 'center',
},

headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
  notificationScroll: {
    flex: 1,
    paddingHorizontal: 10,
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationItem: {
    marginTop: 5,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  bedCode: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#333',
},

notificationText: {
  fontSize: 13,
  color: '#555',
  marginTop: 2,
},

notificationTime: {
  fontSize: 12,
  color: '#888',
},
 resizer: {
  width: 20,
  height: '100%',
  position: 'absolute',
  right: 0, // pushes it slightly outside the panel
  top: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 20,
},

homeButtonIndicator: {
  width: 50,
  height: 7,
  backgroundColor: '#4CAE51', 
  borderRadius: 5,
  transform: [{ rotate: '90deg' }],
  borderWidth: 0.5,          
  borderColor: '#999',
  opacity: 0.8,
},
  nurseName: {
    fontWeight: 'bold',
    color: '#34a853',
  },


});

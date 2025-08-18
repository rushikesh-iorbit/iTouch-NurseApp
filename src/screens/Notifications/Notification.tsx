import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationCallOutModal from '../../components/CallOutModal/NotificationCallOutModal';
import { getBedPatientInfo, getRaisedAlarm } from '../../services/nurseService';
import Toast from 'react-native-toast-message';
import { Icons } from '../../../assets';

const MIN_WIDTH = 100;
const SCREEN_WIDTH = Dimensions.get('window').width;
const MAX_WIDTH = SCREEN_WIDTH * 0.25;
const DEFAULT_WIDTH = SCREEN_WIDTH * 0.25;
export const Notification = forwardRef((props, ref) => {
  const [panelWidth, setPanelWidth] = useState(new Animated.Value(DEFAULT_WIDTH));
  const [currentPanelWidth, setCurrentPanelWidth] = useState(DEFAULT_WIDTH);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showCallout, setShowCallout] = useState(false);
  const [bedPatientInfo, setBedPatientInfo] = useState<any>(null);
  const [raisedAlarms, setRaisedAlarms] = useState<any[]>([]);

  const isCompact = currentPanelWidth <= SCREEN_WIDTH * 0.2;

  const fetchBedPatientInfo = async (bedCode: string) => {
    try {
      setShowCallout(true);
      const bedPatientResponse = await getBedPatientInfo(bedCode);
      if (bedPatientResponse && bedPatientResponse.bedCode) {
        setBedPatientInfo(bedPatientResponse);
        setShowCallout(true);
      }
    } catch (error: any) {
      setShowCallout(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Notification Information Not Found.',
      });
    }
  };

  const getColorByPriority = (priority: number) => {
  switch (priority) {
    case 0:
      return '#ff0000'; // critical
    case 1:
      return '#ffaa00'; // high
    case 2:
      return '#00aaff'; // medium
    default:
      return '#cccccc'; // low
  }
};

const getParameterKey = (violatedParameter?: string): string => {
  if (!violatedParameter) return '';
  const [key] = violatedParameter.split(':');
  return key.trim().toUpperCase();
};

const getParameterIcon = (
  key: string,
): React.FC<{
  width?: number;
  height?: number;
  fill?: string;
}> => {
  switch (key) {
    case 'HR':
      return Icons.hr;
    case 'SPO2':
      return Icons.spo2;
    case 'RR':
      return Icons.rr;
    default:
      return Icons.default; // fallback SVG
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

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchRaisedAlarms = async () => {
      try {
        const response = await getRaisedAlarm();
        if (Array.isArray(response) && response.length > 0) {
          setRaisedAlarms(response);
        } else {
          console.log('No raised alarms found');
          setRaisedAlarms([]);
        }
      } catch (error) {
        console.error('Error fetching raised alarms:', error);
        setRaisedAlarms([]);
      }
    };

    fetchRaisedAlarms();

    intervalId = setInterval(() => {
    fetchRaisedAlarms();
  }, 10000);

  // Cleanup when component unmounts
  return () => {
    clearInterval(intervalId);
  };

  },[]);

  const togglePanel = () => {
    const newWidth = currentPanelWidth > MIN_WIDTH ? MIN_WIDTH : DEFAULT_WIDTH;

    Animated.timing(panelWidth, {
      toValue: newWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCurrentPanelWidth(newWidth);
    });
  };

  const expandPanel = () => {
    Animated.timing(panelWidth, {
      toValue: DEFAULT_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCurrentPanelWidth(DEFAULT_WIDTH);
    });
  };

  useImperativeHandle(ref, () => ({
    expandPanel
  }));

  return (
    <Animated.View
      style={[
        styles.leftPanel,
        currentPanelWidth > MIN_WIDTH ? { width: panelWidth } : { width: 20 },
      ]}
    >
      {currentPanelWidth > SCREEN_WIDTH * 0.2 && (
        <Text style={styles.sectionTitle}>
          Nurse : <Text style={styles.nurseName}>{firstName} {lastName}</Text>
        </Text>
      )}
      {currentPanelWidth > MIN_WIDTH && (
        <ScrollView
          style={styles.notificationScroll}
          contentContainerStyle={styles.notificationList}
        >
          {raisedAlarms.map((item, index) => {
            const paramKey = getParameterKey(item.violatedParameter);
            const IconComponent = getParameterIcon(paramKey);
            const priorityColor = getColorByPriority(item.priority);

            return (
              <TouchableOpacity
                key={index}
                style={styles.notificationItem}
                onPress={() => fetchBedPatientInfo(item.bedCode)}
              >
                <View
                  style={[
                    styles.notificationContent,
                    isCompact && styles.notificationContentCompact,
                  ]}
                >
                  {isCompact ? (
                    <>
                      <Text style={styles.bedCode}>
                        {item.bedCode?.match(/B\d+$/)?.[0] || item?.bedCode || '-'}
                      </Text>
                      <IconComponent width={20} height={20} fill={priorityColor} />
                    </>
                  ) : (
                    <>
                      <View style={styles.altIcon}>
                         <IconComponent width={24} height={24} fill={priorityColor}/>
                      </View>  
                      <View style={styles.textSection}>
                        <View style={styles.headerRow}>
                          <Text style={styles.bedCode}>
                            {item.bedCode?.match(/B\d+$/)?.[0] || item?.bedCode || '-'}
                          </Text>
                          {currentPanelWidth > SCREEN_WIDTH * 0.2 && (
                            <Text style={styles.notificationTime}>
                              {item.raisedTime}
                            </Text>
                          )}
                        </View>
                        {currentPanelWidth > SCREEN_WIDTH * 0.2 && (
                          <Text style={styles.notificationText}>
                            {item.summaryDescription}
                          </Text>
                        )}
                      </View>
                    </>
                  )}
                </View>
                <NotificationCallOutModal
                  visible={showCallout}
                  onClose={() => setShowCallout(false)}
                  bedPatientInfo={bedPatientInfo}
                />
              </TouchableOpacity>
            );
          })}

        </ScrollView>
      )}

      {/* Drag Handle */}
      <TouchableOpacity style={styles.resizer} onPress={togglePanel}>
        <View style={styles.homeButtonIndicator} />
      </TouchableOpacity>
    </Animated.View>
  )}
);

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
  nurseName: {
    fontWeight: 'bold',
    color: '#34a853',
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
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationContentCompact: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  altIcon: {
    color: '#888',
    marginRight: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bedCode: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationText: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 8,
    color: '#888',
  },
  resizer: {
    width: 20,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  homeButtonIndicator: {
    width: 70,
    height: 7,
    backgroundColor: '#4CAE51',
    borderRadius: 5,
    transform: [{ rotate: '90deg' }],
    borderWidth: 0.5,
    borderColor: '#999',
    opacity: 0.8,
  },
});

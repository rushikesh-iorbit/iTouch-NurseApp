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
import { getBedPatientInfo, getWardSVG } from '../../services/nurseService';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../../components/Header';
import { GlobalNotification } from '../../components/GlobalNotification';

const Menu = require('../../../assets/icons/menu-line.png');
const NotificationIcon = require('../../../assets/icons/notification-2-line.png');

type RootStackParamList = {
  BedPatientInfo: { bedCode: string };
};

const HomeScreen = () => {
  const [currentColor, setCurrentColor] = useState('#ff00ff');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchBedPatientInfo = async (bedCode: string) => {
    try {
      const bedPatientResponse = await getBedPatientInfo(bedCode);
      if (bedPatientResponse && bedPatientResponse.bedCode) {
        setSelectedElement(bedPatientResponse.bedCode);
        navigation.navigate('BedPatientInfo', bedPatientResponse);
      }
    } catch (error: any) {
      console.error('getBedPatientInfo API error: ', error?.response || error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load Bed Patient Info.',
      });
    }
  };

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        setLoading(true);
        const response = await getWardSVG();
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
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch SVG',
        });
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
        <View style={styles.leftPanel}>
          <GlobalNotification/>
        </View>
      
        {/* Right Panel - SVG */}
        <View style={styles.rightPanel}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : svgXml ? (
            <DynamicSvg
              svgXml={svgXml}
              width={490}
              height={490}
              initialColor={currentColor}
              onElementSelected={fetchBedPatientInfo}
            />
          ) : (
            <Text>No Shift Found</Text>
          )}
        </View>
      </View>
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
  },
  leftPanel:{
    width: '40%',
  },
   rightPanel: {
    width: '60%',
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

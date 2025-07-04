import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import DynamicSvg from '../components/DynamicSvg';
import { getBedPatientInfo, getWardSVG } from '../services/nurseService';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  BedPatientInfo: { bedCode: string };
  // Add other routes here if needed
};

const WardScreen3 = () => {
  const [currentColor, setCurrentColor] = useState('#ff00ff');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

  // Move fetchBedPatientInfo to component scope
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
          console.error('Error fetching SVG:', errorMsg);
          if (errorMsg.includes('Assignment data not found')) {
            Toast.show({
              type: 'info',
              text1: 'No Active Shift',
              text2: "You don't have any active shift assigned.",
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'SVG data not found in response.',
            });
          }
        }
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: 'Assigned Shift Ward Not Found',
          text2: 'You may not have an active shift assigned.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSvg();
  }, []);

  return (
    <View style={styles.landscapeContainer}>
      <View style={styles.controlsPanel}>
        <Text style={styles.label}>Current Color:</Text>
        <View style={[styles.colorPreview, { backgroundColor: currentColor }]} />

        <Text style={styles.label}>Selected: {selectedElement || 'None'}</Text>

        <View style={styles.colorButtons}>
          {colors.map(color => (
            <Button
              key={color}
              title=" "
              onPress={() => setCurrentColor(color)}
              color={color}
            />
          ))}
        </View>
      </View>

      <View style={styles.svgContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : svgXml ? (
          <DynamicSvg
            svgXml={svgXml}
            width={700}
            height={500}
            initialColor={currentColor}
            onElementSelected={(elementId) => {
              fetchBedPatientInfo(elementId);
            }}
            //onElementSelected={setSelectedElement}
          />
        ) : (
          <Text>No Shift Found</Text>
        )}
      </View>
    </View>
  );
};

export default WardScreen3;

const styles = StyleSheet.create({
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  controlsPanel: {
    width: 100,
    justifyContent: 'flex-start',
    paddingRight: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  colorPreview: {
    width: 50,
    height: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  colorButtons: {
    marginTop: 5,
    gap: 1,
  },
  svgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});



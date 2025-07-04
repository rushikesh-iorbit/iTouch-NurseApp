import React, { useState, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Text as SvgText, Circle, G } from 'react-native-svg';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import WheelColorPicker from 'react-native-wheel-color-picker';

export default function SvgViewHorizontal() {
  const [selectedColor, setSelectedColor] = useState<string>('#002afa');
  const [bedColors, setBedColors] = useState<{ [key: string]: string }>({});
  const [nurseColors, setNurseColors] = useState<{ [key: string]: string }>({});
  const [blinkingBed, setBlinkingBed] = useState<string | null>(null);

  // Animated value for blinking
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Start blinking animation
  const startBlinking = (bedName: string) => {
    setBlinkingBed(bedName);
    blinkAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  // Stop blinking animation
  const stopBlinking = () => {
    blinkAnim.stopAnimation();
    setBlinkingBed(null);
  };

  // Example: Blink for 3 seconds on bed press
  const handleBedPress = (bed: string, color: string) => {
    setBedColors(prev => ({ ...prev, [bed]: color }));
    startBlinking(bed);
    setTimeout(stopBlinking, 3000);
  };

  const handleNursePress = (nurse: string, color: string) => {
    setNurseColors(prev => ({ ...prev, [nurse]: color }));
  };

  const handleNursingStationPress = (nusingStation: string) => {
    //Alert.alert(`${nusingStation} pressed`);
  };

  const handleDoorPress = (door: string) => {
    Alert.alert(`${door} pressed`);
  };

  // Responsive layout
  const { width, height } = useWindowDimensions();
  const isHorizontal = width > height;
  const colorPickerSize = isHorizontal ? width * 0.3 : width * 0.9;
  const svgWidth = isHorizontal ? width - colorPickerSize : width;
  const svgHeight = isHorizontal ? height : height - colorPickerSize;

  // SVG's internal coordinate system
  const svgViewBoxWidth = 1000;
  const svgViewBoxHeight = 600;

  // Bed and nurse data (updated bed sizes)
  const beds = [
    { name: 'Bed 1', x: 150, y: 30 },
    { name: 'Bed 2', x: 270, y: 30 },
    { name: 'Bed 3', x: 390, y: 30 },
    { name: 'Bed 4', x: 550, y: 30 },
    { name: 'Bed 5', x: 670, y: 30 },
    { name: 'Bed 6', x: 920, y: 30, vertical: true },
    { name: 'Bed 7', x: 920, y: 140, vertical: true },
    { name: 'Bed 8', x: 920, y: 250, vertical: true },
    { name: 'Bed 9', x: 920, y: 360, vertical: true },
    { name: 'Bed 10', x: 920, y: 480, vertical: true },
    { name: 'Bed 11', x: 150, y: 520 },
    { name: 'Bed 12', x: 270, y: 520 },
    { name: 'Bed 13', x: 390, y: 520 },
    { name: 'Bed 14', x: 550, y: 520 },
    { name: 'Bed 15', x: 670, y: 520 },
  ];

  const nurses = [
    { name: 'Nurse 1', cx: 430, cy: 270 },
    { name: 'Nurse 2', cx: 500, cy: 270 },
    { name: 'Nurse 3', cx: 570, cy: 270 },
    { name: 'Nurse 4', cx: 465, cy: 320 },
    { name: 'Nurse 5', cx: 535, cy: 320 },
  ];

  // Animated Rect for blinking bed
  const AnimatedRect = Animated.createAnimatedComponent(Rect);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.responsiveWrapper,
          isHorizontal ? styles.horizontalWrapper : styles.verticalWrapper,
        ]}
      >
        {/* Color Picker */}
        <View
          style={[
            styles.colorPicker,
            isHorizontal
              ? { width: colorPickerSize, height: '100%' }
              : { width: '100%', height: colorPickerSize },
          ]}
        >
          <View style={{ width: colorPickerSize * 0.8, height: colorPickerSize * 0.8 }}>
            <WheelColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
            />
          </View>
        </View>

        {/* SVG Layout */}
        <View
          style={[
            styles.svgWrapper,
            isHorizontal
              ? { width: svgWidth, height: '100%' }
              : { width: '100%', height: svgHeight },
          ]}
        >
          <ReactNativeZoomableView
            maxZoom={20}
            contentWidth={svgViewBoxWidth}
            contentHeight={svgViewBoxHeight}
            style={{ flex: 1 }}
            bindToBorders={false}
          >
            <View style={{ width: svgWidth, height: svgHeight }}>
              <Svg
                width={svgWidth}
                height={svgHeight}
                viewBox={`0 0 ${svgViewBoxWidth} ${svgViewBoxHeight}`}
              >
                {/* Room Outline */}
                <Rect x="10" y="10" width="980" height="580" fill="#f9f9f9" stroke="black" strokeWidth="2" />

                {/* Door */}
                <Rect x="10" y="270" width="20" height="60" fill="#8B4513" />
                <SvgText x="12" y="305" fontSize="12" fill="white" transform="rotate(-90 12,305)">Door</SvgText>

                {/* Nursing Station - larger and with cross symbol */}
                <G>
                  <Rect x="350" y="150" width="300" height="300" fill="#cce5ff" stroke="black" />
                  <SvgText x="400" y="180" fontSize="24" fill="black">Nursing Station</SvgText>
                </G>

                {/* Nurses */}
                {nurses.map(nurse => (
                  <React.Fragment key={nurse.name}>
                    <Circle
                      cx={nurse.cx}
                      cy={nurse.cy}
                      r={28}
                      fill={nurseColors[nurse.name] || '#ccc'}
                    />
                    <SvgText
                      x={nurse.cx - 18}
                      y={nurse.cy + 5}
                      fontSize="12"
                      fill="black"
                    >{nurse.name}</SvgText>
                  </React.Fragment>
                ))}

                {/* Beds */}
                {beds.map(bed => {
                  const isBlinking = blinkingBed === bed.name;
                  const color = bedColors[bed.name] || '#b3e5fc';
                  const opacity = isBlinking
                    ? blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] })
                    : 1;

                  // Bed dimensions
                  const w = bed.vertical ? 50 : 100;
                  const h = bed.vertical ? 100 : 50;
                  const x = bed.x;
                  const y = bed.y;

                  // Bed "headboard" and "footboard"
                  const headboard = bed.vertical
                    ? <Rect x={x} y={y} width={w} height={10} rx={3} fill={color} opacity={0.7} />
                    : <Rect x={x} y={y} width={10} height={h} rx={3} fill={color} opacity={0.7} />;
                  const footboard = bed.vertical
                    ? <Rect x={x} y={y + h - 10} width={w} height={10} rx={3} fill={color} opacity={0.7} />
                    : <Rect x={x + w - 10} y={y} width={10} height={h} rx={3} fill={color} opacity={0.7} />;

                  // Bed "mattress"
                  const mattress = isBlinking ? (
                    <AnimatedRect
                      x={x + (bed.vertical ? 0 : 10)}
                      y={y + (bed.vertical ? 10 : 0)}
                      width={bed.vertical ? w : w - 20}
                      height={bed.vertical ? h - 20 : h}
                      rx={6}
                      fill="#fff"
                      stroke={color}
                      strokeWidth={3}
                      opacity={opacity}
                    />
                  ) : (
                    <Rect
                      x={x + (bed.vertical ? 0 : 10)}
                      y={y + (bed.vertical ? 10 : 0)}
                      width={bed.vertical ? w : w - 20}
                      height={bed.vertical ? h - 20 : h}
                      rx={6}
                      fill="#fff"
                      stroke={color}
                      strokeWidth={3}
                      opacity={1}
                    />
                  );

                  // Bed "wheels"
                  const wheels = bed.vertical
                    ? [
                        <Circle key="w1" cx={x + 6} cy={y + h - 4} r={4} fill={color} opacity={0.5} />,
                        <Circle key="w2" cx={x + w - 6} cy={y + h - 4} r={4} fill={color} opacity={0.5} />,
                      ]
                    : [
                        <Circle key="w1" cx={x + 8} cy={y + h - 4} r={4} fill={color} opacity={0.5} />,
                        <Circle key="w2" cx={x + w - 8} cy={y + h - 4} r={4} fill={color} opacity={0.5} />,
                      ];

                  return (
                    <React.Fragment key={bed.name}>
                      {headboard}
                      {footboard}
                      {mattress}
                      {wheels}
                      <SvgText
                        x={x + 10}
                        y={y + (bed.vertical ? h / 2 : h + 18)}
                        fontSize="14"
                        fill="black"
                      >{bed.name}</SvgText>
                    </React.Fragment>
                  );
                })}
              </Svg>

              {/* Overlays for Interaction */}
              {[
                { name: 'Bed 1', x: 150, y: 30, w: 100, h: 50 },
                { name: 'Bed 2', x: 270, y: 30, w: 100, h: 50 },
                { name: 'Bed 3', x: 390, y: 30, w: 100, h: 50 },
                { name: 'Bed 4', x: 550, y: 30, w: 100, h: 50 },
                { name: 'Bed 5', x: 670, y: 30, w: 100, h: 50 },
                { name: 'Bed 6', x: 920, y: 30, w: 50, h: 100 },
                { name: 'Bed 7', x: 920, y: 140, w: 50, h: 100 },
                { name: 'Bed 8', x: 920, y: 250, w: 50, h: 100 },
                { name: 'Bed 9', x: 920, y: 360, w: 50, h: 100 },
                { name: 'Bed 10', x: 920, y: 480, w: 50, h: 100 },
                { name: 'Bed 11', x: 150, y: 520, w: 100, h: 50 },
                { name: 'Bed 12', x: 270, y: 520, w: 100, h: 50 },
                { name: 'Bed 13', x: 390, y: 520, w: 100, h: 50 },
                { name: 'Bed 14', x: 550, y: 520, w: 100, h: 50 },
                { name: 'Bed 15', x: 670, y: 520, w: 100, h: 50 },
              ].map(b => (
                <TouchableOpacity
                  key={b.name}
                  onPress={() => handleBedPress(b.name, selectedColor)}
                  style={{
                    position: 'absolute',
                    top: (b.y / svgViewBoxHeight) * svgHeight,
                    left: (b.x / svgViewBoxWidth) * svgWidth,
                    width: (b.w / svgViewBoxWidth) * svgWidth,
                    height: (b.h / svgViewBoxHeight) * svgHeight,
                  }}
                />
              ))}

              {/* Nursing Station Overlay (match new size) */}
              <TouchableOpacity
                key="NursingStation"
                onPress={() => handleNursingStationPress("Nursing Station")}
                style={{
                  position: 'absolute',
                  top: (150 / svgViewBoxHeight) * svgHeight,
                  left: (350 / svgViewBoxWidth) * svgWidth,
                  width: (300 / svgViewBoxWidth) * svgWidth,
                  height: (300 / svgViewBoxHeight) * svgHeight,
                }}
              />

              {/* Nurses */}
              {nurses.map(nurse => (
                <TouchableOpacity
                  key={nurse.name}
                  onPress={() => handleNursePress(nurse.name, selectedColor)}
                  style={{
                    position: 'absolute',
                    top: ((nurse.cy - 28) / svgViewBoxHeight) * svgHeight, // center overlay on nurse
                    left: ((nurse.cx - 28) / svgViewBoxWidth) * svgWidth,
                    width: (56 / svgViewBoxWidth) * svgWidth,
                    height: (56 / svgViewBoxHeight) * svgHeight,
                    zIndex: 2,
                  }}
                />
              ))}

              {/* Door */}
              <TouchableOpacity
                key="Door"
                onPress={() => handleDoorPress("Door")}
                style={{
                  position: 'absolute',
                  top: (270 / svgViewBoxHeight) * svgHeight,
                  left: (10 / svgViewBoxWidth) * svgWidth,
                  width: (20 / svgViewBoxWidth) * svgWidth,
                  height: (60 / svgViewBoxHeight) * svgHeight,
                }}
              />
            </View>
          </ReactNativeZoomableView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  responsiveWrapper: {
    flex: 1,
  },
  horizontalWrapper: {
    flexDirection: 'row',
  },
  verticalWrapper: {
    flexDirection: 'column',
  },
  svgWrapper: {
    position: 'relative',
    backgroundColor: '#fff',
    minWidth: 0,
    overflow: 'hidden',
    flexShrink: 1,
  },
  colorPicker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
});
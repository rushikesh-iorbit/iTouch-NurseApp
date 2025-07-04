import React, { useState } from 'react';
import { Animated, SafeAreaView, Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import Svg, { Rect, Text as SvgText, Circle } from 'react-native-svg';
import { ColorWheel } from 'react-native-color-wheel';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

export default function SvgView() {
  const [selectedColor, setSelectedColor] = useState<string>('#002afa');
  const [bedColors, setBedColors] = useState<{ [key: string]: string }>({});
  const [nurseColors, setNurseColors] = useState<{ [key: string]: string }>({});
  const animatePress = new Animated.Value(1);

  type HSVColor = {
  h: number;
  s: number;
  v: number;
  hex?: string;
};

  Animated.timing(animatePress, {
  toValue: 0.8,
  duration: 150,
  useNativeDriver: true, 
}).start();

  const handleBedPress = (bed: string, color: string) => {
  Alert.alert(`${bed} pressed`, 'Color assigned!');
  setBedColors(prev => ({ ...prev, [bed]: color }));
};

const handleNursePress = (nurse: string, color: string) => {
  Alert.alert(`${nurse} pressed`, 'Color assigned!');
  setNurseColors(prev => ({ ...prev, [nurse]: color }));
};

const handleNursingStationPress= (nusingStation: string)=>{
  Alert.alert(`${nusingStation} pressed`);
}

  const handleDoorPress = (door: string) => {
    Alert.alert(`${door} pressed`);
  };

  function hsvToHex(h: number, s: number, v: number): string {
  s /= 100;
  v /= 100;

  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (val: number) =>
    Math.round((val + m) * 255).toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.colorPicker}>
        <ColorWheel
          initialColor={selectedColor}
           onColorChange={(color: HSVColor | string) => {
            if (typeof color === 'string') {
              setSelectedColor(color);
            } else {
              const hex = hsvToHex(color.h, color.s, color.v);
              setSelectedColor(hex);
            }
          }}

          style={{ width: 300, height: 300 }}
        />


      </View>

      <View style={styles.svgWrapper}>
        <ReactNativeZoomableView
          maxZoom={20}
          contentWidth={1000}
          contentHeight={600}
          style={{ flex: 1 }}
        >
          <View style={{ width: 1000, height: 600 }}>
            <Svg width="1000" height="600">
              {/* Room Outline */}
              <Rect x="10" y="10" width="980" height="580" fill="#f9f9f9" stroke="black" strokeWidth="2" />

              {/* Door */}
              <Rect x="10" y="270" width="20" height="60" fill="#8B4513" />
              <SvgText x="12" y="305" fontSize="12" fill="white" transform="rotate(-90 12,305)">Door</SvgText>

              {/* Nursing Station */}
              <Rect x="400" y="200" width="200" height="200" fill="#cce5ff" stroke="black" />
              <SvgText x="440" y="220" fontSize="16" fill="black">Nursing Station</SvgText>

              {/* Nurses */}
              {[
                { name: 'Nurse 1', cx: 430, cy: 270 },
                { name: 'Nurse 2', cx: 480, cy: 270 },
                { name: 'Nurse 3', cx: 530, cy: 270 },
                { name: 'Nurse 4', cx: 455, cy: 320 },
                { name: 'Nurse 5', cx: 505, cy: 320 },
              ].map(nurse => (
                <React.Fragment key={nurse.name}>
                  <Circle
                    cx={nurse.cx}
                    cy={nurse.cy}
                    r={15}
                    fill={nurseColors[nurse.name] || '#ccc'}
                  />
                  <SvgText
                    x={nurse.cx - 10}
                    y={nurse.cy + 5}
                    fontSize="10"
                    fill="black"
                  >{nurse.name.replace('Nurse ', 'Nurse ')}</SvgText>
                </React.Fragment>
              ))}

              {/* Beds */}
              {[
                { name: 'Bed 1', x: 150, y: 30 },
                { name: 'Bed 2', x: 250, y: 30 },
                { name: 'Bed 3', x: 350, y: 30 },
                { name: 'Bed 4', x: 550, y: 30 },
                { name: 'Bed 5', x: 650, y: 30 },
                { name: 'Bed 6', x: 920, y: 100, vertical: true },
                { name: 'Bed 7', x: 920, y: 180, vertical: true },
                { name: 'Bed 8', x: 920, y: 260, vertical: true },
                { name: 'Bed 9', x: 920, y: 340, vertical: true },
                { name: 'Bed 10', x: 920, y: 420, vertical: true },
                { name: 'Bed 11', x: 150, y: 540 },
                { name: 'Bed 12', x: 250, y: 540 },
                { name: 'Bed 13', x: 350, y: 540 },
                { name: 'Bed 14', x: 550, y: 540 },
                { name: 'Bed 15', x: 650, y: 540 },
              ].map(bed => (
                <React.Fragment key={bed.name}>
                  <Rect
                    x={bed.x}
                    y={bed.y}
                    width={bed.vertical ? 30 : 60}
                    height={bed.vertical ? 60 : 30}
                    fill={bedColors[bed.name] || '#eee'}
                    stroke="black"
                  />
                  <SvgText
                    x={bed.x + 10}
                    y={bed.y + (bed.vertical ? 30 : 20)}
                    fontSize="12"
                  >{bed.name}</SvgText>
                </React.Fragment>
              ))}
            </Svg>

           {/* Overlays for Interaction */}
            {/* Beds */}
            {[
              { name: 'Bed 1', x: 150, y: 30, w: 60, h: 30 },
              { name: 'Bed 2', x: 250, y: 30, w: 60, h: 30 },
              { name: 'Bed 3', x: 350, y: 30, w: 60, h: 30 },
              { name: 'Bed 4', x: 550, y: 30, w: 60, h: 30 },
              { name: 'Bed 5', x: 650, y: 30, w: 60, h: 30 },
              { name: 'Bed 6', x: 920, y: 100, w: 30, h: 60 },
              { name: 'Bed 7', x: 920, y: 180, w: 30, h: 60 },
              { name: 'Bed 8', x: 920, y: 260, w: 30, h: 60 },
              { name: 'Bed 9', x: 920, y: 340, w: 30, h: 60 },
              { name: 'Bed 10', x: 920, y: 420, w: 30, h: 60 },
              { name: 'Bed 11', x: 150, y: 540, w: 60, h: 30 },
              { name: 'Bed 12', x: 250, y: 540, w: 60, h: 30 },
              { name: 'Bed 13', x: 350, y: 540, w: 60, h: 30 },
              { name: 'Bed 14', x: 550, y: 540, w: 60, h: 30 },
              { name: 'Bed 15', x: 650, y: 540, w: 60, h: 30 },
            ].map(b => (
              <TouchableOpacity
                key={b.name}
                onPress={() => handleBedPress(b.name, selectedColor)}
                style={{
                  position: 'absolute',
                  top: b.y,
                  left: b.x,
                  width: b.w,
                  height: b.h,
                }}
              />
            ))}

            {/* Nursing Station */}
            <TouchableOpacity
              key="NursingStation"
              onPress={() => handleNursingStationPress("Nursing Station")}
              style={{
                position: 'absolute',
                top: 200,
                left: 400,
                width: 200,
                height: 200,
              }}
            />

            {/* Nurses */}
            {[
              { name: 'Nurse 1', x: 415, y: 255 },
              { name: 'Nurse 2', x: 465, y: 255 },
              { name: 'Nurse 3', x: 515, y: 255 },
              { name: 'Nurse 4', x: 440, y: 305 },
              { name: 'Nurse 5', x: 490, y: 305 },
            ].map(n => (
              <TouchableOpacity
                key={n.name}
                onPress={() => handleNursePress(n.name, selectedColor)}
                style={{
                  position: 'absolute',
                  top: n.y,
                  left: n.x,
                  width: 30,
                  height: 60,
                  // Optionally, add zIndex to ensure nurses are above nursing station
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
                top: 270,
                left: 10,
                width: 20,
                height: 60,
              }}
            />
          </View>
        </ReactNativeZoomableView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  colorPicker: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrapper: {
    flex: 1,
    position: 'relative',
  },
});

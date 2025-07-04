// components/ColorPicker.tsx
import React from 'react';
import { View } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  size?: number;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  size = 200,
}) => (
  <View style={{ width: size, height: size }}>
    <WheelColorPicker
      color={selectedColor}
      onColorChange={onColorChange}
      thumbSize={30}
      sliderSize={20}
    />
  </View>
);

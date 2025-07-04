// components/WithColorPicker.tsx
import React, { useState } from 'react';
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { ColorPicker } from './ColorPicker';

interface WithColorPickerProps {
  children: React.ReactNode;
  initialColor?: string;
}

export const WithColorPicker: React.FC<WithColorPickerProps> = ({ 
  children, 
  initialColor = '#ffcc00' 
}) => {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [selectionMode, setSelectionMode] = useState<'color' | 'element'>('color');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const { width, height } = useWindowDimensions();
  const isHorizontal = width > height;
  const colorPickerSize = isHorizontal ? width * 0.3 : width * 0.9;
  const contentWidth = isHorizontal ? width - colorPickerSize : width;
  const contentHeight = isHorizontal ? height : height - colorPickerSize;

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    setSelectionMode('element');
  };

  const handleColorPickerPress = () => {
    setSelectionMode('color');
  };

  return (
    <View style={[styles.container, isHorizontal ? styles.horizontal : styles.vertical]}>
      {/* Color Picker Section */}
      <View 
        style={[
          styles.colorPickerContainer,
          isHorizontal 
            ? { width: colorPickerSize, height: '100%' }
            : { width: '100%', height: colorPickerSize }
        ]}
        onTouchStart={handleColorPickerPress}
      >
        <Text style={styles.label}>
          {selectionMode === 'color' 
            ? 'Select a color first' 
            : `Now tap elements to apply ${currentColor}`}
        </Text>
        <Text style={styles.selectedItem}>
          {selectedTargetId ? `Last applied to: ${selectedTargetId}` : ''}
        </Text>
        <View style={{ width: colorPickerSize * 0.8, height: colorPickerSize * 0.8 }}>
          <ColorPicker 
            selectedColor={currentColor} 
            onColorChange={handleColorChange} 
            size={colorPickerSize * 0.8} 
          />
        </View>
      </View>

      {/* Content Section */}
      <View style={[
        styles.contentContainer,
        isHorizontal 
          ? { width: contentWidth, height: '100%' }
          : { width: '100%', height: contentHeight }
      ]}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              ...(child.props as object),
              colorMap: (child.props as any).colorMap || {},
              currentColor,
              selectionMode,
              onElementPress: (id: string) => {
                if (selectionMode === 'element') {
                  (child.props as any).onColorChange?.(id, currentColor);
                  setSelectedTargetId(id);
                }
              },
              selectedId: selectedTargetId,
              width: contentWidth,
              height: contentHeight
            });
          }
          return child;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  colorPickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    padding: 10,
  },
  contentContainer: {
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedItem: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
});
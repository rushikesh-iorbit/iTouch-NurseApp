// components/CloseButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type CloseButtonProps = {
  onPress: () => void;
};

const CloseButton: React.FC<CloseButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.closeButton}>
      <Text style={styles.closeText}>✕</Text>
    </TouchableOpacity>
  );
};

export default CloseButton;

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

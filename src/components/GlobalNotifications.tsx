import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Animated,
} from 'react-native';

const heart = require('../../assets/vectors/heart.png');
const drop = require('../../assets/vectors/drop.png');
const lungs = require('../../assets/vectors/lungs.png');

const mockBedAlerts = [
  {
    bedCode: 'B3',
    icon: 'heart',
    color: '#ff0000',
  },
  {
    bedCode: 'B4',
    icon: 'drop',
    color: '#ffaa00',
  },
  {
    bedCode: 'B5',
    icon: 'lungs',
    color: '#00aaff',
  },
  {
    bedCode: 'B6',
    icon: 'heart',
    color: '#ff0000',
  },
  {
    bedCode: 'B7',
    icon: 'drop',
    color: '#ffaa00',
  },
];

export const GlobalNotifications = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollHeight, setScrollHeight] = useState(1);
  const [contentHeight, setContentHeight] = useState(1);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        onLayout={(e) => setScrollHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(w, h) => setContentHeight(h)}
      >
        {mockBedAlerts.map((item, index) => (
          <View
            key={index}
            style={[styles.bedItem, { borderLeftColor: item.color }]}
          >
            <Text style={styles.bedCode}>{item.bedCode}</Text>
            <View style={styles.svgWrapper}>
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
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80, // slightly increased for scrollbar spacing
    backgroundColor: '#f6fbf6',
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingRight: 10, // adds space for scrollbar
    
  },
  bedItem: {
    width: '90%',
    height: 60,
    backgroundColor: '#f9f9f9',
    marginVertical: 8,
    borderRadius: 5,
    borderLeftWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
  },
  svgWrapper: {
    marginBottom: 4,
  },
  bedCode: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  iconStyle: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginTop: 2,
    resizeMode: 'contain',
  },
});

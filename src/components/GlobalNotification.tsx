import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MIN_WIDTH = 120;
const MAX_WIDTH = SCREEN_WIDTH * 0.6;

export const GlobalNotification = () => {
  const [panelWidth, setPanelWidth] = useState(new Animated.Value(260));

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
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <Animated.View style={[styles.leftPanel, { width: panelWidth }]}>
      <Text style={styles.sectionTitle}>Notifications :</Text>

      <ScrollView style={styles.notificationScroll} contentContainerStyle={styles.notificationList}>
        {[
          { bed: 'B103', msg: 'Oxygen saturation is dropping...', time: '15:45:00', color: '#ff0000' },
          { bed: 'B102', msg: 'Heart Rate is dropping...', time: '14:35:00', color: '#ffaa00' },
          { bed: 'B104', msg: '', time: '14:05:00', color: '#00aaff' },
        ].map((item, index) => (
          <View key={index} style={styles.notificationItem}>
            <View style={styles.notificationHeader}>
              <View style={[styles.iconCircle, { backgroundColor: item.color }]} />
              <Text style={styles.bedCode}>{item.bed}</Text>
            </View>
            <Text style={styles.notificationText}>{item.msg}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
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
    backgroundColor: '#f8f8f8',
    borderRightWidth: 1,
    borderColor: '#ddd',
    height: '100%',
    position: 'relative',
    zIndex: 10,
    borderTopRightRadius: 36,   
    borderBottomRightRadius: 36, 
    overflow: 'hidden', 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    margin: 10,
  },
  notificationScroll: {
    flex: 1,
    paddingHorizontal: 10,
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationItem: {
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationText: {
    fontSize: 14,
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 12,
    marginTop: 4,
    color: '#777',
    textAlign: 'right',
  },
 resizer: {
  width: 20,
  height: '100%',
  position: 'absolute',
  right: -10, // pushes it slightly outside the panel
  top: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 20,
},

homeButtonIndicator: {
  width: 70,
  height: 10,
  backgroundColor: '#2ecc71', 
  borderRadius: 2,
  transform: [{ rotate: '90deg' }],
  borderWidth: 0.5,          
  borderColor: '#999',
  opacity: 0.8,
},


});

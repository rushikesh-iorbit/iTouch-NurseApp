import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { getGlobalRaisedAlarm } from '../../services/nurseService';
import { Icons } from '../../../assets';

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
): React.FC<{ width?: number; height?: number; fill?: string }> => {
  switch (key) {
    case 'HR':
      return Icons.hr;
    case 'SPO2':
      return Icons.spo2;
    case 'RR':
      return Icons.rr;
    default:
      return Icons.default;
  }
};

type GlobalNotificationsProps = {
  alerts: any[];
  onNotificationClick?: () => void;
};

export const GlobalNotifications: React.FC<GlobalNotificationsProps> = ({ alerts, onNotificationClick }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollHeight, setScrollHeight] = useState(1);
  const [contentHeight, setContentHeight] = useState(1);
  // const [alerts, setAlerts] = useState<any[]>([]);

  const indicatorSize = (scrollHeight / contentHeight) * scrollHeight;
  const scrollableContentHeight = contentHeight - scrollHeight;
  const thumbScrollRange = scrollHeight - indicatorSize;

  const translateY = scrollY.interpolate({
    inputRange: [0, scrollableContentHeight > 0 ? scrollableContentHeight : 1],
    outputRange: [0, thumbScrollRange > 0 ? thumbScrollRange : 0],
    extrapolate: 'clamp',
  });

  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout;

  //   const fetchAlarms = async () => {
  //     try {
  //       const data = await getGlobalRaisedAlarm();
  //       if (Array.isArray(data)) {
  //         setAlerts(data);
  //       } else {
  //         setAlerts([]);
  //       }
  //     } catch (err) {
  //       console.error('Error fetching global alarms:', err);
  //       setAlerts([]);
  //     }
  //   };

  //   fetchAlarms();
  //   intervalId = setInterval(fetchAlarms, 5000); // every 5 seconds

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        onLayout={(e) => setScrollHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(w, h) => setContentHeight(h)}
      >
        {alerts.map((item, index) => {
          const paramKey = getParameterKey(item.violatedParameter);
          const IconComponent = getParameterIcon(paramKey);
          const priorityColor = getColorByPriority(item.priority);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.bedItem, { borderLeftColor: priorityColor }]}
              onPress={() => {
                onNotificationClick?.();
                // also trigger any other logic like opening the bed info if needed
              }}
            >
              <Text style={styles.bedCode}>
                {item.bedCode?.match(/B\d+$/)?.[0] || item?.bedCode || '-'}
              </Text>
              <View style={styles.svgWrapper}>
                <IconComponent width={24} height={24} fill={priorityColor} />
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>

      {contentHeight > scrollHeight && (
        <View style={styles.scrollBarTrack}>
          <Animated.View
            style={[
              styles.scrollBarThumb,
              {
                height: indicatorSize,
                transform: [{ translateY }],
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    backgroundColor: '#f6fbf6',
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingRight: 5,
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
    marginTop: 4,
  },
  bedCode: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  scrollBarTrack: {
    width: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'stretch',
  },
  scrollBarThumb: {
    width: 4,
    backgroundColor: '#4CAE51',
    borderRadius: 3,
  },
});

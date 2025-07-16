import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native';

const Menu = require('../../assets/icons/menu-line.png');
const NotificationIcon = require('../../assets/icons/notification-2-line.png');
import { logoutAPI } from '../services/nurseService';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  NurseLogin: undefined;
  TwoFactorAuth: undefined;
  Dashboard: undefined;
};
export const Header = () => {
  const [popupVisible, setPopupVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCurrentTime(time);
    };

    updateTime(); // Set initial time

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;

    const timeout = setTimeout(() => {
      updateTime();
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);
  
  const handleLogout = async () => {
  try {
    await logoutAPI();
    await AsyncStorage.multiRemove([
      'authCookie', 'userName', 'orgName', 'hospitalCode', 'wardCode'
    ]);
    navigation.reset({
      index: 0,
      routes: [{ name: 'NurseLogin' }],
    });
    Toast.show({
      type: 'success',
      text1: 'Logged out',
      text2: 'Session ended successfully.',
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: 'Logout Failed',
      text2: 'Please try again.',
    });
  }
};

const getFormattedDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }); 
};


  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setPopupVisible(true)}>
            <Image source={Menu} style={styles.menuIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>iTouch Nurse</Text>
        </View>

        {/* <View style={styles.headerRight}>
          <Text style={styles.date}>{getFormattedDate()} </Text>
          <Image source={NotificationIcon} style={styles.notificationIcon} />
        </View> */}
        <View style={styles.headerRight}>
          <Text style={styles.date}>{getFormattedDate()} </Text>
          <Text style={styles.time}>{currentTime}</Text>
        </View>
      </View>

      {/* Popup Modal */}
      <Modal
        transparent
        visible={popupVisible}
        animationType="none"
        onRequestClose={() => setPopupVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setPopupVisible(false)}>
          <View style={styles.popupBox}>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  notificationIcon: {
    width: 28,
    height: 28,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginRight: 10
  },
  time: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 50, 
    paddingLeft: 16,
  },
  popupBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 16,
  },
});

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
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import { logoutAPI } from '../services/nurseService';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native';

const MenuIconbutton = require('../../assets/icons/Menu_Button.png');
const SearchIcon = require('../../assets/icons/search_icon.png');
const FilterIcon = require('../../assets/icons/search_settings.png');


type RootStackParamList = {
  NurseLogin: undefined;
  TwoFactorAuth: undefined;
  Dashboard: undefined;
};
export const Header = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});

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
      <Menu>
        <MenuTrigger>
          <Image source={MenuIconbutton} style={styles.menuIcon} />
        </MenuTrigger>

        <MenuOptions
          customStyles={{
            optionsContainer: {
              borderRadius: 8,
              paddingVertical: 5,
              width: 150,
            },
          }}
        >
          <MenuOption onSelect={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>

      <Text style={styles.title}>iTouch Nurse</Text>
    </View>

        {/* <View style={styles.headerRight}>
          <Text style={styles.date}>{getFormattedDate()} </Text>
          <Image source={NotificationIcon} style={styles.notificationIcon} />
        </View> */}

          
         <View style={styles.searchContainer}>
          <Image
            source={SearchIcon}
            //style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#888"
            underlineColorAndroid="transparent"
            autoFocus={false}
          />
          <TouchableOpacity onPress={() => console.log('Filter clicked')}>
            <Image
              source={FilterIcon}
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.date}>{getFormattedDate()} </Text>
          <Text style={styles.time}>{currentTime}</Text>
        </View>
      </View>
        
        
    {/* Middle search bar */}
       
      {/* Popup Modal */}
      {/* <Modal
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
      </Modal> */}
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
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    backgroundColor: '#f8f9f9',
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
    resizeMode: 'contain',

  },
  notificationIcon: {
    width: 28,
    height: 28,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    marginRight: 10,
    fontWeight: '500',

  },
  time: {
    fontSize: 14,
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
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 8,
    marginHorizontal: 10,
    flex: 1,
    maxWidth: 300,
    height: 40,
    overflow: 'hidden',
  },
  searchIcon: {
    width: 24,
    height: 18,
    tintColor: '#888',
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    paddingVertical: 0,
    backgroundColor: '#fffefe',
    height: 18,
  },
  filterIcon: {
    width: 24,
    height: 18,
    // marginLeft: 20,
    objectFit: 'contain',
    backgroundColor: 'transparent',
  },
});

import React, { useState } from 'react';
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

export const Header = () => {
  const [popupVisible, setPopupVisible] = useState(false);

  const handleLogout = () => {
    setPopupVisible(false);
    console.log('Logging out...');
    // TODO: Add your logout logic here
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

        <View style={styles.headerRight}>
          <Text style={styles.date}>03 July 2025 </Text>
          <Image source={NotificationIcon} style={styles.notificationIcon} />
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

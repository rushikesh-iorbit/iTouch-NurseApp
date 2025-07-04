import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,ScrollView } from 'react-native';

export const GlobalNotification = ()=>{
    return(
            <View style={styles.leftPanel}>
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
            </View>   
    );
}

const styles = StyleSheet.create({

    leftPanel: {
    width: '100%',
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 12,
  },
  notificationScroll: {
  flex: 1,
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
});
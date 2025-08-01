import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, Pressable, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
const MonitoringVector = require('../../../assets/icons/monitoring.png');
const InstructionsVector = require('../../../assets/icons/instruction.png');
const WardTransferVector = require('../../../assets/icons/move_out.png');
const DelegateVector = require('../../../assets/icons/delegate.png');
const DoctorVector= require('../../../assets/icons/doctor.png');
import {getCurrentShiftNurses} from '../../services/nurseService';
import Toast from 'react-native-toast-message';

type NotificationCallOutModalProps = {
  visible: boolean;
  onClose: () => void;
  bedPatientInfo?: {
    bedCode: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    gender?: string;
    auditMe?: { createdtime?: string };

  }; 

};


const NotificationCallOutModal: React.FC<NotificationCallOutModalProps> = ({ visible, onClose, bedPatientInfo }) => {
  const [selectedTab, setSelectedTab] = useState<'instructions' | 'moveout' | 'delegate'>('instructions');
  const [nurses, setNurses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { width, height } = Dimensions.get('window');
  const modalWidth = width * 0.60;  // leaves 10% on each side - 0.7
  const modalHeight = height * 0.75; // 0.86

 let admissionDate = '-';
 if (bedPatientInfo?.auditMe?.createdtime) {
  const dateObj = new Date(bedPatientInfo.auditMe.createdtime);
  admissionDate = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

  return (
    
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
         <View style={[styles.card, { width: modalWidth, height: modalHeight }]}>
          {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAE51" />
          </View>
         ) : (
          <>
            <Pressable onPress={() => {
            setSelectedTab('instructions');
            onClose();
            }} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          {/* Header */}
          <View style={styles.header}>
              <View style={styles.leftHeader}>
                <Text style={styles.bedCode}>
                  {bedPatientInfo?.bedCode?.match(/B\d+$/)?.[0] || bedPatientInfo?.bedCode || '-'}
                </Text>
                <Text style={styles.name}>
                  {bedPatientInfo?.firstName} {bedPatientInfo?.lastName}
                </Text>
                <Text style={styles.gender}>
                  {bedPatientInfo?.gender === 'Male' ? 'M' : bedPatientInfo?.gender === 'Female' ? 'W' : bedPatientInfo?.gender}, Age: {bedPatientInfo?.age}
                </Text>
              </View>
          </View>

           
          <View style={{ flexDirection: 'row', marginTop: 2, gap: 6 }}>
            {/* Diagnosis + Alert Section */}
            <View style={{ width: '50%' }}>
              <View style={styles.alertBox}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertText}>High HR Detected</Text>
                  <Text style={styles.alertTime}>14:35:00</Text>
                </View>
                <Text style={styles.bpm}>132 <Text style={styles.bpmUnit}>bpm</Text></Text>
              </View>
            </View>

            
            {/* Conditional Right Panel based on selectedTab */}
            <View style={{ width: '50%' }}>
              {selectedTab === 'instructions' && (
                <View style={styles.instructionSection}>
                  <View style={styles.instructionHeaderRow}>
                    <Image source={InstructionsVector} style={styles.instructionIcon} />
                    <Text style={styles.instructionsHeader}>Instructions</Text>
                  </View>             
                  <Text style={styles.bullet}>• Start IV antibiotics at 9 AM</Text>
                  <Text style={styles.bullet}>• Monitor vitals every 15 minutes for 1 hour</Text>
                  <Text style={styles.bullet}>• Keep NPO until further notice</Text>
                </View>
              )}
              {selectedTab === 'moveout' && (
                <View style={styles.instructionSection}>
                  <View>
                    <View style={styles.instructionHeaderRow}>
                      <Image source={DoctorVector} style={styles.instructionIcon} />
                      <Text style={[styles.instructionsHeader, { color: '#4CAE51' }]}>Send To Doctor</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.confirmButton}>
                    <Text style={{ color: '#000', fontWeight: '600' }}>Send</Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedTab === 'delegate' && (
                <View style={styles.instructionSection}>
                  <View>
                    <View style={styles.instructionHeaderRow}>
                      <Image source={DelegateVector} style={styles.instructionIcon} />
                      <Text style={[styles.instructionsHeader, { color: '#4CAE51' }]}>Delegate</Text>
                    </View>
                    <Text style={styles.bullet}>
                      Select Nurse for Delegation
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.confirmButton}>
                    <Text style={{ color: '#000', fontWeight: '600' }}>Delegate</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>


          {/* Footer Buttons */}
          {/* <View style={styles.buttonRow}>
            <ActionButton label="Monitoring Screen" icon={MonitoringVector} />
            <ActionButton label="Instructions" icon={InstructionsVector} />
            <ActionButton label="Ward Transfer" icon={WardTransferVector} />
          </View> */}
          <View style={styles.buttonRow}>
            <ActionButton label="Monitoring Screen" icon={MonitoringVector} onPress={() => {}} isActive={false} />
            <ActionButton label="Instructions" icon={InstructionsVector} onPress={() => setSelectedTab('instructions')} isActive={selectedTab === 'instructions'} />
            <ActionButton label="Doctor" icon={DoctorVector} onPress={() => setSelectedTab('moveout')} isActive={selectedTab === 'moveout'} />
            <ActionButton 
              label="Delegate" 
              icon={DelegateVector} 
              onPress={async () => {
                setSelectedTab('delegate');
                try {
                  setIsLoading(true);
                  const response = await getCurrentShiftNurses();
                  setNurses(response.data || []);
                } catch (error) {
                  console.error('Error fetching nurses:', error);
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to fetch nurses list',
                  });
                } finally {
                  setIsLoading(false);
                }
              }} 
              isActive={selectedTab === 'delegate'} 
            />          
          </View>
          </>
          )}
        </View>
      </View>
    </Modal>
  );
};

// const ActionButton = ({ label, icon }: { label: string; icon: any }) => (
//   <TouchableOpacity style={styles.actionButton}>
//     <Image source={icon} style={styles.actionIcon} />
//     <Text style={styles.actionButtonText}>{label}</Text>
//   </TouchableOpacity>
// );

const ActionButton = ({ label, icon, onPress, isActive }: { label: string; icon: any; onPress: () => void; isActive: boolean }) => (
  <TouchableOpacity
    style={[
      styles.actionButton,
      { backgroundColor: isActive ? '#4CAE51' : '#C8E6CB' }, // Active = green, inactive = faded
    ]}
    onPress={onPress}
  >
    <Image source={icon} style={[styles.actionIcon, { tintColor: isActive ? '#fff' : '#1E4721' }]} />
  </TouchableOpacity>
);

export default NotificationCallOutModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(39, 36, 36, 0.14)',
    },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 3,
    padding: 6,
    elevation: 20,
    position: 'absolute',
    right: '4%',
    bottom:'5%',
  },
  loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
},
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width:'50%',
},

leftHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 0,
  flexShrink: 1,
},

rightHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},

 bedCode: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#4CAE51',
  marginRight: 4,
},
  name: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,

  },
  gender: {
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
  position: 'absolute',
  top: 4,
  right: 4,
  zIndex: 10,
  paddingHorizontal: 6,
  paddingVertical: 2,
  backgroundColor: '#eee',
  borderRadius: 16,

  // Shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,

  // Shadow for Android
  elevation: 3,
},
closeText: {
  fontSize: 16,
  fontWeight: 'bold',
},
  diagnosis: {
    gap: 8,
  },
  bullet: {
    fontSize: 12,
    color: '#222',
  },
  bold: {
    fontWeight: '600',
  },
  alertBox: {
    marginTop: 20,
    backgroundColor: '#fef4f4',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f5c2c2',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  alertText: {
    flex: 1,
    fontSize: 15,
    color: '#d00',
    fontWeight: '600',
  },
  alertTime: {
    fontSize: 12,
    color: '#777',
  },
  ecgImage: {
    height: 60,
    width: '100%',
    marginBottom: 6,
  },
  bpm: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  bpmUnit: {
    fontSize: 16,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 'auto',
    justifyContent: 'space-around',
    gap: 16,
  },
  actionButton: {
  flex: 1,
  backgroundColor: '#2ecc71',
  paddingVertical: 12,
  borderRadius: 2,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row', // add this
  gap: 6, // optional for spacing between icon and text
},
  actionIcon: {
  width: 20,
  height: 20,
  marginRight: 8,
  resizeMode: 'contain',
},
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  instructionSection: {
  flex: 1,
  padding: 6,
  borderColor: '#ccc',
  justifyContent: 'space-between', // This will push header to top and button to bottom

},
instructionsHeader: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 4,
  color: '#4CAE51',
},
confirmButton: {
  marginTop: 12,
  backgroundColor: '#FFFEFE',
  paddingVertical: 7,
  paddingHorizontal: 10,
  borderRadius: 6,
  alignSelf: 'stretch',
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 5,
},
instructionHeaderRow: {

  flexDirection: 'row',
  marginBottom: 4,
  gap: 6,
},

instructionIcon: {
  width: 20,
  height: 20,
  resizeMode: 'contain',
  tintColor: '#4CAE51',
},

contentRow: {
  flexDirection: 'row',
  marginTop: 20,
  alignItems: 'stretch',
},

leftColumn: {
  width: '48%',
},

verticalDivider: {
  width: 1,
  backgroundColor: '#aaa',
  marginHorizontal: 0,
  borderStyle: 'dashed',
  borderWidth: 0.8,
  borderColor: '#ccc',
  height: '100%',
},

rightColumn: {
  width: '48%',
},
verticalLine: {
    width: 2,
    backgroundColor: 'green',
    borderStyle: 'dashed',
    marginHorizontal: 10,
  },
});

import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, Pressable, Image, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
const MonitoringVector = require('../../../assets/icons/monitoring.png');
const InstructionsVector = require('../../../assets/icons/instruction.png');
const WardTransferVector = require('../../../assets/icons/move_out.png');
const DelegateVector = require('../../../assets/icons/delegate.png');
const DoctorVector= require('../../../assets/icons/doctor.png');
import {getCurrentShiftNurses, delegatePatient} from '../../services/nurseService';
import Toast from 'react-native-toast-message';
import { Nurse } from '../Nurse';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dropdownIcon = require('../../../assets/icons/dropdown.png');
const nurse_userIcon = require('../../../assets/icons/nurse_user.png');

type NotificationCallOutModalProps = {
  visible: boolean;
  onClose: () => void;
  bedPatientInfo?: {
    bedCode: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    gender?: string;
    patientCode?: string;
    auditMe?: { createdtime?: string };

  }; 

};


const NotificationCallOutModal: React.FC<NotificationCallOutModalProps> = ({ visible, onClose, bedPatientInfo }) => {
  const [selectedTab, setSelectedTab] = useState<'instructions' | 'moveout' | 'delegate'>('instructions');
  const [nurses, setNurses] = useState<any[]>([]);
  const [selectedNurseId, setSelectedNurseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { width, height } = Dimensions.get('window');
  const modalWidth = width * 0.60;  // leaves 10% on each side - 0.7
  const modalHeight = height * 0.75; // 0.86
 let admissionDate = '-';
 const currentPatient = bedPatientInfo?.patientCode;
 if (bedPatientInfo?.auditMe?.createdtime) {
  const dateObj = new Date(bedPatientInfo.auditMe.createdtime);
  admissionDate = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

    const handleDelegateConfirm = async () => {
    if (!selectedNurseId || !currentPatient) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a nurse and patient.',
      });
      return;
    }

    const currentNurseCode = await AsyncStorage.getItem('nurseCode');
    const shiftCode= await AsyncStorage.getItem('shiftCode');
    const wardCode = await AsyncStorage.getItem('wardCode');
    const newNurseCode = nurses.find(n => n.id === selectedNurseId)?.code;

    const payload = {
      shiftCode: shiftCode,
      wardCode: wardCode,
      patientCode: currentPatient,
      currentNurseCode,
      newNurseCode,
    };

    try {
      setIsLoading(true);
      const result = await delegatePatient(payload);
      onClose();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Patient delegated successfully',
      });
      // optionally close modal or reset selection
      setShowDropdown(false);
      setSelectedNurseId(null);
    } catch (error: any) {
      onClose();
      const apiErrorMessage =
      (typeof error?.response?.data === 'string'
        ? error.response.data
        : error?.response?.data?.message || error?.message) ||
      'Failed to delegate patient.';

      Toast.show({
        type: 'error',
        text1: 'Delegate Failed',
        text2: apiErrorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };


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
                    <Text style={styles.bullet}>Select Nurse for Delegation:</Text>

                    <View style={styles.dropdownWrapper}>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowDropdown(prev => !prev)}
                      >
                        <View style={styles.rowContainer}>
                            <Image source={nurse_userIcon} style={styles.icon} />
                            <Text style={{ color: selectedNurseId ? '#000' : '#888' }}>
                              {selectedNurseId
                                ? nurses.find(n => n.id === selectedNurseId)?.name
                                : 'Select Name'}
                            </Text>
                            <Image source={dropdownIcon} style={styles.dropdownIcon} />
                        </View>
                      </TouchableOpacity>

                      {showDropdown && (
                        <View style={styles.dropdownOverlay}>
                          <ScrollView nestedScrollEnabled style={styles.dropdownList}>
                            {nurses.map(nurse => (
                              <TouchableOpacity
                                key={nurse.id}
                                onPress={() => {
                                  setSelectedNurseId(nurse.id);
                                  setShowDropdown(false);
                                }}
                                style={styles.dropdownItem}
                              >
                                <View style={styles.rowContainer}>
                                  <Image source={nurse_userIcon} style={styles.icon} />
                                  <Text style={styles.nurseName}>{nurse.name}</Text>
                                  <Image source={dropdownIcon} style={styles.dropdownIcon} />
                                </View>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                  </View>

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => {
                      if (!selectedNurseId) {
                        Toast.show({ type: 'error', text1: 'Please select a nurse' });
                        return;
                      }
                      // Call your API here to delegate
                      console.log('Delegating to', selectedNurseId);
                    }}
                  >
                    <Text style={{ color: '#000', fontWeight: '600' }} onPress={handleDelegateConfirm}>Delegate</Text>
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
                    interface NurseApiResponse {
                    nurseId: string;
                    firstName: string;
                    lastName: string;
                    nurseCode: string;
                    }

                    interface MappedNurse {
                    id: string;
                    name: string;
                    code: string;
                    }

                    const mappedNurses: MappedNurse[] = (response as NurseApiResponse[] || []).map((nurse: NurseApiResponse): MappedNurse => ({
                    id: nurse.nurseId,
                    name: `${nurse.firstName} ${nurse.lastName}`,
                    code: nurse.nurseCode,
                    }));
                  setNurses(mappedNurses);
                  console.log('Nurses :', nurses);
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
  dropdownWrapper: {
  marginTop: 8,
  position: 'relative',
},

dropdown: {
  padding: 10,
  backgroundColor: '#fff',
  borderRadius: 4,
  borderColor: '#ccc',
  borderWidth: 1,
},

dropdownOverlay: {
  position: 'absolute',
  top: 45, // just below the button
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#ccc',
  zIndex: 1000,
  elevation: 10,
  maxHeight: 160, // Enough for ~4 items
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
},

dropdownList: {
  maxHeight: 160,
},

dropdownItem: {
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
rowContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // key to separating start, middle, end
  paddingHorizontal: 2,
},

dropdownIcon: {
  width: 14,
  height: 14,
  resizeMode: 'contain',
  tintColor: '#000',
  marginLeft: 8,
},

nurseName: {
  flex: 1, // take up remaining space between icons
  fontSize: 14,
  color: '#000',
  textAlign: 'left',
  marginHorizontal: 4,
},



});

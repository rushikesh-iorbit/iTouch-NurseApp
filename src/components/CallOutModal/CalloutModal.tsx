import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import CloseButton from './CloseButton'; // Reuse if needed
const MonitoringVector = require('../../../assets/vectors/Monitoring.png');
const InstructionsVector = require('../../../assets/vectors/Instruction.png');
const WardTransferVector = require('../../../assets/vectors/WardTransfer.png');


type CalloutModalProps = {
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


const CalloutModal: React.FC<CalloutModalProps> = ({ visible, onClose, bedPatientInfo }) => {
  const [selectedTab, setSelectedTab] = useState<'none' | 'instructions' | 'moveout'>('none');

 let admissionDate = '-';
if (bedPatientInfo?.auditMe?.createdtime) {
  const dateObj = new Date(bedPatientInfo.auditMe.createdtime);
  admissionDate = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }); // Format: "09 July 2025"
}

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            {/* LEFT SIDE: BedCode + Name + Gender + Age */}
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

            {/* RIGHT SIDE: Admission Date + Close Button */}
            <View style={styles.rightHeader}>
              <Text style={styles.admissionDate}>Admission date: {admissionDate}  </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>


          <View style={{ flexDirection: 'row', marginTop: 20, gap: 12 }}>
            {/* Diagnosis + Alert Section */}
            <View style={{ width: '50%' }}>
              <View style={styles.diagnosis}>
                <Text style={styles.bullet}>• Primary Diagnosis: <Text style={styles.bold}>Acute Gastroenteritis</Text></Text>
                <Text style={styles.bullet}>• Reason for Admission: <Text style={styles.bold}>Severe abdominal pain and vomiting</Text></Text>
              </View>

              <View style={styles.alertBox}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertText}>High HR Detected</Text>
                  <Text style={styles.alertTime}>14:35:00</Text>
                </View>
                <Text style={styles.bpm}>132 <Text style={styles.bpmUnit}>bpm</Text></Text>
              </View>
            </View>

            {(selectedTab === 'instructions' || selectedTab === 'moveout') && (
              <View style={styles.verticalDivider} />
            )}
            {/* Conditional Right Panel based on selectedTab */}
            <View style={{ width: '49%' }}>
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
                  <View style={styles.instructionHeaderRow}>
                    <Image source={WardTransferVector} style={styles.instructionIcon} />
                    <Text style={[styles.instructionsHeader, { color: '#2ecc71' }]}>Move Out</Text>
                  </View>                  
                  <Text style={styles.bullet}>
                    Are you sure want to move out Patient <Text style={styles.bold}>{bedPatientInfo?.firstName} {bedPatientInfo?.lastName}</Text> ({bedPatientInfo?.bedCode})?
                  </Text>
                  <TouchableOpacity style={styles.confirmButton}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Yes</Text>
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
            <ActionButton label="Move Out" icon={WardTransferVector} onPress={() => setSelectedTab('moveout')} isActive={selectedTab === 'moveout'} />
          </View>

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
      { backgroundColor: isActive ? '#2ecc71' : '#dfeee6' }, // Active = green, inactive = faded
    ]}
    onPress={onPress}
  >
    <Image source={icon} style={[styles.actionIcon, { tintColor: isActive ? '#fff' : '#666' }]} />
    <Text style={[styles.actionButtonText, { color: isActive ? '#fff' : '#666' }]}>{label}</Text>
  </TouchableOpacity>
);

export default CalloutModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 20,
  },
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
},

leftHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 6,
  flexShrink: 1,
},

rightHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

 bedCode: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#2ecc71',
  marginRight: 6,
},
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,

  },
  gender: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  admissionSection: {
    alignItems: 'flex-end',
  },
  admissionDate: {
    fontSize: 14,
    color: '#444',
  },
  closeButton: {
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
    marginTop: 16,
    gap: 6,
  },
  bullet: {
    fontSize: 15,
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
    marginTop: 20,
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
  flex: 1,
  backgroundColor: '#2ecc71',
  paddingVertical: 12,
  borderRadius: 6,
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
  padding: 12,
  borderColor: '#ccc',
  gap: 8,
},
instructionsHeader: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 4,
  color: '#2ecc71',
},
confirmButton: {
  marginTop: 12,
  backgroundColor: '#2ecc71',
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderRadius: 6,
  alignSelf: 'stretch',
  alignItems: 'center',
  justifyContent: 'center',
},
instructionHeaderRow: {

  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
  gap: 6,
},

instructionIcon: {
  width: 20,
  height: 20,
  resizeMode: 'contain',
  tintColor: '#2ecc71',
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

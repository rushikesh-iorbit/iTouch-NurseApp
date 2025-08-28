import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import ConfirmWithoutMonitoringModal from "./ConfirmWithoutMonitoringModal";

type AdmitPatientModalProps = {
  visible: boolean;
  onClose: () => void;
  patientInfo?: {
    firstName: string;
    lastName: string;
    mrNumber: string;
    age: string;
  };
  assignedDevices?: any[];
};

const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({ visible, onClose , patientInfo, assignedDevices = [] }) => {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [showConfirmWithoutMonitoring, setShowConfirmWithoutMonitoring] = useState(false);

  const { width, height } = Dimensions.get('window');
    const modalWidth = width * 0.5;  
    const modalHeight = height * 0.7; 
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollHeight, setScrollHeight] = useState(1);
  const [contentHeight, setContentHeight] = useState(1);

  const indicatorSize = (scrollHeight / contentHeight) * scrollHeight;
  const scrollableContentHeight = contentHeight - scrollHeight;
  const thumbScrollRange = scrollHeight - indicatorSize;

  const translateY = scrollY.interpolate({
    inputRange: [0, scrollableContentHeight > 0 ? scrollableContentHeight : 1],
    outputRange: [0, thumbScrollRange > 0 ? thumbScrollRange : 0],
    extrapolate: "clamp",
  });

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { width: modalWidth, height: modalHeight }]} >
          
          <Text style={styles.title}>Assign & Manage Devices</Text>

          {patientInfo != null ? (
            <>
              <View style={styles.parent}>
                <View style={styles.left}>
                  <View style={styles.patientInfo}>
                    <Text style={styles.label}>Patient Name</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.value}>{patientInfo.firstName} {patientInfo.lastName}</Text>
                  </View>

                  <View style={styles.patientInfo}>
                    <Text style={styles.label}>MRN No</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.value}>{patientInfo.mrNumber}</Text>
                  </View>

                  <View style={styles.patientInfo}>
                    <Text style={styles.label}>Age</Text>
                    <Text style={styles.colon}>:</Text>
                    <Text style={styles.value}>{patientInfo.age} yrs</Text>
                  </View>
                </View>

              <View style={styles.right}>
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ Add Devices</Text>
                </TouchableOpacity>
              </View>
              </View>
            </>
          ) : (
            <>
              <Text>No patient is Assigned to this Bed</Text>
            </>
          )}
      
        <View style={styles.deviceListWrapper}>
          <Animated.ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            onLayout={(e) => setScrollHeight(e.nativeEvent.layout.height)}
            onContentSizeChange={(w, h) => setContentHeight(h)}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {assignedDevices.length > 0 ? (
                <View style={styles.deviceSection}>
                  <View style={styles.deviceColumn}>
                    <Text style={styles.subTitle}>Fixed Device</Text>
                     <View style={[styles.deviceRow, styles.tableHeader]}>
                      <Text style={[styles.deviceText, styles.deviceColumnLeft]}>Type Select</Text>
                      <Text style={[styles.deviceText, styles.deviceColumnRight]}>Start/Stop</Text>
                     </View>

                    {assignedDevices.map((device, index) => {
                      const isSelected = selectedDevices.includes(device.deviceCode);

                      return (
                        <View key={index} style={styles.deviceRow}>
                          <Text style={styles.deviceText}>{device.deviceCode}</Text>
                          <Switch
                            value={isSelected}
                            onValueChange={(newValue) => {
                              if (newValue) {
                                setSelectedDevices((prev) => [...prev, device.deviceCode]);
                              } else {
                                setSelectedDevices((prev) =>
                                  prev.filter((code) => code !== device.deviceCode)
                                );
                              }
                            }}
                          />
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : (
                <Text>No devices assigned to this patient</Text>
              )}
          </Animated.ScrollView>

          {/* Scrollbar */}
          {contentHeight > scrollHeight && (
            <View style={styles.scrollBarTrack}>
              <Animated.View
                style={[
                  styles.scrollBarThumb,
                  { height: indicatorSize, transform: [{ translateY }] },
                ]}
              />
            </View>
          )}
        </View>
          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
           <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                if (selectedDevices.length === 0) {
                  setShowConfirmWithoutMonitoring(true);
                } else {
                  // Normal confirm flow (save devices, close modal, etc.)
                  //console.log("Devices assigned:", selectedDevices);
                  onClose();
                }
              }}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
            <ConfirmWithoutMonitoringModal
              visible={showConfirmWithoutMonitoring}
              onClose={() => setShowConfirmWithoutMonitoring(false)}
              onProceed={() => {
                setShowConfirmWithoutMonitoring(false);
                // Proceed logic without monitoring
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 10,
    elevation: 5,
  },
  deviceListWrapper: {
  flex: 1,
  flexDirection: "row",
},
scrollArea: {
  flex: 1,
},
scrollBarTrack: {
  width: 4,
  backgroundColor: "#e0e0e0",
  borderRadius: 3,
  marginLeft: 6,
},
scrollBarThumb: {
  width: 4,
  backgroundColor: "#4CAE51",
  borderRadius: 3,
},
  parent:{
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 10,
  },
  left:{
    flex: 0.7,
    justifyContent: "center",
    alignItems: "flex-start", 
    marginRight: 10,
  },
  right:{
    flex: 0.3,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
      textAlign: "left",
    },
    patientInfo: {
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "center",
  },
  label: {
    fontWeight: "400",
    width: 100,  
    textAlign: "left"
  },
  colon: {
    width: 10,        
    textAlign: "center",
  },
  value: {
    fontWeight: "bold",
    color: "#000",
    flexShrink: 1,
    width: 'auto',
  },

  addButton: {
    backgroundColor: "#4cae51",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 2,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  deviceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#a3a3a3ff",
    borderRadius: 6,
    padding: 8,
  },
  deviceColumn: {
    flex: 0.5,
    marginHorizontal: 2,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 3,
    textAlign: "left",
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  deviceText: {
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  cancelText: {
    fontWeight: "600",
    color: "#444",
  },
  confirmBtn: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#4cae51",
    alignItems: "center",
  },
  confirmText: {
    fontWeight: "600",
    color: "#fff",
  },
  tableHeader: {
  paddingBottom: 4,
  marginBottom: 6,
},
deviceColumnLeft: {
  flex: 0.7, 
  textAlign: "left",
},
deviceColumnRight: {
  flex: 0.3, 
  alignItems: "center",
  justifyContent: "center",
},
});

export default AdmitPatientModal;

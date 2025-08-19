import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";

type AdmitPatientModalProps = {
  visible: boolean;
  onClose: () => void;
  patientInfo?: {
    firstName: string;
    lastName: string;
    mrn: string;
    age: string;
  }
};

const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({ visible, onClose , patientInfo}) => {
  const [ecgMonitor, setEcgMonitor] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header Section */}
          <Text style={styles.title}>Assign & Manage Devices</Text>

          {/* Patient Info */}
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Patient Name :</Text>
            <Text style={styles.value}>James Smith</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.label}>MRN No :</Text>
            <Text style={styles.value}>123456789</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Age :</Text>
            <Text style={styles.value}>25yrs</Text>
          </View>

          {/* Add Devices Button */}
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Devices</Text>
          </TouchableOpacity>

          {/* Device Section */}
          <View style={styles.deviceSection}>
            {/* Fixed Device */}
            <View style={styles.deviceColumn}>
              <Text style={styles.subTitle}>Fixed Device</Text>
              <View style={styles.deviceRow}>
                <Text style={styles.deviceText}>ECG Monitor</Text>
                <Switch value={ecgMonitor} onValueChange={setEcgMonitor} />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
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
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  patientInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "600",
    width: 110,
  },
  value: {
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  deviceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  deviceColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  deviceText: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
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
    backgroundColor: "#28a745",
    alignItems: "center",
  },
  confirmText: {
    fontWeight: "600",
    color: "#fff",
  },
});

export default AdmitPatientModal;

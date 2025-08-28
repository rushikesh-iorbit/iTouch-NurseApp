import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";

type ConfirmWithoutMonitoringModalProps = {
  visible: boolean;
  onClose: () => void;
  onProceed: () => void;
};

const ConfirmWithoutMonitoringModal: React.FC<ConfirmWithoutMonitoringModalProps> = ({
  visible,
  onClose,
  onProceed,
}) => {
  const { width, height } = Dimensions.get("window");
  const modalWidth = width * 0.5;
  const modalHeight = height * 0.7;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.confirmBox, { width: modalWidth, height: modalHeight }]}>
          {/* Centered Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Patient assigned without active monitoring</Text>
            <Text style={styles.subtitle}>
              No monitoring devices have been started for this patient.
            </Text>
          </View>

          {/* Sticky Bottom Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onProceed}>
              <Text style={styles.confirmText}>Proceed without Monitoring</Text>
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
  confirmBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-between", // pushes actionRow to bottom
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
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
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: "#4cae51",
    alignItems: "center",
  },
  confirmText: {
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});

export default ConfirmWithoutMonitoringModal;

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme } from "../constants/colors";

const moveSteps = [
  "Name the move",
  "Choose a formation",
  "Pick the lineout call",
  "Save it to your play list",
];

export default function AddMoveScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: (StatusBar.currentHeight ?? 0) + 12 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Create</Text>
        <Text style={styles.title}>Add a move</Text>
        <Text style={styles.subtitle}>
          Build custom lineout plays and save them to your library.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ionicons name="add" size={34} color={theme.invertedText} />
        </View>
        <Text style={styles.heroTitle}>Move builder</Text>
        <Text style={styles.heroText}>
          The builder is ready for the next step: form inputs, player paths, and
          saved play storage.
        </Text>
      </View>

      <View style={styles.panel}>
        {moveSteps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Start new move</Text>
        <Ionicons name="arrow-forward" size={19} color={theme.invertedText} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    color: theme.mutedText,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    color: theme.text,
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    color: theme.mutedText,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
  heroCard: {
    borderRadius: 26,
    backgroundColor: theme.brand,
    padding: 22,
    marginBottom: 16,
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    marginBottom: 18,
  },
  heroTitle: {
    color: theme.invertedText,
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 8,
  },
  heroText: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: 15,
    lineHeight: 22,
  },
  panel: {
    borderRadius: 22,
    backgroundColor: theme.surface,
    padding: 16,
    marginBottom: 18,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  stepRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.brandSoft,
    marginRight: 12,
  },
  stepNumberText: {
    color: theme.brandAccent,
    fontSize: 13,
    fontWeight: "900",
  },
  stepText: {
    color: theme.text,
    fontSize: 15,
    fontWeight: "800",
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.brand,
  },
  primaryButtonText: {
    color: theme.invertedText,
    fontSize: 16,
    fontWeight: "900",
  },
});

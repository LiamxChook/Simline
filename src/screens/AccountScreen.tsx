import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { theme } from "../constants/colors";

const settings = [
  {
    icon: "person-outline",
    label: "Profile",
    value: "Coach profile",
  },
  {
    icon: "card-outline",
    label: "Plan",
    value: "Starter",
  },
  {
    icon: "cloud-upload-outline",
    label: "Backup",
    value: "Not connected",
  },
] as const;

export default function AccountScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [metricUnitsEnabled, setMetricUnitsEnabled] = useState(true);

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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>LC</Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Account</Text>
          <Text style={styles.title}>Liam Casey</Text>
          <Text style={styles.subtitle}>Coach workspace</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Formations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Calls</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>1.0x</Text>
          <Text style={styles.statLabel}>Default</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Settings</Text>
        <View style={styles.toggleRow}>
          <View style={styles.settingLabelWrap}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.text}
            />
            <Text style={styles.settingLabel}>Session reminders</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.surfaceMuted, true: theme.brandStrong }}
            thumbColor={theme.text}
          />
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.settingLabelWrap}>
            <Ionicons name="resize-outline" size={22} color={theme.text} />
            <Text style={styles.settingLabel}>Metric distances</Text>
          </View>
          <Switch
            value={metricUnitsEnabled}
            onValueChange={setMetricUnitsEnabled}
            trackColor={{ false: theme.surfaceMuted, true: theme.brandStrong }}
            thumbColor={theme.text}
          />
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Account</Text>
        {settings.map((item) => (
          <Pressable key={item.label} style={styles.listRow}>
            <View style={styles.listIcon}>
              <Ionicons name={item.icon} size={21} color={theme.text} />
            </View>
            <View style={styles.listText}>
              <Text style={styles.listLabel}>{item.label}</Text>
              <Text style={styles.listValue}>{item.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.mutedText} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.supportButton}>
        <Ionicons name="help-buoy-outline" size={20} color={theme.invertedText} />
        <Text style={styles.supportText}>Help and feedback</Text>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.brandStrong,
    marginRight: 14,
  },
  avatarText: {
    color: theme.text,
    fontSize: 22,
    fontWeight: "900",
  },
  headerCopy: {
    flex: 1,
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
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: theme.mutedText,
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: theme.surface,
    padding: 14,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  statValue: {
    color: theme.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  statLabel: {
    color: theme.mutedText,
    fontSize: 12,
    fontWeight: "700",
  },
  panel: {
    borderRadius: 20,
    backgroundColor: theme.surface,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  panelTitle: {
    color: theme.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },
  toggleRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingLabel: {
    color: theme.text,
    fontSize: 15,
    fontWeight: "700",
  },
  listRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  listIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surfaceMuted,
    marginRight: 12,
  },
  listText: {
    flex: 1,
  },
  listLabel: {
    color: theme.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3,
  },
  listValue: {
    color: theme.mutedText,
    fontSize: 13,
    fontWeight: "600",
  },
  supportButton: {
    minHeight: 54,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.brand,
  },
  supportText: {
    color: theme.invertedText,
    fontSize: 15,
    fontWeight: "900",
  },
});

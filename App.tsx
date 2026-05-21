import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme } from "./src/constants/colors";
import AccountScreen from "./src/screens/AccountScreen";
import AddMoveScreen from "./src/screens/AddMoveScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";

type TabId = "plays" | "add" | "account";

const tabs: {
  id: TabId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "plays", label: "Plays", icon: "list-outline" },
  { id: "add", label: "Add", icon: "add" },
  { id: "account", label: "Account", icon: "person-circle-outline" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("plays");
  const [isImmersivePlay, setIsImmersivePlay] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  if (!isSignedIn) {
    return <LoginScreen onSignIn={() => setIsSignedIn(true)} />;
  }

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar
        hidden={isImmersivePlay}
        barStyle="dark-content"
        backgroundColor={theme.background}
      />
      <View style={styles.screen}>
        {activeTab === "plays" ? (
          <HomeScreen onImmersiveChange={setIsImmersivePlay} />
        ) : null}
        {activeTab === "add" ? <AddMoveScreen /> : null}
        {activeTab === "account" ? <AccountScreen /> : null}
      </View>
      {!isImmersivePlay ? <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tabButton,
                tab.id === "add" && styles.addTabButton,
                isActive && styles.tabButtonActive,
              ]}
            >
              <View
                style={[
                  tab.id === "add" && styles.addIconWrap,
                  isActive && tab.id === "add" && styles.addIconWrapActive,
                ]}
              >
                <Ionicons
                  name={tab.icon}
                  size={tab.id === "add" ? 30 : 22}
                  color={
                    tab.id === "add"
                      ? theme.invertedText
                      : isActive
                        ? theme.brand
                        : theme.mutedText
                  }
                />
              </View>
              {tab.id !== "add" ? (
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: theme.background,
  },
  screen: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.surface,
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabButtonActive: {
    backgroundColor: "transparent",
  },
  addTabButton: {
    marginTop: -20,
  },
  addIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.brand,
    borderWidth: 4,
    borderColor: theme.surface,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 3,
  },
  addIconWrapActive: {
    backgroundColor: theme.brandAccent,
  },
  tabLabel: {
    color: theme.mutedText,
    fontSize: 11,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: theme.text,
  },
});

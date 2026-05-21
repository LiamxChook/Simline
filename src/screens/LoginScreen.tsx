import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { theme } from "../constants/colors";

type LoginScreenProps = {
  onSignIn: () => void;
};

const loginBackground = require("../../assets/images/loginBackground.png");
const simlineLogo = require("../../assets/images/simlineLogo.png");

export default function LoginScreen({ onSignIn }: LoginScreenProps) {
  const { height, width } = useWindowDimensions();
  const isCompact = height < 720;
  const isLandscape = width > height;
  const horizontalInset = width < 380 ? 26 : 30;
  const bottomInset = isCompact ? 28 : 36;

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Image
        source={loginBackground}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <View style={styles.imageFade} />
      <View style={styles.warmTint} />
      <View style={styles.bottomShade} />

      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.brandWrap,
            isCompact && styles.brandWrapCompact,
          ]}
        >
          <Image
            source={simlineLogo}
            resizeMode="contain"
            style={[styles.logo, isCompact && styles.logoCompact]}
          />
          <Text style={[styles.brand, isCompact && styles.brandCompact]}>Simline</Text>
          <Text style={[styles.motto, isCompact && styles.mottoCompact]}>
            Plan plays. Move as one.
          </Text>
        </View>

        <View
          style={[
            styles.actions,
            { paddingHorizontal: horizontalInset, paddingBottom: bottomInset },
            isLandscape && styles.actionsLandscape,
          ]}
        >
          <Pressable
            accessibilityRole="button"
            onPress={onSignIn}
            style={({ pressed }) => [
              styles.authButton,
              styles.appleButton,
              isCompact && styles.authButtonCompact,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons name="logo-apple" size={21} color={theme.text} />
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onSignIn}
            style={({ pressed }) => [
              styles.authButton,
              styles.googleButton,
              isCompact && styles.authButtonCompact,
              pressed && styles.buttonPressed,
            ]}
          >
            <Ionicons name="logo-google" size={20} color={theme.invertedText} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050608",
    overflow: "hidden",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  imageFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 7, 10, 0.22)",
  },
  warmTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20, 58, 38, 0.14)",
  },
  bottomShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "54%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 18 : 18,
  },
  brandWrap: {
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  brandWrapCompact: {
    paddingVertical: 8,
  },
  logo: {
    width: 76,
    height: 76,
    marginBottom: 2,
  },
  logoCompact: {
    width: 58,
    height: 58,
  },
  brand: {
    color: theme.invertedText,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 32,
  },
  brandCompact: {
    fontSize: 23,
    lineHeight: 27,
  },
  motto: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },
  mottoCompact: {
    fontSize: 12,
    marginTop: 3,
  },
  actions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    alignSelf: "center",
  },
  actionsLandscape: {
    maxWidth: 420,
    left: undefined,
    right: 0,
  },
  authButton: {
    height: 56,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 11,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  authButtonCompact: {
    height: 52,
    borderRadius: 16,
  },
  appleButton: {
    backgroundColor: theme.invertedText,
  },
  googleButton: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.34)",
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  appleButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "800",
  },
  googleButtonText: {
    color: theme.invertedText,
    fontSize: 16,
    fontWeight: "800",
  },
});

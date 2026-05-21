import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import FieldView from "../components/FieldView";
import { theme } from "../constants/colors";
import {
  formationTypeOptions,
  playerNumbers,
  SavedPlay,
  savedPlays,
} from "../constants/formations";

type HomeScreenProps = {
  onImmersiveChange?: (isImmersive: boolean) => void;
};

const speedOptions = [0.5, 1, 1.5, 2];

export default function HomeScreen({ onImmersiveChange }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const [selectedPlay, setSelectedPlay] = useState<SavedPlay | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [resetSignal, setResetSignal] = useState(0);
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);

  useEffect(() => {
    onImmersiveChange?.(Boolean(selectedPlay));

    return () => {
      onImmersiveChange?.(false);
    };
  }, [onImmersiveChange, selectedPlay]);

  if (selectedPlay) {
    const call = formationTypeOptions.find(
      (option) => option.id === selectedPlay.formationType
    );

    return (
      <View style={styles.detailScreen}>
        <FieldView
          expanded
          play={selectedPlay}
          isPlaying={isPlaying}
          speed={speed}
          resetSignal={resetSignal}
          selectedFormation={selectedPlay.formation}
          formationType={selectedPlay.formationType}
        />

        <View style={styles.playOverlayTop}>
          <Pressable
            onPress={() => {
              setIsPlaying(false);
              setIsSpeedOpen(false);
              setSelectedPlay(null);
            }}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color={theme.invertedText} />
          </Pressable>
          <View style={styles.detailTitlePill}>
            <Text style={styles.detailTitle}>{selectedPlay.title}</Text>
            <Text style={styles.detailSubtitle}>
              {selectedPlay.formation} · {call?.label}
            </Text>
          </View>
        </View>

        <View style={styles.playOverlayBottom}>
          <Pressable
            onPress={() => {
              setIsSpeedOpen(false);
              setIsPlaying((previous) => !previous);
            }}
            style={[styles.floatingButton, styles.primaryControl]}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color={theme.invertedText}
            />
            <Text style={styles.primaryControlText}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setIsPlaying(false);
              setIsSpeedOpen(false);
              setResetSignal((previous) => previous + 1);
            }}
            style={styles.iconControl}
          >
            <Ionicons name="refresh" size={20} color={theme.invertedText} />
          </Pressable>

          <View style={styles.speedMenuWrap}>
            {isSpeedOpen ? (
              <View style={styles.speedMenu}>
                {speedOptions.map((option) => {
                  const isSelected = speed === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setSpeed(option);
                        setIsSpeedOpen(false);
                      }}
                      style={[
                        styles.speedOption,
                        isSelected && styles.speedOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.speedOptionText,
                          isSelected && styles.speedOptionTextSelected,
                        ]}
                      >
                        {option.toFixed(1)}x
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
            <Pressable
              onPress={() => setIsSpeedOpen((previous) => !previous)}
              style={styles.speedButton}
            >
              <Text style={styles.speedButtonText}>{speed.toFixed(1)}x</Text>
              <Ionicons
                name={isSpeedOpen ? "chevron-down" : "chevron-up"}
                size={18}
                color={theme.invertedText}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: width < 380 ? 16 : 20,
          paddingTop: (StatusBar.currentHeight ?? 0) + 16,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Simline</Text>
          <Text style={styles.title}>Plays</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="library-outline" size={23} color={theme.invertedText} />
        </View>
      </View>

      <Text style={styles.introText}>
        Review saved lineout moves and replay them on the field.
      </Text>

      <View style={styles.playList}>
        {savedPlays.map((play) => {
          const call = formationTypeOptions.find(
            (option) => option.id === play.formationType
          );

          return (
            <Pressable
              key={play.id}
              onPress={() => {
                setIsPlaying(false);
                setSpeed(1);
                setResetSignal((previous) => previous + 1);
                setSelectedPlay(play);
              }}
              style={styles.playCard}
            >
              <View style={styles.playCardTop}>
                <View style={styles.playIcon}>
                  <Ionicons
                    name="git-branch-outline"
                    size={21}
                    color={theme.invertedText}
                  />
                </View>
                <View style={styles.playMeta}>
                  <Text style={styles.playTitle}>{play.title}</Text>
                  <Text style={styles.playSubtitle}>
                    {play.formation} · {call?.label}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.mutedText} />
              </View>

              <Text style={styles.playDescription}>{play.description}</Text>

              <View style={styles.playDetails}>
                <Text style={styles.playDetailText}>
                  Target #{playerNumbers[play.targetIndex]}
                </Text>
                <Text style={styles.playDetailText}>
                  {play.dummyIndex === undefined
                    ? "No dummy"
                    : `Dummy #${playerNumbers[play.dummyIndex]}`}
                </Text>
                <Text style={styles.playDetailText}>
                  Exit {formatExit(play.exit)}
                </Text>
              </View>

              <View style={styles.tagRow}>
                {play.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function formatExit(exit: SavedPlay["exit"]) {
  if (exit === "scrumhalf") {
    return "9";
  }

  return exit;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  eyebrow: {
    color: theme.mutedText,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    color: theme.text,
    fontSize: 31,
    fontWeight: "800",
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.brand,
  },
  introText: {
    color: theme.mutedText,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 18,
  },
  playList: {
    gap: 12,
  },
  playCard: {
    borderRadius: 18,
    backgroundColor: theme.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 1,
  },
  playCardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  playIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.brand,
    marginRight: 12,
  },
  playMeta: {
    flex: 1,
  },
  playTitle: {
    color: theme.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 3,
  },
  playSubtitle: {
    color: theme.mutedText,
    fontSize: 13,
    fontWeight: "600",
  },
  playDescription: {
    color: theme.subtleText,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  playDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  playDetailText: {
    color: theme.text,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: theme.brandSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    backgroundColor: theme.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tagText: {
    color: theme.subtleText,
    fontSize: 12,
    fontWeight: "700",
  },
  detailScreen: {
    flex: 1,
    backgroundColor: theme.field,
  },
  playOverlayTop: {
    position: "absolute",
    top: (StatusBar.currentHeight ?? 0) + 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.78)",
  },
  detailTitle: {
    color: theme.invertedText,
    fontSize: 15,
    fontWeight: "800",
  },
  detailSubtitle: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  detailTitlePill: {
    maxWidth: 250,
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.78)",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  playOverlayBottom: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 18,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
  },
  floatingButton: {
    minHeight: 50,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 22,
  },
  primaryControl: {
    minWidth: 132,
    backgroundColor: "rgba(20, 32, 25, 0.9)",
  },
  primaryControlText: {
    color: theme.invertedText,
    fontSize: 15,
    fontWeight: "800",
  },
  iconControl: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(20, 32, 25, 0.78)",
  },
  speedMenuWrap: {
    width: 96,
  },
  speedButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(20, 32, 25, 0.78)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  speedButtonText: {
    color: theme.invertedText,
    fontSize: 14,
    fontWeight: "900",
  },
  speedMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 56,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(15, 23, 42, 0.92)",
  },
  speedOption: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  speedOptionSelected: {
    backgroundColor: "rgba(249, 115, 22, 0.95)",
  },
  speedOptionText: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: 13,
    fontWeight: "800",
  },
  speedOptionTextSelected: {
    color: theme.invertedText,
  },
});

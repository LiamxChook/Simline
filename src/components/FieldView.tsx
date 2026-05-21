import { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { theme } from "../constants/colors";
import {
  formationPresets,
  FormationName,
  FormationTypeId,
  getAnimationOffset,
  playerNumbers,
  SavedPlay,
} from "../constants/formations";
import PlayerBadge from "./PlayerBadge";

type FieldViewProps = {
  isPlaying: boolean;
  speed: number;
  resetSignal: number;
  selectedFormation: FormationName | null;
  formationType: FormationTypeId | null;
  play?: SavedPlay;
  expanded?: boolean;
};

type PlayerPosition = {
  x: number;
  y: number;
};

type Point = {
  x: number;
  y: number;
};

const fieldWidthMeters = 22;
const fieldLengthMeters = 28;
const lineoutStartMeter = 5;
const lineoutEndMeter = 15;
const touchlineMeter = 1.2;
const animationDuration = 5;

export default function FieldView({
  isPlaying,
  speed,
  resetSignal,
  selectedFormation,
  formationType,
  play,
  expanded = false,
}: FieldViewProps) {
  const { height, width } = useWindowDimensions();
  const [currentTime, setCurrentTime] = useState(0);

  const fieldWidth = expanded ? width : Math.min(width - 32, 460);
  const defaultHeight = fieldLengthMeters * (fieldWidth / fieldWidthMeters);
  const fieldHeight = expanded ? height : defaultHeight;
  const pixelsPerMeter = fieldWidth / fieldWidthMeters;
  const pixelsPerVerticalMeter = fieldHeight / fieldLengthMeters;
  const formation = selectedFormation ? formationPresets[selectedFormation] : null;
  const phase = (currentTime % animationDuration) / animationDuration;

  useEffect(() => {
    setCurrentTime(0);
  }, [selectedFormation, resetSignal]);

  useEffect(() => {
    if (!isPlaying || !formation) {
      return;
    }

    let frame = 0;
    let lastTime = Date.now();

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setCurrentTime(
        (previousTime) => (previousTime + delta * speed) % animationDuration
      );
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [formation, isPlaying, speed]);

  if (!formation) {
    return (
      <View style={[styles.placeholder, { minHeight: Math.max(fieldHeight, 320) }]}>
        <Text style={styles.placeholderTitle}>Select a formation</Text>
        <Text style={styles.placeholderText}>
          Choose a formation above to view the rugby lineout animation.
        </Text>
      </View>
    );
  }

  const positions = getPlayerPositions({
    currentTime,
    formationType,
    numberOfPlayers: formation.numberOfPlayers,
    play,
  });
  const targetIndex = play?.targetIndex ?? Math.floor(formation.numberOfPlayers / 2);
  const dummyIndex = play?.dummyIndex;
  const targetPosition = positions[targetIndex] ?? positions[0];
  const lineY = targetPosition.y * pixelsPerVerticalMeter;
  const targetPulse = getCuePulse(phase, "target");
  const targetActive = isCueActive(phase, "target");
  const target = {
    x: targetPosition.x * pixelsPerMeter,
    y: targetPosition.y * pixelsPerVerticalMeter,
  };
  const hooker = {
    x: pixelsPerMeter * touchlineMeter,
    y: lineY,
  };
  const receiver = getReceiverPoint({
    exit: play?.exit ?? "scrumhalf",
    positions,
    targetIndex,
    lineY,
    pixelsPerMeter,
    pixelsPerVerticalMeter,
  });
  const ball = getBallPoint({
    phase,
    hooker,
    target,
    receiver,
  });

  return (
    <View
      style={[
        styles.field,
        {
          width: fieldWidth,
          height: fieldHeight,
          borderRadius: expanded ? 0 : 22,
          borderWidth: expanded ? 0 : 2,
        },
      ]}
    >
      <View style={[styles.touchLine, { left: pixelsPerMeter * touchlineMeter }]} />
      <View
        style={[styles.fiveMetreLine, { left: lineoutStartMeter * pixelsPerMeter }]}
      />
      <View
        style={[styles.fifteenMetreLine, { left: lineoutEndMeter * pixelsPerMeter }]}
      />
      <View style={[styles.halfwayLine, { top: pixelsPerVerticalMeter * 4 }]} />
      <View style={[styles.tenMetreLine, { top: pixelsPerVerticalMeter * 10 }]} />

      <Text
        style={[
          styles.fieldLineLabel,
          {
            left: lineoutStartMeter * pixelsPerMeter - 18,
            top: pixelsPerVerticalMeter * 0.8,
          },
        ]}
      >
        5m
      </Text>
      <Text
        style={[
          styles.fieldLineLabel,
          {
            left: lineoutEndMeter * pixelsPerMeter - 20,
            top: pixelsPerVerticalMeter * 0.8,
          },
        ]}
      >
        15m
      </Text>
      <Text
        style={[
          styles.upfieldLabel,
          {
            left: pixelsPerMeter * 16.4,
            top: pixelsPerVerticalMeter * 1.6,
          },
        ]}
      >
        Upfield
      </Text>

      <Text style={styles.phasePill}>{getPhaseLabel(phase, play?.exit)}</Text>

      <View
        style={[
          styles.hooker,
          {
            left: pixelsPerMeter * touchlineMeter,
            top: lineY,
          },
        ]}
      >
        <Text style={styles.hookerText}>2</Text>
      </View>
      <Text
        style={[
          styles.touchLabel,
          {
            left: pixelsPerMeter * 0.6,
            top: lineY + 26,
          },
        ]}
      >
        Thrower
      </Text>

      <PathCue from={hooker} to={target} active={phase < 0.52} variant="throw" />
      <PathCue from={target} to={receiver} active={phase >= 0.5} variant="pass" />

      <View
        style={[
          styles.receiver,
          {
            left: receiver.x,
            top: receiver.y,
          },
        ]}
      >
        <Text style={styles.receiverText}>{play?.exit === "maul" ? "Maul" : "9"}</Text>
      </View>

      {positions.map((position, index) => {
        const isTarget = index === targetIndex;
        const isDummy = index === dummyIndex;
        const dummyPulse = isDummy ? getCuePulse(phase, "dummy") : 0;
        const isDummyActive = isDummy && isCueActive(phase, "dummy");
        const cuePulse = isTarget
          ? targetPulse
          : isDummyActive
            ? dummyPulse
            : 0;
        const left = position.x * pixelsPerMeter;
        const top = position.y * pixelsPerVerticalMeter;
        const isLifter = isPodLifter(index, targetIndex, formation.numberOfPlayers);
        const isCatchSupportActive = isLifter && isCueActive(phase, "target");
        const isActiveJumper = isTarget ? targetActive : isDummyActive;

        return (
          <View
            key={`${selectedFormation}-${index}`}
            style={[
              styles.playerWrap,
              {
                left,
                top,
              },
            ]}
          >
            {(isTarget || isDummy) && (
              <View
                style={[
                  styles.jumpRing,
                  isDummyActive ? styles.dummyRing : styles.targetRing,
                  {
                    opacity: cuePulse * 0.86,
                    transform: [{ scale: 0.92 + cuePulse * 0.2 }],
                  },
                ]}
              />
            )}
            {isLifter && (
              <View
                style={[
                  styles.liftCue,
                  { opacity: isCatchSupportActive ? 0.95 : 0.28 },
                ]}
              />
            )}
            <PlayerBadge number={playerNumbers[index]} active={isActiveJumper} />
            {(isTarget || isDummy || isLifter) && (
              <Text
                style={[
                  styles.actionLabel,
                  isDummy && styles.dummyLabel,
                  {
                    opacity:
                      isActiveJumper || isCatchSupportActive ? 1 : 0,
                  },
                ]}
              >
                {isTarget ? "Jumper" : isDummy ? "Dummy" : "Lift"}
              </Text>
            )}
          </View>
        );
      })}

      <View
        style={[
          styles.ball,
          {
            left: ball.x,
            top: ball.y,
          },
        ]}
      />
    </View>
  );
}

function getPlayerPositions({
  currentTime,
  formationType,
  numberOfPlayers,
  play,
}: {
  currentTime: number;
  formationType: FormationTypeId | null;
  numberOfPlayers: number;
  play?: SavedPlay;
}): PlayerPosition[] {
  const spacing = getPlayerSpacing(numberOfPlayers);
  const targetIndex = play?.targetIndex ?? Math.floor(numberOfPlayers / 2);
  const phase = (currentTime % animationDuration) / animationDuration;
  const liftProgress = smoothStep(0.2, 0.5, phase);
  const exitProgress = smoothStep(0.58, 1, phase);
  const baseY = 16;

  return Array.from({ length: numberOfPlayers }, (_, index) => {
    const baseXMeter = lineoutStartMeter + index * spacing;
    const targetBaseXMeter = lineoutStartMeter + targetIndex * spacing;
    const callOffset = getAnimationOffset(
      index,
      numberOfPlayers,
      currentTime,
      formationType
    );
    const targetCallOffset = getAnimationOffset(
      targetIndex,
      numberOfPlayers,
      currentTime,
      formationType
    );
    const targetXMeter = clampLineoutMeter(targetBaseXMeter + targetCallOffset);
    const maulSqueeze =
      play?.exit === "maul" ? (targetIndex - index) * 0.44 * exitProgress : 0;
    const peel = play?.exit === "tail" && index >= targetIndex ? 0.5 * exitProgress : 0;
    const currentX = clampLineoutMeter(baseXMeter + callOffset + maulSqueeze + peel);
    const lifterSide = getLifterSide(index, targetIndex, numberOfPlayers);
    const liftSetX =
      lifterSide === 0
        ? currentX
        : clampLineoutMeter(targetXMeter + lifterSide * 1.08);
    const upfieldExit =
      play?.exit === "maul" && Math.abs(index - targetIndex) <= 2
        ? -1.35 * exitProgress
        : 0;

    return {
      x: lerp(currentX, liftSetX, liftProgress),
      y: baseY + upfieldExit,
    };
  });
}

function getPlayerSpacing(playerCount: number) {
  if (playerCount <= 1) {
    return 0;
  }

  return (lineoutEndMeter - lineoutStartMeter) / (playerCount - 1);
}

function clampLineoutMeter(value: number) {
  return Math.max(lineoutStartMeter, Math.min(lineoutEndMeter, value));
}

function getCuePulse(phase: number, type: "target" | "dummy") {
  const start = type === "target" ? 0.24 : 0.12;
  const end = type === "target" ? 0.58 : 0.36;
  const progress = smoothStep(start, end, phase);

  return Math.sin(progress * Math.PI);
}

function isCueActive(phase: number, type: "target" | "dummy") {
  const start = type === "target" ? 0.24 : 0.12;
  const end = type === "target" ? 0.58 : 0.36;

  return phase >= start && phase <= end;
}

function getReceiverPoint({
  exit,
  positions,
  targetIndex,
  lineY,
  pixelsPerMeter,
  pixelsPerVerticalMeter,
}: {
  exit: SavedPlay["exit"];
  positions: PlayerPosition[];
  targetIndex: number;
  lineY: number;
  pixelsPerMeter: number;
  pixelsPerVerticalMeter: number;
}) {
  const target = positions[targetIndex] ?? positions[0];
  const tail = positions[positions.length - 1] ?? target;

  if (exit === "maul") {
    return {
      x: target.x * pixelsPerMeter,
      y: lineY - 1.7 * pixelsPerVerticalMeter,
    };
  }

  if (exit === "tail") {
    return {
      x: clampLineoutMeter(tail.x + 1.2) * pixelsPerMeter,
      y: lineY - 2.25 * pixelsPerVerticalMeter,
    };
  }

  return {
    x: Math.min(fieldWidthMeters - 1, target.x + 2.1) * pixelsPerMeter,
    y: lineY - 2.25 * pixelsPerVerticalMeter,
  };
}

function getBallPoint({
  phase,
  hooker,
  target,
  receiver,
}: {
  phase: number;
  hooker: Point;
  target: Point;
  receiver: Point;
}) {
  if (phase < 0.42) {
    const progress = phase / 0.42;

    return {
      x: lerp(hooker.x, target.x, progress),
      y: lerp(hooker.y, target.y, progress) - Math.sin(progress * Math.PI) * 28,
    };
  }

  if (phase < 0.58) {
    return target;
  }

  if (phase < 0.86) {
    const progress = (phase - 0.58) / 0.28;

    return {
      x: lerp(target.x, receiver.x, progress),
      y:
        lerp(target.y, receiver.y, progress) -
        Math.sin(progress * Math.PI) * 16,
    };
  }

  return receiver;
}

function getPhaseLabel(phase: number, exit?: SavedPlay["exit"]) {
  if (phase < 0.18) {
    return "Set";
  }

  if (phase < 0.42) {
    return "Throw";
  }

  if (phase < 0.58) {
    return "Catch";
  }

  if (phase < 0.84) {
    return "Transfer";
  }

  return exit === "maul" ? "Maul set" : "Exit";
}

function isPodLifter(index: number, targetIndex: number, totalPlayers: number) {
  return (
    index === Math.max(0, targetIndex - 1) ||
    index === Math.min(totalPlayers - 1, targetIndex + 1)
  );
}

function getLifterSide(index: number, targetIndex: number, totalPlayers: number) {
  if (index === Math.max(0, targetIndex - 1)) {
    return -1;
  }

  if (index === Math.min(totalPlayers - 1, targetIndex + 1)) {
    return 1;
  }

  return 0;
}

function PathCue({
  from,
  to,
  active,
  variant,
}: {
  from: Point;
  to: Point;
  active: boolean;
  variant: "throw" | "pass";
}) {
  const width = distance(from, to);
  const angle = `${Math.atan2(to.y - from.y, to.x - from.x)}rad`;
  const center = {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2,
  };

  return (
    <View
      style={[
        styles.pathCue,
        variant === "pass" && styles.passCue,
        {
          left: center.x - width / 2,
          top: center.y,
          width,
          opacity: active ? 0.85 : 0.18,
          transform: [{ rotate: angle }],
        },
      ]}
    />
  );
}

function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function smoothStep(start: number, end: number, value: number) {
  const progress = Math.max(0, Math.min(1, (value - start) / (end - start)));

  return progress * progress * (3 - 2 * progress);
}

const styles = StyleSheet.create({
  placeholder: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: theme.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  placeholderTitle: {
    color: theme.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  placeholderText: {
    color: theme.mutedText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  field: {
    alignSelf: "center",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.fieldBorder,
    backgroundColor: theme.field,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
    overflow: "hidden",
  },
  touchLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "rgba(255, 255, 255, 0.86)",
  },
  fiveMetreLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  fifteenMetreLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  halfwayLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.34)",
  },
  tenMetreLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  fieldLineLabel: {
    position: "absolute",
    color: theme.invertedText,
    fontSize: 11,
    fontWeight: "900",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(2, 6, 23, 0.28)",
  },
  upfieldLabel: {
    position: "absolute",
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  playerWrap: {
    position: "absolute",
    transform: [{ translateX: -21 }, { translateY: -21 }],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
  },
  phasePill: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 7,
    color: theme.text,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  hooker: {
    position: "absolute",
    width: 34,
    height: 34,
    borderRadius: 17,
    transform: [{ translateX: -17 }, { translateY: -17 }],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#111827",
    zIndex: 5,
  },
  hookerText: {
    color: theme.text,
    fontSize: 13,
    fontWeight: "900",
  },
  touchLabel: {
    position: "absolute",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 10,
    fontWeight: "800",
    transform: [{ translateX: -24 }],
  },
  receiver: {
    position: "absolute",
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    transform: [{ translateX: -17 }, { translateY: -17 }],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#0F172A",
    paddingHorizontal: 8,
    zIndex: 3,
  },
  receiverText: {
    color: theme.text,
    fontSize: 11,
    fontWeight: "900",
  },
  ball: {
    position: "absolute",
    width: 18,
    height: 13,
    borderRadius: 9,
    transform: [{ translateX: -9 }, { translateY: -7 }, { rotate: "-18deg" }],
    backgroundColor: "#B45309",
    borderWidth: 2,
    borderColor: "#FED7AA",
    zIndex: 8,
  },
  pathCue: {
    position: "absolute",
    height: 3,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.78)",
    zIndex: 2,
  },
  passCue: {
    backgroundColor: "rgba(254, 215, 170, 0.9)",
  },
  jumpRing: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
  },
  targetRing: {
    borderColor: "rgba(254, 215, 170, 0.92)",
  },
  dummyRing: {
    borderColor: "rgba(255, 255, 255, 0.65)",
  },
  liftCue: {
    position: "absolute",
    bottom: -14,
    width: 30,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(254, 215, 170, 0.9)",
  },
  actionLabel: {
    position: "absolute",
    top: -31,
    color: theme.invertedText,
    fontSize: 10,
    fontWeight: "900",
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 42, 0.78)",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dummyLabel: {
    color: theme.invertedText,
    backgroundColor: "rgba(15, 23, 42, 0.68)",
  },
});

import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';

const BG = '#020202';
const ACCENT = '#B2D5E5';
const DIM = 'rgba(178, 213, 229, 0.16)';
const FAINT = 'rgba(178, 213, 229, 0.5)';
const SURFACE = 'rgba(178, 213, 229, 0.05)';
const HAIRLINE = 'rgba(178, 213, 229, 0.1)';

// ── Sample day ─────────────────────────────────────────────
const GOAL_MIN = 45;
const ACTIVE_MIN = 32;
const DISTANCE = '6.4'; // km
const AVG_HR = 148;
const KCAL = 412;

const ZONES = [
  { key: 'Z1 Easy', pct: 0.18 },
  { key: 'Z2 Fat burn', pct: 0.42 },
  { key: 'Z3 Aerobic', pct: 0.74 },
  { key: 'Z4 Threshold', pct: 0.36 },
  { key: 'Z5 Max', pct: 0.08 },
];

const SESSIONS = [
  { name: 'Morning Run', detail: '5.2 km · 5:48 /km', kcal: 318, time: '06:50', done: true },
  { name: 'Zone 2 Walk', detail: '1.2 km · brisk', kcal: 94, time: '12:30', done: true },
  { name: 'Evening Cycle', detail: 'Planned · 20 min', kcal: 0, time: '—', done: false },
];

const RING_SIZE = 268;
const TICKS = 64;

function TickRing({ progress }: { progress: number }) {
  const litCount = Math.round(TICKS * Math.min(progress, 1));
  return (
    <View style={styles.ring} pointerEvents="none">
      {Array.from({ length: TICKS }).map((_, i) => {
        const lit = i < litCount;
        const edge = i === litCount - 1;
        return (
          <View
            key={i}
            style={[styles.tickBox, { transform: [{ rotate: `${(i / TICKS) * 360}deg` }] }]}>
            <View
              style={[
                styles.tick,
                lit
                  ? { backgroundColor: ACCENT, height: edge ? 22 : 18 }
                  : { backgroundColor: DIM, height: 12 },
                edge && styles.tickGlow,
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

export default function CardioScreen() {
  const insets = useSafeAreaInsets();
  const progress = useMemo(() => ACTIVE_MIN / GOAL_MIN, []);

  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 720,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const rise = (delay: number) => ({
    opacity: enter,
    transform: [
      { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [16 + delay, 0] }) },
    ],
  });

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          paddingBottom: insets.bottom + 36,
          paddingHorizontal: 22,
        }}>
        <Animated.View style={[styles.header, rise(0)]}>
          <View>
            <Text style={styles.eyebrow}>CARDIO · TODAY</Text>
            <Text style={styles.title}>Active Minutes</Text>
          </View>
          <View style={styles.streak}>
            <Text style={styles.streakNum}>{AVG_HR}</Text>
            <Text style={styles.streakLabel}>avg{'\n'}bpm</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.hero, rise(8)]}>
          <TickRing progress={progress} />
          <View style={styles.ringCenter}>
            <Text style={styles.heroLabel}>ACTIVE</Text>
            <Text style={styles.heroNum}>
              {ACTIVE_MIN}
              <Text style={styles.heroNumDim}>/{GOAL_MIN}</Text>
            </Text>
            <Text style={styles.heroUnit}>minutes</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.budget, rise(12)]}>
          {[
            { k: 'Distance', v: `${DISTANCE}km` },
            { k: 'Avg HR', v: `${AVG_HR}` },
            { k: 'Burned', v: `${KCAL}` },
          ].map((s, i) => (
            <View key={s.k} style={[styles.budgetCell, i < 2 && styles.budgetDivider]}>
              <Text style={styles.budgetVal}>{s.v}</Text>
              <Text style={styles.budgetKey}>{s.k}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.card, rise(16)]}>
          <Text style={styles.sectionLabel}>HEART RATE ZONES</Text>
          {ZONES.map((z) => (
            <View key={z.key} style={styles.macro}>
              <View style={styles.macroHead}>
                <Text style={styles.macroLabel}>{z.key}</Text>
                <Text style={styles.macroVal}>{Math.round(z.pct * 100)}%</Text>
              </View>
              <View style={styles.macroTrack}>
                <View style={[styles.macroFill, { width: `${z.pct * 100}%` }]} />
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.mealsHead, rise(20)]}>
          <Text style={styles.sectionLabel}>SESSIONS</Text>
          <Text style={styles.mealsTotal}>{KCAL} kcal</Text>
        </Animated.View>

        <Animated.View style={rise(24)}>
          {SESSIONS.map((s) => (
            <Pressable
              key={s.name}
              style={({ pressed }) => [styles.meal, pressed && styles.mealPressed]}>
              <View style={[styles.mealDot, s.done ? styles.dotLogged : styles.dotEmpty]} />
              <View style={styles.mealBody}>
                <Text style={styles.mealName}>{s.name}</Text>
                <Text style={styles.mealDetail}>{s.detail}</Text>
              </View>
              <View style={styles.mealRight}>
                {s.done ? (
                  <>
                    <Text style={styles.mealKcal}>{s.kcal}</Text>
                    <Text style={styles.mealTime}>{s.time}</Text>
                  </>
                ) : (
                  <Text style={styles.mealAdd}>+ start</Text>
                )}
              </View>
            </Pressable>
          ))}
        </Animated.View>

        <Animated.View style={rise(28)}>
          <Pressable style={({ pressed }) => [styles.logBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.logBtnText}>▶  Start session</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 26,
  },
  eyebrow: { color: FAINT, fontSize: 11, letterSpacing: 3, fontFamily: Fonts.mono, marginBottom: 6 },
  title: { color: '#fff', fontSize: 30, fontWeight: '700', letterSpacing: -0.5, fontFamily: Fonts.rounded },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  streakNum: { color: ACCENT, fontSize: 20, fontWeight: '700', fontFamily: Fonts.mono },
  streakLabel: { color: FAINT, fontSize: 9, letterSpacing: 1, lineHeight: 11 },

  hero: { height: RING_SIZE, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  ring: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center' },
  tickBox: { position: 'absolute', width: RING_SIZE, height: RING_SIZE, alignItems: 'center' },
  tick: { width: 3, borderRadius: 2, marginTop: 4 },
  tickGlow: { shadowColor: ACCENT, shadowOpacity: 0.9, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  heroLabel: { color: FAINT, fontSize: 11, letterSpacing: 4, fontFamily: Fonts.mono, marginBottom: 4 },
  heroNum: { color: '#fff', fontSize: 64, fontWeight: '800', letterSpacing: -2, fontFamily: Fonts.rounded },
  heroNumDim: { color: FAINT, fontSize: 40 },
  heroUnit: { color: ACCENT, fontSize: 13, letterSpacing: 1, marginTop: 2 },

  budget: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 18,
    backgroundColor: SURFACE,
    paddingVertical: 16,
    marginBottom: 22,
  },
  budgetCell: { flex: 1, alignItems: 'center' },
  budgetDivider: { borderRightWidth: 1, borderRightColor: HAIRLINE },
  budgetVal: { color: '#fff', fontSize: 20, fontWeight: '700', fontFamily: Fonts.mono },
  budgetKey: { color: FAINT, fontSize: 10, letterSpacing: 2, marginTop: 4 },

  card: { borderWidth: 1, borderColor: HAIRLINE, borderRadius: 18, padding: 18, marginBottom: 26 },
  sectionLabel: { color: FAINT, fontSize: 11, letterSpacing: 3, fontFamily: Fonts.mono },
  macro: { marginTop: 16 },
  macroHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  macroLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  macroVal: { color: ACCENT, fontSize: 14, fontWeight: '700', fontFamily: Fonts.mono },
  macroTrack: { height: 6, borderRadius: 3, backgroundColor: DIM, overflow: 'hidden' },
  macroFill: { height: 6, borderRadius: 3, backgroundColor: ACCENT },

  mealsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  mealsTotal: { color: FAINT, fontSize: 12, fontFamily: Fonts.mono, letterSpacing: 1 },
  meal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
  },
  mealPressed: { backgroundColor: SURFACE },
  mealDot: { width: 9, height: 9, borderRadius: 5, marginRight: 14 },
  dotLogged: { backgroundColor: ACCENT },
  dotEmpty: { borderWidth: 1.5, borderColor: FAINT, backgroundColor: 'transparent' },
  mealBody: { flex: 1 },
  mealName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  mealDetail: { color: FAINT, fontSize: 12, marginTop: 3, fontFamily: Fonts.mono },
  mealRight: { alignItems: 'flex-end' },
  mealKcal: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: Fonts.mono },
  mealTime: { color: FAINT, fontSize: 11, marginTop: 2, fontFamily: Fonts.mono },
  mealAdd: { color: ACCENT, fontSize: 14, fontWeight: '600' },

  logBtn: { marginTop: 24, backgroundColor: ACCENT, borderRadius: 16, paddingVertical: 17, alignItems: 'center' },
  logBtnText: { color: BG, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});

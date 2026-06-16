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
const GOAL = 2200;
const CONSUMED = 1480;
const BURNED = 320;
const REMAINING = GOAL - CONSUMED + BURNED;

const MACROS = [
  { key: 'Protein', value: 96, goal: 140, unit: 'g' },
  { key: 'Carbs', value: 184, goal: 240, unit: 'g' },
  { key: 'Fat', value: 48, goal: 70, unit: 'g' },
];

const MEALS = [
  { name: 'Breakfast', detail: 'Oats · berries · whey', kcal: 420, time: '07:40', logged: true },
  { name: 'Lunch', detail: 'Chicken bowl · greens', kcal: 640, time: '13:10', logged: true },
  { name: 'Snack', detail: 'Almonds · apple', kcal: 420, time: '16:25', logged: true },
  { name: 'Dinner', detail: 'Planned · not logged', kcal: 0, time: '—', logged: false },
];

// ── Radial tick ring (pure RN transforms, no SVG) ──────────
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
            style={[
              styles.tickBox,
              { transform: [{ rotate: `${(i / TICKS) * 360}deg` }] },
            ]}>
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

function MacroBar({ label, value, goal, unit }: { label: string; value: number; goal: number; unit: string }) {
  const pct = Math.min(value / goal, 1);
  return (
    <View style={styles.macro}>
      <View style={styles.macroHead}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroVal}>
          {value}
          <Text style={styles.macroGoal}>
            /{goal}
            {unit}
          </Text>
        </Text>
      </View>
      <View style={styles.macroTrack}>
        <View style={[styles.macroFill, { width: `${pct * 100}%` }]} />
      </View>
    </View>
  );
}

export default function DietScreen() {
  const insets = useSafeAreaInsets();
  const progress = useMemo(() => CONSUMED / GOAL, []);

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
      {
        translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [16 + delay, 0] }),
      },
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
        {/* Header */}
        <Animated.View style={[styles.header, rise(0)]}>
          <View>
            <Text style={styles.eyebrow}>MONDAY · JUN 16</Text>
            <Text style={styles.title}>Today&apos;s Intake</Text>
          </View>
          <View style={styles.streak}>
            <Text style={styles.streakNum}>12</Text>
            <Text style={styles.streakLabel}>day{'\n'}streak</Text>
          </View>
        </Animated.View>

        {/* Hero ring */}
        <Animated.View style={[styles.hero, rise(8)]}>
          <TickRing progress={progress} />
          <View style={styles.ringCenter}>
            <Text style={styles.heroLabel}>REMAINING</Text>
            <Text style={styles.heroNum}>{REMAINING.toLocaleString()}</Text>
            <Text style={styles.heroUnit}>kcal left</Text>
          </View>
        </Animated.View>

        {/* Budget row */}
        <Animated.View style={[styles.budget, rise(12)]}>
          {[
            { k: 'Goal', v: GOAL },
            { k: 'Food', v: CONSUMED },
            { k: 'Burned', v: BURNED },
          ].map((s, i) => (
            <View key={s.k} style={[styles.budgetCell, i < 2 && styles.budgetDivider]}>
              <Text style={styles.budgetVal}>{s.v.toLocaleString()}</Text>
              <Text style={styles.budgetKey}>{s.k}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Macros */}
        <Animated.View style={[styles.card, rise(16)]}>
          <Text style={styles.sectionLabel}>MACRONUTRIENTS</Text>
          {MACROS.map((m) => (
            <MacroBar key={m.key} label={m.key} value={m.value} goal={m.goal} unit={m.unit} />
          ))}
        </Animated.View>

        {/* Meals */}
        <Animated.View style={[styles.mealsHead, rise(20)]}>
          <Text style={styles.sectionLabel}>MEALS</Text>
          <Text style={styles.mealsTotal}>{CONSUMED.toLocaleString()} kcal</Text>
        </Animated.View>

        <Animated.View style={rise(24)}>
          {MEALS.map((meal) => (
            <Pressable
              key={meal.name}
              style={({ pressed }) => [styles.meal, pressed && styles.mealPressed]}>
              <View style={[styles.mealDot, meal.logged ? styles.dotLogged : styles.dotEmpty]} />
              <View style={styles.mealBody}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDetail}>{meal.detail}</Text>
              </View>
              <View style={styles.mealRight}>
                {meal.logged ? (
                  <>
                    <Text style={styles.mealKcal}>{meal.kcal}</Text>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </>
                ) : (
                  <Text style={styles.mealAdd}>+ add</Text>
                )}
              </View>
            </Pressable>
          ))}
        </Animated.View>

        {/* Log button */}
        <Animated.View style={rise(28)}>
          <Pressable style={({ pressed }) => [styles.logBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.logBtnText}>＋  Log food</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 26,
  },
  eyebrow: {
    color: FAINT,
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: Fonts.mono,
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontFamily: Fonts.rounded,
  },
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
  streakNum: { color: ACCENT, fontSize: 22, fontWeight: '700', fontFamily: Fonts.mono },
  streakLabel: { color: FAINT, fontSize: 9, letterSpacing: 1, lineHeight: 11 },

  // Hero ring
  hero: {
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  ring: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center' },
  tickBox: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
  },
  tick: { width: 3, borderRadius: 2, marginTop: 4 },
  tickGlow: {
    shadowColor: ACCENT,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  heroLabel: { color: FAINT, fontSize: 11, letterSpacing: 4, fontFamily: Fonts.mono, marginBottom: 4 },
  heroNum: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
    fontFamily: Fonts.rounded,
  },
  heroUnit: { color: ACCENT, fontSize: 13, letterSpacing: 1, marginTop: 2 },

  // Budget
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

  // Card / macros
  card: {
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 18,
    padding: 18,
    marginBottom: 26,
  },
  sectionLabel: { color: FAINT, fontSize: 11, letterSpacing: 3, fontFamily: Fonts.mono },
  macro: { marginTop: 16 },
  macroHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  macroLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  macroVal: { color: ACCENT, fontSize: 14, fontWeight: '700', fontFamily: Fonts.mono },
  macroGoal: { color: FAINT, fontWeight: '400' },
  macroTrack: { height: 6, borderRadius: 3, backgroundColor: DIM, overflow: 'hidden' },
  macroFill: { height: 6, borderRadius: 3, backgroundColor: ACCENT },

  // Meals
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
  mealDetail: { color: FAINT, fontSize: 12, marginTop: 3 },
  mealRight: { alignItems: 'flex-end' },
  mealKcal: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: Fonts.mono },
  mealTime: { color: FAINT, fontSize: 11, marginTop: 2, fontFamily: Fonts.mono },
  mealAdd: { color: ACCENT, fontSize: 14, fontWeight: '600' },

  // Log button
  logBtn: {
    marginTop: 24,
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
  },
  logBtnText: { color: BG, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});

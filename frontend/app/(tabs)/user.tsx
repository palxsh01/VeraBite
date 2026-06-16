import { useEffect, useRef } from 'react';
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

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

const BG = '#020202';
const ACCENT = '#B2D5E5';
const FAINT = 'rgba(178, 213, 229, 0.5)';
const SURFACE = 'rgba(178, 213, 229, 0.05)';
const HAIRLINE = 'rgba(178, 213, 229, 0.1)';

const PROFILE = {
  name: 'Palash Shivnani',
  handle: '@palash · since 2024',
  initials: 'PS',
};

const STATS = [
  { k: 'Weight', v: '74.2', unit: 'kg' },
  { k: 'Height', v: '178', unit: 'cm' },
  { k: 'BMI', v: '23.4', unit: '' },
];

const GOALS = [
  { label: 'Daily calories', value: '2,200 kcal' },
  { label: 'Protein target', value: '140 g' },
  { label: 'Weekly workouts', value: '5 sessions' },
  { label: 'Active minutes', value: '45 min/day' },
];

const SETTINGS = [
  { label: 'Account & privacy', icon: 'person.fill' as const },
  { label: 'Connected devices', icon: 'heart.fill' as const },
  { label: 'Notifications', icon: 'paperplane.fill' as const },
  { label: 'Units & preferences', icon: 'house.fill' as const },
];

export default function UserScreen() {
  const insets = useSafeAreaInsets();

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
        <Animated.View style={[styles.headerRow, rise(0)]}>
          <Text style={styles.eyebrow}>PROFILE</Text>
          <Pressable hitSlop={10}>
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </Animated.View>

        {/* Identity */}
        <Animated.View style={[styles.identity, rise(6)]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{PROFILE.initials}</Text>
          </View>
          <Text style={styles.name}>{PROFILE.name}</Text>
          <Text style={styles.handle}>{PROFILE.handle}</Text>
        </Animated.View>

        {/* Body stats */}
        <Animated.View style={[styles.budget, rise(10)]}>
          {STATS.map((s, i) => (
            <View key={s.k} style={[styles.budgetCell, i < STATS.length - 1 && styles.budgetDivider]}>
              <Text style={styles.budgetVal}>
                {s.v}
                {s.unit ? <Text style={styles.budgetUnit}> {s.unit}</Text> : null}
              </Text>
              <Text style={styles.budgetKey}>{s.k}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Goals */}
        <Animated.View style={[styles.card, rise(14)]}>
          <Text style={styles.sectionLabel}>GOALS</Text>
          {GOALS.map((g, i) => (
            <View key={g.label} style={[styles.row, i < GOALS.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{g.label}</Text>
              <Text style={styles.rowValue}>{g.value}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Settings */}
        <Animated.View style={[styles.sectionLabelWrap, rise(18)]}>
          <Text style={styles.sectionLabel}>SETTINGS</Text>
        </Animated.View>

        <Animated.View style={rise(22)}>
          {SETTINGS.map((s) => (
            <Pressable
              key={s.label}
              style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}>
              <View style={styles.settingIcon}>
                <IconSymbol name={s.icon} size={18} color={ACCENT} />
              </View>
              <Text style={styles.settingLabel}>{s.label}</Text>
              <IconSymbol name="chevron.right" size={20} color={FAINT} />
            </Pressable>
          ))}
        </Animated.View>

        <Animated.View style={rise(26)}>
          <Pressable style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}>
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </Animated.View>

        <Animated.Text style={[styles.version, rise(30)]}>VeraBite · v1.0.0</Animated.Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  eyebrow: { color: FAINT, fontSize: 11, letterSpacing: 3, fontFamily: Fonts.mono },
  edit: { color: ACCENT, fontSize: 14, fontWeight: '600' },

  identity: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: ACCENT,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: ACCENT,
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  avatarText: { color: ACCENT, fontSize: 34, fontWeight: '800', letterSpacing: 1, fontFamily: Fonts.rounded },
  name: { color: '#fff', fontSize: 24, fontWeight: '700', letterSpacing: -0.4, fontFamily: Fonts.rounded },
  handle: { color: FAINT, fontSize: 13, marginTop: 5, fontFamily: Fonts.mono },

  budget: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 18,
    backgroundColor: SURFACE,
    paddingVertical: 16,
    marginBottom: 26,
  },
  budgetCell: { flex: 1, alignItems: 'center' },
  budgetDivider: { borderRightWidth: 1, borderRightColor: HAIRLINE },
  budgetVal: { color: '#fff', fontSize: 20, fontWeight: '700', fontFamily: Fonts.mono },
  budgetUnit: { color: FAINT, fontSize: 13, fontWeight: '400' },
  budgetKey: { color: FAINT, fontSize: 10, letterSpacing: 2, marginTop: 4 },

  card: { borderWidth: 1, borderColor: HAIRLINE, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 6, marginBottom: 26 },
  sectionLabel: { color: FAINT, fontSize: 11, letterSpacing: 3, fontFamily: Fonts.mono },
  sectionLabelWrap: { marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: HAIRLINE },
  rowLabel: { color: '#fff', fontSize: 15 },
  rowValue: { color: ACCENT, fontSize: 15, fontWeight: '700', fontFamily: Fonts.mono },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
  },
  pressed: { backgroundColor: SURFACE },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: HAIRLINE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingLabel: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '500' },

  signOut: {
    marginTop: 26,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: { color: ACCENT, fontSize: 15, fontWeight: '600' },

  version: { color: FAINT, fontSize: 11, textAlign: 'center', marginTop: 22, fontFamily: Fonts.mono, letterSpacing: 1 },
});

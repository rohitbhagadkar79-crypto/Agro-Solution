import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetDashboard, useListAlerts } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';

type Action = 'scan' | 'nutrients' | 'soil' | 'weather' | 'assistant' | 'crops' | 'reports' | 'alerts';

const actionLabels: Record<Action, { label: string; icon: keyof typeof Feather.glyphMap }> = {
  scan: { label: 'Scan crop', icon: 'camera' },
  nutrients: { label: 'Nutrient eye', icon: 'droplet' },
  soil: { label: 'Soil health', icon: 'activity' },
  weather: { label: 'Weather', icon: 'cloud-rain' },
  assistant: { label: 'Ask Patil AI', icon: 'message-circle' },
  crops: { label: 'My crops', icon: 'sun' },
  reports: { label: 'My reports', icon: 'file-text' },
  alerts: { label: 'Alerts', icon: 'bell' },
};

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const dashboard = useGetDashboard({ query: { queryKey: ['dashboard'] } });
  const alertsQuery = useListAlerts({ query: { queryKey: ['alerts'] } });
  const [active, setActive] = useState<Action | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const data = dashboard.data;
  const visibleAlerts = useMemo(() => alertsQuery.data ?? data?.alerts ?? [], [alertsQuery.data, data?.alerts]);

  const tap = async (action: Action) => {
    await Haptics.selectionAsync();
    setActive(action);
    if (action === 'scan' || action === 'nutrients') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Photo access needed', 'Allow photo access to upload a clear leaf image for a preliminary AI review.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
      if (!result.canceled) setPhotoUri(result.assets[0]?.uri ?? null);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 30 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}><View style={[styles.brandDot, { backgroundColor: colors.accent }]} /><Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>PATIL AGRO SOLUTION</Text></View>
            <Text style={[styles.greeting, { color: colors.foreground }]}>Good morning, {data?.farmerName ?? 'Rohit'}.</Text>
            <Text style={[styles.location, { color: colors.mutedForeground }]}>{data?.location ?? 'Nashik, Maharashtra'} · Kharif season</Text>
          </View>
          <Pressable onPress={() => tap('alerts')} style={[styles.bell, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="bell" size={19} color={colors.foreground} /><View style={[styles.badge, { backgroundColor: colors.accent }]} /></Pressable>
        </View>

        <View style={[styles.weatherCard, { backgroundColor: colors.primary }]}>
          <View style={styles.weatherTop}><View><Text style={styles.weatherKicker}>LOCAL CONDITIONS</Text><Text style={styles.temperature}>{data?.weather.temperature ?? 29}°</Text><Text style={styles.condition}>{data?.weather.condition ?? 'Partly cloudy'}</Text></View><Feather name="cloud" size={42} color={colors.accent} /></View>
          <View style={styles.weatherStats}><Stat label="Humidity" value={`${data?.weather.humidity ?? 68}%`} /><Stat label="Rain chance" value={`${data?.weather.rainProbability ?? 42}%`} /><Stat label="Wind" value={`${data?.weather.windSpeed ?? 14} km/h`} /></View>
        </View>

        <View style={styles.sectionHead}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>What would you like to check?</Text><Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>Tap to begin</Text></View>
        <View style={styles.actionGrid}>
          {(Object.keys(actionLabels) as Action[]).map((key) => <Pressable key={key} onPress={() => tap(key)} style={({ pressed }) => [styles.action, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.78 : 1 }]}><View style={[styles.iconBox, { backgroundColor: key === 'scan' ? colors.accent : colors.secondary }]}><Feather name={actionLabels[key].icon} size={19} color={colors.foreground} /></View><Text style={[styles.actionText, { color: colors.foreground }]}>{actionLabels[key].label}</Text><Feather name="arrow-up-right" size={16} color={colors.mutedForeground} /></Pressable>)}
        </View>

        <View style={styles.sectionHead}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your active crops</Text><Text style={[styles.sectionHint, { color: colors.primary }]}>View all</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropRow}>
          {(data?.activeCrops ?? []).map((crop) => <View key={crop.id} style={[styles.cropCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.cropIcon, { backgroundColor: colors.secondary }]}><Feather name="sun" size={18} color={colors.primary} /></View><Text style={[styles.cropName, { color: colors.foreground }]}>{crop.name}</Text><Text style={[styles.cropMeta, { color: colors.mutedForeground }]}>{crop.variety} · {crop.area}</Text><View style={styles.cropBottom}><Text style={[styles.cropStage, { color: colors.mutedForeground }]}>{crop.stage}</Text><Text style={[styles.cropHealth, { color: crop.health === 'Good' ? colors.primary : colors.destructive }]}>{crop.health}</Text></View></View>)}
        </ScrollView>

        <View style={styles.sectionHead}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Needs your attention</Text><Text style={[styles.sectionHint, { color: colors.primary }]}>{visibleAlerts.length} alerts</Text></View>
        {visibleAlerts.slice(0, 3).map((alert) => <Pressable key={alert.id} onPress={() => tap('alerts')} style={[styles.alert, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.alertIcon, { backgroundColor: alert.severity === 'high' ? '#f6dfdc' : colors.secondary }]}><Feather name={alert.severity === 'high' ? 'alert-triangle' : 'cloud-rain'} size={17} color={alert.severity === 'high' ? colors.destructive : colors.primary} /></View><View style={styles.alertCopy}><Text style={[styles.alertTitle, { color: colors.foreground }]}>{alert.title}</Text><Text style={[styles.alertDescription, { color: colors.mutedForeground }]}>{alert.description}</Text><Text style={[styles.alertTime, { color: colors.mutedForeground }]}>{alert.time}</Text></View></Pressable>)}

        {active && <View style={[styles.actionResult, { backgroundColor: colors.secondary }]}><View style={{ flex: 1 }}><Text style={[styles.resultTitle, { color: colors.foreground }]}>{actionLabels[active].label}</Text><Text style={[styles.resultBody, { color: colors.mutedForeground }]}>{photoUri ? 'Photo selected. The next step will check image quality before giving a possible result.' : active === 'assistant' ? 'Ask about a crop, symptom, soil result, or weather condition in Marathi, Hindi, or English.' : 'This journey is ready. Add your field details to get a clear next step.'}</Text></View><Pressable onPress={() => setActive(null)}><Feather name="x" size={18} color={colors.mutedForeground} /></Pressable></View>}
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <View><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  brandDot: { width: 8, height: 8, borderRadius: 4 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  greeting: { fontSize: 30, fontWeight: '700', letterSpacing: -0.8, marginTop: 12 },
  location: { fontSize: 13, marginTop: 5 },
  bell: { width: 44, height: 44, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 7, height: 7, borderRadius: 4, position: 'absolute', top: 9, right: 9 },
  weatherCard: { borderRadius: 24, padding: 20, marginTop: 5 },
  weatherTop: { flexDirection: 'row', justifyContent: 'space-between' },
  weatherKicker: { color: '#d4e1d8', fontSize: 10, letterSpacing: 1.4, fontWeight: '700' },
  temperature: { color: '#fffdf8', fontSize: 47, fontWeight: '700', marginTop: 6 },
  condition: { color: '#d4e1d8', fontSize: 14 },
  weatherStats: { borderTopColor: '#4d7a65', borderTopWidth: 1, marginTop: 19, paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: '#b9d0bf', fontSize: 11 },
  statValue: { color: '#fffdf8', fontSize: 15, fontWeight: '700', marginTop: 5 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 },
  sectionTitle: { fontSize: 19, fontWeight: '700' },
  sectionHint: { fontSize: 12, fontWeight: '600' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  action: { width: '48.2%', minHeight: 92, borderRadius: 18, borderWidth: 1, padding: 13, justifyContent: 'space-between' },
  iconBox: { width: 33, height: 33, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: 14, fontWeight: '700', marginTop: 10 },
  cropRow: { gap: 11, paddingRight: 20 },
  cropCard: { width: 190, borderRadius: 19, borderWidth: 1, padding: 15 },
  cropIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cropName: { fontSize: 19, fontWeight: '700', marginTop: 15 },
  cropMeta: { fontSize: 12, marginTop: 4 },
  cropBottom: { borderTopWidth: 1, borderTopColor: '#e6e0d3', marginTop: 16, paddingTop: 11, flexDirection: 'row', justifyContent: 'space-between' },
  cropStage: { fontSize: 11 },
  cropHealth: { fontSize: 11, fontWeight: '700' },
  alert: { flexDirection: 'row', borderRadius: 17, borderWidth: 1, padding: 14, gap: 12 },
  alertIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  alertCopy: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '700' },
  alertDescription: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  alertTime: { fontSize: 10, marginTop: 7 },
  actionResult: { flexDirection: 'row', borderRadius: 18, padding: 15, gap: 12, marginTop: 2 },
  resultTitle: { fontSize: 14, fontWeight: '700' },
  resultBody: { fontSize: 12, lineHeight: 17, marginTop: 5 },
});
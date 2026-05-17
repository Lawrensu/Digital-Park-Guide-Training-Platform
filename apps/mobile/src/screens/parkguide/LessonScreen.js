import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { enrolmentsApi } from '../../api/enrolments';
import { syncService } from '../../services/syncService';

const TYPE_CFG = {
	VIDEO:       { icon: 'play',          color: '#15803d', bg: '#dcfce7' },
	TEXT:        { icon: 'document-text', color: '#15803d', bg: '#dcfce7' },
	IMAGE:       { icon: 'image',         color: '#15803d', bg: '#dcfce7' },
	INFOGRAPHIC: { icon: 'image',         color: '#0891b2', bg: '#e0f2fe' },
	QUIZ:        { icon: 'help-circle',   color: '#d97706', bg: '#fef3c7' },
};

function ContentRow({ item, completed, isLast, onPress }) {
	const cfg       = TYPE_CFG[item.type] ?? TYPE_CFG.VIDEO;
	const iconBg    = completed ? '#15803d' : cfg.bg;
	const iconColor = completed ? '#fff'    : cfg.color;

	return (
		<View>
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={onPress}
				style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}
			>
				<View style={{ position: 'relative', marginRight: 14 }}>
					<View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center' }}>
						<Ionicons name={cfg.icon} size={20} color={iconColor} />
					</View>
					<View style={{
						position: 'absolute', bottom: 1, right: 1,
						width: 11, height: 11, borderRadius: 6,
						backgroundColor: '#fff', borderWidth: 1.5,
						borderColor: completed ? '#15803d' : cfg.color,
					}} />
				</View>

				<View style={{ flex: 1 }}>
					<Text numberOfLines={1} style={{ fontFamily: FONTS.label, fontSize: 14, color: '#111827', fontWeight: '600', marginBottom: 4 }}>
						{item.title}
					</Text>
					<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#9ca3af', letterSpacing: 0.3 }}>
						{item.type}
					</Text>
				</View>

				{completed ? (
					<Ionicons name="checkmark-circle-outline" size={22} color="#15803d" />
				) : (
					<Ionicons name="chevron-forward" size={18} color="#d1d5db" />
				)}
			</TouchableOpacity>

			{!isLast && <View style={{ height: 1, backgroundColor: '#f3f4f6', marginLeft: 74 }} />}
		</View>
	);
}

export default function LessonScreen() {
	const navigation    = useNavigation();
	const { isOnline }  = useNetworkStatus();
	const route         = useRoute();
	const { moduleId, moduleTitle } = route.params ?? {};

	const [module,     setModule]     = useState(null);
	const [items,      setItems]      = useState([]);
	const [enrolment,  setEnrolment]  = useState(null);
	const [loading,    setLoading]    = useState(true);
	const [enrolling,  setEnrolling]  = useState(false);

	const load = useCallback(async () => {
		if (!moduleId) return;
		try {
			const [{ module: modData, enrolment: enrolData }, itemsData] = await Promise.all([
				syncService.loadModuleDetail(moduleId),
				syncService.loadContentItems(moduleId),
			]);
			setModule(modData);
			setItems(Array.isArray(itemsData) ? itemsData : []);
			setEnrolment(enrolData);
		} catch {
			// keep empty
		} finally {
			setLoading(false);
		}
	}, [moduleId]);

	useEffect(() => { load(); }, [load]);

	const completedIds = new Set(
		(enrolment?.contentItemProgresses ?? []).map((p) => p.contentItemId)
	);
	const completedCount = completedIds.size;
	const progress       = enrolment?.progressPct ?? 0;
	const isEnrolled     = !!enrolment;

	const handleEnrol = async () => {
		setEnrolling(true);
		try {
			const newEnrolment = await enrolmentsApi.enrol(moduleId);
			setEnrolment(newEnrolment);
		} catch {
			// ignore — show error state if needed
		} finally {
			setEnrolling(false);
		}
	};

	const title = module?.title ?? moduleTitle ?? 'Module';
	const firstItem = items[0];

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingBottom: 24, paddingHorizontal: 20,
			}}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}
				>
					<Ionicons name="arrow-back" size={22} color="#fff" />
					<Text numberOfLines={1} style={{ fontFamily: FONTS.label, fontSize: 16, color: '#fff', flex: 1, fontWeight: '600' }}>
						{title}
					</Text>
				</TouchableOpacity>

				{module?.description ? (
					<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 21, marginBottom: 14 }}>
						{module.description}
					</Text>
				) : null}
			</View>

			{loading ? (
				<ActivityIndicator color="#15803d" style={{ marginTop: 40 }} />
			) : (
				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>

					{isEnrolled && (
						<View style={{ backgroundColor: '#f0fdf4', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#bbf7d0' }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
								<Text style={{ fontFamily: FONTS.title, fontSize: 16, color: '#15803d', fontWeight: '600' }}>Your Progress</Text>
								<Text style={{ fontFamily: FONTS.title, fontSize: 16, color: '#15803d', fontWeight: '600' }}>{progress}%</Text>
							</View>
							<View style={{ height: 8, backgroundColor: '#bbf7d0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
								<View style={{ height: '100%', borderRadius: 4, backgroundColor: '#15803d', width: `${progress}%` }} />
							</View>
							<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#6b7280' }}>
								{completedCount} of {items.length} items completed
							</Text>
						</View>
					)}

					<Text style={{ fontFamily: FONTS.title, fontSize: 20, fontWeight: '500', color: '#111827', marginBottom: 14 }}>
						Course Content
					</Text>

					{!module && isOnline === false && (
							<View style={{ alignItems: 'center', marginTop: 40, paddingHorizontal: 24 }}>
								<Ionicons name="cloud-offline-outline" size={44} color="#d1d5db" />
								<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#9ca3af', marginTop: 12, textAlign: 'center', lineHeight: 20 }}>
									This module hasn't been loaded yet. Open it while connected first.
								</Text>
							</View>
						)}

						{items.length > 0 ? (
						<View style={{
							backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
							shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
							marginBottom: 16,
						}}>
							{items.map((item, i) => (
								<ContentRow
									key={item.id}
									item={item}
									completed={completedIds.has(item.id)}
									isLast={i === items.length - 1}
									onPress={() => {
										if (!isEnrolled) return;
										navigation.navigate('Content', {
											moduleId,
											moduleTitle: title,
											items,
											currentIndex: i,
											enrolment,
										});
									}}
								/>
							))}
						</View>
					) : (
						<View style={{ alignItems: 'center', marginTop: 24 }}>
							<Ionicons name="document-outline" size={44} color="#d1d5db" />
							<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#9ca3af', marginTop: 12 }}>
								No content items yet
							</Text>
						</View>
					)}
				</ScrollView>
			)}

			{!loading && items.length > 0 && (
				<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#15803d', paddingVertical: 18, paddingHorizontal: 20 }}>
					{isEnrolled ? (
						<TouchableOpacity
							onPress={() => navigation.navigate('Content', { moduleId, moduleTitle: title, items, currentIndex: 0, enrolment })}
							style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
						>
							<Ionicons name="play" size={18} color="#fff" />
							<Text style={{ fontFamily: FONTS.button, fontSize: 16, color: '#fff', fontWeight: '700' }}>
								Continue Learning
							</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							onPress={handleEnrol}
							disabled={enrolling}
							style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
						>
							{enrolling ? (
								<ActivityIndicator color="#fff" size="small" />
							) : (
								<>
									<Ionicons name="add-circle-outline" size={18} color="#fff" />
									<Text style={{ fontFamily: FONTS.button, fontSize: 16, color: '#fff', fontWeight: '700' }}>
										Enrol in this Module
									</Text>
								</>
							)}
						</TouchableOpacity>
					)}
				</View>
			)}

		</View>
	);
}

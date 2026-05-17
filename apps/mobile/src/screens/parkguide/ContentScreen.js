import React, { useState, useEffect } from 'react';
import {
	View, Text, ScrollView, TouchableOpacity,
	Image, ActivityIndicator, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Video, ResizeMode } from 'expo-av';
import RenderHtml from 'react-native-render-html';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from '../../services/connectivityService';
import { FONTS } from '../../theme/fonts';
import { contentItemsApi } from '../../api/contentItems';
import { syncService } from '../../services/syncService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function extractYouTubeId(url) {
	if (!url) return null;
	const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
	return match ? match[1] : null;
}


function VideoContent({ item }) {
	const isYouTube = item.videoSource === 'YOUTUBE';
	const videoId   = isYouTube ? extractYouTubeId(item.videoUrl) : null;

	if (isYouTube && videoId) {
		const html = `<html><body style="margin:0;background:#000;"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?playsinline=1" frameborder="0" allowfullscreen style="position:absolute;top:0;left:0;"></iframe></body></html>`;
		return (
			<View style={{ height: 220 }}>
				<WebView
					source={{ html }}
					allowsFullscreenVideo
					style={{ flex: 1, backgroundColor: '#000' }}
				/>
			</View>
		);
	}

	if (item.videoUrl) {
		return (
			<Video
				source={{ uri: item.videoUrl }}
				useNativeControls
				resizeMode={ResizeMode.CONTAIN}
				style={{ width: SCREEN_WIDTH, height: 220, backgroundColor: '#000' }}
			/>
		);
	}

	return (
		<View style={{ height: 220, backgroundColor: '#14532d', alignItems: 'center', justifyContent: 'center' }}>
			<Ionicons name="play-circle-outline" size={64} color="rgba(255,255,255,0.5)" />
			<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
				Video not available
			</Text>
		</View>
	);
}


function TextContent({ item }) {
	const source = { html: item.textContent ?? '<p>No content.</p>' };
	const tagsStyles = {
		p:  { fontFamily: FONTS.body,    fontSize: 16, lineHeight: 26, color: '#374151', marginBottom: 12 },
		h1: { fontFamily: FONTS.title,   fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 12 },
		h2: { fontFamily: FONTS.title,   fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 10 },
		h3: { fontFamily: FONTS.title,   fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8  },
		li: { fontFamily: FONTS.body,    fontSize: 15, lineHeight: 24, color: '#374151' },
	};
	return (
		<View style={{ padding: 20 }}>
			<RenderHtml contentWidth={SCREEN_WIDTH - 40} source={source} tagsStyles={tagsStyles} />
		</View>
	);
}


function ImageContent({ item, moduleId }) {
	const [imageUri, setImageUri] = useState(null);
	const [imgLoading, setImgLoading] = useState(true);

	useEffect(() => {
		if (!item.imageS3Key) { setImgLoading(false); return; }
		contentItemsApi.getImageUrl(moduleId, item.id)
			.then((data) => { setImageUri(data?.url ?? null); })
			.catch(() => {})
			.finally(() => setImgLoading(false));
	}, [item.id, item.imageS3Key, moduleId]);

	if (imgLoading) {
		return <View style={{ height: 240, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#15803d" /></View>;
	}

	if (imageUri) {
		return <Image source={{ uri: imageUri }} style={{ width: SCREEN_WIDTH, height: 280 }} resizeMode="cover" />;
	}

	return (
		<View style={{ height: 240, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
			<Ionicons name="image-outline" size={44} color="#d1d5db" />
			<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#9ca3af', marginTop: 8 }}>Image not available</Text>
		</View>
	);
}


function QuizContent({ item, onTakeQuiz }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
			<View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
				<Ionicons name="help-circle" size={44} color="#d97706" />
			</View>
			<Text style={{ fontFamily: FONTS.title, fontSize: 22, color: '#111827', textAlign: 'center', marginBottom: 10, fontWeight: '600' }}>
				{item.title}
			</Text>
			<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>
				Complete this quiz to continue your progress.
			</Text>
			<View style={{ backgroundColor: '#fef3c7', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10, width: '100%', marginBottom: 24 }}>
				<Ionicons name="information-circle-outline" size={18} color="#d97706" style={{ marginTop: 1 }} />
				<Text style={{ fontFamily: FONTS.body, fontSize: 14, color: '#92400e', flex: 1, lineHeight: 20 }}>
					Make sure you've reviewed all lessons before starting. A passing score earns your certificate.
				</Text>
			</View>
			{item.quizId && (
				<TouchableOpacity
					onPress={onTakeQuiz}
					style={{ backgroundColor: '#15803d', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, flexDirection: 'row', alignItems: 'center', gap: 8 }}
				>
					<Ionicons name="help-circle-outline" size={18} color="#fff" />
					<Text style={{ fontFamily: FONTS.button, fontSize: 16, color: '#fff', fontWeight: '700' }}>Take Quiz</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}


function ProgressDot({ index, current, total }) {
	const isCurrent = index === current;
	const isPast    = index < current;
	const size      = isCurrent ? 10 : 7;
	return (
		<View style={{
			width: size, height: size, borderRadius: size / 2,
			backgroundColor: isCurrent ? '#fff' : isPast ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
			marginHorizontal: 3,
		}} />
	);
}


export default function ContentScreen() {
	const navigation    = useNavigation();
	const { isOnline }  = useNetworkStatus();
	const route         = useRoute();

	const { moduleId, moduleTitle, items = [], currentIndex = 0, enrolment: initialEnrolment } = route.params ?? {};

	const [pageIndex, setPageIndex] = useState(currentIndex);
	const item    = items[pageIndex];
	const isFirst = pageIndex === 0;
	const isLast  = pageIndex === items.length - 1;
	const isQuiz  = item?.type === 'QUIZ';

	useEffect(() => {
		if (!item?.id) return;
		syncService.markProgress(item.id, moduleId).catch(() => {});
	}, [item?.id]);

	const goBack = () => {
		if (isFirst) { navigation.goBack(); } else { setPageIndex(pageIndex - 1); }
	};

	const goNext = () => {
		if (!isLast) setPageIndex(pageIndex + 1);
	};

	if (!item) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ fontFamily: FONTS.body, color: '#6b7280' }}>No content</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>

			<View style={{
				backgroundColor: '#15803d',
				paddingTop: isOnline === false ? 12 : 52, paddingHorizontal: 20, paddingBottom: 18,
			}}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}
				>
					<Ionicons name="arrow-back" size={22} color="#fff" />
					<Text numberOfLines={1} style={{ fontFamily: FONTS.label, fontSize: 14, color: 'rgba(255,255,255,0.85)', flex: 1 }}>
						{moduleTitle}
					</Text>
				</TouchableOpacity>

				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 }}>
					{items.map((_, i) => <ProgressDot key={i} index={i} current={pageIndex} total={items.length} />)}
					<Text style={{ fontFamily: FONTS.label, fontSize: 11, color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>
						{pageIndex + 1} / {items.length}
					</Text>
				</View>

				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
					<View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
						<Text style={{ fontFamily: FONTS.label, fontSize: 12, color: '#fff', fontWeight: '700', letterSpacing: 0.5 }}>
							{item.type}
						</Text>
					</View>
					<Text numberOfLines={1} style={{ fontFamily: FONTS.label, fontSize: 14, color: '#fff', flex: 1, fontWeight: '600' }}>
						{item.title}
					</Text>
				</View>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
				{item.type === 'VIDEO' && <VideoContent item={item} />}
				{item.type === 'TEXT' && <TextContent item={item} />}
				{(item.type === 'IMAGE' || item.type === 'INFOGRAPHIC') && (
					<ImageContent item={item} moduleId={moduleId} />
				)}
				{item.type === 'QUIZ' && (
					<QuizContent
						item={item}
						onTakeQuiz={() => navigation.navigate('Quiz', { quizId: item.quizId, moduleTitle, moduleId })}
					/>
				)}
			</ScrollView>

			<View style={{
				position: 'absolute', bottom: 0, left: 0, right: 0,
				backgroundColor: '#fff', flexDirection: 'row', gap: 10,
				paddingHorizontal: 16, paddingVertical: 14,
				borderTopWidth: 1, borderTopColor: '#f3f4f6',
			}}>
				<TouchableOpacity
					onPress={goBack}
					style={{
						flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
						paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: '#e5e7eb',
					}}
				>
					<Ionicons name="arrow-back" size={16} color="#374151" />
					<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#374151', fontWeight: '600' }}>Back</Text>
				</TouchableOpacity>

				{isQuiz ? (
					<TouchableOpacity
						onPress={() => navigation.navigate('Quiz', { quizId: item.quizId, moduleTitle, moduleId })}
						style={{ flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 14, backgroundColor: '#15803d' }}
					>
						<Ionicons name="help-circle-outline" size={16} color="#fff" />
						<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: '#fff', fontWeight: '700' }}>Take Quiz</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						onPress={goNext}
						disabled={isLast}
						style={{ flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 14, backgroundColor: isLast ? '#e5e7eb' : '#15803d' }}
					>
						<Text style={{ fontFamily: FONTS.label, fontSize: 14, color: isLast ? '#9ca3af' : '#fff', fontWeight: '700' }}>Next</Text>
						<Ionicons name="arrow-forward" size={16} color={isLast ? '#9ca3af' : '#fff'} />
					</TouchableOpacity>
				)}
			</View>

		</View>
	);
}

import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as contentItemsApi from '../../../api/contentItems.js'


const ITEM_TYPE_ICON = {
	VIDEO:       '🎥',
	TEXT:        '📖',
	IMAGE:       '🖼️',
	INFOGRAPHIC: '🖼️',
	QUIZ:        '❓',
}


function extractYoutubeId(url) {
	if (!url) return null
	const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
	return match ? match[1] : null
}


export default function GuideContentViewer() {
	const { id, itemId } = useParams()
	const navigate = useNavigate()

	const { data: item, isLoading, error } = useQuery({
		queryKey: ['content-items', itemId],
		queryFn: async () => {
			const res = await contentItemsApi.getOne(itemId)
			return res.data.data
		},
		enabled: !!itemId,
	})

	if (isLoading) {
		return (
			<div className="flex flex-col lg:flex-row h-screen bg-[#f0f4f1] overflow-hidden">
				<GuideNavbar />
				<main className="flex-1 overflow-y-auto p-8">
					<div className="max-w-3xl mx-auto">
						<p className="text-center py-12 text-[#5a7a6a] font-outfit">Loading content…</p>
					</div>
				</main>
			</div>
		)
	}

	if (error || !item) {
		return (
			<div className="flex flex-col lg:flex-row h-screen bg-[#f0f4f1] overflow-hidden">
				<GuideNavbar />
				<main className="flex-1 overflow-y-auto p-8">
					<div className="max-w-3xl mx-auto">
						<button
							onClick={() => navigate(`/guide/modules/${id}`)}
							className="flex items-center gap-2 text-[#5a7a6a] font-outfit text-sm mb-6 hover:text-[#1a3a2a] transition-colors bg-transparent border-0 cursor-pointer"
						>
							← Back to Module
						</button>
						<p className="text-center py-12 text-red-500 font-outfit">Content not found.</p>
					</div>
				</main>
			</div>
		)
	}

	const renderContent = () => {
		switch (item.type) {

			case 'TEXT':
				return (
					<div className="font-outfit text-[15px] leading-[1.8] text-[#1a3a2a] whitespace-pre-wrap">
						{item.textContent ?? 'No content available.'}
					</div>
				)

			case 'VIDEO': {
				if (item.videoSource === 'YOUTUBE') {
					const ytId = extractYoutubeId(item.videoUrl)
					if (ytId) {
						return (
							<div className="relative w-full" style={{ paddingTop: '56.25%' }}>
								<iframe
									className="absolute inset-0 w-full h-full rounded-lg"
									src={`https://www.youtube.com/embed/${ytId}`}
									title={item.title ?? 'Video'}
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						)
					}
				}
				if (item.videoUrl) {
					return (
						<video controls className="w-full rounded-lg" src={item.videoUrl}>
							Your browser does not support the video tag.
						</video>
					)
				}
				return (
					<div className="text-center py-10 bg-[#f5f5f4] rounded-lg">
						<div className="text-4xl mb-3">🎥</div>
						<p className="font-outfit text-sm text-[#78716c]">Video not yet available.</p>
					</div>
				)
			}

			case 'IMAGE':
			case 'INFOGRAPHIC':
				if (item.imageS3Key) {
					return (
						<div className="text-center py-10 bg-[#f5f5f4] rounded-lg">
							<div className="text-4xl mb-3">🖼️</div>
							<p className="font-outfit text-sm text-[#78716c]">
								Image stored in cloud storage. Available once the storage service is connected.
							</p>
						</div>
					)
				}
				return (
					<div className="text-center py-10 bg-[#f5f5f4] rounded-lg">
						<p className="font-outfit text-sm text-[#78716c]">No image available.</p>
					</div>
				)

			case 'QUIZ':
				if (item.quizId) {
					navigate(`/guide/quiz/${item.quizId}`)
					return null
				}
				return (
					<p className="font-outfit text-sm text-[#5a7a6a]">
						Quiz not linked to this content item.
					</p>
				)

			default:
				return (
					<div className="text-center py-8">
						<div className="text-4xl mb-4">{ITEM_TYPE_ICON[item.type] ?? '📄'}</div>
						<p className="font-outfit text-sm text-[#5a7a6a]">
							{item.textContent ?? 'Content will appear here.'}
						</p>
					</div>
				)
		}
	}

	return (
		<div className="flex flex-col lg:flex-row h-screen bg-[#f0f4f1] overflow-hidden">
			<GuideNavbar />

			<main className="flex-1 overflow-y-auto p-8">
				<div className="max-w-3xl mx-auto">

					<button
						onClick={() => navigate(`/guide/modules/${id}`)}
						className="flex items-center gap-2 text-[#5a7a6a] font-outfit text-sm mb-6 hover:text-[#1a3a2a] transition-colors bg-transparent border-0 cursor-pointer"
					>
						← Back to Module
					</button>

					<div className="bg-white rounded-xl border border-[#d4e4da] p-8">

						<div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8f0eb]">
							<div className="w-10 h-10 bg-[#e8f5ee] rounded-lg flex items-center justify-center text-xl">
								{ITEM_TYPE_ICON[item.type] ?? '📄'}
							</div>
							<div>
								<h1 className="font-outfit text-xl font-semibold text-[#1a3a2a] m-0">{item.title}</h1>
								<span className="font-outfit text-xs text-[#5a7a6a] uppercase tracking-wider">{item.type}</span>
							</div>
						</div>

						{renderContent()}

					</div>

				</div>
			</main>
		</div>
	)
}

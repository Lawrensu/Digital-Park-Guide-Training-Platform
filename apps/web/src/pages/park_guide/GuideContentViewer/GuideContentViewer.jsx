import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as contentItemsApi from '../../../api/contentItems.js'


const ITEM_TYPE_ICON = {
	VIDEO:       '🎥',
	TEXT:        '📖',
	DOCUMENT:    '📄',
	INFOGRAPHIC: '🖼️',
	QUIZ:        '❓',
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
			<div className="flex h-screen bg-[#f0f4f1] overflow-hidden">
				<GuideNavbar />
				<main className="flex-1 overflow-y-auto p-8">
					<div className="max-w-3xl mx-auto">
						<p className="text-center py-12 text-[#5a7a6a] [font-family:var(--font-outfit)]">Loading content…</p>
					</div>
				</main>
			</div>
		)
	}

	if (error || !item) {
		return (
			<div className="flex h-screen bg-[#f0f4f1] overflow-hidden">
				<GuideNavbar />
				<main className="flex-1 overflow-y-auto p-8">
					<div className="max-w-3xl mx-auto">
						<button
							onClick={() => navigate(`/guide/modules/${id}`)}
							className="flex items-center gap-2 text-[#5a7a6a] [font-family:var(--font-outfit)] text-sm mb-6 hover:text-[#1a3a2a] transition-colors bg-transparent border-0 cursor-pointer"
						>
							← Back to Module
						</button>
						<p className="text-center py-12 text-red-500 [font-family:var(--font-outfit)]">Content not found.</p>
					</div>
				</main>
			</div>
		)
	}

	const renderContent = () => {
		switch (item.type) {
			case 'TEXT':
				return (
					<div className="prose max-w-none text-[#1a3a2a] [font-family:var(--font-outfit)] leading-relaxed whitespace-pre-wrap">
						{item.body ?? 'No content available.'}
					</div>
				)
			case 'VIDEO':
				return item.mediaUrl ? (
					<video
						controls
						className="w-full rounded-lg"
						src={item.mediaUrl}
					>
						Your browser does not support the video tag.
					</video>
				) : (
					<p className="text-[#5a7a6a] [font-family:var(--font-outfit)] text-sm">No video available.</p>
				)
			case 'IMAGE':
			case 'INFOGRAPHIC':
				return item.mediaUrl ? (
					<img
						src={item.mediaUrl}
						alt={item.title}
						className="w-full rounded-lg"
					/>
				) : (
					<p className="text-[#5a7a6a] [font-family:var(--font-outfit)] text-sm">No image available.</p>
				)
			case 'QUIZ':
				if (item.quizId) {
					navigate(`/guide/quiz/${item.quizId}`)
					return null
				}
				return <p className="text-[#5a7a6a] [font-family:var(--font-outfit)] text-sm">Quiz not available.</p>
			default:
				return (
					<div className="text-center py-8">
						<div className="text-4xl mb-4">{ITEM_TYPE_ICON[item.type] ?? '📄'}</div>
						<p className="text-[#5a7a6a] [font-family:var(--font-outfit)] text-sm">
							{item.body ?? 'Content will appear here.'}
						</p>
					</div>
				)
		}
	}

	return (
		<div className="flex h-screen bg-[#f0f4f1] overflow-hidden">
			<GuideNavbar />

			<main className="flex-1 overflow-y-auto p-8">
				<div className="max-w-3xl mx-auto">

					<button
						onClick={() => navigate(`/guide/modules/${id}`)}
						className="flex items-center gap-2 text-[#5a7a6a] [font-family:var(--font-outfit)] text-sm mb-6 hover:text-[#1a3a2a] transition-colors bg-transparent border-0 cursor-pointer"
					>
						← Back to Module
					</button>

					<div className="bg-white rounded-xl border border-[#d4e4da] p-8">

						<div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8f0eb]">
							<div className="w-10 h-10 bg-[#e8f5ee] rounded-lg flex items-center justify-center text-xl">
								{ITEM_TYPE_ICON[item.type] ?? '📄'}
							</div>
							<div>
								<h1 className="[font-family:var(--font-outfit)] text-xl font-semibold text-[#1a3a2a] m-0">{item.title}</h1>
								<span className="[font-family:var(--font-outfit)] text-xs text-[#5a7a6a] uppercase tracking-wider">{item.type}</span>
							</div>
						</div>

						{renderContent()}

					</div>

				</div>
			</main>
		</div>
	)
}

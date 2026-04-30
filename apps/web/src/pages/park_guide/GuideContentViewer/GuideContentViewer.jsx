import { useParams, useNavigate } from 'react-router-dom'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'

export default function GuideContentViewer() {
    const { id, itemId } = useParams()
    const navigate = useNavigate()

    return (
        <div className="flex h-screen bg-[#f0f4f1] overflow-hidden">
            <GuideNavbar />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto">

                    <button
                        onClick={() => navigate(`/guide/modules/${id}`)}
                        className="flex items-center gap-2 text-[#5a7a6a] [font-family:var(--font-outfit)] text-sm mb-6 hover:text-[#1a3a2a] transition-colors"
                    >
                        ← Back to Module
                    </button>

                    <div className="bg-white rounded-xl border border-[#d4e4da] p-8 text-center">
                        <div className="w-16 h-16 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📄</span>
                        </div>
                        <h2 className="[font-family:var(--font-outfit)] text-xl font-semibold text-[#1a3a2a] mb-2">
                            Content Viewer
                        </h2>
                        <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a]">
                            Content item {itemId} for module {id} will render here.
                        </p>
                        <p className="[font-family:var(--font-outfit)] text-xs text-[#8aaa96] mt-2">
                            Supports TEXT, IMAGE, VIDEO, INFOGRAPHIC, and QUIZ content types.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    )
}

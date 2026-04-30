import { useParams, useNavigate } from 'react-router-dom'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'

export default function GuideQuizResult() {
    const { quizId } = useParams()
    const navigate = useNavigate()

    return (
        <div className="flex h-screen bg-[#f0f4f1] overflow-hidden">
            <GuideNavbar />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-xl mx-auto">

                    <div className="bg-white rounded-xl border border-[#d4e4da] p-10 text-center mt-8">
                        <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-5">
                            <span className="text-4xl">🏆</span>
                        </div>
                        <h1 className="[font-family:var(--font-outfit)] text-2xl font-bold text-[#1a3a2a] mb-2">
                            Quiz Submitted
                        </h1>
                        <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a] mb-6">
                            Your answers for quiz {quizId} have been submitted.
                        </p>
                        <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a] mb-8">
                            Results and score will appear here once your attempt has been reviewed.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/guide/modules')}
                                className="w-full py-3 bg-[#266841] text-white [font-family:var(--font-outfit)] text-sm font-medium rounded-lg hover:bg-[#1f5435] transition-colors"
                            >
                                Back to Modules
                            </button>
                            <button
                                onClick={() => navigate('/guide/home')}
                                className="w-full py-3 border border-[#d4e4da] text-[#5a7a6a] [font-family:var(--font-outfit)] text-sm rounded-lg hover:bg-[#f0f4f1] transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}

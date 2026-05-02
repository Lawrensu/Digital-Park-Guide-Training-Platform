import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as iotAlertsApi from '../../../api/iotAlerts.js'


const SEVERITY_STYLE = {
	CRITICAL: { border: '#c53030', bg: '#fee2e2', text: '#c53030' },
	WARNING:  { border: '#d4920a', bg: '#fef3c7', text: '#92400e' },
	INFO:     { border: '#2b6cb0', bg: '#dbeafe', text: '#2b6cb0' },
}

const SEVERITY_LABEL = { CRITICAL: 'Critical', WARNING: 'Warning', INFO: 'Info' }

const FLAG_STATUS_BADGE = {
	CONFIRMED:       'bg-[#ecfdf5] text-[#059669]',
	FALSE_DETECTION: 'bg-[#fef2f2] text-[#dc2626]',
	PENDING:         'bg-[#fff7ed] text-[#c2410c]',
}

const FLAG_STATUS_LABEL = {
	CONFIRMED:       'Confirmed',
	FALSE_DETECTION: 'False Detection',
	PENDING:         'Pending',
}


export default function IoTAlertDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const { data: alert, isLoading, error } = useQuery({
		queryKey: ['iot-alerts', id],
		queryFn: async () => {
			const res = await iotAlertsApi.getOne(id)
			return res.data.data
		},
	})

	const flagMutation = useMutation({
		mutationFn: (status) => iotAlertsApi.flag(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['iot-alerts'] })
		},
	})

	const handleEvidenceUrl = async () => {
		try {
			const res = await iotAlertsApi.getEvidenceUrl(id)
			window.open(res.data.data.url, '_blank')
		} catch {
			alert('Could not retrieve evidence URL.')
		}
	}

	if (isLoading) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="[font-family:var(--font-outfit)] text-sm text-[#a8a29e]">Loading…</p>
				</div>
			</div>
		)
	}

	if (error || !alert) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="[font-family:var(--font-outfit)] text-sm text-red-500">Failed to load alert.</p>
				</div>
			</div>
		)
	}

	const style = SEVERITY_STYLE[alert.severity] ?? SEVERITY_STYLE.INFO

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
			<Navbar />

			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex items-center justify-between px-4 sm:px-8 h-16 bg-white border-b border-[#e7e5e4] shrink-0">
					<h1 className="[font-family:var(--font-outfit)] text-[20px] font-semibold text-[#1c1917]">IoT Alerts</h1>
					<div className="flex items-center gap-3">
						<button className="w-9 h-9 rounded-lg bg-[#f5f5f4] border-none flex items-center justify-center text-[#78716c] cursor-pointer transition-colors duration-150 hover:bg-[#e7e5e4]" aria-label="Notifications">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
							</svg>
						</button>
						<div className="w-9 h-9 rounded-full bg-[#2d7d4e] flex items-center justify-center [font-family:var(--font-outfit)] text-xs font-semibold text-white">AM</div>
					</div>
				</header>

				<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

					<div className="flex items-center gap-4 mb-8">
						<button
							onClick={() => navigate('/iot-alerts')}
							className="[font-family:var(--font-outfit)] text-sm text-[#78716c] hover:text-[#1a3a2a] transition-colors"
						>
							← Back
						</button>
						<h2 className="[font-family:var(--font-outfit)] font-semibold text-[28px] text-[#1a3a2a] m-0">{alert.alertType}</h2>
						<span
							className="inline-flex items-center py-1 px-3 rounded-full [font-family:var(--font-outfit)] text-xs font-medium"
							style={{ backgroundColor: style.bg, color: style.text }}
						>
							{SEVERITY_LABEL[alert.severity] ?? alert.severity}
						</span>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

						<div className="lg:col-span-2 space-y-6">

							<div className="bg-white border border-[#f0e9db] rounded-xl p-6">
								<h3 className="[font-family:var(--font-outfit)] font-medium text-[20px] text-[#1a3a2a] mb-6 border-b border-[#f0e9db] pb-3">Alert Details</h3>
								<div className="grid grid-cols-2 gap-6">
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Device</label>
										<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a]">{alert.device?.serialNumber ?? '—'}</p>
									</div>
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Station</label>
										<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a]">{alert.device?.station?.name ?? '—'}</p>
									</div>
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Triggered At</label>
										<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a]">{new Date(alert.triggeredAt).toLocaleString()}</p>
									</div>
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Confidence</label>
										<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a]">{alert.confidenceScore != null ? `${alert.confidenceScore}%` : '—'}</p>
									</div>
									{alert.payload && (
										<div className="flex flex-col gap-1 col-span-2">
											<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Payload</label>
											<pre className="[font-family:var(--font-serif)] text-sm text-[#1a3a2a] whitespace-pre-wrap break-all bg-[#fafaf9] border border-[#f0e9db] rounded-lg p-3">{typeof alert.payload === 'string' ? alert.payload : JSON.stringify(alert.payload, null, 2)}</pre>
										</div>
									)}
								</div>
							</div>

							{alert.evidenceS3Key && (
								<div className="bg-white border border-[#f0e9db] rounded-xl p-6">
									<h3 className="[font-family:var(--font-outfit)] font-medium text-[20px] text-[#1a3a2a] mb-4 border-b border-[#f0e9db] pb-3">Evidence</h3>
									<div className="flex items-center gap-4 bg-[#f9f5ed] p-4 rounded-lg border border-[#f0e9db]">
										<div className="flex-1">
											<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a] font-medium">Captured Evidence</p>
											<p className="[font-family:var(--font-serif)] text-sm text-gray-500">Click View to open the pre-signed URL</p>
										</div>
										<button
											onClick={handleEvidenceUrl}
											className="[font-family:var(--font-outfit)] font-medium text-sm text-[#b35c2a] border border-[#b35c2a] rounded-lg px-4 py-2 bg-transparent cursor-pointer hover:bg-[#fdfbf7] transition-colors"
										>
											View
										</button>
									</div>
								</div>
							)}
						</div>

						<div className="space-y-6">
							<div className="bg-white border border-[#f0e9db] rounded-xl p-6">
								<h3 className="[font-family:var(--font-outfit)] font-medium text-[20px] text-[#1a3a2a] mb-4">Flag Status</h3>

								<div className="mb-4">
									<span className={`inline-flex items-center py-1 px-3 rounded-full [font-family:var(--font-outfit)] text-xs font-medium ${FLAG_STATUS_BADGE[alert.flagStatus] ?? ''}`}>
										{FLAG_STATUS_LABEL[alert.flagStatus] ?? alert.flagStatus}
									</span>
								</div>

								{flagMutation.error && (
									<p className="[font-family:var(--font-outfit)] text-xs text-red-500 mb-3">Action failed. Please try again.</p>
								)}

								<div className="flex flex-col gap-3">
									<button
										onClick={() => flagMutation.mutate('CONFIRMED')}
										disabled={flagMutation.isPending || alert.flagStatus === 'CONFIRMED'}
										className="w-full py-3 bg-[#1a3a2a] text-white border-none rounded-lg [font-family:var(--font-outfit)] font-medium text-sm cursor-pointer transition-colors duration-200 hover:bg-[#132d20] disabled:opacity-50"
									>
										Confirm Detection
									</button>
									<button
										onClick={() => flagMutation.mutate('FALSE_DETECTION')}
										disabled={flagMutation.isPending || alert.flagStatus === 'FALSE_DETECTION'}
										className="w-full py-3 bg-transparent text-[#d32f2f] border border-[#d32f2f] rounded-lg [font-family:var(--font-outfit)] font-medium text-sm cursor-pointer transition-colors duration-200 hover:bg-[#ffebee] disabled:opacity-50"
									>
										Mark False Detection
									</button>
								</div>
							</div>
						</div>

					</div>

				</main>
			</div>
		</div>
	)
}

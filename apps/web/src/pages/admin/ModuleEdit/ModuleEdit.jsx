import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as modulesApi from '../../../api/modules.js'


const STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'ARCHIVED']

const STATUS_BADGE_CLASSES = {
  DRAFT:     'px-3 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#92400e]',
  PUBLISHED: 'px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f5ee] text-[#266841]',
  ARCHIVED:  'px-3 py-1 rounded-full text-xs font-semibold bg-[#f5f5f4] text-[#78716c]',
}

const STATUS_LABEL = {
  DRAFT:     'Draft',
  PUBLISHED: 'Published',
  ARCHIVED:  'Archived',
}


export default function ModuleEditPage() {
  const navigate     = useNavigate()
  const { id }       = useParams()
  const isEditing    = !!id
  const [statusOpen, setStatusOpen] = useState(false)

  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [status,      setStatus]      = useState('DRAFT')
  const [formError,   setFormError]   = useState('')

  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ['modules', id],
    queryFn: async () => {
      const res = await modulesApi.getOne(id)
      return res.data.data
    },
    enabled: isEditing,
  })

  useEffect(() => {
    if (existing) {
      setTitle(existing.title ?? '')
      setDescription(existing.description ?? '')
      setStatus(existing.status ?? 'DRAFT')
    }
  }, [existing])

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { title: title.trim(), description: description.trim(), status }
      return isEditing
        ? modulesApi.update(id, payload)
        : modulesApi.create(payload)
    },
    onSuccess: (res) => {
      const savedId = isEditing ? id : res.data.data?.id
      if (savedId) navigate(`/modules/${savedId}/content`)
      else navigate('/modules')
    },
    onError: (err) => {
      setFormError(err.response?.data?.error?.message ?? 'Failed to save module.')
    },
  })

  const handleSave = () => {
    if (!title.trim()) { setFormError('Module title is required.'); return }
    setFormError('')
    saveMutation.mutate()
  }

  if (isEditing && loadingExisting) {
    return (
      <div className="bg-[#fafaf9] flex min-h-screen">
        <Navbar />
        <div className="flex-1 p-8"><p className="text-center py-12 text-[#78716c]">Loading module…</p></div>
      </div>
    )
  }

  return (
    <div className="bg-[#fafaf9] flex min-h-screen">
      <Navbar />

      <div className="flex-1 flex flex-col">

        <header className="flex items-center justify-between px-8 h-16 bg-white border-b border-[#e7e5e4]">
          <h1 className="text-xl font-semibold text-[#1c1917]">Modules</h1>
        </header>

        <main className="p-8 flex-1">

          <button
            className="text-sm text-[#1f4d35] mb-6 hover:underline bg-transparent border-0 cursor-pointer"
            onClick={() => navigate('/modules')}
          >
            ← Back to Modules
          </button>

          <div className="flex gap-6">

            <div className="bg-white border border-[#e7e5e4] rounded-xl flex-1 p-8" style={{ borderLeft: '4px solid #1f4d35' }}>

              <h2 className="text-2xl font-semibold text-[#1a3a2a]">{isEditing ? 'Edit Module' : 'Create New Module'}</h2>
              <p className="text-sm text-[#78716c] mt-1">
                {isEditing ? 'Update the module details below.' : 'Fill in the details below to create a new training module.'}
              </p>

              <div className="flex flex-col gap-5 mt-6">

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#44403c]">Module Title <span className="text-red-500">*</span></label>
                  <input
                    className="w-full border border-[#e7e5e4] px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#1f4d35]"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter module title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#44403c]">Description</label>
                  <textarea
                    className="w-full border border-[#e7e5e4] px-4 py-2.5 rounded-lg text-sm outline-none resize-none focus:border-[#1f4d35]"
                    rows={5}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter module description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#44403c]">Status</label>
                  <div className="relative w-64">
                    <button
                      className="w-full border border-[#e7e5e4] px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#1f4d35] flex justify-between items-center bg-white"
                      onClick={() => setStatusOpen(!statusOpen)}
                      type="button"
                    >
                      <span className={STATUS_BADGE_CLASSES[status]}>{STATUS_LABEL[status]}</span>
                      <span className="text-[#78716c] text-xs">▼</span>
                    </button>
                    {statusOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e7e5e4] rounded-lg shadow-lg z-10">
                        {STATUS_OPTIONS.map(s => (
                          <button
                            key={s}
                            type="button"
                            className="w-full px-4 py-2 hover:bg-[#f5f5f4] text-left"
                            onClick={() => { setStatus(s); setStatusOpen(false) }}
                          >
                            <span className={STATUS_BADGE_CLASSES[s]}>{STATUS_LABEL[s]}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {formError && <p className="text-sm text-red-500 mt-4">{formError}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 bg-[#1f4d35] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3a2a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveMutation.isPending ? 'Saving…' : (isEditing ? 'Save Changes' : 'Create & Add Content')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/modules')}
                  className="px-6 py-2.5 border border-[#e7e5e4] bg-white text-sm rounded-lg hover:bg-[#f5f5f4]"
                >
                  Cancel
                </button>
              </div>

            </div>

            <div className="w-80 flex flex-col gap-4">

              <div className="bg-white border border-[#e7e5e4] rounded-xl p-6" style={{ borderLeft: '4px solid #d4920a' }}>
                <h3 className="font-semibold text-[#b35c2a] mb-2">🚩 Publishing Note</h3>
                <p className="text-sm text-[#78716c] mt-1">
                  When status changes to <strong>PUBLISHED</strong>, enrolled guides receive a notification.
                </p>
              </div>

              {isEditing && (
                <div className="bg-white border border-[#e7e5e4] rounded-xl p-6" style={{ borderLeft: '4px solid #1f4d35' }}>
                  <h3 className="text-base font-semibold text-[#1a3a2a]">Content Builder</h3>
                  <p className="text-sm text-[#78716c] mt-1">
                    Add text, images, videos and quizzes to this module.
                  </p>
                  <button
                    onClick={() => navigate(`/modules/${id}/content`)}
                    className="px-6 py-2.5 bg-[#1f4d35] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3a2a] w-full mt-4"
                  >
                    Go to Content Builder →
                  </button>
                </div>
              )}

            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

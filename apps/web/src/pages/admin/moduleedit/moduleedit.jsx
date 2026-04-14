import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './moduleedit.css'

const STATUS_STYLES = {
  Draft: 'badge badge-draft',
  Published: 'badge badge-published',
  Archived: 'badge badge-archived',
}

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const FileIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d6d3d1" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

export default function ModuleEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Draft')
  const [duration, setDuration] = useState('')
  const [statusOpen, setStatusOpen] = useState(false)

  return (
    <div className="page flex min-h-screen">
      <Navbar />

      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="topbar">
          <h1 className="title">Modules</h1>

          <div className="search-box">
            <SearchIcon />
            <input placeholder="Search..." />
          </div>

          <div className="flex items-center gap-3">
            <button className="icon-btn">
              <BellIcon />
              <span className="dot" />
            </button>

            <div className="avatar">AM</div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 flex-1">

          <button className="back-btn" onClick={() => navigate('/modules')}>
            ← Back to Modules
          </button>

          <div className="flex gap-6">

            {/* Left */}
            <div className="card card-left-green flex-1 p-8">

              <h2 className="heading">Create New Module</h2>
              <p className="subtext">
                Fill in the details below to create a new training module.
              </p>

              <div className="form-group">

                <div>
                  <label>Module Title</label>
                  <input
                    className="input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter module title"
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    className="textarea"
                    rows={5}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter module description"
                  />
                </div>

                <div className="flex gap-4">

                  {/* Status */}
                  <div className="flex-1">
                    <label>Status</label>

                    <div className="relative">
                      <button
                        className="input flex justify-between"
                        onClick={() => setStatusOpen(!statusOpen)}
                      >
                        <span className={STATUS_STYLES[status]}>
                          {status}
                        </span>
                      </button>

                      {statusOpen && (
                        <div className="dropdown">
                          {['Draft', 'Published', 'Archived'].map(s => (
                            <button
                              key={s}
                              onClick={() => {
                                setStatus(s)
                                setStatusOpen(false)
                              }}
                            >
                              <span className={STATUS_STYLES[s]}>{s}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex-1">
                    <label>Estimated Duration</label>
                    <input
                      className="input"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      placeholder="e.g. 45 minutes"
                    />
                  </div>
                </div>

                {/* Upload */}
                <div>
                  <label>Thumbnail Image</label>
                  <div className="upload-box">
                    <FileIcon />
                    <p>Click to upload thumbnail image</p>
                  </div>
                </div>

              </div>

              <div className="flex gap-3 mt-6">
                <button className="btn-primary" onClick={() => navigate('/modules')}>
                  Save Module
                </button>
                <button className="btn-secondary">Save as Draft</button>
                <button className="btn-secondary">Cancel</button>
              </div>

            </div>

            {/* Right */}
            <div className="w-80 flex flex-col gap-4">

              <div className="card card-left-yellow p-6">
                <h3 className="note-title">🚩 Publishing Note</h3>
                <p className="subtext">
                  When status changes to <strong>PUBLISHED</strong>, users receive notification.
                </p>
              </div>

              <div className="card card-left-green p-6">
                <h3 className="heading-sm">Content Builder</h3>
                <p className="subtext">
                  Add text, images, videos and quizzes after saving.
                </p>
                <button className="btn-primary w-full mt-4">
                  Go to Content Builder →
                </button>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Navbar from '../../../components/Navbar/Navbar'

const INITIAL_STATIONS = [
    { id: 1, name: 'Bako National Park',       guides: 12, created: '2025-01-15' },
    { id: 2, name: 'Mulu National Park',        guides: 8,  created: '2025-01-20' },
    { id: 3, name: 'Kubah National Park',       guides: 5,  created: '2025-02-03' },
    { id: 4, name: 'Gunung Gading NP',          guides: 4,  created: '2025-02-10' },
    { id: 5, name: 'Similajau National Park',   guides: 3,  created: '2025-03-01' },
]

const SETTINGS_TABS = [
    { label: 'Admin Accounts', to: '/settings/admins' },
    { label: 'Stations',       to: '/settings/stations' },
]

export default function SettingsStations() {
    const [stations, setStations]       = useState(INITIAL_STATIONS)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editTarget, setEditTarget]   = useState(null)
    const [newName, setNewName]         = useState('')

    const handleAdd = () => {
        if (!newName.trim()) return
        setStations(prev => [...prev, {
            id:      Date.now(),
            name:    newName.trim(),
            guides:  0,
            created: new Date().toISOString().slice(0, 10),
        }])
        setNewName('')
        setShowAddModal(false)
    }

    const handleEdit = () => {
        if (!newName.trim()) return
        setStations(prev => prev.map(s => s.id === editTarget.id ? { ...s, name: newName.trim() } : s))
        setNewName('')
        setEditTarget(null)
    }

    const handleDelete = (station) => {
        if (station.guides > 0) {
            alert(`Cannot delete "${station.name}" — ${station.guides} guide(s) are currently assigned.`)
            return
        }
        setStations(prev => prev.filter(s => s.id !== station.id))
    }

    const openEdit = (station) => {
        setEditTarget(station)
        setNewName(station.name)
    }

    return (
        <div className="flex h-screen bg-[#f0f4f1] overflow-hidden">
            <Navbar />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">

                    <div className="mb-6">
                        <h1 className="[font-family:var(--font-outfit)] text-[26px] font-bold text-[#1a3a2a]">
                            Settings
                        </h1>
                        <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a] mt-1">
                            Manage admin accounts and park stations.
                        </p>
                    </div>

                    <div className="flex gap-1 mb-6 border-b border-[#d4e4da]">
                        {SETTINGS_TABS.map(tab => (
                            <NavLink
                                key={tab.to}
                                to={tab.to}
                                className={({ isActive }) =>
                                    `px-5 py-2.5 [font-family:var(--font-outfit)] text-sm font-medium border-b-2 transition-colors duration-150 ${
                                        isActive
                                            ? 'border-[#266841] text-[#266841]'
                                            : 'border-transparent text-[#5a7a6a] hover:text-[#1a3a2a]'
                                    }`
                                }
                            >
                                {tab.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="bg-white rounded-xl border border-[#d4e4da] p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="[font-family:var(--font-outfit)] text-[17px] font-semibold text-[#1a3a2a]">
                                    Park Stations
                                </h2>
                                <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a] mt-0.5">
                                    SFC park locations that guides are assigned to.
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowAddModal(true); setNewName('') }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#266841] text-white [font-family:var(--font-outfit)] text-sm font-medium rounded-lg hover:bg-[#1f5435] transition-colors duration-150"
                            >
                                + Add Station
                            </button>
                        </div>

                        <table className="w-full text-sm [font-family:var(--font-outfit)]">
                            <thead>
                                <tr className="text-left text-[#5a7a6a] border-b border-[#e8f0eb]">
                                    <th className="pb-3 font-medium">Station Name</th>
                                    <th className="pb-3 font-medium">Guides Assigned</th>
                                    <th className="pb-3 font-medium">Created</th>
                                    <th className="pb-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stations.map(station => (
                                    <tr key={station.id} className="border-b border-[#f0f4f1] hover:bg-[#f7faf8]">
                                        <td className="py-3.5 font-medium text-[#1a3a2a]">{station.name}</td>
                                        <td className="py-3.5 text-[#3d6b52]">{station.guides}</td>
                                        <td className="py-3.5 text-[#5a7a6a]">{station.created}</td>
                                        <td className="py-3.5 text-right">
                                            <button
                                                onClick={() => openEdit(station)}
                                                className="text-[#266841] hover:underline mr-4 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(station)}
                                                className="text-red-500 hover:underline font-medium disabled:opacity-40"
                                                disabled={station.guides > 0}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {(showAddModal || editTarget) && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="[font-family:var(--font-outfit)] text-[17px] font-semibold text-[#1a3a2a] mb-4">
                            {editTarget ? 'Edit Station' : 'Add Station'}
                        </h3>
                        <input
                            type="text"
                            placeholder="Station name"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className="w-full px-3 py-2.5 border border-[#d4e4da] rounded-lg [font-family:var(--font-outfit)] text-sm focus:outline-none focus:border-[#266841] mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowAddModal(false); setEditTarget(null); setNewName('') }}
                                className="px-4 py-2 [font-family:var(--font-outfit)] text-sm text-[#5a7a6a] border border-[#d4e4da] rounded-lg hover:bg-[#f0f4f1] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editTarget ? handleEdit : handleAdd}
                                className="px-4 py-2 bg-[#266841] text-white [font-family:var(--font-outfit)] text-sm font-medium rounded-lg hover:bg-[#1f5435] transition-colors"
                            >
                                {editTarget ? 'Save Changes' : 'Add Station'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

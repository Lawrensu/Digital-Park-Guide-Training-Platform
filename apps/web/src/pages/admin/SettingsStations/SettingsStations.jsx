import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as stationsApi from '../../../api/stations.js'


const SETTINGS_TABS = [
    { label: 'Admin Accounts', to: '/settings/admins'   },
    { label: 'Stations',       to: '/settings/stations' },
]


export default function SettingsStations() {
    const queryClient = useQueryClient()
    const [showAddModal, setShowAddModal] = useState(false)
    const [editTarget, setEditTarget]     = useState(null)
    const [newName, setNewName]           = useState('')
    const [formError, setFormError]       = useState('')
    const [deleteError, setDeleteError]   = useState('')

    const { data, isLoading, error } = useQuery({
        queryKey: ['stations'],
        queryFn: async () => {
            const res = await stationsApi.getAll()
            return res.data.data
        },
    })

    const stations = data ?? []

    const createMutation = useMutation({
        mutationFn: () => stationsApi.create({ name: newName.trim() }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stations'] })
            setNewName('')
            setFormError('')
            setShowAddModal(false)
        },
        onError: (err) => setFormError(err.response?.data?.error?.message ?? 'Failed to create station.'),
    })

    const updateMutation = useMutation({
        mutationFn: () => stationsApi.update(editTarget.id, { name: newName.trim() }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stations'] })
            setNewName('')
            setFormError('')
            setEditTarget(null)
        },
        onError: (err) => setFormError(err.response?.data?.error?.message ?? 'Failed to update station.'),
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => stationsApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stations'] })
            setDeleteError('')
        },
        onError: (err) => setDeleteError(err.response?.data?.error?.message ?? 'Failed to delete station.'),
    })

    const handleSave = () => {
        if (!newName.trim()) { setFormError('Station name is required.'); return }
        setFormError('')
        editTarget ? updateMutation.mutate() : createMutation.mutate()
    }

    const openEdit = (station) => {
        setEditTarget(station)
        setNewName(station.name)
        setFormError('')
    }

    const closeModal = () => {
        setShowAddModal(false)
        setEditTarget(null)
        setNewName('')
        setFormError('')
    }

    return (
        <div className="flex h-screen bg-[#f0f4f1] overflow-hidden">
            <Navbar />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">

                    <div className="mb-6">
                        <h1 className="[font-family:var(--font-outfit)] text-[26px] font-bold text-[#1a3a2a]">Settings</h1>
                        <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a] mt-1">Manage admin accounts and park stations.</p>
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
                                <h2 className="[font-family:var(--font-outfit)] text-[17px] font-semibold text-[#1a3a2a]">Park Stations</h2>
                                <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a] mt-0.5">SFC park locations that guides are assigned to.</p>
                            </div>
                            <button
                                onClick={() => { setShowAddModal(true); setNewName(''); setFormError('') }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#266841] text-white [font-family:var(--font-outfit)] text-sm font-medium rounded-lg hover:bg-[#1f5435] transition-colors duration-150"
                            >
                                + Add Station
                            </button>
                        </div>

                        {deleteError && <p className="[font-family:var(--font-outfit)] text-xs text-red-500 mb-3">{deleteError}</p>}

                        {isLoading && <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a] py-4 text-center">Loading stations…</p>}
                        {error && <p className="[font-family:var(--font-outfit)] text-sm text-red-500 py-4 text-center">Failed to load stations.</p>}

                        {!isLoading && !error && (
                            <table className="w-full text-sm [font-family:var(--font-outfit)]">
                                <thead>
                                    <tr className="text-left text-[#5a7a6a] border-b border-[#e8f0eb]">
                                        <th className="pb-3 font-medium">Station Name</th>
                                        <th className="pb-3 font-medium">Created</th>
                                        <th className="pb-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stations.map(station => (
                                        <tr key={station.id} className="border-b border-[#f0f4f1] hover:bg-[#f7faf8]">
                                            <td className="py-3.5 font-medium text-[#1a3a2a]">{station.name}</td>
                                            <td className="py-3.5 text-[#5a7a6a]">{new Date(station.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3.5 text-right">
                                                <button
                                                    onClick={() => openEdit(station)}
                                                    className="text-[#266841] hover:underline mr-4 font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteMutation.mutate(station.id)}
                                                    disabled={deleteMutation.isPending}
                                                    className="text-red-500 hover:underline font-medium disabled:opacity-40"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
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
                            className="w-full px-3 py-2.5 border border-[#d4e4da] rounded-lg [font-family:var(--font-outfit)] text-sm focus:outline-none focus:border-[#266841] mb-3"
                        />
                        {formError && <p className="[font-family:var(--font-outfit)] text-xs text-red-500 mb-3">{formError}</p>}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 [font-family:var(--font-outfit)] text-sm text-[#5a7a6a] border border-[#d4e4da] rounded-lg hover:bg-[#f0f4f1] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="px-4 py-2 bg-[#266841] text-white [font-family:var(--font-outfit)] text-sm font-medium rounded-lg hover:bg-[#1f5435] transition-colors disabled:opacity-50"
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

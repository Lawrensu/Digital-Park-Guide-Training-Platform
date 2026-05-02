import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as usersApi from '../../../api/users.js'


const SETTINGS_TABS = [
    { label: 'Admin Accounts', to: '/settings/admins'   },
    { label: 'Stations',       to: '/settings/stations' },
]

const STATUS_BADGE = {
    ACTIVE:   'bg-[#dcfce7] text-[#166534]',
    INACTIVE: 'bg-[#f3f4f6] text-[#6b7280]',
}


export default function SettingPage() {
    const queryClient = useQueryClient()
    const [showModal, setShowModal] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName]   = useState('')
    const [email, setEmail]         = useState('')
    const [formError, setFormError] = useState('')

    const { data, isLoading, error } = useQuery({
        queryKey: ['users', 'admins'],
        queryFn: async () => {
            const res = await usersApi.getAll({ role: 'ADMIN' })
            return res.data.data
        },
    })

    const admins = data ?? []

    const createMutation = useMutation({
        mutationFn: () => usersApi.createAdmin({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'admins'] })
            setFirstName('')
            setLastName('')
            setEmail('')
            setFormError('')
            setShowModal(false)
        },
        onError: (err) => {
            setFormError(err.response?.data?.error?.message ?? 'Failed to create admin.')
        },
    })

    const handleCreate = () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setFormError('All fields are required.')
            return
        }
        setFormError('')
        createMutation.mutate()
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-[#f0f4f1] overflow-hidden">
            <Navbar />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
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
                                <h2 className="[font-family:var(--font-outfit)] text-[17px] font-semibold text-[#1a3a2a]">Admin Accounts</h2>
                                <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a] mt-0.5">Manage who has admin access to the platform.</p>
                            </div>
                            <button
                                onClick={() => { setShowModal(true); setFormError('') }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#266841] text-white [font-family:var(--font-outfit)] text-sm font-medium rounded-lg hover:bg-[#1f5435] transition-colors duration-150"
                            >
                                + Add Admin
                            </button>
                        </div>

                        {isLoading && <p className="[font-family:var(--font-outfit)] text-sm text-[#5a7a6a] py-4 text-center">Loading admins…</p>}
                        {error && <p className="[font-family:var(--font-outfit)] text-sm text-red-500 py-4 text-center">Failed to load admins.</p>}

                        {!isLoading && !error && (
                            <table className="w-full text-sm [font-family:var(--font-outfit)]">
                                <thead>
                                    <tr className="text-left text-[#5a7a6a] border-b border-[#e8f0eb]">
                                        <th className="pb-3 font-medium">Name</th>
                                        <th className="pb-3 font-medium">Email</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map(admin => (
                                        <tr key={admin.id} className="border-b border-[#f0f4f1] hover:bg-[#f7faf8]">
                                            <td className="py-3.5 font-medium text-[#1a3a2a]">{admin.firstName} {admin.lastName}</td>
                                            <td className="py-3.5 text-[#5a7a6a]">{admin.email}</td>
                                            <td className="py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[admin.status] ?? 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                                                    {admin.status === 'ACTIVE' ? 'Active' : admin.status === 'INACTIVE' ? 'Inactive' : admin.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="[font-family:var(--font-outfit)] text-[17px] font-semibold text-[#1a3a2a] mb-4">Add Admin</h3>
                        <div className="flex flex-col gap-3 mb-4">
                            <input
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                className="w-full px-3 py-2.5 border border-[#d4e4da] rounded-lg [font-family:var(--font-outfit)] text-sm focus:outline-none focus:border-[#266841]"
                            />
                            <input
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                className="w-full px-3 py-2.5 border border-[#d4e4da] rounded-lg [font-family:var(--font-outfit)] text-sm focus:outline-none focus:border-[#266841]"
                            />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-3 py-2.5 border border-[#d4e4da] rounded-lg [font-family:var(--font-outfit)] text-sm focus:outline-none focus:border-[#266841]"
                            />
                        </div>
                        {formError && <p className="[font-family:var(--font-outfit)] text-xs text-red-500 mb-3">{formError}</p>}
                        <p className="[font-family:var(--font-outfit)] text-xs text-[#5a7a6a] mb-4">The new admin will receive an activation email to set their password.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowModal(false); setFormError('') }}
                                className="px-4 py-2 [font-family:var(--font-outfit)] text-sm text-[#5a7a6a] border border-[#d4e4da] rounded-lg hover:bg-[#f0f4f1] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={createMutation.isPending}
                                className="px-4 py-2 bg-[#266841] text-white [font-family:var(--font-outfit)] text-sm font-medium rounded-lg hover:bg-[#1f5435] transition-colors disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Sending…' : 'Send Invitation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

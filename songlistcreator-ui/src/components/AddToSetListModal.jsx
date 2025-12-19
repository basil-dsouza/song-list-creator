import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function AddToSetListModal({ songId, onClose }) {
    const [setLists, setSetLists] = useState([])
    const [loading, setLoading] = useState(true)
    const [addingTo, setAddingTo] = useState(null)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        fetchSetLists()
    }, [])

    const fetchSetLists = async () => {
        try {
            const res = await axios.get('/api/setlists')
            setSetLists(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (setListId, setListName) => {
        setAddingTo(setListId)
        setMessage(null)
        try {
            console.log(`[AddToSetListModal] Adding song ${songId} to setlist ${setListId}`)
            await axios.post(`/api/setlists/${setListId}/songs/${songId}`)
            console.log(`[AddToSetListModal] Added song ${songId} to setlist ${setListId}`)
            setMessage({ type: 'success', text: `Added to ${setListName}!` })
            setTimeout(() => {
                onClose()
            }, 1000)
        } catch (error) {
            console.error('[AddToSetListModal] Error adding song:', error)
            setMessage({ type: 'error', text: 'Failed to add song.' })
            setAddingTo(null)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-white/10 rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <h3 className="text-xl font-bold mb-4">Add to Set List</h3>

                {message && (
                    <div className={`mb-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : setLists.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">No set lists found.</p>
                        <Link to="/setlists/new" className="text-indigo-400 hover:text-white">Create a Set List</Link>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {setLists.map(list => (
                            <button
                                key={list.id}
                                disabled={addingTo !== null}
                                onClick={() => handleAdd(list.id, list.name)}
                                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex justify-between items-center group"
                            >
                                <span className="font-medium group-hover:text-indigo-300 transition-colors">{list.name}</span>
                                <span className="text-xs text-gray-500">{list.songIds?.length || 0} songs</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-sm">Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AddToSetListModal

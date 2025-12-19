import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function SetListEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [selectedSongIds, setSelectedSongIds] = useState([])
    const [availableSongs, setAvailableSongs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [id])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch all songs
            const songsResponse = await axios.get('/api/songs')
            setAvailableSongs(songsResponse.data)

            // If editing, fetch setlist details
            if (id) {
                const setListResponse = await axios.get(`/api/setlists/${id}`)
                setName(setListResponse.data.name)
                setSelectedSongIds(setListResponse.data.songIds || [])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const setListData = {
            name,
            songIds: selectedSongIds
        }

        try {
            if (id) {
                await axios.put(`/api/setlists/${id}`, setListData)
            } else {
                await axios.post('/api/setlists', setListData)
            }
            navigate('/setlists')
        } catch (error) {
            console.error('Error saving setlist:', error)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this set list?')) return
        try {
            await axios.delete(`/api/setlists/${id}`)
            navigate('/setlists')
        } catch (error) {
            console.error('Error deleting setlist:', error)
        }
    }

    const toggleSong = (songId) => {
        setSelectedSongIds(prev =>
            prev.includes(songId)
                ? prev.filter(id => id !== songId)
                : [...prev, songId]
        )
    }

    if (loading) return <div className="text-center mt-10">Loading...</div>

    return (
        <div className="max-w-2xl mx-auto glass-panel p-8">
            <h2 className="text-3xl font-bold mb-6">{id ? 'Edit Set List' : 'Create New Set List'}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-300 mb-2">Set List Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2">Select Songs</label>
                    <div className="border border-white/10 rounded-lg max-h-96 overflow-y-auto bg-black/20 p-2">
                        {availableSongs.length === 0 ? (
                            <p className="text-gray-500 text-center p-4">No songs available. Create some songs first!</p>
                        ) : (
                            availableSongs.map(song => (
                                <div
                                    key={song.id}
                                    className={`p-3 rounded-md cursor-pointer mb-1 flex justify-between items-center transition-colors ${selectedSongIds.includes(song.id) ? 'bg-indigo-600/50 border border-indigo-500' : 'hover:bg-white/5'}`}
                                    onClick={() => toggleSong(song.id)}
                                >
                                    <span>{song.title}</span>
                                    {selectedSongIds.includes(song.id) && <span className="text-indigo-300">✓</span>}
                                </div>
                            ))
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{selectedSongIds.length} songs selected</p>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" className="btn-primary flex-1">
                        {id ? 'Update Set List' : 'Create Set List'}
                    </button>

                    {id && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-all"
                        >
                            Delete
                        </button>
                    )}

                    <Link to="/setlists" className="px-6 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-all">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default SetListEditor

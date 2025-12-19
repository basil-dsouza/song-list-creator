import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import SongSelectionList from './SongSelectionList'

function SetListEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [selectedSongs, setSelectedSongs] = useState([]) // Objects: { songId, title, key, transposition, ... }
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [id])

    const fetchData = async () => {
        setLoading(true)
        try {
            // If editing, fetch setlist details with full songs
            if (id) {
                const setListResponse = await axios.get(`/api/setlists/${id}`)
                setName(setListResponse.data.name)

                // Fetch full song details which includes transposition
                const songsResponse = await axios.get(`/api/setlists/${id}/songs`)
                // Map the DTO response to our local structure
                // DTO: { song: {...}, transposition: 0 }
                const mappedSongs = songsResponse.data.map(item => ({
                    ...item.song, // Flatten song properties (id, title, key, etc)
                    songId: item.song.id,
                    transposition: item.transposition
                }))
                setSelectedSongs(mappedSongs)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Map local state to SetListEntry structure expected by backend
        const songsPayload = selectedSongs.map(s => ({
            songId: s.songId || s.id, // Fallback for safety
            transposition: s.transposition || 0
        }))

        const setListData = {
            name,
            songs: songsPayload
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

    const toggleSong = (song) => {
        setSelectedSongs(prev => {
            const exists = prev.find(s => s.songId === song.id || s.id === song.id)
            if (exists) {
                return prev.filter(s => s.songId !== song.id && s.id !== song.id)
            } else {
                // Add new song with default 0 transposition
                return [...prev, { ...song, songId: song.id, transposition: 0 }]
            }
        })
    }

    const updateTransposition = (songId, change) => {
        setSelectedSongs(prev => prev.map(s => {
            if (s.songId === songId || s.id === songId) {
                return { ...s, transposition: (s.transposition || 0) + change }
            }
            return s
        }))
    }

    if (loading) return <div className="text-center mt-10">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto glass-panel p-8 text-left">
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

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column: Selection */}
                    <div>
                        <label className="block text-gray-300 mb-2">Add Songs</label>
                        <div className="border border-white/10 rounded-lg max-h-[500px] overflow-y-auto bg-black/20 p-2">
                            <SongSelectionList
                                mode="select"
                                selectedSongIds={selectedSongs.map(s => s.songId || s.id)}
                                onSongClick={toggleSong}
                            />
                        </div>
                    </div>

                    {/* Right Column: Selected & Transposition */}
                    <div>
                        <label className="block text-gray-300 mb-2">Selected Songs & Keys</label>
                        {selectedSongs.length === 0 ? (
                            <div className="text-gray-500 italic p-4 border border-white/10 rounded-lg bg-black/20 h-[500px] flex items-center justify-center text-center">
                                Select songs from the list to add them here.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar border border-white/10 rounded-lg bg-black/20 p-2">
                                {selectedSongs.map((song, index) => (
                                    <div key={song.songId || song.id} className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center group">
                                        <div className="flex-1">
                                            <span className="font-bold block">{index + 1}. {song.title}</span>
                                            <span className="text-xs text-gray-400">{song.artist} • Original: {song.key}</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-black/40 rounded border border-white/10">
                                                <button
                                                    type="button"
                                                    onClick={() => updateTransposition(song.songId || song.id, -1)}
                                                    className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/10"
                                                >
                                                    -
                                                </button>
                                                <span className={`w-8 text-center text-sm font-mono ${(song.transposition || 0) !== 0 ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}>
                                                    {(song.transposition || 0) > 0 ? '+' : ''}{song.transposition || 0}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateTransposition(song.songId || song.id, 1)}
                                                    className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/10"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => toggleSong(song)}
                                                className="text-gray-500 hover:text-red-400 transition-colors px-2"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2 text-right">{selectedSongs.length} songs selected</p>
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/10">
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

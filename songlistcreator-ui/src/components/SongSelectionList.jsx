import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function SongSelectionList({ mode = 'view', selectedSongIds = [], onSongClick }) {
    const [songs, setSongs] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSongs()
    }, [])

    const fetchSongs = async () => {
        try {
            const response = await axios.get('/api/songs')
            setSongs(response.data)
        } catch (error) {
            console.error('Error fetching songs:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredSongs = songs.filter(song => {
        const query = searchQuery.toLowerCase();
        const matchesTitle = song.title?.toLowerCase().includes(query);
        const matchesTags = song.tags?.some(tag => tag.toLowerCase().includes(query));
        return matchesTitle || matchesTags;
    });

    if (loading) return <div className="text-center py-10">Loading songs...</div>

    return (
        <div className="w-full">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search songs by title or tags..."
                    className="input-field w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredSongs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border border-white/5 rounded-lg">
                        {songs.length === 0 ? 'No songs available.' : 'No songs match your search.'}
                    </div>
                ) : (
                    filteredSongs.map(song => (
                        <div
                            key={song.id}
                            onClick={() => mode === 'select' && onSongClick && onSongClick(song)}
                            className={`
                                group p-4 rounded-lg border transition-all cursor-pointer relative
                                ${mode === 'select'
                                    ? (selectedSongIds.includes(song.id)
                                        ? 'bg-indigo-600/20 border-indigo-500/50 hover:bg-indigo-600/30'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20')
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    {mode === 'view' ? (
                                        <Link to={`/song/${song.id}`} className="block">
                                            <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{song.title}</h3>
                                        </Link>
                                    ) : (
                                        <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{song.title}</h3>
                                    )}
                                    <p className="text-sm text-gray-400">{song.artist || 'Unknown Artist'}</p>

                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {song.key && (
                                            <span className="text-xs bg-black/30 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                                                Key: {song.key}
                                            </span>
                                        )}
                                        {song.tags?.map(tag => (
                                            <span key={tag} className="text-xs bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {mode === 'select' && (
                                    <div className={`
                                        w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                                        ${selectedSongIds.includes(song.id)
                                            ? 'bg-indigo-500 border-indigo-500 text-white'
                                            : 'border-white/30 text-transparent group-hover:border-white/50'
                                        }
                                    `}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default SongSelectionList

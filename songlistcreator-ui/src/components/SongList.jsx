import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function SongList() {
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

    if (loading) return <div className="text-center mt-10">Loading...</div>

    return (
        <div className="text-left max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Your Songs</h2>
                <input
                    type="text"
                    placeholder="Search titles or tags..."
                    className="input-field max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {songs.length === 0 ? (
                <div className="glass-panel text-center py-10">
                    <p className="text-gray-400 mb-4">No songs yet.</p>
                    <Link to="/new" className="btn-primary">Create your first song</Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {filteredSongs.length === 0 ? (
                        <div className="col-span-2 text-center py-10 text-gray-500">
                            No songs match your search.
                        </div>
                    ) : (
                        filteredSongs.map(song => (
                            <Link key={song.id} to={`/song/${song.id}`}>
                                <div className="song-card group">
                                    <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{song.title}</h3>
                                    <p className="text-gray-400">{song.artist || 'Unknown Artist'}</p>
                                    <div className="mt-2 flex gap-2">
                                        {song.tags?.map(tag => (
                                            <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default SongList

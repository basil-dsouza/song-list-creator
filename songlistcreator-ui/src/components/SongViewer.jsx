import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AddToSetListModal from './AddToSetListModal'

function SongViewer() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [song, setSong] = useState(null)
    const [transpose, setTranspose] = useState(0)
    const [transposedLyrics, setTransposedLyrics] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSong(0)
    }, [id])

    const fetchSong = async (semitones) => {
        try {
            // If we already have the song metadata, we might just want to fetch the lyrics transposition?
            // GET /api/songs/{id}/transpose?semitones=X returns the whole song object copy.
            const res = await axios.get(`/api/songs/${id}/transpose?semitones=${semitones}`)
            setSong(res.data)
            setTransposedLyrics(res.data.lyrics)
            setLoading(false)
        } catch (err) {
            console.error(err)
        }
    }

    const handleTranspose = (delta) => {
        const newSteps = transpose + delta
        setTranspose(newSteps)
        fetchSong(newSteps)
    }

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this song?')) {
            await axios.delete(`/api/songs/${id}`)
            navigate('/')
        }
    }

    // Render ChordPro-like display: Chords above text
    // Since our Format is [Chord]Text, we need to parse it for display?
    // Or just display as is?
    // "Display songs with or without chords" -> Requirement.

    // Simple renderer: Replace [Chord] with <span class="chord">Chord</span>
    const renderLyrics = (text) => {
        if (!text) return '';
        // We will preserve newlines
        return text.split('\n').map((line, i) => (
            <div key={i} className="min-h-[1.5em] mb-1 leading-8 relative whitespace-pre-wrap">
                {parseLine(line)}
            </div>
        ))
    }

    const parseLine = (line) => {
        // Regex to find [Chord]
        const parts = line.split(/(\[.*?\])/g);
        return parts.map((part, index) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                const chord = part.slice(1, -1);
                return (
                    <span key={index} className="inline-block relative w-0 overflow-visible -top-4 font-bold text-indigo-400 select-none">
                        {chord}
                    </span>
                )
            }
            return <span key={index}>{part}</span>
        });
    }

    if (loading || !song) return <div>Loading...</div>

    return (
        <div className="max-w-4xl mx-auto text-left relative">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{song.title}</h1>
                    <h2 className="text-xl text-gray-400">{song.artist} — Key: {song.key}</h2>
                    <div className="mt-2 flex gap-2">
                        {song.tags?.map(tag => (
                            <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded-full">{tag}</span>
                        ))}
                        {transpose !== 0 && (
                            <span className="text-xs bg-indigo-900 border border-indigo-500 px-2 py-1 rounded-full text-indigo-200">
                                Transposed {transpose > 0 ? '+' : ''}{transpose}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded transition-colors"
                    >
                        + Add to Set List
                    </button>
                    <Link to={`/edit/${id}`} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Edit</Link>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-900/50 hover:bg-red-900/80 rounded text-red-200">Delete</button>
                </div>
            </div>

            <div className="glass-panel mb-6 flex gap-4 items-center justify-center p-4">
                <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">Transposition</span>
                <button onClick={() => handleTranspose(-1)} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">-</button>
                <span className="w-8 text-center">{transpose}</span>
                <button onClick={() => handleTranspose(1)} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">+</button>
            </div>

            <div className="glass-panel font-mono text-lg whitespace-pre-wrap p-8 bg-black/40">
                {renderLyrics(song.lyrics)}
            </div>

            {showAddModal && <AddToSetListModal songId={song.id} onClose={() => setShowAddModal(false)} />}
        </div>
    )
}

export default SongViewer

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function SetListViewer() {
    const { id } = useParams()
    const [setList, setSetList] = useState(null)
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSetListAndSongs()
    }, [id])

    const fetchSetListAndSongs = async () => {
        try {
            const [setListRes, songsRes] = await Promise.all([
                axios.get(`/api/setlists/${id}`),
                axios.get(`/api/setlists/${id}/songs`)
            ])
            setSetList(setListRes.data)
            setSongs(songsRes.data)
        } catch (error) {
            console.error('Error fetching setlist or songs:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderLyrics = (lyrics) => {
        if (!lyrics) return <p className="text-gray-500 italic">No lyrics provided.</p>;

        return lyrics.split('\n').map((line, i) => {
            // Check if line contains chords in []
            if (line.includes('[')) {
                const parts = line.split(/(\[[^\]]+\])/g);
                return (
                    <div key={i} className="leading-loose mb-1 flex flex-wrap items-baseline">
                        {parts.map((part, j) => {
                            if (part.startsWith('[') && part.endsWith(']')) {
                                const chord = part.slice(1, -1);
                                return (
                                    <span key={j} className="text-indigo-400 font-bold mr-1 relative -top-3 text-sm">
                                        {chord}
                                    </span>
                                );
                            }
                            return <span key={j} className="whitespace-pre-wrap">{part}</span>;
                        })}
                    </div>
                );
            } else if (line.trim().startsWith('Chorus') || line.trim().startsWith('Verse') || line.trim().startsWith('Bridge')) {
                return <h4 key={i} className="text-gray-400 font-bold mt-4 mb-2 uppercase text-xs tracking-wider">{line}</h4>
            }
            return <div key={i} className="min-h-[1.5em]">{line}</div>;
        });
    }

    if (loading) return <div className="text-center mt-10">Loading...</div>
    if (!setList) return <div className="text-center mt-10">Set List not found</div>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 glass-panel p-6 sticky top-4 z-10 backdrop-blur-md bg-black/40">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">{setList.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">{songs.length} songs</p>
                </div>
                <div className="space-x-4">
                    <Link to={`/setlists/${id}/edit`} className="btn-secondary">Edit List</Link>
                    <Link to="/setlists" className="text-gray-400 hover:text-white transition-colors">Back</Link>
                </div>
            </div>

            <div className="space-y-12 pb-20">
                {songs.map((item, index) => {
                    const { song, transposition, transposedLyrics } = item;
                    // Fallback for safety if structure is different
                    const actualSong = song || item;
                    const lyricsToRender = transposedLyrics || actualSong.lyrics;
                    const transVal = transposition || 0;

                    return (
                        <div key={actualSong.id} className="glass-panel p-8 relative">
                            <div className="absolute top-4 right-4 text-gray-500 font-mono text-xl opacity-20">#{index + 1}</div>
                            <div className="border-b border-white/10 pb-4 mb-6">
                                <h3 className="text-2xl font-bold">{actualSong.title}</h3>
                                <p className="text-indigo-300">{actualSong.artist}</p>
                                <div className="flex gap-4 mt-2 text-xs text-gray-400 font-mono items-center">
                                    {actualSong.key && <span>Original Key: {actualSong.key}</span>}
                                    {transVal !== 0 && (
                                        <span className={`px-2 py-0.5 rounded ${transVal > 0 ? 'bg-indigo-900 text-indigo-200' : 'bg-pink-900 text-pink-200'}`}>
                                            Transposed {transVal > 0 ? '+' : ''}{transVal}
                                        </span>
                                    )}
                                    {actualSong.timeSignature && <span>Time: {actualSong.timeSignature}</span>}
                                    {actualSong.rhythm && <span>Rhythm: {actualSong.rhythm}</span>}
                                </div>
                            </div>
                            <div className="font-mono text-lg whitespace-pre-wrap">
                                {renderLyrics(lyricsToRender)}
                            </div>
                        </div>
                    )
                })}

                {songs.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl mb-4">This set list is empty.</p>
                        <Link to={`/setlists/${id}/edit`} className="btn-primary">Add Songs</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SetListViewer

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function SongEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        key: 'C',
        lyrics: '', // [Am]Lyrics...
        tags: []
    })
    const [loading, setLoading] = useState(false)
    const [tagsInput, setTagsInput] = useState('')

    useEffect(() => {
        if (id) {
            fetchSong()
        }
    }, [id])

    const fetchSong = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/songs/${id}`)
            const song = res.data;
            setFormData({
                title: song.title,
                artist: song.artist,
                key: song.key || 'C',
                lyrics: song.lyrics || '',
                tags: song.tags || []
            })
            setTagsInput(song.tags?.join(', ') || '')
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            ...formData,
            tags: tagsInput.split(',').map(t => t.trim()).filter(t => t)
        }

        try {
            console.log(`[SongEditor] Saving song: ${formData.title} (ID: ${id || 'New'})`)
            if (id) {
                await axios.put(`/api/songs/${id}`, payload)
                console.log(`[SongEditor] Updated song ${id}`)
            } else {
                const res = await axios.post('/api/songs', payload)
                console.log(`[SongEditor] Created song ${res.data.id}`)
            }
            navigate('/')
        } catch (err) {
            console.error('[SongEditor] Error saving song:', err)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-2xl mx-auto glass-panel text-left">
            <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Song' : 'New Song'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field"
                        required
                        placeholder="e.g. Amazing Grace"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Artist</label>
                        <input
                            name="artist"
                            value={formData.artist}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. John Newton"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Key</label>
                        <input
                            name="key"
                            value={formData.key}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. C, Am"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="input-field"
                        placeholder="hymn, folk, 4/4"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Lyrics & Chords (ChordPro: [Am]Text)</label>
                    <textarea
                        name="lyrics"
                        value={formData.lyrics}
                        onChange={handleChange}
                        className="input-field font-mono h-64"
                        placeholder={"[C]Amazing grace how [F]sweet the sound\n[C]That saved a wretch like [G]me"}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={() => navigate('/')} className="px-4 py-2 hover:text-white/80">Cancel</button>
                    <button type="submit" className="btn-primary">Save Song</button>
                </div>
            </form>
        </div>
    )
}

export default SongEditor

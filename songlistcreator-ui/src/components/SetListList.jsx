import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function SetListList() {
    const [setLists, setSetLists] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSetLists()
    }, [])

    const fetchSetLists = async () => {
        try {
            const response = await axios.get('/api/setlists')
            setSetLists(response.data)
        } catch (error) {
            console.error('Error fetching setlists:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="text-center mt-10">Loading...</div>

    return (
        <div className="text-left max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Your Set Lists</h2>
                <Link to="/setlists/new" className="btn-primary">Create New Set List</Link>
            </div>

            {setLists.length === 0 ? (
                <div className="glass-panel text-center py-10">
                    <p className="text-gray-400 mb-4">No set lists yet.</p>
                    <Link to="/setlists/new" className="btn-primary">Create your first set list</Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {setLists.map(setList => (
                        <Link key={setList.id} to={`/setlists/${setList.id}`}>
                            <div className="song-card group">
                                <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{setList.name}</h3>
                                <p className="text-gray-400">{setList.songIds?.length || 0} songs</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SetListList

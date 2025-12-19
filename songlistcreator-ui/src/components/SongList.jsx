import { Link } from 'react-router-dom'
import SongSelectionList from './SongSelectionList'

function SongList() {
    return (
        <div className="text-left max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Your Songs</h2>
                <Link to="/new" className="btn-primary">Create New Song</Link>
            </div>

            <SongSelectionList mode="view" />

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <p className="text-gray-500 mb-4">Don't see your song? Add it now.</p>
                <Link to="/new" className="text-indigo-400 hover:text-white transition-colors">Create Metadata-only Song</Link>
            </div>
        </div>
    )
}

export default SongList

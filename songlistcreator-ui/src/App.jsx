import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import SongList from './components/SongList'
import SongEditor from './components/SongEditor'
import SongViewer from './components/SongViewer'
import SetListList from './components/SetListList'
import SetListEditor from './components/SetListEditor'
import SetListViewer from './components/SetListViewer'
import DebugTools from './components/DebugTools'

// Configure Axios base URL
axios.defaults.baseURL = 'http://localhost:8080';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-white">
        <nav className="p-4 flex justify-between items-center glass-panel mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors cursor-default" title="Current User">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="font-bold text-sm">D</span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium leading-none">Default User</p>
                <p className="text-[10px] text-gray-400 leading-none mt-1">Free Tier</p>
              </div>
            </div>
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              SongList Creator
            </Link>
          </div>
          <div className="space-x-4">
            <Link to="/" className="hover:text-indigo-300 transition-colors">Songs</Link>
            <Link to="/setlists" className="hover:text-indigo-300 transition-colors">Set Lists</Link>
            <Link to="/debug" className="hover:text-red-300 transition-colors font-mono text-sm border border-red-500/30 px-2 py-1 rounded bg-red-500/10">Debug</Link>
            <Link to="/new" className="btn-primary">New Song</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<SongList />} />
          <Route path="/new" element={<SongEditor />} />
          <Route path="/edit/:id" element={<SongEditor />} />
          <Route path="/song/:id" element={<SongViewer />} />
          <Route path="/setlists" element={<SetListList />} />
          <Route path="/setlists/new" element={<SetListEditor />} />
          <Route path="/setlists/:id" element={<SetListViewer />} />
          <Route path="/setlists/:id/edit" element={<SetListEditor />} />
          <Route path="/debug" element={<DebugTools />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function DebugTools() {
    const [seeding, setSeeding] = useState(false)
    const [logs, setLogs] = useState([])

    const addLog = (msg) => setLogs(prev => [...prev, msg])

    const sampleSongs = [
        { title: "Shape of You", artist: "Ed Sheeran", key: "C#m", lyrics: "[C#m] The club isn't the best place to find a lover\n[F#m] So the bar is where I go\n[A] Me and my friends at the table doing shots\n[B] Drinking fast and then we talk slow" },
        { title: "Blinding Lights", artist: "The Weeknd", key: "Fm", lyrics: "[Fm] I've been tryna call\n[Cm] I've been on my own for long enough\n[Eb] Maybe you can show me how to love, [Bb] maybe" },
        { title: "Dance Monkey", artist: "Tones and I", key: "F#m", lyrics: "[F#m] They say oh my god I see the way you shine\n[D] Take your hand, my dear, and place them both in mine\n[E] You know you stopped me dead while I was passing by\n[C#m] And now I beg to see you dance just one more time" },
        { title: "Someone You Loved", artist: "Lewis Capaldi", key: "Db", lyrics: "[Db] I'm going under and this time I fear there's no one to\n[Ab] turn to\n[Bbm] This all or nothing way of loving got me sleeping without\n[Gb] you" },
        { title: "Sunflower", artist: "Post Malone", key: "D", lyrics: "[D] Ayy, ayy, ayy, ayy (Ooh)\n[G] Ooh, ooh, ooh, ooh (Ayy)\n[Em] Ayy, ayy\n[G] Ooh, ooh, ooh, ooh" },
        { title: "As It Was", artist: "Harry Styles", key: "A", lyrics: "[A] Holdin' me back\n[D] Gravity's holdin' me back\n[Bm] I want you to hold out the palm of your hand\n[E] Why don't we leave it at that?" },
        { title: "Levitating", artist: "Dua Lipa", key: "Bm", lyrics: "[Bm] If you wanna run away with me, I know a galaxy\n[F#m] And I can take you for a ride\n[Em] I had a premonition that we fell into a rhythm\n[Bm] Where the music don't stop for life" },
        { title: "Stay", artist: "Justin Bieber", key: "C#", lyrics: "[C#] I do the same thing I told you that I never would\n[G#] I told you I'd change, even when I knew I never could\n[A#m] I know that I can't find nobody else as good as you\n[F#] I need you to stay, need you to stay, hey" },
        { title: "Believer", artist: "Imagine Dragons", key: "Bb", lyrics: "[Bb] First things first\n[Gm] I'ma say all the words inside my head\n[Eb] I'm fired up and tired of the way that things have been, oh-ooh\n[F] The way that things have been, oh-ooh" },
        { title: "Perfect", artist: "Ed Sheeran", key: "Ab", lyrics: "[Ab] I found a love for me\n[Fm] Darling, just dive right in and follow my lead\n[Db] Well, I found a girl, beautiful and sweet\n[Eb] Oh, I never knew you were the someone waiting for me" },
        { title: "Bad Guy", artist: "Billie Eilish", key: "Gm", lyrics: "[Gm] White shirt now red, my bloody nose\n[Cm] Sleepin', you're on your tippy toes\n[D] Creepin' around like no one knows\n[Gm] Think you're so criminal" },
        { title: "Happier", artist: "Marshmello", key: "F", lyrics: "[F] Lately, I've been, I've been thinking\n[Dm] I want you to be happier, I want you to be happier" },
        { title: "Shallow", artist: "Lady Gaga", key: "G", lyrics: "[Em] Tell me somethin', girl [D/F#] [G]\n[C] Are you happy in this modern [G] world?\n[Em] Or do you need more? [D/F#] [G]\n[C] Is there somethin' else you're searchin' [G] for?" },
        { title: "Thunder", artist: "Imagine Dragons", key: "C", lyrics: "[C] Just a young gun with a quick fuse\n[C] I was uptight, wanna let loose\n[F] I was dreaming of bigger things\n[Am] And wanna leave my own life behind" },
        { title: "Havana", artist: "Camila Cabello", key: "Gm", lyrics: "[Gm] Havana, ooh na-na (ay)\n[Eb] Half of my heart is in Havana, ooh-na-na (ay, ay)\n[D7] He took me back to East Atlanta, na-na-na" },
        { title: "Senorita", artist: "Shawn Mendes", key: "Am", lyrics: "[Am] I love it when you call me señorita\n[C] I wish I could pretend I didn't need ya\n[F] But every touch is ooh, la-la-la\n[Em] It's true, la-la-la\n[G] Ooh, I should be running\n[Am] Ooh, you keep me coming for ya" },
        { title: "Memories", artist: "Maroon 5", key: "B", lyrics: "[B] Here's to the ones that we got\n[F#] Cheers to the wish you were here, but you're not\n[G#m] 'Cause the drinks bring back all the memories\n[E] Of everything we've been through" },
        { title: "Circles", artist: "Post Malone", key: "C", lyrics: "[C] Seasons change and our love went cold\n[Em] Feed the flame 'cause we can't let go\n[F] Run away, but we're running in circles\n[Fm] Run away, run away" },
        { title: "Adore You", artist: "Harry Styles", key: "Cm", lyrics: "[Cm] Walk in your rainbow paradise (paradise)\n[Bb] Strawberry lipstick state of mind (state of mind)\n[Ab] I get so lost inside your eyes\n[Ab] Would you believe it?" },
        { title: "Watermelon Sugar", artist: "Harry Styles", key: "Dm", lyrics: "[Dm] Tastes like strawberries on a summer evenin'\n[Am] And it sounds just like a song\n[C] I want more berries and that summer feelin'\n[G] It's so wonderful and warm" }
    ];

    const [confirmSeed, setConfirmSeed] = useState(false)

    const seedDatabase = async () => {
        if (!confirmSeed) {
            setConfirmSeed(true)
            return
        }
        setConfirmSeed(false)

        setSeeding(true)
        setLogs([])
        addLog("Starting seeding process...")

        let count = 0;
        for (const songTemplate of sampleSongs) {
            try {
                const songData = {
                    title: songTemplate.title,
                    artist: songTemplate.artist,
                    key: songTemplate.key,
                    lyrics: songTemplate.lyrics,
                    userId: "default-user",
                    tags: ["Pop", "Top 20", "Debug"],
                    timeSignature: "4/4",
                    rhythm: "Standard"
                }

                await axios.post('/api/songs', songData)
                addLog(`✓ Created: ${songData.title} by ${songData.artist}`)
                count++;
            } catch (error) {
                console.error(error)
                addLog(`✗ Failed to create: ${songTemplate.title} - ${error.message}`)
            }
        }

        addLog(`Top 20 Seeding complete! Created ${count} songs.`)
        setSeeding(false)
    }

    const clearDatabase = async () => {
        if (!confirm('WARNING: This functionality is not yet implemented fully on backend (bulk delete).')) return;
        addLog("Clear database not implemented yet.")
    }

    return (
        <div className="max-w-2xl mx-auto glass-panel p-8">
            <h2 className="text-3xl font-bold mb-6 text-red-400">Debug Tools</h2>

            <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold mb-2">Seed Database</h3>
                    <p className="text-gray-400 mb-4">Adds 20 popular pop songs to the database for testing purposes.</p>
                    <button
                        onClick={seedDatabase}
                        disabled={seeding}
                        className={`btn-primary w-full ${seeding ? 'opacity-50 cursor-not-allowed' : ''} ${confirmSeed ? 'bg-red-600 hover:bg-red-700' : ''}`}
                    >
                        {seeding ? 'Seeding...' : confirmSeed ? 'Are you sure? Click again to CONFIRM' : 'Run Top 20 Seeder'}
                    </button>
                    {confirmSeed && <p className="text-center text-xs text-red-400 mt-2">Clicking again will add 20 songs, possibly creating duplicates.</p>}
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold mb-2">Logs</h3>
                    <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-green-400 h-64 overflow-y-auto">
                        {logs.length === 0 ? <span className="text-gray-600">No logs yet...</span> : logs.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Link to="/" className="text-gray-400 hover:text-white">Back to Home</Link>
                </div>
            </div>
        </div>
    )
}

export default DebugTools

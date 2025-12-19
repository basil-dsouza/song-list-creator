# Domain Model

## Core Entities

### User
Represents a user of the system.
- `id`: Unique identifier (String).
- `screenName`: Display name.
- `email`: Contact email.

### Song
Represents a musical song with lyrics and chords.
- `id`: Unique identifier (Long).
- `userId`: ID of the owner.
- `title`: Song title.
- `artist`: Artist/Band name.
- `lyrics`: The content of the song in [Simplified ChordPro Format](LYRICS_FORMAT.md). (`@Unindexed`)
- `tags`: List of keywords for searching.
- `key`: Musical key (e.g., "C", "Am").
- `timeSignature`: e.g., "4/4", "6/8".
- `referenceUrl`: Link to audio/video.
- `genre`, `rhythm`: Metadata.

### SetList
A collection of songs for a performance.
- `id`: Unique identifier (String/Long).
- `userId`: Owner.
- `name`: Name of the set list (e.g., "Sunday Morning").
- `songIds`: Ordered list of Song IDs.

## Logic

### Transposer
Logic to transpose chords within the lyrics.
- Parses chords in square brackets `[Am]`.
- Shifts semitones.
- Handles flats/sharps (basic implementation).

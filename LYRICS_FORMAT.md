# Lyrics Format (Simplified ChordPro)

The system uses a simplified version of the **ChordPro** format.
This allows for interleaving chords within the lyrics text, which makes transposition and display easier.

## Syntax
Chords are placed inside square brackets `[]` immediately before the syllable they correspond to.

### Example
```text
[C]Amazing grace, how [F]sweet the [C]sound
That [C]saved a wretch like [G]me
```

## Chords
- **Major**: `[C]`, `[D]`, `[Eb]`
- **Minor**: `[Am]`, `[Cm]`
- **Sevenths**: `[G7]`, `[Am7]`
- **Slash Chords**: `[C/G]` (C chord with G bass)

## Rules
1. Only chords should be inside `[]`.
2. Directives like `{title: ...}` are **not** supported in the content field (use the metadata fields instead).
3. The server will transpose only the content inside `[]`.

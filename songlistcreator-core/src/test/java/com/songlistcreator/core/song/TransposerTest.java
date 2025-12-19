package com.songlistcreator.core.song;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TransposerTest {

    private Transposer transposer = new Transposer();

    @Test
    public void testTransposeMajorChords() {
        String input = "Hello [C] World [G]";
        // Transpose C (0) -> D (2 semitones)
        // C - C# - D
        String output = transposer.transpose(input, "C", 2);
        assertEquals("Hello [D] World [A]", output);
    }

    @Test
    public void testTransposeMinorsAndSharps() {
        String input = "[Am] [F#m]";
        // Up 1 semitone: Am -> A#m (or Bbm), F#m -> Gm
        String output = transposer.transpose(input, "C", 1);
        // My simple logic preserves sharp/flat preference of the source note
        // A -> A# (Sharp list), F# -> G (Sharp list)
        assertEquals("[A#m] [Gm]", output);
    }

    @Test
    public void testSlashChords() {
        String input = "[C/G]";
        // Up 2 semitones: C->D, G->A
        String output = transposer.transpose(input, "C", 2);
        assertEquals("[D/A]", output);
    }

    @Test
    public void testLyricsUntouched() {
        String input = "Just some words";
        String output = transposer.transpose(input, "C", 5);
        assertEquals("Just some words", output);
    }
}

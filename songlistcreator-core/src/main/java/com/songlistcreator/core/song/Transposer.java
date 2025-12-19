package com.songlistcreator.core.song;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Transposer {

    private static final List<String> CHROMATIC_SHARP = Arrays.asList(
            "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B");
    private static final List<String> CHROMATIC_FLAT = Arrays.asList(
            "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B");

    // Regex to find chords in brackets [Am], [C#m7], [G/B]
    private static final Pattern CHORD_PATTERN = Pattern.compile("\\[(.*?)\\]");

    public String transpose(String lyrics, String fromKey, int semitones) {
        if (semitones == 0)
            return lyrics;

        // Normalize
        int steps = semitones % 12;
        if (steps < 0)
            steps += 12;

        StringBuffer sb = new StringBuffer();
        Matcher matcher = CHORD_PATTERN.matcher(lyrics);

        while (matcher.find()) {
            String chord = matcher.group(1);
            String transposedChord = transposeChord(chord, steps);
            matcher.appendReplacement(sb, "[" + transposedChord + "]");
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private String transposeChord(String chord, int steps) {
        // Handle slash chords: C/G -> transpose C and G separately
        if (chord.contains("/")) {
            String[] parts = chord.split("/");
            if (parts.length == 2) {
                return transposeNote(parts[0], steps) + "/" + transposeNote(parts[1], steps);
            }
        }
        return transposeNote(chord, steps);
    }

    private String transposeNote(String note, int steps) {
        // Simple parsing: Root + Quality
        // Root is first 1 or 2 chars (C, C#, Db)

        String root = "";
        String quality = "";

        if (note.length() > 1 && (note.charAt(1) == '#' || note.charAt(1) == 'b')) {
            root = note.substring(0, 2);
            quality = note.substring(2);
        } else {
            root = note.substring(0, 1);
            if (note.length() > 1) {
                quality = note.substring(1);
            }
        }

        // Find root in scale
        int index = CHROMATIC_SHARP.indexOf(root);
        boolean useSharps = true;

        if (index == -1) {
            index = CHROMATIC_FLAT.indexOf(root);
            useSharps = false;
        }

        if (index == -1) {
            // Unknown chord root, return as is
            return note;
        }

        int newIndex = (index + steps) % 12;

        // Decide whether to output sharp or flat.
        // For simplicity reusing the input preference, but real logic depends on Target
        // Key.
        // Todo: Pass target key to decide.

        String newRoot = useSharps ? CHROMATIC_SHARP.get(newIndex) : CHROMATIC_FLAT.get(newIndex);

        return newRoot + quality;
    }
}

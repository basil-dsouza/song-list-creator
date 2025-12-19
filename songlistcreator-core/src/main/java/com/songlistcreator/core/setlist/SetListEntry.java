package com.songlistcreator.core.setlist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetListEntry {
    private Long songId;
    private int transposition; // Semitones offset (e.g., +2, -1)
}

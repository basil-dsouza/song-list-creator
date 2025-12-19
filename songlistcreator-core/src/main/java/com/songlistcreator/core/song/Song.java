package com.songlistcreator.core.song;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Song {
    private Long id;
    private String userId; // Owner
    private String title;
    private String artist;
    private String lyrics; // ChordPro format
    private String genre;
    private String key;
    private String timeSignature;
    private String rhythm;
    private String referenceUrl;
    private List<String> tags;
    private Date created;
    private Date modified;
}

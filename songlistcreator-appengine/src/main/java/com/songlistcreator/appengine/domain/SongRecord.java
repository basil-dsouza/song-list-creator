package com.songlistcreator.appengine.domain;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import com.google.cloud.spring.data.datastore.core.mapping.Field;
import com.google.cloud.spring.data.datastore.core.mapping.Unindexed;
import com.songlistcreator.core.song.Song;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

@Entity(name = "songs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongRecord {

    @Id
    private Long id;

    @Field(name = "user_id")
    private String userId;

    private String title;
    private String artist;

    @Unindexed
    private String lyrics;

    private String genre;
    private String key;

    @Field(name = "time_signature")
    private String timeSignature;

    private String rhythm;

    @Field(name = "reference_url")
    private String referenceUrl;

    private List<String> tags;

    private Date created;
    private Date modified;

    // Mapper method
    public Song toDomain() {
        return Song.builder()
                .id(this.id)
                .userId(this.userId)
                .title(this.title)
                .artist(this.artist)
                .lyrics(this.lyrics)
                .genre(this.genre)
                .key(this.key)
                .timeSignature(this.timeSignature)
                .rhythm(this.rhythm)
                .referenceUrl(this.referenceUrl)
                .tags(this.tags)
                .created(this.created)
                .modified(this.modified)
                .build();
    }

    public static SongRecord fromDomain(Song song) {
        return SongRecord.builder()
                .id(song.getId())
                .userId(song.getUserId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .lyrics(song.getLyrics())
                .genre(song.getGenre())
                .key(song.getKey())
                .timeSignature(song.getTimeSignature())
                .rhythm(song.getRhythm())
                .referenceUrl(song.getReferenceUrl())
                .tags(song.getTags())
                .created(song.getCreated())
                .modified(song.getModified())
                .build();
    }
}

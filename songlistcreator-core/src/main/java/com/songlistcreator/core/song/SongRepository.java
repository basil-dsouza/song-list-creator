package com.songlistcreator.core.song;

import com.songlistcreator.core.song.Song;
import java.util.List;
import java.util.Optional;

public interface SongRepository {
    Song save(Song song);

    Optional<Song> findById(Long id);

    void deleteById(Long id);

    List<Song> findByUserId(String userId);

    List<Song> findByUserIdAndTitle(String userId, String title);

    List<Song> findByUserIdAndArtist(String userId, String artist);

    List<Song> findByUserIdAndTag(String userId, String tag);
}

package com.songlistcreator.core.song;

import com.songlistcreator.core.song.Song;
import com.songlistcreator.core.song.SongRepository;
import com.songlistcreator.core.song.Transposer;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SongService {

    private final SongRepository songRepository;
    private final Transposer transposer;

    public SongService(SongRepository songRepository, Transposer transposer) {
        this.songRepository = songRepository;
        this.transposer = transposer;
    }

    public Song createSong(Song song, String userId) {
        song.setUserId(userId);
        song.setCreated(new Date());
        song.setModified(new Date());
        Song saved = songRepository.save(song);
        log.info("Created Song [ID={}, Name='{}', User='{}']", saved.getId(), saved.getTitle(), userId);
        return saved;
    }

    public Optional<Song> updateSong(Long id, Song song, String userId) {
        return songRepository.findById(id)
                .filter(existing -> existing.getUserId().equals(userId))
                .map(existing -> {
                    song.setId(id);
                    song.setUserId(userId);
                    song.setCreated(existing.getCreated());
                    song.setModified(new Date());
                    Song saved = songRepository.save(song);
                    log.info("Updated Song [ID={}, Name='{}', User='{}']", saved.getId(), saved.getTitle(), userId);
                    return saved;
                });
    }

    public Optional<Song> getSong(Long id) {
        return songRepository.findById(id);
    }

    public List<Song> listSongs(String userId) {
        return songRepository.findByUserId(userId);
    }

    public List<Song> searchSongs(String userId, String title) {
        return songRepository.findByUserIdAndTitle(userId, title);
    }

    public void deleteSong(Long id) {
        songRepository.deleteById(id);
        log.info("Deleted Song [ID={}]", id);
    }

    public Optional<Song> getTransposedSong(Long id, int semitones) {
        return songRepository.findById(id)
                .map(song -> {
                    if (semitones != 0) {
                        String transposed = transposer.transpose(song.getLyrics(), song.getKey(), semitones);
                        song.setLyrics(transposed);
                        // Note: Ideally we return a DTO or clone, but for V1 modifying domain object
                        // before serialize is acceptable
                    }
                    return song;
                });
    }
}

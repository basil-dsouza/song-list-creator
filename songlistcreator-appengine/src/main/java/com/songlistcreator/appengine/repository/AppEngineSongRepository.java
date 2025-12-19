package com.songlistcreator.appengine.repository;

import com.songlistcreator.appengine.domain.SongRecord;
import com.songlistcreator.core.song.Song;
import com.songlistcreator.core.song.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Profile("gcp")
public class AppEngineSongRepository implements SongRepository {

    private final SongRecordRepository songRecordRepository;

    @Override
    public Song save(Song song) {
        SongRecord entity = SongRecord.fromDomain(song);
        return songRecordRepository.save(entity).toDomain();
    }

    @Override
    public Optional<Song> findById(Long id) {
        return songRecordRepository.findById(id).map(SongRecord::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        songRecordRepository.deleteById(id);
    }

    @Override
    public List<Song> findByUserId(String userId) {
        return songRecordRepository.findByUserId(userId).stream()
                .map(SongRecord::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Song> findByUserIdAndTitle(String userId, String title) {
        // Simple case-sensitive search handled by Datastore repository convention
        return songRecordRepository.findByUserIdAndTitle(userId, title).stream()
                .map(SongRecord::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Song> findByUserIdAndArtist(String userId, String artist) {
        return songRecordRepository.findByUserIdAndArtist(userId, artist).stream()
                .map(SongRecord::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Song> findByUserIdAndTag(String userId, String tag) {
        return songRecordRepository.findByUserIdAndTags(userId, tag).stream()
                .map(SongRecord::toDomain)
                .collect(Collectors.toList());
    }
}

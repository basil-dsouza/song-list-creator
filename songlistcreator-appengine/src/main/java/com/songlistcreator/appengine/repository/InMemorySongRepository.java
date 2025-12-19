package com.songlistcreator.appengine.repository;

import com.songlistcreator.core.song.Song;
import com.songlistcreator.core.song.SongRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
@Profile("local")
public class InMemorySongRepository implements SongRepository {

    private final Map<Long, Song> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public Song save(Song song) {
        if (song.getId() == null) {
            song.setId(idGenerator.getAndIncrement());
        }
        store.put(song.getId(), song);
        return song;
    }

    @Override
    public Optional<Song> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public void deleteById(Long id) {
        store.remove(id);
    }

    @Override
    public List<Song> findByUserId(String userId) {
        return store.values().stream()
                .filter(s -> Objects.equals(s.getUserId(), userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<Song> findByUserIdAndTitle(String userId, String title) {
        return store.values().stream()
                .filter(s -> Objects.equals(s.getUserId(), userId))
                .filter(s -> s.getTitle().toLowerCase().contains(title.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Song> findByUserIdAndArtist(String userId, String artist) {
        return store.values().stream()
                .filter(s -> Objects.equals(s.getUserId(), userId))
                .filter(s -> s.getArtist() != null && s.getArtist().toLowerCase().contains(artist.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Song> findByUserIdAndTag(String userId, String tag) {
        return store.values().stream()
                .filter(s -> Objects.equals(s.getUserId(), userId))
                .filter(s -> s.getTags() != null && s.getTags().contains(tag))
                .collect(Collectors.toList());
    }
}

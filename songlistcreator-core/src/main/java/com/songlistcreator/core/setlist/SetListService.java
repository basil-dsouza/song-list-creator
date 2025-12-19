package com.songlistcreator.core.setlist;

import com.songlistcreator.core.song.SongRepository;
import lombok.RequiredArgsConstructor;
import com.songlistcreator.core.setlist.SetListEntry;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class SetListService {

    private final SetListRepository setListRepository;
    private final SongRepository songRepository; // To verify existence of songs

    public SetList createSetList(SetList setList, String userId) {
        setList.setUserId(userId);
        if (setList.getSongs() == null) {
            setList.setSongs(new ArrayList<>());
        }
        SetList saved = setListRepository.save(setList);
        log.info("Created SetList [ID={}, Name='{}', User='{}']", saved.getId(), saved.getName(), userId);
        return saved;
    }

    public Optional<SetList> getSetList(Long id) {
        return setListRepository.findById(id);
    }

    public List<SetList> listSetLists(String userId) {
        return setListRepository.findByUserId(userId);
    }

    public void deleteSetList(Long id) {
        setListRepository.deleteById(id);
        log.info("Deleted SetList [ID={}]", id);
    }

    public Optional<SetList> updateSetList(Long id, SetList updated, String userId) {
        return setListRepository.findById(id)
                .filter(sl -> sl.getUserId().equals(userId))
                .map(existing -> {
                    existing.setName(updated.getName());
                    // Update songs if provided
                    if (updated.getSongs() != null) {
                        existing.setSongs(updated.getSongs());
                    }
                    SetList saved = setListRepository.save(existing);
                    log.info("Updated SetList [ID={}, Name='{}', User='{}']", saved.getId(), saved.getName(), userId);
                    return saved;
                });
    }

    public Optional<SetList> addSongToSetList(Long setListId, Long songId, String userId) {
        return setListRepository.findById(setListId)
                .filter(sl -> sl.getUserId().equals(userId))
                .map(setList -> {
                    // Verify song exists
                    songRepository.findById(songId).ifPresent(song -> {
                        if (setList.getSongs() == null) {
                            setList.setSongs(new ArrayList<>());
                        }
                        // Check if already in list (optional, but prevents dupes if desired)
                        boolean exists = setList.getSongs().stream()
                                .anyMatch(entry -> entry.getSongId().equals(songId));

                        if (!exists) {
                            setList.getSongs().add(new SetListEntry(songId, 0));
                            log.info("Added Song [SongID={}] to SetList [SetListID={}, User='{}']", songId, setListId,
                                    userId);
                        }
                    });
                    return setListRepository.save(setList);
                });
    }

    public Optional<SetList> removeSongFromSetList(Long setListId, Long songId, String userId) {
        return setListRepository.findById(setListId)
                .filter(sl -> sl.getUserId().equals(userId))
                .map(setList -> {
                    if (setList.getSongs() != null) {
                        boolean removed = setList.getSongs().removeIf(entry -> entry.getSongId().equals(songId));
                        if (removed) {
                            log.info("Removed Song [SongID={}] from SetList [SetListID={}, User='{}']", songId,
                                    setListId, userId);
                        }
                    }
                    return setListRepository.save(setList);
                });
    }

    // New wrapper class for response
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class SetListSongDTO {
        private com.songlistcreator.core.song.Song song;
        private int transposition;
        private String transposedLyrics;
    }

    // Updated to return DTOs
    public List<SetListSongDTO> getSongsInSetList(Long id) {
        com.songlistcreator.core.song.Transposer transposer = new com.songlistcreator.core.song.Transposer();
        return setListRepository.findById(id)
                .map(setList -> {
                    List<SetListSongDTO> result = new ArrayList<>();
                    if (setList.getSongs() != null) {
                        for (SetListEntry entry : setList.getSongs()) {
                            songRepository.findById(entry.getSongId())
                                    .ifPresent(song -> {
                                        String transposed = transposer.transpose(song.getLyrics(), song.getKey(),
                                                entry.getTransposition());
                                        result.add(new SetListSongDTO(song, entry.getTransposition(), transposed));
                                    });
                        }
                    }
                    return result;
                })
                .orElse(new ArrayList<>());
    }
}

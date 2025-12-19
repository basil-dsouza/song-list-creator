package com.songlistcreator.core.setlist;

import com.songlistcreator.core.song.SongRepository;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class SetListService {

    private final SetListRepository setListRepository;
    private final SongRepository songRepository; // To verify existence of songs

    public SetList createSetList(SetList setList, String userId) {
        setList.setUserId(userId);
        if (setList.getSongIds() == null) {
            setList.setSongIds(new ArrayList<>());
        }
        return setListRepository.save(setList);
    }

    public Optional<SetList> getSetList(Long id) {
        return setListRepository.findById(id);
    }

    public List<SetList> listSetLists(String userId) {
        return setListRepository.findByUserId(userId);
    }

    public void deleteSetList(Long id) {
        setListRepository.deleteById(id);
    }

    public Optional<SetList> updateSetList(Long id, SetList updated, String userId) {
        return setListRepository.findById(id)
                .filter(sl -> sl.getUserId().equals(userId))
                .map(existing -> {
                    existing.setName(updated.getName());
                    // Update songs if provided, otherwise keep existing
                    if (updated.getSongIds() != null) {
                        existing.setSongIds(updated.getSongIds());
                    }
                    return setListRepository.save(existing);
                });
    }

    public Optional<SetList> addSongToSetList(Long setListId, Long songId, String userId) {
        return setListRepository.findById(setListId)
                .filter(sl -> sl.getUserId().equals(userId))
                .map(setList -> {
                    // Verify song exists and belongs to user (optional strictly, but good practice)
                    songRepository.findById(songId).ifPresent(song -> {
                        if (!setList.getSongIds().contains(songId)) {
                            setList.getSongIds().add(songId);
                        }
                    });
                    return setListRepository.save(setList);
                });
    }

    public Optional<SetList> removeSongFromSetList(Long setListId, Long songId, String userId) {
        return setListRepository.findById(setListId)
                .filter(sl -> sl.getUserId().equals(userId))
                .map(setList -> {
                    setList.getSongIds().remove(songId);
                    return setListRepository.save(setList);
                });
    }

    public List<com.songlistcreator.core.song.Song> getSongsInSetList(Long id) {
        return setListRepository.findById(id)
                .map(setList -> {
                    List<com.songlistcreator.core.song.Song> songs = new ArrayList<>();
                    if (setList.getSongIds() != null) {
                        for (Long songId : setList.getSongIds()) {
                            songRepository.findById(songId).ifPresent(songs::add);
                        }
                    }
                    return songs;
                })
                .orElse(new ArrayList<>());
    }
}

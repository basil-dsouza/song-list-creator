package com.songlistcreator.appengine.controller;

import com.songlistcreator.core.setlist.SetList;
import com.songlistcreator.core.setlist.SetListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/setlists")
@RequiredArgsConstructor
public class SetListController {

    private final SetListService setListService;
    private static final String DEFAULT_USER_ID = "default-user";

    @PostMapping
    public SetList createSetList(@RequestBody SetList setList) {
        return setListService.createSetList(setList, DEFAULT_USER_ID);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SetList> getSetList(@PathVariable Long id) {
        return setListService.getSetList(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<SetList> listSetLists() {
        return setListService.listSetLists(DEFAULT_USER_ID);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSetList(@PathVariable Long id) {
        setListService.deleteSetList(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SetList> updateSetList(@PathVariable Long id, @RequestBody SetList setList) {
        return setListService.updateSetList(id, setList, DEFAULT_USER_ID)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/songs/{songId}")
    public ResponseEntity<SetList> addSong(@PathVariable Long id, @PathVariable Long songId) {
        return setListService.addSongToSetList(id, songId, DEFAULT_USER_ID)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/songs/{songId}")
    public ResponseEntity<SetList> removeSong(@PathVariable Long id, @PathVariable Long songId) {
        return setListService.removeSongFromSetList(id, songId, DEFAULT_USER_ID)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/songs")
    public List<com.songlistcreator.core.song.Song> getSongsInSetList(@PathVariable Long id) {
        return setListService.getSongsInSetList(id);
    }
}

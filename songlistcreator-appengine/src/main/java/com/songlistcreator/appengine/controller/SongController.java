package com.songlistcreator.appengine.controller;

import com.songlistcreator.core.song.Song;
import com.songlistcreator.core.song.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;
    private static final String DEFAULT_USER_ID = "default-user";

    @PostMapping
    public Song createSong(@RequestBody Song song) {
        return songService.createSong(song, DEFAULT_USER_ID);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Song> updateSong(@PathVariable Long id, @RequestBody Song song) {
        return songService.updateSong(id, song, DEFAULT_USER_ID)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Song> getSong(@PathVariable Long id) {
        return songService.getSong(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Song> listSongs() {
        return songService.listSongs(DEFAULT_USER_ID);
    }

    @GetMapping("/search")
    public List<Song> searchSongs(@RequestParam String title) {
        return songService.searchSongs(DEFAULT_USER_ID, title);
    }

    @GetMapping("/{id}/transpose")
    public ResponseEntity<Song> getTransposedSong(@PathVariable Long id, @RequestParam int semitones) {
        return songService.getTransposedSong(id, semitones)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }
}

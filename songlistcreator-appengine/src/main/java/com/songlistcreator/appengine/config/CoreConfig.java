package com.songlistcreator.appengine.config;

import com.songlistcreator.core.song.SongRepository;
import com.songlistcreator.core.song.SongService;
import com.songlistcreator.core.setlist.SetListService;
import com.songlistcreator.core.song.Transposer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CoreConfig {

    @Bean
    public Transposer transposer() {
        return new Transposer();
    }

    @Bean
    public SongService songService(com.songlistcreator.core.song.SongRepository songRepository, Transposer transposer) {
        return new SongService(songRepository, transposer);
    }

    @Bean
    public SetListService setListService(com.songlistcreator.core.setlist.SetListRepository setListRepository,
            com.songlistcreator.core.song.SongRepository songRepository) {
        return new SetListService(setListRepository, songRepository);
    }
}
